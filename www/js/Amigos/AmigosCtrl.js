(function (angular) {

    var module = angular.module('app.controllers');

    module.controller('amigosCtrl', function ($scope, $q, $log, UserService, $localStorage, $state, $ionicHistory, $ionicLoading) {

        $ionicHistory.nextViewOptions({
            historyRoot: true
        });

        $scope.$on('$ionicView.beforeEnter', function (e, config) {
            config.enableBack = false;
            $ionicHistory.clearHistory();
        });

        var userFirebaseObj;

        var getProfile = function () {

            if ($localStorage.hasOwnProperty("id") === true) {

                UserService.setActive($localStorage.id);

                console.log($localStorage.id);

                userFirebaseObj = UserService.getId($localStorage.id);

                userFirebaseObj.$bindTo($scope, "user");

            } else {

                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');

                alert("Hubo un error al iniciar sesion.");
                $state.go('paat');
            }
        };


        $scope.doRefresh = function () {
            $log.info('Doing refresh');
            $scope.isProcessing = true;

            $scope.friends = UserService.getTop();

            getProfile();
            // When all promises have been resolved display the results
            $q.all([$scope.friends.$loaded(), userFirebaseObj.$loaded()]).then(function (data) {

                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                $scope.isProcessing = false;

            }, function () {
                alert("Hubo un error al cargar los datos.");
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                $scope.isProcessing = false;
            });
        };

    });

})(angular);