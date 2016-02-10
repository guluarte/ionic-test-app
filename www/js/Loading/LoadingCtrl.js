(function (angular) {

    angular.module('app.controllers')
        .controller('LoadingCtrl', Loading);

    Loading.$inject = ['$log', '$state', '$ionicHistory', 'rootRef', '$scope', 'UserService', '$localStorage'];
    
    function Loading($log, $state, $ionicHistory, rootRef, $scope, UserService, $localStorage) {

        $ionicHistory.nextViewOptions({
            historyRoot: true
        });
        $scope.$on('$ionicView.beforeEnter', function (e, config) {
            config.enableBack = false;
        });

        rootRef.authWithOAuthPopup('facebook', function (error, authData) {

            if (error) {
                $log.info('Error in OAuth :' + error);
                alert('Invalid credentials');
                $state.go('paat');
            }

            $log.debug(authData);
            $log.info('OAuth data recivied, uid:' + authData.uid);

            authData.facebook.id = authData.facebook.cachedUserProfile.id;
            $localStorage.id = authData.facebook.id;

            UserService.update($localStorage.id, { 'facebook': authData.facebook, 'lastActive': (Date.now() / 1000 | 0) });

            $log.info('Going to menu.amigos');

            $state.go('menu.amigos');

        }, {
                remember: "default",
                scope: "email,user_friends"
            });
    }
})(angular);