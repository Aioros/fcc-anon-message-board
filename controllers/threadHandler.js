'use strict';

const mongoose = require('mongoose')
const request = require('request');
const shortid = require('shortid');
const CONNECTION_STRING = process.env.DB;

const Schema = mongoose.Schema;
const replySchema = new Schema({
  _id: {type: String, default: shortid.generate},
  text: {type: String, required: true},
  created_on: Date,
  reported: {type: Boolean, default: false},
  delete_password: {type: String, required: true}  
});
const threadSchema = new Schema({
  _id: {type: String, default: shortid.generate},
  board: {type: String, required: true},
  text: {type: String, required: true},
  created_on: Date,
  bumped_on: Date,
  reported: {type: Boolean, default: false},
  delete_password: {type: String, required: true},
  replies: [replySchema]
});

const db = mongoose.createConnection(CONNECTION_STRING);
const Thread = db.model('Thread', threadSchema);
const Reply = db.model('Reply', replySchema);

module.exports = function() {
  
  this.postThread = function(board, text, delete_password) {
    return Thread.create({board, text, delete_password, created_on: Date.now(), bumped_on: Date.now()});
  };
  
  this.postReply = function(thread_id, text, delete_password) {
    return Thread.findById(thread_id)
      .then(thread => {
        var reply = new Reply({text, delete_password, created_on: Date.now()});
        thread.replies.push(reply);
        thread.bumped_on = Date.now();
        return thread.save();
      });
  };
  
  this.getThread = function(thread_id) {
    return Thread.findById(thread_id).select("-reported -delete_password -__v")
      .then(thread => {
        thread.replies = thread.replies.map(r => ({_id: r._id, text: r.text, created_on: r.created_on}));
        return thread;
      });
  };
  
  this.getRecentThreads = function(board) {
    return Thread.find().sort({bumped_on: "desc"}).select("-reported -delete_password -__v").limit(10)
      .then(threads => {
        threads.forEach(t => {
          t.replies = t.replies
            .sort((r1, r2) => r2.created_on - r1.created_on)
            .slice(0, 3)
            .map(r => ({_id: r._id, text: r.text, created_on: r.created_on}));          
        });
        return threads;
      });
  };
  
  this.deleteThread = function(thread_id, delete_password) {
    return Thread.findById(thread_id)
      .then((thread) => {
        if (thread.delete_password == delete_password) {
          return Thread.findByIdAndDelete(thread._id);
        } else {
          throw new Error('wrong password');
        }
      });
  };
  
  this.deleteReply = function(thread_id, reply_id, delete_password) {
    return Thread.findById(thread_id)
      .then((thread) => {
        var reply =  thread.replies.find(r => r._id == reply_id);
        if (reply.delete_password == delete_password) {
          reply.text = "[deleted]";
          return thread.save();
        } else {
          throw new Error('wrong password');
        }
      });
  };
  
  this.reportThread = function(thread_id) {
    return Thread.findByIdAndUpdate(thread_id, {reported: true});
  };
  
  this.reportReply = function(thread_id, reply_id) {
    return Thread.findById(thread_id)
      .then(thread => {
        thread.replies.find(r => r.id == reply_id).reported = true;
        return thread.save();
      });
  };
  
};