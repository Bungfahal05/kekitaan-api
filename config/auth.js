const jwt = require('jwt-simple');

module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/users/login');
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');      
  },
  authCheck: (req, res, next) => {
    if ('OPTIONS' == req.method) return res.sendStatus(200);
    let token;
    if(req.headers[process.env.TOKEN_HEADER]) token = req.headers[process.env.TOKEN_HEADER];
    if(token) {
      try{
        req.user = jwt.decode(token.substr(7), process.env.JWT_SECRET) || console.log('err');
        req.inGroup = function(str, pri){
          if((','+str+',').indexOf(','+req.user.group_id+',') > -1) return true;
          if(pri) return false;
          // if optional group2 is passed, check that too
          if((','+str+',').indexOf(','+req.user.group2_id+',') > -1) return true;
          return false;
        };
        return next();
      }
      catch(e){
        console.log('jwt error:',e);
      }
    }
    next();
  },
};
