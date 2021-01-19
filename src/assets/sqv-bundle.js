(function(e, a) { for(var i in a) e[i] = a[i]; if(a.__esModule) Object.defineProperty(e, "__esModule", { value: true }); }(exports,
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 138:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var sequence_viewer_1 = __webpack_require__(406);
exports.SequenceViewer = sequence_viewer_1.SequenceViewer;


/***/ }),

/***/ 959:
/***/ ((__unused_webpack_module, exports) => {

class CharsModel {
}
exports.CharsModel = CharsModel;


/***/ }),

/***/ 217:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var log_model_1 = __webpack_require__(60);
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
    process(allInputs, ordering) {
        const colorSchemeRegions = [];
        for (const sequence of allInputs.sequences) {
            if (sequence.colorScheme === 'clustal') {
                // @ts-ignore
                colorSchemeRegions.push({ sequenceId: sequence.id, start: 1, end: sequence.sequence.length, colorScheme: 'clustal' });
                for (const reg of allInputs.regions) {
                    if (reg.sequenceId === sequence.id) {
                        reg.start = 1;
                        reg.end = sequence.sequence.length;
                    }
                }
            }
        }
        if (colorSchemeRegions.length > 0) {
            allInputs.regions = colorSchemeRegions;
        }
        const allRegions = Array.prototype.concat(allInputs.icons, allInputs[ordering[0]], allInputs[ordering[1]]);
        const newRegions = this.transformInput(allRegions, allInputs.sequences);
        this.transformColors();
        return newRegions;
    }
    transformInput(regions, sequences) {
        // if don't receive new colors, keep old colors
        if (!regions) {
            return;
        }
        const newRegions = this.fixMissingIds(regions, sequences);
        // if receive new colors, change them
        ColorsModel.palette = {};
        let info;
        // transform input structure
        // @ts-ignore
        for (const reg of newRegions) {
            // if first element in region is a number: e.g. '1-2'
            if (isNaN(+reg.start) || isNaN(+reg.end)) {
                log_model_1.Log.w(2, 'missing region bounds.');
                continue;
            }
            else if (+reg.start > +reg.end) {
                log_model_1.Log.w(1, 'end bound less than start bound.');
                continue;
            }
            let colorScheme;
            if (reg.icon) {
                continue;
            }
            if (sequences.find(x => x.id === reg.sequenceId)) {
                colorScheme = sequences.find(x => x.id === reg.sequenceId).colorScheme;
                if (colorScheme && colorScheme !== 'blosum62') {
                    if (reg.backgroundColor) {
                        let log = '';
                        log += 'Colorscheme is set. Cannot set color: ' + reg.backgroundColor + '. ';
                        log += 'New color: ' + colorScheme + '.';
                        log_model_1.Log.w(2, log);
                    }
                    reg.colorScheme = colorScheme;
                }
            }
            info = this.processColor(reg);
            if (info === -1) {
                continue;
            }
            ColorsModel.palette[info.type][info.sequenceId].positions
                .push({ start: reg.start, end: reg.end, target: info.letterStyle });
            if (colorScheme && colorScheme.includes('binary')) {
                // @ts-ignore
                ColorsModel.palette[info.type].binaryColors = this.getBinaryColors(colorScheme);
            }
        }
        return newRegions;
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
    transformColors() {
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
                case 'clustal': {
                    // tslint:disable-next-line:forin
                    for (const row in ColorsModel.palette[type]) {
                        c = ColorsModel.palette[type][row];
                        if (c.positions.length > 0) {
                            for (const pos of c.positions) {
                                pos.backgroundColor = '@clustal';
                            }
                        }
                    }
                    break;
                }
                case 'blosum62': {
                    // calculated separately in consensus model
                    break;
                }
                default: {
                    log_model_1.Log.w(1, 'Unknown coloring type.');
                    break;
                }
            }
        }
    }
    processColor(e) {
        const result = { type: 'custom', sequenceId: -1, letterStyle: '' };
        // check if row key is a number
        if (e.sequenceId === undefined || isNaN(+e.sequenceId)) {
            log_model_1.Log.w(1, 'wrong entity row key.');
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
        if (e.borderColor) {
            e.borderColor = this.checkColor(e.borderColor);
            result.letterStyle += `border-color: ${e.borderColor};`;
        }
        if (e.borderStyle) {
            result.letterStyle += `border-style: ${e.borderStyle};`;
        }
        // define color or palette
        if (e.colorScheme) {
            result.type = e.colorScheme;
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
            log_model_1.Log.w(1, 'invalid color format');
            return -1;
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
            log_model_1.Log.w(1, 'invalid hex format.');
            return -1;
        }
        for (let i = 0; i < 3; i++) {
            l1 = c[hex[i * 2]];
            l2 = c[hex[i * 2 + 1]];
            if (l1 === undefined || l2 === undefined) {
                log_model_1.Log.w(1, 'Invalid char in hex value.');
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
                    log_model_1.Log.w(1, 'wrong value for rgb.');
                    return -1;
                }
            }
            prefix = 'rgb';
        }
        if (rgb.length > 3) {
            tmp = +rgb[3];
            if (isNaN(tmp) || tmp < 0 || tmp > 1) {
                log_model_1.Log.w(1, 'wrong opacity value for rgb.');
                return -1;
            }
            prefix = 'rgba';
            result = '(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ', ' + rgb[3] + ')';
        }
        else {
            result = '(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')';
        }
        if (rgb.length <= 2 || rgb.length > 4) {
            log_model_1.Log.w(1, 'invalid format for rgb.');
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

/***/ 310:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var palettes_1 = __webpack_require__(186);
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
                    letter = palettes_1.Palettes.letterTransform[letter];
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
    static createConsensus(type, consensus, consensus2, sequences, regions, threshold) {
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
                    [backgroundColor, color] = ConsensusModel.setColorsIdentity(frequencyId);
                }
                else {
                    if (frequency >= threshold) {
                        [backgroundColor, color] = ConsensusModel.setColorsPhysical(maxLetter);
                    }
                }
            }
            else {
                [backgroundColor, color] = ConsensusModel.setColorsIdentity(frequency);
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
    static setColorsIdentity(frequency) {
        let backgroundColor;
        let color;
        const step1 = 100;
        const step2 = 70;
        const step3 = 40;
        const step4 = 10;
        const step5 = 0;
        if (frequency === step1) {
            backgroundColor = palettes_1.Palettes.consensus[step1].backgroundColor;
            color = palettes_1.Palettes.consensus[step1].color;
        }
        else if (frequency > step2) {
            backgroundColor = palettes_1.Palettes.consensus[step2].backgroundColor;
            color = palettes_1.Palettes.consensus[step2].color;
        }
        else if (frequency > step3) {
            backgroundColor = palettes_1.Palettes.consensus[step3].backgroundColor;
            color = palettes_1.Palettes.consensus[step3].color;
        }
        else if (frequency > step4) {
            backgroundColor = palettes_1.Palettes.consensus[step4].backgroundColor;
            color = palettes_1.Palettes.consensus[step4].color;
        }
        else {
            backgroundColor = palettes_1.Palettes.consensus[step5].backgroundColor;
            color = palettes_1.Palettes.consensus[step5].color;
        }
        return [backgroundColor, color];
    }
    static setColorsPhysical(letter) {
        let backgroundColor;
        let color;
        backgroundColor = palettes_1.Palettes.physicalProp[letter].backgroundColor;
        color = palettes_1.Palettes.physicalProp[letter].color;
        return [backgroundColor, color];
    }
    static resetOrdering(ordering) {
        // in case there where no regions in input, well now there are
        if (!ordering.includes('regions')) {
            if (ordering) {
                ordering.unshift('regions');
            }
            else {
                ordering.push('regions');
            }
        }
        return ordering;
    }
    process(sequences, regions, options, ordering) {
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
        if (options.colorScheme === 'blosum62') {
            sequences.sort((a, b) => a.id - b.id);
            const min = sequences[0];
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < min.sequence.length; i++) {
                for (const sequence of sequences) {
                    let score;
                    if (sequence.id === min.id) {
                        score = palettes_1.Palettes.blosum62[sequence.sequence[i] + sequence.sequence[i]];
                        // score with itself
                        regions.push({ sequenceId: sequence.id, start: i + 1, end: i + 1,
                            backgroundColor: palettes_1.Palettes.blosum[score].backgroundColor });
                    }
                    else {
                        // score with first sequence
                        if (palettes_1.Palettes.blosum62[sequence.sequence[i] + min.sequence[i]]) {
                            score = palettes_1.Palettes.blosum62[sequence.sequence[i] + min.sequence[i]];
                        }
                        else {
                            score = palettes_1.Palettes.blosum62[min.sequence[i] + sequence.sequence[i]];
                        }
                        if (!score) {
                            score = '-';
                        }
                        regions.push({ sequenceId: sequence.id, start: i + 1, end: i + 1,
                            backgroundColor: palettes_1.Palettes.blosum[score].backgroundColor });
                    }
                }
            }
            ordering = ConsensusModel.resetOrdering(ordering);
        }
        let consensusInfoIdentity;
        let consensusInfoPhysical;
        switch (options.consensusType) {
            case 'identity': {
                consensusInfoIdentity = ConsensusModel.setConsensusInfo('identity', sequences);
                [sequences, regions] = ConsensusModel.createConsensus('identity', consensusInfoIdentity, false, sequences, regions, options.consensusThreshold);
                ordering = ConsensusModel.resetOrdering(ordering);
                break;
            }
            case 'physical': {
                consensusInfoPhysical = ConsensusModel.setConsensusInfo('physical', sequences);
                if (!consensusInfoIdentity) {
                    consensusInfoIdentity = ConsensusModel.setConsensusInfo('identity', sequences);
                }
                [sequences, regions] = ConsensusModel.createConsensus('physical', consensusInfoPhysical, consensusInfoIdentity, sequences, regions, options.consensusThreshold);
                ordering = ConsensusModel.resetOrdering(ordering);
                break;
            }
        }
        return [sequences, regions, ordering];
    }
}
exports.ConsensusModel = ConsensusModel;


/***/ }),

/***/ 999:
/***/ ((__unused_webpack_module, exports) => {

class EventsModel {
    onRegionSelected() {
        const sequenceViewers = document.getElementsByClassName('cell');
        // @ts-ignore
        for (const sqv of sequenceViewers) {
            sqv.addEventListener('dblclick', r => {
                console.log(r);
                const evt = new CustomEvent('onRegionSelected', { detail: r });
                window.dispatchEvent(evt);
            });
        }
    }
}
exports.EventsModel = EventsModel;


/***/ }),

/***/ 671:
/***/ ((__unused_webpack_module, exports) => {

class IconsModel {
    process(regions, sequences, iconsHtml, iconsPaths) {
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
                                    if (iconsHtml && iconsHtml[reg.icon]) {
                                        icon = iconsHtml[reg.icon];
                                    }
                                    else if (iconsPaths && iconsPaths[reg.icon]) {
                                        const path = iconsPaths[reg.icon];
                                        icon = `<img src="${path}">`;
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

/***/ 622:
/***/ ((__unused_webpack_module, exports) => {

class InputModel {
    process(input1, input2, input3, input4, input5, input6, input7) {
        // check inputs type and inputs ordering
        const allInputs = { sequences: [], regions: [], patterns: [], icons: [], options: {}, iconsHtml: {} };
        const ordering = [];
        this.checkInput(allInputs, ordering, input1);
        this.checkInput(allInputs, ordering, input2);
        this.checkInput(allInputs, ordering, input3);
        this.checkInput(allInputs, ordering, input4);
        this.checkInput(allInputs, ordering, input5);
        this.checkInput(allInputs, ordering, input6);
        this.checkInput(allInputs, ordering, input7);
        if (!allInputs.sequences) {
            throw Error('sequence missing');
        }
        return [allInputs, ordering];
    }
    checkInput(allInputs, ordering, input) {
        if (!Array.isArray(input)) {
            if (input) {
                if (input.id === 'icons') {
                    allInputs.iconsHtml = input;
                }
                else if (input.id === 'paths') {
                    allInputs.iconsPaths = input;
                }
                else {
                    allInputs.options = input;
                }
            }
            return;
        }
        for (const element of input) {
            if (element.sequence) {
                allInputs.sequences = input;
                break;
            }
            else if (!ordering.includes('patterns') && element.pattern) {
                allInputs.patterns = input;
                ordering.push('patterns');
            }
            else if (!ordering.includes('regions') && (element.backgroundColor || element.color && !element.pattern && !element.icon)) {
                allInputs.regions = input;
                ordering.push('regions');
            }
            else if (element.icon) {
                allInputs.icons = input;
            }
        }
    }
}
exports.InputModel = InputModel;


/***/ }),

/***/ 60:
/***/ ((__unused_webpack_module, exports) => {

class Log {
    static s(lvl) {
        Log.log = lvl;
    }
    static w(lvl, e) {
        if (lvl <= Log.log) {
            if (lvl === 1) {
                throw new Error(e);
            }
            else {
                console.warn(e);
            }
        }
    }
}
Log.log = 0;
exports.Log = Log;


/***/ }),

/***/ 469:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var log_model_1 = __webpack_require__(60);
class OptionsModel {
    constructor() {
        this.options = {
            fontSize: '14px',
            chunkSize: 10,
            spaceSize: 1,
            logLevel: 'none',
            emptyFiller: '-',
            topIndexes: false,
            lateralIndexes: false,
            lateralIndexesGap: false,
            lateralIndexStart: 0,
            sidebarWidth: '2em',
            oneLineSetting: false,
            oneLineWidth: '300px',
            consensusType: null,
            consensusThreshold: 90
        };
    }
    process(opt) {
        if (opt === undefined) {
            log_model_1.Log.w(1, 'undefined parameters.');
            return;
        }
        /** check input fontSize */
        if (opt.fontSize !== undefined) {
            const fSize = opt.fontSize;
            const fNum = +fSize.substr(0, fSize.length - 2);
            const fUnit = fSize.substr(fSize.length - 2, 2);
            if (isNaN(fNum) || (fUnit !== 'px' && fUnit !== 'vw' && fUnit !== 'em')) {
                log_model_1.Log.w(1, 'wrong fontSize format.');
            }
            else {
                this.options.fontSize = fSize;
            }
        }
        else {
            log_model_1.Log.w(2, 'fontSize not set.');
            this.options.fontSize = '14px'; // default reset
        }
        /** check input sidebarWidth */
        if (opt.sidebarWidth !== undefined) {
            const sidebarWidth = opt.sidebarWidth;
            const sNum = +sidebarWidth.substr(0, sidebarWidth.length - 2);
            const sUnit = sidebarWidth.substr(sidebarWidth.length - 2, 2);
            if (isNaN(sNum) || (sUnit !== 'px' && sUnit !== 'vw' && sUnit !== 'em')) {
                log_model_1.Log.w(1, 'wrong sidebarWidth format.');
            }
            else {
                this.options.sidebarWidth = sidebarWidth;
            }
        }
        else {
            log_model_1.Log.w(2, 'sidebarWidth not set.');
        }
        /** check input chunkSize */
        if (opt.chunkSize !== undefined) {
            const cSize = +opt.chunkSize;
            if (isNaN(cSize) || cSize < 0) {
                log_model_1.Log.w(1, 'wrong chunkSize format.');
            }
            else {
                this.options.chunkSize = cSize;
            }
        }
        else {
            log_model_1.Log.w(2, 'chunkSize not set.');
        }
        /** check input spaceSize */
        if (opt.spaceSize !== undefined) {
            const cSize = +opt.spaceSize;
            if (isNaN(cSize) || cSize < 0) {
                log_model_1.Log.w(1, 'wrong spaceSize format.');
            }
            else {
                this.options.spaceSize = cSize;
            }
        }
        else {
            log_model_1.Log.w(2, 'spaceSize not set.');
        }
        /** check log value */
        if (opt.logLevel !== undefined) {
            this.options.logLevel = opt.logLevel;
            console.log(opt.logLevel);
            switch (opt.logLevel) {
                case 'none': {
                    log_model_1.Log.s(0);
                    break;
                }
                case 'error': {
                    log_model_1.Log.s(1);
                    break;
                }
                case 'warn': {
                    log_model_1.Log.s(2);
                    break;
                }
            }
        }
        else {
            log_model_1.Log.w(2, 'log not set.');
        }
        /** check topIndexes value */
        if (opt.topIndexes) {
            if (typeof opt.topIndexes !== 'boolean') {
                log_model_1.Log.w(1, 'wrong index type.');
            }
            else {
                this.options.topIndexes = opt.topIndexes;
            }
        }
        /** check colorScheme value */
        if (opt.colorScheme) {
            if (typeof opt.colorScheme !== 'string') {
                log_model_1.Log.w(1, 'wrong index type.');
            }
            else {
                this.options.colorScheme = opt.colorScheme;
            }
        }
        /** check lateralIndexesGap value */
        if (opt.lateralIndexesGap) {
            if (typeof opt.lateralIndexesGap !== 'boolean') {
                log_model_1.Log.w(1, 'wrong index type.');
            }
            else {
                this.options.lateralIndexesGap = opt.lateralIndexesGap;
            }
        }
        /** check lateralIndexes value */
        if (opt.lateralIndexes) {
            if (typeof opt.lateralIndexes !== 'boolean') {
                log_model_1.Log.w(1, 'wrong index type.');
            }
            else {
                this.options.lateralIndexes = opt.lateralIndexes;
            }
        }
        /** check consensusType value */
        if (opt.consensusType) {
            if (typeof opt.consensusType !== 'string') {
                log_model_1.Log.w(1, 'wrong consensus type.');
            }
            else {
                this.options.consensusType = opt.consensusType;
            }
        }
        /** check consensusThreshold value */
        if (opt.consensusThreshold) {
            if (typeof opt.consensusThreshold !== 'number') {
                log_model_1.Log.w(1, 'wrong threshold type.');
            }
            else {
                this.options.consensusThreshold = opt.consensusThreshold;
            }
        }
        /** check oneLineSetting value */
        if (opt.oneLineSetting) {
            if (typeof opt.oneLineSetting !== 'boolean' && opt.oneLineSetting) {
                log_model_1.Log.w(1, 'wrong oneLineSetting format.');
            }
            else {
                this.options.oneLineSetting = opt.oneLineSetting;
            }
        }
        else {
            this.options.oneLineSetting = false;
        }
        /** check oneLineWidth fontSize */
        if (opt.oneLineWidth) {
            const oneLineWidth = opt.oneLineWidth;
            const olNum = +oneLineWidth.substr(0, oneLineWidth.length - 2);
            const olUnit = oneLineWidth.substr(oneLineWidth.length - 2, 2);
            if (isNaN(olNum) || (olUnit !== 'px' && olUnit !== 'vw' && olUnit !== 'em')) {
                log_model_1.Log.w(1, 'wrong oneLineWidth format.');
            }
            else {
                this.options.oneLineWidth = oneLineWidth;
            }
        }
        return this.options;
    }
}
exports.OptionsModel = OptionsModel;


/***/ }),

/***/ 590:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var log_model_1 = __webpack_require__(60);
class PatternsModel {
    // find index of matched regex positions and create array of regions with color
    process(patterns, sequences) {
        const regions = []; // OutPatterns
        // @ts-ignore
        for (const element of patterns) {
            // tslint:disable-next-line:no-conditional-assignment
            const pattern = element.pattern;
            let str;
            if (sequences.find(x => x.id === element.sequenceId)) {
                str = sequences.find(x => x.id === element.sequenceId).sequence;
                this.regexMatch(str, pattern, regions, element);
            }
            else {
                for (const seq of sequences) {
                    // regex
                    if (element.start && element.end) {
                        str = seq.sequence.substr(element.start - 1, element.end - (element.start - 1));
                    }
                    else {
                        log_model_1.Log.w(2, 'missing region bounds.');
                    }
                    this.regexMatch(str, pattern, regions, element);
                }
            }
        }
        return regions;
    }
    regexMatch(str, pattern, regions, element) {
        let match;
        // tslint:disable-next-line:no-conditional-assignment
        while ((match = pattern.exec(str)) != null) {
            regions.push({ start: +match.index + 1, end: +match.index + +match[0].length,
                backgroundColor: element.backgroundColor, color: element.color, backgroundImage: element.backgroundImage,
                borderColor: element.borderColor, borderStyle: element.borderStyle, sequenceId: element.sequenceId });
        }
    }
}
exports.PatternsModel = PatternsModel;


/***/ }),

/***/ 71:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var log_model_1 = __webpack_require__(60);
var chars_model_1 = __webpack_require__(959);
var palettes_1 = __webpack_require__(186);
var colors_model_1 = __webpack_require__(217);
class RowsModel {
    constructor() {
        this.substitutiveId = 99999999999999;
    }
    processRows(rows, icons, regions) {
        const allData = [];
        // decide which color is more important in case of overwriting
        const coloringOrder = ['custom', 'clustal', 'gradient', 'binary'];
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
        let log;
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
                    if (positions.length > 0) {
                        for (const e of positions) {
                            for (let i = e.start; i <= e.end; i++) {
                                if (!data[i]) {
                                    continue;
                                }
                                if (data[i].backgroundColor) {
                                    log = 'Row: ' + rowNum + ', ';
                                    log += 'Index: ' + i + ', ';
                                    log += 'Overlapping color. ';
                                    log += 'New color: ' + e.backgroundColor + '.';
                                    log_model_1.Log.w(2, log);
                                }
                                if (e.backgroundColor === '@clustal') {
                                    data[i].backgroundColor = palettes_1.Palettes.clustal[data[i].char];
                                }
                                else {
                                    data[i].backgroundColor = e.backgroundColor;
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
    process(sequences, icons, regions, colorScheme) {
        // check and set global colorScheme
        if (colorScheme) {
            // @ts-ignore
            for (const sequence of sequences) {
                if (!sequence.colorScheme) {
                    sequence.colorScheme = colorScheme;
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
                log_model_1.Log.w(2, 'missing id.');
                undefinedValues += 1;
                sequences[r].id = this.substitutiveId;
                this.substitutiveId -= 1;
            }
            else {
                if (values.includes(+sequences[r].id)) {
                    delete sequences[r];
                    console.log(sequences);
                    log_model_1.Log.w(1, 'Duplicate sequence id.');
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
                let char = new chars_model_1.CharsModel();
                char = sequences[row].sequence[idx];
                rows[id][idxKey] = { char };
            }
        }
        return this.processRows(rows, icons, regions);
    }
}
exports.RowsModel = RowsModel;


/***/ }),

/***/ 856:
/***/ ((__unused_webpack_module, exports) => {

class SelectionModel {
    process() {
        const sequenceViewers = document.getElementsByClassName('cell');
        window.onmousedown = () => {
            // remove selection on new click
            if (this.selection) {
                for (const el of this.selection) {
                    el.classList.remove('highlight');
                }
            }
        };
        // @ts-ignore
        for (const sqv of sequenceViewers) {
            sqv.onmousedown = (e) => {
                this.selection = [];
                this.alreadySelected = {};
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
                this.lastSqv = id;
                this.isDown = true;
                this.start = { y: element.dataset.resY, x: element.dataset.resX, sqvId: element.dataset.resId };
            };
            sqv.onmouseover = (e) => {
                let element;
                if (e.path) {
                    element = e.path[0];
                }
                else {
                    element = e.originalTarget;
                }
                if (this.isDown) {
                    this.lastOver = { y: element.dataset.resY, x: element.dataset.resX, sqvId: element.dataset.resId };
                    for (let i = +this.start.y; i <= +this.lastOver.y; i++) {
                        const elements = document.querySelectorAll('[data-res-y=' + CSS.escape(i.toString()) + ']');
                        // highlight selected elements
                        // @ts-ignore
                        for (const selection of elements) {
                            // on every drag reselect the whole area ...
                            if (+selection.getAttribute('data-res-x') >= +this.start.x && +selection.getAttribute('data-res-x') <= +this.lastOver.x &&
                                selection.getAttribute('data-res-id') === this.lastOver.sqvId) {
                                // ... but push only new elements
                                if (!this.alreadySelected[selection.dataset.resY + '-' + selection.dataset.resX]) {
                                    this.selection.push(selection);
                                    selection.classList.add('highlight');
                                }
                                this.alreadySelected[selection.dataset.resY + '-' + selection.dataset.resX] = 'selected';
                            }
                        }
                    }
                }
            };
        }
        document.body.onmouseup = (e) => {
            let element;
            if (e.path) {
                element = e.path[0];
            }
            else {
                element = e.originalTarget;
            }
            if (this.isDown) {
                // lastSelection out of cells
                if (!element.dataset.resY) {
                    this.end = { y: this.lastOver.y, x: this.lastOver.x, sqvId: this.lastOver.sqvId };
                }
                else {
                    // lastSelection on a cell
                    this.end = { y: element.dataset.resY, x: element.dataset.resX, sqvId: element.dataset.resId };
                }
                this.isDown = false;
            }
        };
        document.body.addEventListener('keydown', (e) => {
            e = e || window.event;
            const key = e.which || e.keyCode; // keyCode detection
            const ctrl = e.ctrlKey ? e.ctrlKey : ((key === 17)); // ctrl detection
            if (key === 67 && ctrl) {
                let textToPaste = '';
                const textDict = {};
                let row = '';
                for (const el in this.selection) {
                    if (!textDict[this.selection[el].getAttribute('data-res-y')]) {
                        textDict[this.selection[el].getAttribute('data-res-y')] = '';
                    }
                    // new line when new row
                    if (this.selection[el].getAttribute('data-res-y') !== row && row !== '') {
                        textDict[this.selection[el].getAttribute('data-res-y')] += this.selection[el].innerText;
                    }
                    else {
                        textDict[this.selection[el].getAttribute('data-res-y')] += this.selection[el].innerText;
                    }
                    this.selection[el].classList.remove('highlight');
                    row = this.selection[el].getAttribute('data-res-y');
                }
                for (const textRow in textDict) {
                    textToPaste += '\n' + textDict[textRow];
                }
                // copy to clipboard for the paste event
                const dummy = document.createElement('textarea');
                document.body.appendChild(dummy);
                dummy.value = textToPaste;
                dummy.select();
                document.execCommand('copy');
                document.body.removeChild(dummy);
            }
        }, false);
    }
}
exports.SelectionModel = SelectionModel;


/***/ }),

/***/ 587:
/***/ ((__unused_webpack_module, exports) => {

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
                flag = true;
            }
            else {
                labels.push('');
            }
        }
        if (flag) {
            return [labels, startIndexes, tooltips];
        }
        else {
            return [];
        }
    }
}
exports.SequenceInfoModel = SequenceInfoModel;


/***/ }),

/***/ 186:
/***/ ((__unused_webpack_module, exports) => {

class Palettes {
}
Palettes.clustal = {
    A: '#80a0f0', I: '#80a0f0', L: '#80a0f0', M: '#80a0f0', F: '#80a0f0', W: '#80a0f0', V: '#80a0f0',
    K: '#f01505', R: '#f01505', E: '#c048c0', D: '#c048c0', C: '#f08080', G: '#f09048',
    N: '#15c015', Q: '#15c015', S: '#15c015', T: '#15c015', P: '#c0c000', H: '#15a4a4', Y: '#15a4a4'
};
Palettes.consensus = {
    100: { backgroundColor: '#213945', color: '#FFFFFF' },
    70: { backgroundColor: '#42728A', color: '#FFFFFF' },
    40: { backgroundColor: '#5a93af', color: '#FFFFFF' },
    10: { backgroundColor: '#9fc0d1', color: '#FFFFFF' },
    0: { backgroundColor: '#9fc0d1', color: '#FFFFFF' }
};
// colour scheme in Lesk, Introduction to Bioinformatics
Palettes.physicalProp = {
    n: { backgroundColor: '#f09048', color: '#FFFFFF' },
    h: { backgroundColor: '#558B6E', color: '#FFFFFF' },
    p: { backgroundColor: '#D4358D', color: '#FFFFFF' },
    '~': { backgroundColor: '#A10702', color: '#FFFFFF' },
    '+': { backgroundColor: '#3626A7', color: '#FFFFFF' },
    '.': { backgroundColor: '#FFFFFF', color: '#14000B' },
};
Palettes.blosum = {
    '-4': { backgroundColor: '#222D44', color: '#FFFFFF' },
    '-3': { backgroundColor: '#3E517A', color: '#FFFFFF' },
    '-2': { backgroundColor: '#5C76AD', color: '#FFFFFF' },
    '-1': { backgroundColor: '#92A4C8', color: '#FFFFFF' },
    0: { backgroundColor: '#C9D2E4', color: '#FFFFFF' },
    1: { backgroundColor: '#EA9AA2', color: '#FFFFFF' },
    2: { backgroundColor: '#E37882', color: '#FFFFFF' },
    3: { backgroundColor: '#DC5663', color: '#FFFFFF' },
    4: { backgroundColor: '#D53444', color: '#FFFFFF' },
    5: { backgroundColor: '#BA2635', color: '#FFFFFF' },
    6: { backgroundColor: '#981F2B', color: '#FFFFFF' },
    7: { backgroundColor: '#871C27', color: '#FFFFFF' },
    8: { backgroundColor: '#771822', color: '#FFFFFF' },
    9: { backgroundColor: '#66151D', color: '#FFFFFF' },
    10: { backgroundColor: '#551118', color: '#14000B' },
    11: { backgroundColor: '#440D13', color: '#14000B' },
    '-': { backgroundColor: '#FFFFFF', color: '#FFFFFF' }
};
Palettes.blosum62 = { WF: 1, LR: -2, SP: -1, VT: '0', QQ: 5, NA: -2, ZY: -2, WR: -3, QA: -1, SD: '0', HH: 8, SH: -1, HD: -1, LN: -3, WA: -3,
    YM: -1, GR: -2, YI: -1, YE: -2, BY: -3, YA: -2, VD: -3, BS: '0', YY: 7, GN: '0', EC: -4, YQ: -1, ZZ: 4, VA: '0', CC: 9, MR: -1, VE: -2,
    TN: '0', PP: 7, VI: 3, VS: -2, ZP: -1, VM: 1, TF: -2, VQ: -2, KK: 5, PD: -1, IH: -3, ID: -3, TR: -1, PL: -3, KG: -2, MN: -2,
    PH: -2, FQ: -3, ZG: -2, XL: -1, TM: -1, ZC: -3, XH: -1, DR: -2, BW: -4, XD: -1, ZK: 1, FA: -2, ZW: -3, FE: -3, DN: 1, BK: '0',
    XX: -1, FI: '0', BG: -1, XT: '0', FM: '0', BC: -3, ZI: -3, ZV: -2, SS: 4, LQ: -2, WE: -3, QR: 1, NN: 6, WM: -1, QC: -3, WI: -3, SC: -1,
    LA: -1, SG: '0', LE: -3, WQ: -2, HG: -2, SK: '0', QN: '0', NR: '0', HC: -3, YN: -2, GQ: -2, YF: 3, CA: '0', VL: 1, GE: -2, GA: '0',
    KR: 2, ED: 2, YR: -2, MQ: '0', TI: -1, CD: -3, VF: -1, TA: '0', TP: -1, BP: -2, TE: -1, VN: -3, PG: -2, MA: -1, KH: -1, VR: -3,
    PC: -3, ME: -2, KL: -2, VV: 4, MI: 1, TQ: -1, IG: -4, PK: -1, MM: 5, KD: -1, IC: -1, ZD: 1, FR: -3, XK: -1, QD: '0', XG: -1, ZL: -3,
    XC: -2, ZH: '0', BL: -4, BH: '0', FF: 6, XW: -2, BD: 4, DA: -2, SL: -2, XS: '0', FN: -3, SR: -1, WD: -4, VY: -1, WL: -2, HR: '0',
    WH: -2, HN: 1, WT: -2, TT: 5, SF: -2, WP: -4, LD: -4, BI: -3, LH: -3, SN: 1, BT: -1, LL: 4, YK: -2, EQ: 2, YG: -3, ZS: '0', YC: -2,
    GD: -1, BV: -3, EA: -1, YW: 2, EE: 5, YS: -2, CN: -3, VC: -1, TH: -2, PR: -2, VG: -3, TL: -1, VK: -2, KQ: 1, RA: -1, IR: -3, TD: -1,
    PF: -4, IN: -3, KI: -3, MD: -3, VW: -3, WW: 11, MH: -2, PN: -2, KA: -1, ML: 2, KE: 1, ZE: 4, XN: -1, ZA: -1, ZM: -1, XF: -1,
    KC: -3, BQ: '0', XB: -1, BM: -3, FC: -2, ZQ: 3, XZ: -1, FG: -3, BE: 1, XV: -1, FK: -3, BA: -2, XR: -1, DD: 6, WG: -2, ZF: -3, SQ: '0',
    WC: -2, WK: -3, HQ: '0', LC: -1, WN: -4, SA: 1, LG: -4, WS: -3, SE: '0', HE: '0', SI: -2, HA: -2, SM: -1, YL: -1, YH: 2,
    YD: -3, ER: '0', XP: -2, GG: 6, GC: -3, EN: '0', YT: -2, YP: -3, TK: -1, AA: 4, PQ: -1, TC: -1, VH: -3, TG: -2, IQ: -3, ZT: -1,
    CR: -3, VP: -2, PE: -1, MC: -1, KN: '0', II: 4, PA: -1, MG: -3, TS: 1, IE: -3, PM: -2, MK: -1, IA: -1, PI: -3, RR: 5, XM: -1, LI: 2,
    XI: -1, ZB: 1, XE: -1, ZN: '0', XA: '0', BR: -1, BN: 3, FD: -3, XY: -1, ZR: '0', FH: -1, BF: -3, FL: '0', XQ: -1, BB: 4
};
Palettes.letterTransform = {
    A: 'n', G: 'n', S: 'n', T: 'n',
    C: 'h', V: 'h', I: 'h', L: 'h', P: 'h', F: 'h', Y: 'h', M: 'h', W: 'h',
    N: 'p', Q: 'p', H: 'p',
    D: '~', E: '~',
    K: '+', R: '+'
};
exports.Palettes = Palettes;


/***/ }),

/***/ 406:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var options_model_1 = __webpack_require__(469);
var rows_model_1 = __webpack_require__(71);
var colors_model_1 = __webpack_require__(217);
var log_model_1 = __webpack_require__(60);
var selection_model_1 = __webpack_require__(856);
var icons_model_1 = __webpack_require__(671);
var sequenceInfoModel_1 = __webpack_require__(587);
var events_model_1 = __webpack_require__(999);
var patterns_model_1 = __webpack_require__(590);
var input_model_1 = __webpack_require__(622);
var consensus_model_1 = __webpack_require__(310);
class SequenceViewer {
    constructor(divId) {
        this.divId = divId;
        this.init = false;
        this.input = new input_model_1.InputModel();
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
            for (const id of SequenceViewer.sqvList) {
                const sqvBody = document.getElementById(id);
                if (!sqvBody) {
                    log_model_1.Log.w(1, 'Cannot find lib-body element.');
                    continue;
                }
                const chunks = sqvBody.getElementsByClassName('chunk');
                if (!chunks) {
                    log_model_1.Log.w(1, 'Cannot find chunk elements.');
                    continue;
                }
                let oldTop = 0;
                let newTop;
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < chunks.length; i++) {
                    newTop = chunks[i].getBoundingClientRect().top;
                    if (newTop > oldTop) {
                        chunks[i].firstElementChild.className = 'index';
                        oldTop = newTop;
                    }
                    else {
                        chunks[i].firstElementChild.className = 'index hidden';
                    }
                }
            }
        };
    }
    drawSequenceViewer(input1, input2, input3, input4, input5, input6, input7) {
        SequenceViewer.sqvList.push(this.divId);
        let inputs;
        let order;
        let labels;
        let startIndexes;
        let tooltips;
        let data;
        /** check and process input */
        [inputs, order] = this.input.process(input1, input2, input3, input4, input5, input6, input7);
        /** check and process parameters input */
        inputs.options = this.params.process(inputs.options);
        /** check and consensus input */
        [inputs.sequences, inputs.regions, order] = this.consensus.process(inputs.sequences, inputs.regions, inputs.options, order);
        /** check and process patterns input */
        inputs.patterns = this.patterns.process(inputs.patterns, inputs.sequences);
        /** check and process colors input */
        inputs.regions = this.regions.process(inputs, order);
        /** check and process icons input */
        inputs.icons = this.icons.process(inputs.regions, inputs.sequences, inputs.iconsHtml, inputs.iconsPaths);
        /** check and process sequences input */
        data = this.rows.process(inputs.sequences, inputs.icons, inputs.regions, inputs.options.colorScheme);
        /** check and process labels input */
        [labels, startIndexes, tooltips] = this.labels.process(inputs.regions, inputs.sequences);
        /** create/update lib-body html */
        this.createGUI(data, labels, startIndexes, tooltips, inputs.options);
        /** listen copy paste events */
        this.selection.process();
        /** listen selection events */
        this.events.onRegionSelected();
    }
    generateLabels(idx, labels, startIndexes, topIndexes, chunkSize, fontSize, tooltips, data) {
        let labelshtml = '';
        let labelsContainer = '';
        const noGapsLabels = [];
        if (labels.length > 0) {
            if (topIndexes) {
                labelshtml += `<span class="label-hidden"></span>`;
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
                    if (seqNum[res].char.includes('svg')) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    noGapsLabels[seqN] = '';
                    if (idx) {
                        // line with only icons, no need for index
                        labelshtml += `<span class="label-hidden"><span class="label"> ${noGapsLabels[seqN]}</span></span>`;
                    }
                    else {
                        labelshtml += `<span class="label-hidden"><span class="label"></span></span>`;
                    }
                }
                else {
                    count += 1;
                    if (idx) {
                        if (!chunkSize) {
                            // lateral index regular
                            labelshtml += `<span class="label-hidden" style="width: ${fontSize}">
                            <span class="label" >${(startIndexes[count] - 1) + idx}</span></span>`;
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
                            labelshtml += `<span class="label-hidden" style="width:  ${fontSize}">
                            <span class="label" >${(startIndexes[count] - 1) + noGapsLabels[seqN]}</span></span>`;
                        }
                    }
                    else {
                        labelshtml += `<span class="label-hidden"><span class="label">${labels[count]}${tooltips[count]}</span></span>`;
                    }
                }
                flag = false;
            }
            labelsContainer = `<span class="labelContainer" style="display: inline-block">${labelshtml}</span>`;
        }
        return labelsContainer;
    }
    addTopIndexes(topIndexes, chunkSize, x, maxTop) {
        let cells = '';
        // adding top indexes
        if (topIndexes) {
            let chunkTopIndex;
            if (x % chunkSize === 0 && x <= maxTop) {
                chunkTopIndex = `<span style="-webkit-user-select: none;direction: rtl;display:block;width:0.6em;">${x}</span>`;
            }
            else {
                chunkTopIndex = `<span style="-webkit-user-select: none;display:block;visibility: hidden;">0</span>`;
            }
            cells += chunkTopIndex;
        }
        return cells;
    }
    createGUI(data, labels, startIndexes, tooltips, options) {
        console.log(data);
        const sqvBody = document.getElementById(this.divId);
        if (!sqvBody) {
            log_model_1.Log.w(1, 'Cannot find lib-body element.');
            return;
        }
        const chunkSize = options.chunkSize;
        const fontSize = options.fontSize;
        const spaceSize = options.spaceSize;
        const topIndexes = options.topIndexes;
        const lateralIndexes = options.lateralIndexes;
        const lateralIndexesGap = options.lateralIndexesGap;
        const oneLineSetting = options.oneLineSetting;
        const oneLineWidth = options.oneLineWidth;
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
        const labelsContainer = this.generateLabels(false, labels, startIndexes, topIndexes, false, indexWidth, tooltips, data);
        let index = '';
        let cards = '';
        let cell;
        let entity;
        let style;
        let html = '';
        let idxNum = 0;
        let idx;
        for (let x = 1; x <= maxIdx; x++) {
            let cells = this.addTopIndexes(topIndexes, chunkSize, x, maxTop);
            for (let y = 0; y < data.length; y++) {
                entity = data[y][x];
                style = 'font-size: 1em;display:block;height:1em;line-height:1em;';
                if (y === data.length - 1) {
                    style = 'font-size: 1em;';
                }
                if (!entity) {
                    // emptyfiller
                    cell = `<span style="${style}"> </span>`;
                }
                else {
                    if (entity.target) {
                        style += `${entity.target}`;
                    }
                    if (!entity.char.includes('svg')) {
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
                if (topIndexes) {
                }
                else {
                    idxNum += chunkSize; // lateral index (set only if top indexes missing)
                    idx = idxNum - (chunkSize - 1);
                }
                // adding labels
                if (lateralIndexes) {
                    const gapsContainer = this.generateLabels(idx, labels, startIndexes, topIndexes, false, indexWidth, false, data);
                    if (oneLineSetting) {
                        index = gapsContainer; // lateral number indexes + labels
                    }
                    else {
                        index = labelsContainer + gapsContainer; // lateral number indexes + labels
                    }
                }
                else if (lateralIndexesGap) {
                    const gapsContainer = this.generateLabels(idx, labels, startIndexes, topIndexes, chunkSize, indexWidth, false, data);
                    if (oneLineSetting) {
                        index = gapsContainer; // lateral number indexes + labels
                    }
                    else {
                        index = labelsContainer + gapsContainer; // lateral number indexes + labels
                    }
                }
                else {
                    index = labelsContainer;
                }
                index = `<div class="index hidden">${index}</div>`;
                style = `font-size: ${fontSize};`;
                if (x !== maxIdx) {
                    style += 'padding-right: ' + spaceSize + 'em;';
                }
                else {
                    style += 'margin-right: ' + spaceSize + 'em;';
                }
                const chunk = `<div class="chunk" style="${style}">${index}<div class="crds">${cards}</div></div>`;
                cards = '';
                index = '';
                html += chunk;
            }
        }
        if (oneLineSetting) {
            sqvBody.innerHTML = `<div class="root" style="display: flex"><div style="${style}">${labelsContainer}</div>
                        <div style="display:inline-block;overflow-x:scroll;white-space: nowrap;width:${oneLineWidth}"> ${html}</div></div>`;
        }
        else {
            sqvBody.innerHTML = `<div class="root">${html}</div>`;
        }
        window.dispatchEvent(new Event('resize'));
    }
}
SequenceViewer.sqvList = [];
exports.SequenceViewer = SequenceViewer;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
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
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(138);
/******/ })()

));