# TypeScript Sequence Viewer

Represent biological data with the sequence viewer library! Used in [MobiDB](http://mobidb.bio.unipd.it/),
[DisProt](http://www.disprot.org/) and [RepeatsDB](http://repeatsdb.bio.unipd.it/).

This is a code repository for the BioComputingUP Sequence Viewer project.
Full documentation is available at: [sequence-viewer-typescript](https://biocomputingup.github.io/sequence-viewer-documentation/).

This version is based on [Typescript](https://www.typescriptlang.org/) and compatible with [Angular 2+](https://angular.io/) framework.
A Javascript version of the package is also available (see the documentation at [sequence-viewer-typescript](https://biocomputingup.github.io/sequence-viewer-documentation/) for more info).

## Dependencies

* [Typescript](https://www.typescriptlang.org/)
* [Webpack](https://www.https://webpack.js.org/)


## Output demo

![Sequence Viewer](https://github.com/mb925/sequence-viewer-typescript/blob/master/src/assets/sqvDemo.png?raw=true)

## Getting started

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
    "./node_modules/sequence-viewer-typescript/dist/assets/sqv.scss"
]
```

4 Place the sequence viewer in your html
```html
 <div id="sqv"></div>
```

5 Create an instance of the sequence viewer in javascript and style it
```typescript
this.sequenceviewer = new SequenceViewer('sqv');
```

6 Add inputs -- here an example with minimum required input, for the full list of input settings options check github documentation --.
```typescript
 this.sequences = [{sequence: 'DFRLE--F---'}]
```
7 Execute the function to draw the sequence viewer on the page
```typescript
 this.sequenceviewer.draw(this.sequences);
```

## Support

If you have any problem or suggestion please open an issue.

## License

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public
License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later
version.
