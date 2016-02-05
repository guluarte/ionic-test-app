angular.module('app.services', ['firebase'])
    .constant('FirebaseUrl', 'https://paat.firebaseio.com')
    .service('rootRef', ['FirebaseUrl', Firebase])
    .service('UserService', ['FirebaseUrl', '$firebaseArray', '$firebaseObject', '$log', function (FirebaseUrl, $firebaseArray, $firebaseObject, $log) {

        var getId = function (id) {
            $log.debug('Getting from firebase ' + id);
            var userRef = new Firebase(FirebaseUrl + '/users/fb/' + id);
            return $firebaseObject(userRef);
        };

        var update = function (id, value) {
            $log.debug('Updating firebase ' + id);
            $log.debug(value);
            var userRef = new Firebase(FirebaseUrl + '/users/fb/' + id);
            userRef.update(value);
        };

        var getTop = function () {
            $log.debug('Retrieving top users in zone');
            var usersRef = new Firebase(FirebaseUrl + "/users/fb/");
            // create a query for the most recent 25 messages on the server
            var query = usersRef.orderByChild("points").limitToFirst(30);
            // the $firebaseArray service properly handles database queries as well
            return $firebaseArray(query);
        };

        var getRequest = function (id) {
            var reqRef = new Firebase(FirebaseUrl + '/requests/' + id);
            return $firebaseObject(reqRef);
        };

        return {
            getId: getId,
            update: update,
            getTop: getTop,
            getRequest: getRequest
        };
    }]).factory('TimeStamp', function TimeStamp() {

        return (Date.now() / 1000 | 0);

    }).factory('Auth', function Auth(rootRef, $firebaseAuth) {
        return $firebaseAuth(rootRef);
    });