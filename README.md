# express-content-router

Generate an express.js router object from a specially formed directory of content object files.

Expects to be used at any mount point as an express router.

Basic usage:
    
    var app = express();
    var router = require('express-content-router')(__dirname + "/content");
    app.use('/mountpoint/', router);

Also supports an options hash as the second param. Currently only option supported is "sitemap" which should be a valid express view file name reference, to render a test sitemap page at the /sitemap path.

## Content Structure

Content is specified in a specific directory, and the actual directory structure determines the page URLs. 

Example:

You want an /index.html and /about-us/index.html to be the URLs on your application.

Your directory structure would be the following:

    /content/index.js
    /content/about-us/index.js

Any level of nesting can be used.

**One important caveat** - Don't name a file the same thing as a directory at the same level - the directory's content will overwrite the file. This is due to the default behavior of the [require-dir](https://www.npmjs.com/package/require-dir#options) module with respect to recursion.

If you do want to have similarly named URLs generated from a filename and directory (both /about.html and /about/detail.html for example), prefix the filename with "@" to avoid the conflict. The library will compensate and generate the expected URL paths.

If you want to have individual blocks of content that are shared between pages (common header/footer, contact, etc), you can put that directly in an underscore-prefixed file at any level, and require it in your main page content object. The underscored files will be ignored by the router, but will be required into each page automatically.
    
    ... directory setup

    /content/_footer-links.js
    /content/page.js

    ... and in page.js

    module.exports = {
        ...
        content: {
            footerLinks: require('./_footer-links')
        }
    }

## Page Object Spec

An object that defines a page should resemble the following:

    module.exports = {
        // view defines the express view file in your application to render this page
        view: "view-file-name",
        // page title is used for the <head><title> content
        title: "Page Title",
        // content is passed to the express view template for rendering
        // can contain whatever you need for your project.
        content: {
            title: "My Awesome Page",
            leadParagraph: "Isn't it awesome?"
        }
    }


## Roadmap / TODOs


* Support more features and auto-generated content for building page navigation structures.

* Support meta tag definition in the page spec

* Global configuration scheme for common site things across all pages. Meta tags, Titles, navigation

* Support storing content in a database of some kind instead of the file system.

* Support passing in optional global properties for view rendering

* Option flag to auto-generate navigation object data

