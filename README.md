## Shiny Demos

Shiny Demos is a growing set of demos of the latest Open Web Standards, made by the Opera developer relations team. No browser is blocked: any browser that supports the standard sees the shiny!

Bug reports (and fixes via pull requests) are most welcome. 

In the very near future we'll outline how demos may be contributed.

### Requirements

* Node.js `0.6.X`+
* npm (bundled with Node.js)
* git

### First Run

- In your terminal, navigate to this folder.
- Type `git submodule init && git submodule update` to grab the Odin and Emberwind demos.
- Type `npm install`
- Type `jake build` to build the site and put compiled demos in `deploy/`
- Start a local server and begin at `deploy/index.html` to navigate the demos

Note: you'll probably get errors about not being able to patch Emberwind and Odin&mdash;this won't affect anything, however, unless you're trying to deploy the site.


### Running Tests

There are two Jake tasks for running tests:

  * `jake test`: run the unit test suite.
  * `jake test:config`: run the config tests over every entry in `config.yaml` (the unit tests only test a subset).
  
### Deploying the site

There are two Jake tasks for deploying the site:

 * `jake deploy:dev`: deploys to dev.shinydemos.com, for manual testing and future versions of the site.
 * `jake deploy:prod`: deploys to shinydemos.com.
 
 Note: this will only work if you have access to the deploy script repo and have ssh keys in the right place, i.e., you probably can forget this exists.

### Remember

- All demos need to have their associated data in `config.yaml` file.
- Checking in large binary files into the repo makes `<devo>` sad. :(
- All demos should live on a `<demo-slug>/index.html` page
- All demos need a thumbnail image at `source/thumbs` and the file name needs to match the slug.
