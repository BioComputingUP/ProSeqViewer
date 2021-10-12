/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 333:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ColorsModel = void 0;
class ColorsModel {
    static getRowsList(coloring) {
        const outCol = this.palette[coloring];
        if (!outCol) {
            return [];
        }
        return Object.keys(outCol);
    }
    static getPositions(coloring, rowNum) {
        let outCol;
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
                    sequenceColorRegions.push({ sequenceId: sequence.id, start: 1, end: sequence.sequence.length, sequenceColor: sequence.sequenceColor });
                }
            }
            for (const reg of allInputs.regions) {
                if (!reg.backgroundColor && reg.sequenceId !== -99999999999998) {
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
    transformInput(regions, newRegions, sequences, globalColor) {
        // if don't receive new colors, keep old colors
        if (!regions) {
            return;
        }
        // if receive new colors, change them
        ColorsModel.palette = {};
        let info;
        if (!globalColor) {
            for (const seq of sequences) {
                let reg = { sequenceId: seq.id, backgroundColor: '', start: 1, end: seq.sequence.length, sequenceColor: '' };
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
            if (reg.icon) {
                continue;
            }
            if (sequences.find(x => x.id === reg.sequenceId)) {
                sequenceColor = sequences.find(x => x.id === reg.sequenceId).sequenceColor;
                if (sequenceColor && !globalColor) {
                    // sequenceColor is set. Cannot set backgroundColor
                    reg.sequenceColor = sequenceColor;
                }
            }
            info = this.processColor(reg);
            if (info === -1) {
                continue;
            }
            ColorsModel.palette[info.type][info.sequenceId].positions
                .push({ start: reg.start, end: reg.end, target: info.letterStyle });
            if (sequenceColor && sequenceColor.includes('binary')) {
                // @ts-ignore
                ColorsModel.palette[info.type].binaryColors = this.getBinaryColors(sequenceColor);
            }
        }
        return newRegions;
    }
    setSequenceColor(reg, seq) {
        let info;
        info = this.processColor(reg);
        ColorsModel.palette[info.type][info.sequenceId].positions
            .push({ start: reg.start, end: reg.end, target: info.letterStyle });
        if (seq.sequenceColor.includes('binary')) {
            // @ts-ignore
            ColorsModel.palette[info.type].binaryColors = this.getBinaryColors(seq.sequenceColor);
        }
        return info;
    }
    fixMissingIds(regions, sequences) {
        const newRegions = [];
        for (const reg of regions) {
            if (!reg) {
                continue;
            }
            if (sequences.find(x => x.id === reg.sequenceId)) {
                newRegions.push(reg);
            }
            else {
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
    transformColors(opt) {
        const sequenceColor = opt.sequenceColor;
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
    processColor(e) {
        const result = { type: 'custom', sequenceId: -1, letterStyle: '' };
        // check if row key is a number
        if (e.sequenceId === undefined || isNaN(+e.sequenceId)) {
            // wrong entity row key
            return -1;
        }
        result.sequenceId = +e.sequenceId;
        // transform target in CSS property
        if (e.color) {
            e.color = this.checkColor(e.color);
            result.letterStyle = `color:${e.color};`;
        }
        if (e.backgroundColor) {
            e.backgroundColor = this.checkColor(e.backgroundColor);
            result.letterStyle += `background-color:${e.backgroundColor};`;
        }
        if (e.backgroundImage) {
            result.letterStyle += `background-image: ${e.backgroundImage};`;
        }
        // define color or palette
        if (e.sequenceColor) {
            result.type = e.sequenceColor;
        }
        if (result.type.includes('binary')) {
            result.type = 'binary';
        }
        // reserving space for the transformed object (this.palette)
        // if color type not inserted yet
        if (!(result.type in ColorsModel.palette)) {
            ColorsModel.palette[result.type] = {};
        }
        // if row not inserted yet
        if (!(result.sequenceId in ColorsModel.palette[result.type])) {
            ColorsModel.palette[result.type][result.sequenceId] = { positions: [], chars: [] };
        }
        return result;
    }
    checkColor(color) {
        if (color[0] === '(') {
            return this.checkRgb(color);
        }
        else if (color[0] === '#') {
            return this.checkHex(color);
        }
        else {
            return color[0];
        }
    }
    checkHex(color) {
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
    checkRgb(color) {
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
        }
        else {
            result = '(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')';
        }
        if (rgb.length <= 2 || rgb.length > 4) {
            // invalid format for rgb
            return -1;
        }
        return prefix + result;
    }
    gradient(n) {
        return this.evenlySpacedColors(n);
    }
    getBinaryColors() {
        const color1 = '#93E1D8';
        const color2 = '#FFA69E';
        return [color1, color2];
    }
    binary(n, binaryColors) {
        let reg = 0;
        let flag;
        const arrColors = [];
        while (reg < n) {
            if (flag) {
                arrColors.push(binaryColors[0]);
                flag = !flag;
            }
            else {
                arrColors.push(binaryColors[1]);
                flag = !flag;
            }
            reg += 1;
        }
        return arrColors;
    }
    evenlySpacedColors(n) {
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
                    }
                    else {
                        rgb[tmp] += remainder;
                        remainder = 0;
                    }
                }
                else {
                    tmp = (((value - 1) % 3) + 3) % 3;
                    if (rgb[tmp] - remainder < 0) {
                        remainder -= rgb[tmp];
                        rgb[tmp] = 0;
                        add = true;
                    }
                    else {
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
exports.ColorsModel = ColorsModel;


/***/ }),

/***/ 588:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConsensusModel = void 0;
const palettes_1 = __webpack_require__(548);
class ConsensusModel {
    static setConsensusInfo(type, sequences) {
        const idIdentity = -99999999999999;
        const idPhysical = -99999999999998;
        const consensusInfo = [];
        for (let i = 0; i < sequences[0].sequence.length; i++) {
            const consensusColumn = {};
            for (const sequence of sequences) {
                let letter = sequence.sequence[i];
                if (type === 'physical') {
                    if (sequence.id === idIdentity) {
                        continue;
                    }
                    if (letter in palettes_1.Palettes.consensusAaLesk) {
                        letter = palettes_1.Palettes.consensusAaLesk[letter][0];
                    }
                }
                else {
                    if (sequence.id === idPhysical) {
                        continue;
                    }
                }
                if (letter === '-' || !letter) {
                    continue;
                }
                if (consensusColumn[letter]) {
                    consensusColumn[letter] += 1;
                }
                else {
                    consensusColumn[letter] = 1;
                }
            }
            consensusInfo.push(consensusColumn);
        }
        return consensusInfo;
    }
    static createConsensus(type, consensus, consensus2, sequences, regions, threshold, palette) {
        if (threshold < 50) {
            threshold = 100 - threshold;
        }
        let id = -99999999999999;
        let label;
        if (type === 'physical') {
            label = 'Consensus physical ' + threshold + '%';
            id = -99999999999998;
        }
        else {
            label = 'Consensus identity ' + threshold + '%';
        }
        let consensusSequence = '';
        // tslint:disable-next-line:forin
        for (const column in consensus) {
            let maxLetter;
            let maxIndex;
            if (Object.keys(consensus[column]).length === 0) {
                maxLetter = '.';
            }
            else {
                maxLetter = Object.keys(consensus[column]).reduce((a, b) => consensus[column][a] > consensus[column][b] ? a : b);
                maxIndex = consensus[column][maxLetter];
            }
            let backgroundColor;
            let color;
            const frequency = (maxIndex / sequences.length) * 100;
            if (type === 'physical') {
                // consensus id to see if I have all letters equals
                // equals letters have precedence over properties
                let maxLetterId;
                let maxIndexId;
                if (Object.keys(consensus[column]).length === 0) {
                    maxLetterId = '.';
                }
                else {
                    maxLetterId = Object.keys(consensus2[column]).reduce((a, b) => consensus2[column][a] > consensus2[column][b] ? a : b);
                    maxIndexId = consensus2[column][maxLetterId];
                }
                const frequencyId = (maxIndexId / sequences.length) * 100;
                if (frequencyId >= threshold) {
                    maxLetter = maxLetterId;
                    [backgroundColor, color] = ConsensusModel.setColorsIdentity(frequencyId, palette, 'physical');
                }
                else {
                    if (frequency >= threshold) {
                        [backgroundColor, color] = ConsensusModel.setColorsPhysical(maxLetter, palette);
                    }
                }
            }
            else {
                [backgroundColor, color] = ConsensusModel.setColorsIdentity(frequency, palette, 'identity');
            }
            if (frequency < threshold) {
                maxLetter = '.';
            }
            // + 1 because residues start from 1 and not 0
            regions.push({ start: +column + 1, end: +column + 1, sequenceId: id, backgroundColor, color });
            consensusSequence += maxLetter;
        }
        sequences.push({ id, sequence: consensusSequence, label });
        return [sequences, regions];
    }
    static setColorsIdentity(frequency, palette, flag) {
        let backgroundColor;
        let color;
        let finalPalette;
        if (palette && typeof palette !== 'string' && flag == 'identity') {
            finalPalette = palette;
        }
        else {
            finalPalette = palettes_1.Palettes.consensusLevelsIdentity;
        }
        let steps = [];
        for (let key in finalPalette) {
            steps.push(+key); // 42
        }
        steps = steps.sort((a, b) => a < b ? 1 : a > b ? -1 : 0);
        for (const step of steps) {
            if (frequency >= step) {
                backgroundColor = finalPalette[step][0];
                color = finalPalette[step][1];
                break;
            }
        }
        return [backgroundColor, color];
    }
    static setColorsPhysical(letter, palette) {
        let finalPalette;
        let backgroundColor;
        let color;
        if (palette && typeof palette !== 'string') {
            finalPalette = palette;
        }
        else {
            finalPalette = palettes_1.Palettes.consensusAaLesk;
        }
        for (const el in finalPalette) {
            if (finalPalette[el][0] == letter) {
                backgroundColor = finalPalette[el][1];
                color = finalPalette[el][2];
                break;
            }
        }
        return [backgroundColor, color];
    }
    process(sequences, regions, options) {
        if (!regions) {
            regions = [];
        }
        let maxIdx = 0;
        for (const row of sequences) {
            if (maxIdx < row.sequence.length) {
                maxIdx = row.sequence.length;
            }
        }
        for (const row of sequences) {
            const diff = maxIdx - row.sequence.length;
            if (diff > 0 && row.id !== -99999999999999 && row.id !== -99999999999998) {
                for (let i = 0; i < diff; i++) {
                    row.sequence += '-';
                }
            }
        }
        if (options.sequenceColorMatrix) {
            regions = [];
            sequences.sort((a, b) => a.id - b.id);
            const min = sequences[0];
            let palette = palettes_1.Palettes.substitutionMatrixBlosum;
            // console.log(palette)
            if (options.sequenceColorMatrixPalette) {
                palette = options.sequenceColorMatrixPalette;
            }
            let key;
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < min.sequence.length; i++) {
                for (const sequence of sequences) {
                    if (sequence.id === min.id) {
                        key = sequence.sequence[i] + sequence.sequence[i];
                        if (key in palette) {
                            regions.push({ sequenceId: sequence.id, start: i + 1, end: i + 1,
                                backgroundColor: palette[key][0], color: palette[key][1] });
                        }
                    }
                    else {
                        // score with first sequence
                        key = sequence.sequence[i] + min.sequence[i];
                        if (key in palette) {
                            regions.push({ sequenceId: sequence.id, start: i + 1, end: i + 1,
                                backgroundColor: palette[key][0] });
                        }
                        else if (palette[min.sequence[i] + sequence.sequence[i]]) {
                            key = min.sequence[i] + sequence.sequence[i];
                            regions.push({ sequenceId: sequence.id, start: i + 1, end: i + 1,
                                backgroundColor: palette[key][0], color: palette[key][1] });
                        }
                    }
                }
            }
        }
        else if (options.sequenceColor) {
            regions = [];
            for (const sequence of sequences) {
                sequence.sequenceColor = options.sequenceColor;
                regions.push({ sequenceId: sequence.id, start: 1, end: sequence.sequence.length, sequenceColor: options.sequenceColor });
            }
        }
        let consensusInfoIdentity;
        let consensusInfoPhysical;
        if (options.consensusColorIdentity) {
            consensusInfoIdentity = ConsensusModel.setConsensusInfo('identity', sequences);
            [sequences, regions] = ConsensusModel.createConsensus('identity', consensusInfoIdentity, false, sequences, regions, options.consensusDotThreshold, options.consensusColorIdentity);
        }
        else if (options.consensusColorMapping) {
            consensusInfoPhysical = ConsensusModel.setConsensusInfo('physical', sequences);
            if (!consensusInfoIdentity) {
                consensusInfoIdentity = ConsensusModel.setConsensusInfo('identity', sequences);
            }
            [sequences, regions] = ConsensusModel.createConsensus('physical', consensusInfoPhysical, consensusInfoIdentity, sequences, regions, options.consensusDotThreshold, options.consensusColorMapping);
        }
        return [sequences, regions];
    }
}
exports.ConsensusModel = ConsensusModel;


/***/ }),

/***/ 252:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventsModel = void 0;
class EventsModel {
    onRegionSelected() {
        const sequenceViewers = document.getElementsByClassName('cell');
        // @ts-ignore
        for (const sqv of sequenceViewers) {
            sqv.addEventListener('dblclick', r => {
                const evt = new CustomEvent('onRegionSelected', { detail: { char: r.srcElement.innerHTML, x: r.srcElement.dataset.resX, y: r.srcElement.dataset.resY } });
                window.dispatchEvent(evt);
            });
        }
    }
}
exports.EventsModel = EventsModel;


/***/ }),

/***/ 312:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Icons = void 0;
class Icons {
}
exports.Icons = Icons;
Icons.lollipop = '<svg xmlns="http://www.w3.org/2000/svg" width="0.7em" x="0" y="0" id="lollipop" viewBox="0 0 340.16 950.93"><path fill="rgb(255, 99, 71)" d="M311.465,141.232c0,78-63.231,141.232-141.232,141.232  c-78,0-141.232-63.232-141.232-141.232S92.232,0,170.232,0C248.233,0,311.465,63.232,311.465,141.232z M194,280.878h-47.983V566.93  H194V280.878z"/></svg>';
Icons.arrowLeft = '<svg xmlns="http://www.w3.org/2000/svg" width="0.7em" id="Livello_1" x="0px" y="0px" viewBox="0 0 963.78 1587.4" enable-background="new 0 0 963.78 1587.4" xml:space="preserve"><rect style="fill:transparent" x="0.477" y="412.818" stroke="#000000" stroke-miterlimit="10" width="963.781" height="763.636"/><g><defs><rect width="964" height="1587"></rect></defs><clipPath><use overflow="visible"></use></clipPath><polygon style="fill:#FDDD0D;" fill-rule="evenodd" clip-rule="evenodd" points="1589.64,411.77 1589.64,1179.37    756.04,1179.37 756.04,1591.15 0,795.57 756.04,0 756.04,411.77  "> </polygon></g></svg>';
Icons.arrowRight = '<svg xmlns="http://www.w3.org/2000/svg" width="0.7em" id="Layer_1" x="0px" y="0px" viewBox="0 0 964 1587" enable-background="new 0 0 964 1587" xml:space="preserve">  <image id="image0" width="964" height="1587" x="0" y="0" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA8QAAAYzCAMAAAAF3QTDAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABzlBMVEX//////fP+627+63H/ /Of//Ov93Q394zb//Oz95D7//fL95Uj//vb+51L//vn+6F7///z+6WL///3+62////7+7Xz+7oT+ 8JX93Q7+8qL93Q/+86j93hH+9LP93hT+9r793hf/98j93xn/+Mz93x7/+dT94CT/+tz94Sr/++P9 4jL//On+6F3+6WH+7Hv+7YL+8Zr+86f+9LL+9r3/98f/+Mv94i3//Ob94zX95D3//fH95Uf+51H+ 51b//vr+6m3+7Hr+7YH+8JT+8Zn+8qb+9LH93hX+9sH/+dP/++X+5lD+51X+7Hn+7YD+74r+8qX+ 9rz+9sD93xj/+Mr94CP/+tv94Sn94Sz95Dz95Ub+5kv+6WD+6mz+7X/+7on93RD+9LD93hL+9bX9 3x3/+dL94Cb/+t7/++T94jT//vX95kr+51T+6mv+7X7+7of+8Jj+8qT+9r//98n/+dH/+tr//Or9 5Dv//fD95D/+51P+6F/+7X3+7ob+8Jf+8qP+9K/+9LT94B//+dX94CX/+t394Sv94jP95Un+6mr+ 63D+8Jb93xz+74v93hP+7oj94zv+7oP//e/+7Hj95ED+7oX/+ND95UX+6WP+9K7+8qHSDgXQAAAA AWJLR0QAiAUdSAAAAAlwSFlzAAAAYAAAAGAA8GtCzwAAAAd0SU1FB+QMCgojI/oVfZQAAC+qSURB VHja7d13gx3FvedhLayaZGAAY4ZhEEKIJBAmr8jYgC7RgBAIESxAZIHJOQoQ0Qss19d3992uTVSY cM7prv5VeJ5XUF11Pv9J31mzpi7/47DDDjv8f0afApjZ2u5fjjgy+hjArH6MuDvq6OhzADP6KeLu mN9FHwSYzc8Rd8ceF30SYCa/RNwdPxd9FGAWv0bcnXBi9FmAGfwWcXfS76MPA0xvv4i7k6MPA0xv /4i7P0SfBpjaARF3p0QfB5jWgRHPnxp9HmBKB0bcLZwWfSBgOgdF3C2eHn0iYCoHR9ytOyP6SMA0 Dom4W39m9JmAKRwacbfhrOhDAZNbIuJu49nRpwImtlTE3TnnRh8LmNSSEXfnnR99LmBCS0fcbbog +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 RK5CYII="/></svg>';
Icons.strand = '<svg xmlns="http://www.w3.org/2000/svg" width="0.7em" id="Livello_1" x="0px" y="0px" viewBox="0 0 963.78 1587.4" enable-background="new 0 0 963.78 1587.4" xml:space="preserve"><rect style="fill:#FDDD0D;" x="0.477" y="412.818" stroke="#000000" stroke-miterlimit="10" width="963.781" height="763.636"/></svg>';
Icons.noSecondary = '<svg x="0px" y="0px" width="0.7em" viewBox="0 0 963.78 1587.4"><rect style="fill:#706F6F;" x="0.478" y="665.545" width="963.781" height="256.364"/></svg>';
Icons.helix = '<svg xmlns="http://www.w3.org/2000/svg" width="0.7em" id="Livello_1" x="0px" y="0px" viewBox="0 0 963.78 1587.4" enable-background="new 0 0 963.78 1587.4" xml:space="preserve"><path d="M0,665.545"/><path style="fill:rgb(240,0,128);" d="M7,691c-2.825,59.659,8.435,116.653,6.962,176.309  c-2.126,86.119,8.999,168.953,21.967,253.74c7.673,50.17,16.183,100.271,27.762,149.706c17.538,74.873,35.635,148.402,81.801,211.35  c33.037,45.045,76.542,69.859,130.521,79.056c147.959,25.208,225.187-111.229,251.929-232.674  c20.553-93.348,26.027-188.996,35.963-283.827c12.16-116.095-9.854-249.139,51.535-354.533  c26.216-45.008,79.912-87.811,134.044-93.67c65.497-7.09,113.689,52.59,135.384,107.506  c25.648,64.927,33.322,141.579,70.184,201.528c17.244-16.261,10.323-70.57,9.487-95.14c-1.506-44.307,0.823-83.339-6.961-126.96  c-20.395-114.279-22.992-236.804-54.565-347.808C868.34,213.678,812.663-62.602,627.257,12.459  C479.538,72.264,448.893,277.771,431.147,417.19c-8.481,66.632-13.854,133.623-22.581,200.225  c-8.457,64.544-5.9,127.593-22.444,191.979c-17.752,69.089-55.739,176.947-129.987,202.952c-34.633,12.127-72.727,7.646-104-10.787  C39.193,934.987,55.326,786.128,7,681"/></svg>';
Icons.turn = '<svg xmlns="http://www.w3.org/2000/svg" width="0.7em" id="Livello_1" x="0px" y="0px" viewBox="0 0 963.78 1587.4" enable-background="new 0 0 963.78 1587.4" xml:space="preserve"><path fill="#6080ff" stroke="#000000" stroke-width="5" stroke-miterlimit="10" d="M126.836,704.144c-42.996,28.54-85.103-4.688-123.541-28.17  c5.416,3.309-1.803,83.249-1.004,93.44c3.438,43.889,1.282,80.298,28.763,116.171c62.445,81.517,210.775,94.402,267.032-1.93  c50.939-87.229,46.263-186.556,53.467-283.387c6.11-82.125-1.584-146.41,76.221-194.253  c64.567-39.704,136.354-11.421,166.457,54.066c65.666,142.853-13.311,375.025,146.185,470.511  c45.838,27.442,108.556,20.483,155.013-1.621c21.723-10.336,50.014-27.858,60.433-50.822c11.735-25.869,2.965-60.306,3.787-87.663  c1.068-35.55,9.302-79.208-0.628-113.596c-20.617,10.903-33.832,30.3-59.142,38.896c-28.601,9.713-60.777,10.479-82.936-13.122  c-26.177-27.891-19.497-72.643-24.013-107.505c-7.986-61.664-8.833-124.334-14.748-186.227  C766.397,285.641,738.287,161.82,651.007,68.818C582.482-4.198,457.863-19.858,372.696,34.02  c-72.242,45.705-123.991,91.534-151.164,176.089c-29.781,92.673-38.773,200.285-38.475,297.867  c0.167,54.82-2.342,151.334-48.24,190.152C132.154,700.38,129.493,702.38,126.836,704.144z"/></svg>';


/***/ }),

/***/ 473:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IconsModel = void 0;
const icons_1 = __webpack_require__(312);
class IconsModel {
    process(regions, sequences, iconsPaths) {
        const rows = {};
        if (regions && sequences) {
            for (const seq of sequences) {
                for (const reg of regions) {
                    if (+seq.id === reg.sequenceId) {
                        if (!rows[seq.id]) {
                            rows[seq.id] = {};
                        }
                        // tslint:disable-next-line:forin
                        for (let key in sequences.find(x => x.id === seq.id).sequence) {
                            key = (+key + 1).toString();
                            // chars with icon
                            if (+key >= reg.start && +key <= reg.end && reg.icon) {
                                if (reg.icon) {
                                    const region = reg.end - (reg.start - 1);
                                    const center = Math.floor(region / 2);
                                    let icon;
                                    if (reg.color && reg.color[0] === '(') {
                                        reg.color = 'rgb' + reg.color;
                                    }
                                    // default icons
                                    switch (reg.icon) {
                                        case 'lollipop': {
                                            icon = icons_1.Icons.lollipop;
                                            break;
                                        }
                                        case 'arrowRight': {
                                            icon = icons_1.Icons.arrowRight;
                                            break;
                                        }
                                        case 'arrowLeft': {
                                            icon = icons_1.Icons.arrowLeft;
                                            break;
                                        }
                                        case 'strand': {
                                            icon = icons_1.Icons.strand;
                                            break;
                                        }
                                        case 'noSecondary': {
                                            icon = icons_1.Icons.noSecondary;
                                            break;
                                        }
                                        case 'helix': {
                                            icon = icons_1.Icons.helix;
                                            break;
                                        }
                                        case 'turn': {
                                            icon = icons_1.Icons.turn;
                                            break;
                                        }
                                        default: {
                                            // customizable icons (svg)
                                            icon = reg.icon;
                                            break;
                                        }
                                    }
                                    if (reg.display === 'center' && +key === reg.start + center) {
                                        rows[seq.id][key] = { char: icon };
                                    }
                                    else if (!reg.display) {
                                        rows[seq.id][key] = { char: icon };
                                    }
                                }
                            }
                            // chars without icon
                            if (!rows[seq.id][key]) {
                                rows[seq.id][key] = { char: '' };
                            }
                        }
                    }
                }
            }
        }
        const filteredRows = {};
        // tslint:disable-next-line:forin
        for (const row in rows) {
            let flag;
            const chars = rows[row];
            for (const char in rows[row]) {
                if (rows[row][char].char !== '') {
                    flag = true;
                }
            }
            if (flag) {
                filteredRows[row] = chars;
            }
        }
        return filteredRows;
    }
}
exports.IconsModel = IconsModel;


/***/ }),

/***/ 175:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OptionsModel = void 0;
class OptionsModel {
    constructor() {
        this.options = {
            fontSize: '14px',
            chunkSize: 10,
            chunkSeparation: 1,
            emptyFiller: ' ',
            indexesLocation: null,
            wrapLine: true,
            viewerWidth: false,
            consensusType: null,
            consensusDotThreshold: 90,
            lineSeparation: '5px',
            sequenceColor: undefined,
            customPalette: undefined,
            sequenceColorMatrix: undefined,
            sequenceColorMatrixPalette: undefined,
            consensusColorIdentity: undefined,
            consensusColorMapping: undefined,
            selection: undefined
        };
    }
    process(opt) {
        /** check input fontSize */
        if (opt && opt.fontSize) {
            const fSize = opt.fontSize;
            const fNum = +fSize.substr(0, fSize.length - 2);
            const fUnit = fSize.substr(fSize.length - 2, 2);
            if (isNaN(fNum) || (fUnit !== 'px' && fUnit !== 'vw' && fUnit !== 'em')) {
                // wrong fontSize format
            }
            else {
                this.options.fontSize = fSize;
            }
        }
        else {
            // fontSize not set
            this.options.fontSize = '14px'; // default reset
        }
        /** check input chunkSize */
        if (opt && opt.chunkSize) {
            const cSize = +opt.chunkSize;
            if (isNaN(cSize) || cSize < 0) {
                // wrong chunkSize format
            }
            else {
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
        /** check selection value */
        if (opt && opt.selection) {
            if (opt.selection == "columnselection" || opt.selection == "areaselection") {
                this.options.selection = opt.selection;
            }
        }
        /** check sequenceColor value */
        if (opt && opt.sequenceColor) {
            if (typeof opt.sequenceColor !== 'string') {
                this.options.sequenceColor = 'custom';
                this.options.customPalette = opt.sequenceColor;
            }
            else {
                this.options.sequenceColor = opt.sequenceColor;
            }
        }
        /** check sequenceColor value */
        if (opt && opt.sequenceColorMatrix) {
            if (typeof opt.sequenceColorMatrix !== 'string') {
                this.options.sequenceColorMatrix = 'custom';
                this.options.sequenceColorMatrixPalette = opt.sequenceColorMatrix;
            }
            else {
                this.options.sequenceColorMatrix = opt.sequenceColorMatrix;
            }
        }
        /** check consensusType value */
        if (opt && opt.consensusColorIdentity) {
            this.options.consensusColorIdentity = opt.consensusColorIdentity;
        }
        if (opt && opt.consensusColorMapping) {
            this.options.consensusColorMapping = opt.consensusColorMapping;
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
            }
            else {
                this.options.lineSeparation = rSize;
            }
        }
        else {
            // lineSeparation not set
            this.options.lineSeparation = '5px'; // default reset
        }
        /** check wrapline value */
        if (opt && typeof opt.wrapLine == 'boolean') {
            this.options.wrapLine = opt.wrapLine;
        }
        /** check oneLineWidth */
        if (opt && opt.viewerWidth) {
            const viewerWidth = opt.viewerWidth;
            const olNum = +viewerWidth.substr(0, viewerWidth.length - 2);
            const olUnit = viewerWidth.substr(viewerWidth.length - 2, 2);
            if (isNaN(olNum) || (olUnit !== 'px' && olUnit !== 'vw' && olUnit !== 'em')) {
                // wrong oneLineWidth format
            }
            else {
                this.options.viewerWidth = viewerWidth;
            }
        }
        return this.options;
    }
}
exports.OptionsModel = OptionsModel;


/***/ }),

/***/ 548:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Palettes = void 0;
class Palettes {
}
exports.Palettes = Palettes;
// AA propensities
Palettes.clustal = {
    A: '#80a0f0', I: '#80a0f0', L: '#80a0f0', M: '#80a0f0', F: '#80a0f0', W: '#80a0f0', V: '#80a0f0',
    K: '#f01505', R: '#f01505', E: '#c048c0', D: '#c048c0', C: '#f08080', G: '#f09048',
    N: '#15c015', Q: '#15c015', S: '#15c015', T: '#15c015', P: '#c0c000', H: '#15a4a4', Y: '#15a4a4'
};
Palettes.zappo = {
    A: '#ffafaf', R: '#6464ff', N: '#00ff00', D: '#ff0000', C: '#ffff00', Q: '#00ff00', E: '#ff0000',
    G: '#ff00ff', H: '#6464ff', I: '#ffafaf', L: '#ffafaf', K: '#ffafaf', M: '#ffc800', F: '#ff00ff',
    P: '#00ff00', S: '#00ff00', T: '#15c015', W: '#ffc800', V: '#ffc800', Y: '#ffafaf'
};
Palettes.taylor = {
    A: '#ccff00', R: '#0000ff', N: '#cc00ff', D: '#ff0000', C: '#ffff00', Q: '#ff00cc', E: '#ff0066',
    G: '#ff9900', H: '#0066ff', I: '#66ff00', L: '#33ff00', K: '#6600ff', M: '#00ff00', F: '#00ff66',
    P: '#ffcc00', S: '#ff3300', T: '#ff6600', W: '#00ccff', V: '#00ffcc', Y: '#99ff00'
};
Palettes.hydrophobicity = {
    A: '#ad0052', R: '#0000ff', N: '#0c00f3', D: '#0c00f3', C: '#c2003d', Q: '#0c00f3', E: '#0c00f3',
    G: '#6a0095', H: '#1500ea', I: '#ff0000', L: '#ea0015', K: '#0000ff', M: '#b0004f', F: '#cb0034',
    P: '#4600b9', S: '#5e00a1', T: '#61009e', W: '#5b00a4', V: '#4f00b0', Y: '#f60009',
    B: '#0c00f3', X: '#680097', Z: '#0c00f3'
};
Palettes.helixpropensity = {
    A: '#e718e7', R: '#6f906f', N: '#1be41b', D: '#778877', C: '#23dc23', Q: '#926d92', E: '#ff00ff',
    G: '#00ff00', H: '#758a75', I: '#8a758a', L: '#ae51ae', K: '#a05fa0', M: '#ef10ef', F: '#986798',
    P: '#00ff00', S: '#36c936', T: '#47b847', W: '#8a758a', V: '#21de21', Y: '#857a85',
    B: '#49b649', X: '#758a75', Z: '#c936c9'
};
Palettes.strandpropensity = {
    A: '#5858a7', R: '#6b6b94', N: '#64649b', D: '#2121de', C: '#9d9d62', Q: '#8c8c73', E: '#0000ff',
    G: '#4949b6', H: '#60609f', I: '#ecec13', L: '#b2b24d', K: '#4747b8', M: '#82827d', F: '#c2c23d',
    P: '#2323dc', S: '#4949b6', T: '#9d9d62', W: '#c0c03f', V: '#d3d32c', Y: '#ffff00',
    B: '#4343bc', X: '#797986', Z: '#4747b8'
};
Palettes.turnpropensity = {
    A: '#2cd3d3', R: '#708f8f', N: '#ff0000', D: '#e81717', C: '#a85757', Q: '#3fc0c0', E: '#778888',
    G: '#ff0000', H: '#708f8f', I: '#00ffff', L: '#1ce3e3', K: '#7e8181', M: '#1ee1e1', F: '#1ee1e1',
    P: '#f60909', S: '#e11e1e', T: '#738c8c', W: '#738c8c', V: '#9d6262', Y: '#07f8f8',
    B: '#f30c0c', X: '#7c8383', Z: '#5ba4a4'
};
Palettes.buriedindex = {
    A: '#00a35c', R: '#00fc03', N: '#00eb14', D: '#00eb14', C: '#0000ff', Q: '#00f10e', E: '#00f10e',
    G: '#009d62', H: '#00d52a', I: '#0054ab', L: '#007b84', K: '#00ff00', M: '#009768', F: '#008778',
    P: '#00e01f', S: '#00d52a', T: '#00db24', W: '#00a857', V: '#00e619', Y: '#005fa0',
    B: '#00eb14', X: '#00b649', Z: '#00f10e'
};
Palettes.nucleotide = {
    A: '#64F73F', C: '#FFB340', G: '#EB413C', T: '#3C88EE', U: '#3C88EE'
};
Palettes.purinepyrimidine = {
    A: '#FF83FA', C: '#40E0D0', G: '#FF83FA', T: '#40E0D0', U: '#40E0D0', R: '#FF83FA', Y: '#40E0D0'
};
Palettes.consensusLevelsIdentity = {
    100: ['#0A0A0A', '#FFFFFF'],
    70: ['#333333', '#FFFFFF'],
    40: ['#707070', '#FFFFFF'],
    10: ['#A3A3A3', '#FFFFFF'],
    0: ['#FFFFFF', '#FFFFFF']
};
// colour scheme in Lesk, Introduction to Bioinformatics
Palettes.consensusAaLesk = {
    A: ['n', '#f09048', '#FFFFFF'],
    G: ['n', '#f09048', '#FFFFFF'],
    S: ['n', '#f09048', '#FFFFFF'],
    T: ['n', '#f09048', '#FFFFFF'],
    C: ['h', '#558B6E', '#FFFFFF'],
    V: ['h', '#558B6E', '#FFFFFF'],
    I: ['h', '#558B6E', '#FFFFFF'],
    L: ['h', '#558B6E', '#FFFFFF'],
    P: ['h', '#558B6E', '#FFFFFF'],
    F: ['h', '#558B6E', '#FFFFFF'],
    Y: ['h', '#558B6E', '#FFFFFF'],
    M: ['h', '#558B6E', '#FFFFFF'],
    W: ['h', '#558B6E', '#FFFFFF'],
    N: ['p', '#D4358D', '#FFFFFF'],
    Q: ['p', '#D4358D', '#FFFFFF'],
    H: ['p', '#D4358D', '#FFFFFF'],
    D: ['~', '#A10702', '#FFFFFF'],
    E: ['~', '#A10702', '#FFFFFF'],
    K: ['+', '#3626A7', '#FFFFFF'],
    R: ['+', '#3626A7', '#FFFFFF'] // +: positively charged
};
Palettes.substitutionMatrixBlosum = { WF: ['#CFDBF2', '#000000'], QQ: ['#A1B8E3', '#000000'],
    HH: ['#7294D5', '#000000'], YY: ['#81A0D9', '#000000'], ZZ: ['#A1B8E3', '#000000'],
    CC: ['#6288D0', '#000000'], PP: ['#81A0D9', '#000000'], VI: ['#B0C4E8', '#000000'],
    VM: ['#CFDBF2', '#000000'], KK: ['#A1B8E3', '#000000'], ZK: ['#CFDBF2', '#000000'],
    DN: ['#CFDBF2', '#000000'], SS: ['#A1B8E3', '#000000'], QR: ['#CFDBF2', '#000000'],
    NN: ['#91ACDE', '#000000'], YF: ['#B0C4E8', '#000000'], VL: ['#CFDBF2', '#000000'],
    KR: ['#C0CFED', '#000000'], ED: ['#C0CFED', '#000000'], VV: ['#A1B8E3', '#000000'],
    MI: ['#CFDBF2', '#000000'], MM: ['#A1B8E3', '#000000'], ZD: ['#CFDBF2', '#000000'],
    FF: ['#91ACDE', '#000000'], BD: ['#A1B8E3', '#000000'], HN: ['#CFDBF2', '#000000'],
    TT: ['#A1B8E3', '#000000'], SN: ['#CFDBF2', '#000000'], LL: ['#A1B8E3', '#000000'],
    EQ: ['#C0CFED', '#000000'], YW: ['#C0CFED', '#000000'], EE: ['#A1B8E3', '#000000'],
    KQ: ['#CFDBF2', '#000000'], WW: ['#3867BC', '#000000'], ML: ['#C0CFED', '#000000'],
    KE: ['#CFDBF2', '#000000'], ZE: ['#A1B8E3', '#000000'], ZQ: ['#B0C4E8', '#000000'],
    BE: ['#CFDBF2', '#000000'], DD: ['#91ACDE', '#000000'], SA: ['#CFDBF2', '#000000'],
    YH: ['#C0CFED', '#000000'], GG: ['#91ACDE', '#000000'], AA: ['#A1B8E3', '#000000'],
    II: ['#A1B8E3', '#000000'], TS: ['#CFDBF2', '#000000'], RR: ['#A1B8E3', '#000000'],
    LI: ['#C0CFED', '#000000'], ZB: ['#CFDBF2', '#000000'], BN: ['#B0C4E8', '#000000'],
    BB: ['#A1B8E3', '#000000']
};
// original blosum matrix with values < 0, removed from my matrix since we color them white
// static blosum62 = { WF: 1, LR: -2, SP: -1, VT: '0', QQ: 5, NA: -2, ZY: -2, WR: -3, QA: -1, SD: '0', HH: 8, SH: -1, HD: -1, LN: -3, WA: -3,
//   YM: -1, GR: -2, YI: -1, YE: -2, BY: -3, YA: -2, VD: -3, BS: '0', YY: 7, GN: '0', EC: -4, YQ: -1, ZZ: 4, VA: '0', CC: 9, MR: -1, VE: -2,
//   TN: '0', PP: 7, VI: 3, VS: -2, ZP: -1, VM: 1, TF: -2, VQ: -2, KK: 5, PD: -1, IH: -3, ID: -3, TR: -1, PL: -3, KG: -2, MN: -2,
//   PH: -2, FQ: -3, ZG: -2, XL: -1, TM: -1, ZC: -3, XH: -1, DR: -2, BW: -4, XD: -1, ZK: 1, FA: -2, ZW: -3, FE: -3, DN: 1, BK: '0',
//   XX: -1, FI: '0', BG: -1, XT: '0', FM: '0', BC: -3, ZI: -3, ZV: -2, SS: 4, LQ: -2, WE: -3, QR: 1, NN: 6, WM: -1, QC: -3, WI: -3, SC: -1,
//   LA: -1, SG: '0', LE: -3, WQ: -2, HG: -2, SK: '0', QN: '0', NR: '0', HC: -3, YN: -2, GQ: -2, YF: 3, CA: '0', VL: 1, GE: -2, GA: '0',
//   KR: 2, ED: 2, YR: -2, MQ: '0', TI: -1, CD: -3, VF: -1, TA: '0', TP: -1, BP: -2, TE: -1, VN: -3, PG: -2, MA: -1, KH: -1, VR: -3,
//   PC: -3, ME: -2, KL: -2, VV: 4, MI: 1, TQ: -1, IG: -4, PK: -1, MM: 5, KD: -1, IC: -1, ZD: 1, FR: -3, XK: -1, QD: '0', XG: -1, ZL: -3,
//   XC: -2, ZH: '0', BL: -4, BH: '0', FF: 6, XW: -2, BD: 4, DA: -2, SL: -2, XS: '0', FN: -3, SR: -1, WD: -4, VY: -1, WL: -2, HR: '0',
//   WH: -2, HN: 1, WT: -2, TT: 5, SF: -2, WP: -4, LD: -4, BI: -3, LH: -3, SN: 1, BT: -1, LL: 4, YK: -2, EQ: 2, YG: -3, ZS: '0', YC: -2,
//   GD: -1, BV: -3, EA: -1, YW: 2, EE: 5, YS: -2, CN: -3, VC: -1, TH: -2, PR: -2, VG: -3, TL: -1, VK: -2, KQ: 1, RA: -1, IR: -3, TD: -1,
//   PF: -4, IN: -3, KI: -3, MD: -3, VW: -3, WW: 11, MH: -2, PN: -2, KA: -1, ML: 2, KE: 1, ZE: 4, XN: -1, ZA: -1, ZM: -1, XF: -1,
//   KC: -3, BQ: '0', XB: -1, BM: -3, FC: -2, ZQ: 3, XZ: -1, FG: -3, BE: 1, XV: -1, FK: -3, BA: -2, XR: -1, DD: 6, WG: -2, ZF: -3, SQ: '0',
//   WC: -2, WK: -3, HQ: '0', LC: -1, WN: -4, SA: 1, LG: -4, WS: -3, SE: '0', HE: '0', SI: -2, HA: -2, SM: -1, YL: -1, YH: 2,
//   YD: -3, ER: '0', XP: -2, GG: 6, GC: -3, EN: '0', YT: -2, YP: -3, TK: -1, AA: 4, PQ: -1, TC: -1, VH: -3, TG: -2, IQ: -3, ZT: -1,
//   CR: -3, VP: -2, PE: -1, MC: -1, KN: '0', II: 4, PA: -1, MG: -3, TS: 1, IE: -3, PM: -2, MK: -1, IA: -1, PI: -3, RR: 5, XM: -1, LI: 2,
//   XI: -1, ZB: 1, XE: -1, ZN: '0', XA: '0', BR: -1, BN: 3, FD: -3, XY: -1, ZR: '0', FH: -1, BF: -3, FL: '0', XQ: -1, BB: 4
// };


/***/ }),

/***/ 227:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PatternsModel = void 0;
class PatternsModel {
    // find index of matched regex positions and create array of regions with color
    process(patterns, sequences) {
        if (!patterns) {
            return;
        }
        const regions = []; // OutPatterns
        // @ts-ignore
        for (const element of patterns) {
            // tslint:disable-next-line:no-conditional-assignment
            const pattern = element.pattern;
            let str;
            if (sequences.find(x => x.id === element.sequenceId)) {
                str = sequences.find(x => x.id === element.sequenceId).sequence;
                if (element.start && element.end) {
                    str = str.substr(element.start - 1, element.end - (element.start - 1));
                }
                this.regexMatch(str, pattern, regions, element);
            }
            else {
                for (const seq of sequences) {
                    // regex
                    if (element.start && element.end) {
                        str = seq.sequence.substr(element.start - 1, element.end - (element.start - 1));
                    }
                    this.regexMatch(str, pattern, regions, element);
                }
            }
        }
        return regions;
    }
    regexMatch(str, pattern, regions, element) {
        const re = new RegExp(pattern, "g");
        let match;
        // tslint:disable-next-line:no-conditional-assignment
        while ((match = re.exec(str)) != null) {
            regions.push({ start: +match.index + 1, end: +match.index + +match[0].length,
                backgroundColor: element.backgroundColor, color: element.color, backgroundImage: element.backgroundImage,
                borderColor: element.borderColor, borderStyle: element.borderStyle, sequenceId: element.sequenceId });
        }
    }
}
exports.PatternsModel = PatternsModel;


/***/ }),

/***/ 505:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProSeqViewer = void 0;
const options_model_1 = __webpack_require__(175);
const rows_model_1 = __webpack_require__(912);
const colors_model_1 = __webpack_require__(333);
const selection_model_1 = __webpack_require__(788);
const icons_model_1 = __webpack_require__(473);
const sequenceInfoModel_1 = __webpack_require__(695);
const events_model_1 = __webpack_require__(252);
const patterns_model_1 = __webpack_require__(227);
const consensus_model_1 = __webpack_require__(588);
class ProSeqViewer {
    constructor(divId) {
        this.divId = divId;
        this.init = false;
        this.params = new options_model_1.OptionsModel();
        this.rows = new rows_model_1.RowsModel();
        this.consensus = new consensus_model_1.ConsensusModel();
        this.regions = new colors_model_1.ColorsModel();
        this.patterns = new patterns_model_1.PatternsModel();
        this.icons = new icons_model_1.IconsModel();
        this.labels = new sequenceInfoModel_1.SequenceInfoModel();
        this.selection = new selection_model_1.SelectionModel();
        this.events = new events_model_1.EventsModel();
        window.onresize = () => {
            this.calculateIdxs(false);
        };
        window.onclick = () => {
            this.calculateIdxs(true);
        }; // had to add this to cover mobidb toggle event
    }
    calculateIdxs(flag) {
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
                    }
                    else {
                        chunks[i].firstElementChild.className = 'idx hidden';
                    }
                }
            }
        }
    }
    draw(inputs) {
        const sqvBody = document.getElementById(this.divId);
        sqvBody.innerHTML = `<div class="root"> <div class="loading">input error</div> </div>`;
        ProSeqViewer.sqvList.push(this.divId);
        let labels;
        let labelsFlag;
        let startIndexes;
        let tooltips;
        let data;
        /** check and process parameters input */
        inputs.options = this.params.process(inputs.options);
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
    generateLabels(idx, labels, startIndexes, indexesLocation, chunkSize, fontSize, tooltips, data, lineSeparation) {
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
                    }
                    else {
                        labelshtml += `<span class="lbl-hidden" style="margin-bottom:${lineSeparation}"><span class="lbl"></span></span>`;
                    }
                }
                else {
                    count += 1;
                    if (idx) {
                        if (!chunkSize) {
                            // lateral index regular
                            labelshtml += `<span class="lbl-hidden" style="width: ${fontSize};margin-bottom:${lineSeparation}">
                            <span class="lbl" >${(startIndexes[count] - 1) + idx}</span></span>`;
                        }
                        else {
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
                    }
                    else {
                        labelshtml += `<span class="lbl-hidden" style="margin-bottom:${lineSeparation}"><span class="lbl">${labels[count]}${tooltips[count]}</span></span>`;
                    }
                }
                flag = false;
            }
            if (indexesLocation == 'lateral') {
                labelsContainer = `<span class="lblContainer" style="display: inline-block">${labelshtml}</span>`;
            }
            else {
                // add margin in case we only have labels and no indexes
                labelsContainer = `<span class="lblContainer" style="margin-right:10px;display: inline-block">${labelshtml}</span>`;
            }
        }
        return labelsContainer;
    }
    addTopIndexes(chunkSize, x, maxTop, rowMarginBottom) {
        let cells = '';
        // adding top indexes
        let chunkTopIndex;
        if (x % chunkSize === 0 && x <= maxTop) {
            chunkTopIndex = `<span class="cell" style="-webkit-user-select: none;direction: rtl;display:block;width:0.6em;margin-bottom:${rowMarginBottom}">${x}</span>`;
        }
        else {
            chunkTopIndex = `<span class="cell" style="-webkit-user-select: none;display:block;visibility: hidden;margin-bottom:${rowMarginBottom}">0</span>`;
        }
        cells += chunkTopIndex;
        return cells;
    }
    createGUI(data, labels, startIndexes, tooltips, options, labelsFlag) {
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
            if (maxIdx < Object.keys(row).length) {
                maxIdx = Object.keys(row).length;
            }
            if (maxTop < Object.keys(row).length) {
                maxTop = Object.keys(row).length;
            }
        }
        const lenghtIndex = maxIdx.toString().length;
        const indexWidth = (fNum * lenghtIndex).toString() + fUnit;
        // consider the last chunk even if is not long enough
        if (chunkSize > 0) {
            maxIdx += (chunkSize - (maxIdx % chunkSize)) % chunkSize;
        }
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
            if (indexesLocation == 'top') {
                cells = this.addTopIndexes(chunkSize, x, maxTop, lineSeparation);
            }
            ;
            for (let y = 0; y < data.length; y++) {
                entity = data[y][x];
                style = 'font-size: 1em;display:block;height:1em;line-height:1em;margin-bottom:' + lineSeparation;
                if (y === data.length - 1) {
                    style = 'font-size: 1em;display:block;line-height:1em;margin-bottom:' + lineSeparation;
                }
                if (!entity) {
                    // emptyfiller
                    style = 'font-size: 1em;display:block;color: rgba(0, 0, 0, 0);height:1em;line-height:1em;margin-bottom:' + lineSeparation;
                    cell = `<span style="${style}">A</span>`; // mock char, this has to be done to have chunks all of the same length (last chunk can't be shorter)
                }
                else {
                    if (entity.target) {
                        style += `${entity.target}`;
                    }
                    if (entity.char && !entity.char.includes('svg')) {
                        // y is the row, x is the column
                        cell = `<span class="cell" data-res-x='${x}' data-res-y= '${y}' data-res-id= '${this.divId}'
                    style="${style}">${entity.char}</span>`;
                    }
                    else {
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
                if (indexesLocation != 'top') {
                    idxNum += chunkSize; // lateral index (set only if top indexes missing)
                    idx = idxNum - (chunkSize - 1);
                    // adding labels
                    const gapsContainer = this.generateLabels(idx, labels, startIndexes, indexesLocation, chunkSize, indexWidth, false, data, lineSeparation);
                    if (labels[0] === '') {
                        index = gapsContainer; // lateral number indexes
                    }
                    else {
                        index = labelsContainer + gapsContainer; // lateral number indexes + labels
                    }
                    if (!labelsFlag) {
                        index = gapsContainer; // lateral number indexes
                    }
                    else {
                        if (indexesLocation == 'lateral') {
                            index = labelsContainer + gapsContainer; // lateral number indexes + labels
                        }
                        else {
                            index = labelsContainer; // lateral number indexes + labels
                        }
                    }
                }
                else {
                    index = labelsContainer;
                }
                index = `<div class="idx hidden">${index}</div>`;
                style = `font-size: ${fontSize};`;
                if (x !== maxIdx) {
                    style += 'padding-right: ' + chunkSeparation + 'em;';
                }
                else {
                    style += 'margin-right: ' + chunkSeparation + 'em;';
                }
                let chunk = '';
                if (labelsFlag || options.consensusType || indexesLocation == 'lateral') {
                    chunk = `<div class="cnk" style="${style}">${index}<div class="crds">${cards}</div></div>`;
                }
                else {
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
        }
        else {
            innerHTML = `<div class="root" style="display: flex">
                        <div style="display:inline-block;overflow-x:scroll;white-space: nowrap;width:${viewerWidth}"> ${html}</div>
                        </div>`;
        }
        sqvBody.innerHTML = innerHTML;
        window.dispatchEvent(new Event('resize'));
    }
}
window.ProSeqViewer = ProSeqViewer;
ProSeqViewer.sqvList = [];
window.ProSeqViewer = ProSeqViewer; // VERY IMPORTANT AND USEFUL TO BE ABLE TO HAVE A WORKING BUNDLE.JS!! NEVER DELETE THIS LINE


/***/ }),

/***/ 912:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RowsModel = void 0;
const palettes_1 = __webpack_require__(548);
const colors_model_1 = __webpack_require__(333);
class RowsModel {
    constructor() {
        this.substitutiveId = 99999999999999;
    }
    processRows(rows, icons, regions, opt) {
        const allData = [];
        // decide which color is more important in case of overwriting
        const coloringOrder = ['custom', 'clustal', 'zappo', 'gradient', 'binary'];
        // order row Numbers
        const rowNumsOrdered = Object.keys(rows).map(Number).sort((n1, n2) => n1 - n2);
        // order keys of Row object
        const ordered = {};
        for (const rowNum of rowNumsOrdered) {
            ordered[rowNum] = Object.keys(rows[+rowNum]).map(Number).sort((n1, n2) => n1 - n2);
        }
        let data;
        let coloringRowNums;
        let tmp;
        // loop through data rows
        for (const rowNum of rowNumsOrdered) {
            tmp = ordered[rowNum];
            // data key: indexes, value: chars
            data = rows[rowNum];
            // data[rowNum].label = this.rows.getLabel(rowNum, this.sequences);
            // console.log(data)
            if (regions) {
                for (const coloring of coloringOrder.reverse()) {
                    coloringRowNums = colors_model_1.ColorsModel.getRowsList(coloring).map(Number);
                    // if there is coloring for the data row
                    if (coloringRowNums.indexOf(rowNum) < 0) {
                        // go to next coloring
                        continue;
                    }
                    const positions = colors_model_1.ColorsModel.getPositions(coloring, rowNum);
                    // positions = start, end, target (bgcolor || fgcolor)
                    if (positions.length > 0) {
                        for (const e of positions) {
                            for (let i = e.start; i <= e.end; i++) {
                                if (!data[i]) {
                                    continue;
                                }
                                if (e.backgroundColor && !e.backgroundColor.startsWith('#')) { // is a palette
                                    if (e.backgroundColor == 'custom') {
                                        data[i].backgroundColor = opt.customPalette[data[i].char];
                                    }
                                    else {
                                        data[i].backgroundColor = palettes_1.Palettes[e.backgroundColor][data[i].char]; // e.backgroundcolor = zappo, clustal..
                                    }
                                }
                                else {
                                    data[i].backgroundColor = e.backgroundColor; // is a region or pattern
                                }
                                data[i].target = e.target + 'background-color:' + data[i].backgroundColor;
                            }
                        }
                    }
                }
                if (icons !== {}) {
                    const iconsData = icons[rowNum];
                    if (iconsData) {
                        allData.push(iconsData);
                    }
                }
            }
            allData.push(data);
        }
        return allData;
    }
    process(sequences, icons, regions, opt) {
        // check and set global sequenceColor
        if (opt && opt.sequenceColor) {
            // @ts-ignore
            for (const sequence of sequences) {
                if (!sequence.sequenceColor) {
                    sequence.sequenceColor = opt.sequenceColor;
                }
            }
        }
        // keep previous data
        if (!sequences) {
            return;
        }
        // reset data
        const rows = {};
        // check if there are undefined or duplicate ids and prepare to reset them
        const values = [];
        let undefinedValues = 0;
        for (const r of Object.keys(sequences)) {
            if (isNaN(+sequences[r].id)) {
                // missing id
                undefinedValues += 1;
                sequences[r].id = this.substitutiveId;
                this.substitutiveId -= 1;
                // otherwise just reset missing ids and log the resetted id
            }
            else {
                if (values.includes(+sequences[r].id)) {
                    // Duplicate sequence id
                    delete sequences[r];
                }
                else {
                    values.push(+sequences[r].id);
                }
            }
        }
        for (const row of Object.keys(sequences)) {
            /** check sequences id type */
            let id;
            if (isNaN(+sequences[row].id)) {
                id = values.sort()[values.length - 1] + 1;
            }
            else {
                id = sequences[row].id;
            }
            /** set row chars */
            rows[id] = {};
            for (const idx of Object.keys(sequences[row].sequence)) {
                const idxKey = (+idx + 1).toString();
                const char = sequences[row].sequence[idx];
                rows[id][idxKey] = { char };
            }
        }
        return this.processRows(rows, icons, regions, opt);
    }
}
exports.RowsModel = RowsModel;


/***/ }),

/***/ 788:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SelectionModel = void 0;
class SelectionModel {
    constructor() {
        this.event_sequence = [];
    }
    set_start(e) {
        let id;
        let element;
        if (e.path) {
            // chrome support
            element = e.path[0];
            id = document.getElementById(element.dataset.resId);
        }
        else {
            // firefox support
            element = e.originalTarget;
            id = document.getElementById(element.dataset.resId);
        }
        this.lastId = element.dataset.resId;
        this.lastSqv = id;
        this.start = { y: element.dataset.resY, x: element.dataset.resX, sqvId: element.dataset.resId };
        this.lastOver = { y: element.dataset.resY, x: element.dataset.resX, sqvId: element.dataset.resId };
        const elements = document.querySelectorAll('[data-res-id=' + element.dataset.resId + ']');
        this.selectionhighlight(elements);
        this.firstOver = false;
    }
    selectionhighlight(elements) {
        for (const selection of elements) {
            const x = +selection.getAttribute('data-res-x');
            const y = +selection.getAttribute('data-res-y');
            let firstX = Math.min(+this.start.x, +this.lastOver.x);
            let lastX = Math.max(+this.start.x, +this.lastOver.x);
            let firstY = Math.min(+this.start.y, +this.lastOver.y);
            let lastY = Math.max(+this.start.y, +this.lastOver.y);
            // on every drag reselect the whole area ...
            if (x >= +firstX && x <= +lastX &&
                y >= +firstY && y <= +lastY &&
                selection.getAttribute('data-res-id') === this.lastOver.sqvId) {
                selection.classList.add('highlight');
            }
            else {
                selection.classList.remove('highlight');
            }
        }
    }
    process() {
        const sequenceViewers = document.getElementsByClassName('cell');
        // remove selection on new click
        window.onmousedown = (event) => {
            this.event_sequence.push(0);
            // @ts-ignore
            for (const sqv of sequenceViewers) {
                sqv.onmousedown = (e) => {
                    this.set_start(e);
                };
            }
            if (this.event_sequence[0] == 0 && this.event_sequence[1] == 1 && this.event_sequence[2] == 2 && this.event_sequence[0] == 0) {
                console.log(event.which);
                // left click
                const elements = document.querySelectorAll('[data-res-id=' + this.lastId + ']');
                // @ts-ignore
                for (const selection of elements) {
                    selection.classList.remove('highlight');
                }
            }
            this.firstOver = true;
            this.event_sequence = [0];
        };
        // @ts-ignore
        for (const sqv of sequenceViewers) {
            sqv.onmouseover = (e) => {
                if (!(1 in this.event_sequence)) {
                    this.event_sequence.push(1);
                }
                if (this.firstOver) {
                    this.set_start(e);
                }
                let element;
                if (e.path) {
                    element = e.path[0];
                }
                else {
                    element = e.originalTarget;
                }
                if (this.start) {
                    this.lastOver = { y: element.dataset.resY, x: element.dataset.resX, sqvId: element.dataset.resId };
                    const elements = document.querySelectorAll('[data-res-id=' + element.dataset.resId + ']');
                    if (this.lastId == element.dataset.resId) {
                        this.selectionhighlight(elements);
                    }
                }
            };
        }
        document.body.onmouseup = () => {
            this.event_sequence.push(2);
            this.firstOver = false;
            if (this.start) {
                this.start = undefined;
            }
            if (this.event_sequence[0] == 0 && this.event_sequence[1] == 2) {
                const elements = document.querySelectorAll('[data-res-id=' + this.lastId + ']');
                // @ts-ignore
                for (const selection of elements) {
                    selection.classList.remove('highlight');
                }
            }
        };
        document.body.addEventListener('keydown', (e) => {
            const elements = document.querySelectorAll('[data-res-id=' + this.lastId + ']');
            // @ts-ignore
            e = e || window.event;
            const key = e.which || e.keyCode; // keyCode detection
            const ctrl = e.ctrlKey ? e.ctrlKey : ((key === 17)); // ctrl detection
            if (key === 67 && ctrl) {
                let textToPaste = '';
                const textDict = {};
                let row = '';
                // tslint:disable-next-line:forin
                // @ts-ignore
                for (const selection of elements) {
                    if (selection.classList.contains('highlight')) {
                        if (!textDict[selection.getAttribute('data-res-y')]) {
                            textDict[selection.getAttribute('data-res-y')] = '';
                        }
                        // new line when new row
                        if (selection.getAttribute('data-res-y') !== row && row !== '') {
                            textDict[selection.getAttribute('data-res-y')] += selection.innerText;
                        }
                        else {
                            textDict[selection.getAttribute('data-res-y')] += selection.innerText;
                        }
                        row = selection.getAttribute('data-res-y');
                    }
                }
                let flag;
                for (const textRow in textDict) {
                    if (flag) {
                        textToPaste += '\n' + textDict[textRow];
                    }
                    else {
                        textToPaste += textDict[textRow];
                        flag = true;
                    }
                }
                if (textToPaste !== '') {
                    // copy to clipboard for the paste event
                    const dummy = document.createElement('textarea');
                    document.body.appendChild(dummy);
                    dummy.value = textToPaste;
                    dummy.select();
                    document.execCommand('copy');
                    document.body.removeChild(dummy);
                    const evt = new CustomEvent('onHighlightSelection', { detail: { text: textToPaste, eventType: 'highlight selection' } });
                    window.dispatchEvent(evt);
                }
            }
        }, false);
    }
}
exports.SelectionModel = SelectionModel;


/***/ }),

/***/ 695:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SequenceInfoModel = void 0;
class SequenceInfoModel {
    constructor() {
        this.isHTML = (str) => {
            const fragment = document.createRange().createContextualFragment(str);
            // remove all non text nodes from fragment
            fragment.querySelectorAll('*').forEach(el => el.parentNode.removeChild(el));
            // if there is textContent, then not a pure HTML
            return !(fragment.textContent || '').trim();
        };
    }
    process(regions, sequences) {
        const labels = [];
        const startIndexes = [];
        const tooltips = [];
        let flag;
        sequences.sort((a, b) => a.id - b.id);
        for (const seq of sequences) {
            if (!seq) {
                continue;
            }
            if (seq.startIndex) {
                startIndexes.push(seq.startIndex);
            }
            else {
                startIndexes.push(1);
            }
            if (seq.labelTooltip) {
                tooltips.push(seq.labelTooltip);
            }
            else {
                tooltips.push('<span></span>');
            }
            if (seq.label && !this.isHTML(seq.label)) {
                labels.push(seq.label);
                flag = true; // to check if I have at least one label
            }
            else {
                labels.push('');
            }
        }
        return [labels, startIndexes, tooltips, flag];
    }
}
exports.SequenceInfoModel = SequenceInfoModel;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
__webpack_unused_export__ = void 0;
var proseqviewer_1 = __webpack_require__(505);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return proseqviewer_1.ProSeqViewer; } });

})();

/******/ })()
;