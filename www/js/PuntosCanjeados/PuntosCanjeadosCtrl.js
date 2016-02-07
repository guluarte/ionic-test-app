(function (angular) {

    var module = angular.module('app.controllers');

    module.controller('puntosCanjeadosCtrl', function ($scope, $ionicPlatform, $state, $localStorage, $ionicPopup, UserService, $cordovaSocialSharing) {

        $scope.$on('$ionicView.beforeEnter', function (e, config) {
            config.enableBack = false;
        });

        $scope.user = UserService.getId($localStorage.id);

        $scope.shareViaFacebook = function () {
            $ionicPlatform.ready(function () {

                $cordovaSocialSharing
                    .shareViaFacebook('test', 'test', 'test')
                    .then(function (result) {
                        console.log(result);
                        var alertPopup = $ionicPopup.alert({
                            title: 'Gracias por compartir via facebook'
                        });
                        alertPopup.then(function (res) {
                        });
                    }, function (err) {
                        console.log(err);
                        var alertPopup = $ionicPopup.alert({
                            title: 'Could not post to Facebook',
                            template: 'Do you have the app installed?'
                        });
                        alertPopup.then(function (res) {
                        });
                    });

            });
        };
    });

})(angular);