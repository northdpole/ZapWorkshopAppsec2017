'use strict';

angular.module('Authentication')

.controller('LoginController',
    ['$scope', '$rootScope', '$location','$sce', 'AuthenticationService',
    function ($scope, $rootScope, $location,$sce, AuthenticationService) {
        // reset login status
        AuthenticationService.ClearCredentials();

        $scope.login = function () {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, function (response) {
                if (response.success) {
                    console.log('response was successful');
                    AuthenticationService.SetCredentials($scope.username, $scope.password);
                    $scope.response=$sce.trustAsHtml(response.message);
                    console.log(response)
                   // $location.path('/');

                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });
        };
    }]);
