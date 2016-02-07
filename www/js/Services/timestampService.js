(function (angular) {
    
    'use strict';

    angular.module('app.services')
        .service('TimeStamp', function TimeStamp() {

            return (Date.now() / 1000 | 0);

        });
        
})(angular);