process.env.NODE_ENV = 'test';
var express = require('express'),
    router = express.Router(),
    http = require('http'),
    request = require('supertest'),
    routerFunc = require('../index'),
    _ = require('underscore'),
    assert = require('assert'),
    should = require('should'),
    dirPath = __dirname + "/../example-content",
    contentObj = require('require-dir')(dirPath, { recurse: true });

var Browser = require('zombie');

var path = require('path');
var app = express();
var port = process.env.port || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var routes = routerFunc(dirPath, { sitemap: "sitemap" }),
    routesLength = routes.stack.length;

app.use('/', routes);

// Test content directory exist and returns an object
describe('Test 1: s', function () {
    it('Test 1.1: should be an Object type with properties', function (done) {
        _.each(contentObj, function (Obj, key) {
            Obj.should.be.an.instanceOf(Object);
            contentObj.should.have.property(key);
        });
        done();
    });
});

// Test if router exists and is well defined
describe('Test 2: test if the routesFunc returns a router', function () {

    it('Test 2.1: and router should be an instance of Function', function (done) {
        var routerFuncInstance = routes instanceof Function;
        var routerInstance = router instanceof Function;

        (routerFuncInstance).should.match(routerInstance);
        done();
    });

    it('Test 2.2: and it should have a property stack, and the length should be greater than 0', function (done) {
        (routesLength).should.be.above(0);
        done();
    });

    it('Test 2.3: and the stack[] property should have objects', function (done) {
        routes.should.matchAny(function (value) {
            value.should.be.an.instanceOf(Object);
        });
        done();
    });

    it('Test 2.4: and paths render status 200', function (done) {
        // console.log("routes.stack:",routes.stack);
        _.each(routes.stack, function (pathObj, path) {
            // var app = require('../app');
            // console.log( 'test:', key, val.route.path );
            // console.log(contentObj);
            // var contentPath = val.route.path.split('/');
            // var pageContent = contentPath.reduce(fn, )
            request(app)
                .get(pathObj.route.path)
                .expect(function (err, res) {
                    // console.log( res.text );
                    // res.text.indexOf('<p>''</p>')
                })
                .expect(200)
                .end();
        });
        done();
    });
});

// TODO tests for @ and _ prefixed functions

// TODO tests for navigation object rendering
describe('Test 3: Test each page renders and has title', function () {
    console.log("describe callback called:");

    var browser = this.browser;
    var server = this.server;

    // beforeEach(function(done) {
    // 	console.log("before called:");
    // });

    it('Test 3.1: test all pages for specific content', function (done) {
      	// console.log("it called:");
      server = http.createServer(app).listen(3000);
        _.each(routes.stack, function (pathObj, path) {
        	console.log("Each called:");
        	return (function(pObj, path){
	        		console.log("Annon called:");
	        		browser = new Browser({ site: 'http://localhost:3000'});
	            	browser
	            	    .visit(pObj.route.path, function () {
	                	    console.log("path inside: ", path);
	                    	// (browser.success).should.be.ok();
	                    	assert.ok(browser.success);
	                    	assert.equal(browser.text('title'), 'TEST');
	                    	// should.equal(browser.text('title'), 'TEST'); //Pass Test
	                    	// should.equal(browser.text('title'), 'NA'); //Fail Test
	                   		console.log("vist callback:");
	                   		done(); // With this done it fires the test Pass and  Fail test
	            	});
        	})(pathObj, path);
        	// done(); // With this done the test complains of done() firing to many times
        });
        // done(); // This done passes the test without fail or Pass check - not working
    });

    // afterEach(function (done) {
    // 	console.log("after called:");
    //     server.close(done);
    // });
});
