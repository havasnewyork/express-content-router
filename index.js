var router = require('express').Router(),
    _ = require('underscore');

// DEFINE DEFAULTS
var basePath = "/",
    allPaths = [];

// build up a 'page navigation' object from the page data, suitable for rendering
var navigationData = {};
var routerOptions;

var handler = function (req, res) {
    // Issue with this object is defined as the content object
    // instead of the the binding elems from the addRoutes function
    // console.log('handing a page request:', allPaths);
    res.render(this.view, {
        content: this.content,
        navigation: navigationData
    });
};

var addroute = function (path, data) {
    allPaths.push({ url: path.replace(/^\//, '') }); // relative links for sitemap
    // console.log("ADDROUTE:", path);
    router.get(path, handler.bind(data));

    return { url: data.optional_path || path, label: data.title }; // return our nav fragment
}

var addRoutes = function (contentObj, navData, parentDir) {
    // console.log('content element:', contentObj);
    _.each(contentObj, function (pageData, pathFragment) {

        // only test we need is if the content object exists
        // and is not an underscore-prefixed fragment object...
        if (/^_/.test(pathFragment)) return;

        pathFragment = pathFragment.replace(/^@/, '');
        pDir = parentDir ? parentDir : "";
        // console.log('page content for:', pathFragment);
        if (pageData.content) { //
            // pathFragment replace @ prefix if present, to avoid file VS directory conflicts
            pathFragment = pathFragment.replace(/^@/, '');
            var path = basePath + pdir + pathFragment + '.html';
            navData[pathFragment] = addroute(path, pageData);
        } else {
            // console.log('adding sub routes:', pathFragment, pageData);
            navData[pathFragment] = navData[pathFragment] || {};
            // could check for a secondary key or path in pageData.isIndexPage - render as path/
            addRoutes(pageData, navData[pathFragment], pDir + pathFragment + "/");
        }
    });

    return router;
};

module.exports = function (contentDir, options) {
    routerOptions = options || {};
    var content = require('require-dir')(contentDir, { recurse: true });

    // console.log('nav data start:', navigationData);
    var ourRouter = addRoutes(content, navigationData);
    // console.log('nav data check', navigationData);
    if (routerOptions.sitemap) {
        ourRouter.get("/sitemap", handler.bind({ view: routerOptions.sitemap, content: { sitemap: allPaths } }));
    }
    return ourRouter;
}
