import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers.token;
  if (token) {
  // verifies secret and checks exp
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
      if (err) { // failed verification.
        return res.json({ error: true, no_valid: 'non valid token' });
      }
      req.decoded = decoded;
      next(); // no error, proceed
    });
  } else {
    // forbidden without token
    return res.status(403).send({
      error: true,
      no_valid: 'No token'
    });
  }
};
