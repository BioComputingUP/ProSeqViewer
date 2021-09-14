import {OptionsModel} from './options.model';
import {RowsModel} from './rows.model';
import {ColorsModel} from './colors.model';
import {SelectionModel} from './selection.model';
import {IconsModel} from './icons.model';
import {SequenceInfoModel} from './sequenceInfoModel';
import {EventsModel} from './events.model';
import {PatternsModel} from './patterns.model';
import {ConsensusModel} from './consensus.model';
import {Input} from './interface';

export class ProSeqViewer {
  static sqvList = [];
  divId: string;
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

  constructor(divId?: string ) {
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


    window.onresize = () => {
      this.calculateIdxs(false);
    };
    window.onclick = () => {
      this.calculateIdxs(true);
    }; // had to add this to cover mobidb toggle event
  }

  private calculateIdxs(flag) {
    for (const id of ProSeqViewer.sqvList) {
      // console.log(document.getElementById(id))
      if (document.getElementById(id) != null) {
        const sqvBody = document.getElementById(id);
        const chunks = sqvBody.getElementsByClassName('cnk');

        let oldTop = 0;
        let newTop;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < chunks.length; i++) {
          newTop = chunks[i].getBoundingClientRect().top;

          if (flag) {
            // avoid calculating if idx already set
            if (chunks[i].firstElementChild.className === 'idx') {
              return;
            }
          }

          if (newTop > oldTop) {
            chunks[i].firstElementChild.className = 'idx';
            oldTop = newTop;
          } else {
            chunks[i].firstElementChild.className = 'idx hidden';
          }
        }

      }
    }

  }


  public draw(inputs: Input) {
    const sqvBody = document.getElementById(this.divId);
    sqvBody.innerHTML = `<div class="root"> <div class="loading">loading</div> </div>`;
    ProSeqViewer.sqvList.push(this.divId);

    let labels;
    let labelsFlag;
    let startIndexes;
    let tooltips;
    let data;

    /** check and process parameters input */
    inputs.options = this.params.process(inputs.options);

    /** check and consensus input  and global colorScheme */
    if (inputs.options){ [inputs.sequences, inputs.regions ] = this.consensus.process(inputs.sequences, inputs.regions, inputs.options); }



    /** check and process patterns input */
    inputs.patterns = this.patterns.process(inputs.patterns, inputs.sequences);


    /** check and process colors input */
    inputs.regions = this.regions.process(inputs);


    /** check and process icons input */
    let icons = this.icons.process(inputs.regions, inputs.sequences, inputs.icons);

    /** check and process sequences input */
    data = this.rows.process(inputs.sequences, icons, inputs.regions, inputs.options);

    /** check and process labels input */
    [ labels, startIndexes, tooltips, labelsFlag ] = this.labels.process(inputs.regions, inputs.sequences);

    /** create/update sqv-body html */
    this.createGUI(data, labels, startIndexes, tooltips, inputs.options, labelsFlag);

    /** listen copy paste events */
    this.selection.process(inputs.options);

    /** listen selection events */
    this.events.onRegionSelected();
  }

  private generateLabels(idx, labels, startIndexes, indexesLocation, chunkSize, fontSize, tooltips, data, lineSeparation) {
    let labelshtml = '';
    let labelsContainer = '';
    const noGapsLabels = [];

    if (labels.length > 0) {
      if (indexesLocation == 'top') {
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

      if (indexesLocation == 'lateral') {
        labelsContainer = `<span class="lblContainer" style="display: inline-block">${labelshtml}</span>`;

      } else {
        // add margin in case we only have labels and no indexes
        labelsContainer = `<span class="lblContainer" style="margin-right:10px;display: inline-block">${labelshtml}</span>`;

      }

    }
    return labelsContainer;
  }

  private addTopIndexes(chunkSize, x, maxTop, rowMarginBottom) {
    let cells = '';
    // adding top indexes

      let chunkTopIndex;
      if (x % chunkSize === 0 && x <= maxTop) {
        chunkTopIndex = `<span class="cell" style="-webkit-user-select: none;direction: rtl;display:block;width:0.6em;margin-bottom:${rowMarginBottom}">${x}</span>`;

      } else {
        chunkTopIndex = `<span class="cell" style="-webkit-user-select: none;display:block;visibility: hidden;margin-bottom:${rowMarginBottom}">0</span>`;
      }
      cells += chunkTopIndex;
    return cells;
  }

  private createGUI(data, labels, startIndexes, tooltips, options, labelsFlag) {

    const sqvBody = document.getElementById(this.divId);

    // convert to nodes to improve rendering (idea to try):
    // Create new element
    // const root = document.createElement('div');
    // // Add class to element
    // root.className = 'my-new-element';
    // // Add color
    // root.style.color = 'red';
    // // Fill element with html
    // root.innerHTML = ``;
    // // Add element node to DOM graph
    // sqvBody.appendChild(root);
    // // Exit
    // return;

    if (!sqvBody) {
      // Cannot find sqv-body element
      return;
    }

    const chunkSize = options.chunkSize;
    const fontSize = options.fontSize;
    const chunkSeparation = options.chunkSeparation;
    const indexesLocation = options.indexesLocation;
    const wrapLine = options.wrapLine;
    const viewerWidth = options.viewerWidth;
    const lineSeparation = options.lineSeparation + ';';
    const fNum = +fontSize.substr(0, fontSize.length - 2);
    const fUnit = fontSize.substr(fontSize.length - 2, 2);



    // maxIdx = length of the longest sequence
    let maxIdx = 0;
    let maxTop = 0;
    for (const row of data) {
      if (maxIdx < Object.keys(row).length) { maxIdx = Object.keys(row).length; }
      if (maxTop < Object.keys(row).length) { maxTop = Object.keys(row).length; }
    }

    const lenghtIndex = maxIdx.toString().length;
    const indexWidth = (fNum * lenghtIndex).toString() + fUnit;

    // consider the last chunk even if is not long enough
    if (chunkSize > 0) { maxIdx += (chunkSize - (maxIdx % chunkSize)) % chunkSize; }

    // generate labels
    const labelsContainer = this.generateLabels(false, labels, startIndexes, indexesLocation, false, indexWidth, tooltips, data, lineSeparation);

    let index = '';
    let cards = '';
    let cell;
    let entity;
    let style;
    let html = '';
    let idxNum = 0;
    let idx;
    let cells = '';
    for (let x = 1; x <= maxIdx; x++) {
      if (indexesLocation == 'top') {cells = this.addTopIndexes(chunkSize, x, maxTop, lineSeparation)};

      for (let y = 0; y < data.length; y++) {
        entity = data[y][x];
        style = 'font-size: 1em;display:block;height:1em;line-height:1em;margin-bottom:' + lineSeparation;
        if (y === data.length - 1) { style = 'font-size: 1em;display:block;line-height:1em;margin-bottom:' + lineSeparation; }
        if (!entity) {
          // emptyfiller
            style = 'font-size: 1em;display:block;color: rgba(0, 0, 0, 0);height:1em;line-height:1em;margin-bottom:' + lineSeparation;
            cell = `<span style="${style}">A</span>`; // mock char, this has to be done to have chunks all of the same length (last chunk can't be shorter)
        } else {
          if (entity.target) { style += `${entity.target}`; }
          if (entity.char && !entity.char.includes('svg')) {
            // y is the row, x is the column
            cell = `<span class="cell" data-res-x='${x}' data-res-y= '${y}' data-res-id= '${this.divId}'
                    style="${style}">${entity.char}</span>`;
          } else {
            style += '-webkit-user-select: none;';
            cell = `<span style="${style}">${entity.char}</span>`;
          }
        }
        cells += cell;
      }

      cards += `<div class="crd">${cells}</div>`; // width 3/5em to reduce white space around letters
      cells = '';


      if (chunkSize > 0 && x % chunkSize === 0) {
        // considering the row of top indexes
        if (indexesLocation == 'top') {
        } else {
          idxNum += chunkSize; // lateral index (set only if top indexes missing)
          idx = idxNum - (chunkSize - 1);
        }
        // adding labels
        if (indexesLocation != 'top') {
          const gapsContainer = this.generateLabels(idx, labels, startIndexes, indexesLocation, false, indexWidth, false, data, lineSeparation);
          if (labels[0] === '') {
            index = gapsContainer;  // lateral number indexes + labels
          } else {
            index = labelsContainer  + gapsContainer;  // lateral number indexes + labels
          }

          } else if (indexesLocation != 'top') {
          const gapsContainer = this.generateLabels(idx, labels, startIndexes, indexesLocation, chunkSize, indexWidth, false, data, lineSeparation);
          if (!labelsFlag) {
            index = gapsContainer;  // lateral number indexes + labels
          } else {
            if(indexesLocation == 'lateral'){
              index = labelsContainer  + gapsContainer;  // lateral number indexes + labels
            } else {
              index = labelsContainer;  // lateral number indexes + labels
            }
          }
          } else {
            index = labelsContainer;
          }

        index = `<div class="idx hidden">${index}</div>`;
        style = `font-size: ${fontSize};`;

        if (x !== maxIdx) { style += 'padding-right: ' + chunkSeparation + 'em;'; } else { style += 'margin-right: ' + chunkSeparation + 'em;'; }

        let chunk = '';

        if (labelsFlag || options.consensusType || indexesLocation == 'lateral') {
          chunk = `<div class="cnk" style="${style}">${index}<div class="crds">${cards}</div></div>`;
        } else {
          chunk = `<div class="cnk" style="${style}"><div class="idx hidden"></div><div class="crds">${cards}</div></div>`;
        }
        cards = '';
        index = '';
        html += chunk;
      }
    }
    let innerHTML;


    if (wrapLine) {
      innerHTML = `<div class="root">   ${html} </div>`;

      } else {

      innerHTML = `<div class="root" style="display: flex">
                        <div style="display:inline-block;overflow-x:scroll;white-space: nowrap;width:${viewerWidth}"> ${html}</div>
                        </div>`;

    }



    sqvBody.innerHTML = innerHTML;

    window.dispatchEvent(new Event('resize'));

  }


}
(window as any).ProSeqViewer = ProSeqViewer; // VERY IMPORTANT AND USEFUL TO BE ABLE TO HAVE A WORKING BUNDLE.JS!! NEVER DELETE THIS LINE
