// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var firebaseRootRef;


(function (firebaseRootRef) {

    angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'ngCordova', 'ngStorage', 'firebase', 'angularGeoFire', 'ionicProcessSpinner'])

        .run(function ($ionicPlatform) {
            $ionicPlatform.ready(function () {

                firebaseRootRef = new Firebase('https://paat.firebaseio.com');
                // Connect to firebase as soon as possible
                Firebase.goOnline();
                firebaseRootRef.child(".info/connected").on("value", function (snap) {
                    if (snap.val() === true) {
                        console.info("Firebase connected")
                    } else {
                        console.info("Firebase disconnected");
                    }
                });
            
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }
            });
        });
})(firebaseRootRef);