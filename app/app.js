(function () {
    'use strict';

    angular
        .module('app', ['ui.router', 'ngCookies', 'ngDragDrop'])
        .config(config)
        .run(run);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/login");

        $stateProvider
            .state('HOME', {
                url: "/",
                controller:"HomeController",
                controllerAs:"vm",
                templateUrl: "views/home/home.view.html"
            })
            .state('LOGIN', {
                url: "/login",
                controller:"LoginController",
                controllerAs:"vm",
                templateUrl: "views/login/login.view.html"
            })
            .state('REGISTER', {
                url: "/register",
                controller:"RegisterController",
                controllerAs:"vm",
                templateUrl: "views/register/register.view.html"
            });
    }

    run.$inject = ['$rootScope', '$cookieStore', '$http', '$state'];
    function run($rootScope, $cookieStore, $http, $state) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($state.current.name, ['LOGIN', 'REGISTER']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $state.go('LOGIN');
            }
        });
    }

})();