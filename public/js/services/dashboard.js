/* global angular */
/* global window */
angular.module('mean.system')
.factory('dashboard',
  ['$http', ($http) => {
    const getGameLog = () => new Promise((resolve, reject) => {
      $http.get('/api/games/history',
      { headers: { token: window.localStorage.token } })
        .success((response) => {
          resolve(response);
        })
        .error((error) => {
          reject(error);
        });
    });
    const leaderGameLog = () => new Promise((resolve, reject) => {
      $http.get('/api/leaderboard',
      { headers: { token: window.localStorage.token } })
        .success((response) => {
          resolve(response);
        })
        .error((error) => {
          reject(error);
        });
    });
    const userDonations = () => new Promise((resolve, reject) => {
      $http.get('/api/donations',
      { headers: { token: window.localStorage.token } })
        .success((response) => {
          resolve(response);
        })
        .error((error) => {
          reject(error);
        });
    });
    return {
      getGameLog,
      leaderGameLog,
      userDonations
    };
  }]);
