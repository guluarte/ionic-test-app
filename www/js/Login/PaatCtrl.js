(function (angular) {

    var module = angular.module('app.controllers');

    module.controller('PaatCtrl', function ($scope, Auth, $log, $localStorage, $state, $ionicHistory, UserService) {

        $ionicHistory.nextViewOptions({
            historyRoot: true
        });
        $scope.$on('$ionicView.beforeEnter', function (e, config) {
            config.enableBack = false;
        });

        $scope.loginWithFacebook = function loginWithFacebook() {
            $state.go('loading');
        };

    });

})(angular);