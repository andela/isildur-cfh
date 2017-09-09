/**
 * Module dependencies.
 */

/**
 * Redirect users to /#!/app (forcing Angular to reload the page)
 * @param {object} req request object
 * @param {object} res response object
 * @returns {void}
 */
exports.play = (req, res) => {
  if (Object.keys(req.query)[0] === 'custom') {
    res.redirect('/#!/app?custom');
  } else {
    res.redirect('/#!/app');
  }
};

exports.render = (req, res) => {
  res.render('index', {
    user: req.user ? JSON.stringify(req.user) : 'null'
  });
};

exports.tour = (req, res) => {
  res.redirect('/#!/gameTour');
};
