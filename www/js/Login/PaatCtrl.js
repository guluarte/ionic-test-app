(function () {

    angular.module('app.controllers')
        .controller('PaatCtrl', Paat);

    Paat.$inject = ['$scope', 'Auth', '$log', '$localStorage', '$state', '$ionicHistory', 'UserService'];
    
    function Paat($scope, Auth, $log, $localStorage, $state, $ionicHistory, UserService) {

        var vm = this;

        vm.loginWithFacebook = loginWithFacebook;

        $ionicHistory.nextViewOptions({
            historyRoot: true
        });

        $scope.$on('$ionicView.beforeEnter', function (e, config) {
            config.enableBack = false;
        });

        function loginWithFacebook() {
            $state.go('loading');
        }

    }

})();