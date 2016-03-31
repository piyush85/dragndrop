
(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', ["UserService", "$rootScope", "FlashService", function (UserService, $rootScope, FlashService) {
            var vm = this,
                adminList = {
                        "A": [],
                        "B": [],
                        "C": []
                },
                userList = {
                        "A": [],
                        "B": []
                    };

            vm.user = null;
            vm.cards = [];
            vm.dropMessage = function (e,item) {
                FlashService.Success(item.draggable[0].innerHTML + ' dropped successfully', true);
                UserService.Update(vm.user)
                    .then(function () {
                        FlashService.Success(item.draggable[0].innerHTML + ' data saved', true);
                    });
            };
            UserService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    vm.user = user;
                    vm.user.data = user.userType.name === "Admin"?(vm.user.data || adminList):(vm.user.data || userList);
                    //vm.cards = cardsIntersection(vm.cards, vm.user.data);
                });
            UserService.GetAllCards()
                .then(function (cards) {
                    vm.cards = cardsIntersection(cards, vm.user.data);
                });

            function cardsIntersection(cards,list){
                var i, j,
                    findInList = function(c){
                        return function(val){
                            return val.title === c.title;
                        };
                    };
                var returnArr = cards.filter(function(c){
                    var found = false;
                    for(i in list){
                        if(list[i].find(findInList(c))){
                            found = true;
                            break;
                        }
                    }
                    return !found;
                });
                return returnArr;
            }
        }]);
})();