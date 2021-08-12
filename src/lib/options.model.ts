export class OptionsModel {

  options =  {
    fontSize: '14px',
    chunkSize: 10,
    spaceSize: 1, // relative to fontSize
    emptyFiller: ' ', // fills gap at the end of the MSA sequences // TODO remove
    topIndexes: false,
    lateralIndexes: true,
    lateralIndexesGap: false,
    lateralIndexStart: 0,
    sidebarWidth: '2em',
    oneLineSetting: false,
    oneLineWidth: '300px',
    consensusType: null,
    consensusThreshold: 90,
    consensusStartIndex: 1,
    rowMarginBottom: '5px',
    colorScheme: undefined
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


    /** check input sidebarWidth */
    if (opt && opt.sidebarWidth) {
      const sidebarWidth = opt.sidebarWidth;
      const sNum = +sidebarWidth.substr(0, sidebarWidth.length - 2);
      const sUnit = sidebarWidth.substr(sidebarWidth.length - 2, 2);

      if (isNaN(sNum) || (sUnit !== 'px' && sUnit !== 'vw' && sUnit !== 'em')) {
        // wrong sidebarWidth format
      } else {
        this.options.sidebarWidth = sidebarWidth;
      }
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
    if (opt && opt.spaceSize) {

      const cSize = +opt.spaceSize;
      if (isNaN(cSize) || cSize < 0) {
        // wrong spaceSize format
      } else {
        this.options.spaceSize = cSize;
      }
    }

    if (opt && opt.chunkSize == 0) {
      this.options.chunkSize = 1;
      this.options.spaceSize = 0;
    }

    /** check topIndexes value */
    if (opt && opt.topIndexes) {
      if (typeof opt.topIndexes !== 'boolean') {
        // wrong index type
      } else {
        this.options.topIndexes = opt.topIndexes;
      }
    }

    /** check lateralIndexes value */
    if (opt && !opt.lateralIndexes) {
      if (typeof opt.lateralIndexes !== 'boolean') {
        // wrong index type
      } else {
        this.options.lateralIndexes = opt.lateralIndexes;
      }
    }

    /** check colorScheme value */
    if (opt && opt.colorScheme) {
      if (typeof opt.colorScheme !== 'string') {
        // wrong index type
      } else {
        this.options.colorScheme = opt.colorScheme;
      }
    }

    /** check lateralIndexesGap value */
    if (opt && opt.lateralIndexesGap) {
      if (typeof opt.lateralIndexesGap !== 'boolean') {
        // wrong index type
      } else {
        this.options.lateralIndexesGap = opt.lateralIndexesGap;
      }
    }

    /** check consensusType value */

    if (opt && opt.consensusType) {
      if (typeof opt.consensusType !== 'string') {
        // wrong consensus type
      } else {
        this.options.consensusType = opt.consensusType;
      }
    }

    /** check consensusThreshold value */
    if (opt && opt.consensusThreshold) {
      if (typeof opt.consensusThreshold == 'number') {
        this.options.consensusThreshold = opt.consensusThreshold;
      }
    }

    /** check consensusStartIndex value */
    if (opt && opt.consensusStartIndex) {
      if (typeof opt.consensusStartIndex == 'number') {
        this.options.consensusStartIndex = opt.consensusStartIndex;
      }
    }

    /** check rowMarginBottom value */
    if (opt && opt.rowMarginBottom !== undefined) {
      const rSize = opt.rowMarginBottom;
      const rNum = +rSize.substr(0, rSize.length - 2);
      const rUnit = rSize.substr(rSize.length - 2, 2);

      if (isNaN(rNum) || (rUnit !== 'px' && rUnit !== 'vw' && rUnit !== 'em')) {
        // wrong rowMarginBottom format
      } else {
        this.options.rowMarginBottom = rSize;
      }
    } else {
      // rowMarginBottom not set
      this.options.rowMarginBottom = '5px'; // default reset
    }

    /** check oneLineSetting value */
    if (opt && opt.oneLineSetting) {
      if (typeof opt.oneLineSetting !== 'boolean' && opt.oneLineSetting) {
        // wrong oneLineSetting format
      } else {
        this.options.oneLineSetting = opt.oneLineSetting;
      }
    } else {
      this.options.oneLineSetting = false;
    }

    /** check oneLineWidth */
    if (opt && opt.oneLineWidth) {
      const oneLineWidth = opt.oneLineWidth;
      const olNum = +oneLineWidth.substr(0, oneLineWidth.length - 2);
      const olUnit = oneLineWidth.substr(oneLineWidth.length - 2, 2);

      if (isNaN(olNum) || (olUnit !== 'px' && olUnit !== 'vw' && olUnit !== 'em')) {
       // wrong oneLineWidth format
      } else {
        this.options.oneLineWidth = oneLineWidth;
      }
    }
    return this.options;
  }
}
