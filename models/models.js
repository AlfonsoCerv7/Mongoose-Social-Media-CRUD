const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
      validator: () => Promise.resolve(false),
      message: 'Email validation failed'
    },
    trim: true,
    unique: true,
    required: 'Password is Required',
    minlength: 6
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

userSchema.virtual('friendCount').get(function() {
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
    id: false

});

thoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

const reactionSchema = new Schema({
  reactionId: {
      type: Types.ObjectId,
      default: new Types.ObjectId()
  },
  reactionBody: {
      type: String,
      required: true,
      maxLength: 280
  },
  username: {
      type: String,
      required: true
  },
  createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
  }
},
{
  toJSON: {
      getters: true
  },
  id: false
});

const User = mongoose.model('User', UserSchema);

const Thought = mongoose.model('Thought', ThoughtSchema);

const Reaction = mongoose.model('Reaction', reactionSchema);

module.exports = User, Thought, Reaction;