var router = require('express').Router(),
    _ = require('underscore');

// DEFINE DEFAULTS
var basePath = "/",
    allPaths = [];

// TODO - build up a 'page navigation' object from the page data, suitable for rendering
var navigationData = {};

var handler = function(req, res) {
    // Issue with this object is defined as the content object
    // instead of the the binding elems from the addRoutes function
    console.log('handing a page request:', allPaths);
    res.render(this.view, {
        content: this.content
    });
};

var addroute = function(path, hdlr) {
  allPaths.push({url: path.replace(/^\//, '')}); // relative links for sitemap
  // console.log("ADDROUTE:", path);
  router.get(path, hdlr);
}

var addRoutes = function(contentObj, parentDir) {
    // console.log('content element:', contentObj);
    _.each(contentObj, function(pageData, pathFragment) {
        console.log('page content:',pageData, pathFragment);
        // only test we need is if the content object exists
        if (pageData.content) {
            var dirflPath = basePath + (parentDir ? parentDir : "") + pathFragment + '.html';
            addroute(dirflPath, handler.bind(pageData));    
        } else {
            console.log('adding sub routes:', pathFragment, pageData);
            addRoutes(pageData, pathFragment + "/");
        }
    });
    // console.log(allPaths);
    
    return router; // plz return it
};

module.exports = function(contentDir, options){
    options = options || {};
    var content = require('require-dir')(contentDir, {recurse: true});

    console.log('raw content:', content);
    var ourRouter = addRoutes(content);
    if (options.sitemap) {
        ourRouter.get("/sitemap", handler.bind({view: options.sitemap, content: {sitemap: allPaths}}));    
    }
    return ourRouter;
}
