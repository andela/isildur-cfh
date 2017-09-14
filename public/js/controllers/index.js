/* global angular */
/* global document */
/* global localStorage */
angular.module('mean.system')
  .controller('IndexController',
    [
      '$scope',
      'Global',
      '$location',
      'socket',
      'game',
      'AvatarService',
      '$http',
      '$window',
      (
        $scope,
        Global,
        $location,
        socket,
        game,
        AvatarService,
        $http,
        $window
      ) => {
        $scope.global = Global;

        $scope.errorMessage = '';

        $scope.signup = () => {
          if (
            $scope.name &&
          $scope.name.length > 0 &&
          $scope.email &&
          $scope.password
          ) {
            const newUser = {
              name: $scope.name,
              password: $scope.password,
              email: $scope.email
            };

            $http.post('/api/auth/signup', newUser)
              .then((response) => {
                $window.localStorage.setItem('token', response.data.token);
                $location.path('/#!/');
                $window.location.reload();
              }, (err) => {
                $location.search(`error=${err.data.error}`);
              });
          }
        };

        $scope.signin = () => {
          if (
            $scope.email &&
          $scope.password
          ) {
            const user = {
              email: $scope.email,
              password: $scope.password
            };

            $http.post('/api/auth/login', user)
              .then((response) => {
                $window.localStorage.setItem('token', response.data.token);
                $location.path('/#!/');
                $window.location.reload();
              }, (err) => {
                $location.search(`error=${err.data.error}`);
              });
          } else {
            $location.search('error=invalid');
          }
        };

        $scope.playAsGuest = () => {
          game.joinGame();
          $location.path('/app');
        };

        // added by me
        $scope.playWithStrangers = () => {
        // game.joinGame();
        // $location.path('/app');
          if ($scope.region === undefined || $scope.region === '') {
          alert('Please Select your Region');//eslint-disable-line
            return;
          }
          localStorage.setItem('region', $scope.region);
          $scope.hideModal();
          // $location.path('/play');
          $window.location.href = '/play';
          $scope.hideBackdrop();
        };

        $scope.playWithFriends = () => {
          if ($scope.region === undefined || $scope.region === '') {
          alert('Please Select your Region');//eslint-disable-line
            return;
          }
          localStorage.setItem('region', $scope.region);
          $scope.hideModal();
          // $location.path('/play?custom');
          $window.location.href = '/play?custom';
          $scope.hideBackdrop();
        };
        // ends

        $scope.showError = () => {
          if ($location.search().error) {
            return $location.search().error;
          }
          return false;
        };

        // TODO: Search for a user in all users table

        // TODO: Send invites to registered but non-friend users

        // TODO: Add User to friend List Function

        // TODO: Get Current User's Friends Function

        // TODO: Send invites to selected Friends

        $scope.avatars = [];
        AvatarService.getAvatars()
          .then((data) => {
            $scope.avatars = data;
          });

        $scope.hideModal = () => {
          const regionModal = document.querySelector('.auto-close');
          regionModal.click();
        };

        $scope.hideBackdrop = () => {
          const backdrop = document.querySelector('.modal-backdrop.fade.in');
          backdrop.hidden = true;
        };
      }]);
