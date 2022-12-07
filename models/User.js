const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  group: {
    type: String,
    enum : ['USER','ADMIN'],
    default: 'USER'
  }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

exports.create =  async (data) => {
  return User.create(data);
};

exports.get =  async function({offset,limit,...filter}) {
  return User.find(filter).skip(offset).limit(limit);
}

exports.detail = async (query) => {
  return User.findOne(query);
}

exports.update = async (query, data) => {
  return User.updateMany(query, data);
}

exports.remove = async (query) => {
  return User.deleteMany(query);
}