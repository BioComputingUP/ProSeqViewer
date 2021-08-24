export class OptionsModel {

  options =  {
    fontSize: '14px',
    chunkSize: 10,
    chunkSeparation: 1, // relative to fontSize
    emptyFiller: ' ', // fills gap at the end of the MSA sequences
    indexesLocation: null,
    wrapLine: false,
    viewerWidth: false,
    consensusType: null,
    consensusDotThreshold: 90,
    lineSeparation: '5px',
    sequenceColor: undefined,
    customPalette: undefined,
    sequenceColorMatrix: undefined,
    sequenceColorMatrixPalette: undefined,
    consensusColorIdentity: undefined,
    consensusColorMapping: undefined
  };

  process(opt) {

    /** check input fontSize */
    if (opt && opt.fontSize) {
      const fSize = opt.fontSize;
      const fNum = +fSize.substr(0, fSize.length - 2);
      const fUnit = fSize.substr(fSize.length - 2, 2);

      if (isNaN(fNum) || (fUnit !== 'px' && fUnit !== 'vw' && fUnit !== 'em')) {
        // wrong fontSize format
      } else {
        this.options.fontSize = fSize;
      }
    } else {
      // fontSize not set
      this.options.fontSize = '14px'; // default reset
    }

    /** check input chunkSize */
    if (opt && opt.chunkSize) {

      const cSize = +opt.chunkSize;
      if (isNaN(cSize) || cSize < 0) {
        // wrong chunkSize format
      } else {
        this.options.chunkSize = cSize;
      }
    }

    /** check input spaceSize */
    if (opt && opt.chunkSeparation) {

      const chunkSeparation = +opt.chunkSeparation;
      if (chunkSeparation >= 0) {
        this.options.chunkSeparation = chunkSeparation;
      }
    }

    if (opt && opt.chunkSize == 0) {
      this.options.chunkSize = 1;
      this.options.chunkSeparation = 0;
    }

    /** check indexesLocation value */
    if (opt && opt.indexesLocation) {
      if (opt.indexesLocation == "top" || opt.indexesLocation == "lateral") {
        this.options.indexesLocation = opt.indexesLocation;
      }
    }

    /** check sequenceColor value */
    if (opt && opt.sequenceColor) {
      if (typeof opt.sequenceColor !== 'string' ) {
        this.options.sequenceColor = 'custom';
        this.options.customPalette = opt.sequenceColor;
      } else {
        this.options.sequenceColor = opt.sequenceColor;
      }
    }

    /** check sequenceColor value */
    if (opt && opt.sequenceColorMatrix) {
      if (typeof opt.sequenceColorMatrix !== 'string' ) {
        this.options.sequenceColorMatrix = 'custom';
        this.options.sequenceColorMatrixPalette = opt.sequenceColorMatrix;
      } else {
        this.options.sequenceColorMatrix = opt.sequenceColorMatrix;
      }
    }


    /** check consensusType value */
    if (opt && opt.consensusColorIdentity) {
        this.options.consensusColorIdentity = opt.consensusColorIdentity
    }
    if (opt && opt.consensusColorMapping) {
      this.options.consensusColorMapping = opt.consensusColorMapping
    }

    /** check consensusThreshold value */
    if (opt && opt.consensusDotThreshold) {
      if (typeof opt.consensusDotThreshold == 'number') {
        this.options.consensusDotThreshold = opt.consensusDotThreshold;
      }
    }

    /** check rowMarginBottom value */
    if (opt && opt.lineSeparation !== undefined) {
      const rSize = opt.lineSeparation;
      const rNum = +rSize.substr(0, rSize.length - 2);
      const rUnit = rSize.substr(rSize.length - 2, 2);

      if (isNaN(rNum) || (rUnit !== 'px' && rUnit !== 'vw' && rUnit !== 'em')) {
        // wrong lineSeparation format
      } else {
        this.options.lineSeparation = rSize;
      }
    } else {
      // lineSeparation not set
      this.options.lineSeparation = '5px'; // default reset
    }

    /** check wrapline value */

    if (opt && opt.wrapLine && typeof opt.wrapLine == 'boolean') {
      this.options.wrapLine = !opt.wrapLine;
    }

    /** check oneLineWidth */
    if (opt && opt.viewerWidth) {
      const viewerWidth = opt.viewerWidth;
      const olNum = +viewerWidth.substr(0, viewerWidth.length - 2);
      const olUnit = viewerWidth.substr(viewerWidth.length - 2, 2);

      if (isNaN(olNum) || (olUnit !== 'px' && olUnit !== 'vw' && olUnit !== 'em')) {
       // wrong oneLineWidth format
      } else {
        this.options.viewerWidth = viewerWidth;
      }
    }
    return this.options;
  }
}
