

var app = angular.module('ILikeThis.homepage', []);

app.controller('RequestController', function($scope, $rootScope, $location, Factory, Globals) {

//different types to populate the dropdown menu
$scope.clicked = false;
//create an empty object to store form data
$scope.userInput = {
  title: '',
  type: 'Books'
};

$rootScope.results = {};


$scope.submitForm = function() {

  Factory.submitForm($scope.userInput)
    .then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      if (!!response.data.database) {
        response.data = [response.data];
      };

      console.log("book api info", response)
      // $scope.results = response.data;
      // console.log('=====', $scope.results.authors.split(", "))


      $scope.results = response.data.map(function(item){
        var authorArray = item.authors.join(', ')
        return {title: item.title,
                author: authorArray,
                publishedDate: item.publishedDate,
                thumbnail: item.imageLinks.smallThumbnail,
                type: item.type,
                description: item.description,
                publisher: item.publisher
              }
      })

      $rootScope.results = $scope.results;

    })
  };

 $scope.alreadyExists = function(title) {
  Globals.storeTitle(title);
  //now reroute to madlibs
  $scope.clicked = true;
 }


$scope.addToDb = function(apiResp) {
  console.log('Inside addTodb')

  Factory.addToDatabase(apiResp)
    .then(function(res){
      console.log('database response', res)
      //now show button to reroute to madlibs
      Globals.storeTitle(res.title)
      $scope.clicked = true;

    })
 };

 $scope.signup = function(username, password){
  $scope.user.username = username;
  $scope.user.password = password;
   Factory.signup($scope.user)
     .then(function successCallback(response){
        console.log('RESPONSE AFTER SIGNUP ============', response)
     })
     .catch(function(err){
      console.log('ERROR:', err)
     })

 };

  $scope.signin = function(username, password){
  $scope.user.username = username;
  $scope.user.password = password;
   Factory.signin($scope.user)
     .then(function successCallback(response){
        console.log('RESPONSE AFTER SIGNIN ============', response)
     })
     .catch(function(err){
      console.log('ERROR:', err)
     })

 };




});
