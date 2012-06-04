## First Run

- In your terminal, navigate to this folder.
- Type `git submodule init && git submodule update` to grab the Odin and Emberwind demos.
- Type `npm install .`
- Type `node .` to get the files in the `deploy` folder.
- Click on `deploy/index.html` to start navigating the demos

## Running Tests

If you install the vows binary (`npm install -g vows` should do it for you), you can do something like `vows test/* --spec`

## Remember

- All demos need to have their associated data in `config.yaml` file.
- All demos should be within `<demo-slug>/index.html` page.
- `<devo>` loves you
