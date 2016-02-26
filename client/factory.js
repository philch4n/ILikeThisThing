var factories = angular.module('ILikeThis.MyFactories', [])


factories.factory('Factory', function ($http) {

  var submitForm = function(work) {
    return $http({
      method: 'POST',
      url: '/api/searchworks',
      data: work, //forms user object
    })
  };

  // var signin = function(userObj){
  //   return $http({
  //     method: "POST",
  //     url: '/api/signin',
  //     data: userObj
  //   })
  //   .then(function(resp){
  //     console.log('signin RESPONSE =======', resp)
  //   })
  // };

  // var signup = function(userObj){
  //   return $http({
  //     method: "POST",
  //     url: '/api/signup',
  //     data: userObj
  //   })
  //   .then(function(resp){
  //     console.log('signUP RESPONSE =======', resp)
  //   })
  // };

  var postReview = function(reviewObj){
    
    return $http({
      method: "POST",
      url: '/api/postRev',
      data: reviewObj
    })
    .then(function(resp){
      console.log('POSTReview RESPONSE =======', resp)
    })
    .catch(function(err){
      console.log('err!!',err)
    })
  };

  var getReview = function(title){
    console.log("GET REVIEW TITLE", title);
    return $http({
      method: "POST",
      url: '/api/getRev',
      data: title
    })
    .then(function(resp){
      console.log('GETReview RESPONSE =======', resp)
      return resp.data;
    })
    .catch(function(err){
      console.log('err!!!',err)
    })
  };

  var addToDatabase = function(work) {
    return $http({
      method: 'POST',
      url: '/api/works',
      data: work, //forms user object
    })
    .then(function (resp){
      console.log("added to db")
      return resp.data
    })
  };


  var getMatchingTags = function (tags) {
    console.log("Inside getMatchingTags" , tags)
    return $http({
      method: 'POST',
      url: '/api/tags',
      data: tags
    })
    .then(function (resp) {
      console.log('response from api/tags ', resp.data)
      return resp.data;
    });
  };

   return {
    submitForm: submitForm,
    getMatchingTags: getMatchingTags,
    addToDatabase: addToDatabase,
    postReview: postReview,
    getReview: getReview
  };
});

factories.factory('Globals', function(){
  var title;
  var recs;
  var indiv;
  var storage = {};

  //takes the title and stores it
  var storeTitle = function(newTitle){
    storage = newTitle;
    console.log('title has been stored ', storage)
  }

  //serves up the title to controllers that need it
  var returnTitle = function(){
    return title;
  }
  //takes the response from api/tags and stores it
  var storeRecs = function(newRecs){
    console.log('storing recs ', newRecs)
    recs = newRecs;
  }
  //serves the recomendations to the controllers that need it
  var returnRecs = function(){
    console.log('returning storage', storage)
    return storage;
  }

  //stores the clicked on id
  var storeIndiv = function(clicked){
    console.log('storing indiv ', clicked)
    indiv = clicked;
  }
  //returns the clicked on rec
  var returnIndiv = function(){
    console.log('returning indiv ', indiv)
    return indiv;
  }

  return {
    storeTitle: storeTitle,
    returnTitle: returnTitle,
    storeRecs: storeRecs,
    returnRecs: returnRecs,
    storeIndiv: storeIndiv,
    returnIndiv: returnIndiv,
    storage: storage
  }
})
