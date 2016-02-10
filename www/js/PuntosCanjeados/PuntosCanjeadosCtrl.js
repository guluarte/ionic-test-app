(function () {

    angular.module('app.controllers')
        .controller('puntosCanjeadosCtrl', PuntosCanjeados);

    PuntosCanjeados.$inject = [
        '$scope',
        '$log',
        '$ionicPlatform',
        '$state',
        '$localStorage',
        '$ionicPopup',
        'UserService',
        '$cordovaSocialSharing'
    ];
    
    function PuntosCanjeados($scope, $log, $ionicPlatform, $state, $localStorage, $ionicPopup, UserService, $cordovaSocialSharing) {

        $scope.$on('$ionicView.beforeEnter', function (e, config) {
            config.enableBack = false;
        });

        $scope.user = UserService.getId($localStorage.id);

        $scope.shareViaFacebook = function () {
            $ionicPlatform.ready(function () {

                $cordovaSocialSharing
                    .shareViaFacebook('test', 'test', 'test')
                    .then(function (result) {
                        $log.info(result);
                        var alertPopup = $ionicPopup.alert({
                            title: 'Gracias por compartir via facebook'
                        });
                        alertPopup.then(function (res) {
                        });
                    }, function (err) {
                        $log.info(err);
                        var alertPopup = $ionicPopup.alert({
                            title: 'No se pudo compartir en Facebook',
                            template: 'Cuenta con la aplicacion instalada?'
                        });
                        alertPopup.then(function (res) {
                        });
                    });

            });
        };
    }

})();