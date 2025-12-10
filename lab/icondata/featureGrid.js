angular.module("ngFeatureGrid", []).directive('featureGrid', function() {
    'use strict';
    var controller = ['$scope', 'featureGridConstant', function($scope, featureGridConstant) {
        var arrIcons = featureGridConstant.icons,
            arrShapes = $scope.arrShapes = featureGridConstant.shapes,
            arrMods = $scope.arrMods = featureGridConstant.mods,
            arrColors = $scope.arrColors = featureGridConstant.colors,
            featureGridObj, recordQueRulesObj = [],
            showRecordEventListner;

        initialize();

        function initialize() {
            $scope.tmp = featureGridObj = {};
            featureGridObj.recordQue = {
                c: [],
                nw: [],
                ne: [],
                sw: [],
                se: []
            };
            showRecordEventListner = $scope.$on("SHOW_RECORDQUE_RULES", function(event, data) {
                recordQueRulesObj = data;
                normalizeRecordQueData(angular.copy(data));
            });
            $scope.$on('$destroy', function() {
                removeAllListners();
            });
        }

        function normalizeRecordQueData(data) {
            angular.forEach(data, function(value, index) {
                featureGridObj.recordQue[value.region].push(value);
            });
        }

        function removeAllListners() {
            showRecordEventListner();
        }

        $scope.fnAddRecordQueRule = function() {
            console.log(featureGridObj.shape, featureGridObj.color);
            var recordQueRuleData = {
                'region': featureGridObj.region,
                'path': featureGridObj.path,
                'value': featureGridObj.value,
                'op': featureGridObj.op,
                'class': [featureGridObj.shape, featureGridObj.color].join(' ')
            }
            featureGridObj.recordQue[featureGridObj.region].push(recordQueRuleData);
            recordQueRulesObj.push(recordQueRuleData);
        };

        $scope.fnSaveRecordQueRules = function() {
            $scope.$emit("SAVE_RECORDQUE_RULES", recordQueRulesObj);
            removeAllListners();
        }

        $scope.removeRecorQueRule = function(kRegion, kRule){
          $scope.tmp.recordQue[kRegion].splice(kRule,1);
          recordQueRulesObj = [];
          angular.forEach(featureGridObj.recordQue, function(recordList) {
            if (recordList.length)
              recordQueRulesObj = recordQueRulesObj.concat(recordList);
          });
        }
    }];


    return {
        restrict: 'E',
        replace: true,
        template: '<div>' +
    '<div layout="row">' +
        '<div>' +
            '<div layout="row">' +
                '<div flex="20"> Quad </div>' +
                '<div flex="15"> Path </div>' +
                '<div flex="20"> Comparison </div>' +
                '<div flex="25"> Value </div>' +
                '<div flex="20"> Preview </div>' +
            '</div>' +
            '<section ng-repeat="(kRegion,arrRules) in tmp.recordQue">' +
                '<div ng-repeat="(kRule,rule) in arrRules" layout="row" flex>' +
                    '<div ng-click="removeRecorQueRule(kRegion, kRule)" flex="5">X</div>' +
                    '<div flex="15"> {{rule.region}} </div>' +
                    '<div flex="15"> {{rule.path}} </div>' +
                    '<div flex="20"> {{rule.op}} </div>' +
                    '<div flex="25"> {{rule.value}} </div>' +
                    '<div class="recordQue mini">' +
                        '<table>' +
                            '<tr>' +
                                '<td id="{{rule.region}}" class="{{rule.class}}"></td>' +
                            '</tr>' +
                        '</table>' +
                    '</div>' +
                '</div>' +
            '</section>' +
            '<div layout="column" id="tmpRule" flex>' +
                '<div layout="row">New Rule</div>' +
                '<div layout="row">' +
                    '<div class="recordQueModel">' +
                        '<table>' +
                            '<tr>' +
                                '<td id="nw" ng-class="{ \'activeRegion\': tmp.region===\'nw\' }" ng-click="tmp.region=\'nw\'">nw</td>' +
                                '<td id="ne" ng-class="{ \'activeRegion\': tmp.region===\'ne\' }" ng-click="tmp.region=\'ne\'">ne</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td id="sw" ng-class="{ \'activeRegion\': tmp.region===\'sw\' }" ng-click="tmp.region=\'sw\'">sw</td>' +
                                '<td id="se" ng-class="{ \'activeRegion\': tmp.region===\'se\' }" ng-click="tmp.region=\'se\'">se</td>' +
                            '</tr>' +
                        '</table>' +
                        '<div class="iconContainer" ng-click="tmp.region=\'c\'">' +
                            '<div class="centerIcon" ng-class="{ \'activeRegion\': tmp.region===\'c\' }">c</div>' +
                        '</div>' +
                    '</div>' +
                    '<md-input-container flex>' +
                        '<label>Path</label>' +
                        '<input ng-model="tmp.path">' +
                    '</md-input-container>' +
                    '<md-input-container flex>' +
                        '<label>Comparison</label>' +
                        '<md-select ng-model="tmp.op">' +
                            '<md-option value="eq"> = </md-option>' +
                            '<md-option value="gt"> &gt; </md-option>' +
                            '<md-option value="lt"> &lt; </md-option>' +
                        '</md-select>' +
                    '</md-input-container>' +
                    '<md-input-container flex>' +
                        '<label>Value</label>' +
                        '<input ng-model="tmp.value">' +
                    '</md-input-container>' +
                '</div>' +
                '<div ng-if="tmp.region===\'nw\' || tmp.region===\'ne\' || tmp.region===\'sw\' || tmp.region===\'se\' ">' +
                    '<div class="recordQue mini"><table><tr><td ng-click="tmp.shape=\'pie cutout\'" id="{{tmp.region}}" class="pie cutout white"></td></tr></table></div>' +
                    '<div class="recordQue mini"><table><tr><td ng-click="tmp.shape=\'drop cutout\'" id="{{tmp.region}}" class="drop cutout white"></td></tr></table></div>' +
                    '<div class="recordQue mini"><table><tr><td ng-click="tmp.shape=\'leaf cutout\'" id="{{tmp.region}}" class="leaf cutout white"></td></tr></table></div>' +
                    '<div class="recordQue mini"><table><tr><td ng-click="tmp.shape=\'square cutout\'" id="{{tmp.region}}" class="square cutout white"></td></tr></table></div>' +
                    '<div class="recordQue mini"><table><tr><td ng-click="tmp.shape=\'pie hollow\'" id="{{tmp.region}}" class="pie hollow white"></td></tr></table></div>' +
                    '<div class="recordQue mini"><table><tr><td ng-click="tmp.shape=\'drop hollow\'" id="{{tmp.region}}" class="drop hollow white"></td></tr></table></div>' +
                    '<div class="recordQue mini"><table><tr><td ng-click="tmp.shape=\'leaf hollow\'" id="{{tmp.region}}" class="leaf hollow white"></td></tr></table></div>' +
                    '<div class="recordQue mini"><table><tr><td ng-click="tmp.shape=\'square hollow \'" id="{{tmp.region}}" class="square hollow white"></td></tr></table></div>' +
                    '<div class="recordQue mini"><table><tr><td ng-click="tmp.shape=\'pie solid\'" id="{{tmp.region}}" class="pie solid white"></td></tr></table></div>' +
                    '<div class="recordQue mini"><table><tr><td ng-click="tmp.shape=\'drop solid\'" id="{{tmp.region}}" class="drop solid white"></td></tr></table></div>' +
                    '<div class="recordQue mini"><table><tr><td ng-click="tmp.shape=\'leaf solid\'" id="{{tmp.region}}" class="leaf solid white"></td></tr></table></div>' +
                    '<div class="recordQue mini"><table><tr><td ng-click="tmp.shape=\'square solid\'" id="{{tmp.region}}" class="square solid white"></td></tr></table></div>' +
                    '<br/>' +
                    '<div ng-repeat="color in arrColors track by $index" class="recordQue mini">' +
                        '<table>' +
                            '<tr>' +
                                '<td ng-click="tmp.color=color" id="{{tmp.region}}" class="{{tmp.shape}}" ng-class="color"></td>' +
                            '</tr>' +
                        '</table>' +
                    '</div>' +
                '</div>' +
                '<div ng-if="tmp.region===\'c\'">' +
                    '<md-input-container flex>' +
                        '<label>Icon</label>' +
                        '<input ng-model="icon">' +
                    '</md-input-container>' +
                '</div>' +
                '<md-button class="md-raised" ng-click="fnAddRecordQueRule()">Add Rule</md-button>' +
                '<md-button class="md-raised" ng-click="fnSaveRecordQueRules()">Apply</md-button>' +
            '</div>' +
        '</div>' +
    '</div>' +
'</div>',
        controller: controller
    };
});
