/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

var testThread1Id, testThread2Id, testReplyId;

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('POST a thread', function(done) {
       chai.request(server)
        .post('/api/threads/testboard')
        .send({text: 'Test text', delete_password: 'password'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body, '_id');
          assert.property(res.body, 'board');
          assert.property(res.body, 'text');
          assert.property(res.body, 'created_on');
          assert.equal(res.body.board, 'testboard');
          assert.equal(res.body.text, 'Test text');
          assert.equal(res.body.delete_password, 'password');
          testThread1Id = res.body._id;
          done();
        });
       chai.request(server)
        .post('/api/threads/testboard')
        .send({text: 'Test text', delete_password: 'password'})
        .end(function(err, res) {
          testThread2Id = res.body._id; 
        })
      });
    });
    
    suite('GET', function() {
      test('GET recent threads', function(done) {
       chai.request(server)
        .get('/api/threads/testboard')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.isAtLeast(res.body.length, 1);
          assert.isAtMost(res.body.length, 10);
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'board');
          assert.property(res.body[0], 'text');
          done();
        });
      });
    });
    
    suite('DELETE', function() {
      test('DELETE thread', function(done) {
       chai.request(server)
        .delete('/api/threads/testboard')
        .send({thread_id: testThread1Id, delete_password: 'password'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
    });
    
    suite('PUT', function() {
      test('Report thread', function(done) {
       chai.request(server)
        .put('/api/threads/testboard')
        .send({thread_id: testThread2Id})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('POST a reply', function(done) {
       chai.request(server)
        .post('/api/replies/testboard')
        .send({text: 'Test text', delete_password: 'password', thread_id: testThread2Id})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.isArray(res.body.replies);
          assert.property(res.body.replies[0], '_id');
          assert.property(res.body.replies[0], 'text');
          assert.property(res.body.replies[0], 'created_on');
          assert.equal(res.body.replies[0].text, 'Test text');          
          assert.equal(res.body.replies[0].delete_password, 'password');
          testReplyId = res.body.replies[0]._id;
          done();
        });
      });
    });
    
    suite('GET', function() {
      test('GET all replies in a thread', function(done) {
       chai.request(server)
        .get('/api/replies/testboard')
        .query({thread_id: testThread2Id})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body, '_id');
          assert.property(res.body, 'board');
          assert.property(res.body, 'text');
          assert.property(res.body, 'replies');
          assert.isAtLeast(res.body.replies.length, 1);
          done();
        });
      });
    });
    
    suite('PUT', function() {
      test('Report reply', function(done) {
       chai.request(server)
        .put('/api/replies/testboard')
        .send({thread_id: testThread2Id, reply_id: testReplyId})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
    });
    
    suite('DELETE', function() {
      test('DELETE reply', function(done) {
       chai.request(server)
        .delete('/api/replies/testboard')
        .send({thread_id: testThread2Id, reply_id: testReplyId, delete_password: 'password'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
    });
    
  });

});
