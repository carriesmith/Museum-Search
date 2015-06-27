// Declare a module (ng-app, [any dependencies, here empty])
var app = angular.module('ArtApp', ['ui.router']);

app.config(function($stateProvider){
  $stateProvider
    .state('index', {
      url: '',
      controller: 'MainCtrl',
      templateUrl: 'js/templates/homePage.html'
    })
    .state('single', {
      url: '/single/:id',  // id is a parameter
      controller: 'SingleCtrl',
      templateUrl: 'js/templates/singlePage.html'
    });
});

// Set up CONTROLLER using the ng-controller directive
// controller takes two parameters, name & function
app.controller('MainCtrl', function($scope, art){
  art.getArt().then(function(data){
    $scope.artItems = data.artObjects;
  },
  function(err){
    console.log(err);
  });

  $scope.search = function(e){
    // added for when search triggered by text-box ng-change
    // actually unecessary right now.
    if (e !== undefined){
      e.preventDefault();      
    }
    art.searchArt($scope.searchQuery).then(
      function(data){   // first argument - resolve funciton
        $scope.artItems = data.artObjects;
        console.log($scope.artItems.length);
    },
      function(err){
        console.log(err);
      }
    );
  }

});

app.controller('SingleCtrl', function($scope, art, $stateParams){

  art.getArtById($stateParams.id).then(function(data){
    console.log(data.artObject);
    $scope.artWork = data.artObject;
  });

});

app.directive('artItem', function(){
  return {
    restrict: 'E',  // Directives can return Elements (E), Attribute (A) or Class (C)
    templateUrl: 'js/templates/artItem.html'
  }
});

app.directive('noResult', function(){
  return {
    restrict: 'E',  // Directives can return Elements (E), Attribute (A) or Class (C)
    templateUrl: 'js/templates/noResult.html'
  }
});

app.factory('art', function($http, $q){

  // module pattern. API key is visible in js
  // but private in the sense that scope restricts access to change within the code

  var API = 'VEl7dzoB';
  var URL = 'https://www.rijksmuseum.nl/api/en/collection';
  var APIURL = URL + '?key=' + API;

  return {

    getArt: function(){
      // short for deferred object with resolve, reject and promise object on it
      var def = $q.defer();

      $http.get(APIURL)
        .success(def.resolve)
        .error(def.reject);

      return def.promise;
    }, 

    searchArt: function(query){

      var def = $q.defer();

      $http.get(APIURL + '&q=' + query)
        .success(def.resolve)
        .error(def.reject);

        return def.promise;

    },

    getArtById: function(id){

      var def = $q.defer();

      $http.get(URL + '/' + id + '?key=' + API)
        .success(def.resolve)
        .error(def.reject);

        return def.promise;
    }

  }
});