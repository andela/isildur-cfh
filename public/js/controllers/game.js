/* global angular */
/* global document */
/* global localStorage */
angular.module('mean.system')
  .controller('GameController',
    ['$scope',
      'game',
      '$timeout',
      '$http',
      '$location',
      'MakeAWishFactsService',
      ($scope, game, $timeout,
        $http, $location,
        MakeAWishFactsService) => {
        $scope.hasPickedCards = false;
        $scope.winningCardPicked = false;
        $scope.showTable = false;
        $scope.modalShown = false;
        $scope.game = game;
        $scope.selectedUsers = [];
        $scope.invitedUsers = [];
        $scope.messages = '';
        $scope.sendInviteButton = true;
        $scope.pickedCards = [];
        // $scope.invitesSent = [];
        $scope.invitedFriends = [];
        let makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
        $scope.makeAWishFact = makeAWishFacts.pop();

        $scope.pickCard = (card) => {
          if (!$scope.hasPickedCards) {
            if ($scope.pickedCards.indexOf(card.id) < 0) {
              $scope.pickedCards.push(card.id);
              if (game.curQuestion.numAnswers === 1) {
                $scope.sendPickedCards();
                $scope.hasPickedCards = true;
              } else if (game.curQuestion.numAnswers === 2 &&
          $scope.pickedCards.length === 2) {
              // delay and send
                $scope.hasPickedCards = true;
                $timeout($scope.sendPickedCards, 300);
              }
            } else {
              $scope.pickedCards.pop();
            }
          }
        };
        $scope.pointerCursorStyle = () => {
          if ($scope.isCzar() &&
          $scope.game.state === 'waiting for czar to decide') {
            return { cursor: 'pointer' };
          }
          return {};
        };

        $scope.sendPickedCards = () => {
          game.pickCards($scope.pickedCards);
          $scope.showTable = true;
        };

        $scope.cardIsFirstSelected = (card) => {
          if (game.curQuestion.numAnswers > 1) {
            return card === $scope.pickedCards[0];
          }
          return false;
        };

        $scope.cardIsSecondSelected = (card) => {
          if (game.curQuestion.numAnswers > 1) {
            return card === $scope.pickedCards[1];
          }
          return false;
        };

        $scope.firstAnswer = ($index) => {
          if ($index % 2 === 0 && game.curQuestion.numAnswers > 1) {
            return true;
          }
          return false;
        };

        $scope.secondAnswer = ($index) => {
          if ($index % 2 === 1 && game.curQuestion.numAnswers > 1) {
            return true;
          }
          return false;
        };

        $scope.showFirst = card => game.curQuestion.numAnswers > 1 &&
        $scope.pickedCards[0] === card.id;

        $scope.showSecond = card => game.curQuestion.numAnswers > 1 &&
        $scope.pickedCards[1] === card.id;

        $scope.isCzar = () => game.czar === game.playerIndex;

        $scope.isPlayer = $index => $index === game.playerIndex;
        $scope.isCustomGame = () => !(/^\d+$/).test(game.gameID) &&
        game.state === 'awaiting players';
        $scope.isPremium = $index => game.players[$index].premium;

        $scope.currentCzar = $index => $index === game.czar;

        $scope.winningColor = ($index) => {
          if (game.winningCardPlayer !== 1 && $index === game.winningCard) {
            return $scope.colors[game.players[game.winningCardPlayer].color];
          }
          return '#f9f9f9';
        };

        $scope.pickWinning = (winningSet) => {
          if ($scope.isCzar()) {
            game.pickWinning(winningSet.card[0]);
            $scope.winningCardPicked = true;
          }
        };

        $scope.winnerPicked = () => game.winningCard !== 1;

        $scope.startGame = () => {
          game.startGame();
        };

        // Search Users and Send Invite
        const invitesSent = [];
        /**
         * 
         * @param {*} email
         * @return {*} promise
         * send Invite method api call 
         */
        const sendInvite = email => new Promise((resolve, reject) => {
          const userEmail = email;
          const gameUrl = encodeURIComponent(window.location.href);
          const postData = {
            userEmail,
            gameUrl
          };
          $http.post('/api/users/sendInvitation', postData)
            .success((response) => {
              if (invitesSent.indexOf(response) <= -1) {
                invitesSent.push(response);
              }
              resolve({
                message: 'Invitation Links has been sent via Email',
                invitesSent
              });
            })
            .error((error) => {
              reject({ message: 'Oops, Could not send Email Invitations',
                error });
            });
        });

        $scope.sendInvites = (email) => {
          sendInvite(email)
            .then((response) => {
              console.log(response);
              // $scope.messages = response.message;
              if (invitesSent.length >= 11) {
                $scope.message = 'Heyya! Maximum number of players invited';
                $scope.sendInviteButton = false;
              }
            })
            .catch((error) => {
              $scope.messages = error;
            });
        };


        /**
         * 
         * @param {*} userName
         * @return {*} promise
         * Search User Method api call
         */
        const searchUsers = userName => new Promise((resolve, reject) => {
          $http.get(`api/users/search?name=${userName}`)
            .success((response) => {
              const gameUsers = response;
              resolve(gameUsers);
            })
            .error((error) => {
              reject(error);
            });
        });

        $scope.searchedUsers = () => {
          const username = $scope.userName;
          if ($scope.userName === undefined) {
            $scope.message = 'Please enter a name';
          } else {
            searchUsers(username)
              .then((foundUsers) => {
                $scope.foundUsers = foundUsers;
              });
          }
        };

        // ==========End of Search Users and Send Invite=========
        const getUsers = () => new Promise((resolve, reject) => {
          $http.get('api/users/getUsers')
            .success((response) => {
              console.log(response);
              const allUsers = response;
              resolve(allUsers);
            })
            .error((error) => {
              reject(error);
            });
        });

        $scope.getAllUsers = () => {
          getUsers()
            .then((allUsers) => {
              $scope.allUsers = allUsers;
            });
        };

        // Add user as friend and Get FriendsList
        // $scope.addUserAsFriend = (user) => {

        // };
        // ==========End of add user as friend===============

        $scope.abandonGame = () => {
          game.leaveGame();
          $location.path('/');
        };
        $scope.shuffleCards = () => {
          const card = $(`#${event.target.id}`); //eslint-disable-line
          card.addClass('animated flipOutY');
          setTimeout(() => {
            $scope.startNextRound();
            card.removeClass('animated flipOutY');
            $('#start-modal').modal('hide'); //eslint-disable-line
          }, 500);
        };
        $scope.startNextRound = () => {
          if ($scope.isCzar()) {
            game.startNextRound();
          }
        };

        // Catches changes to round to update when no players pick card
        // (because game.state remains the same)
        $scope.$watch('game.round', () => {
          $scope.hasPickedCards = false;
          $scope.showTable = false;
          $scope.winningCardPicked = false;
          $scope.makeAWishFact = makeAWishFacts.pop();
          if (!makeAWishFacts.length) {
            makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
          }
          $scope.pickedCards = [];
        });

        $scope.winnerPicked = () => game.winningCard !== 1;

        $scope.startGame = () => {
          game.startGame();
        };

        $scope.abandonGame = () => {
          game.leaveGame();
          $location.path('/');
        };

        // Catches changes to round to update when no players pick card
        // (because game.state remains the same)
        $scope.$watch('game.round', () => {
          $scope.hasPickedCards = false;
          $scope.showTable = false;
          $scope.winningCardPicked = false;
          $scope.makeAWishFact = makeAWishFacts.pop();
          if (!makeAWishFacts.length) {
            makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
          }
          $scope.pickedCards = [];
        });

        // In case player doesn't pick a card in time, show the table
        $scope.$watch('game.state', () => {
          if (game.state === 'waiting for czar to decide' &&
                $scope.showTable === false) {
            $scope.showTable = true;
          }
          if (
            $scope.isCzar() && game.state === 'czar pick card'
        && game.table.length === 0
          ) {
            $('#start-modal').modal('show'); //eslint-disable-line
          }
          if (game.state === 'game dissolved') {
            $('#start-modal').modal('hide'); //eslint-disable-line
          }
          if ($scope.isCzar() === false && game.state === 'czar pick card'
        && game.state !== 'game dissolved'
        && game.state !== 'awaiting players' && game.table.length === 0) {
            $scope.czarHasDrawn = 'Wait! Czar is drawing Card';
          }
          if (game.state !== 'czar pick card'
        && game.state !== 'awaiting players'
        && game.state !== 'game dissolve') {
            $scope.czarHasDrawn = '';
          }
        });

        $scope.$watch('game.gameID', () => {
          if (game.gameID && game.state === 'awaiting players') {
            if (!$scope.isCustomGame() && $location.search().game) {
            // If the player didn't successfully enter the request room,
            // reset the URL so they don't think they're in the requested room.
              $location.search({});
            } else if ($scope.isCustomGame() && !$location.search().game) {
            // Once the game ID is set, update the URL
            // if this is a game with friends,
            // where the link is meant to be shared.
              $location.search({ game: game.gameID });
              if (!$scope.modalShown) {
                setTimeout(() => {
                  const link = document.URL;
                  const txt = `Give the following link to 
                your friends so they can join your game: `;
                  $('#lobby-how-to-play').text(txt); //eslint-disable-line
                  $('#oh-el').css({                 //eslint-disable-line
                    'text-align': 'center',
                    'font-size': '22px',
                    background: 'white',
                    color: 'black'
                  }).text(link);
                }, 200);
                $scope.modalShown = true;
              }
            }
          }
        });

        if ($location.search().game && !(/^\d+$/).test(
          $location.search().game)) {
          game.joinGame(
            'joinGame',
            $location.search().game,
            null,
            localStorage.getItem('region')); // add region in localstorage
        } else if ($location.search().custom) {
          game.joinGame('joinGame', null, true, localStorage.getItem('region'));
        } else {
          game.joinGame(null, null, null, localStorage.getItem('region'));
        }
      }]);
