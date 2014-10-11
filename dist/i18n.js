"use strict";
/* global angular */

angular.module("risevision.common.i18n", ["pascalprecht.translate"])
.config(["$translateProvider", function ($translateProvider) {
  $translateProvider.useStaticFilesLoader({
    prefix: "components/rv-common-i18n/dist/locales/translation_",
    suffix: ".json"
  });
  
  $translateProvider
    .determinePreferredLanguage()
    .fallbackLanguage("en");

  if($translateProvider.preferredLanguage().indexOf("en_") === 0){
    $translateProvider.preferredLanguage("en");
  }
}]);
