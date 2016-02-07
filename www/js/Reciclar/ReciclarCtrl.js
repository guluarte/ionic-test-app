(function (angular) {

    var module = angular.module('app.controllers');

    module.controller('reciclarCtrl', function ($scope) {
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

    });

})(angular);