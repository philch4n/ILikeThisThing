var app = angular.module('ILikeThis.individualTitle', []);

app.controller('IndivController', function($scope, $location, Globals, Factory){
	$scope.work = Globals.returnIndiv()
	console.log('moved to indivController')

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

	$scope.getReview();
})