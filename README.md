## First Run

- In your terminal, navigate to this folder.
- Type `git submodule init && git submodule update` to grab the Odin and Emberwind demos.
- Type `npm install`
- Type `jake build` to build the site and put compiled demos in `deploy/`
- Start a local server and begin at `deploy/index.html` to navigate the demos

## Running Tests

There are two Jake tasks for running tests:

  * `jake test`: run the unit test suite.
  * `jake test:config`: run the config tests over every entry in `config.yaml` (the unit tests only test a subset).
  
## Deploying the site

There are two Jake tasks for deploying the site:

 * `jake deploy:dev`: deploys to dev.shinydemos.com, for manual testing and future versions of the site.
 * `jake deploy:prod`: deploys to shinydemos.com.
 
 Note: this will only work if you have access to the deploy script repo and have ssh keys in the right place, i.e., you probably can forget this exists.

## Remember

- All demos need to have their associated data in `config.yaml` file.
- Checking in large binary files into the repo makes `<devo>` sad. :(
- All demos should live on a `<demo-slug>/index.html` page
