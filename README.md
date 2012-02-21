## First Run

- In your terminal, navigate to this folder.
- Type `npm install .`
- Type `node .` to get the files in the `deploy` folder.
- Click on `deploy/index.html` to start navigating the demos


## Remember

- All demos need to have their associated data in `config.yaml` file.
- All demos should be within `<demo-slug>/index.html` page. 
- You cannot have `document.write` as node's `fs.readFileSync` actually attempts to write into a `<html>` tag after the fact which screws with the manipulation of the demos to add browser support info.
- <devo> loves you
