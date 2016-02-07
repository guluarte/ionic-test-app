angular.module('app.controllers', [])
    .controller('PaatCtrl', function ($scope, Auth, $log, $localStorage, $state, $ionicHistory, UserService) {

        $ionicHistory.nextViewOptions({
            historyRoot: true
        });
        $scope.$on('$ionicView.beforeEnter', function (e, config) {
            config.enableBack = false;
        });

        $scope.loginWithFacebook = function loginWithFacebook() {
            $state.go('loading');
        };

    })
    .controller('LoadingCtrl', function($log, $state, $ionicHistory, rootRef, $scope, UserService, $localStorage) {
        
        $ionicHistory.nextViewOptions({
            historyRoot: true
        });
        $scope.$on('$ionicView.beforeEnter', function (e, config) {
            config.enableBack = false;
        });

            rootRef.authWithOAuthPopup('facebook', function (error, authData) {
                    $log.debug(authData);
                    $log.info('OAuth data recivied, uid:'  + authData.uid );
                    
                    authData.facebook.id = authData.facebook.cachedUserProfile.id;
                    $localStorage.id = authData.facebook.id;
                    $localStorage.facebook = authData.facebook;

                    var user = UserService.getId(authData.facebook.id);
                    $log.debug(user);

                    user.$loaded().then(function () {
                        if (user.points == null) {

                            $log.debug("Setupping init points");
                            user.uid = authData.uid;
                            user.points = 50;
                            user.facebook = authData.facebook;
                            user.lastActive = (Date.now() / 1000 | 0);
                            user.$save();
                        } else {
                            $log.debug("Known user, updating.");
                            UserService.update($localStorage.id, { 'facebook': authData.facebook, 'lastActive': (Date.now() / 1000 | 0) });
                        }

                        $state.go('menu.amigos');
                    });

                }, {
                remember: "default",
                scope: "email,user_friends"
            });
    })
    
    .controller('amigosCtrl', function ($scope, $q, $log, UserService, $localStorage, $state, $ionicHistory, $ionicLoading) {

       
        $ionicHistory.nextViewOptions({
            historyRoot: true
        });

        $scope.$on('$ionicView.beforeEnter', function (e, config) {
            config.enableBack = false;
            $ionicHistory.clearHistory();
        });

        var userFirebaseObj;
        
        var getProfile = function () {

            if ($localStorage.hasOwnProperty("id") === true) {

                UserService.setActive($localStorage.id);
                
                console.log($localStorage.id);

                userFirebaseObj = UserService.getId($localStorage.id);

                userFirebaseObj.$bindTo($scope, "user");

                userFirebaseObj.$loaded().then(function () {
                    
                    console.log($scope.user);
                    
                    if ($scope.user.points == null) {

                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.refreshComplete');

                        //alert("Hubo un error al iniciar sesion.");
                        //$state.go('paat');
                    }

                });

            } else {

                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');

                alert("Hubo un error al iniciar sesion.");
                $state.go('paat');
            }
        };


        $scope.doRefresh = function () {
            $log.info('Doing refresh');
             $scope.isProcessing = true;
/*
            $ionicLoading.show({
                template: 'Cargando...',
                showDelay: 500
            });
*/
            $scope.friends = UserService.getTop();
            
            getProfile();
            // When all promises have been resolved display the results
            $q.all([$scope.friends.$loaded(), userFirebaseObj.$loaded()]).then(function (data) {
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                 $scope.isProcessing = false;
            }, function () {
                alert("Hubo un error al cargar los datos.");
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                $scope.isProcessing = false;
            });
        };

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

    .controller('direccionCtrl', function ($scope,$q ,$state, $cordovaGeolocation, $ionicLoading, $localStorage, UserService, $log) {

         $scope.isProcessing = true;

        var options = { timeout: 10000, enableHighAccuracy: true };

        var coords = [];
        
        var geoPrmoise = $cordovaGeolocation.getCurrentPosition(options);
        var userFirebaseObj = UserService.getId($localStorage.id);
        
        userFirebaseObj.$bindTo($scope, "user");
         
        $q.all([geoPrmoise, userFirebaseObj.$loaded()]).then(function (data) {
            $log.debug(data);
            
            var position = data[0];
            
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
            
            $ionicLoading.hide();
             $scope.isProcessing = false;

        }, function (error) {
            console.log("Could not get location");
            $ionicLoading.hide();
            
             $scope.isProcessing = false;
        });

        $scope.canjear = function () {

            $log.debug($scope.user);
            
            $scope.isErrored = false;       
            // Validate
            $scope.user.address = $scope.user.address || {};
            $scope.user.address.coords = coords || [];
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
            
             $ionicLoading.show({
                template: 'Enviando...',
                showDelay: 500
            });
            
             UserService.update($localStorage.id, { 'address': $scope.user.address, 'requestRecollection': {
                'requestTime' : (Date.now() / 1000 | 0),
                'isSatisfaced' : false
            } }, function() {
                $ionicLoading.hide();
                $scope.isProcessing = false;
                console.log($scope.user);
                $state.go('menu.puntosCanjeados');
            });
            
            UserService.setActive($localStorage.id);
            
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
    
    .controller('salirCtrl', function ($log) {
        $log.info('exiting app');
        ionic.Platform.exitApp(); // stops the app
    });
