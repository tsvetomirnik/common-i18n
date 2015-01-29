'use strict'
/* global require */

var gulp = require("gulp");
var path = require("path");
var colors = require("colors");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var watch = require("gulp-watch");
var rename = require("gulp-rename");
var jsoncombine = require("gulp-jsoncombine");
var jsonminify = require("gulp-jsonminify");
var folders = require('gulp-folders');
var fs = require("fs");
var tap = require("gulp-tap");
var _ = require("underscore");

var paths = {
  js: "./src",
  locales: "./src/locales",
  localesJson: "./src/locales_json",
  distJs: "./dist",
  distLocales: "./dist/locales"
};

/**
 * Recursively copies the properties of source into object, failing in case a duplicate is found.
 * 
 * @return dest
 */
function mergeProperties(source, dest, acceptDuplicates) {
  acceptDuplicates = acceptDuplicates ? acceptDuplicates : false;

  for(var key in source) {
    if(typeof(source[key]) == "object") {
      if(typeof(dest[key]) == "undefined") {
        dest[key] = {};
      }

      mergeProperties(source[key], dest[key], acceptDuplicates);
    }
    else if(!acceptDuplicates && typeof(dest[key]) != "undefined") {
      console.log("Property " + key + " is defined more than once");
    }
    else {
      dest[key] = source[key];
    }
  }

  return dest;
}

/**
 * Recursively flattens an object into a single level map, separating each level with a dot.
 * 
 * For instance: 
 *   { a: "val1", b: { b1: { "val2" } } }
 *   
 * will be converted to:
 *   { a: "val1", b.b1: "val2" }
 *   
 * @return A new map with the flattened properties
 */
function flattenKeys(source, prefix) {
  var dest = {};

  for(var key in source) {
    var fullKey = prefix ? prefix + "." + key : key;

    if(typeof(source[key]) == "object") {
      dest = _.extend(dest, flattenKeys(source[key], fullKey));
    }
    else {
      dest[fullKey] = source[key];
    }
  }

  return dest;
}

/**
 * Converts a map to a string formatted as a PO file
 */
function mapToPO(source) {
  var content = "";
  var pairs = _.sortBy(_.pairs(source), function(pair) {
    return pair[0];
  });

  _.each(pairs, function(pair) {
    content += "msgid \"" + pair[0] + "\"" + "\n";
    content += "msgstr \"" + pair[1] + "\"" + "\n";
    content += "\n";
  });

  return content;
}

/**
 * Converts a dotted string to a map
 *
 * For instance:
 *   top.middle.bottom, value
 *
 * will be converted to:
 *   { top: { middle: { bottom: value } } }
 */
function dottedStringToMap(dottedString, value) {
  var map = {}, currMap = map;
  var parts = dottedString.split(".");

  // Create a new map level for each part of the delimited string
  _.each(parts.slice(0, parts.length - 1), function(key) {
    currMap[key] = {};
    currMap = currMap[key];
  });

  currMap[_.last(parts)] = value;
  return map;
}

/**
 * Converts a PO file to a hierarchichal map, using dots to delimit tree levels
 */
function POToMap(contents) {
  var msgId, msgStr;
  var pairs = [];
  var map = {};

  // Convert each triplet of lines msgid-msgstr-blank into a list of pairs
  _.each(contents.split("\n"), function(line) {
    if(line.indexOf("msgid") === 0) {
      msgId = line.substr(7, line.length - 8);
    }
    else if(line.indexOf("msgstr") === 0) {
      msgStr = line.substr(8, line.length - 9);
      
      pairs.push([msgId, msgStr]);
    }
  });

  // Sort the list alphabetically
  pairs = _.sortBy(pairs, function(pair) {
    return pair[0];
  });

  _.each(pairs, function(pair) {
    map = mergeProperties(map, dottedStringToMap(pair[0], pair[1]), true);
  });

  return map;
}

gulp.task("minify-js", function () {
  gulp.src(paths.js + '/**/*.js') // path to your files
    .pipe(concat('i18n.js'))
    .pipe(gulp.dest(paths.distJs))
    .pipe(rename('i18n.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.distJs));
});

gulp.task("build-locales", folders(paths.locales, function(locale) {
    return gulp.src(path.join(paths.locales, locale, "*.po"))
        .pipe(tap(function(file, t) {
          var map = {};
          var key = path.basename(file.path, ".po");

          map[key] = POToMap(String(file.contents));
          file.contents = new Buffer(JSON.stringify(map, null, "  "));
        }))
        .pipe(jsoncombine("translation_" + locale + ".json", function(data) {
          var dict = {};

          for(var file in data) {
            mergeProperties(data[file], dict);
          }

          return new Buffer(JSON.stringify(dict, null, "  "));
        }))
        .pipe(jsonminify())
        .pipe(gulp.dest(paths.distLocales));
}));

gulp.task("json-to-po", folders(paths.locales, function(locale) {
    return gulp.src(path.join(paths.localesJson, locale, "*.json"))
        .pipe(jsoncombine("translation_" + locale + ".json", function(data) {
          var dict = {};
          var destdir = paths.locales + "/" + locale;

          // Merge all the json files into one map
          for(var file in data) {
            mergeProperties(data[file], dict);
          }

          fs.mkdir(destdir, function(err) {
            if(err && err.code !== "EEXIST") { throw err; }
          });

          // Converts each main section of the merged JSON file into a PO file
          for(var key in dict) {
            var contents = mapToPO(flattenKeys(dict[key]));

            fs.writeFile(destdir + "/" + key + ".po", contents);
          }

          return new Buffer("");
        }));
}));

gulp.task("build", ["minify-js", "build-locales"], function() {

});

gulp.task("dev", function() {
  // Build locales on start once
  gulp.run("build");

  // Watch locale files for changes
  gulp.watch([paths.locales + "/**/*.json"], ["build"]);
  console.log("[locales] Watching for changes in locale files".yellow.inverse);
});

gulp.task("default", [], function() {
  console.log("***********************".yellow);
  console.log("  gulp dev: watch for changes in locale files".yellow);
  console.log("  gulp build: build a distribution version".yellow);
  console.log("***********************".yellow);
  return true;
});
