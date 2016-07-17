/*global angular*/

let pareApp = angular.module('pareApp', []);

pareApp.controller('MainController', ['$scope',
  function MainController($scope, $http) {
    $scope.currentItem = null;

    $scope.$on('search', function (event, product) {
      $scope.currentItem = product;
      $scope.$broadcast('updateListings', product);
    });
  }
]);

pareApp.controller('SearchController', ['$scope', '$http',
  function SearchController($scope, $http) {
    $scope.getSuggestions = function () {
      $scope.searchProdId = null;

      if ($scope.searchQuery == null || $scope.searchQuery === '') {
        return $scope.suggestions = [];
      }

      return $http({
        method: 'GET',
        url   : '/api/products',
        params: { name: $scope.searchQuery.toLowerCase() }
      }).success((suggestions) => {
        $scope.suggestions = suggestions;
      });
    };

    $scope.select = function (thing) {
      $scope.searchQuery = thing.name;
      $scope.searchProdId = thing.id;
      $scope.suggestions = [];
      $scope.search();
    };

    $scope.keydown = function (event, item) {
      if (event.keyCode === 13) {
        $scope.select(item);
      }
    };

    $scope.search = function () {
      $scope.suggestions = [];
      $scope.$emit('search', {
        name: $scope.searchQuery,
        id  : $scope.searchProdId
      });
    };

    $scope.suggestions = [];
    $scope.searchQuery = '';
    $scope.searchProdId = null;
  }
]);

pareApp.controller('ListingController', ['$scope', '$http',
  function ListingController($scope, $http) {

    $scope.$on('updateListings', function (event, product) {
      console.log('trying to list', product);

      return $http({
        method: 'GET',
        url   : '/api/listings',
        params: product
      }).success((listings) => {
        console.log(listings);
        $scope.listings = listings.map((item) => {
          item.date = new Date(item.date).toLocaleDateString();
          return item;
        });
      });
    });

    $scope.listings = [];
  }
]);



// INPUT PAGE
pareApp.controller('InputController', ['$scope', '$http',
  function InputController($scope, $http) {

    $scope.submit = function (event) {
      console.log(event);
      console.log($scope.prodName, $scope.prodId, $scope.storeName, $scope.prodPrice);
      $http({
        method: 'POST',
        url   : '/api/listings',
        data  : {
          name: $scope.prodName,
          productID: $scope.prodId,
          storeName: $scope.storeName,
          storeID: null,
          lat: 0,
          lon: 0,
          address: '123',
          price: $scope.prodPrice,
          quantity: $scope.quantity
        }
      }).success(() => {
        window.location = '/';
      });
    };

    $scope.$on('search', (event, prod) => {
      $scope.prodId = prod.id;
      $scope.prodName = prod.name;
    });
  }
]);
