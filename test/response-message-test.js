/*
Mocha test
Tests that note array is broken up correctly
*/

var Chai            = require('chai'),
    Hapi            = require('hapi'),
    Joi             = require('joi'),
    Inert           = require('inert'),
    Vision          = require('vision'),
    HapiSwagger     = require('../lib/index.js');
    assert          = Chai.assert;
    

var defaultHandler = function(request, response) {
  reply('ok');
};

var response1 = [
        { code: 400, message: 'Bad Request' },
        { code: 500, message: 'Internal Server Error'}
    ];

describe('response messages test', function() {

    var server;

    beforeEach(function(done) {
      server = new Hapi.Server();
      server.connection();
      server.register([Inert, Vision, HapiSwagger], function(err){
        server.start(function(err){
          assert.ifError(err);
          done();
        });
      });
    });
  
    afterEach(function(done) {
      server.stop(function() {
        server = null;
        done();
      });
    });


    it('reads from route config', function(done) {
      server.route({
        method: 'GET',
        path: '/test',
        handler: defaultHandler,
        config: {
          tags: ['api'],
          plugins: {
            'hapi-swagger': {
              responseMessages: response1
            }
          }
        }
      });
      server.inject({ method: 'GET', url: '/docs?path=test '}, function (response) {
        var messages = response.result.apis[0].operations[0].responseMessages;
        assert.equal(messages.length, 2);
        assert.equal(messages[0].code, 400);
        done();
      });
    });
});
