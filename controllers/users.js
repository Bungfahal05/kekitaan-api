const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const {detail, create, remove, get, update} = require('../models/User');

// Register
exports.register = (req, res) => {
  //accept only admin
  // if(!req.user || req.user.group !== 'ADMIN') return res.json({status: 2, message: 'Access denied'});

  const { name, email, password, password2, group } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    return res.json({status:2, message: 'fail to create user', errors });
  }

  detail({ email: email }).then((user) => {
    if (user) {
      return res.json({status:2, message: 'Email already registered' });
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          console.log('register', err);
          return res.json({status:3, message: 'fail to create user' });
        }
        create({name, email, password: hash, group}).then(user => {
          res.json({status:1, message: 'Success create user', user });
        })
        .catch((err) => {
          console.log('register', err);
          return res.json({status:3, message: 'fail to create user' });
        });
      });
    });
  });
};

// Login
exports.login = (req, res) => {
  const { email, password } = req.body;
  detail({email}).then(user => {
    if (!user) {
      return res.json({status:2, message: 'That email is not registered' });
    }

    // Match password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.log('login', err);
        return res.json({ status:2, message: 'Login fail' });
      }
      if (isMatch) {
        res.json({
          stat:1,
          message:'Login OK',
          user,
          token: jwt.encode(user, process.env.JWT_SECRET)
        });
      } else {
        res.json({status: 2, message: 'Password incorrect' });
      }
    });
  }).catch(err => {
    console.log('login', err);
    res.json({ status:3, message: 'Service not available, please try again' });
  })
};

// Get user
exports.get = (req, res) => {
  if(!req.user) return res.json({status: 2, message: 'Access denied'});
  const {search, group, page: p, limit: l, sort} = req.query;
  const limit = Number(l)  || 10;
  const page = Number(p) || 1;

  const query = { offset: limit * (page - 1), limit};
  if(search) query['$or'] = [
    { name: { '$regex': search, '$options': 'i' } },
    { email: { '$regex': search, '$options': 'i' } }
  ];
  if(group) query.group = group;

  get(query).then(data => {
    res.json({status:1, message: 'Success get user', data });
  }).catch(err => {
    console.log('get', err);
    res.json({ status:3, message: 'Service not available, please try again' });
  })
};

// Update user
exports.update = (req, res) => {
  if(!req.user) return res.json({status: 2, message: 'Access denied'});
  const _id = req.params.id;
  const { name, password, password2, password0, group } = req.body;

  const data = {};
  function do_update() {
    update({_id}, data).then(() => {
      res.json({status:1, message: 'Success update user' });
    }).catch(err => {
      console.log('update', err);
      res.json({ status:3, message: 'Service not available, please try again' });
    })
  }
  if(name) data.name = name;
  if(group) data.group = group;
  if(password) {
    if(password.length < 6) return res.json({status: 2, message: 'Password must be at least 6 characters'});

    function do_hash() {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            console.log('update', err);
            return res.json({status:3, message: 'fail to update user' });
          }
          data.password = hash;
          do_update();
        });
      });
    }

    if(req.user._id === _id) {
      if(!password0) return res.json({status: 2, message: 'Please enter your current password'});
      if(password != password2) return res.json({status: 2, message: 'Passwords do not match'});
      detail({_id}).then(user => {
        bcrypt.compare(password0, user.password, (err, isMatch) => {
          if (err) {
            console.log('update', err);
            return res.json({ status:2, message: 'Update fail' });
          }
          if (isMatch) {
            do_hash();
          } else {
            res.json({status: 2, message: 'Password incorrect' });
          }
        });
      }).catch(err => {
        console.log('update', err);
        res.json({ status:3, message: 'Service not available, please try again' });
      });
    } else {
      do_hash();
    }
  } else {
    do_update();
  }
};

// Delete
exports.remove = (req, res) => {
  let query;
  if(Array.isArray(req.params.id)) {
    query = { _id: { $in: req.params.id } };
  } else {
    query = { _id: req.params.id };
  }

  remove(query).then(data => {
    res.json({status:1, message: 'Success delete user', data });
  }).catch(err => {
    console.log(err);
    res.json({status:3, message: 'fail to delete user' });
  });
};
