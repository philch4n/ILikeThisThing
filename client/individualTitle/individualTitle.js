var app = angular.module('ILikeThis.individualTitle', []);

app.controller('IndivController', function($scope, $location, Globals, Factory){
	$scope.work = Globals.returnRecs();
	console.log('moved to indivController', $scope.work)

	$scope.toggleBeans = false;
	$scope.booBeans = false;
	$scope.writeTitle;
	$scope.writeBody;
	$scope.allReviews;

	

	$scope.postReview = function(){

	}
	$scope.getReview = function(){
		//request will return array of object rows
	}

	$scope.dosomething = function(){
		//search $scope.results
		
	}

	$scope.getReview();

})
