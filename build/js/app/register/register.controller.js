(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterController', ["UserService", "$location", "$rootScope", "FlashService", function (UserService, $location, $rootScope, FlashService) {
            var vm = this;
            vm.userOptions = [{id: 1, name: 'User'},
                {id: 0, name: 'Admin'}];
            vm.register = register;

            function register() {
                vm.dataLoading = true;
                UserService.Create(vm.user)
                    .then(function (response) {
                        if (response.success) {
                            FlashService.Success('Registration successful', true);
                            $location.path('/login');
                        } else {
                            FlashService.Error(response.message);
                            vm.dataLoading = false;
                        }
                    });
            }
        }]);
})();
