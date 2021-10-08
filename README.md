
# ProSeqViewer

ProSeqViewer is a [TypeScript](https://www.typescriptlang.org/) library to visualize annotation
on single sequences and multiple sequence alignments.

![ProSeqViewer](figure.png?raw=true "ProSeqViewer")


ProSeqViewer can be integrated in both modern and dynamic frameworks like [Angular](https://angular.io/)
as well as in static HTML websites. It is used by [MobiDB](http://mobidb.bio.unipd.it/),
[DisProt](http://www.disprot.org/), [RepeatsDB](http://repeatsdb.bio.unipd.it/)

### ProSeqViewer features

* Generates pure HTML, compatible with any browser and operating system
* Easy to install
* Lightweight
* Zero dependencies
* Fast, able to render large alignments
* Interactive, capture mouse selections and clicks
* Responsive, dynamically adapt to window changes

## Documentation

Full documentation and examples are available [here](https://biocomputingup.github.io/ProSeqViewer-documentation/)



## Getting started

### JavaScript installation

Import the JavaScript bundle and CSS from local files
```html
<head>
    <link rel="stylesheet" type="text/css" href="sqv.css">
    <script src="sqv-bundle.js"></script>
</head>
```

Alternatively, import from GitHub
```html
<head>
    <link rel="stylesheet" type="text/css" href="https://rawgithub.com/BioComputingUP/ProSeqViewer/master/dist/assets/proseqviewer.css">
    <script src="https://rawgithub.com/BioComputingUP/ProSeqViewer/master/dist/sqv-bundle.js"></script>
</head>
```

Add component
```html
<body>
    <div id="psv"></div>
</body>
```

Create an instance
```html
<head>
    <!--Put this block at the end of your head section-->
    <script>
        const sequences = [
            {sequence: 'TLRAIENFYISNNKISDIPEFVR', id: 1, label: 'ASPA_ECOLI/13-156'},
            {sequence: 'TLRASENFPITGYKIHEE..MIN', id: 2, label: 'ASPA_BACSU/16-156'},
            {sequence: 'GTKFPRRIIWS............', id: 3, label: 'FUMC_SACS2/1-124'}
        ]

        // Input icons
        const icons = [
            {sequenceId: 1, start: 2, end: 2, icon: 'lollipop'},
            {sequenceId: 1, start: 13, end: 13, icon: 'lollipop'}
        ]

        // Options and configuration
        const options = {
            chunkSize: 0, 
            sequenceColor: 'clustal', 
            lateralIndexes: false
        };

        // Initialize the viewer
        const psv = new ProSeqViewer('psv');

        // Generate the HTML
        psv.draw({sequences, options, icons});
    </script>
</head>
```

### Angular installation

Install ProSeqViewer from npm
```
npm install proseqviewer
```

Add ProSeqViewer CSS to your angular.json file
```json
{
  styles: ["./node_modules/proseqviewer/dist/assets/proseqviewer.css"]
}
```

Import in your component
```typescript
import {ProSeqViewer} from 'proseqviewer/dist';
```

Add component to your page
```html
 <div id="psv"></div>
```

Create an instance in your component
```typescript
// Input sequences
const sequences = [
    {sequence: 'TLRAIENFYISNNKISDIPEFVR', id: 1, label: 'ASPA_ECOLI/13-156'},
    {sequence: 'TLRASENFPITGYKIHEE..MIN', id: 2, label: 'ASPA_BACSU/16-156'},
    {sequence: 'GTKFPRRIIWS............', id: 3, label: 'FUMC_SACS2/1-124'}
]

// Input icons
const icons = [
    {sequenceId: 1, start: 2, end: 2, icon: 'lollipop'},
    {sequenceId: 1, start: 13, end: 13, icon: 'lollipop'}
]

// Options and configuration
const options = {
    chunkSize: 0, 
    sequenceColor: 'clustal', 
    lateralIndexes: false
};

// Initialize the viewer
const psv = new ProSeqViewer('psv');

// Generate the HTML
psv.draw({sequences, options, icons});

```

## Developers
If you are a developer you can update the GitHub and NPM repo with these commands
```bash
nvm use
npm install
npm run buildall
npm publish
```


## License

This program is free software; you can redistribute it and/or modify it under the terms of the CC-BY
License as published by the Creative Commons.
