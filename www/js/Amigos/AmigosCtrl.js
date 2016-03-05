(function () {

    angular.module('app.controllers')
        .controller('amigosCtrl', AmigosCtrl);

    AmigosCtrl.$inject = [
        '$scope',
        '$q',
        '$timeout',
        '$log',
        '$ionicPlatform',
        'UserService',
        '$localStorage',
        '$state',
        '$ionicHistory',
        '$ionicLoading'
    ];

    function AmigosCtrl($scope, $q, $timeout, $log, $ionicPlatform, UserService, $localStorage, $state, $ionicHistory, $ionicLoading) {

        var vm = this;

        vm.doRefresh = function () {
            refresh();
        };

        $ionicHistory.nextViewOptions({
            historyRoot: true
        });

        $scope.$on('$ionicView.beforeEnter', function (e, config) {
            config.enableBack = false;
            $ionicHistory.clearHistory();
            refresh();
        });

        var refresh = function () {

            $log.info('Doing refresh');

            vm.isProcessing = true;

            if ($localStorage.hasOwnProperty("id") === true) {

                UserService.setActive($localStorage.id);
                $log.info($localStorage.id);

                vm.user = UserService.getId($localStorage.id);
                vm.friends = UserService.getTop();
                        
                // When all promises have been resolved display the results
                $q.all([vm.friends.$loaded(), vm.user.$loaded()]).then(function (data) {

                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                    vm.isProcessing = false;

                }, function () {
                    alert("Hubo un error al cargar los datos.");
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                    vm.isProcessing = false;
                });

            } else {
                $scope.$broadcast('scroll.refreshComplete');
                alert("Hubo un error al iniciar sesion.");
                $state.go('paat');
            }

        };
    }

})();