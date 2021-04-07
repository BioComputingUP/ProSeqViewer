# TypeScript Sequence Viewer

Represent biological data with the sequence viewer library! Used in [MobiDB](http://mobidb.bio.unipd.it/),
[DisProt](http://www.disprot.org/) and [RepeatsDB](http://repeatsdb.bio.unipd.it/).

This is a code repository for the BioComputingUP Sequence Viewer project.
Full documentation is available at: [sequence-viewer-typescript](https://biocomputingup.github.io/sequence-viewer-documentation/).

This version is based on [Typescript](https://www.typescriptlang.org/) and compatible with [Angular 2+](https://angular.io/) framework.
A Javascript version of the package is also available (see the documentation at [sequence-viewer-typescript](https://biocomputingup.github.io/sequence-viewer-documentation/) for more info).

[comment]: <> (demo image)
[comment]: <> (![Sequence Viewer]&#40;https://github.com/mb925/sequence-viewer-typescript/blob/master/src/assets/sqvDemo.png&#41;)

## Getting started

### Javascript installation
1. Download the sequence viewer stylesheet
You can find the <i>sqv.css</i> file in the src/assets folder on this Github repo.

2. Download the library code
   You can find the <i>sqv-bundle.js</i> file in the dist folder on this Github repo.

3. In your index.html:
``` html 
<head>
  <link rel="stylesheet" type="text/css" href="sqv.css">
</head>
<body>


<div id="sqv"></div>

<script src="sqv-bundle.js"></script>
<script>

  const seqs = [
    {sequence: 'MVLSPADKVGAH--RMFLSFPTTKTYF--LS', id: 1, label: 'sp|P69905|HBA_HUMAN'}
  ];
  // Create an instance of the sequence viewer in javascript
  const sequenceviewer = new SequenceViewer('sqv'); 
  sequenceviewer.draw(sequence);
  
</script>

</body>
```
### Angular installation

1 Install the library using npm
```
npm install sequence-viewer-typescript
```

2 Import the sequence viewer in javascript or your angular component
```typescript
import {SequenceViewer} from 'sequence-viewer-typescript/dist';
```

3 Load the feature viewer stylesheet in your angular.json "styles".
```json
styles: [
    "./node_modules/sequence-viewer-typescript/dist/assets/sqv.css"
]
```

4 Place the sequence viewer in your html
```html
 <div id="sqv"></div>
```

5 Create an instance of the sequence viewer in your component, add inputs and execute
```typescript
 const seqs = [
  {sequence: 'MVLSPADKTNVGAH--RMFLSFPTTKTYF--LSHGG', id: 1, label: 'sp|P69905|HBA_HUMAN'}
  ];
  const sequenceviewer = new SequenceViewer('sqv');
  sequenceviewer.draw(sequence);
```


## Compiler

This package ECMAScript target version is: es2015.

## Dependencies

* [Typescript](https://www.typescriptlang.org/)


## Development

`git clone https://github.com/BioComputingUP/sequence-viewer-typescript.git`

`npm install`  (will install the development dependencies)

...make your changes and modifications...

`npm run build` (will create the bundle js files)

`npm run postbuild` (will move assets files in dist/)

`npm run wp` (will create the sqv-bundle.js file in dist/)

`npm run post wp` (will edit the bundle file to make it work)

This commands can be found in package.json

## Support

If you have any problem or suggestion please open an issue.

## License

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public
License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later
version.
