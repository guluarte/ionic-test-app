(function (angular) {

    'use strict';

    angular.module('app.services')
        .factory('Auth', function Auth(rootRef, $firebaseAuth) {
            return $firebaseAuth(rootRef);
        });

})(angular);