(function () {
    
    'use strict';
    
    angular.module('app.routes', [])

        .config(function ($stateProvider, $urlRouterProvider) {

            // Ionic uses AngularUI Router which uses the concept of states
            // Learn more here: https://github.com/angular-ui/ui-router
            // Set up the various states which the app can be in.
            // Each state's controller can be found in controllers.js
            $stateProvider
                .state('paat', {
                    url: '/login',
                    cache: false,
                    templateUrl: 'js/Login/paat.html',
                    controller: 'PaatCtrl',
                    controllerAs: 'vm'
                })
                .state('loading', {
                    url: '/loading',
                    cache: false,
                    templateUrl: 'js/Loading/loading.html',
                    controller: 'LoadingCtrl'
                })
                .state('menu.amigos', {
                    url: '/friends',
                    cache: false,
                    views: {
                        'side-menu': {
                            templateUrl: 'js/Amigos/amigos.html',
                            controller: 'amigosCtrl',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('menu', {
                    url: '/side-menu',
                    abstract: true,
                    templateUrl: 'templates/menu.html'
                })

                .state('menu.reciclar', {
                    url: '/reciclar',
                    views: {
                        'side-menu': {
                            templateUrl: 'js/Reciclar/reciclar.html',
                            controller: 'reciclarCtrl'
                        }
                    }
                })
                .state('menu.direccion', {
                    url: '/address',
                    cache: false,
                    views: {
                        'side-menu': {
                            templateUrl: 'js/Direccion/direccion.html',
                            controller: 'direccionCtrl'
                        }
                    }
                })
                .state('menu.puntosCanjeados', {
                    url: '/congratulations',
                    views: {
                        'side-menu': {
                            templateUrl: 'js/PuntosCanjeados/puntosCanjeados.html',
                            controller: 'puntosCanjeadosCtrl'
                        }
                    }
                });

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/login');

        });
})();