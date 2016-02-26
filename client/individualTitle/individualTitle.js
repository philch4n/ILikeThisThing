var app = angular.module('ILikeThis.individualTitle', []);

app.controller('IndivController', function($scope, $location, Globals, Factory){
	$scope.work = Globals.returnRecs();
	console.log('moved to indivController', $scope.work)

	$scope.toggleBeans = false;
	$scope.booBeans = false;
	$scope.writeTitle;
	$scope.writeBody;
	$scope.allReviews;
	$scope.userName;

	

	$scope.postReview = function(){
		var obj = {
			title:$scope.writeTitle,
			body:$scope.writeBody,
			username:$scope.userName,
			workTitle:$scope.work.title
		}
		console.log('this is the obj',obj)
		Factory.postReview(obj)
			.then(function(id){
				console.log(id)
				return id;
			})
			.catch(function(err){
				console.log('errororor', err)
			})
	}
	$scope.getReview = function(){
		console.log("get reviews called")
		var obj = {workTitle: $scope.work.title}
		Factory.getReview(obj)
			.then(function(reviews){
				$scope.allReviews = reviews;
				console.log("ALL THE REVIEWS", $scope.allReviews)
			})
			.catch(function(err){
				console.log('this is errereror',err)
			})
	}

	$scope.dosomething = function(){
		//search $scope.results
		
	}

	$scope.getReview();

})
