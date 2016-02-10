(function () {

    angular.module('app.controllers')
        .controller('PaatCtrl', Paat);

    Paat.$inject = ['$scope', 'Auth', '$log', '$localStorage', '$state', '$ionicHistory', 'UserService'];
    function Paat($scope, Auth, $log, $localStorage, $state, $ionicHistory, UserService) {

        $ionicHistory.nextViewOptions({
            historyRoot: true
        });
        $scope.$on('$ionicView.beforeEnter', function (e, config) {
            config.enableBack = false;
        });

        $scope.loginWithFacebook = function loginWithFacebook() {
            $state.go('loading');
        };

    }

})();