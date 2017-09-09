angular.module('mean.system')
  .factory('Users', ['$http', '$window', ($http, $window) => {
    const invitesSent = [];
    const searchedUsers = userName => new Promise((resolve, reject) => {
      $http.get(`api/users/search?name=${userName}`)
        .then((response) => {
          const gameUsers = response.data;
          resolve(gameUsers);
        }, (error) => {
          reject(error);
        });
    });

    const sendInvites = email => new Promise((resolve, reject) => {
      const userEmail = email;
      const gameUrl = encodeURIComponent(window.location.href);
      const postData = {
        userEmail,
        gameUrl
      };
      $http.post('/api/users/sendInvitation', postData)
        .then((response) => {
          if (invitesSent.indexOf(response.data) <= -1) {
            invitesSent.push(response.data);
          }
          resolve({
            message: 'Invitation Links has been sent via Email',
            invitesSent });
        })
        .catch((error) => {
          reject({ message: 'Oops, Could not send Email Invitations', error });
        });
    });

    return {
      searchedUsers,
      sendInvites,
      invitesSent
    };
  }]);
