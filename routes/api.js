/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var ThreadController = require('../controllers/threadHandler.js');
var threadHandler = new ThreadController();

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .get(function (req, res){
      threadHandler
        .getRecentThreads(req.params.board)
        .then(function(threads) {
          res.json(threads);
        });
    });
  
  app.route('/api/replies/:board')
    .get(function (req, res){
      if (!req.query.thread_id) {
        res.send("Please provide all required fields");
      } else {
        threadHandler
          .getThread(req.query.thread_id)
          .then(function(thread) {
            res.json(thread);
          });
      }
    });
    
  app.route('/api/threads/:board')
    .post(function (req, res) {
      if (!req.body.text || !req.body.delete_password) {
        res.send("Please provide all required fields");
      } else {
        threadHandler
          .postThread(req.params.board, req.body.text, req.body.delete_password)
          .then(function(thread) {
            res.json(thread);
          });
      }
    });
  
  app.route('/api/replies/:board')
    .post(function (req, res) {
      if (!req.body.text || !req.body.delete_password || !req.body.thread_id) {
        res.send("Please provide all required fields");
      } else {
        threadHandler
          .postReply(req.body.thread_id, req.body.text, req.body.delete_password)
          .then(function(thread) {
            res.json(thread);
          });
      }
    });
  
  app.route('/api/threads/:board')
    .delete(function (req, res) {
      if (!req.body.thread_id || !req.body.delete_password) {
        res.send("Please provide all required fields");
      } else {
        threadHandler
          .deleteThread(req.body.thread_id, req.body.delete_password)
          .then(function() {
            res.send("success");
          }, function() {
            res.send("incorrect password");
          });
      }
    });
  
  app.route('/api/replies/:board')
    .delete(function (req, res) {
      if (!req.body.thread_id || !req.body.reply_id || !req.body.delete_password) {
        res.send("Please provide all required fields");
      } else {
        threadHandler
          .deleteReply(req.body.thread_id, req.body.reply_id, req.body.delete_password)
          .then(function() {
            res.send("success");
          }, function() {
            res.send("incorrect password");
          });
      }
    });
  
  app.route('/api/threads/:board')
    .put(function (req, res) {
      if (!req.body.thread_id) {
        res.send("Please provide all required fields");
      } else {
        threadHandler
          .reportThread(req.body.thread_id)
          .then(function() {
            res.send("success");
          }, function() {
            res.send("failure");
          });
      }
    });
  
  app.route('/api/replies/:board')
    .put(function (req, res) {
      if (!req.body.thread_id || !req.body.reply_id) {
        res.send("Please provide all required fields");
      } else {
        threadHandler
          .reportReply(req.body.thread_id, req.body.reply_id)
          .then(function() {
            res.send("success");
          }, function() {
            res.send("failure");
          });
      }
    });

};
