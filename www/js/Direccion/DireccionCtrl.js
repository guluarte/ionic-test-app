(function (angular) {

    var module = angular.module('app.controllers');

    module .controller('direccionCtrl', function ($scope,$q ,$state, $cordovaGeolocation, $ionicLoading, $localStorage, UserService, $log) {

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
    });
    

})(angular);