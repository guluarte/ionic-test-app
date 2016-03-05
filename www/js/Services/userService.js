(function () {
    'use strict';

    angular.module('app.services')
        .service('UserService', function (rootRef, $firebaseArray, $firebaseObject, $log) {

            var getId = function (id) {
                $log.debug('Getting from firebase ' + id);

                var userRef = rootRef.child('/users/fb/' + id);
                return $firebaseObject(userRef);
                
            };

            var update = function (id, value, callback) {
                $log.debug('Updating firebase ' + id);
                $log.debug(value);

                var userRef = rootRef.child('/users/fb/' + id);
                userRef.update(value, callback);
            };

            var setActive = function (id) {
                update(id, { 'lastActive': (Date.now() / 1000 | 0) });
            };

            var getTop = function () {
                $log.debug('Retrieving top users in zone');
                var usersRef = rootRef.child('/users/fb/');
                // create a query for the most recent 25 messages on the server
                var query = usersRef.orderByChild("points").startAt(1).limitToFirst(30);
                // the $firebaseArray service properly handles database queries as well
                return $firebaseArray(query);
            };

            var getRequest = function (id) {
                var reqRef = rootRef.child('/requests/' + id);
                return $firebaseObject(reqRef);
            };

            return {
                getId: getId,
                update: update,
                getTop: getTop,
                getRequest: getRequest,
                setActive: setActive
            };
        });
        
})();