interface InpColor {
  backgroundColor: string;
  backgroundImage?: string;
  sequenceId: string;
  color?: string;
  start: number;
  end: number;
  sequenceColor?: string;
}

/** Output Colors */
// E.g.: 'coloring': {rowNum: { positions:[{start, end, color, target}] , chars: [{entity, color, target}]}}
interface OutColors {
  [coloring: string]: OutColor;
}

interface OutColor {
  [rowNum: string]: {positions: Array<PositionColor>, chars: Array<CharColor>};
}

interface PositionColor {
  start: number;
  end: number;
  backgroundColor?: string;
  target: string;
}

interface CharColor {
  entity: string;
  backgroundColor?: string;
  target: string;
}

export class ColorsModel {

  static palette: OutColors;


  static getRowsList(coloring: string) {
    const outCol = this.palette[coloring];
    if (!outCol) {
      return [];
    }
    return Object.keys(outCol);
  }

  static getPositions(coloring: string, rowNum: number) {
    let outCol: any;
    outCol = this.palette[coloring];
    if (!outCol) {
      return [];
    }
    outCol = outCol[rowNum];
    if (!outCol) {
      return [];
    }
    outCol = outCol.positions;
    if (!outCol) {
      return [];
    }
    return outCol;
  }

  process(allInputs) {
    if (!allInputs.regions) {
      allInputs.regions = [];
    }

    if (allInputs.options && !allInputs.options.sequenceColor) {
      const sequenceColorRegions = [];
      for (const sequence of allInputs.sequences) {
        if (sequence.sequenceColor) {
          // @ts-ignore
          sequenceColorRegions.push({sequenceId: sequence.id, start: 1, end: sequence.sequence.length, sequenceColor: sequence.sequenceColor});
        }
      }
      for (const reg of allInputs.regions) {
        if (!reg.backgroundColor && reg.sequenceId !== -99999999999998 ) {
          sequenceColorRegions.push(reg);
        }
      }

      if (sequenceColorRegions.length > 0) {
        allInputs.regions = sequenceColorRegions;
      }
    }

    const allRegions = Array.prototype.concat(allInputs.icons, allInputs.regions, allInputs.patterns); // ordering
    let newRegions = this.fixMissingIds(allRegions, allInputs.sequences);
    newRegions = this.transformInput(allRegions, newRegions, allInputs.sequences, allInputs.options);
    this.transformColors(allInputs.options);
    return newRegions;
  }

  // transform input structure
  private transformInput(regions, newRegions, sequences, globalColor) {

    // if don't receive new colors, keep old colors
    if (!regions) { return; }


    // if receive new colors, change them
    ColorsModel.palette = {};
    let info;
    if (!globalColor) {
      for (const seq of sequences) {

        let reg = {sequenceId: seq.id, backgroundColor: '', start: 1, end: seq.sequence.length, sequenceColor: ''};
        if (seq.sequenceColor) {

          reg.backgroundColor = seq.sequenceColor;
          reg.sequenceColor = seq.sequenceColor;
          info = this.setSequenceColor(reg, seq);
        }
      }
    }

    // overwrite region color if sequenceColor is set
    // @ts-ignore
    for (const reg of newRegions) {

      let sequenceColor;
      if (reg.icon) { continue; }
      if (sequences.find(x => x.id === reg.sequenceId)) {

        sequenceColor = sequences.find(x => x.id === reg.sequenceId).sequenceColor;
        if (sequenceColor && !globalColor) {
          // sequenceColor is set. Cannot set backgroundColor
          reg.sequenceColor = sequenceColor; }
        }



      info = this.processColor(reg);
      if (info === -1) { continue; }


      ColorsModel.palette[info.type][info.sequenceId].positions
            .push({start: reg.start, end: reg.end, target: info.letterStyle});
      if (sequenceColor && sequenceColor.includes('binary')) {

        // @ts-ignore
        ColorsModel.palette[info.type].binaryColors = this.getBinaryColors(sequenceColor);
      }
      }
    return newRegions;
  }

  private setSequenceColor(reg, seq) {
    let info;

    info = this.processColor(reg);

    ColorsModel.palette[info.type][info.sequenceId].positions
      .push({start: reg.start, end: reg.end, target: info.letterStyle});

    if (seq.sequenceColor.includes('binary')) {
      // @ts-ignore
      ColorsModel.palette[info.type].binaryColors = this.getBinaryColors(seq.sequenceColor);
    }
    return info;
  }

  private fixMissingIds(regions, sequences) {
    const newRegions = [];
    for (const reg of regions) {
      if (!reg) { continue; }
      if (sequences.find(x => x.id === reg.sequenceId)) {
        newRegions.push(reg);
      } else {
        for (const seq of sequences) {
          const newReg = {};
          // tslint:disable-next-line:forin
          for (const key in reg) {
            if (reg[key] !== 'sequenceId') {
              newReg[key] = reg[key];
            }
            newReg['sequenceId'] = seq.id;
          }
          newRegions.push(newReg);
        }
      }
    }
    return newRegions;
  }

  private transformColors(opt) {
    const sequenceColor = opt.sequenceColor
    let arrColors;
    let n;
    let c;


    for (const type in ColorsModel.palette) {
      switch (type) {
        case 'gradient': {
          // tslint:disable-next-line:forin
          for (const row in ColorsModel.palette[type]) {
            c = ColorsModel.palette[type][row];
            n = c.positions.length + c.chars.length;
            arrColors = this.gradient(n);
            c.positions.sort((a, b) => (a.start > b.start) ? 1 : -1);
            for (const e of c.positions) {
              e.backgroundColor = arrColors.pop();
            }
          }
          break;
        }
        case 'binary': {
          // tslint:disable-next-line:forin
          for (const row in ColorsModel.palette[type]) {
            if (row === 'binaryColors') {
              continue;
            }
            c = ColorsModel.palette[type][row];
            n = c.positions.length + c.chars.length;
            arrColors = this.binary(n, ColorsModel.palette[type].binaryColors);
            c.positions.sort((a, b) => (a.start > b.start) ? 1 : -1);
            for (const e of c.positions) {
              e.backgroundColor = arrColors.pop();
            }
          }
          break;
        }
        case sequenceColor: {
          // tslint:disable-next-line:forin
          // ColorsModel.palette[type]: an obj with regions and color associated es. positions: 1-200, zappo
          for (const row in ColorsModel.palette[type]) {

            c = ColorsModel.palette[type][row];
            if (c.positions.length > 0) {

              for (const pos of c.positions) {
                pos.backgroundColor = sequenceColor;
              }
            }
          }
          break;
        }
      }
    }
  }

  private processColor(e: InpColor) {


    const result = {type: 'custom', sequenceId: -1, letterStyle: ''};

    // check if row key is a number
    if (e.sequenceId === undefined || isNaN(+e.sequenceId)) {
      // wrong entity row key
      return -1;
    }
    result.sequenceId = +e.sequenceId;

    // transform target in CSS property
    if (e.color) {result.letterStyle = `color:${e.color};`;
    }
    if (e.backgroundColor) {
      result.letterStyle += `background-color:${e.backgroundColor};`; }
    if (e.backgroundImage) {
        result.letterStyle += `background-image: ${e.backgroundImage};`;
    }

    // define color or palette
    if (e.sequenceColor) { result.type = e.sequenceColor; }


    if (result.type.includes('binary')) { result.type = 'binary'; }

    // reserving space for the transformed object (this.palette)
    // if color type not inserted yet
    if (!(result.type in ColorsModel.palette)) {
      ColorsModel.palette[result.type] = {};
    }
    // if row not inserted yet
    if (!(result.sequenceId in ColorsModel.palette[result.type])) {
      ColorsModel.palette[result.type][result.sequenceId] = {positions: [], chars: []};
    }
    return result;
  }


  private gradient(n: number) {
    return this.evenlySpacedColors(n);
  }

  private getBinaryColors() {
    const color1 = '#93E1D8';
    const color2 = '#FFA69E';
    return [color1, color2];
  }

  private binary(n: number, binaryColors) {
    let reg = 0;
    let flag;

    const arrColors = [];
    while (reg < n) {
      if (flag) {
        arrColors.push(binaryColors[0]);
        flag = !flag;
      } else {
        arrColors.push(binaryColors[1]);
        flag = !flag;
      }
      reg += 1;
    }
    return arrColors;
  }

  private evenlySpacedColors( n: number ) {
    /** how to go around the rgb wheel */
    /** add to next rgb component, subtract to previous */
    /**  ex.: 255,0,0 -(add)-> 255,255,0 -(subtract)-> 0,255,0 */

    // starting color: red
    const rgb = [255, 0, 0];
    // 1536 colors in the rgb wheel
    const delta = Math.floor(1536 / n);

    let remainder;
    let add = true;
    let value = 0;
    let tmp;

    const colors = [];
    for (let i = 0; i < n; i++) {
      remainder = delta;
      while (remainder > 0) {
        if (add) {
          tmp = (((value + 1) % 3) + 3) % 3;
          if (rgb[tmp] + remainder > 255) {
            remainder -= (255 - rgb[tmp]);
            rgb[tmp] = 255;
            add = false;
            value = tmp;
          } else {
            rgb[tmp] += remainder;
            remainder = 0;
          }
        } else {
          tmp = (((value - 1) % 3) + 3) % 3;
          if (rgb[tmp] - remainder < 0) {
            remainder -= rgb[tmp];
            rgb[tmp] = 0;
            add = true;
          } else {
            rgb[tmp] -= remainder;
            remainder = 0;
          }
        }
      }
      colors.push('rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ', 0.4)');
    }
    return colors;
  }
}
