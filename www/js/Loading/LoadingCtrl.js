(function (angular) {

    var module = angular.module('app.controllers');

    module.controller('LoadingCtrl', function ($log, $state, $ionicHistory, rootRef, $scope, UserService, $localStorage) {

        $ionicHistory.nextViewOptions({
            historyRoot: true
        });
        $scope.$on('$ionicView.beforeEnter', function (e, config) {
            config.enableBack = false;
        });

        rootRef.authWithOAuthPopup('facebook', function (error, authData) {
            $log.debug(authData);
            $log.info('OAuth data recivied, uid:' + authData.uid);

            authData.facebook.id = authData.facebook.cachedUserProfile.id;
            $localStorage.id = authData.facebook.id;

            UserService.update($localStorage.id, { 'facebook': authData.facebook, 'lastActive': (Date.now() / 1000 | 0) });

            $state.go('menu.amigos');

        }, {
                remember: "default",
                scope: "email,user_friends"
            });
    });

})(angular);