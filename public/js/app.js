/*global angular*/

let pareApp = angular.module('pareApp', []);

pareApp.controller('MainController', ['$scope', '$http',
  function MainController($scope, $http) {
    $scope.search = function () {
      $http({
        method: 'GET',
        url   : '/api/products',
        params: { name: $scope.searchQuery }
      }).success((data) => {
        console.log(data);
        $scope.suggestions = data;
      });
    };
    $scope.suggestions = [];
  }
]);
