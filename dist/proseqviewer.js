import { OptionsModel } from './lib/options.model';
import { RowsModel } from './lib/rows.model';
import { ColorsModel } from './lib/colors.model';
import { SelectionModel } from './lib/selection.model';
import { IconsModel } from './lib/icons.model';
import { SequenceInfoModel } from './lib/sequenceInfoModel';
import { EventsModel } from './lib/events.model';
import { PatternsModel } from './lib/patterns.model';
import { ConsensusModel } from './lib/consensus.model';
import { isString, find } from 'lodash';
// Add custom style
import './styles.scss';
// Export the actual ProSeqViewer constructor
var ProSeqViewer = /** @class */ (function () {
    function ProSeqViewer(divId) {
        var _this = this;
        this.divId = divId;
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
        console.log('ciao');
        window.onresize = function () {
            _this.calculateIdxs(false);
        };
        window.onclick = function () {
            _this.calculateIdxs(true);
        }; // had to add this to cover mobidb toggle event
    }
    ProSeqViewer.prototype.calculateIdxs = function (flag) {
        for (var _i = 0, _a = ProSeqViewer.sqvList; _i < _a.length; _i++) {
            var id = _a[_i];
            if (document.getElementById(id) != null) {
                var sqvBody = document.getElementById(id);
                var chunks = sqvBody.getElementsByClassName('cnk');
                var oldTop = 0;
                var newTop = 1;
                for (var i = 0; i < chunks.length; i++) {
                    // erase old indexes before recalculating them
                    chunks[i].firstElementChild.className = 'idx hidden';
                    if (flag) {
                        // avoid calculating if idx already set
                        if (chunks[i].firstElementChild.className === 'idx') {
                            return;
                        }
                    }
                    newTop = chunks[i].getBoundingClientRect().top + window.scrollY;
                    if (newTop > oldTop) {
                        chunks[i].firstElementChild.className = 'idx';
                        oldTop = newTop;
                    }
                }
            }
        }
    };
    ProSeqViewer.prototype.draw = function (inputs) {
        var _a, _b;
        var sqvBody = document.getElementById(this.divId);
        if (sqvBody) {
            sqvBody.innerHTML = "<div class=\"root\"> <div class=\"loading\">input error</div> </div>";
        }
        ProSeqViewer.sqvList.push(this.divId);
        var labels;
        var labelsFlag;
        var startIndexes;
        var tooltips;
        var data;
        /** check and process parameters input */
        inputs.options = this.params.process(inputs.options, inputs.consensus);
        /** check and consensus input  and global colorScheme */
        if (inputs.options) {
            _a = this.consensus.process(inputs.sequences, inputs.regions, inputs.options), inputs.sequences = _a[0], inputs.regions = _a[1];
        }
        /** check and process patterns input */
        inputs.patterns = this.patterns.process(inputs.patterns, inputs.sequences);
        /** check and process colors input */
        inputs.regions = this.regions.process(inputs);
        /** check and process icons input */
        var icons = this.icons.process(inputs.regions, inputs.sequences, inputs.icons);
        /** check and process sequences input */
        data = this.rows.process(inputs.sequences, icons, inputs.regions, inputs.options);
        /** check and process labels input */
        _b = this.labels.process(inputs.regions, inputs.sequences), labels = _b[0], startIndexes = _b[1], tooltips = _b[2], labelsFlag = _b[3];
        /** create/update sqv-body html */
        this.createGUI(data, labels, startIndexes, tooltips, inputs.options, labelsFlag);
        /** listen copy paste events */
        this.selection.process();
        /** listen selection events */
        this.events.onRegionSelected();
    };
    ProSeqViewer.prototype.generateLabels = function (idx, labels, startIndexes, indexesLocation, chunkSize, fontSize, tooltips, data, lineSeparation) {
        var labelshtml = '';
        var labelsContainer = '';
        var noGapsLabels = [];
        if (labels.length > 0) {
            if (indexesLocation != 'lateral') {
                labelshtml += "<span class=\"lbl-hidden\" style=\"margin-bottom:".concat(lineSeparation, ";\"></span>");
            }
            var flag = void 0;
            var count = -1;
            var seqN = -1;
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var seqNum = data_1[_i];
                if (noGapsLabels.length < data.length) {
                    noGapsLabels.push(0);
                }
                seqN += 1;
                for (var res in seqNum) {
                    if (seqNum[res].char && seqNum[res].char.includes('svg')) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    noGapsLabels[seqN] = '';
                    if (idx) {
                        // line with only icons, no need for index
                        labelshtml += "<span class=\"lbl-hidden\" style=\"margin-bottom:".concat(lineSeparation, "\"><span class=\"lbl\"> ").concat(noGapsLabels[seqN], "</span></span>");
                    }
                    else {
                        labelshtml += "<span class=\"lbl-hidden\" style=\"margin-bottom:".concat(lineSeparation, "\"><span class=\"lbl\"></span></span>");
                    }
                }
                else {
                    count += 1;
                    if (idx) {
                        if (!chunkSize) {
                            // lateral index regular
                            labelshtml += "<span class=\"lbl-hidden\" style=\"width: ".concat(fontSize, ";margin-bottom:").concat(lineSeparation, "\">\n                            <span class=\"lbl\" >").concat((startIndexes[count] - 1) + idx, "</span></span>");
                        }
                        else {
                            var noGaps = 0;
                            for (var res in seqNum) {
                                if (+res <= (idx) && seqNum[res].char !== '-') {
                                    noGaps += 1;
                                }
                            }
                            // lateral index gap
                            noGapsLabels[seqN] = noGaps;
                            labelshtml += "<span class=\"lbl-hidden\" style=\"width:  ".concat(fontSize, ";margin-bottom:").concat(lineSeparation, "\">\n                            <span class=\"lbl\" >").concat((startIndexes[count] - 1) + noGapsLabels[seqN], "</span></span>");
                        }
                    }
                    else {
                        labelshtml += "<span class=\"lbl-hidden\" style=\"margin-bottom:".concat(lineSeparation, "\"><span class=\"lbl\">").concat(labels[count]).concat(tooltips[count], "</span></span>");
                    }
                }
                flag = false;
            }
            if (indexesLocation == 'lateral' || 'both') {
                labelsContainer = "<span class=\"lblContainer\" style=\"display: inline-block\">".concat(labelshtml, "</span>");
            }
            else {
                // add margin in case we only have labels and no indexes
                labelsContainer = "<span class=\"lblContainer\" style=\"margin-right:10px;display: inline-block\">".concat(labelshtml, "</span>");
            }
        }
        return labelsContainer;
    };
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
    ProSeqViewer.prototype.addTopIndex = function (index, split) {
        // Create an index cell
        return "<span class=\"cell index top\">{index}</span>";
    };
    ProSeqViewer.prototype.createGUI = function (sequences, labels, startIndexes, tooltips, options, labelsFlag) {
        // Define root element for sequence viewer
        var target = document.getElementById(this.divId);
        // Case root was not found
        if (!target) {
            // Cannot find sqv-body element
            throw new Error('Could not find target element');
        }
        var indexLocation = options.indexLocation;
        // Initialize top and left index
        var topIndex = true;
        var leftIndex = true;
        // Case index location is set
        if (indexLocation) {
            // Case index location is not an array
            if (isString(indexLocation)) {
                // Turn it into an array
                indexLocation = [indexLocation];
            }
            // Set top index
            topIndex = find(indexLocation, function (l) { return l == 'top'; });
            // Set left index
            leftIndex = find(indexLocation, function (l) { return l == 'left'; });
        }
        var longest = 0;
        // Define length of the longest sequence
        for (var _i = 0, sequences_1 = sequences; _i < sequences_1.length; _i++) {
            var sequence = sequences_1[_i];
            // Store the length of the longest sequence only
            longest = (sequence.length > longest) ? sequence.length : longest;
        }
        // const chunkSize = options.chunkSize;
        var fontSize = options.fontSize;
        var chunkSeparation = options.chunkSeparation;
        // const indexesLocation = options.indexesLocation;
        var wrapLine = options.wrapLine;
        var viewerWidth = options.viewerWidth;
        var lineSeparation = options.lineSeparation + ';';
        var fNum = +fontSize.substr(0, fontSize.length - 2);
        var fUnit = fontSize.substr(fontSize.length - 2, 2);
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
        var split = options.chunkSize || 0;
        // // generate labels
        // const labelsContainer = this.generateLabels(false, labels, startIndexes, indexesLocation, false, indexWidth, tooltips, data, lineSeparation);
        var index = '';
        var cards = '';
        var cell;
        var entity;
        var style;
        var html = '';
        var idxNum = 0;
        var idx;
        var cells = '';
        var chunks = "";
        var columns = "";
        // Loop through each column
        for (var j = 1; j <= longest; j++) {
            // Initialize column (each column contains multiple cells)
            var column = '';
            // Case the top index must be set
            if (topIndex) {
                // Create top index
                column += this.addTopIndex(j, split);
            }
            // TODO Case the left index must be set
            if (leftIndex) {
            }
            // if (indexesLocation != 'lateral') {cells = this.addTopIndexes(chunkSize, x, maxTop, lineSeparation)};
            // Loop through each sequence
            for (var i = 0; i < sequences.length; i++) {
                // Define current residue (one-letter-code)
                var cell_1 = sequences[i][j] || { char: 'X' };
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
                column += "<span data-x=\"".concat(j, "\" data-y=\"").concat(i, "\">{cell.char}</span>");
            }
            // Store column
            columns += "<div class=\"crd\">".concat(column, "</div>");
            // cards += `<div class="crd">${cells}</div>`; // width 3/5em to reduce white space around letters
            // cells = '';
            // Define if it is the last column of the chunk
            var isLast = (j % split == 0) || (j == (longest - 1));
            // Case current column index "hits" chunk size
            if (isLast) {
                // TODO Case left index is set
                if (leftIndex) {
                }
                // TODO Define left index
                var labels_1 = '';
                // Define chunk
                var chunk = "<div class=\"cnk\"><div class=\"crds\">".concat(columns, "</div></div>"); // top';
                // Reset columns
                columns = "";
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
        var classes = "root";
        // Case wrap line is set
        classes += wrapLine ? " wrap" : "";
        // Define HTML content
        target.innerHTML = "<div class=\"root ".concat(classes, "\">").concat(chunks, "</div>");
        // Bind resize event
        window.dispatchEvent(new Event('resize'));
    };
    ProSeqViewer.sqvList = [];
    return ProSeqViewer;
}());
export default ProSeqViewer;
