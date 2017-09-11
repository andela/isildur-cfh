/* global angular */
angular.module('mean.system')
  .controller('GameTourController', () => {
    const gameTour = introJs();
    gameTour.setOptions({
      steps: [{
        intro: `Hey there! Welcome to the Cards for Humanity game,
        I'm sure you're as excited as I am. Let me show you around.`
      },
      {
        element: '#question-container-outer',
        intro: `Game needs a minimum of 3 players and a maxium of
        11 players to start.
        Wait for the minimum number of players and start the game.`
      },
      {
        element: '#inner-info',
        intro: 'Here are the rules of the game.',
      },
      {
        element: '.pull-right button',
        intro: 'Click here to invite your friends',
      },
      {
        element: '.pull-left button',
        intro: 'When you\'re all set, click here to start the game.',
      },
      {
        element: '#inner-timer-container',
        intro: `You have just 20 seconds to submit an awesome answer.
        Your time will appear here.`
      },
      {
        element: '#player-container',
        intro: 'Players in the current game are shown here',
      },
      {
        element: '#abandon-game-button',
        intro: `I don't know why you'd wanna,
        but you can click this button to quit the game`
      },
      {
        element: '#inner-info',
        intro: 'The submitted answers will show here',
        position: 'top'
      },
      {
        element: '.chat',
        intro: 'Chat while the game is on here',
        position: 'top'
      },
      {
        element: '.pull-left button',
        intro: 'I know you can\'t wait to start. Let\'s go',
        position: 'top'
      }
      ]
    });

    setTimeout(() => {
      gameTour.start()
        .onexit(() => {
        });
    }, 500);
  });
