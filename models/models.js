const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reactionSchema = require('./Reaction');
const moment = require('moment');

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: 'Username is Required'
  },

  email: {
    type: String,
    validate: {
      validator: () => Promise.resolve(true),
      message: 'Email validation failed'
    },
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  thoughts: [{ type: Schema.Types.ObjectId, ref: 'Thought' }],
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }]
},
{
  toJSON: {
      virtuals: true
  },
  id: false
});

UserSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

const ThoughtSchema = new Schema({
  thoughtText: {
    type: String,
    unique: true,
    trim: true,
    required: 'Thoughts are Required',
    minLength: 1,
    maxLength: 280
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
  },
  username: {
    type: String,
    required: "Username is required"
  },
  reactions: [reactionSchema]
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: true

});

ThoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});


const User = mongoose.model('User', UserSchema);

const Thought = mongoose.model('Thought', ThoughtSchema);

module.exports = User, Thought;