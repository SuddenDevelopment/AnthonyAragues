angular.module("ngRecordQue", []).directive('recordQue',function(){
	'use strict';
	return {
		 restrict:'E'
		,replace: true
		,transclude: false 
		,scope:{ d:'=' }
		,template: '<div class="recordQue"><table><tr><td id="nw" class="{{d.nw}}"></td><td id="ne" class="{{d.ne}}"></td></tr><tr><td id="sw" class="{{d.sw}}"></td><td id="se" class="{{d.se}}"></td></tr></table><div class="iconContainer"><i ng-if="d.center!==false" class="fa fa-lg centerIcon {{d.c}}"></i></div></div>'
		,controller:function($scope){
			if(typeof $scope.d !== 'undefined'){
				//add a little flexibility can define classes as space separated or an array, becasue arrays are often easier to work with
				if($scope.d.hasOwnProperty('nw') && $scope.d.nw.constructor === Array){ $scope.d.nw=$scope.d.nw.join(' '); }
				if($scope.d.hasOwnProperty('ne') && $scope.d.ne.constructor === Array){ $scope.d.ne=$scope.d.ne.join(' '); }
				if($scope.d.hasOwnProperty('sw') && $scope.d.sw.constructor === Array){ $scope.d.sw=$scope.d.sw.join(' '); }
				if($scope.d.hasOwnProperty('se') && $scope.d.se.constructor === Array){ $scope.d.se=$scope.d.se.join(' '); }
				if($scope.d.hasOwnProperty('c') && $scope.d.c.constructor === Array){ $scope.d.se=$scope.d.c.join(' '); }
				if($scope.d.c===''){$scope.d.c=false;}
			}
		}
	};
});