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



// var Browser = require('zombie');

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

    it('Test 2.4: should render correct content on expected pages', function() {
        request(app).get('/index.html')
            .expect(200)
            .expect(/Text Main homepage/)
            .end();
        request(app).get('/about.html')
            .expect(200)
            .expect(/ABOUT Main homepage/)
            .end();
        request(app).get('/government/gov-one.html')
            .expect(200)
            .expect(/Text for Gov One page/)
            .end();
        request(app).get('/government/gov-two.html')
            .expect(200)
            .expect(/Text for Gov Two page/)
            .end();
    });

});
