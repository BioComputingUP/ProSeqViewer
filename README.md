# ProSeqViewer

This is a code repository for the BioComputingUP ProSeqViewer project.
Full documentation is work in progress and will be available at: https://biocomputingup.github.io/ProSeqViewer-documentation/.

This version is based on [Typescript](https://www.typescriptlang.org/) and compatible with [Angular 2+](https://angular.io/) framework.

Represent biological data with the ProSeqViewer library! Used in [MobiDB](http://mobidb.bio.unipd.it/),
[DisProt](http://www.disprot.org/) and [RepeatsDB](http://repeatsdb.bio.unipd.it/).

## Dependencies

* [Typescript](https://www.typescriptlang.org/)


[comment]: <> (## Output demo)

[comment]: <> (![ProSeqViewer]&#40;src/assets/sqvDemo.png&#41;)

## Getting started

1 Install the library using npm
```
npm install proseqviewer
```

2 Import the ProSeqViewer in javascript or your angular component
```typescript
import {ProSeqViewer} from 'proseqviewer/dist';
```

3 Optional: if you are installing the feature viewer in an Angular 2+ based App, you may
need to load the feature viewer stylesheet in your angular.json "styles" to
ensure the correct prioritization of stylesheets.
```json
styles: [
    "./node_modules/proseqviewer/dist/assets/proseqviewer.css"
]
```

4 Place the ProSeqViewer in your html
```html
 <div id="psv"></div>
```

5 Create an instance of the ProSeqViewer in javascript and style it
```typescript
this.proseqviewer = new ProSeqViewer('psv');
```

6 Add inputs -- here an example with minimum required input, for the full list of input settings options check GitHub documentation --.
```typescript
 this.sequences = [{sequence: 'DFRLE--F---'}]
```
7 Execute the function to draw the ProSeqVieweriewer on the page
```typescript
 this.proseqviewer.draw(this.sequences);
```

## Support

If you have any problem or suggestion please open an issue.

## License

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public
License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later
version.
