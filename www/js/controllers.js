angular.module('app.controllers', [])

    .controller('PaatCtrl', function ($scope, Auth, TimeStamp, $localStorage, $state, $ionicHistory, UserService) {

        $ionicHistory.nextViewOptions({
            historyRoot: true
        });
        $scope.$on('$ionicView.beforeEnter', function (e, config) {
            config.enableBack = false;
        });

        $scope.loginWithFacebook = function loginWithFacebook() {
            Auth.$authWithOAuthPopup('facebook', {
                remember: "default",
                scope: "email,user_friends"
            })
                .then(function (authData) {
                    console.log(authData);
                    authData.facebook.id = authData.facebook.cachedUserProfile.id;
                    $localStorage.id = authData.facebook.id;
                    $localStorage.facebook = authData.facebook;

                    var user = UserService.getId(authData.facebook.id);
                    console.log(user);

                    user.$loaded().then(function () {
                        if (user.points == null) {

                            console.log("setupping init points");
                            user.uid = authData.uid;
                            user.points = 50;
                            user.facebook = authData.facebook;
                            user.lastActive = TimeStamp;
                            user.$save();
                        } else {
                            console.log("updating");
                            UserService.update(authData.facebook.id, { 'facebook': authData.facebook, 'lastActive' : TimeStamp });
                        }

                        $state.go('menu.amigos');
                    });

                });
        };

    })

    .controller('amigosCtrl', function ($scope, UserService, $localStorage, $state, $ionicHistory) {

        $ionicHistory.nextViewOptions({
            historyRoot: true
        });

        $scope.$on('$ionicView.beforeEnter', function (e, config) {
            config.enableBack = false;
        });

        var getProfile = function () {

            if ($localStorage.hasOwnProperty("id") === true) {

                console.log($localStorage.id);

                $scope.user = UserService.getId($localStorage.id);

                $scope.user.$loaded().then(function () {
                    console.log($scope.user);
                    if ($scope.user.points == null) {
                        alert("Hubo un error al iniciar sesion.");
                        $state.go('paat');
                    }
                });

            } else {
                alert("Hubo un error al iniciar sesion.");
                $state.go('paat');
            }
        };

        var getTop = function () {
            $scope.friends = UserService.getTop();
        };

        $scope.doRefresh = function () {
            getProfile();
            getTop();
            $scope.$broadcast('scroll.refreshComplete');
        };

        getProfile();
        getTop();

    })

    .controller('reciclarCtrl', function ($scope) {
        $scope.items = [];

        $scope.items.push({
            src: 'img/alluminium.jpg',
            name: 'Aluminio',
            description: 'El reciclaje del aluminio generalmente produce varios ahorros importantes en materia económica y energética aún cuando se tienen en cuenta los costes de recogida, separación y reciclaje. Además, se producen ahorros a nivel nacional debido a la reducción del capital necesario para subvencionar y transportar la materia prima.'
        });

        $scope.items.push({
            src: 'img/glass.jpg',
            name: 'Vidrio',
            description: 'alluminium desc'
        });

        $scope.items.push({
            src: 'img/paper.jpg',
            name: 'Papel y carton',
            description: 'alluminium desc'
        });

        $scope.items.push({
            src: 'img/pet.jpg',
            name: 'Pet',
            description: 'alluminium desc'
        });

    })

    .controller('direccionCtrl', function ($scope, $state, $cordovaGeolocation, $localStorage, UserService) {
        var options = { timeout: 10000, enableHighAccuracy: true };

        var coords = [];
        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
            coords = [position.coords.latitude, position.coords.longitude];
            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            console.log(position);

            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
            console.log($scope.map);
            
            //Wait until the map is loaded
            google.maps.event.addListenerOnce($scope.map, 'idle', function () {

                var marker = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    position: latLng
                });

            });
            
            //https://github.com/firebase/geofire-js

        }, function (error) {
            console.log("Could not get location");
        });

        $scope.user = UserService.getId($localStorage.id);

        $scope.canjear = function () {

            $scope.isErrored = false;

            $scope.user.address.coords = coords;
            // Validate
            
            if ($scope.user.address.street === undefined || $scope.user.address.street === null) {
                $scope.isErrored = true;
                return;
            }

            if ($scope.user.address.neightboor === undefined || $scope.user.address.street === null) {
                $scope.isErrored = true;
                return;
            }

            if ($scope.user.address.streetNumber === undefined || $scope.user.address.street === null) {
                $scope.isErrored = true;
                return;
            }
            UserService.update($localStorage.id, { 'address': $scope.user.address });
            console.log($scope.user);
            $state.go('menu.puntosCanjeados');
        };
    })

    .controller('puntosCanjeadosCtrl', function ($scope, $state, $localStorage, $ionicPopup, UserService, $cordovaSocialSharing) {

        $scope.$on('$ionicView.beforeEnter', function (e, config) {
            config.enableBack = false;
        });

        if ($localStorage.hasOwnProperty("id") === true) {

            console.log($localStorage.id);

            $scope.user = UserService.getId($localStorage.id);

            $scope.user.$loaded().then(function () {

                console.log($scope.user);
                if ($scope.user.points == null) {
                    alert("Hubo un error al iniciar sesion.");
                    $state.go('paat');
                }
                //var points = $scope.user.points + 50;
                //UserService.update($localStorage.id, { 'points': points });
            });

        } else {
            alert("Hubo un error al iniciar sesion.");
            $state.go('paat');
        }

        console.log($cordovaSocialSharing);

        $scope.shareViaFacebook = function () {
            $cordovaSocialSharing
                .shareViaFacebook('test', 'test', 'test')
                .then(function (result) {
                    console.log(result);
                    var alertPopup = $ionicPopup.alert({
                        title: 'Gracias por compartir via facebook'
                    });
                    alertPopup.then(function (res) {
                    });
                }, function (err) {
                    console.log(err);
                    var alertPopup = $ionicPopup.alert({
                        title: 'Could not post to Facebook',
                        template: 'Do you have the app installed?'
                    });
                    alertPopup.then(function (res) {
                    });
                });
        };
    })
 