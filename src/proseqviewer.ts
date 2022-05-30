import {OptionsModel} from './lib/options.model';
import {RowsModel} from './lib/rows.model';
import {ColorsModel} from './lib/colors.model';
import {SelectionModel} from './lib/selection.model';
import {IconsModel} from './lib/icons.model';
import {SequenceInfoModel} from './lib/sequenceInfoModel';
import {EventsModel} from './lib/events.model';
import {PatternsModel} from './lib/patterns.model';
import {ConsensusModel} from './lib/consensus.model';
import {Index, Input} from './lib/interface';
import {isString, find, times, repeat} from 'lodash';

// Add custom style
import './styles.scss';


export interface Options {
    // Define index location
    indexLocation?: Index | Array<Index>,
    // Define rotation for top index
    indexRotation?: boolean,
}


// Export the actual ProSeqViewer constructor
export default class ProSeqViewer {

    static sqvList = [];
    init: boolean;
    params: OptionsModel;
    rows: RowsModel;
    consensus: ConsensusModel;
    regions: ColorsModel;
    patterns: PatternsModel;
    icons: IconsModel;
    labels: SequenceInfoModel;
    selection: SelectionModel;
    events: EventsModel;

    // Target DOM element
    root: HTMLElement;

    // Store options
    options: Options;

    // Default options
    static defaults: Options = {
        indexLocation: ['top', 'left'],
        indexRotation: true,
    }

    constructor(target: string | HTMLElement, options?: Options) {
        // Define temporary root element
        let root: HTMLElement;
        // Case target is a string
        if (isString(target)) {
            // Retrieve element form target identifier
            root = document.getElementById(target as string) as HTMLElement;
        }
        // Check if target exists
        if (!root) {
            // Otherwise, throw error
            throw new Error('Could not find target element');
        }
        // Store target element
        this.root = root;

        this.init = false;
        this.params = new OptionsModel();
        this.rows = new RowsModel();
        this.consensus = new ConsensusModel();
        this.regions = new ColorsModel();
        this.patterns = new PatternsModel();
        this.icons = new IconsModel();
        this.labels = new SequenceInfoModel();
        this.selection = new SelectionModel();
        this.events = new EventsModel();

        // Store options
        this.options = options || ProSeqViewer.defaults;

        // On resize event, recalculate indexes
        window.onresize = () => this.updateIndex();

        // On click event, recalculate indexes
        // NOTE This intercepts any click in the window, so it might be suitable for hide/toggle events (e.g. MobiDB)
        window.onclick = () => this.updateIndex();
    }

    // Show indexes (when event is triggered)
    private updateIndex() {
        // Define target element
        const root = this.root;
        // TODO Replace with list of DOM elements
        const chunks = root.getElementsByClassName('cnk');
        // Define position of current column (top left)
        let prevTopOffset = 0;
        // Loop through each chunk
        for (let i = 0; i < chunks.length; i++) {
            // Get current chunk
            const chunk = chunks[i];
            // Get first column of the chunk
            const column = chunk.firstElementChild;

            let classNames = ['idx'];  // ['idx', 'hidden'];
            // Compute current top offset
            let currTopOffset = chunks[i].getBoundingClientRect().top + window.scrollY;
            // Compare current and previous top offset
            if (currTopOffset > prevTopOffset) {
                // Update classes
                classNames = ['idx'];
                // Update previous top offset
                prevTopOffset = currTopOffset;
            }
            // Set classes
            column.className = classNames.join(' ');
        }
    }


    public draw(inputs: Input) {


        // const sqvBody = document.getElementById(this.divId);
        // if (sqvBody) {
        //     sqvBody.innerHTML = `<div class="root"> <div class="loading">input error</div> </div>`;
        // }
        // ProSeqViewer.sqvList.push(this.divId);

        let labels;
        let labelsFlag;
        let startIndexes;
        let tooltips;
        let data;

        /** check and process parameters input */
        inputs.options = this.params.process(inputs.options, inputs.consensus);

        /** check and consensus input  and global colorScheme */
        if (inputs.options) {
            [inputs.sequences, inputs.regions] = this.consensus.process(inputs.sequences, inputs.regions, inputs.options);
        }


        /** check and process patterns input */
        inputs.patterns = this.patterns.process(inputs.patterns, inputs.sequences);


        /** check and process colors input */
        inputs.regions = this.regions.process(inputs);


        /** check and process icons input */
        let icons = this.icons.process(inputs.regions, inputs.sequences, inputs.icons);

        /** check and process sequences input */
        data = this.rows.process(inputs.sequences, icons, inputs.regions, inputs.options);

        /** check and process labels input */
        [labels, startIndexes, tooltips, labelsFlag] = this.labels.process(inputs.regions, inputs.sequences);

        /** create/update sqv-body html */
        this.createGUI(data, labels, startIndexes, tooltips, inputs.options, labelsFlag);

        /** listen copy paste events */
        this.selection.process();

        /** listen selection events */
        this.events.onRegionSelected();
    }

    private generateLabels(idx, labels, startIndexes, indexesLocation, chunkSize, fontSize, tooltips, data, lineSeparation) {
        let labelshtml = '';
        let labelsContainer = '';
        const noGapsLabels = [];

        if (labels.length > 0) {
            if (indexesLocation != 'lateral') {
                labelshtml += `<span class="lbl-hidden" style="margin-bottom:${lineSeparation};"></span>`;
            }
            let flag;
            let count = -1;
            let seqN = -1;
            for (const seqNum of data) {
                if (noGapsLabels.length < data.length) {
                    noGapsLabels.push(0);
                }
                seqN += 1;
                for (const res in seqNum) {
                    if (seqNum[res].char && seqNum[res].char.includes('svg')) {
                        flag = true;
                        break;
                    }
                }

                if (flag) {
                    noGapsLabels[seqN] = '';
                    if (idx) {
                        // line with only icons, no need for index
                        labelshtml += `<span class="lbl-hidden" style="margin-bottom:${lineSeparation}"><span class="lbl"> ${noGapsLabels[seqN]}</span></span>`;
                    } else {
                        labelshtml += `<span class="lbl-hidden" style="margin-bottom:${lineSeparation}"><span class="lbl"></span></span>`;
                    }

                } else {
                    count += 1;
                    if (idx) {
                        if (!chunkSize) {
                            // lateral index regular
                            labelshtml += `<span class="lbl-hidden" style="width: ${fontSize};margin-bottom:${lineSeparation}">
                            <span class="lbl" >${(startIndexes[count] - 1) + idx}</span></span>`;
                        } else {
                            let noGaps = 0;
                            for (const res in seqNum) {
                                if (+res <= (idx) && seqNum[res].char !== '-') {
                                    noGaps += 1;
                                }
                            }
                            // lateral index gap
                            noGapsLabels[seqN] = noGaps;
                            labelshtml += `<span class="lbl-hidden" style="width:  ${fontSize};margin-bottom:${lineSeparation}">
                            <span class="lbl" >${(startIndexes[count] - 1) + noGapsLabels[seqN]}</span></span>`;
                        }

                    } else {
                        labelshtml += `<span class="lbl-hidden" style="margin-bottom:${lineSeparation}"><span class="lbl">${labels[count]}${tooltips[count]}</span></span>`;
                    }
                }
                flag = false;
            }

            if (indexesLocation == 'lateral' || 'both') {
                labelsContainer = `<span class="lblContainer" style="display: inline-block">${labelshtml}</span>`;

            } else {
                // add margin in case we only have labels and no indexes
                labelsContainer = `<span class="lblContainer" style="margin-right:10px;display: inline-block">${labelshtml}</span>`;

            }

        }
        return labelsContainer;
    }

    // private addTopIndexes(chunkSize, x, maxTop, rowMarginBottom) {
    //   let cells = '';
    //   // adding top indexes
    //
    //     let chunkTopIndex;
    //     if (x % chunkSize === 0 && x <= maxTop) {
    //       chunkTopIndex = `<span class="cell" style="-webkit-user-select: none;direction: rtl;display:block;width:0.6em;margin-bottom:${rowMarginBottom}">${x}</span>`;
    //
    //     } else {
    //       chunkTopIndex = `<span class="cell" style="-webkit-user-select: none;display:block;visibility: hidden;margin-bottom:${rowMarginBottom}">0</span>`;
    //     }
    //     cells += chunkTopIndex;
    //   return cells;
    // }

    // Add index on top of a column
    private addTopIndex(index: number, longest: number | string, rotate?: boolean) {
        let classes = 'cell index top';
        // Case rotation is set
        if (rotate) {
            // Add rotate class
            classes += 'rotate'
        }
        // Define placeholder
        let placeholder = repeat(
            // Create a single character cell
            `<span class="cell">&nbsp;</span>`,
            // Repeat once for each character in the longest index
            (longest + '').length
        );
        // Create an index cell
        return `
            <span class="cell top index ${ rotate ? 'rotate' : '' }">
                <span class="placeholder">${placeholder}</span>
                <span class="value">${index}</span>
            </span>`;
    }

    // Add left index of a column
    private addLeftIndex(index: number, longest: number | string) {
        // Create an index cell
        return `
            <span class="cell index left">
                <span class="placeholder">${longest}</span>
                <span class="value">${index}</span>
            </span>`;
    }

    // Add label
    private addLabel(index: number, labels: Array<string>) {
        // Define label
        let label = labels[index];
        // Create a label cell
        return `<span class="label">${label}</span>`;
    }


    private createGUI(sequences: Array<Object>, labels: Array<string>, startIndexes, tooltips, options, labelsFlag) {

        let indexLocation = options.indexLocation;
        // Initialize top and left index
        let topIndex = true;
        let leftIndex = true;
        // Case index location is set
        if (indexLocation) {
            // Case index location is not an array
            if (isString(indexLocation)) {
                // Turn it into an array
                indexLocation = [indexLocation];
            }
            // Set top index
            topIndex = !!(find(indexLocation as Index[], (l) => l == 'top'));
            // Set left index
            leftIndex = !!(find(indexLocation as Index[], (l) => l == 'left'));
        }

        let longest = 0;
        // Define length of the longest sequence
        for (let sequence of sequences) {
            // Define number of residues
            let residues = Object.values(sequence)
            // Store the length of the longest sequence only
            longest = (residues.length > longest) ? residues.length : longest
        }

        // const chunkSize = options.chunkSize;
        const fontSize = options.fontSize;
        const chunkSeparation = options.chunkSeparation;
        // const indexesLocation = options.indexesLocation;
        const wrapLine = options.wrapLine;
        const viewerWidth = options.viewerWidth;
        const lineSeparation = options.lineSeparation + ';';
        const fNum = +fontSize.substr(0, fontSize.length - 2);
        const fUnit = fontSize.substr(fontSize.length - 2, 2);


        // // maxIdx = length of the longest sequence
        // let maxIdx = 0;
        // let maxTop = 0;
        // for (const row of data) {
        //   if (maxIdx < Object.keys(row).length) { maxIdx = Object.keys(row).length; }
        //   if (maxTop < Object.keys(row).length) { maxTop = Object.keys(row).length; }
        // }

        // const lenghtIndex = maxIdx.toString().length;
        // const indexWidth = (fNum * lenghtIndex).toString() + fUnit;
        //
        // // consider the last chunk even if is not long enough
        // if (chunkSize > 0) { maxIdx += (chunkSize - (maxIdx % chunkSize)) % chunkSize; }

        // Set chunk size
        const split = options.chunkSize || 0 as number;

        // // generate labels
        // const labelsContainer = this.generateLabels(false, labels, startIndexes, indexesLocation, false, indexWidth, tooltips, data, lineSeparation);

        let index = '';
        let cards = '';
        let cell;
        let entity;
        let style;
        let html = '';
        let idxNum = 0;
        let idx;
        let cells = '';

        let chunks = ``;
        let columns = ``;
        // Loop through each column
        for (let j = 1; j <= longest; j++) {
            // Initialize column (each column contains multiple cells)
            let column = '';
            // Case the top index must be set
            if (topIndex) {
                // Create top index
                column += this.addTopIndex(j, longest, true);
            }

            // Define if column is the first in chunk
            const isFirst = !columns;
            // Case left index is set
            if (leftIndex && isFirst) {
                // TODO Define leftmost column
                let column = ``;
                // Loop through each sequence
                for (let i = 0; i < sequences.length; i++) {
                    // Get i-th sequence
                    let cell = sequences[i][j];
                    // Generate and store index cell
                    column += this.addLeftIndex(j, longest);
                }
                // Update columns
                columns = `<div class="crd">${column}</div>` + columns;
            }

            // Loop through each sequence
            for (let i = 0; i < sequences.length; i++) {
                // Define current residue (one-letter-code)
                let cell = sequences[i][j] || {char: 'X'};
                // entity = data[y][x];
                // style = 'font-size: 1em;display:block;height:1em;line-height:1em;margin-bottom:' + lineSeparation;
                // if (y === data.length - 1) { style = 'font-size: 1em;display:block;line-height:1em;margin-bottom:' + lineSeparation; }
                // if (!entity) {
                //   // emptyfiller
                //     style = 'font-size: 1em;display:block;color: rgba(0, 0, 0, 0);height:1em;line-height:1em;margin-bottom:' + lineSeparation;
                //     cell = `<span style="${style}">A</span>`; // mock char, this has to be done to have chunks all of the same length (last chunk can't be shorter)
                // }
                // else {
                //
                //   if (entity.target) { style += `${entity.target}`; }
                //   if (entity.char && !entity.char.includes('svg')) {
                //     // y is the row, x is the column
                //     cell = `<span class="cell" data-res-x='${x}' data-res-y= '${y}' data-res-id= '${this.divId}'
                //             style="${style}">${entity.char}</span>`;
                //   } else {
                //     style += '-webkit-user-select: none;';
                //     cell = `<span style="${style}">${entity.char}</span>`;
                //   }
                // }
                // cells += cell;
                // TODO What is entity.target???
                // TODO Handle SVG in cell
                // Add cell, embed (x, y) coordinates
                column += `<span data-x="${j}" data-y="${i}" class="cell">${cell.char}</span>`;
            }
            // Store column
            columns += `<div class="crd">${column}</div>`;

            // Define if it is the last column of the chunk
            const isLast = (j % split == 0) || (j == (longest - 1));
            // Case current column index "hits" chunk size
            if (isLast) {
                // Define chunk
                let chunk = `
                    <div class="cnk">
                        <div class="crds">${columns}</div>
                    </div>`; // top';
                // Reset columns
                columns = ``;
                // Store chunk
                chunks += chunk;
            }

            // if (chunkSize > 0 && x % chunkSize === 0) {
            //   // considering the row of top indexes
            //   if (indexesLocation != 'top') {
            //     idxNum += chunkSize; // lateral index (set only if top indexes missing)
            //     idx = idxNum - (chunkSize - 1);
            //     // adding labels
            //     const gapsContainer = this.generateLabels(idx, labels, startIndexes, indexesLocation, chunkSize, indexWidth, false, data, lineSeparation);
            //
            //     if (labels[0] === '') {
            //       index = gapsContainer;  // lateral number indexes
            //     } else {
            //       index = labelsContainer  + gapsContainer;  // lateral number indexes + labels
            //     }
            //
            //
            //     if (!labelsFlag) {
            //       index = gapsContainer;  // lateral number indexes
            //     } else {
            //         index = labelsContainer  + gapsContainer;  // lateral number indexes + labels
            //     }
            //     } else {
            //       index = labelsContainer; // top
            //     }
            //
            //   index = `<div class="idx hidden">${index}</div>`;
            //   style = `font-size: ${fontSize};`;
            //
            //   if (x !== maxIdx) { style += 'padding-right: ' + chunkSeparation + 'em;'; } else { style += 'margin-right: ' + chunkSeparation + 'em;'; }
            //
            //   let chunk = '';
            //
            //   if (labelsFlag || options.consensusType || indexesLocation == 'both' || indexesLocation == 'lateral') { // both
            //     chunk = `<div class="cnk" style="${style}">${index}<div class="crds">${cards}</div></div>`;
            //   } else {
            //     chunk = `<div class="cnk" style="${style}"><div class="idx hidden"></div><div class="crds">${cards}</div></div>`; // top
            //   }
            //   cards = '';
            //   index = '';
            //   html += chunk;
            // }

        }

        let classes = `root`;
        // Case wrap line is set
        classes += wrapLine ? ` wrap` : ``;

        // Define HTML content
        this.root.innerHTML = `<div class="root ${classes}">${chunks}</div>`;
        // Bind resize event
        window.dispatchEvent(new Event('resize'));
    }


}
