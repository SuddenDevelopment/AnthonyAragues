//----====|| Angular App ||====----\\
var app = angular.module('featureGridDemo', ['ngMaterial', 'ngRecordQue', 'ngFeatureGrid']).config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default').dark();
});

app.controller('featureGridController', function($scope) {
});
