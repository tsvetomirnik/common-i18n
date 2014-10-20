"use strict";
/* global angular */

angular.module("risevision.common.i18n", ["pascalprecht.translate", "risevision.common.i18n.config"])
.config(["$translateProvider", "LOCALES_PREFIX", "LOCALES_SUFIX", function ($translateProvider, LOCALES_PREFIX, LOCALES_SUFIX) {
  $translateProvider.useStaticFilesLoader({
    prefix: LOCALES_PREFIX,
    suffix: LOCALES_SUFIX
  });
  
  $translateProvider
    .determinePreferredLanguage()
    .fallbackLanguage("en");

  if($translateProvider.preferredLanguage().indexOf("en_") === 0){
    $translateProvider.preferredLanguage("en");
  }
}]);
