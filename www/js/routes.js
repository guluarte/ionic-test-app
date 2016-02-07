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
                templateUrl: 'templates/paat.html',
                controller: 'PaatCtrl'
            })
            .state('loading', {
                url: '/loading',
                cache: false,
                templateUrl: 'templates/loading.html',
                controller: 'LoadingCtrl'
            })
            .state('menu.amigos', {
                url: '/friends',
                cache: false,
                views: {
                    'side-menu': {
                        templateUrl: 'templates/amigos.html',
                        controller: 'amigosCtrl'
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
                        templateUrl: 'templates/reciclar.html',
                        controller: 'reciclarCtrl'
                    }
                }
            })
            .state('menu.direccion', {
                url: '/address',
                cache: false,
                views: {
                    'side-menu': {
                        templateUrl: 'templates/direccion.html',
                        controller: 'direccionCtrl'
                    }
                }
            })
            .state('menu.puntosCanjeados', {
                url: '/congratulations',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/puntosCanjeados.html',
                        controller: 'puntosCanjeadosCtrl'
                    }
                }
            }).state('menu.salir', {
                url: '/salir',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/salir.html',
                        controller: 'salirCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');

    });