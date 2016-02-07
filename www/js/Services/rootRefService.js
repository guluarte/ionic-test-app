(function (angular) {
    'use strict';

    angular.module('app.services')
        .constant('FirebaseUrl', 'https://paat.firebaseio.com')
        .service('rootRef', function (FirebaseUrl, Firebase, $log) {
            if (firebaseRootRef !== undefined || firebaseRootRef != null) {
                $log.info('Firebase roof ref is defined');
                return firebaseRootRef;
            } else {
                firebaseRootRef = new Firebase(FirebaseUrl);
                return firebaseRootRef;
            }
        });
        
})(angular);