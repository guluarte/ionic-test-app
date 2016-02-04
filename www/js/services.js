angular.module('app.services', ['firebase'])
    .constant('FirebaseUrl', 'https://paat.firebaseio.com/')
    .service('rootRef', ['FirebaseUrl', Firebase])
    .service('UserService', ['FirebaseUrl', '$firebaseArray', '$firebaseObject', function (FirebaseUrl, $firebaseArray, $firebaseObject) {

        var getId = function (id) {
            var userRef = new Firebase(FirebaseUrl + '/users/fb/' + id);
            return $firebaseObject(userRef);
        };

        var update = function (id, value) {
            var userRef = new Firebase(FirebaseUrl + '/users/fb/' + id);
            userRef.update(value);
        };

        var getTop = function () {
            var usersRef = new Firebase(FirebaseUrl + "/users/fb");
            // create a query for the most recent 25 messages on the server
            var query = usersRef.orderByChild("points").limitToFirst(30);
            // the $firebaseArray service properly handles database queries as well
            return $firebaseArray(query);
        };

        return {
            getId: getId,
            update: update,
            getTop: getTop
        };
    }]).factory('TimeStamp', function TimeStamp() {

        return (Date.now() / 1000 | 0);
        
    }).factory('Auth', function Auth(rootRef, $firebaseAuth) {
        return $firebaseAuth(rootRef);
    });