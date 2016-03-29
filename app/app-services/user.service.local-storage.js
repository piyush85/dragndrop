(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', function ($timeout, $filter, $q) {

            var service = {};

            service.GetByUsername = GetByUsername;
            service.Create = Create;
            service.GetAllCards = GetAllCards;
            service.Update = Update;

            return service;

            function GetByUsername(username) {
                var deferred = $q.defer();
                var filtered = $filter('filter')(getUsers(), { username: username });
                var user = filtered.length ? filtered[0] : null;
                deferred.resolve(user);
                return deferred.promise;
            }
            function GetAllCards(){
                var deferred = $q.defer();
                var cards = [{title: 'CARD-1'},
                    {title: 'CARD-2'},
                    {title: 'CARD-3'}];
                deferred.resolve(cards);
                return deferred.promise;
            }
            function Update(user) {
                var deferred = $q.defer();

                var users = getUsers();
                for (var i = 0; i < users.length; i++) {
                    if (users[i].id === user.id) {
                        users[i] = user;
                        break;
                    }
                }
                setUsers(users);
                deferred.resolve();

                return deferred.promise;
            }
            function Create(user) {
                var deferred = $q.defer();

                // simulate api call with $timeout
                $timeout(function () {
                    GetByUsername(user.username)
                        .then(function (duplicateUser) {
                            if (duplicateUser !== null) {
                                deferred.resolve({ success: false, message: 'Username "' + user.username + '" is already taken' });
                            } else {
                                var users = getUsers();

                                // assign id
                                var lastUser = users[users.length - 1] || { id: 0 };
                                user.id = lastUser.id + 1;

                                // save to local storage
                                users.push(user);
                                setUsers(users);

                                deferred.resolve({ success: true });
                            }
                        });
                }, 1000);

                return deferred.promise;
            }
            // Private functions
            function getUsers() {
                if(!localStorage.users){
                    localStorage.users = JSON.stringify([]);
                }

                return JSON.parse(localStorage.users);
            }

            function setUsers(users) {
                localStorage.users = JSON.stringify(users);
            }
        });
})();