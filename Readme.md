# xcode-node

A node js module to handle and manipulate iOS .pbxproj files easily.

![alt .pbxproj image](https://raw.githubusercontent.com/bberthelemy/xcode-node/master/assets/pbxproj.png)

## Install
`npm install xcode-node --save`

(not yet on npmjs, for now just clone this repository)

## Documentation
[https://bberthelemy.github.io/xcode-node]()

## Build and run from sources
```
$ npm run prepublish
$ node lib/index.js
```

## Generate documentation
`$ npm run generate-docs`

## Roadmap
- [X] <span style="color:lightgreen">File reading and saving/writing</span>
- [X] <span style="color:lightgreen">Retrieve project basics and targets</span>
- [X] <span style="color:lightgreen">Retrieve build configurations (project + targets)</span>
- [X] <span style="color:lightgreen">Duplicate configurations (project + targets)</span>
- [X] <span style="color:lightgreen">Set user-defined variables (project + targets)</span>
- [X] <span style="color:lightgreen">Set headers' search path (project + targets)</span>
- [ ] <span style="color:red">More targets manipulations (remove, rename ...)</span>
- [ ] <span style="color:red">More build configuration manipulations (other important properties, remove, create from scratch ...)</span>
- [ ] <span style="color:red">Manage schemes</span>
- [ ] <span style="color:red">Manage dependencies (libraries, frameworks ...)</span>
- [ ] <span style="color:red">Manage file structure + groups</span>
- [ ] <span style="color:red">Manage build phases</span>
- [ ] <span style="color:red">DEFINE THE ROADMAP MORE PRECISELY</span>
