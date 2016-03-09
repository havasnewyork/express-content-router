var express = require('express')
	router = express.Router(),
	request = require('supertest'),
	routerFunc = require('../index'),
    _ = require('underscore'),
	assert = require('assert'),
	should = require('should'),
	dirPath = __dirname + "/../example-content",
	contentObj = require('require-dir')(dirPath, {recurse: true});

var path          = require('path');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var routes = routerFunc(dirPath, {sitemap:"sitemap"}),
	routesLength = routes.stack.length;

app.use('/', routes);

// Test content directory exist and returns an object
describe('Test 1: Test if the content directory exist and returns an object', function(){
	it('Test 1.1: should be an Object type with properties', function(done){
		contentObj.should.be.an.instanceOf(Object).and.have.property('index');
		contentObj.should.be.an.instanceOf(Object).and.have.property('government');
		contentObj.should.be.an.instanceOf(Object).and.have.property('health');
		contentObj.should.be.an.instanceOf(Object).and.have.property('technology');
		contentObj.should.be.an.instanceOf(Object).and.have.property('about');
		contentObj.should.be.an.instanceOf(Object).and.have.property('index-one');
		done();
	});
});

// Test if router exists and is well defined
describe('Test 2: test if the routesFunc returns a router', function(){

	it('Test 2.1: and router should be an instance of Function', function(done){
		var routerFuncInstance = routes instanceof Function;
		var routerInstance = router instanceof Function;

		(routerFuncInstance).should.match(routerInstance);
		done();
	});

	it('Test 2.2: and it should have a property stack, and the length should be greater than 0', function(done){
		(routesLength).should.be.above(0);
		done();
	});

	it('Test 2.3: and the stack[] property should have objects', function(done){
		routes.should.matchAny(function(value){
			value.should.be.an.instanceOf(Object);
		});
		done();
	});

	it('Test 2.4: and paths render status 200', function(done){
		// console.log("routes.stack:",routes.stack);
		_.each(routes.stack, function(val, key){
			// var app = require('../app');
			console.log('test:', key, val.route.path);
			// console.log(contentObj);
			// var contentPath = val.route.path.split('/');
			// var pageContent = contentPath.reduce(fn, )
			request(app)
				.get(val.route.path)
				// .expect(function(res){
					// console.log(res.text);
					// res.text.indexOf('<p>''</p>')
				// })
				.expect(200)
				.end();
		});
		done();
	});

});