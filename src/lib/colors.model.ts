interface InpColor {
  backgroundColor: string;
  backgroundImage?: string;
  sequenceId: string;
  color?: string;
  start: number;
  end: number;
  colorScheme?: string;
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

    if (allInputs.options && !allInputs.options.colorScheme) {
      const colorSchemeRegions = [];
      for (const sequence of allInputs.sequences) {
        if (sequence.colorScheme) {
          // @ts-ignore
          colorSchemeRegions.push({sequenceId: sequence.id, start: 1, end: sequence.sequence.length, colorScheme: sequence.colorScheme});
        }
      }
      for (const reg of allInputs.regions) {
        if (!reg.backgroundColor && reg.sequenceId !== -99999999999998 ) {
          colorSchemeRegions.push(reg);
        }
      }

      if (colorSchemeRegions.length > 0) {
        allInputs.regions = colorSchemeRegions;
      }
    }

    const allRegions = Array.prototype.concat(allInputs.icons, allInputs.regions, allInputs.patterns); // ordering
    let newRegions = this.fixMissingIds(allRegions, allInputs.sequences);
    newRegions = this.transformInput(allRegions, newRegions, allInputs.sequences, allInputs.options);
    this.transformColors(allInputs.options.colorScheme);
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

        let reg = {sequenceId: seq.id, backgroundColor: '', start: 1, end: seq.sequence.length, colorScheme: ''};
        if (seq.colorScheme) {

          reg.backgroundColor = seq.colorScheme;
          reg.colorScheme = seq.colorScheme;
          info = this.setColorscheme(reg, seq);
        }
      }
    }

    // overwrite region color if colorscheme is set
    // @ts-ignore
    for (const reg of newRegions) {

      let colorScheme;
      if (reg.icon) { continue; }
      if (sequences.find(x => x.id === reg.sequenceId)) {

        colorScheme = sequences.find(x => x.id === reg.sequenceId).colorScheme;
        if (colorScheme && !globalColor) {
          // Colorscheme is set. Cannot set backgroundColor
          reg.colorScheme = colorScheme; }
        }



      info = this.processColor(reg);
      if (info === -1) { continue; }


      ColorsModel.palette[info.type][info.sequenceId].positions
            .push({start: reg.start, end: reg.end, target: info.letterStyle});
      if (colorScheme && colorScheme.includes('binary')) {

        // @ts-ignore
        ColorsModel.palette[info.type].binaryColors = this.getBinaryColors(colorScheme);
      }
      }
    return newRegions;
  }

  private setColorscheme(reg, seq) {
    let info;

    info = this.processColor(reg);

    ColorsModel.palette[info.type][info.sequenceId].positions
      .push({start: reg.start, end: reg.end, target: info.letterStyle});

    if (seq.colorScheme.includes('binary')) {
      // @ts-ignore
      ColorsModel.palette[info.type].binaryColors = this.getBinaryColors(seq.colorScheme);
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

  private transformColors(colorscheme) {

    let arrColors;
    let n;
    let c;
    let t;


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
        case 'custom': {
          // tslint:disable-next-line:forin
          for (const row in ColorsModel.palette[type]) {
            c = ColorsModel.palette[type][row];

            // tslint:disable-next-line:forin
            for (const e in c.positions) {
              t = c.positions[e];
              if (t.backgroundColor) {
                t.backgroundColor = this.checkColor(t.backgroundColor);
              }
              if (t.backgroundColor === -1) {
                delete c.positions[e];
              }
            }
          }
          break;
        }
        case colorscheme: {
          // tslint:disable-next-line:forin
          for (const row in ColorsModel.palette[type]) {
            c = ColorsModel.palette[type][row];
            if (c.positions.length > 0) {

              for (const pos of c.positions) {
                pos.backgroundColor = colorscheme;
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
    if (e.color) {e.color = this.checkColor(e.color); result.letterStyle = `color:${e.color};`;
    }
    if (e.backgroundColor) {
      e.backgroundColor = this.checkColor(e.backgroundColor);
      result.letterStyle += `background-color:${e.backgroundColor};`; }
    if (e.backgroundImage) {
        result.letterStyle += `background-image: ${e.backgroundImage};`;
    }

    // define color or palette
    if (e.colorScheme) { result.type = e.colorScheme; }


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

  private checkColor(color: string) {
    if (color[0] === '(') {
      return this.checkRgb(color);
    } else if (color[0] === '#') {
      return this.checkHex(color);
    } else {
      return color[0];
    }
  }

  private checkHex(color: string) {

    const c = {
      0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, a: 10,
      b: 11, c: 12, d: 13, e: 14, f: 15, A: 10, B: 11, C: 12, D: 13, E: 14, F: 15
    };
    let l1;
    let l2;

    const hex = color.replace('#', '');

    if (hex.length !== 6) {
      // invalid hex format
      return -1;
    }

    for (let i = 0; i < 3; i++) {
      l1 = c[hex[i * 2]];
      l2 = c[hex[i * 2 + 1]];
      if (l1 === undefined || l2 === undefined) {
        // Invalid char in hex value
        return -1;
      }
    }
    return color;
  }

  private checkRgb(color: string) {

    let tmp;
    let prefix;
    let result;
    const rgb = color.replace('(', '')
      .replace(')', '')
      .split(',');

    if (rgb.length > 2) {

      for (let i = 0; i < 3; i++) {
        tmp = +rgb[i];
        if (isNaN(tmp) || tmp < 0 || tmp > 255) {
          // wrong value for rgb
          return -1;
        }
      }
      prefix = 'rgb';
    }

    if (rgb.length > 3) {
      tmp = +rgb[3];
      if (isNaN(tmp) || tmp < 0 || tmp > 1) {
        // wrong opacity value for rgb
        return -1;
      }
      prefix = 'rgba';
      result = '(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ', ' + rgb[3] + ')';
    } else {
      result = '(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')';
    }

    if (rgb.length <= 2 || rgb.length > 4) {
      // invalid format for rgb
      return -1;
    }

    return prefix + result;

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
