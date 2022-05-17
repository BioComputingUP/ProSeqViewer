/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/lib/colors.model.ts":
/*!*********************************!*\
  !*** ./src/lib/colors.model.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ColorsModel": () => (/* binding */ ColorsModel)
/* harmony export */ });
var ColorsModel = /** @class */ (function () {
    function ColorsModel() {
    }
    ColorsModel.getRowsList = function (coloring) {
        var outCol = this.palette[coloring];
        if (!outCol) {
            return [];
        }
        return Object.keys(outCol);
    };
    ColorsModel.getPositions = function (coloring, rowNum) {
        var outCol;
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
    };
    ColorsModel.prototype.process = function (allInputs) {
        if (!allInputs.regions) {
            allInputs.regions = [];
        }
        if (allInputs.options && !allInputs.options.sequenceColor) {
            var sequenceColorRegions = [];
            for (var _i = 0, _a = allInputs.sequences; _i < _a.length; _i++) {
                var sequence = _a[_i];
                if (sequence.sequenceColor) {
                    // @ts-ignore
                    sequenceColorRegions.push({ sequenceId: sequence.id, start: 1, end: sequence.sequence.length, sequenceColor: sequence.sequenceColor });
                }
            }
            for (var _b = 0, _c = allInputs.regions; _b < _c.length; _b++) {
                var reg = _c[_b];
                if (!reg.backgroundColor && reg.sequenceId !== -99999999999998) {
                    sequenceColorRegions.push(reg);
                }
            }
            if (sequenceColorRegions.length > 0) {
                allInputs.regions = sequenceColorRegions;
            }
        }
        var allRegions = Array.prototype.concat(allInputs.icons, allInputs.regions, allInputs.patterns); // ordering
        var newRegions = this.fixMissingIds(allRegions, allInputs.sequences);
        newRegions = this.transformInput(allRegions, newRegions, allInputs.sequences, allInputs.options);
        this.transformColors(allInputs.options);
        return newRegions;
    };
    // transform input structure
    ColorsModel.prototype.transformInput = function (regions, newRegions, sequences, globalColor) {
        // if don't receive new colors, keep old colors
        if (!regions) {
            return;
        }
        // if receive new colors, change them
        ColorsModel.palette = {};
        var info;
        if (!globalColor) {
            for (var _i = 0, sequences_1 = sequences; _i < sequences_1.length; _i++) {
                var seq = sequences_1[_i];
                var reg = { sequenceId: seq.id, backgroundColor: '', start: 1, end: seq.sequence.length, sequenceColor: '' };
                if (seq.sequenceColor) {
                    reg.backgroundColor = seq.sequenceColor;
                    reg.sequenceColor = seq.sequenceColor;
                    info = this.setSequenceColor(reg, seq);
                }
            }
        }
        var _loop_1 = function (reg) {
            var sequenceColor = void 0;
            if (reg.icon) {
                return "continue";
            }
            if (sequences.find(function (x) { return x.id === reg.sequenceId; })) {
                sequenceColor = sequences.find(function (x) { return x.id === reg.sequenceId; }).sequenceColor;
                if (sequenceColor && !globalColor) {
                    // sequenceColor is set. Cannot set backgroundColor
                    reg.sequenceColor = sequenceColor;
                }
            }
            info = this_1.processColor(reg);
            if (info === -1) {
                return "continue";
            }
            ColorsModel.palette[info.type][info.sequenceId].positions
                .push({ start: reg.start, end: reg.end, target: info.letterStyle });
            if (sequenceColor && sequenceColor.includes('binary')) {
                // @ts-ignore
                ColorsModel.palette[info.type].binaryColors = this_1.getBinaryColors(sequenceColor);
            }
        };
        var this_1 = this;
        // overwrite region color if sequenceColor is set
        // @ts-ignore
        for (var _a = 0, newRegions_1 = newRegions; _a < newRegions_1.length; _a++) {
            var reg = newRegions_1[_a];
            _loop_1(reg);
        }
        return newRegions;
    };
    ColorsModel.prototype.setSequenceColor = function (reg, seq) {
        var info;
        info = this.processColor(reg);
        ColorsModel.palette[info.type][info.sequenceId].positions
            .push({ start: reg.start, end: reg.end, target: info.letterStyle });
        if (seq.sequenceColor.includes('binary')) {
            // @ts-ignore
            ColorsModel.palette[info.type].binaryColors = this.getBinaryColors(seq.sequenceColor);
        }
        return info;
    };
    ColorsModel.prototype.fixMissingIds = function (regions, sequences) {
        var newRegions = [];
        var _loop_2 = function (reg) {
            if (!reg) {
                return "continue";
            }
            if (sequences.find(function (x) { return x.id === reg.sequenceId; })) {
                newRegions.push(reg);
            }
            else {
                for (var _a = 0, sequences_2 = sequences; _a < sequences_2.length; _a++) {
                    var seq = sequences_2[_a];
                    var newReg = {};
                    // tslint:disable-next-line:forin
                    for (var key in reg) {
                        if (reg[key] !== 'sequenceId') {
                            newReg[key] = reg[key];
                        }
                        newReg['sequenceId'] = seq.id;
                    }
                    newRegions.push(newReg);
                }
            }
        };
        for (var _i = 0, regions_1 = regions; _i < regions_1.length; _i++) {
            var reg = regions_1[_i];
            _loop_2(reg);
        }
        return newRegions;
    };
    ColorsModel.prototype.transformColors = function (opt) {
        var sequenceColor = opt.sequenceColor;
        var arrColors;
        var n;
        var c;
        for (var type in ColorsModel.palette) {
            switch (type) {
                case 'gradient': {
                    // tslint:disable-next-line:forin
                    for (var row in ColorsModel.palette[type]) {
                        c = ColorsModel.palette[type][row];
                        n = c.positions.length + c.chars.length;
                        arrColors = this.gradient(n);
                        c.positions.sort(function (a, b) { return (a.start > b.start) ? 1 : -1; });
                        for (var _i = 0, _a = c.positions; _i < _a.length; _i++) {
                            var e = _a[_i];
                            e.backgroundColor = arrColors.pop();
                        }
                    }
                    break;
                }
                case 'binary': {
                    // tslint:disable-next-line:forin
                    for (var row in ColorsModel.palette[type]) {
                        if (row === 'binaryColors') {
                            continue;
                        }
                        c = ColorsModel.palette[type][row];
                        n = c.positions.length + c.chars.length;
                        arrColors = this.binary(n, ColorsModel.palette[type].binaryColors);
                        c.positions.sort(function (a, b) { return (a.start > b.start) ? 1 : -1; });
                        for (var _b = 0, _c = c.positions; _b < _c.length; _b++) {
                            var e = _c[_b];
                            e.backgroundColor = arrColors.pop();
                        }
                    }
                    break;
                }
                case sequenceColor: {
                    // tslint:disable-next-line:forin
                    // ColorsModel.palette[type]: an obj with regions and color associated es. positions: 1-200, zappo
                    for (var row in ColorsModel.palette[type]) {
                        c = ColorsModel.palette[type][row];
                        if (c.positions.length > 0) {
                            for (var _d = 0, _e = c.positions; _d < _e.length; _d++) {
                                var pos = _e[_d];
                                pos.backgroundColor = sequenceColor;
                            }
                        }
                    }
                    break;
                }
            }
        }
    };
    ColorsModel.prototype.processColor = function (e) {
        var result = { type: 'custom', sequenceId: -1, letterStyle: '' };
        // check if row key is a number
        if (e.sequenceId === undefined || isNaN(+e.sequenceId)) {
            // wrong entity row key
            return -1;
        }
        result.sequenceId = +e.sequenceId;
        // transform target in CSS property
        if (e.color) {
            result.letterStyle = "color:" + e.color + ";";
        }
        if (e.backgroundColor) {
            result.letterStyle += "background-color:" + e.backgroundColor + ";";
        }
        if (e.backgroundImage) {
            result.letterStyle += "background-image: " + e.backgroundImage + ";";
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
    };
    ColorsModel.prototype.gradient = function (n) {
        return this.evenlySpacedColors(n);
    };
    ColorsModel.prototype.getBinaryColors = function () {
        var color1 = '#93E1D8';
        var color2 = '#FFA69E';
        return [color1, color2];
    };
    ColorsModel.prototype.binary = function (n, binaryColors) {
        var reg = 0;
        var flag;
        var arrColors = [];
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
    };
    ColorsModel.prototype.evenlySpacedColors = function (n) {
        /** how to go around the rgb wheel */
        /** add to next rgb component, subtract to previous */
        /**  ex.: 255,0,0 -(add)-> 255,255,0 -(subtract)-> 0,255,0 */
        // starting color: red
        var rgb = [255, 0, 0];
        // 1536 colors in the rgb wheel
        var delta = Math.floor(1536 / n);
        var remainder;
        var add = true;
        var value = 0;
        var tmp;
        var colors = [];
        for (var i = 0; i < n; i++) {
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
    };
    return ColorsModel;
}());



/***/ }),

/***/ "./src/lib/consensus.model.ts":
/*!************************************!*\
  !*** ./src/lib/consensus.model.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ConsensusModel": () => (/* binding */ ConsensusModel)
/* harmony export */ });
/* harmony import */ var _palettes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./palettes */ "./src/lib/palettes.ts");

var ConsensusModel = /** @class */ (function () {
    function ConsensusModel() {
    }
    ConsensusModel.setConsensusInfo = function (type, sequences) {
        var idIdentity = -99999999999999;
        var idPhysical = -99999999999998;
        var consensusInfo = [];
        for (var i = 0; i < sequences[0].sequence.length; i++) {
            var consensusColumn = {};
            for (var _i = 0, sequences_1 = sequences; _i < sequences_1.length; _i++) {
                var sequence = sequences_1[_i];
                var letter = sequence.sequence[i];
                if (type === 'physical') {
                    if (sequence.id === idIdentity) {
                        continue;
                    }
                    if (letter in _palettes__WEBPACK_IMPORTED_MODULE_0__.Palettes.consensusAaLesk) {
                        letter = _palettes__WEBPACK_IMPORTED_MODULE_0__.Palettes.consensusAaLesk[letter][0];
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
    };
    ConsensusModel.createConsensus = function (type, consensus, consensus2, sequences, regions, threshold, palette) {
        if (threshold < 50) {
            threshold = 100 - threshold;
        }
        var id = -99999999999999;
        var label;
        if (type === 'physical') {
            label = 'Consensus physical ' + threshold + '%';
            id = -99999999999998;
        }
        else {
            label = 'Consensus identity ' + threshold + '%';
        }
        var consensusSequence = '';
        var _loop_1 = function (column) {
            var _a, _b, _c;
            var maxLetter = void 0;
            var maxIndex = void 0;
            if (Object.keys(consensus[column]).length === 0) {
                maxLetter = '.';
            }
            else {
                maxLetter = Object.keys(consensus[column]).reduce(function (a, b) {
                    return consensus[column][a] > consensus[column][b] ? a : b;
                });
                maxIndex = consensus[column][maxLetter];
            }
            var backgroundColor = void 0;
            var color = void 0;
            var frequency = (maxIndex / sequences.length) * 100;
            if (type === 'physical') {
                // consensus id to see if I have all letters equals
                // equals letters have precedence over properties
                var maxLetterId = void 0;
                var maxIndexId = void 0;
                if (Object.keys(consensus[column]).length === 0) {
                    maxLetterId = '.';
                }
                else {
                    maxLetterId = Object.keys(consensus2[column]).reduce(function (a, b) {
                        return consensus2[column][a] > consensus2[column][b] ? a : b;
                    });
                    maxIndexId = consensus2[column][maxLetterId];
                }
                var frequencyId = (maxIndexId / sequences.length) * 100;
                if (frequencyId >= threshold) {
                    maxLetter = maxLetterId;
                    _a = ConsensusModel.setColorsIdentity(frequencyId, palette, 'physical'), backgroundColor = _a[0], color = _a[1];
                }
                else {
                    if (frequency >= threshold) {
                        _b = ConsensusModel.setColorsPhysical(maxLetter, palette), backgroundColor = _b[0], color = _b[1];
                    }
                }
            }
            else {
                _c = ConsensusModel.setColorsIdentity(frequency, palette, 'identity'), backgroundColor = _c[0], color = _c[1];
            }
            if (frequency < threshold) {
                maxLetter = '.';
            }
            // + 1 because residues start from 1 and not 0
            regions.push({ start: +column + 1, end: +column + 1, sequenceId: id, backgroundColor: backgroundColor, color: color });
            consensusSequence += maxLetter;
        };
        // tslint:disable-next-line:forin
        for (var column in consensus) {
            _loop_1(column);
        }
        sequences.push({ id: id, sequence: consensusSequence, label: label });
        return [sequences, regions];
    };
    ConsensusModel.setColorsIdentity = function (frequency, palette, flag) {
        var backgroundColor;
        var color;
        var finalPalette;
        if (palette && typeof palette !== 'string' && flag == 'identity') {
            finalPalette = palette;
        }
        else {
            finalPalette = _palettes__WEBPACK_IMPORTED_MODULE_0__.Palettes.consensusLevelsIdentity;
        }
        var steps = [];
        for (var key in finalPalette) {
            steps.push(+key); // 42
        }
        steps = steps.sort(function (a, b) { return a < b ? 1 : a > b ? -1 : 0; });
        for (var _i = 0, steps_1 = steps; _i < steps_1.length; _i++) {
            var step = steps_1[_i];
            if (frequency >= step) {
                backgroundColor = finalPalette[step][0];
                color = finalPalette[step][1];
                break;
            }
        }
        return [backgroundColor, color];
    };
    ConsensusModel.setColorsPhysical = function (letter, palette) {
        var finalPalette;
        var backgroundColor;
        var color;
        if (palette && typeof palette !== 'string') {
            finalPalette = palette;
        }
        else {
            finalPalette = _palettes__WEBPACK_IMPORTED_MODULE_0__.Palettes.consensusAaLesk;
        }
        for (var el in finalPalette) {
            if (finalPalette[el][0] == letter) {
                backgroundColor = finalPalette[el][1];
                color = finalPalette[el][2];
                break;
            }
        }
        return [backgroundColor, color];
    };
    ConsensusModel.prototype.process = function (sequences, regions, options) {
        var _a, _b;
        if (!regions) {
            regions = [];
        }
        var maxIdx = 0;
        for (var _i = 0, sequences_2 = sequences; _i < sequences_2.length; _i++) {
            var row = sequences_2[_i];
            if (maxIdx < row.sequence.length) {
                maxIdx = row.sequence.length;
            }
        }
        for (var _c = 0, sequences_3 = sequences; _c < sequences_3.length; _c++) {
            var row = sequences_3[_c];
            var diff = maxIdx - row.sequence.length;
            if (diff > 0 && row.id !== -99999999999999 && row.id !== -99999999999998) {
                for (var i = 0; i < diff; i++) {
                    row.sequence += '-';
                }
            }
        }
        if (options.sequenceColorMatrix) {
            regions = [];
            sequences.sort(function (a, b) { return a.id - b.id; });
            var min = sequences[0];
            var palette = _palettes__WEBPACK_IMPORTED_MODULE_0__.Palettes.substitutionMatrixBlosum;
            // console.log(palette)
            if (options.sequenceColorMatrixPalette) {
                palette = options.sequenceColorMatrixPalette;
            }
            var key = void 0;
            // tslint:disable-next-line:prefer-for-of
            for (var i = 0; i < min.sequence.length; i++) {
                for (var _d = 0, sequences_4 = sequences; _d < sequences_4.length; _d++) {
                    var sequence = sequences_4[_d];
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
            for (var _e = 0, sequences_5 = sequences; _e < sequences_5.length; _e++) {
                var sequence = sequences_5[_e];
                sequence.sequenceColor = options.sequenceColor;
                regions.push({ sequenceId: sequence.id, start: 1, end: sequence.sequence.length, sequenceColor: options.sequenceColor });
            }
        }
        var consensusInfoIdentity;
        var consensusInfoPhysical;
        if (options.consensusColorIdentity) {
            consensusInfoIdentity = ConsensusModel.setConsensusInfo('identity', sequences);
            _a = ConsensusModel.createConsensus('identity', consensusInfoIdentity, false, sequences, regions, options.dotThreshold, options.consensusColorIdentity), sequences = _a[0], regions = _a[1];
        }
        else if (options.consensusColorMapping) {
            consensusInfoPhysical = ConsensusModel.setConsensusInfo('physical', sequences);
            if (!consensusInfoIdentity) {
                consensusInfoIdentity = ConsensusModel.setConsensusInfo('identity', sequences);
            }
            _b = ConsensusModel.createConsensus('physical', consensusInfoPhysical, consensusInfoIdentity, sequences, regions, options.dotThreshold, options.consensusColorMapping), sequences = _b[0], regions = _b[1];
        }
        return [sequences, regions];
    };
    return ConsensusModel;
}());



/***/ }),

/***/ "./src/lib/events.model.ts":
/*!*********************************!*\
  !*** ./src/lib/events.model.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EventsModel": () => (/* binding */ EventsModel)
/* harmony export */ });
var EventsModel = /** @class */ (function () {
    function EventsModel() {
    }
    EventsModel.prototype.onRegionSelected = function () {
        var sequenceViewers = document.getElementsByClassName('cell');
        // @ts-ignore
        for (var _i = 0, sequenceViewers_1 = sequenceViewers; _i < sequenceViewers_1.length; _i++) {
            var sqv = sequenceViewers_1[_i];
            sqv.addEventListener('dblclick', function (r) {
                var evt = new CustomEvent('onRegionSelected', { detail: { char: r.srcElement.innerHTML, x: r.srcElement.dataset.resX, y: r.srcElement.dataset.resY } });
                window.dispatchEvent(evt);
            });
        }
    };
    return EventsModel;
}());



/***/ }),

/***/ "./src/lib/icons.model.ts":
/*!********************************!*\
  !*** ./src/lib/icons.model.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "IconsModel": () => (/* binding */ IconsModel)
/* harmony export */ });
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./icons */ "./src/lib/icons.ts");

var IconsModel = /** @class */ (function () {
    function IconsModel() {
    }
    IconsModel.prototype.process = function (regions, sequences, iconsPaths) {
        var rows = {};
        if (regions && sequences) {
            var _loop_1 = function (seq) {
                for (var _a = 0, regions_1 = regions; _a < regions_1.length; _a++) {
                    var reg = regions_1[_a];
                    if (+seq.id === reg.sequenceId) {
                        if (!rows[seq.id]) {
                            rows[seq.id] = {};
                        }
                        // tslint:disable-next-line:forin
                        for (var key in sequences.find(function (x) { return x.id === seq.id; }).sequence) {
                            key = (+key + 1).toString();
                            // chars with icon
                            if (+key >= reg.start && +key <= reg.end && reg.icon) {
                                if (reg.icon) {
                                    var region = reg.end - (reg.start - 1);
                                    var center = Math.floor(region / 2);
                                    var icon = void 0;
                                    if (reg.color && reg.color[0] === '(') {
                                        reg.color = 'rgb' + reg.color;
                                    }
                                    // default icons
                                    switch (reg.icon) {
                                        case 'lollipop': {
                                            icon = _icons__WEBPACK_IMPORTED_MODULE_0__.Icons.lollipop;
                                            break;
                                        }
                                        case 'arrowRight': {
                                            icon = _icons__WEBPACK_IMPORTED_MODULE_0__.Icons.arrowRight;
                                            break;
                                        }
                                        case 'arrowLeft': {
                                            icon = _icons__WEBPACK_IMPORTED_MODULE_0__.Icons.arrowLeft;
                                            break;
                                        }
                                        case 'strand': {
                                            icon = _icons__WEBPACK_IMPORTED_MODULE_0__.Icons.strand;
                                            break;
                                        }
                                        case 'noSecondary': {
                                            icon = _icons__WEBPACK_IMPORTED_MODULE_0__.Icons.noSecondary;
                                            break;
                                        }
                                        case 'helix': {
                                            icon = _icons__WEBPACK_IMPORTED_MODULE_0__.Icons.helix;
                                            break;
                                        }
                                        case 'turn': {
                                            icon = _icons__WEBPACK_IMPORTED_MODULE_0__.Icons.turn;
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
            };
            for (var _i = 0, sequences_1 = sequences; _i < sequences_1.length; _i++) {
                var seq = sequences_1[_i];
                _loop_1(seq);
            }
        }
        var filteredRows = {};
        // tslint:disable-next-line:forin
        for (var row in rows) {
            var flag = void 0;
            var chars = rows[row];
            for (var char in rows[row]) {
                if (rows[row][char].char !== '') {
                    flag = true;
                }
            }
            if (flag) {
                filteredRows[row] = chars;
            }
        }
        return filteredRows;
    };
    return IconsModel;
}());



/***/ }),

/***/ "./src/lib/icons.ts":
/*!**************************!*\
  !*** ./src/lib/icons.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Icons": () => (/* binding */ Icons)
/* harmony export */ });
var Icons = /** @class */ (function () {
    function Icons() {
    }
    Icons.lollipop = '<svg xmlns="http://www.w3.org/2000/svg" width="0.7em" x="0" y="0" id="lollipop" viewBox="0 0 340.16 950.93"><path fill="rgb(255, 99, 71)" d="M311.465,141.232c0,78-63.231,141.232-141.232,141.232  c-78,0-141.232-63.232-141.232-141.232S92.232,0,170.232,0C248.233,0,311.465,63.232,311.465,141.232z M194,280.878h-47.983V566.93  H194V280.878z"/></svg>';
    Icons.arrowLeft = '<svg xmlns="http://www.w3.org/2000/svg" width="0.7em" id="Livello_1" x="0px" y="0px" viewBox="0 0 963.78 1587.4" enable-background="new 0 0 963.78 1587.4" xml:space="preserve"><rect style="fill:transparent" x="0.477" y="412.818" stroke="#000000" stroke-miterlimit="10" width="963.781" height="763.636"/><g><defs><rect width="964" height="1587"></rect></defs><clipPath><use overflow="visible"></use></clipPath><polygon style="fill:#FDDD0D;" fill-rule="evenodd" clip-rule="evenodd" points="1589.64,411.77 1589.64,1179.37    756.04,1179.37 756.04,1591.15 0,795.57 756.04,0 756.04,411.77  "> </polygon></g></svg>';
    Icons.arrowRight = '<svg xmlns="http://www.w3.org/2000/svg" width="0.7em" id="Layer_1" x="0px" y="0px" viewBox="0 0 964 1587" enable-background="new 0 0 964 1587" xml:space="preserve">  <image id="image0" width="964" height="1587" x="0" y="0" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA8QAAAYzCAMAAAAF3QTDAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABzlBMVEX//////fP+627+63H/ /Of//Ov93Q394zb//Oz95D7//fL95Uj//vb+51L//vn+6F7///z+6WL///3+62////7+7Xz+7oT+ 8JX93Q7+8qL93Q/+86j93hH+9LP93hT+9r793hf/98j93xn/+Mz93x7/+dT94CT/+tz94Sr/++P9 4jL//On+6F3+6WH+7Hv+7YL+8Zr+86f+9LL+9r3/98f/+Mv94i3//Ob94zX95D3//fH95Uf+51H+ 51b//vr+6m3+7Hr+7YH+8JT+8Zn+8qb+9LH93hX+9sH/+dP/++X+5lD+51X+7Hn+7YD+74r+8qX+ 9rz+9sD93xj/+Mr94CP/+tv94Sn94Sz95Dz95Ub+5kv+6WD+6mz+7X/+7on93RD+9LD93hL+9bX9 3x3/+dL94Cb/+t7/++T94jT//vX95kr+51T+6mv+7X7+7of+8Jj+8qT+9r//98n/+dH/+tr//Or9 5Dv//fD95D/+51P+6F/+7X3+7ob+8Jf+8qP+9K/+9LT94B//+dX94CX/+t394Sv94jP95Un+6mr+ 63D+8Jb93xz+74v93hP+7oj94zv+7oP//e/+7Hj95ED+7oX/+ND95UX+6WP+9K7+8qHSDgXQAAAA AWJLR0QAiAUdSAAAAAlwSFlzAAAAYAAAAGAA8GtCzwAAAAd0SU1FB+QMCgojI/oVfZQAAC+qSURB VHja7d13gx3FvedhLayaZGAAY4ZhEEKIJBAmr8jYgC7RgBAIESxAZIHJOQoQ0Qss19d3992uTVSY cM7prv5VeJ5XUF11Pv9J31mzpi7/47DDDjv8f0afApjZ2u5fjjgy+hjArH6MuDvq6OhzADP6KeLu mN9FHwSYzc8Rd8ceF30SYCa/RNwdPxd9FGAWv0bcnXBi9FmAGfwWcXfS76MPA0xvv4i7k6MPA0xv /4i7P0SfBpjaARF3p0QfB5jWgRHPnxp9HmBKB0bcLZwWfSBgOgdF3C2eHn0iYCoHR9ytOyP6SMA0 Dom4W39m9JmAKRwacbfhrOhDAZNbIuJu49nRpwImtlTE3TnnRh8LmNSSEXfnnR99LmBCS0fcbbog +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 RK5CYII="/></svg>';
    Icons.strand = '<svg xmlns="http://www.w3.org/2000/svg" width="0.7em" id="Livello_1" x="0px" y="0px" viewBox="0 0 963.78 1587.4" enable-background="new 0 0 963.78 1587.4" xml:space="preserve"><rect style="fill:#FDDD0D;" x="0.477" y="412.818" stroke="#000000" stroke-miterlimit="10" width="963.781" height="763.636"/></svg>';
    Icons.noSecondary = '<svg x="0px" y="0px" width="0.7em" viewBox="0 0 963.78 1587.4"><rect style="fill:#706F6F;" x="0.478" y="665.545" width="963.781" height="256.364"/></svg>';
    Icons.helix = '<svg xmlns="http://www.w3.org/2000/svg" width="0.7em" id="Livello_1" x="0px" y="0px" viewBox="0 0 963.78 1587.4" enable-background="new 0 0 963.78 1587.4" xml:space="preserve"><path d="M0,665.545"/><path style="fill:rgb(240,0,128);" d="M7,691c-2.825,59.659,8.435,116.653,6.962,176.309  c-2.126,86.119,8.999,168.953,21.967,253.74c7.673,50.17,16.183,100.271,27.762,149.706c17.538,74.873,35.635,148.402,81.801,211.35  c33.037,45.045,76.542,69.859,130.521,79.056c147.959,25.208,225.187-111.229,251.929-232.674  c20.553-93.348,26.027-188.996,35.963-283.827c12.16-116.095-9.854-249.139,51.535-354.533  c26.216-45.008,79.912-87.811,134.044-93.67c65.497-7.09,113.689,52.59,135.384,107.506  c25.648,64.927,33.322,141.579,70.184,201.528c17.244-16.261,10.323-70.57,9.487-95.14c-1.506-44.307,0.823-83.339-6.961-126.96  c-20.395-114.279-22.992-236.804-54.565-347.808C868.34,213.678,812.663-62.602,627.257,12.459  C479.538,72.264,448.893,277.771,431.147,417.19c-8.481,66.632-13.854,133.623-22.581,200.225  c-8.457,64.544-5.9,127.593-22.444,191.979c-17.752,69.089-55.739,176.947-129.987,202.952c-34.633,12.127-72.727,7.646-104-10.787  C39.193,934.987,55.326,786.128,7,681"/></svg>';
    Icons.turn = '<svg xmlns="http://www.w3.org/2000/svg" width="0.7em" id="Livello_1" x="0px" y="0px" viewBox="0 0 963.78 1587.4" enable-background="new 0 0 963.78 1587.4" xml:space="preserve"><path fill="#6080ff" stroke="#000000" stroke-width="5" stroke-miterlimit="10" d="M126.836,704.144c-42.996,28.54-85.103-4.688-123.541-28.17  c5.416,3.309-1.803,83.249-1.004,93.44c3.438,43.889,1.282,80.298,28.763,116.171c62.445,81.517,210.775,94.402,267.032-1.93  c50.939-87.229,46.263-186.556,53.467-283.387c6.11-82.125-1.584-146.41,76.221-194.253  c64.567-39.704,136.354-11.421,166.457,54.066c65.666,142.853-13.311,375.025,146.185,470.511  c45.838,27.442,108.556,20.483,155.013-1.621c21.723-10.336,50.014-27.858,60.433-50.822c11.735-25.869,2.965-60.306,3.787-87.663  c1.068-35.55,9.302-79.208-0.628-113.596c-20.617,10.903-33.832,30.3-59.142,38.896c-28.601,9.713-60.777,10.479-82.936-13.122  c-26.177-27.891-19.497-72.643-24.013-107.505c-7.986-61.664-8.833-124.334-14.748-186.227  C766.397,285.641,738.287,161.82,651.007,68.818C582.482-4.198,457.863-19.858,372.696,34.02  c-72.242,45.705-123.991,91.534-151.164,176.089c-29.781,92.673-38.773,200.285-38.475,297.867  c0.167,54.82-2.342,151.334-48.24,190.152C132.154,700.38,129.493,702.38,126.836,704.144z"/></svg>';
    return Icons;
}());



/***/ }),

/***/ "./src/lib/options.model.ts":
/*!**********************************!*\
  !*** ./src/lib/options.model.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OptionsModel": () => (/* binding */ OptionsModel)
/* harmony export */ });
var OptionsModel = /** @class */ (function () {
    function OptionsModel() {
        this.options = {
            fontSize: '14px',
            chunkSize: 10,
            chunkSeparation: 1,
            emptyFiller: ' ',
            indexesLocation: null,
            wrapLine: true,
            viewerWidth: '',
            dotThreshold: 90,
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
    OptionsModel.prototype.process = function (opt, consensus) {
        /** check input fontSize */
        if (opt && opt.fontSize) {
            var fSize = opt.fontSize;
            var fNum = +fSize.substr(0, fSize.length - 2);
            var fUnit = fSize.substr(fSize.length - 2, 2);
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
            var cSize = +opt.chunkSize;
            if (isNaN(cSize) || cSize < 0) {
                // wrong chunkSize format
            }
            else {
                this.options.chunkSize = cSize;
            }
        }
        /** check input spaceSize */
        if (opt && opt.chunkSeparation) {
            var chunkSeparation = +opt.chunkSeparation;
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
                var keys = Object.keys(opt.sequenceColor);
                if (keys[0].length === 1) {
                    this.options.sequenceColor = 'custom';
                    this.options.customPalette = opt.sequenceColor;
                }
                else {
                    this.options.sequenceColorMatrix = 'custom';
                    this.options.sequenceColorMatrixPalette = opt.sequenceColor;
                }
            }
            else {
                if (opt.sequenceColor === "blosum62") {
                    this.options.sequenceColorMatrix = opt.sequenceColor;
                }
                else if (opt.sequenceColor === "clustal") {
                    this.options.sequenceColor = opt.sequenceColor;
                }
            }
        }
        /** check consensusType value */
        if (consensus && consensus.color) {
            if (typeof consensus.color !== 'string') {
                var keys = Object.keys(consensus.color);
                if (typeof (keys[0]) === 'string') {
                    this.options.consensusColorIdentity = consensus.color;
                }
                else {
                    this.options.consensusColorMapping = consensus.color;
                }
            }
            else {
                if (consensus.color === "identity") {
                    this.options.consensusColorIdentity = consensus.color;
                }
                else if (consensus.color === "physical") {
                    this.options.consensusColorMapping = consensus.color;
                }
            }
        }
        /** check consensusThreshold value */
        if (consensus && consensus.dotThreshold) {
            if (typeof consensus.dotThreshold == 'number') {
                this.options.dotThreshold = consensus.dotThreshold;
            }
        }
        /** check rowMarginBottom value */
        if (opt && opt.lineSeparation !== undefined) {
            var rSize = opt.lineSeparation;
            var rNum = +rSize.substr(0, rSize.length - 2);
            var rUnit = rSize.substr(rSize.length - 2, 2);
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
            var viewerWidth = opt.viewerWidth;
            var olNum = +viewerWidth.substr(0, viewerWidth.length - 2);
            var olUnit = viewerWidth.substr(viewerWidth.length - 2, 2);
            if (isNaN(olNum) || (olUnit !== 'px' && olUnit !== 'vw' && olUnit !== 'em')) {
                // wrong oneLineWidth format
            }
            else {
                this.options.viewerWidth = viewerWidth;
            }
        }
        return this.options;
    };
    return OptionsModel;
}());



/***/ }),

/***/ "./src/lib/palettes.ts":
/*!*****************************!*\
  !*** ./src/lib/palettes.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Palettes": () => (/* binding */ Palettes)
/* harmony export */ });
var Palettes = /** @class */ (function () {
    function Palettes() {
    }
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
    return Palettes;
}());



/***/ }),

/***/ "./src/lib/patterns.model.ts":
/*!***********************************!*\
  !*** ./src/lib/patterns.model.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PatternsModel": () => (/* binding */ PatternsModel)
/* harmony export */ });
var PatternsModel = /** @class */ (function () {
    function PatternsModel() {
    }
    // find index of matched regex positions and create array of regions with color
    PatternsModel.prototype.process = function (patterns, sequences) {
        if (!patterns) {
            return;
        }
        var regions = []; // OutPatterns
        var _loop_1 = function (element) {
            // tslint:disable-next-line:no-conditional-assignment
            var pattern = element.pattern;
            var str = void 0;
            if (sequences.find(function (x) { return x.id === element.sequenceId; })) {
                str = sequences.find(function (x) { return x.id === element.sequenceId; }).sequence;
                if (element.start && element.end) {
                    str = str.substr(element.start - 1, element.end - (element.start - 1));
                }
                this_1.regexMatch(str, pattern, regions, element);
            }
            else {
                for (var _a = 0, sequences_1 = sequences; _a < sequences_1.length; _a++) {
                    var seq = sequences_1[_a];
                    // regex
                    if (element.start && element.end) {
                        str = seq.sequence.substr(element.start - 1, element.end - (element.start - 1));
                    }
                    this_1.regexMatch(str, pattern, regions, element);
                }
            }
        };
        var this_1 = this;
        // @ts-ignore
        for (var _i = 0, patterns_1 = patterns; _i < patterns_1.length; _i++) {
            var element = patterns_1[_i];
            _loop_1(element);
        }
        return regions;
    };
    PatternsModel.prototype.regexMatch = function (str, pattern, regions, element) {
        var re = new RegExp(pattern, "g");
        var match;
        // tslint:disable-next-line:no-conditional-assignment
        while ((match = re.exec(str)) != null) {
            regions.push({ start: +match.index + 1, end: +match.index + +match[0].length,
                backgroundColor: element.backgroundColor, color: element.color, backgroundImage: element.backgroundImage,
                borderColor: element.borderColor, borderStyle: element.borderStyle, sequenceId: element.sequenceId });
        }
    };
    return PatternsModel;
}());



/***/ }),

/***/ "./src/lib/proseqviewer.ts":
/*!*********************************!*\
  !*** ./src/lib/proseqviewer.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ProSeqViewer": () => (/* binding */ ProSeqViewer)
/* harmony export */ });
/* harmony import */ var _options_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./options.model */ "./src/lib/options.model.ts");
/* harmony import */ var _rows_model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rows.model */ "./src/lib/rows.model.ts");
/* harmony import */ var _colors_model__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./colors.model */ "./src/lib/colors.model.ts");
/* harmony import */ var _selection_model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./selection.model */ "./src/lib/selection.model.ts");
/* harmony import */ var _icons_model__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./icons.model */ "./src/lib/icons.model.ts");
/* harmony import */ var _sequenceInfoModel__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./sequenceInfoModel */ "./src/lib/sequenceInfoModel.ts");
/* harmony import */ var _events_model__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./events.model */ "./src/lib/events.model.ts");
/* harmony import */ var _patterns_model__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./patterns.model */ "./src/lib/patterns.model.ts");
/* harmony import */ var _consensus_model__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./consensus.model */ "./src/lib/consensus.model.ts");









var ProSeqViewer = /** @class */ (function () {
    function ProSeqViewer(divId) {
        var _this = this;
        this.divId = divId;
        this.init = false;
        this.params = new _options_model__WEBPACK_IMPORTED_MODULE_0__.OptionsModel();
        this.rows = new _rows_model__WEBPACK_IMPORTED_MODULE_1__.RowsModel();
        this.consensus = new _consensus_model__WEBPACK_IMPORTED_MODULE_8__.ConsensusModel();
        this.regions = new _colors_model__WEBPACK_IMPORTED_MODULE_2__.ColorsModel();
        this.patterns = new _patterns_model__WEBPACK_IMPORTED_MODULE_7__.PatternsModel();
        this.icons = new _icons_model__WEBPACK_IMPORTED_MODULE_4__.IconsModel();
        this.labels = new _sequenceInfoModel__WEBPACK_IMPORTED_MODULE_5__.SequenceInfoModel();
        this.selection = new _selection_model__WEBPACK_IMPORTED_MODULE_3__.SelectionModel();
        this.events = new _events_model__WEBPACK_IMPORTED_MODULE_6__.EventsModel();
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
                labelshtml += "<span class=\"lbl-hidden\" style=\"margin-bottom:" + lineSeparation + ";\"></span>";
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
                        labelshtml += "<span class=\"lbl-hidden\" style=\"margin-bottom:" + lineSeparation + "\"><span class=\"lbl\"> " + noGapsLabels[seqN] + "</span></span>";
                    }
                    else {
                        labelshtml += "<span class=\"lbl-hidden\" style=\"margin-bottom:" + lineSeparation + "\"><span class=\"lbl\"></span></span>";
                    }
                }
                else {
                    count += 1;
                    if (idx) {
                        if (!chunkSize) {
                            // lateral index regular
                            labelshtml += "<span class=\"lbl-hidden\" style=\"width: " + fontSize + ";margin-bottom:" + lineSeparation + "\">\n                            <span class=\"lbl\" >" + ((startIndexes[count] - 1) + idx) + "</span></span>";
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
                            labelshtml += "<span class=\"lbl-hidden\" style=\"width:  " + fontSize + ";margin-bottom:" + lineSeparation + "\">\n                            <span class=\"lbl\" >" + ((startIndexes[count] - 1) + noGapsLabels[seqN]) + "</span></span>";
                        }
                    }
                    else {
                        labelshtml += "<span class=\"lbl-hidden\" style=\"margin-bottom:" + lineSeparation + "\"><span class=\"lbl\">" + labels[count] + tooltips[count] + "</span></span>";
                    }
                }
                flag = false;
            }
            if (indexesLocation == 'lateral' || 'both') {
                labelsContainer = "<span class=\"lblContainer\" style=\"display: inline-block\">" + labelshtml + "</span>";
            }
            else {
                // add margin in case we only have labels and no indexes
                labelsContainer = "<span class=\"lblContainer\" style=\"margin-right:10px;display: inline-block\">" + labelshtml + "</span>";
            }
        }
        return labelsContainer;
    };
    ProSeqViewer.prototype.addTopIndexes = function (chunkSize, x, maxTop, rowMarginBottom) {
        var cells = '';
        // adding top indexes
        var chunkTopIndex;
        if (x % chunkSize === 0 && x <= maxTop) {
            chunkTopIndex = "<span class=\"cell\" style=\"-webkit-user-select: none;direction: rtl;display:block;width:0.6em;margin-bottom:" + rowMarginBottom + "\">" + x + "</span>";
        }
        else {
            chunkTopIndex = "<span class=\"cell\" style=\"-webkit-user-select: none;display:block;visibility: hidden;margin-bottom:" + rowMarginBottom + "\">0</span>";
        }
        cells += chunkTopIndex;
        return cells;
    };
    ProSeqViewer.prototype.createGUI = function (data, labels, startIndexes, tooltips, options, labelsFlag) {
        var sqvBody = document.getElementById(this.divId);
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
        var chunkSize = options.chunkSize;
        var fontSize = options.fontSize;
        var chunkSeparation = options.chunkSeparation;
        var indexesLocation = options.indexesLocation;
        var wrapLine = options.wrapLine;
        var viewerWidth = options.viewerWidth;
        var lineSeparation = options.lineSeparation + ';';
        var fNum = +fontSize.substr(0, fontSize.length - 2);
        var fUnit = fontSize.substr(fontSize.length - 2, 2);
        // maxIdx = length of the longest sequence
        var maxIdx = 0;
        var maxTop = 0;
        for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
            var row = data_2[_i];
            if (maxIdx < Object.keys(row).length) {
                maxIdx = Object.keys(row).length;
            }
            if (maxTop < Object.keys(row).length) {
                maxTop = Object.keys(row).length;
            }
        }
        var lenghtIndex = maxIdx.toString().length;
        var indexWidth = (fNum * lenghtIndex).toString() + fUnit;
        // consider the last chunk even if is not long enough
        if (chunkSize > 0) {
            maxIdx += (chunkSize - (maxIdx % chunkSize)) % chunkSize;
        }
        // generate labels
        var labelsContainer = this.generateLabels(false, labels, startIndexes, indexesLocation, false, indexWidth, tooltips, data, lineSeparation);
        var index = '';
        var cards = '';
        var cell;
        var entity;
        var style;
        var html = '';
        var idxNum = 0;
        var idx;
        var cells = '';
        for (var x = 1; x <= maxIdx; x++) {
            if (indexesLocation != 'lateral') {
                cells = this.addTopIndexes(chunkSize, x, maxTop, lineSeparation);
            }
            ;
            for (var y = 0; y < data.length; y++) {
                entity = data[y][x];
                style = 'font-size: 1em;display:block;height:1em;line-height:1em;margin-bottom:' + lineSeparation;
                if (y === data.length - 1) {
                    style = 'font-size: 1em;display:block;line-height:1em;margin-bottom:' + lineSeparation;
                }
                if (!entity) {
                    // emptyfiller
                    style = 'font-size: 1em;display:block;color: rgba(0, 0, 0, 0);height:1em;line-height:1em;margin-bottom:' + lineSeparation;
                    cell = "<span style=\"" + style + "\">A</span>"; // mock char, this has to be done to have chunks all of the same length (last chunk can't be shorter)
                }
                else {
                    if (entity.target) {
                        style += "" + entity.target;
                    }
                    if (entity.char && !entity.char.includes('svg')) {
                        // y is the row, x is the column
                        cell = "<span class=\"cell\" data-res-x='" + x + "' data-res-y= '" + y + "' data-res-id= '" + this.divId + "'\n                    style=\"" + style + "\">" + entity.char + "</span>";
                    }
                    else {
                        style += '-webkit-user-select: none;';
                        cell = "<span style=\"" + style + "\">" + entity.char + "</span>";
                    }
                }
                cells += cell;
            }
            cards += "<div class=\"crd\">" + cells + "</div>"; // width 3/5em to reduce white space around letters
            cells = '';
            if (chunkSize > 0 && x % chunkSize === 0) {
                // considering the row of top indexes
                if (indexesLocation != 'top') {
                    idxNum += chunkSize; // lateral index (set only if top indexes missing)
                    idx = idxNum - (chunkSize - 1);
                    // adding labels
                    var gapsContainer = this.generateLabels(idx, labels, startIndexes, indexesLocation, chunkSize, indexWidth, false, data, lineSeparation);
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
                        index = labelsContainer + gapsContainer; // lateral number indexes + labels
                    }
                }
                else {
                    index = labelsContainer; // top
                }
                index = "<div class=\"idx hidden\">" + index + "</div>";
                style = "font-size: " + fontSize + ";";
                if (x !== maxIdx) {
                    style += 'padding-right: ' + chunkSeparation + 'em;';
                }
                else {
                    style += 'margin-right: ' + chunkSeparation + 'em;';
                }
                var chunk = '';
                if (labelsFlag || options.consensusType || indexesLocation == 'both' || indexesLocation == 'lateral') { // both
                    chunk = "<div class=\"cnk\" style=\"" + style + "\">" + index + "<div class=\"crds\">" + cards + "</div></div>";
                }
                else {
                    chunk = "<div class=\"cnk\" style=\"" + style + "\"><div class=\"idx hidden\"></div><div class=\"crds\">" + cards + "</div></div>"; // top
                }
                cards = '';
                index = '';
                html += chunk;
            }
        }
        var innerHTML;
        if (wrapLine) {
            innerHTML = "<div class=\"root\">   " + html + " </div>";
        }
        else {
            innerHTML = "<div class=\"root\" style=\"display: flex\">\n                        <div style=\"display:inline-block;overflow-x:scroll;white-space: nowrap;width:" + viewerWidth + "\"> " + html + "</div>\n                        </div>";
        }
        sqvBody.innerHTML = innerHTML;
        window.dispatchEvent(new Event('resize'));
    };
    ProSeqViewer.sqvList = [];
    return ProSeqViewer;
}());

// // VERY IMPORTANT AND USEFUL TO BE ABLE TO HAVE A WORKING BUNDLE.JS!! NEVER DELETE THIS LINE
// (window as any).ProSeqViewer = ProSeqViewer;


/***/ }),

/***/ "./src/lib/rows.model.ts":
/*!*******************************!*\
  !*** ./src/lib/rows.model.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RowsModel": () => (/* binding */ RowsModel)
/* harmony export */ });
/* harmony import */ var _palettes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./palettes */ "./src/lib/palettes.ts");
/* harmony import */ var _colors_model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./colors.model */ "./src/lib/colors.model.ts");


var RowsModel = /** @class */ (function () {
    function RowsModel() {
        this.substitutiveId = 99999999999999;
    }
    RowsModel.prototype.processRows = function (rows, icons, regions, opt) {
        var allData = [];
        // decide which color is more important in case of overwriting
        var coloringOrder = ['custom', 'clustal', 'zappo', 'gradient', 'binary'];
        // order row Numbers
        var rowNumsOrdered = Object.keys(rows).map(Number).sort(function (n1, n2) { return n1 - n2; });
        // order keys of Row object
        var ordered = {};
        for (var _i = 0, rowNumsOrdered_1 = rowNumsOrdered; _i < rowNumsOrdered_1.length; _i++) {
            var rowNum = rowNumsOrdered_1[_i];
            ordered[rowNum] = Object.keys(rows[+rowNum]).map(Number).sort(function (n1, n2) { return n1 - n2; });
        }
        var data;
        var coloringRowNums;
        var tmp;
        // loop through data rows
        for (var _a = 0, rowNumsOrdered_2 = rowNumsOrdered; _a < rowNumsOrdered_2.length; _a++) {
            var rowNum = rowNumsOrdered_2[_a];
            tmp = ordered[rowNum];
            // data key: indexes, value: chars
            data = rows[rowNum];
            // data[rowNum].label = this.rows.getLabel(rowNum, this.sequences);
            // console.log(data)
            if (regions) {
                for (var _b = 0, _c = coloringOrder.reverse(); _b < _c.length; _b++) {
                    var coloring = _c[_b];
                    coloringRowNums = _colors_model__WEBPACK_IMPORTED_MODULE_1__.ColorsModel.getRowsList(coloring).map(Number);
                    // if there is coloring for the data row
                    if (coloringRowNums.indexOf(rowNum) < 0) {
                        // go to next coloring
                        continue;
                    }
                    var positions = _colors_model__WEBPACK_IMPORTED_MODULE_1__.ColorsModel.getPositions(coloring, rowNum);
                    // positions = start, end, target (bgcolor || fgcolor)
                    if (positions.length > 0) {
                        for (var _d = 0, positions_1 = positions; _d < positions_1.length; _d++) {
                            var e = positions_1[_d];
                            for (var i = e.start; i <= e.end; i++) {
                                if (!data[i]) {
                                    continue;
                                }
                                if (e.backgroundColor && !e.backgroundColor.startsWith('#')) { // is a palette
                                    if (e.backgroundColor == 'custom') {
                                        data[i].backgroundColor = opt.customPalette[data[i].char];
                                    }
                                    else {
                                        data[i].backgroundColor = _palettes__WEBPACK_IMPORTED_MODULE_0__.Palettes[e.backgroundColor][data[i].char]; // e.backgroundcolor = zappo, clustal..
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
                    var iconsData = icons[rowNum];
                    if (iconsData) {
                        allData.push(iconsData);
                    }
                }
            }
            allData.push(data);
        }
        return allData;
    };
    RowsModel.prototype.process = function (sequences, icons, regions, opt) {
        // check and set global sequenceColor
        if (opt && opt.sequenceColor) {
            // @ts-ignore
            for (var _i = 0, sequences_1 = sequences; _i < sequences_1.length; _i++) {
                var sequence = sequences_1[_i];
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
        var rows = {};
        // check if there are undefined or duplicate ids and prepare to reset them
        var values = [];
        var undefinedValues = 0;
        for (var _a = 0, _b = Object.keys(sequences); _a < _b.length; _a++) {
            var r = _b[_a];
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
        for (var _c = 0, _d = Object.keys(sequences); _c < _d.length; _c++) {
            var row = _d[_c];
            /** check sequences id type */
            var id = void 0;
            if (isNaN(+sequences[row].id)) {
                id = values.sort()[values.length - 1] + 1;
            }
            else {
                id = sequences[row].id;
            }
            /** set row chars */
            rows[id] = {};
            for (var _e = 0, _f = Object.keys(sequences[row].sequence); _e < _f.length; _e++) {
                var idx = _f[_e];
                var idxKey = (+idx + 1).toString();
                var char = sequences[row].sequence[idx];
                rows[id][idxKey] = { char: char };
            }
        }
        return this.processRows(rows, icons, regions, opt);
    };
    return RowsModel;
}());



/***/ }),

/***/ "./src/lib/selection.model.ts":
/*!************************************!*\
  !*** ./src/lib/selection.model.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SelectionModel": () => (/* binding */ SelectionModel)
/* harmony export */ });
var SelectionModel = /** @class */ (function () {
    function SelectionModel() {
        this.event_sequence = [];
    }
    SelectionModel.prototype.set_start = function (e) {
        var id;
        var element;
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
        var elements = document.querySelectorAll('[data-res-id=' + element.dataset.resId + ']');
        this.selectionhighlight(elements);
        this.firstOver = false;
    };
    SelectionModel.prototype.selectionhighlight = function (elements) {
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var selection = elements_1[_i];
            var x = +selection.getAttribute('data-res-x');
            var y = +selection.getAttribute('data-res-y');
            var firstX = Math.min(+this.start.x, +this.lastOver.x);
            var lastX = Math.max(+this.start.x, +this.lastOver.x);
            var firstY = Math.min(+this.start.y, +this.lastOver.y);
            var lastY = Math.max(+this.start.y, +this.lastOver.y);
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
    };
    SelectionModel.prototype.process = function () {
        var _this = this;
        var sequenceViewers = document.getElementsByClassName('cell');
        // remove selection on new click
        window.onmousedown = function (event) {
            _this.event_sequence.push(0);
            // @ts-ignore
            for (var _i = 0, sequenceViewers_2 = sequenceViewers; _i < sequenceViewers_2.length; _i++) {
                var sqv = sequenceViewers_2[_i];
                sqv.onmousedown = function (e) {
                    _this.set_start(e);
                };
            }
            if (_this.event_sequence[0] == 0 && _this.event_sequence[1] == 1 && _this.event_sequence[2] == 2 && _this.event_sequence[0] == 0) {
                // left click
                var elements = document.querySelectorAll('[data-res-id=' + _this.lastId + ']');
                // @ts-ignore
                for (var _a = 0, elements_2 = elements; _a < elements_2.length; _a++) {
                    var selection = elements_2[_a];
                    selection.classList.remove('highlight');
                }
            }
            // if first click outside sqvDiv (first if is valid in Chrome, second in firefox)
            if (!event.target.dataset.resX) {
                _this.firstOver = true;
            }
            if (event.explicitOriginalTarget && event.explicitOriginalTarget.dataset) {
                _this.firstOver = true;
            }
            _this.event_sequence = [0];
        };
        // @ts-ignore
        for (var _i = 0, sequenceViewers_1 = sequenceViewers; _i < sequenceViewers_1.length; _i++) {
            var sqv = sequenceViewers_1[_i];
            sqv.onmouseover = function (e) {
                if (!(1 in _this.event_sequence)) {
                    _this.event_sequence.push(1);
                }
                if (_this.firstOver) {
                    _this.set_start(e);
                }
                var element;
                if (e.path) {
                    element = e.path[0];
                }
                else {
                    element = e.originalTarget;
                }
                if (_this.start) {
                    _this.lastOver = { y: element.dataset.resY, x: element.dataset.resX, sqvId: element.dataset.resId };
                    var elements = document.querySelectorAll('[data-res-id=' + element.dataset.resId + ']');
                    if (_this.lastId == element.dataset.resId) {
                        _this.selectionhighlight(elements);
                    }
                }
            };
        }
        document.body.onmouseup = function () {
            _this.event_sequence.push(2);
            _this.firstOver = false;
            if (_this.start) {
                _this.start = undefined;
            }
            if (_this.event_sequence[0] == 0 && _this.event_sequence[1] == 2) {
                var elements = document.querySelectorAll('[data-res-id=' + _this.lastId + ']');
                // @ts-ignore
                for (var _i = 0, elements_3 = elements; _i < elements_3.length; _i++) {
                    var selection = elements_3[_i];
                    selection.classList.remove('highlight');
                }
            }
        };
        document.body.addEventListener('keydown', function (e) {
            var elements = document.querySelectorAll('[data-res-id=' + _this.lastId + ']');
            // @ts-ignore
            e = e || window.event;
            var key = e.which || e.keyCode; // keyCode detection
            var ctrl = e.ctrlKey ? e.ctrlKey : ((key === 17)); // ctrl detection
            if (key === 67 && ctrl) {
                var textToPaste = '';
                var textDict = {};
                var row = '';
                // tslint:disable-next-line:forin
                // @ts-ignore
                for (var _i = 0, elements_4 = elements; _i < elements_4.length; _i++) {
                    var selection = elements_4[_i];
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
                var flag = void 0;
                for (var textRow in textDict) {
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
                    var dummy = document.createElement('textarea');
                    document.body.appendChild(dummy);
                    dummy.value = textToPaste;
                    dummy.select();
                    document.execCommand('copy');
                    document.body.removeChild(dummy);
                    var evt = new CustomEvent('onHighlightSelection', { detail: { text: textToPaste, eventType: 'highlight selection' } });
                    window.dispatchEvent(evt);
                }
            }
        }, false);
    };
    return SelectionModel;
}());



/***/ }),

/***/ "./src/lib/sequenceInfoModel.ts":
/*!**************************************!*\
  !*** ./src/lib/sequenceInfoModel.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SequenceInfoModel": () => (/* binding */ SequenceInfoModel)
/* harmony export */ });
var SequenceInfoModel = /** @class */ (function () {
    function SequenceInfoModel() {
        this.isHTML = function (str) {
            var fragment = document.createRange().createContextualFragment(str);
            // remove all non text nodes from fragment
            fragment.querySelectorAll('*').forEach(function (el) { return el.parentNode.removeChild(el); });
            // if there is textContent, then not a pure HTML
            return !(fragment.textContent || '').trim();
        };
    }
    SequenceInfoModel.prototype.process = function (regions, sequences) {
        var labels = [];
        var startIndexes = [];
        var tooltips = [];
        var flag;
        sequences.sort(function (a, b) { return a.id - b.id; });
        for (var _i = 0, sequences_1 = sequences; _i < sequences_1.length; _i++) {
            var seq = sequences_1[_i];
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
    };
    return SequenceInfoModel;
}());



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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ProSeqViewer": () => (/* reexport safe */ _lib_proseqviewer__WEBPACK_IMPORTED_MODULE_0__.ProSeqViewer)
/* harmony export */ });
/* harmony import */ var _lib_proseqviewer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/proseqviewer */ "./src/lib/proseqviewer.ts");



})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wcm9zZXF2aWV3ZXIvLi9zcmMvbGliL2NvbG9ycy5tb2RlbC50cyIsIndlYnBhY2s6Ly9wcm9zZXF2aWV3ZXIvLi9zcmMvbGliL2NvbnNlbnN1cy5tb2RlbC50cyIsIndlYnBhY2s6Ly9wcm9zZXF2aWV3ZXIvLi9zcmMvbGliL2V2ZW50cy5tb2RlbC50cyIsIndlYnBhY2s6Ly9wcm9zZXF2aWV3ZXIvLi9zcmMvbGliL2ljb25zLm1vZGVsLnRzIiwid2VicGFjazovL3Byb3NlcXZpZXdlci8uL3NyYy9saWIvaWNvbnMudHMiLCJ3ZWJwYWNrOi8vcHJvc2Vxdmlld2VyLy4vc3JjL2xpYi9vcHRpb25zLm1vZGVsLnRzIiwid2VicGFjazovL3Byb3NlcXZpZXdlci8uL3NyYy9saWIvcGFsZXR0ZXMudHMiLCJ3ZWJwYWNrOi8vcHJvc2Vxdmlld2VyLy4vc3JjL2xpYi9wYXR0ZXJucy5tb2RlbC50cyIsIndlYnBhY2s6Ly9wcm9zZXF2aWV3ZXIvLi9zcmMvbGliL3Byb3NlcXZpZXdlci50cyIsIndlYnBhY2s6Ly9wcm9zZXF2aWV3ZXIvLi9zcmMvbGliL3Jvd3MubW9kZWwudHMiLCJ3ZWJwYWNrOi8vcHJvc2Vxdmlld2VyLy4vc3JjL2xpYi9zZWxlY3Rpb24ubW9kZWwudHMiLCJ3ZWJwYWNrOi8vcHJvc2Vxdmlld2VyLy4vc3JjL2xpYi9zZXF1ZW5jZUluZm9Nb2RlbC50cyIsIndlYnBhY2s6Ly9wcm9zZXF2aWV3ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcHJvc2Vxdmlld2VyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9wcm9zZXF2aWV3ZXIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9wcm9zZXF2aWV3ZXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wcm9zZXF2aWV3ZXIvLi9z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QUFrSDtBQUNsSCwwUEFBMFA7QUFDMVA7QUFDQTtBQUNBLENBQUM7QUFDZ0I7Ozs7Ozs7Ozs7Ozs7OztBQ1pqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdEO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ3VCOzs7Ozs7Ozs7Ozs7Ozs7QUMzSnhCO0FBQ0E7QUFDQTtBQUNBO0FB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QTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7Ozs7Ozs7Ozs7QUNOa0Q7QUFDMUIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQ29sb3JzTW9kZWwgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29sb3JzTW9kZWwoKSB7XG4gICAgfVxuICAgIENvbG9yc01vZGVsLmdldFJvd3NMaXN0ID0gZnVuY3Rpb24gKGNvbG9yaW5nKSB7XG4gICAgICAgIHZhciBvdXRDb2wgPSB0aGlzLnBhbGV0dGVbY29sb3JpbmddO1xuICAgICAgICBpZiAoIW91dENvbCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvdXRDb2wpO1xuICAgIH07XG4gICAgQ29sb3JzTW9kZWwuZ2V0UG9zaXRpb25zID0gZnVuY3Rpb24gKGNvbG9yaW5nLCByb3dOdW0pIHtcbiAgICAgICAgdmFyIG91dENvbDtcbiAgICAgICAgb3V0Q29sID0gdGhpcy5wYWxldHRlW2NvbG9yaW5nXTtcbiAgICAgICAgaWYgKCFvdXRDb2wpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICBvdXRDb2wgPSBvdXRDb2xbcm93TnVtXTtcbiAgICAgICAgaWYgKCFvdXRDb2wpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICBvdXRDb2wgPSBvdXRDb2wucG9zaXRpb25zO1xuICAgICAgICBpZiAoIW91dENvbCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRDb2w7XG4gICAgfTtcbiAgICBDb2xvcnNNb2RlbC5wcm90b3R5cGUucHJvY2VzcyA9IGZ1bmN0aW9uIChhbGxJbnB1dHMpIHtcbiAgICAgICAgaWYgKCFhbGxJbnB1dHMucmVnaW9ucykge1xuICAgICAgICAgICAgYWxsSW5wdXRzLnJlZ2lvbnMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWxsSW5wdXRzLm9wdGlvbnMgJiYgIWFsbElucHV0cy5vcHRpb25zLnNlcXVlbmNlQ29sb3IpIHtcbiAgICAgICAgICAgIHZhciBzZXF1ZW5jZUNvbG9yUmVnaW9ucyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IGFsbElucHV0cy5zZXF1ZW5jZXM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlcXVlbmNlID0gX2FbX2ldO1xuICAgICAgICAgICAgICAgIGlmIChzZXF1ZW5jZS5zZXF1ZW5jZUNvbG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgc2VxdWVuY2VDb2xvclJlZ2lvbnMucHVzaCh7IHNlcXVlbmNlSWQ6IHNlcXVlbmNlLmlkLCBzdGFydDogMSwgZW5kOiBzZXF1ZW5jZS5zZXF1ZW5jZS5sZW5ndGgsIHNlcXVlbmNlQ29sb3I6IHNlcXVlbmNlLnNlcXVlbmNlQ29sb3IgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgX2IgPSAwLCBfYyA9IGFsbElucHV0cy5yZWdpb25zOyBfYiA8IF9jLmxlbmd0aDsgX2IrKykge1xuICAgICAgICAgICAgICAgIHZhciByZWcgPSBfY1tfYl07XG4gICAgICAgICAgICAgICAgaWYgKCFyZWcuYmFja2dyb3VuZENvbG9yICYmIHJlZy5zZXF1ZW5jZUlkICE9PSAtOTk5OTk5OTk5OTk5OTgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VxdWVuY2VDb2xvclJlZ2lvbnMucHVzaChyZWcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZXF1ZW5jZUNvbG9yUmVnaW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgYWxsSW5wdXRzLnJlZ2lvbnMgPSBzZXF1ZW5jZUNvbG9yUmVnaW9ucztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgYWxsUmVnaW9ucyA9IEFycmF5LnByb3RvdHlwZS5jb25jYXQoYWxsSW5wdXRzLmljb25zLCBhbGxJbnB1dHMucmVnaW9ucywgYWxsSW5wdXRzLnBhdHRlcm5zKTsgLy8gb3JkZXJpbmdcbiAgICAgICAgdmFyIG5ld1JlZ2lvbnMgPSB0aGlzLmZpeE1pc3NpbmdJZHMoYWxsUmVnaW9ucywgYWxsSW5wdXRzLnNlcXVlbmNlcyk7XG4gICAgICAgIG5ld1JlZ2lvbnMgPSB0aGlzLnRyYW5zZm9ybUlucHV0KGFsbFJlZ2lvbnMsIG5ld1JlZ2lvbnMsIGFsbElucHV0cy5zZXF1ZW5jZXMsIGFsbElucHV0cy5vcHRpb25zKTtcbiAgICAgICAgdGhpcy50cmFuc2Zvcm1Db2xvcnMoYWxsSW5wdXRzLm9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gbmV3UmVnaW9ucztcbiAgICB9O1xuICAgIC8vIHRyYW5zZm9ybSBpbnB1dCBzdHJ1Y3R1cmVcbiAgICBDb2xvcnNNb2RlbC5wcm90b3R5cGUudHJhbnNmb3JtSW5wdXQgPSBmdW5jdGlvbiAocmVnaW9ucywgbmV3UmVnaW9ucywgc2VxdWVuY2VzLCBnbG9iYWxDb2xvcikge1xuICAgICAgICAvLyBpZiBkb24ndCByZWNlaXZlIG5ldyBjb2xvcnMsIGtlZXAgb2xkIGNvbG9yc1xuICAgICAgICBpZiAoIXJlZ2lvbnMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBpZiByZWNlaXZlIG5ldyBjb2xvcnMsIGNoYW5nZSB0aGVtXG4gICAgICAgIENvbG9yc01vZGVsLnBhbGV0dGUgPSB7fTtcbiAgICAgICAgdmFyIGluZm87XG4gICAgICAgIGlmICghZ2xvYmFsQ29sb3IpIHtcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgc2VxdWVuY2VzXzEgPSBzZXF1ZW5jZXM7IF9pIDwgc2VxdWVuY2VzXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlcSA9IHNlcXVlbmNlc18xW19pXTtcbiAgICAgICAgICAgICAgICB2YXIgcmVnID0geyBzZXF1ZW5jZUlkOiBzZXEuaWQsIGJhY2tncm91bmRDb2xvcjogJycsIHN0YXJ0OiAxLCBlbmQ6IHNlcS5zZXF1ZW5jZS5sZW5ndGgsIHNlcXVlbmNlQ29sb3I6ICcnIH07XG4gICAgICAgICAgICAgICAgaWYgKHNlcS5zZXF1ZW5jZUNvbG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlZy5iYWNrZ3JvdW5kQ29sb3IgPSBzZXEuc2VxdWVuY2VDb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgcmVnLnNlcXVlbmNlQ29sb3IgPSBzZXEuc2VxdWVuY2VDb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgaW5mbyA9IHRoaXMuc2V0U2VxdWVuY2VDb2xvcihyZWcsIHNlcSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBfbG9vcF8xID0gZnVuY3Rpb24gKHJlZykge1xuICAgICAgICAgICAgdmFyIHNlcXVlbmNlQ29sb3IgPSB2b2lkIDA7XG4gICAgICAgICAgICBpZiAocmVnLmljb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJjb250aW51ZVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlcXVlbmNlcy5maW5kKGZ1bmN0aW9uICh4KSB7IHJldHVybiB4LmlkID09PSByZWcuc2VxdWVuY2VJZDsgfSkpIHtcbiAgICAgICAgICAgICAgICBzZXF1ZW5jZUNvbG9yID0gc2VxdWVuY2VzLmZpbmQoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHguaWQgPT09IHJlZy5zZXF1ZW5jZUlkOyB9KS5zZXF1ZW5jZUNvbG9yO1xuICAgICAgICAgICAgICAgIGlmIChzZXF1ZW5jZUNvbG9yICYmICFnbG9iYWxDb2xvcikge1xuICAgICAgICAgICAgICAgICAgICAvLyBzZXF1ZW5jZUNvbG9yIGlzIHNldC4gQ2Fubm90IHNldCBiYWNrZ3JvdW5kQ29sb3JcbiAgICAgICAgICAgICAgICAgICAgcmVnLnNlcXVlbmNlQ29sb3IgPSBzZXF1ZW5jZUNvbG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGluZm8gPSB0aGlzXzEucHJvY2Vzc0NvbG9yKHJlZyk7XG4gICAgICAgICAgICBpZiAoaW5mbyA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJjb250aW51ZVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgQ29sb3JzTW9kZWwucGFsZXR0ZVtpbmZvLnR5cGVdW2luZm8uc2VxdWVuY2VJZF0ucG9zaXRpb25zXG4gICAgICAgICAgICAgICAgLnB1c2goeyBzdGFydDogcmVnLnN0YXJ0LCBlbmQ6IHJlZy5lbmQsIHRhcmdldDogaW5mby5sZXR0ZXJTdHlsZSB9KTtcbiAgICAgICAgICAgIGlmIChzZXF1ZW5jZUNvbG9yICYmIHNlcXVlbmNlQ29sb3IuaW5jbHVkZXMoJ2JpbmFyeScpKSB7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgIENvbG9yc01vZGVsLnBhbGV0dGVbaW5mby50eXBlXS5iaW5hcnlDb2xvcnMgPSB0aGlzXzEuZ2V0QmluYXJ5Q29sb3JzKHNlcXVlbmNlQ29sb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB2YXIgdGhpc18xID0gdGhpcztcbiAgICAgICAgLy8gb3ZlcndyaXRlIHJlZ2lvbiBjb2xvciBpZiBzZXF1ZW5jZUNvbG9yIGlzIHNldFxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGZvciAodmFyIF9hID0gMCwgbmV3UmVnaW9uc18xID0gbmV3UmVnaW9uczsgX2EgPCBuZXdSZWdpb25zXzEubGVuZ3RoOyBfYSsrKSB7XG4gICAgICAgICAgICB2YXIgcmVnID0gbmV3UmVnaW9uc18xW19hXTtcbiAgICAgICAgICAgIF9sb29wXzEocmVnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3UmVnaW9ucztcbiAgICB9O1xuICAgIENvbG9yc01vZGVsLnByb3RvdHlwZS5zZXRTZXF1ZW5jZUNvbG9yID0gZnVuY3Rpb24gKHJlZywgc2VxKSB7XG4gICAgICAgIHZhciBpbmZvO1xuICAgICAgICBpbmZvID0gdGhpcy5wcm9jZXNzQ29sb3IocmVnKTtcbiAgICAgICAgQ29sb3JzTW9kZWwucGFsZXR0ZVtpbmZvLnR5cGVdW2luZm8uc2VxdWVuY2VJZF0ucG9zaXRpb25zXG4gICAgICAgICAgICAucHVzaCh7IHN0YXJ0OiByZWcuc3RhcnQsIGVuZDogcmVnLmVuZCwgdGFyZ2V0OiBpbmZvLmxldHRlclN0eWxlIH0pO1xuICAgICAgICBpZiAoc2VxLnNlcXVlbmNlQ29sb3IuaW5jbHVkZXMoJ2JpbmFyeScpKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBDb2xvcnNNb2RlbC5wYWxldHRlW2luZm8udHlwZV0uYmluYXJ5Q29sb3JzID0gdGhpcy5nZXRCaW5hcnlDb2xvcnMoc2VxLnNlcXVlbmNlQ29sb3IpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbmZvO1xuICAgIH07XG4gICAgQ29sb3JzTW9kZWwucHJvdG90eXBlLmZpeE1pc3NpbmdJZHMgPSBmdW5jdGlvbiAocmVnaW9ucywgc2VxdWVuY2VzKSB7XG4gICAgICAgIHZhciBuZXdSZWdpb25zID0gW107XG4gICAgICAgIHZhciBfbG9vcF8yID0gZnVuY3Rpb24gKHJlZykge1xuICAgICAgICAgICAgaWYgKCFyZWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJjb250aW51ZVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlcXVlbmNlcy5maW5kKGZ1bmN0aW9uICh4KSB7IHJldHVybiB4LmlkID09PSByZWcuc2VxdWVuY2VJZDsgfSkpIHtcbiAgICAgICAgICAgICAgICBuZXdSZWdpb25zLnB1c2gocmVnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIF9hID0gMCwgc2VxdWVuY2VzXzIgPSBzZXF1ZW5jZXM7IF9hIDwgc2VxdWVuY2VzXzIubGVuZ3RoOyBfYSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzZXEgPSBzZXF1ZW5jZXNfMltfYV07XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdSZWcgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmZvcmluXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiByZWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWdba2V5XSAhPT0gJ3NlcXVlbmNlSWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3UmVnW2tleV0gPSByZWdba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1JlZ1snc2VxdWVuY2VJZCddID0gc2VxLmlkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5ld1JlZ2lvbnMucHVzaChuZXdSZWcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCByZWdpb25zXzEgPSByZWdpb25zOyBfaSA8IHJlZ2lvbnNfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciByZWcgPSByZWdpb25zXzFbX2ldO1xuICAgICAgICAgICAgX2xvb3BfMihyZWcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdSZWdpb25zO1xuICAgIH07XG4gICAgQ29sb3JzTW9kZWwucHJvdG90eXBlLnRyYW5zZm9ybUNvbG9ycyA9IGZ1bmN0aW9uIChvcHQpIHtcbiAgICAgICAgdmFyIHNlcXVlbmNlQ29sb3IgPSBvcHQuc2VxdWVuY2VDb2xvcjtcbiAgICAgICAgdmFyIGFyckNvbG9ycztcbiAgICAgICAgdmFyIG47XG4gICAgICAgIHZhciBjO1xuICAgICAgICBmb3IgKHZhciB0eXBlIGluIENvbG9yc01vZGVsLnBhbGV0dGUpIHtcbiAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2dyYWRpZW50Jzoge1xuICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Zm9yaW5cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcm93IGluIENvbG9yc01vZGVsLnBhbGV0dGVbdHlwZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgPSBDb2xvcnNNb2RlbC5wYWxldHRlW3R5cGVdW3Jvd107XG4gICAgICAgICAgICAgICAgICAgICAgICBuID0gYy5wb3NpdGlvbnMubGVuZ3RoICsgYy5jaGFycy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJDb2xvcnMgPSB0aGlzLmdyYWRpZW50KG4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYy5wb3NpdGlvbnMuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gKGEuc3RhcnQgPiBiLnN0YXJ0KSA/IDEgOiAtMTsgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gYy5wb3NpdGlvbnM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBfYVtfaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5iYWNrZ3JvdW5kQ29sb3IgPSBhcnJDb2xvcnMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgJ2JpbmFyeSc6IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmZvcmluXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHJvdyBpbiBDb2xvcnNNb2RlbC5wYWxldHRlW3R5cGVdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93ID09PSAnYmluYXJ5Q29sb3JzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYyA9IENvbG9yc01vZGVsLnBhbGV0dGVbdHlwZV1bcm93XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG4gPSBjLnBvc2l0aW9ucy5sZW5ndGggKyBjLmNoYXJzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyckNvbG9ycyA9IHRoaXMuYmluYXJ5KG4sIENvbG9yc01vZGVsLnBhbGV0dGVbdHlwZV0uYmluYXJ5Q29sb3JzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMucG9zaXRpb25zLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIChhLnN0YXJ0ID4gYi5zdGFydCkgPyAxIDogLTE7IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgX2IgPSAwLCBfYyA9IGMucG9zaXRpb25zOyBfYiA8IF9jLmxlbmd0aDsgX2IrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlID0gX2NbX2JdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuYmFja2dyb3VuZENvbG9yID0gYXJyQ29sb3JzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlIHNlcXVlbmNlQ29sb3I6IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmZvcmluXG4gICAgICAgICAgICAgICAgICAgIC8vIENvbG9yc01vZGVsLnBhbGV0dGVbdHlwZV06IGFuIG9iaiB3aXRoIHJlZ2lvbnMgYW5kIGNvbG9yIGFzc29jaWF0ZWQgZXMuIHBvc2l0aW9uczogMS0yMDAsIHphcHBvXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHJvdyBpbiBDb2xvcnNNb2RlbC5wYWxldHRlW3R5cGVdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjID0gQ29sb3JzTW9kZWwucGFsZXR0ZVt0eXBlXVtyb3ddO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGMucG9zaXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBfZCA9IDAsIF9lID0gYy5wb3NpdGlvbnM7IF9kIDwgX2UubGVuZ3RoOyBfZCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb3MgPSBfZVtfZF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcy5iYWNrZ3JvdW5kQ29sb3IgPSBzZXF1ZW5jZUNvbG9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIENvbG9yc01vZGVsLnByb3RvdHlwZS5wcm9jZXNzQ29sb3IgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgcmVzdWx0ID0geyB0eXBlOiAnY3VzdG9tJywgc2VxdWVuY2VJZDogLTEsIGxldHRlclN0eWxlOiAnJyB9O1xuICAgICAgICAvLyBjaGVjayBpZiByb3cga2V5IGlzIGEgbnVtYmVyXG4gICAgICAgIGlmIChlLnNlcXVlbmNlSWQgPT09IHVuZGVmaW5lZCB8fCBpc05hTigrZS5zZXF1ZW5jZUlkKSkge1xuICAgICAgICAgICAgLy8gd3JvbmcgZW50aXR5IHJvdyBrZXlcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQuc2VxdWVuY2VJZCA9ICtlLnNlcXVlbmNlSWQ7XG4gICAgICAgIC8vIHRyYW5zZm9ybSB0YXJnZXQgaW4gQ1NTIHByb3BlcnR5XG4gICAgICAgIGlmIChlLmNvbG9yKSB7XG4gICAgICAgICAgICByZXN1bHQubGV0dGVyU3R5bGUgPSBcImNvbG9yOlwiICsgZS5jb2xvciArIFwiO1wiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlLmJhY2tncm91bmRDb2xvcikge1xuICAgICAgICAgICAgcmVzdWx0LmxldHRlclN0eWxlICs9IFwiYmFja2dyb3VuZC1jb2xvcjpcIiArIGUuYmFja2dyb3VuZENvbG9yICsgXCI7XCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGUuYmFja2dyb3VuZEltYWdlKSB7XG4gICAgICAgICAgICByZXN1bHQubGV0dGVyU3R5bGUgKz0gXCJiYWNrZ3JvdW5kLWltYWdlOiBcIiArIGUuYmFja2dyb3VuZEltYWdlICsgXCI7XCI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZGVmaW5lIGNvbG9yIG9yIHBhbGV0dGVcbiAgICAgICAgaWYgKGUuc2VxdWVuY2VDb2xvcikge1xuICAgICAgICAgICAgcmVzdWx0LnR5cGUgPSBlLnNlcXVlbmNlQ29sb3I7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdC50eXBlLmluY2x1ZGVzKCdiaW5hcnknKSkge1xuICAgICAgICAgICAgcmVzdWx0LnR5cGUgPSAnYmluYXJ5JztcbiAgICAgICAgfVxuICAgICAgICAvLyByZXNlcnZpbmcgc3BhY2UgZm9yIHRoZSB0cmFuc2Zvcm1lZCBvYmplY3QgKHRoaXMucGFsZXR0ZSlcbiAgICAgICAgLy8gaWYgY29sb3IgdHlwZSBub3QgaW5zZXJ0ZWQgeWV0XG4gICAgICAgIGlmICghKHJlc3VsdC50eXBlIGluIENvbG9yc01vZGVsLnBhbGV0dGUpKSB7XG4gICAgICAgICAgICBDb2xvcnNNb2RlbC5wYWxldHRlW3Jlc3VsdC50eXBlXSA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIC8vIGlmIHJvdyBub3QgaW5zZXJ0ZWQgeWV0XG4gICAgICAgIGlmICghKHJlc3VsdC5zZXF1ZW5jZUlkIGluIENvbG9yc01vZGVsLnBhbGV0dGVbcmVzdWx0LnR5cGVdKSkge1xuICAgICAgICAgICAgQ29sb3JzTW9kZWwucGFsZXR0ZVtyZXN1bHQudHlwZV1bcmVzdWx0LnNlcXVlbmNlSWRdID0geyBwb3NpdGlvbnM6IFtdLCBjaGFyczogW10gfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gICAgQ29sb3JzTW9kZWwucHJvdG90eXBlLmdyYWRpZW50ID0gZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbmx5U3BhY2VkQ29sb3JzKG4pO1xuICAgIH07XG4gICAgQ29sb3JzTW9kZWwucHJvdG90eXBlLmdldEJpbmFyeUNvbG9ycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNvbG9yMSA9ICcjOTNFMUQ4JztcbiAgICAgICAgdmFyIGNvbG9yMiA9ICcjRkZBNjlFJztcbiAgICAgICAgcmV0dXJuIFtjb2xvcjEsIGNvbG9yMl07XG4gICAgfTtcbiAgICBDb2xvcnNNb2RlbC5wcm90b3R5cGUuYmluYXJ5ID0gZnVuY3Rpb24gKG4sIGJpbmFyeUNvbG9ycykge1xuICAgICAgICB2YXIgcmVnID0gMDtcbiAgICAgICAgdmFyIGZsYWc7XG4gICAgICAgIHZhciBhcnJDb2xvcnMgPSBbXTtcbiAgICAgICAgd2hpbGUgKHJlZyA8IG4pIHtcbiAgICAgICAgICAgIGlmIChmbGFnKSB7XG4gICAgICAgICAgICAgICAgYXJyQ29sb3JzLnB1c2goYmluYXJ5Q29sb3JzWzBdKTtcbiAgICAgICAgICAgICAgICBmbGFnID0gIWZsYWc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBhcnJDb2xvcnMucHVzaChiaW5hcnlDb2xvcnNbMV0pO1xuICAgICAgICAgICAgICAgIGZsYWcgPSAhZmxhZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlZyArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnJDb2xvcnM7XG4gICAgfTtcbiAgICBDb2xvcnNNb2RlbC5wcm90b3R5cGUuZXZlbmx5U3BhY2VkQ29sb3JzID0gZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgLyoqIGhvdyB0byBnbyBhcm91bmQgdGhlIHJnYiB3aGVlbCAqL1xuICAgICAgICAvKiogYWRkIHRvIG5leHQgcmdiIGNvbXBvbmVudCwgc3VidHJhY3QgdG8gcHJldmlvdXMgKi9cbiAgICAgICAgLyoqICBleC46IDI1NSwwLDAgLShhZGQpLT4gMjU1LDI1NSwwIC0oc3VidHJhY3QpLT4gMCwyNTUsMCAqL1xuICAgICAgICAvLyBzdGFydGluZyBjb2xvcjogcmVkXG4gICAgICAgIHZhciByZ2IgPSBbMjU1LCAwLCAwXTtcbiAgICAgICAgLy8gMTUzNiBjb2xvcnMgaW4gdGhlIHJnYiB3aGVlbFxuICAgICAgICB2YXIgZGVsdGEgPSBNYXRoLmZsb29yKDE1MzYgLyBuKTtcbiAgICAgICAgdmFyIHJlbWFpbmRlcjtcbiAgICAgICAgdmFyIGFkZCA9IHRydWU7XG4gICAgICAgIHZhciB2YWx1ZSA9IDA7XG4gICAgICAgIHZhciB0bXA7XG4gICAgICAgIHZhciBjb2xvcnMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHJlbWFpbmRlciA9IGRlbHRhO1xuICAgICAgICAgICAgd2hpbGUgKHJlbWFpbmRlciA+IDApIHtcbiAgICAgICAgICAgICAgICBpZiAoYWRkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRtcCA9ICgoKHZhbHVlICsgMSkgJSAzKSArIDMpICUgMztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJnYlt0bXBdICsgcmVtYWluZGVyID4gMjU1KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW1haW5kZXIgLT0gKDI1NSAtIHJnYlt0bXBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJnYlt0bXBdID0gMjU1O1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRtcDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJnYlt0bXBdICs9IHJlbWFpbmRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbWFpbmRlciA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRtcCA9ICgoKHZhbHVlIC0gMSkgJSAzKSArIDMpICUgMztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJnYlt0bXBdIC0gcmVtYWluZGVyIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVtYWluZGVyIC09IHJnYlt0bXBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmdiW3RtcF0gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJnYlt0bXBdIC09IHJlbWFpbmRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbWFpbmRlciA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb2xvcnMucHVzaCgncmdiYSgnICsgcmdiWzBdICsgJywnICsgcmdiWzFdICsgJywnICsgcmdiWzJdICsgJywgMC40KScpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2xvcnM7XG4gICAgfTtcbiAgICByZXR1cm4gQ29sb3JzTW9kZWw7XG59KCkpO1xuZXhwb3J0IHsgQ29sb3JzTW9kZWwgfTtcbiIsImltcG9ydCB7IFBhbGV0dGVzIH0gZnJvbSAnLi9wYWxldHRlcyc7XG52YXIgQ29uc2Vuc3VzTW9kZWwgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29uc2Vuc3VzTW9kZWwoKSB7XG4gICAgfVxuICAgIENvbnNlbnN1c01vZGVsLnNldENvbnNlbnN1c0luZm8gPSBmdW5jdGlvbiAodHlwZSwgc2VxdWVuY2VzKSB7XG4gICAgICAgIHZhciBpZElkZW50aXR5ID0gLTk5OTk5OTk5OTk5OTk5O1xuICAgICAgICB2YXIgaWRQaHlzaWNhbCA9IC05OTk5OTk5OTk5OTk5ODtcbiAgICAgICAgdmFyIGNvbnNlbnN1c0luZm8gPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZXF1ZW5jZXNbMF0uc2VxdWVuY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjb25zZW5zdXNDb2x1bW4gPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgc2VxdWVuY2VzXzEgPSBzZXF1ZW5jZXM7IF9pIDwgc2VxdWVuY2VzXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlcXVlbmNlID0gc2VxdWVuY2VzXzFbX2ldO1xuICAgICAgICAgICAgICAgIHZhciBsZXR0ZXIgPSBzZXF1ZW5jZS5zZXF1ZW5jZVtpXTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gJ3BoeXNpY2FsJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VxdWVuY2UuaWQgPT09IGlkSWRlbnRpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChsZXR0ZXIgaW4gUGFsZXR0ZXMuY29uc2Vuc3VzQWFMZXNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXIgPSBQYWxldHRlcy5jb25zZW5zdXNBYUxlc2tbbGV0dGVyXVswXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlcXVlbmNlLmlkID09PSBpZFBoeXNpY2FsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobGV0dGVyID09PSAnLScgfHwgIWxldHRlcikge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNvbnNlbnN1c0NvbHVtbltsZXR0ZXJdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNlbnN1c0NvbHVtbltsZXR0ZXJdICs9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zZW5zdXNDb2x1bW5bbGV0dGVyXSA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc2Vuc3VzSW5mby5wdXNoKGNvbnNlbnN1c0NvbHVtbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbnNlbnN1c0luZm87XG4gICAgfTtcbiAgICBDb25zZW5zdXNNb2RlbC5jcmVhdGVDb25zZW5zdXMgPSBmdW5jdGlvbiAodHlwZSwgY29uc2Vuc3VzLCBjb25zZW5zdXMyLCBzZXF1ZW5jZXMsIHJlZ2lvbnMsIHRocmVzaG9sZCwgcGFsZXR0ZSkge1xuICAgICAgICBpZiAodGhyZXNob2xkIDwgNTApIHtcbiAgICAgICAgICAgIHRocmVzaG9sZCA9IDEwMCAtIHRocmVzaG9sZDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaWQgPSAtOTk5OTk5OTk5OTk5OTk7XG4gICAgICAgIHZhciBsYWJlbDtcbiAgICAgICAgaWYgKHR5cGUgPT09ICdwaHlzaWNhbCcpIHtcbiAgICAgICAgICAgIGxhYmVsID0gJ0NvbnNlbnN1cyBwaHlzaWNhbCAnICsgdGhyZXNob2xkICsgJyUnO1xuICAgICAgICAgICAgaWQgPSAtOTk5OTk5OTk5OTk5OTg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsYWJlbCA9ICdDb25zZW5zdXMgaWRlbnRpdHkgJyArIHRocmVzaG9sZCArICclJztcbiAgICAgICAgfVxuICAgICAgICB2YXIgY29uc2Vuc3VzU2VxdWVuY2UgPSAnJztcbiAgICAgICAgdmFyIF9sb29wXzEgPSBmdW5jdGlvbiAoY29sdW1uKSB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iLCBfYztcbiAgICAgICAgICAgIHZhciBtYXhMZXR0ZXIgPSB2b2lkIDA7XG4gICAgICAgICAgICB2YXIgbWF4SW5kZXggPSB2b2lkIDA7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoY29uc2Vuc3VzW2NvbHVtbl0pLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIG1heExldHRlciA9ICcuJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG1heExldHRlciA9IE9iamVjdC5rZXlzKGNvbnNlbnN1c1tjb2x1bW5dKS5yZWR1Y2UoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnNlbnN1c1tjb2x1bW5dW2FdID4gY29uc2Vuc3VzW2NvbHVtbl1bYl0gPyBhIDogYjtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBtYXhJbmRleCA9IGNvbnNlbnN1c1tjb2x1bW5dW21heExldHRlcl07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYmFja2dyb3VuZENvbG9yID0gdm9pZCAwO1xuICAgICAgICAgICAgdmFyIGNvbG9yID0gdm9pZCAwO1xuICAgICAgICAgICAgdmFyIGZyZXF1ZW5jeSA9IChtYXhJbmRleCAvIHNlcXVlbmNlcy5sZW5ndGgpICogMTAwO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdwaHlzaWNhbCcpIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zZW5zdXMgaWQgdG8gc2VlIGlmIEkgaGF2ZSBhbGwgbGV0dGVycyBlcXVhbHNcbiAgICAgICAgICAgICAgICAvLyBlcXVhbHMgbGV0dGVycyBoYXZlIHByZWNlZGVuY2Ugb3ZlciBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgdmFyIG1heExldHRlcklkID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgIHZhciBtYXhJbmRleElkID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhjb25zZW5zdXNbY29sdW1uXSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG1heExldHRlcklkID0gJy4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4TGV0dGVySWQgPSBPYmplY3Qua2V5cyhjb25zZW5zdXMyW2NvbHVtbl0pLnJlZHVjZShmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnNlbnN1czJbY29sdW1uXVthXSA+IGNvbnNlbnN1czJbY29sdW1uXVtiXSA/IGEgOiBiO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgbWF4SW5kZXhJZCA9IGNvbnNlbnN1czJbY29sdW1uXVttYXhMZXR0ZXJJZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBmcmVxdWVuY3lJZCA9IChtYXhJbmRleElkIC8gc2VxdWVuY2VzLmxlbmd0aCkgKiAxMDA7XG4gICAgICAgICAgICAgICAgaWYgKGZyZXF1ZW5jeUlkID49IHRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgICAgICBtYXhMZXR0ZXIgPSBtYXhMZXR0ZXJJZDtcbiAgICAgICAgICAgICAgICAgICAgX2EgPSBDb25zZW5zdXNNb2RlbC5zZXRDb2xvcnNJZGVudGl0eShmcmVxdWVuY3lJZCwgcGFsZXR0ZSwgJ3BoeXNpY2FsJyksIGJhY2tncm91bmRDb2xvciA9IF9hWzBdLCBjb2xvciA9IF9hWzFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZyZXF1ZW5jeSA+PSB0aHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9iID0gQ29uc2Vuc3VzTW9kZWwuc2V0Q29sb3JzUGh5c2ljYWwobWF4TGV0dGVyLCBwYWxldHRlKSwgYmFja2dyb3VuZENvbG9yID0gX2JbMF0sIGNvbG9yID0gX2JbMV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBfYyA9IENvbnNlbnN1c01vZGVsLnNldENvbG9yc0lkZW50aXR5KGZyZXF1ZW5jeSwgcGFsZXR0ZSwgJ2lkZW50aXR5JyksIGJhY2tncm91bmRDb2xvciA9IF9jWzBdLCBjb2xvciA9IF9jWzFdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZyZXF1ZW5jeSA8IHRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgIG1heExldHRlciA9ICcuJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vICsgMSBiZWNhdXNlIHJlc2lkdWVzIHN0YXJ0IGZyb20gMSBhbmQgbm90IDBcbiAgICAgICAgICAgIHJlZ2lvbnMucHVzaCh7IHN0YXJ0OiArY29sdW1uICsgMSwgZW5kOiArY29sdW1uICsgMSwgc2VxdWVuY2VJZDogaWQsIGJhY2tncm91bmRDb2xvcjogYmFja2dyb3VuZENvbG9yLCBjb2xvcjogY29sb3IgfSk7XG4gICAgICAgICAgICBjb25zZW5zdXNTZXF1ZW5jZSArPSBtYXhMZXR0ZXI7XG4gICAgICAgIH07XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpmb3JpblxuICAgICAgICBmb3IgKHZhciBjb2x1bW4gaW4gY29uc2Vuc3VzKSB7XG4gICAgICAgICAgICBfbG9vcF8xKGNvbHVtbik7XG4gICAgICAgIH1cbiAgICAgICAgc2VxdWVuY2VzLnB1c2goeyBpZDogaWQsIHNlcXVlbmNlOiBjb25zZW5zdXNTZXF1ZW5jZSwgbGFiZWw6IGxhYmVsIH0pO1xuICAgICAgICByZXR1cm4gW3NlcXVlbmNlcywgcmVnaW9uc107XG4gICAgfTtcbiAgICBDb25zZW5zdXNNb2RlbC5zZXRDb2xvcnNJZGVudGl0eSA9IGZ1bmN0aW9uIChmcmVxdWVuY3ksIHBhbGV0dGUsIGZsYWcpIHtcbiAgICAgICAgdmFyIGJhY2tncm91bmRDb2xvcjtcbiAgICAgICAgdmFyIGNvbG9yO1xuICAgICAgICB2YXIgZmluYWxQYWxldHRlO1xuICAgICAgICBpZiAocGFsZXR0ZSAmJiB0eXBlb2YgcGFsZXR0ZSAhPT0gJ3N0cmluZycgJiYgZmxhZyA9PSAnaWRlbnRpdHknKSB7XG4gICAgICAgICAgICBmaW5hbFBhbGV0dGUgPSBwYWxldHRlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZmluYWxQYWxldHRlID0gUGFsZXR0ZXMuY29uc2Vuc3VzTGV2ZWxzSWRlbnRpdHk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN0ZXBzID0gW107XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBmaW5hbFBhbGV0dGUpIHtcbiAgICAgICAgICAgIHN0ZXBzLnB1c2goK2tleSk7IC8vIDQyXG4gICAgICAgIH1cbiAgICAgICAgc3RlcHMgPSBzdGVwcy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhIDwgYiA/IDEgOiBhID4gYiA/IC0xIDogMDsgfSk7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgc3RlcHNfMSA9IHN0ZXBzOyBfaSA8IHN0ZXBzXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgc3RlcCA9IHN0ZXBzXzFbX2ldO1xuICAgICAgICAgICAgaWYgKGZyZXF1ZW5jeSA+PSBzdGVwKSB7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gZmluYWxQYWxldHRlW3N0ZXBdWzBdO1xuICAgICAgICAgICAgICAgIGNvbG9yID0gZmluYWxQYWxldHRlW3N0ZXBdWzFdO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbYmFja2dyb3VuZENvbG9yLCBjb2xvcl07XG4gICAgfTtcbiAgICBDb25zZW5zdXNNb2RlbC5zZXRDb2xvcnNQaHlzaWNhbCA9IGZ1bmN0aW9uIChsZXR0ZXIsIHBhbGV0dGUpIHtcbiAgICAgICAgdmFyIGZpbmFsUGFsZXR0ZTtcbiAgICAgICAgdmFyIGJhY2tncm91bmRDb2xvcjtcbiAgICAgICAgdmFyIGNvbG9yO1xuICAgICAgICBpZiAocGFsZXR0ZSAmJiB0eXBlb2YgcGFsZXR0ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGZpbmFsUGFsZXR0ZSA9IHBhbGV0dGU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmaW5hbFBhbGV0dGUgPSBQYWxldHRlcy5jb25zZW5zdXNBYUxlc2s7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgZWwgaW4gZmluYWxQYWxldHRlKSB7XG4gICAgICAgICAgICBpZiAoZmluYWxQYWxldHRlW2VsXVswXSA9PSBsZXR0ZXIpIHtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBmaW5hbFBhbGV0dGVbZWxdWzFdO1xuICAgICAgICAgICAgICAgIGNvbG9yID0gZmluYWxQYWxldHRlW2VsXVsyXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW2JhY2tncm91bmRDb2xvciwgY29sb3JdO1xuICAgIH07XG4gICAgQ29uc2Vuc3VzTW9kZWwucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbiAoc2VxdWVuY2VzLCByZWdpb25zLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIGlmICghcmVnaW9ucykge1xuICAgICAgICAgICAgcmVnaW9ucyA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtYXhJZHggPSAwO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIHNlcXVlbmNlc18yID0gc2VxdWVuY2VzOyBfaSA8IHNlcXVlbmNlc18yLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIHJvdyA9IHNlcXVlbmNlc18yW19pXTtcbiAgICAgICAgICAgIGlmIChtYXhJZHggPCByb3cuc2VxdWVuY2UubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgbWF4SWR4ID0gcm93LnNlcXVlbmNlLmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBfYyA9IDAsIHNlcXVlbmNlc18zID0gc2VxdWVuY2VzOyBfYyA8IHNlcXVlbmNlc18zLmxlbmd0aDsgX2MrKykge1xuICAgICAgICAgICAgdmFyIHJvdyA9IHNlcXVlbmNlc18zW19jXTtcbiAgICAgICAgICAgIHZhciBkaWZmID0gbWF4SWR4IC0gcm93LnNlcXVlbmNlLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChkaWZmID4gMCAmJiByb3cuaWQgIT09IC05OTk5OTk5OTk5OTk5OSAmJiByb3cuaWQgIT09IC05OTk5OTk5OTk5OTk5OCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGlmZjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvdy5zZXF1ZW5jZSArPSAnLSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLnNlcXVlbmNlQ29sb3JNYXRyaXgpIHtcbiAgICAgICAgICAgIHJlZ2lvbnMgPSBbXTtcbiAgICAgICAgICAgIHNlcXVlbmNlcy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhLmlkIC0gYi5pZDsgfSk7XG4gICAgICAgICAgICB2YXIgbWluID0gc2VxdWVuY2VzWzBdO1xuICAgICAgICAgICAgdmFyIHBhbGV0dGUgPSBQYWxldHRlcy5zdWJzdGl0dXRpb25NYXRyaXhCbG9zdW07XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhwYWxldHRlKVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2VxdWVuY2VDb2xvck1hdHJpeFBhbGV0dGUpIHtcbiAgICAgICAgICAgICAgICBwYWxldHRlID0gb3B0aW9ucy5zZXF1ZW5jZUNvbG9yTWF0cml4UGFsZXR0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBrZXkgPSB2b2lkIDA7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cHJlZmVyLWZvci1vZlxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtaW4uc2VxdWVuY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfZCA9IDAsIHNlcXVlbmNlc180ID0gc2VxdWVuY2VzOyBfZCA8IHNlcXVlbmNlc180Lmxlbmd0aDsgX2QrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VxdWVuY2UgPSBzZXF1ZW5jZXNfNFtfZF07XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXF1ZW5jZS5pZCA9PT0gbWluLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXkgPSBzZXF1ZW5jZS5zZXF1ZW5jZVtpXSArIHNlcXVlbmNlLnNlcXVlbmNlW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleSBpbiBwYWxldHRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVnaW9ucy5wdXNoKHsgc2VxdWVuY2VJZDogc2VxdWVuY2UuaWQsIHN0YXJ0OiBpICsgMSwgZW5kOiBpICsgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBwYWxldHRlW2tleV1bMF0sIGNvbG9yOiBwYWxldHRlW2tleV1bMV0gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzY29yZSB3aXRoIGZpcnN0IHNlcXVlbmNlXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXkgPSBzZXF1ZW5jZS5zZXF1ZW5jZVtpXSArIG1pbi5zZXF1ZW5jZVtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXkgaW4gcGFsZXR0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZ2lvbnMucHVzaCh7IHNlcXVlbmNlSWQ6IHNlcXVlbmNlLmlkLCBzdGFydDogaSArIDEsIGVuZDogaSArIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogcGFsZXR0ZVtrZXldWzBdIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocGFsZXR0ZVttaW4uc2VxdWVuY2VbaV0gKyBzZXF1ZW5jZS5zZXF1ZW5jZVtpXV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgPSBtaW4uc2VxdWVuY2VbaV0gKyBzZXF1ZW5jZS5zZXF1ZW5jZVtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWdpb25zLnB1c2goeyBzZXF1ZW5jZUlkOiBzZXF1ZW5jZS5pZCwgc3RhcnQ6IGkgKyAxLCBlbmQ6IGkgKyAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHBhbGV0dGVba2V5XVswXSwgY29sb3I6IHBhbGV0dGVba2V5XVsxXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChvcHRpb25zLnNlcXVlbmNlQ29sb3IpIHtcbiAgICAgICAgICAgIHJlZ2lvbnMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIF9lID0gMCwgc2VxdWVuY2VzXzUgPSBzZXF1ZW5jZXM7IF9lIDwgc2VxdWVuY2VzXzUubGVuZ3RoOyBfZSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlcXVlbmNlID0gc2VxdWVuY2VzXzVbX2VdO1xuICAgICAgICAgICAgICAgIHNlcXVlbmNlLnNlcXVlbmNlQ29sb3IgPSBvcHRpb25zLnNlcXVlbmNlQ29sb3I7XG4gICAgICAgICAgICAgICAgcmVnaW9ucy5wdXNoKHsgc2VxdWVuY2VJZDogc2VxdWVuY2UuaWQsIHN0YXJ0OiAxLCBlbmQ6IHNlcXVlbmNlLnNlcXVlbmNlLmxlbmd0aCwgc2VxdWVuY2VDb2xvcjogb3B0aW9ucy5zZXF1ZW5jZUNvbG9yIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBjb25zZW5zdXNJbmZvSWRlbnRpdHk7XG4gICAgICAgIHZhciBjb25zZW5zdXNJbmZvUGh5c2ljYWw7XG4gICAgICAgIGlmIChvcHRpb25zLmNvbnNlbnN1c0NvbG9ySWRlbnRpdHkpIHtcbiAgICAgICAgICAgIGNvbnNlbnN1c0luZm9JZGVudGl0eSA9IENvbnNlbnN1c01vZGVsLnNldENvbnNlbnN1c0luZm8oJ2lkZW50aXR5Jywgc2VxdWVuY2VzKTtcbiAgICAgICAgICAgIF9hID0gQ29uc2Vuc3VzTW9kZWwuY3JlYXRlQ29uc2Vuc3VzKCdpZGVudGl0eScsIGNvbnNlbnN1c0luZm9JZGVudGl0eSwgZmFsc2UsIHNlcXVlbmNlcywgcmVnaW9ucywgb3B0aW9ucy5kb3RUaHJlc2hvbGQsIG9wdGlvbnMuY29uc2Vuc3VzQ29sb3JJZGVudGl0eSksIHNlcXVlbmNlcyA9IF9hWzBdLCByZWdpb25zID0gX2FbMV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAob3B0aW9ucy5jb25zZW5zdXNDb2xvck1hcHBpbmcpIHtcbiAgICAgICAgICAgIGNvbnNlbnN1c0luZm9QaHlzaWNhbCA9IENvbnNlbnN1c01vZGVsLnNldENvbnNlbnN1c0luZm8oJ3BoeXNpY2FsJywgc2VxdWVuY2VzKTtcbiAgICAgICAgICAgIGlmICghY29uc2Vuc3VzSW5mb0lkZW50aXR5KSB7XG4gICAgICAgICAgICAgICAgY29uc2Vuc3VzSW5mb0lkZW50aXR5ID0gQ29uc2Vuc3VzTW9kZWwuc2V0Q29uc2Vuc3VzSW5mbygnaWRlbnRpdHknLCBzZXF1ZW5jZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX2IgPSBDb25zZW5zdXNNb2RlbC5jcmVhdGVDb25zZW5zdXMoJ3BoeXNpY2FsJywgY29uc2Vuc3VzSW5mb1BoeXNpY2FsLCBjb25zZW5zdXNJbmZvSWRlbnRpdHksIHNlcXVlbmNlcywgcmVnaW9ucywgb3B0aW9ucy5kb3RUaHJlc2hvbGQsIG9wdGlvbnMuY29uc2Vuc3VzQ29sb3JNYXBwaW5nKSwgc2VxdWVuY2VzID0gX2JbMF0sIHJlZ2lvbnMgPSBfYlsxXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3NlcXVlbmNlcywgcmVnaW9uc107XG4gICAgfTtcbiAgICByZXR1cm4gQ29uc2Vuc3VzTW9kZWw7XG59KCkpO1xuZXhwb3J0IHsgQ29uc2Vuc3VzTW9kZWwgfTtcbiIsInZhciBFdmVudHNNb2RlbCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBFdmVudHNNb2RlbCgpIHtcbiAgICB9XG4gICAgRXZlbnRzTW9kZWwucHJvdG90eXBlLm9uUmVnaW9uU2VsZWN0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzZXF1ZW5jZVZpZXdlcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjZWxsJyk7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBzZXF1ZW5jZVZpZXdlcnNfMSA9IHNlcXVlbmNlVmlld2VyczsgX2kgPCBzZXF1ZW5jZVZpZXdlcnNfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBzcXYgPSBzZXF1ZW5jZVZpZXdlcnNfMVtfaV07XG4gICAgICAgICAgICBzcXYuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCBmdW5jdGlvbiAocikge1xuICAgICAgICAgICAgICAgIHZhciBldnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ29uUmVnaW9uU2VsZWN0ZWQnLCB7IGRldGFpbDogeyBjaGFyOiByLnNyY0VsZW1lbnQuaW5uZXJIVE1MLCB4OiByLnNyY0VsZW1lbnQuZGF0YXNldC5yZXNYLCB5OiByLnNyY0VsZW1lbnQuZGF0YXNldC5yZXNZIH0gfSk7XG4gICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoZXZ0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gRXZlbnRzTW9kZWw7XG59KCkpO1xuZXhwb3J0IHsgRXZlbnRzTW9kZWwgfTtcbiIsImltcG9ydCB7IEljb25zIH0gZnJvbSAnLi9pY29ucyc7XG52YXIgSWNvbnNNb2RlbCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBJY29uc01vZGVsKCkge1xuICAgIH1cbiAgICBJY29uc01vZGVsLnByb3RvdHlwZS5wcm9jZXNzID0gZnVuY3Rpb24gKHJlZ2lvbnMsIHNlcXVlbmNlcywgaWNvbnNQYXRocykge1xuICAgICAgICB2YXIgcm93cyA9IHt9O1xuICAgICAgICBpZiAocmVnaW9ucyAmJiBzZXF1ZW5jZXMpIHtcbiAgICAgICAgICAgIHZhciBfbG9vcF8xID0gZnVuY3Rpb24gKHNlcSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIF9hID0gMCwgcmVnaW9uc18xID0gcmVnaW9uczsgX2EgPCByZWdpb25zXzEubGVuZ3RoOyBfYSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZWcgPSByZWdpb25zXzFbX2FdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoK3NlcS5pZCA9PT0gcmVnLnNlcXVlbmNlSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcm93c1tzZXEuaWRdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93c1tzZXEuaWRdID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Zm9yaW5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBzZXF1ZW5jZXMuZmluZChmdW5jdGlvbiAoeCkgeyByZXR1cm4geC5pZCA9PT0gc2VxLmlkOyB9KS5zZXF1ZW5jZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9ICgra2V5ICsgMSkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGFycyB3aXRoIGljb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoK2tleSA+PSByZWcuc3RhcnQgJiYgK2tleSA8PSByZWcuZW5kICYmIHJlZy5pY29uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWcuaWNvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlZ2lvbiA9IHJlZy5lbmQgLSAocmVnLnN0YXJ0IC0gMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2VudGVyID0gTWF0aC5mbG9vcihyZWdpb24gLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpY29uID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlZy5jb2xvciAmJiByZWcuY29sb3JbMF0gPT09ICcoJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZy5jb2xvciA9ICdyZ2InICsgcmVnLmNvbG9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGVmYXVsdCBpY29uc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChyZWcuaWNvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2xvbGxpcG9wJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uID0gSWNvbnMubG9sbGlwb3A7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdhcnJvd1JpZ2h0Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uID0gSWNvbnMuYXJyb3dSaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Fycm93TGVmdCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbiA9IEljb25zLmFycm93TGVmdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3N0cmFuZCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbiA9IEljb25zLnN0cmFuZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ25vU2Vjb25kYXJ5Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uID0gSWNvbnMubm9TZWNvbmRhcnk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdoZWxpeCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbiA9IEljb25zLmhlbGl4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAndHVybic6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbiA9IEljb25zLnR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGN1c3RvbWl6YWJsZSBpY29ucyAoc3ZnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uID0gcmVnLmljb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWcuZGlzcGxheSA9PT0gJ2NlbnRlcicgJiYgK2tleSA9PT0gcmVnLnN0YXJ0ICsgY2VudGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93c1tzZXEuaWRdW2tleV0gPSB7IGNoYXI6IGljb24gfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCFyZWcuZGlzcGxheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd3Nbc2VxLmlkXVtrZXldID0geyBjaGFyOiBpY29uIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hhcnMgd2l0aG91dCBpY29uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyb3dzW3NlcS5pZF1ba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dzW3NlcS5pZF1ba2V5XSA9IHsgY2hhcjogJycgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBzZXF1ZW5jZXNfMSA9IHNlcXVlbmNlczsgX2kgPCBzZXF1ZW5jZXNfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VxID0gc2VxdWVuY2VzXzFbX2ldO1xuICAgICAgICAgICAgICAgIF9sb29wXzEoc2VxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgZmlsdGVyZWRSb3dzID0ge307XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpmb3JpblxuICAgICAgICBmb3IgKHZhciByb3cgaW4gcm93cykge1xuICAgICAgICAgICAgdmFyIGZsYWcgPSB2b2lkIDA7XG4gICAgICAgICAgICB2YXIgY2hhcnMgPSByb3dzW3Jvd107XG4gICAgICAgICAgICBmb3IgKHZhciBjaGFyIGluIHJvd3Nbcm93XSkge1xuICAgICAgICAgICAgICAgIGlmIChyb3dzW3Jvd11bY2hhcl0uY2hhciAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgZmxhZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZsYWcpIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJlZFJvd3Nbcm93XSA9IGNoYXJzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaWx0ZXJlZFJvd3M7XG4gICAgfTtcbiAgICByZXR1cm4gSWNvbnNNb2RlbDtcbn0oKSk7XG5leHBvcnQgeyBJY29uc01vZGVsIH07XG4iLCJ2YXIgSWNvbnMgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gSWNvbnMoKSB7XG4gICAgfVxuICAgIEljb25zLmxvbGxpcG9wID0gJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMC43ZW1cIiB4PVwiMFwiIHk9XCIwXCIgaWQ9XCJsb2xsaXBvcFwiIHZpZXdCb3g9XCIwIDAgMzQwLjE2IDk1MC45M1wiPjxwYXRoIGZpbGw9XCJyZ2IoMjU1LCA5OSwgNzEpXCIgZD1cIk0zMTEuNDY1LDE0MS4yMzJjMCw3OC02My4yMzEsMTQxLjIzMi0xNDEuMjMyLDE0MS4yMzIgIGMtNzgsMC0xNDEuMjMyLTYzLjIzMi0xNDEuMjMyLTE0MS4yMzJTOTIuMjMyLDAsMTcwLjIzMiwwQzI0OC4yMzMsMCwzMTEuNDY1LDYzLjIzMiwzMTEuNDY1LDE0MS4yMzJ6IE0xOTQsMjgwLjg3OGgtNDcuOTgzVjU2Ni45MyAgSDE5NFYyODAuODc4elwiLz48L3N2Zz4nO1xuICAgIEljb25zLmFycm93TGVmdCA9ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjAuN2VtXCIgaWQ9XCJMaXZlbGxvXzFcIiB4PVwiMHB4XCIgeT1cIjBweFwiIHZpZXdCb3g9XCIwIDAgOTYzLjc4IDE1ODcuNFwiIGVuYWJsZS1iYWNrZ3JvdW5kPVwibmV3IDAgMCA5NjMuNzggMTU4Ny40XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj48cmVjdCBzdHlsZT1cImZpbGw6dHJhbnNwYXJlbnRcIiB4PVwiMC40NzdcIiB5PVwiNDEyLjgxOFwiIHN0cm9rZT1cIiMwMDAwMDBcIiBzdHJva2UtbWl0ZXJsaW1pdD1cIjEwXCIgd2lkdGg9XCI5NjMuNzgxXCIgaGVpZ2h0PVwiNzYzLjYzNlwiLz48Zz48ZGVmcz48cmVjdCB3aWR0aD1cIjk2NFwiIGhlaWdodD1cIjE1ODdcIj48L3JlY3Q+PC9kZWZzPjxjbGlwUGF0aD48dXNlIG92ZXJmbG93PVwidmlzaWJsZVwiPjwvdXNlPjwvY2xpcFBhdGg+PHBvbHlnb24gc3R5bGU9XCJmaWxsOiNGREREMEQ7XCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiIGNsaXAtcnVsZT1cImV2ZW5vZGRcIiBwb2ludHM9XCIxNTg5LjY0LDQxMS43NyAxNTg5LjY0LDExNzkuMzcgICAgNzU2LjA0LDExNzkuMzcgNzU2LjA0LDE1OTEuMTUgMCw3OTUuNTcgNzU2LjA0LDAgNzU2LjA0LDQxMS43NyAgXCI+IDwvcG9seWdvbj48L2c+PC9zdmc+JztcbiAgICBJY29ucy5hcnJvd1JpZ2h0ID0gJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMC43ZW1cIiBpZD1cIkxheWVyXzFcIiB4PVwiMHB4XCIgeT1cIjBweFwiIHZpZXdCb3g9XCIwIDAgOTY0IDE1ODdcIiBlbmFibGUtYmFja2dyb3VuZD1cIm5ldyAwIDAgOTY0IDE1ODdcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPiAgPGltYWdlIGlkPVwiaW1hZ2UwXCIgd2lkdGg9XCI5NjRcIiBoZWlnaHQ9XCIxNTg3XCIgeD1cIjBcIiB5PVwiMFwiIGhyZWY9XCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQThRQUFBWXpDQU1BQUFBRjNRVERBQUFBQkdkQlRVRUFBTEdQQy94aEJRQUFBQ0JqU0ZKTiBBQUI2SmdBQWdJUUFBUG9BQUFDQTZBQUFkVEFBQU9wZ0FBQTZtQUFBRjNDY3VsRThBQUFCemxCTVZFWC8vLy8vL2ZQKzYyNys2M0gvIC9PZi8vT3Y5M1EzOTR6Yi8vT3o5NUQ3Ly9mTDk1VWovL3ZiKzUxTC8vdm4rNkY3Ly8veis2V0wvLy8zKzYyLy8vLzcrN1h6KzdvVCsgOEpYOTNRNys4cUw5M1EvKzg2ajkzaEgrOUxQOTNoVCs5cjc5M2hmLzk4ajkzeG4vK016OTN4Ny8rZFQ5NENULyt0ejk0U3IvKytQOSA0akwvL09uKzZGMys2V0grN0h2KzdZTCs4WnIrODZmKzlMTCs5cjMvOThmLytNdjk0aTMvL09iOTR6WDk1RDMvL2ZIOTVVZis1MUgrIDUxYi8vdnIrNm0zKzdIcis3WUgrOEpUKzhabis4cWIrOUxIOTNoWCs5c0gvK2RQLysrWCs1bEQrNTFYKzdIbis3WUQrNzRyKzhxWCsgOXJ6KzlzRDkzeGovK01yOTRDUC8rdHY5NFNuOTRTejk1RHo5NVViKzVrdis2V0QrNm16KzdYLys3b245M1JEKzlMRDkzaEwrOWJYOSAzeDMvK2RMOTRDYi8rdDcvKytUOTRqVC8vdlg5NWtyKzUxVCs2bXYrN1g3KzdvZis4SmorOHFUKzlyLy85OG4vK2RILyt0ci8vT3I5IDVEdi8vZkQ5NUQvKzUxUCs2Ri8rN1gzKzdvYis4SmYrOHFQKzlLLys5TFQ5NEIvLytkWDk0Q1gvK3QzOTRTdjk0alA5NVVuKzZtcisgNjNEKzhKYjkzeHorNzR2OTNoUCs3b2o5NHp2KzdvUC8vZS8rN0hqOTVFRCs3b1gvK05EOTVVWCs2V1ArOUs3KzhxSFNEZ1hRQUFBQSBBV0pMUjBRQWlBVWRTQUFBQUFsd1NGbHpBQUFBWUFBQUFHQUE4R3RDendBQUFBZDBTVTFGQitRTUNnb2pJL29WZlpRQUFDK3FTVVJCIFZIamE3ZDEzZ3gzRnZlZGhMYXlhWkdBQVk0WmhFRUtJSkJBbXI4allnQzdSZ0JBSUVTeEFaSUhKT1FvUTBRc3MxOWQzOTkydVRWU1kgY003cHJ2NVZlSjVYVUYxMVB2OUozMW16cGk3LzQ3REREanY4ZjBhZkFwaloydTVmampneStoakFySDZNdUR2cTZPaHpBRFA2S2VMdSBtTjlGSHdTWXpjOFJkOGNlRjMwU1lDYS9STndkUHhkOUZHQVd2MGJjblhCaTlGbUFHZndXY1hmUzc2TVBBMHh2djRpN2s2TVBBMHh2IC80aTdQMFNmQnBqYUFSRjNwMFFmQjVqV2dSSFBueHA5SG1CS0IwYmNMWndXZlNCZ09nZEYzQzJlSG4waVlDb0hSOXl0T3lQNlNNQTAgRG9tNFczOW05Sm1BS1J3YWNiZmhyT2hEQVpOYkl1SnU0OW5ScHdJbXRsVEUzVG5uUmg4TG1OU1NFWGZublI5OUxtQkNTMGZjYmJvZyArbURBWkphSjJPd1dsR0s1aU0xdVFTR1dqZGpzRnBSaCtZak5ia0VSVm9pNHUzQXUrblRBcWxhS3VOdHNkZ3V5dDJMRTNXRm10eUIzIEswZmNYUlI5UG1BVnEwVGMvVEg2Z01ES1Zvdlk3QlprYnRXSXU0dWpqd2lzWlBXSUZ5NkpQaU93Z3RVajdoWXZqVDRrc0x3Skl1N1cgWFJaOVNtQlprMFRjcmI4OCtwakFjaWFLdU50d1JmUTVnV1ZNRnJIWkxjaldoQkdiM1lKY1RScXgyUzNJMU1RUmQxZityK2l6QWt1WSBQT0p1aTlrdHlOQVVFWGRYWFIxOVd1QVEwMFRjWFdOMkM3SXpWY1RkdFdhM0lEZlRSZHhkZDMzMGdZRURUUmx4dDNrdStzVEFBYWFOIHVMdkI3QlprWmVxSXV4dWpqd3pzYi9xSXV6OUZueG5Zend3UmQzK09QalR3bTFraTdtNktQalh3cTVraVhyZzUrdGpBTDJhS3VGdTggSmZyY3dNOW1pOWpzRm1SanhvaTdyZjhSZlhMZ1I3TkdiSFlMTWpGenhOM0dXNlBQRHF6cEU3SFpMY2hDajRqTmJrRU8ra1RjWFhsYiA5UEdCWGhGM1c5WkdueCthMXk5aXMxc1FybWZFWnJjZ1d0K0l1OXZOYmtHbzNoRjNkNWpkZ2tqOUl6YTdCYUVHaU5qc0ZrUWFJdUx1IHp1aXZnSVlORW5GM1YvUm5RTHVHaWJqN1MvUjNRTE1HaXRqc0ZrUVpLdUtGdTZPL0JCbzFWTVJtdHlESVlCRjM2KzZKL2habzBuQVIgZDF2dmpmNFlhTkdBRVhmYjdvditHbWpRa0JHYjNZSUFnMGJjYmI4LytudWdPY05HM0QxZ2RndEdObkRFM1E2eld6Q3VvU00ydXdVaiBHenppN2tHeld6Q200U1B1ZHByZGdoRWxpTGg3U01Vd25oUVJtOTJDRVNXSnVIdDRMdnE3b0JscEl1NGVNYnNGSTBrVXNka3RHRXVxIGlMdEhvNzhNR3BFczR1NnYwWjhHYlVnWHNka3RHRVhDaU0xdXdSZ1NSdHp0ZWl6NjY2QUJLU1B1SG44aSt2T2dma2tqTnJzRjZhV04gMk93V0pKYzQ0bTczazlGZkNKVkxIYkhaTFVnc2VjVGRVMDlIZnlOVUxYM0UzWTVub2o4U2FqWkN4TjJ6WnJjZ25URWlOcnNGQ1kwUyBjYmZ6dWVqdmhHcU5FM0gzdk5rdFNHU2tpTHM5WnJjZ2piRWlOcnNGaVl3V2NmZUMyUzFJWWJ5SXU4TlZEQW1NR0hIM1l2VEhRbzNHIGpMajdXL1RYUW9WR2piaDdLZnB6b1Q3alJqei9jdlQzUW5YR2pkanNGZ3h1NUlqTmJzSFF4bzY0Mi9wSzlDZERYVWFQdU52MmF2UTMgUTFYR2o3amIvVnIwUjBOTkFpTHV0cjhlL2RWUWtZaUl6VzdCZ0VJaU5yc0Z3NG1KdUh2MmplZ1BoMW9FUmR5OStWYjBsME1sb2lMdSAzajQ2K3RPaERtRVJtOTJDWWNSRjNMMXpYUFRIUXcwQ0krN2VuWXYrZXFoQVpNUm10MkFBb1JHYjNZTCtZaVB1M292K2ZpaGVjTVRkICs5RVhBS1dManJqN0lQb0dvSERoRWM5L0dIMEZVTGJ3aUx0ZEgwWGZBUlF0UHVKdThlUG9TNENTWlJCeHQvV002RnVBZ3VVUXNka3QgNkNHTGlNMXV3ZXp5aUxqYiswbjBSVUNwTW9tNCsvU3o2SnVBUXVVU2NiZlA3QmJNSkp1SXU4L05ic0VzOG9uWTdCYk1KS09Jelc3QiBMSEtLdVB2QzdCWk1MYXVJelc3QjlQS0t1RHQrTHZwQ29EU1pSZHg5YWJBSHBwTmJ4TjFYS29hcFpCZXgyUzJZVG40Um05MkNxV1FZIGNmZDE5S1ZBU1hLTTJPd1dUQ0hIaUx1RjA2S3ZCY3FSWmNUZDR1blI5d0xGeURQaWJwM1pMWmhRcGhGMzY4K012aGtvUks0UmQ5K1kgM1lLSlpCdHh0L2ZzNkx1Qkl1UWJzZGt0bUVqR0VYZjd6bysrSFNoQXpoRjNtOHh1d2FxeWpyZzc0c2pvKzRIczVSMXhkNVRaTFZoRiA1aEYzeDVqZGdwWGxIbkYzck5rdFdGSDJFWnZkZ3BYbEgzRjN3b25SbHdRNUt5RGk3aVN6VzdDOEVpTHVUbzYrSmNoWUVSRjNmNGkrIEpzaFhHUkYzcDBUZkUyU3JrSWpuVDQyK0tNaFZJUkdiM1lMbGxCS3gyUzFZUmpFUm05MkNwWlVUc2RrdFdGSkJFWGNiem9xK0xjaFEgU1JHYjNZSWxGQlZ4ZDg2NTBmY0YyU2tyNHU0OHMxdHdrTUlpTnJzRkJ5c3RZck5iY0pEaUlqYTdCUWNxTDJLelczQ0FBaU0ydXdYNyBLekhpN3NLNTZHdURmQlFaY2JmWjdCYjhvc3lJdThQTWJzSFBDbzI0dXlqNjRpQVhwVWJjL1RINjVpQVR4VVpzZGd0K1VtN0UzY1hSIGR3ZFpLRGppaFV1aUx3OXlVSERFM2VLbDBiY0hHU2c1WXJOYnNLYndpTHYxbDBmZkg0UXJPK0p1d3hYUkZ3alJDbys0MjJoMmk5YVYgSHJIWkxacFhmTVJtdDJoZCtSRjNteTZJdmtTSVZFSEUzUmF6VzdTc2hvaTdxNjZPdmthSVUwWEUzVFZtdDJoWEhSRjMxNXJkb2xtViBSTnhkZDMzMFRVS1FXaUx1TnM5Rlh5WEVxQ2JpN2dhelc3U3Bub2k3RzZQdkVrSlVGSEgzcCtqTGhBZzFSZHo5T2ZvMklVQlZFWGMzIFJWOG5qSyt1aUJkdWpyNVBHRjFkRVhlTHQwUmZLSXl0c29pN2RaZEYzeWlNckxhSXU2My9FWDJsTUs3cUlqYTdSV3ZxaTdqYmVHdjAgcGNLWUtvelk3Qlp0cVRGaXMxczBwY3FJdXl0dmk3NVhHRTJkRVhkYjFrWmZMSXlsMG9qTmJ0R09XaU0ydTBVenFvMjR1OTNzRm0ybyBOK0x1RHJOYk5LSGlpTTF1MFlhYUl6YTdSUk9xanRqc0ZpMm9PK0x1cnVqN2hlUXFqN2o3ZS9RRlEycTFSMngyaStwVkgvSEMzZEZYIERHbFZIN0haTFdwWGY4Um10NmhjQXhGM1crK052bVZJcUlXSXUyMzNSVjh6cE5ORXhHYTNxRmtiRVhmYjc0KythRWlsa1lpN0I4eHUgVWF0V0l1NTJtTjJpVXMxRWJIYUxXclVUY2ZlZzJTMnExRkRFM1U2elc5U29wWWk3aDFSTWhacUsyT3dXTldvcllyTmJWS2l4aUx0SCB6RzVSbTlZaTd1Nk12bkVZV0hNUmQ0OUdYemtNcTcySXU3OUczemtNcXNHSXpXNVJseFlqTnJ0RlZWcU11RnQ4TFByYVlUaE5SdHo5IDczdWk3eDBHMDJiRVpyZW9TS01SbTkyaUhxMUczTzErTXZycVlSak5SbXgyaTFxMEczSDMxTlBSbHc5RGFEamlic2N6MGJjUEEyZzUgNHU1WnMxdFVvT21Jelc1Umc3WWo3blkrRi8wQTBGZmpFWGZQbTkyaWRLMUgzTzB4dTBYaG1vKzRlM2d1K2cyZ0Z4RjNMNWpkb21naSA3cnJEVlV6SlJQd3ZMMGEvQXZRZzRuLzdOdm9aWUhZaS90RkwwZThBTXhQeGorWmZqbjRJbUpXSWY3THJzZWlYZ0JtSitHZVBQeEg5IEZEQWJFZjlpNnl2UmJ3RXpFZkd2dHIwYS9SZ3dDeEgveHV3V1JSTHhmcmEvSHYwY01EMFI3OC9zRmdVUzhRSE1ibEVlRVIvSTdCYkYgRWZGQjNud3Ira2xnT2lJKzJOdEhSNzhKVEVYRWh6QzdSVmxFZktnOXgwVy9Da3hCeEV0NGR5NzZXV0J5SWw2SzJTMEtJdUlsbWQyaSBIQ0plbXRrdGlpSGlaYndmL1RJd0lSRXY1NFBvcDRISmlIZzVacmNvaElpWHRldWo2TWVCU1loNGVZc2ZSNzhPVEVERUs5aDZSdlR6IHdPcEV2Qkt6V3hSQXhDdmEvVnIwQThGcVJMeXl2WjlFdnhDc1FzU3IrUFN6NkNlQ2xZbDROZnZNYnBFM0VhL3E4emVpSHdsV0l1TFYgbWQwaWF5S2VnTmt0Y2liaVNYeGhkb3Q4aVhnaTc1amRJbHNpbnN6eGM5RXZCY3NROFlTK05OaERwa1E4cWE5VVRKNUVQTEgzb3Q4SyBsaVRpeVpuZElrc2luc0xYMGE4RlN4RHhGT1kvakg0dU9KU0lwN0Z3V3ZSN3dTRkVQSlhGMDZNZkRBNG00dW1zTTd0RmJrUThwZlZuIFJqOFpIRWpFMC9yRzdCWjVFZkhVOXA0ZC9XaXdQeEZQeit3V1dSSHhEUGFkSC8xczhCc1J6OExzRmhrUjhVeStNN3RGTmtROG02UE0gYnBFTEVjL29HTE5iWkVMRXN6clc3Qlo1RVBITXpHNlJCeEhQN29RVG8xOFAxb2k0bDVQTWJwRUJFZmR4Y3ZUemdZaDcra1AwKzRHSSBleks3UlRnUjl6Ti9hdlFMMGp3UjkyUjJpMmdpN3N2c0ZzRkUzSnZaTFdLSnVEK3pXNFFTOFFBMm5CWDlqTFJNeEVNd3UwVWdFUS9pIDAzT2pINUoyaVhnWTU1bmRJb3FJQjdMSjdCWkJSRHlVSTQ2TWZrc2FKZUxCbU4waWhvaUhZM2FMRUNJZWtOa3RJb2g0U0JmT1JiOG4gRFJMeG9NeHVNVDRSRCtzd3MxdU1UY1FEdXlqNlJXbU9pSWYyZmZTVDBob1JEKzZVNkRlbE1TSWUzc1hSajBwYlJEeThoVXVpWDVXbSBpRGlCeFV1am41V1dpRGdGczF1TVNNUkpyTDg4K21GcGg0alQySEJGOU12U0RCRW5zdEhzRmlNUmNTcm5tTjFpSENKT3h1d1c0eEJ4IE9wc3VpSDVkbWlEaWhMYVkzV0lFSWs3cHFxdWozNWNHaURpcGE4eHVrWnlJMDdyVzdCYXBpVGl4NjY2UGZtSnFKK0xVTnB2ZElpMFIgSjJkMmk3UkVuTjZOMFk5TTNVUThnajlGdnpKVkUvRVl6RzZSa0loSGNWUDBPMU14RVk5aTRlYm9oNlplSWg2SDJTMlNFZkZJMWwwVyAvZFRVU3NSak1idEZJaUllamRrdDBoRHhlRGJlR3YzYVZFbkVJeks3UlFvaUhwUFpMUklROGFpdXZDMzZ3YW1QaU1kbGRvdkJpWGhrIFpyY1ltb2pIWm5hTGdZbDRkTGViM1dKUUloN2ZIV2EzR0pLSUEyeWVpMzUyYWlMaUNEZVkzV0k0SWc1eFkvUzdVeEVSeDdncit1R3AgaDRpRC9EMzY1YW1HaUtPWTNXSWdJbzZ5Y0hmMDIxTUpFWWRadkNYNjhhbURpT09ZM1dJUUlnNjA5ZDdvNTZjR0lvNjA0YjdvOTZjQyBJZzVsZG92K1JCeHIrLzNSdndDS0orSmdENWpkb2ljUlJ6TzdSVThpRHJkbGJmU1BnTEtKT042RFpyZm9ROFFaMkdsMml4NUVuSU9IIFZEeXEvMU9YYzZOL3YvemJPOGJ6eHJRcityMnBrZG10TVltWUZCNHh1elVlRVpQRW5kRy83SWFJbURRZWpmNXB0MFBFSlBMWDZOOTIgTTBSTUttYTNSaUppVWpHN05SSVJrNHpaclhHSW1IVFczUlA5KzI2Q2lFbkk3TllZUkV4SzI4eHVwU2Rpa3RyOVpQUlB2SDRpSmkyeiBXOG1KbU1TZWVqcjZSMTQ3RVpQYURyTmJhWW1ZNUo0MXU1V1VpRW5QN0ZaU0ltWUVPNStML3FIWFRNU000WG16VyttSW1GSHN1VDc2IHAxNHZFVE9PaCtlaWYrdlZFakVqZWNIc1ZpSWlaaXcvUlAvWWF5VmlSdk5pOUsrOVVpSm1QTjlHLzl6ckpHSkc5RkwwNzcxS0ltWkUgOHk5SC8rQnJKR0xHdE91eDZGOThoVVRNcUI1L0l2b25YeDhSTTY2dHIwVC81cXNqWWthMjdkWG9IMzF0Uk16WXpHNE5UTVNNYnZ2ciAwVC83dW9pWThabmRHcFNJQ2JEam1lZ2ZmazFFVEFTeld3TVNNU0hlZkN2NnAxOFBFUlBqUDQrTy91MVhROFFFTWJzMUZCRVRaYzl4IDBiLytTb2lZTU8vT1JmLzg2eUJpNHBqZEdvU0lDWFM0aWdjZ1lpS1ozUnFBaUFuMWZuUUJGUkF4c1Q2SVRxQjhJaWFXMmEzZVJFeXcgWFI5RlIxQTZFUlB0OFkrakt5aWNpQW0zOVl6b0RNb21ZdUtaM2VwRnhHUmc5MnZSSVpSTXhPUmc3eWZSSlJSTXhHVGgwOCtpVXlpWCBpTW5EUHJOYnN4SXhtZmo4amVnWVNpVmljbUYyYTBZaUpodHZtOTJhaVlqSnh4ZG10MlloWWpMeWp0bXRHWWlZbkJ3L0YxMUVnVVJNIFZyNDAyRE0xRVpPWHIxUThMUkdUbWZlaW15aU9pTW1OMmEwcGlaanNtTjJham9qSnp2eUgwVm1VUmNUa1orRzA2QzZLSW1JeXRQaHggZEJnbEVURTVNcnMxQlJHVHBmVm5ScWRSRGhHVHAyL01iazFLeEdUSzdOYWtSRXl1ekc1TlNNUmthOS81MFhtVVFjVGt5K3pXUkVSTSB4cjR6dXpVQkVaT3pvOHh1clU3RVpPMFlzMXVyRWpGNU85YnMxbXBFVE9iTWJxMUd4T1R1aEJPaks4bWNpTW5lU1dhM1ZpUmk4bmR5IGRDWjVFekVGK0VkMEoxa1RNU1g0T2pxVW5JbVlFc3lmR2wxS3hrUk1FY3h1TFUvRWxHSHg5T2hXc2lWaUNySE83Tll5UkV3cHpHNHQgUThRVTQ1di9pczRsVHlLbUhIdlBqdTRsU3lLbUlHYTNsaUppU21KMmF3a2lwaWliekc0ZFFzU1U1WWdqbzV2SmpvZ3BqTm10ZzRtWSAwcGpkT29pSUtZN1pyUU9KbVBKY09CZmRUVlpFVElITWJ1MVB4SlRJN05aK1JFeVJMb291SnlNaXBremZSNmVURHhGVHFGT2kyOG1HIGlDblZ4ZEh4NUVMRWxHcmhrdWg2TWlGaWltVjI2eWNpcGx4bXQzNGtZZ3EyL3ZMb2dISWdZa3EyNGF6b2dqSWdZb3EyMGV5V2lDbmMgT2VkR054Uk94QlR1dk9abnQwUk02VFpkRUYyUmlLR2YxbWUzUkV6NXJybzZ1aU1SUXovWE5EMjdKV0pxY0czTHMxc2lwZ3JYWFIrZCBrb2lobjgzdHptNkptRW9jMXV6c2xvaXBSYk96V3lLbUduK0tya25FMEZPanMxc2lwaUlYUi9ja1l1aG40ZWJvb0VRTS9TeGVHbDJVIGlLR2ZkWmRGSnlWaTZLZkIyUzBSVTVrTlYwUkhKV0xvWitPdDBWV0pHUHBwYlhaTHhOU25zZGt0RVZPaEsyK0xEa3ZFME0rV2xtYTMgUkV5VldwcmRFakYxYW1oMlM4UlU2dlptWnJkRVRLM3VhR1YyUzhSVWEvTmNkRjRpaG41dWFHTjJTOFJVN01ib3ZrUU1QZDBWSFppSSBvYWMvUnhjbVl1anBwdWpFUkF6OU5EQzdKV0lxdDNoTGRHUWlobjZxbjkwU01kWGJlbTkwWmlLR2ZpcWYzUkl4RGFoN2RrdkV0R0Q3IC9kR2xpUmo2ZWFEaTJTMFIwNGFLWjdkRVRDTzJySTJPVGNUUXo0TzF6bTZKbUdic3JIUjJTOFMwNDZFNkt4WXhEYWx6ZGt2RXRLVEsgMlMwUjA1UkhLcHpkRWpGdHVUTTZPUkZEVDQ5R055ZGk2T2t2MGRHSkdIcXFiWFpMeERSbjRlN283RVFNL1ZRMnV5VmlHclR1bnVqdyBSQXo5VkRXN0pXS2F0TzIrNlBSRURQM3Nmaks2UFJGRFAvWE1ib21ZVmozMWRIUjlJb1orZGxReXV5VmkydlZzSGJOYklxWmhkY3h1IGlaaVc3WHd1dWtBUlF6L1BWekM3SldMYXRxZjgyUzBSMDdpSDU2SWpGREgwODBMcHMxc2lwbmsvUkZjb1l1aXA4Tmt0RVVQM2JYU0ggSW9hZVhvb09VY1RRejN6SnMxc2lobi9aOVZoMGlpS0dmaDUvSXJwRkVVTS9XMStKamxIRTBFK3hzMXNpaHArVk9yc2xZdmpGOXRlaiBleFF4OUZQbTdKYUk0VGM3bm9rdVVzVFFUNG16V3lLRy9iMzVWblNUSW9aKy9sbmM3SmFJNFVERnpXNkpHQTZ5NTdqb0xFVU0vYnc3IEY5MmxpS0dmc21hM1JBeUhPcnlraWtVTVMzZ3h1a3dSUTA5L2kwNVR4TkRUQjlGdGloajZtWDg1T2s0UlF6KzdQb3F1VThUUVR5bXogV3lLRzVXdzlJN3BQRVVNLzIxNk5EbFRFME0vdTE2SUxGVEgwcy9lVDZFUkZEUDE4K2xsMG95S0dmdlpsUDdzbFlsalo1MjlFVnlwaSA2Q2YzMlMwUncycmVQanE2VXhGRFAxOWtQYnNsWWxqZE96blBib2tZSm5EOFhIU3FJb1ordnN4M3NFZkVNSkd2c3ExWXhEQ1o5NkpqIEZUSDA5SDUwclNLR25qS2QzUkl4VEdyK3craGVSUXo5TEp3V0hheUlvWi9GajZPTEZUSDBrK1BzbG9oaEd0dk9qRzVXeE5EUE45bk4gYm9rWXBwUGQ3SmFJWVVxNXpXNkpHS2ExNy96b2JrVU0vZVExdXlWaW1ONTNPYzF1aVJobWtOUHNsb2hoRnNma003c2xZcGpKc2RuTSBib2tZWnBQTjdKYUlZVWIvZldKMHZpS0dmazdLWTNaTHhEQ3prNlA3RlRIMDlJL29nRVVNUFgwZFhiQ0lvWi81VTZNVEZqSDBrOEhzIGxvaWhsOFhUUlF4bFd4Yzl1eVZpNkdsOThPeVdpS0d2NE5rdEVVTnZlODhXTVpRdGRIWkx4RENBeU5rdEVjTVFOc1hOYm9rWUJuSEUga1NLR3NoMFZOYnNsWWhoSTFPeVdpR0VvUWJOYklvYkJYRGduWWlqYkNSR3pXeUtHQVVYTWJva1loaFF3dXlWaUdOVDNJb2JDblNKaSBLTnZvczFzaWhvRXRYQ0ppS052SXMxc2loc0dOTzdzbFloamUrc3RGREdYYmNKYUlvV3dieDV2ZEVqRWtjYzY1SW9heW5UZlc3SmFJIElaRk5GNGdZeWpiUzdKYUlJWm1qcmhZeGxPMmFNV2EzUkF3SlhUdkM3SmFJSWFYcnJoY3hsRzF6OHRrdEVVTmFoNldlM1JJeEpIYVIgaUtGd2Z4UXhGQzd0N0phSUliMkxSUXhsU3pxN0pXSVl3ZUtsSW9heXJidE14RkMyZExOYklvWnhiTGhDeEZDMmpiZUtHTXFXYUhaTCB4RENhTkxOYklvYnhYSG1iaUtGc1d4TE1ib2tZeG5UVjhMTmJJb1pSRFQrN0pXSVkxK0N6V3lLR2tkMHg4T3lXaUdGc20rZEVER1c3IFlkRFpMUkhEK0c0VU1SVHVMaEZENGY0c1lpamNUU0tHc2kzY0xHSW8yK0l0SW9heURUVzdKV0tJc3ZWZUVVUFpocG5kRWpIRUdXUjIgUzhRUTZKejdSUXhsZTZELzdKYUlJVlQvMlMwUlE2d3RhMFVNWmVzN3V5VmlpTGF6Myt5V2lDSGM3YjFtdDBRTThYck5ib2tZTXRCbiBka3ZFa0lOSFpwL2RFakZrNFU0UlErRm1udDBTTVdUaUx5S0d3czA0dXlWaXlNWEMzU0tHc3MwMnV5Vml5TWU2ZTBRTVpadGxka3ZFIGtKTnQ5NGtZeXJiN1NSRkQyYlpQTzdzbFlzak1VMCtMR01xMlk3clpMUkZEZHA2ZGFuWkx4SkNmQjZlWjNSSXhaR2puY3lLR3NqMC8gK1hpZWlDRkxleWFlM1JJeDVPbmhPUkZEMlNhZDNSSXg1T29IRVVQaEhoVXhGTzViRVVQaFhoSXhsRzErZ3RrdEVVUE9kajBtWWlqYiA0MCtJR01xMjlSVVJROWxXbTkwU01lUnVsZGt0RVVQMnRyOHVZaWpiaXJOYklvWUM3SGhHeEZDMkZXYTNSQXhGZVBNdEVVUFovdm1jIGlLRnN5ODF1aVJoS3NlYzRFVVBaM3AwVE1aVHRoZCtMR01wMitPOUZER1Y3VWNSUXVMK0pHQXIza29paGJQTXZpeGpLdHVzakVVUFogRHByZEVqRVU1OERaTFJGRGViYTlLbUlvMis3WFJBeGwyMjkyUzhSUXBLYytFekdVYmQ4eklvYXlmZjZHaUtGc1A4OXVpUmlLOWZiUiBJb2F5ZmZFN0VVUFozamxPeEZDMmQrZEVER1g3bzRpaGFNK3VGVEdVN045L2FFM0VVSzRmLytTcGlLRllQLzB2Q0JGRHFYWS82VjlzIFFjbCtXUVlRTVpUcDE0MGVFVU9SZmx2TEV6R1VhTmRqbGoyZ1pQc3Z5SXNZQ3JULzMzSVJNWlRuVzd2VFVMUUQvNzZwaUtFMFAvaGIgVEZDMEYzNHZZaWpadzNQK3RDbVViTS8xL3NnNGxPejUzNjBSTVJSczUzTnJSQXdGZS9EcU5TS0dnajI3ZG8ySW9XQTdibHNqWWlqWSBqNE5hSW9aaWJiOS9qWWloWUQ4UGFva1lDclh0dmpVaWhvSnR2WGVOaUtGZzYrNVpJMklvMk9JdGEwUU1CVnU0ZTQySW9XUTNyUkV4IGxPeXZhMFFNSlh0MGpZaWhaSGV1MXJDSUlXdVAvRjdFVUxMTmM2czJMR0xJMkIzWHI5NndpQ0ZmRC8xdWdvWkZETm5hT1ZIRElvWmMgTFRtb0pXSW94cGExa3pVc1lzalRsYmROMkxDSUlVc1BuRDlwd3lLR0hDMDdxQ1ZpS01MR1d5ZHZXTVNRbnczM1RkR3dpQ0U3S3cxcSBpUmp5dCs2eXFSb1dNV1JtNVVFdEVVUHVGbTZlc21FUlExNXVtclpoRVVOVy9qNTF3eUtHbk53MWZjTWlob3pjT0VQRElvWjgzTEQ2IG9KYUlJV09UREdxSkdQSTEwYUNXaUNGYnR4ODNXOE1paGp4Y005bWdsb2doVTFkTk9LZ2xZc2pUbGlObmJsakVrSUhKQjdWRUREazYgYi9KQkxSRkRoczQ1dDAvRElvWm9VdzFxaVJpeXMrR0tmZzJMR0dLdHY3eG53eUtHVU5NT2Fva1k4cko0YWUrR1JReUJwaC9VRWpGayBaZnBCTFJGRFRrNFpvbUVSUTVnL0RkS3dpQ0hLUmNNMExHSUljdGhNZzFvaWhseHNQbkdnaGtVTUlhNmJjVkJMeEpDSGEyY2QxQkl4IFpHSDJRUzBSUXc1NkRHcUpHRExRWjFCTHhCQnYwd1dETml4aUdGbS9RUzBSUTdTZWcxb2lobUFieng2NllSSERtRGFjTlhqRElvWVIgOVIvVUVqRkVXbmRHZ29aRkRLTVpZbEJMeEJCbjRaSWtEWXNZeG5KeG1vWkZEQ01aWmxCTHhCRGwrMVFOaXhoR01kU2dsb2doeG1DRCBXaUtHRUNjTU5xZ2xZb2h3NFZ6Q2hrVU15UjA3NEtDV2lHRjh4d3c1cUNWaUdOMVJSNmR0V01TUTFoSEREbXFKR0VhMjZZM1VEWXNZIFV0bzM5S0NXaUdGVW4zNld2bUVSUXpwN2h4L1VFakdNS01XZ2xvaGhQT3ZQSEtWaEVVTWlhUWExUkF4aldUeDlwSVpGREVrc25EWlcgd3lLR0ZPWlBIYTFoRVVNS1g0L1hzSWdoZ1QrTTJMQ0lZWGduajltd2lHRndKeVVjMUJJeHBKZDBVRXZFa056eGMrTTJMR0lZVnVKQiBMUkZEWXFrSHRVUU1hU1VmMUJJeEpQWGRXK00zTEdJWXp1ZnBCN1ZFREFtTk1hZ2xZa2hubEVFdEVVTXlleitKYVZqRU1JeHZYZ3RxIFdNUXdpTEVHdFVRTWFXd2RhMUJMeEpERTRzZHhEWXNZK2h0eFVFdkVrTUQ4aDVFTml4aDZHM05RUzhRd3ZQZGpHeFl4OVBSZWNNTWkgaG42K0duZFFTOFF3c0MvREd4WXg5REg2b0phSVlWRHZqRDZvSldJWTBoZmpEMnFKR0FiMGRzQ2dsb2hoT0c5R0RHcUpHQVlUTTZnbCBZaGpLdm1laTR4VXg5QkUxcUNWaUdFYllvSmFJWVJDN3d3YTFSQXhEMlBacWRMZ2loajRpQjdWRURQMDkvbkYwdGlLR1BuWjlGRjJ0IGlLR1ArWmVqb3hVeDlQSkJkTE1paGw2aUI3VkVEUDI4R0Yyc2lLR1h3K1BIZUVRTVBieVFZOE1paG9tOU94ZmRxNGloanowNURHcUogR0diMmZCYURXaUtHV2YxbkhvTmFJb1laNVRLb0pXS1l6Yk5ybzFNVk1mU3hJNXRCTFJIRExKNTZPanBVRVVNZjIxK1A3bFRFME1mdSBKNk16RlRIMGtkZWdsb2hoV2x0ZmlZNVV4TkRINDA5RU55cGk2R1BYWTlHSmloajZ5RzlRUzhRd2xaZWlBeFV4OVBKdGRKOGlobDRlIGpjNVR4TkRMRDlGMWloaDZ5WE5RUzhRd3FZZm5vdU1VTWZTeDUvcm9Oa1VNZldRN3FDVmltTWpPNTZMTEZESDA4ZURWMFdHS0dQckkgZVZCTHhMQzZIYmRGWnlsaTZDUHZRUzBSdzJxMjN4OGRwWWloajl3SHRVUU1LOXQyWDNTU0lvWSt0dDRiWGFTSW9ZOTE5MFFIS1dMbyBZL0dXNkI1RkRIMHMzQjJkbzRpaGw1dWlheFF4OVBLWDZCaEZETDBVTXFnbFlsakduZEVwaWhoNmVhU1VRUzBSdzVJMnowV1hLR0xvIDQ0NXlCclZFREV0NHFLQkJMUkhEb1hhVzNiQ0lhVjVaZzFvaWhvTnRLV3RRUzhSd2tDc0xHOVFTTVJ6b2dmT2pFeFF4OUZIZW9KYUkgWVg4YmI0ME9VTVRReDRZQ0I3VkVETDhwY2xCTHhQQ3JkWmRGMXlkaTZLUFFRUzBSdzg4V2JvNXVUOFRRUzZtRFdpS0duL3c5dWp3UiBReTkzUlljbll1amx4dWp1UkF5OTNGRHdvSmFJb2ZCQkxSRkQ0WU5hSW9iYmo0dU9Uc1RReHpXRkQycUptTlpkVmZxZ2xvaHAzSllqIG80c1RNZlJSd2FDV2lHbmFlUlVNYW9tWWxwMXpiblJ1SW9ZKzZoalVFakh0Mm5CRmRHd2loajdXWHg3ZG1vaWhqMm9HdFVSTW94WXYgalM1TnhOQkhSWU5hSXFaTkZRMXFpWmdtblJLZG1ZaWhsejlGVnlaaTZPV2k2TWhFREwwY1Z0ZWdsb2hwenVZVG94c1RNZlJ4WFcyRCBXaUttTWRkV042Z2xZdHBTNGFDV2lHbEtqWU5hSXFZbFI5UTRxQ1ZpR3JMcGd1aTZSQXg5VkRxb0pXS2FVZXVnbG9ocHhjYXpvOU1TIE1mU3g0YXpvc2tRTWZWUThxQ1ZpbXJEdWpPaXVSQXg5TEo0ZW5aV0lvWStGUzZLckVqSDBjbkYwVkNLR1hpb2YxQkl4MWZzK09pa1IgUXkvVkQycUptTXJWUDZnbFl1cDJRdjJEV2lLbWFoZk9SZmNrWXVqajJCWUd0VVJNeFk1cFlsQkx4TlRycUtPall4SXg5TkhLb0phSSBxZFdtTjZKVEVqSDBzYStaUVMwUlU2ZFBQNHNPU2NUUXg5NkdCclZFVEkyYUd0UVNNUlZhZjJaMFJTS0dQaG9iMUJJeDFXbHRVRXZFIDFHYmh0T2lFNG9tWWtzMmZHbDFRQmtSTXliNk9EaWdISXFaZy80anVKd3NpcGx3blIrZVRCeEZUckpOYUhOUmFnb2dwVlp1RFdrc1EgTVlVNmZpNDZubHlJbURLMU9xaTFCQkZUcEdZSHRaWWdZa3IwZHJPRFdrc1FNUVg2N3Ezb2NISWlZc3J6ZWNPRFdrc1FNY1ZwZWxCciBDU0ttTkcwUGFpMUJ4QlJtN3lmUjBlUkd4SlRsbTllaW04bU9pQ2xLODROYVN4QXhKZG5hL0tEV0VrUk1RUlkvamc0bVJ5S21IQWExIGxpUmlpakgvWVhRdWVSSXh4ZmdndXBaTWlaaFN2QjhkUzY1RVRDSGVpMjRsV3lLbURGOFoxRnFPaUNuQ2x4cGVsb2dwZ1VHdEZZaVkgQXJ4alVHc0ZJaVovWHhqVVdvbUl5WjVCclpXSm1OeTlhVkJyWlNJbWN3YTFWaU5pOHJidm1laEdzaWRpc21aUWEzVWlKbWNHdFNZZyBZaksyMjZEV0JFUk12cmE5R3QxSEVVUk10Z3hxVFViRTVPcnhqNlByS0lTSXlkU3VqNkxqS0lXSXlkUDh5OUZ0RkVQRTVNbWcxc1JFIFRKWU1hazFPeE9Ub3hlZ3dTaUppTW5TNE1aNHBpSmo4dktEaGFZaVk3THc3RjUxRldVUk1idllZMUpxT2lNbk04d2ExcGlSaTh2TFAgNTZLYktJNkl5WXBCcmVtSm1Kdzh1emE2aUFLSm1JenNNS2cxQXhHVGo2ZWVqdTZoU0NJbUc5dGZqODZoVENJbUY3dWZqSzZoVUNJbSBFd2ExWmlWaThyRDFsZWdXaWlWaXN2RDRFOUVwbEV2RTVHRFhZOUVsRkV6RVpHRCs3dWdRU2laaU12QlNkQWRGRXpIeHZvM09vR3dpIEp0eWowUlVVVHNSRSt5RTZndEtKbUdBR3Rmb1NNYkVlbm90dW9IZ2lKdFNlNjZNVEtKK0lpV1JRYXdBaUp0Qk9nMW9ERURGeEhydzYgK3ZkZkJSRVR4cURXTUVSTWxCMjNSZi82S3lGaWdoalVHb3FJaWJIOS91amZmalZFVEFpRFdzTVJNUkcyM1JmOXk2K0lpQW13OWQ3byBIMzVOUk16NDF0MFQvYnV2aW9nWjNlSXQwVC83dW9pWXNTMFkxQnFXaUJuYlRkRS8rdHFJbUpIOUpmbzNYeDBSTXk2RFdvTVRNYU82IE0vb1hYeUVSTTZaSERHb05UOFNNYVBOYzlBKytSaUptUEhjWTFFcEJ4SXptSVlOYVNZaVlzZXpVY0JvaVppUUd0VklSTWVQWVlsQXIgRlJFemlpc05haVVqWXNid3dQblJ2L1NLaVpnUkdOUktTY1NrdC9IVzZOOTUxVVJNY2h1dWlQNloxMDNFcEdaUUt6RVJrOWk2eTZKLyA1TFVUTVdrWjFFcE94Q1MxY0hQMFQ3eCtJaVlwZzFycGlaaVUvaHo5QTIrQmlFbm9ydWpmZHhORVREbzNSdis4MnlCaWtybkJvTllvIFJFd3FCclZHSW1JU01hZzFGaEdUeHUzSFJmKzJteUZpa3JqR29OWm9SRXdLVnhuVUdvK0lTV0RMa2RFLzdKWjg5SCtyOHYraWY3MzggbTBFdFpyYzIrdWZMdjV4blVJdlppVGdENTV3Yi9UT2daQ0tPWjFDTFhrUWN6cUFXL1lnNDJ2ckxvMzhERkU3RXdReHEwWmVJWXkxZSBHdjBMb0hnaURtVlFpLzVFSE9yaTZQZW5BaUtPZEVyMDgxTURFUWY2VS9UclV3VVJ4N2tvK3ZHcGc0akRIR1pRaTBHSU9Ncm1FNlBmIG5rcUlPTWgxQnJVWWlJaGpYR3RRaTZHSU9JUkJMWVlqNGdnR3RSaVFpQU1jWVZDTEFZbDRmSnN1aUg1MXFpTGkwUm5VWWxnaUhwdEIgTFFZbTRwRnRQRHY2eWFtTmlNZTE0YXpvRjZjNkloNlZRUzJHSitJeHJUc2orcjJwa0loSHRIaDY5SE5USXhHUForR1M2TmVtU2lJZSB6OFhSajAyZFJEd2FnMXFrSWVLeGZCLzkxTlJLeENNeHFFVXFJaDdIU1FhMVNFWEVvempCb0JiSmlIZ01GODVGdnpNVkUvRUlqaldvIFJVSWlUdThZZzFxa0pPTGtqam82K3BHcG00aFRNNmhGWWlKT2JOTWIwVTlNN1VTYzFqNkRXcVFtNHFRKy9TejZnYW1maUZQYWExQ0wgOUVTYzBEZi9GZjI4dEVERTZhdy9NL3AxYVlLSWt6R294VGhFbklwQkxVWWk0a1FXVG90K1dsb2g0alRtVDQxK1dab2g0alMram41WSAyaUhpSlA0Ui9hNDBSTVFwbkJ6OXJMUkV4QWtZMUdKTUloNmVRUzFHSmVMQkhUOFgvYWkwUmNSRE02akZ5RVE4TUlOYWpFM0V3M3JiIG9CWmpFL0dndm5zcitrRnBqNGlIOUxsQkxjWW40Z0VaMUNLQ2lJZGpVSXNRSWg3TTNrK2lINU0yaVhnbzM3d1cvWlkwU3NRRDJXWlEgaXlBaUhzWldnMXBFRWZFZ0ZqK09ma2phSmVJaEdOUWlrSWdITVA5aDlEUFNNaEVQNElQb1Y2UnBJdTd2L2VoSHBHMGk3dTI5NkRlayBjU0x1Nnl1RFdzUVNjVTlmYXBoZ0l1N0hvQmJoUk56TE93YTFDQ2ZpUHI0d3FFVThFZmRnVUlzY2lIaDJieHJVSWdjaW5wbEJMZklnIDRsbnRleWI2N2VCSElwNlJRUzF5SWVMWkdOUWlHeUtleVc2RFdtUkR4TFBZOW1yMHU4R3ZSRHdEZzFya1JNVFRlL3pqNkZlRC9ZaDQgYXJzK2luNDAySitJcHpYL2N2U2J3UUZFUEMyRFdtUkd4RlA2Vy9TTHdVRkVQSjBYb3g4TURpYmlxUnh1aklmc2lIZ2FMMmlZL0loNCBDdS9PUlQ4WEhFckVrOXRqVUlzY2lYaGl6eHZVSWtzaW50US9uNHQrSzFpU2lDZGtVSXRjaVhneXo2Nk5maWxZaG9nbnNzT2dGdGtTIDhTU2VlanI2bldCWklwN0E5dGVqbndtV0orTFY3WDR5K3BWZ0JTSmVsVUV0OGliaTFXeDlKZnFOWUVVaVhzWGpUMFEvRWF4TXhDdmIgOVZqMEM4RXFSTHlpK2J1akh3aFdJK0lWdlJUOVByQXFFYS9rMitqbmdkV0plQVdQUnI4T1RFREV5L3NoK25GZ0VpSmVsa0V0eWlEaSA1VHc4Ri8wMk1CRVJMMlBQOWRGUEE1TVI4ZElNYWxFTUVTOXBwMEV0aWlIaXBUeDRkZlM3d01SRXZBU0RXcFJFeElmYWNWdjBxOEFVIFJId0lnMXFVUmNRSDIzNS85SnZBVkVSOEVJTmFsRWJFQjlwMlgvU0x3SlJFZklDdDkwWS9DRXhMeFB0YmQwLzBlOERVUkx5ZnhWdWkgbndPbUorTGZMQmpVb2tRaS9zMU4wWThCc3hEeHIvNFMvUll3RXhIL3dxQVdoUkx4eis2TWZnbVlrWWgvOG9oQkxVb2w0aDl0bm90KyBDSmlWaVAvdERvTmFsRXZFLy9LUVFTMEtKdUt1MjZsaFNpWmlnMW9VVHNSYkRHcFJ0dVlqdnRLZ0ZvVnJQZUlIem85K0FlaXA4WWdOIGFsRyt0aVBlZUd2MC9VTnZUVWU4NFlybzY0ZitXbzdZb0JaVmFEamlkWmRGWHo0TW9kMklEV3BSaVdZalhyZzUrdXBoR00xR2JGQ0wgV3JRYThaK2pMeDZHMG1qRWQwWGZPd3ltellodmpMNTJHRTZURWQ5Z1VJdUt0Qml4UVMycTBtREVCcldvUzNzUjMzNWM5SjNEb0pxTCArQnFEV2xTbXRZaXZNcWhGYlJxTGVNdVIwUmNPUTJzcllvTmFWS2lwaU04enFFV0ZXb3I0bkhPamJ4c1NhQ2hpZzFyVXFaMklEV3BSIHFXWWlYbjk1OUZWREdxMUViRkNMYWpVUzhlS2wwUmNOcWJRUnNVRXRLdFpHeEJkSFh6T2swMFRFcDBUZk1pVFVRc1Ivakw1a1NLbUIgaUMrS3ZtTklxdjZJRHpPb1JkMnFqM2p6aWRGWERHblZIdkYxQnJXb1hlVVJYMnRRaStyVkhiRkJMUnBRZGNSSEdkU2lBVFZIZklSQiBMVnBRY2NTYkxvaStYQmhEdlJFYjFLSVIxVVpzVUl0VzFCcnh4ck9qYnhaR1VtbkVHODZLdmxnWVM1MFJHOVNpSVZWR3ZPNk02R3VGIDhkUVk4ZUxwMGJjS0k2b3c0b1ZMb2k4VnhsUmZ4UE1YUjk4cGpLcStpQTFxMFpqcUl2NCsra1poWkxWRmJGQ0w1bFFXOFVrR3RXaE8gWFJHZllGQ0w5bFFWOFlWejBkY0o0NnNwNG1NTmF0R2lpaUkreHFBV1Rhb240cU9PanI1TENGRk54QWExYUZVdEVXOTZJL29tSVVnbCBFZTh6cUVXejZvajQwOCtpN3hIQ1ZCSHhYb05hTkt5R2lMOTVMZm9XSVZBRkVhOC9NL29TSVZMNUVSdlVvbkhGUjJ4UWk5YVZIdkhDIGFkRTNDTUVLajNqKzFPZ0xoR2lGUi94MTlQMUJ1TElqL2tmMDlVRzhvaU0rT2ZyMklBTWxSMnhRQzlZVUhmRi9HOVNDTlNWSGZQeGMgOU4xQkZvcU4yS0FXL0tUVWlBMXF3YzhLamZodGcxcndzeklqL3U2dDZIdURiQlFaOGVjR3RlQlhKVVpzVUF2MlUyREVCclZnZitWRiB2UGVUNkR1RHJCUVhzVUV0T0ZCcEVXOHpxQVVIS2l6aXJRYTE0Q0JsUmJ6NGNmUjlRWGFLaXRpZ0ZoeXFwSWpuUDR5K0xjaFFTUkYvIEVIMVprS09DSW40LytxNGdTK1ZFL0Y3MFZVR2Vpb240SzROYXNLUlNJdjVTdzdDMFFpSTJxQVhMS1NQaWR3eHF3WEtLaVBnTGcxcXcgckJJaU5xZ0ZLeWdnNGpjTmFzRUs4by9Zb0Jhc0tQdUk5ejBUZlVXUXQ5d2pOcWdGcThnOFlvTmFzSnE4STk1dFVBdFdrM1hFMjE2TiB2aDdJWDg0Ukc5U0NDV1FjOGVOUFJGOE9sQ0RmaUhkOUZIMDNVSVJzSTU1L09mcHFvQXpaUm14UUN5YVRhOFIvaTc0WUtFV21FYjhZIGZTOVFqRHdqUHR3WUQwd3F5NGhmMERCTUxNZUkzNTJMdmhVb1NJWVI3ekdvQlZQSUwrTG5EV3JCTkxLTCtKL1BSVjhKbENXM2lBMXEgd1pReWkvalp0ZEVYQXFYSksrSWRCclZnV2xsRi9OVFQwZGNCNWNrcDR1MnZSOThHRkNpamlIYy9HWDBaVUtKOEl0NTJYL1JkUUpHeSBpWGpySzlGWEFXWEtKV0tEV2pDalRDTGU5VmowUlVDcDhvaDQvdTdvZTRCaTVSSHhTOUhYQU9YS0l1SnZvMjhCQ3BaRHhJOUdYd0tVIExJT0lmNGkrQXloYWZNUUd0YUNYOElnZm5vdStBaWhiZE1SN3JvKytBU2hjY01RR3RhQ3YySWgzR3RTQ3ZrSWpmdkRxNk0rSDhrVkcgYkZBTEJoQVk4WTdib2o4ZWFoQVhzVUV0R0VSWXhOdnZqLzUwcUVOVXhBYTFZQ0JCRVJ2VWdxSEVSTHoxM3VqdmhtcUVSTHp1bnVqUCBobnBFUkx4NFMvUlhRMFVDSWw0d3FBVURDb2o0cHVodmhxcU1IL0Zmb2o4WjZqSjZ4QWExWUZoalIzeG45QWREYlVhTytCR0RXakN3IGNTUGVQQmY5dlZDZFVTTyt3NkFXREc3TWlCOHlxQVhER3pIaW5ScUdCTWFMMktBV0pERmF4RnNNYWtFU1kwVjhwVUV0U0dPa2lCODQgUC9wRG9WYmpSSHlPUVMxSVpaU0lOOTRhL1psUXJ6RWkzbkJGOUZkQ3hVYUkyS0FXcEpRKzRuV1hSWDhqVkMxNXhBYTFJSzNVRVMvYyBIUDJGVUxuVUVSdlVnc1FTUi96bjZPK0Q2cVdOK0s3b3o0UDZKWTM0eHVpdmd3YWtqUGdHZzFxUVhzS0lEV3JCR05KRmJGQUxScEVzIDR0dVBpLzQwYUVPcWlLOHhxQVhqU0JUeFZRYTFZQ1JwSXQ1eVpQUjNRVE9TUkd4UUM4YVRJdUx6REdyQmVCSkVmTTY1MFI4RkxSaysgWW9OYU1LckJJemFvQmVNYU91TDFsMGQvRVRSbTRJZ05hc0hZaG8xNDhkTG83NEhtREJyeHdpWFJud1B0R1RUaWk2Ty9CaG8wWk1TbiBSSDhNdEdqQWlQOFkvUzNRcE9FaXZpajZVNkJOZzBWOG1FRXRDREZVeEp0UGpQNFNhTlJBRVY5blVBdUNEQlB4dFFhMUlNb2dFUnZVIGdqaERSSHlVUVMySU0wREVSeGpVZ2tEOUk5NTBRZlEzUU5ONlIyeFFDMkwxamRpZ0ZnVHJHZkhHczZNL0FGclhMK0lOWjBXZkg1clggSzJLRFdoQ3ZUOFRyem9nK1BkQW40c1hUb3c4UDlJbllvQlprWWVhSTV5K09QanJ3YnpOSGJGQUw4akJyeE45SEh4ejR5WXdSbnh4OSBidUJuczBWOGtrRXR5TVZNRVo5Z1VBdXlNVXZFRjg1Rm54cjQxUXdSSDJ0UUN6SXlmY1RIR05TQ25Fd2Q4VkZIUng4WjJOKzBFUnZVIGdzeE1HZkdtTjZJUERCeG91b2ozR2RTQzNFd1Y4YWVmUlI4WE9OZzBFZTgxcUFYNW1TTGliMTZMUGl4d3FNa2pYbjltOUZtQkpVd2Mgc1VFdHlOT2tFUnZVZ2t4TkdQSENhZEVIQlpZMldjVHpwMGFmRTFqR1pCRi9IWDFNWURrVFJmeVA2Rk1DeTVva1lvTmFrTEVKSWphbyBCVGxiUGVML05xZ0ZPVnMxNHVQbm9vOElyR1MxaUExcVFlWldpZmdMZzFxUXVaVWpmdHVnRnVSdXhZaS9leXY2ZU1CcVZvcjRjNE5hIGtMOFZJamFvQlNWWVBtS0RXbENFWlNQZSswbjAwWUJKTEJleFFTMG94RElSYnpPb0JZVllPdUt0QnJXZ0ZFdEd2UGh4OUxHQVNTMFYgc1VFdEtNZ1NFYzkvR0gwb1lISkxSUHhCOUptQUtSd2E4ZnZSUndLbWNVakU3MFdmQ0pqS3dSRi9aVkFMeW5KUXhGOXFHQXB6WU1UdiB6a1dmQjVqU0FSRy9ZMUFMaXJOL3hBYTFvRUQ3Uld4UUMwcjBXOFJ2R3RTQ0V2MGFzVUV0S05NdkVlOTdKdm9rd0V4K2p2Z3BnMXBRIHFKOGkzdjU2OURtQUdmMFk4VzZEV2xDc2YwZTg3ZFhvVXdBelcydFFDOHEydG52OGllZ3pBRDJzM2ZWUjlCR0FQbzU4T2ZvRU1MTC8gRDFwd1dmU2xad20rQUFBQUpYUkZXSFJrWVhSbE9tTnlaV0YwWlFBeU1ESXdMVEV5TFRFd1ZERXdPak0xT2pNMUt6QXdPakF3cEpyMCBjUUFBQUNWMFJWaDBaR0YwWlRwdGIyUnBabmtBTWpBeU1DMHhNaTB4TUZReE1Eb3pOVG96TlNzd01Eb3dNTlhIVE0wQUFBQUFTVVZPIFJLNUNZSUk9XCIvPjwvc3ZnPic7XG4gICAgSWNvbnMuc3RyYW5kID0gJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMC43ZW1cIiBpZD1cIkxpdmVsbG9fMVwiIHg9XCIwcHhcIiB5PVwiMHB4XCIgdmlld0JveD1cIjAgMCA5NjMuNzggMTU4Ny40XCIgZW5hYmxlLWJhY2tncm91bmQ9XCJuZXcgMCAwIDk2My43OCAxNTg3LjRcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPjxyZWN0IHN0eWxlPVwiZmlsbDojRkRERDBEO1wiIHg9XCIwLjQ3N1wiIHk9XCI0MTIuODE4XCIgc3Ryb2tlPVwiIzAwMDAwMFwiIHN0cm9rZS1taXRlcmxpbWl0PVwiMTBcIiB3aWR0aD1cIjk2My43ODFcIiBoZWlnaHQ9XCI3NjMuNjM2XCIvPjwvc3ZnPic7XG4gICAgSWNvbnMubm9TZWNvbmRhcnkgPSAnPHN2ZyB4PVwiMHB4XCIgeT1cIjBweFwiIHdpZHRoPVwiMC43ZW1cIiB2aWV3Qm94PVwiMCAwIDk2My43OCAxNTg3LjRcIj48cmVjdCBzdHlsZT1cImZpbGw6IzcwNkY2RjtcIiB4PVwiMC40NzhcIiB5PVwiNjY1LjU0NVwiIHdpZHRoPVwiOTYzLjc4MVwiIGhlaWdodD1cIjI1Ni4zNjRcIi8+PC9zdmc+JztcbiAgICBJY29ucy5oZWxpeCA9ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjAuN2VtXCIgaWQ9XCJMaXZlbGxvXzFcIiB4PVwiMHB4XCIgeT1cIjBweFwiIHZpZXdCb3g9XCIwIDAgOTYzLjc4IDE1ODcuNFwiIGVuYWJsZS1iYWNrZ3JvdW5kPVwibmV3IDAgMCA5NjMuNzggMTU4Ny40XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj48cGF0aCBkPVwiTTAsNjY1LjU0NVwiLz48cGF0aCBzdHlsZT1cImZpbGw6cmdiKDI0MCwwLDEyOCk7XCIgZD1cIk03LDY5MWMtMi44MjUsNTkuNjU5LDguNDM1LDExNi42NTMsNi45NjIsMTc2LjMwOSAgYy0yLjEyNiw4Ni4xMTksOC45OTksMTY4Ljk1MywyMS45NjcsMjUzLjc0YzcuNjczLDUwLjE3LDE2LjE4MywxMDAuMjcxLDI3Ljc2MiwxNDkuNzA2YzE3LjUzOCw3NC44NzMsMzUuNjM1LDE0OC40MDIsODEuODAxLDIxMS4zNSAgYzMzLjAzNyw0NS4wNDUsNzYuNTQyLDY5Ljg1OSwxMzAuNTIxLDc5LjA1NmMxNDcuOTU5LDI1LjIwOCwyMjUuMTg3LTExMS4yMjksMjUxLjkyOS0yMzIuNjc0ICBjMjAuNTUzLTkzLjM0OCwyNi4wMjctMTg4Ljk5NiwzNS45NjMtMjgzLjgyN2MxMi4xNi0xMTYuMDk1LTkuODU0LTI0OS4xMzksNTEuNTM1LTM1NC41MzMgIGMyNi4yMTYtNDUuMDA4LDc5LjkxMi04Ny44MTEsMTM0LjA0NC05My42N2M2NS40OTctNy4wOSwxMTMuNjg5LDUyLjU5LDEzNS4zODQsMTA3LjUwNiAgYzI1LjY0OCw2NC45MjcsMzMuMzIyLDE0MS41NzksNzAuMTg0LDIwMS41MjhjMTcuMjQ0LTE2LjI2MSwxMC4zMjMtNzAuNTcsOS40ODctOTUuMTRjLTEuNTA2LTQ0LjMwNywwLjgyMy04My4zMzktNi45NjEtMTI2Ljk2ICBjLTIwLjM5NS0xMTQuMjc5LTIyLjk5Mi0yMzYuODA0LTU0LjU2NS0zNDcuODA4Qzg2OC4zNCwyMTMuNjc4LDgxMi42NjMtNjIuNjAyLDYyNy4yNTcsMTIuNDU5ICBDNDc5LjUzOCw3Mi4yNjQsNDQ4Ljg5MywyNzcuNzcxLDQzMS4xNDcsNDE3LjE5Yy04LjQ4MSw2Ni42MzItMTMuODU0LDEzMy42MjMtMjIuNTgxLDIwMC4yMjUgIGMtOC40NTcsNjQuNTQ0LTUuOSwxMjcuNTkzLTIyLjQ0NCwxOTEuOTc5Yy0xNy43NTIsNjkuMDg5LTU1LjczOSwxNzYuOTQ3LTEyOS45ODcsMjAyLjk1MmMtMzQuNjMzLDEyLjEyNy03Mi43MjcsNy42NDYtMTA0LTEwLjc4NyAgQzM5LjE5Myw5MzQuOTg3LDU1LjMyNiw3ODYuMTI4LDcsNjgxXCIvPjwvc3ZnPic7XG4gICAgSWNvbnMudHVybiA9ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjAuN2VtXCIgaWQ9XCJMaXZlbGxvXzFcIiB4PVwiMHB4XCIgeT1cIjBweFwiIHZpZXdCb3g9XCIwIDAgOTYzLjc4IDE1ODcuNFwiIGVuYWJsZS1iYWNrZ3JvdW5kPVwibmV3IDAgMCA5NjMuNzggMTU4Ny40XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj48cGF0aCBmaWxsPVwiIzYwODBmZlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBzdHJva2Utd2lkdGg9XCI1XCIgc3Ryb2tlLW1pdGVybGltaXQ9XCIxMFwiIGQ9XCJNMTI2LjgzNiw3MDQuMTQ0Yy00Mi45OTYsMjguNTQtODUuMTAzLTQuNjg4LTEyMy41NDEtMjguMTcgIGM1LjQxNiwzLjMwOS0xLjgwMyw4My4yNDktMS4wMDQsOTMuNDRjMy40MzgsNDMuODg5LDEuMjgyLDgwLjI5OCwyOC43NjMsMTE2LjE3MWM2Mi40NDUsODEuNTE3LDIxMC43NzUsOTQuNDAyLDI2Ny4wMzItMS45MyAgYzUwLjkzOS04Ny4yMjksNDYuMjYzLTE4Ni41NTYsNTMuNDY3LTI4My4zODdjNi4xMS04Mi4xMjUtMS41ODQtMTQ2LjQxLDc2LjIyMS0xOTQuMjUzICBjNjQuNTY3LTM5LjcwNCwxMzYuMzU0LTExLjQyMSwxNjYuNDU3LDU0LjA2NmM2NS42NjYsMTQyLjg1My0xMy4zMTEsMzc1LjAyNSwxNDYuMTg1LDQ3MC41MTEgIGM0NS44MzgsMjcuNDQyLDEwOC41NTYsMjAuNDgzLDE1NS4wMTMtMS42MjFjMjEuNzIzLTEwLjMzNiw1MC4wMTQtMjcuODU4LDYwLjQzMy01MC44MjJjMTEuNzM1LTI1Ljg2OSwyLjk2NS02MC4zMDYsMy43ODctODcuNjYzICBjMS4wNjgtMzUuNTUsOS4zMDItNzkuMjA4LTAuNjI4LTExMy41OTZjLTIwLjYxNywxMC45MDMtMzMuODMyLDMwLjMtNTkuMTQyLDM4Ljg5NmMtMjguNjAxLDkuNzEzLTYwLjc3NywxMC40NzktODIuOTM2LTEzLjEyMiAgYy0yNi4xNzctMjcuODkxLTE5LjQ5Ny03Mi42NDMtMjQuMDEzLTEwNy41MDVjLTcuOTg2LTYxLjY2NC04LjgzMy0xMjQuMzM0LTE0Ljc0OC0xODYuMjI3ICBDNzY2LjM5NywyODUuNjQxLDczOC4yODcsMTYxLjgyLDY1MS4wMDcsNjguODE4QzU4Mi40ODItNC4xOTgsNDU3Ljg2My0xOS44NTgsMzcyLjY5NiwzNC4wMiAgYy03Mi4yNDIsNDUuNzA1LTEyMy45OTEsOTEuNTM0LTE1MS4xNjQsMTc2LjA4OWMtMjkuNzgxLDkyLjY3My0zOC43NzMsMjAwLjI4NS0zOC40NzUsMjk3Ljg2NyAgYzAuMTY3LDU0LjgyLTIuMzQyLDE1MS4zMzQtNDguMjQsMTkwLjE1MkMxMzIuMTU0LDcwMC4zOCwxMjkuNDkzLDcwMi4zOCwxMjYuODM2LDcwNC4xNDR6XCIvPjwvc3ZnPic7XG4gICAgcmV0dXJuIEljb25zO1xufSgpKTtcbmV4cG9ydCB7IEljb25zIH07XG4iLCJ2YXIgT3B0aW9uc01vZGVsID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE9wdGlvbnNNb2RlbCgpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgICAgICAgZm9udFNpemU6ICcxNHB4JyxcbiAgICAgICAgICAgIGNodW5rU2l6ZTogMTAsXG4gICAgICAgICAgICBjaHVua1NlcGFyYXRpb246IDEsXG4gICAgICAgICAgICBlbXB0eUZpbGxlcjogJyAnLFxuICAgICAgICAgICAgaW5kZXhlc0xvY2F0aW9uOiBudWxsLFxuICAgICAgICAgICAgd3JhcExpbmU6IHRydWUsXG4gICAgICAgICAgICB2aWV3ZXJXaWR0aDogJycsXG4gICAgICAgICAgICBkb3RUaHJlc2hvbGQ6IDkwLFxuICAgICAgICAgICAgbGluZVNlcGFyYXRpb246ICc1cHgnLFxuICAgICAgICAgICAgc2VxdWVuY2VDb2xvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgY3VzdG9tUGFsZXR0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgc2VxdWVuY2VDb2xvck1hdHJpeDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgc2VxdWVuY2VDb2xvck1hdHJpeFBhbGV0dGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGNvbnNlbnN1c0NvbG9ySWRlbnRpdHk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGNvbnNlbnN1c0NvbG9yTWFwcGluZzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgc2VsZWN0aW9uOiB1bmRlZmluZWRcbiAgICAgICAgfTtcbiAgICB9XG4gICAgT3B0aW9uc01vZGVsLnByb3RvdHlwZS5wcm9jZXNzID0gZnVuY3Rpb24gKG9wdCwgY29uc2Vuc3VzKSB7XG4gICAgICAgIC8qKiBjaGVjayBpbnB1dCBmb250U2l6ZSAqL1xuICAgICAgICBpZiAob3B0ICYmIG9wdC5mb250U2l6ZSkge1xuICAgICAgICAgICAgdmFyIGZTaXplID0gb3B0LmZvbnRTaXplO1xuICAgICAgICAgICAgdmFyIGZOdW0gPSArZlNpemUuc3Vic3RyKDAsIGZTaXplLmxlbmd0aCAtIDIpO1xuICAgICAgICAgICAgdmFyIGZVbml0ID0gZlNpemUuc3Vic3RyKGZTaXplLmxlbmd0aCAtIDIsIDIpO1xuICAgICAgICAgICAgaWYgKGlzTmFOKGZOdW0pIHx8IChmVW5pdCAhPT0gJ3B4JyAmJiBmVW5pdCAhPT0gJ3Z3JyAmJiBmVW5pdCAhPT0gJ2VtJykpIHtcbiAgICAgICAgICAgICAgICAvLyB3cm9uZyBmb250U2l6ZSBmb3JtYXRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5mb250U2l6ZSA9IGZTaXplO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gZm9udFNpemUgbm90IHNldFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmZvbnRTaXplID0gJzE0cHgnOyAvLyBkZWZhdWx0IHJlc2V0XG4gICAgICAgIH1cbiAgICAgICAgLyoqIGNoZWNrIGlucHV0IGNodW5rU2l6ZSAqL1xuICAgICAgICBpZiAob3B0ICYmIG9wdC5jaHVua1NpemUpIHtcbiAgICAgICAgICAgIHZhciBjU2l6ZSA9ICtvcHQuY2h1bmtTaXplO1xuICAgICAgICAgICAgaWYgKGlzTmFOKGNTaXplKSB8fCBjU2l6ZSA8IDApIHtcbiAgICAgICAgICAgICAgICAvLyB3cm9uZyBjaHVua1NpemUgZm9ybWF0XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuY2h1bmtTaXplID0gY1NpemU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLyoqIGNoZWNrIGlucHV0IHNwYWNlU2l6ZSAqL1xuICAgICAgICBpZiAob3B0ICYmIG9wdC5jaHVua1NlcGFyYXRpb24pIHtcbiAgICAgICAgICAgIHZhciBjaHVua1NlcGFyYXRpb24gPSArb3B0LmNodW5rU2VwYXJhdGlvbjtcbiAgICAgICAgICAgIGlmIChjaHVua1NlcGFyYXRpb24gPj0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5jaHVua1NlcGFyYXRpb24gPSBjaHVua1NlcGFyYXRpb247XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdCAmJiBvcHQuY2h1bmtTaXplID09IDApIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5jaHVua1NpemUgPSAxO1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmNodW5rU2VwYXJhdGlvbiA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgLyoqIGNoZWNrIGluZGV4ZXNMb2NhdGlvbiB2YWx1ZSAqL1xuICAgICAgICBpZiAob3B0ICYmIG9wdC5pbmRleGVzTG9jYXRpb24pIHtcbiAgICAgICAgICAgIGlmIChvcHQuaW5kZXhlc0xvY2F0aW9uID09IFwidG9wXCIgfHwgb3B0LmluZGV4ZXNMb2NhdGlvbiA9PSBcImxhdGVyYWxcIikge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5pbmRleGVzTG9jYXRpb24gPSBvcHQuaW5kZXhlc0xvY2F0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8qKiBjaGVjayBzZWxlY3Rpb24gdmFsdWUgKi9cbiAgICAgICAgaWYgKG9wdCAmJiBvcHQuc2VsZWN0aW9uKSB7XG4gICAgICAgICAgICBpZiAob3B0LnNlbGVjdGlvbiA9PSBcImNvbHVtbnNlbGVjdGlvblwiIHx8IG9wdC5zZWxlY3Rpb24gPT0gXCJhcmVhc2VsZWN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuc2VsZWN0aW9uID0gb3B0LnNlbGVjdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKiogY2hlY2sgc2VxdWVuY2VDb2xvciB2YWx1ZSAqL1xuICAgICAgICBpZiAob3B0ICYmIG9wdC5zZXF1ZW5jZUNvbG9yKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdC5zZXF1ZW5jZUNvbG9yICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMob3B0LnNlcXVlbmNlQ29sb3IpO1xuICAgICAgICAgICAgICAgIGlmIChrZXlzWzBdLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuc2VxdWVuY2VDb2xvciA9ICdjdXN0b20nO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuY3VzdG9tUGFsZXR0ZSA9IG9wdC5zZXF1ZW5jZUNvbG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnNlcXVlbmNlQ29sb3JNYXRyaXggPSAnY3VzdG9tJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnNlcXVlbmNlQ29sb3JNYXRyaXhQYWxldHRlID0gb3B0LnNlcXVlbmNlQ29sb3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKG9wdC5zZXF1ZW5jZUNvbG9yID09PSBcImJsb3N1bTYyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnNlcXVlbmNlQ29sb3JNYXRyaXggPSBvcHQuc2VxdWVuY2VDb2xvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAob3B0LnNlcXVlbmNlQ29sb3IgPT09IFwiY2x1c3RhbFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zZXF1ZW5jZUNvbG9yID0gb3B0LnNlcXVlbmNlQ29sb3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8qKiBjaGVjayBjb25zZW5zdXNUeXBlIHZhbHVlICovXG4gICAgICAgIGlmIChjb25zZW5zdXMgJiYgY29uc2Vuc3VzLmNvbG9yKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNlbnN1cy5jb2xvciAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGNvbnNlbnN1cy5jb2xvcik7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAoa2V5c1swXSkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5jb25zZW5zdXNDb2xvcklkZW50aXR5ID0gY29uc2Vuc3VzLmNvbG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmNvbnNlbnN1c0NvbG9yTWFwcGluZyA9IGNvbnNlbnN1cy5jb2xvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoY29uc2Vuc3VzLmNvbG9yID09PSBcImlkZW50aXR5XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmNvbnNlbnN1c0NvbG9ySWRlbnRpdHkgPSBjb25zZW5zdXMuY29sb3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNvbnNlbnN1cy5jb2xvciA9PT0gXCJwaHlzaWNhbFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5jb25zZW5zdXNDb2xvck1hcHBpbmcgPSBjb25zZW5zdXMuY29sb3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8qKiBjaGVjayBjb25zZW5zdXNUaHJlc2hvbGQgdmFsdWUgKi9cbiAgICAgICAgaWYgKGNvbnNlbnN1cyAmJiBjb25zZW5zdXMuZG90VGhyZXNob2xkKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNlbnN1cy5kb3RUaHJlc2hvbGQgPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZG90VGhyZXNob2xkID0gY29uc2Vuc3VzLmRvdFRocmVzaG9sZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKiogY2hlY2sgcm93TWFyZ2luQm90dG9tIHZhbHVlICovXG4gICAgICAgIGlmIChvcHQgJiYgb3B0LmxpbmVTZXBhcmF0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZhciByU2l6ZSA9IG9wdC5saW5lU2VwYXJhdGlvbjtcbiAgICAgICAgICAgIHZhciByTnVtID0gK3JTaXplLnN1YnN0cigwLCByU2l6ZS5sZW5ndGggLSAyKTtcbiAgICAgICAgICAgIHZhciByVW5pdCA9IHJTaXplLnN1YnN0cihyU2l6ZS5sZW5ndGggLSAyLCAyKTtcbiAgICAgICAgICAgIGlmIChpc05hTihyTnVtKSB8fCAoclVuaXQgIT09ICdweCcgJiYgclVuaXQgIT09ICd2dycgJiYgclVuaXQgIT09ICdlbScpKSB7XG4gICAgICAgICAgICAgICAgLy8gd3JvbmcgbGluZVNlcGFyYXRpb24gZm9ybWF0XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMubGluZVNlcGFyYXRpb24gPSByU2l6ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGxpbmVTZXBhcmF0aW9uIG5vdCBzZXRcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5saW5lU2VwYXJhdGlvbiA9ICc1cHgnOyAvLyBkZWZhdWx0IHJlc2V0XG4gICAgICAgIH1cbiAgICAgICAgLyoqIGNoZWNrIHdyYXBsaW5lIHZhbHVlICovXG4gICAgICAgIGlmIChvcHQgJiYgdHlwZW9mIG9wdC53cmFwTGluZSA9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy53cmFwTGluZSA9IG9wdC53cmFwTGluZTtcbiAgICAgICAgfVxuICAgICAgICAvKiogY2hlY2sgb25lTGluZVdpZHRoICovXG4gICAgICAgIGlmIChvcHQgJiYgb3B0LnZpZXdlcldpZHRoKSB7XG4gICAgICAgICAgICB2YXIgdmlld2VyV2lkdGggPSBvcHQudmlld2VyV2lkdGg7XG4gICAgICAgICAgICB2YXIgb2xOdW0gPSArdmlld2VyV2lkdGguc3Vic3RyKDAsIHZpZXdlcldpZHRoLmxlbmd0aCAtIDIpO1xuICAgICAgICAgICAgdmFyIG9sVW5pdCA9IHZpZXdlcldpZHRoLnN1YnN0cih2aWV3ZXJXaWR0aC5sZW5ndGggLSAyLCAyKTtcbiAgICAgICAgICAgIGlmIChpc05hTihvbE51bSkgfHwgKG9sVW5pdCAhPT0gJ3B4JyAmJiBvbFVuaXQgIT09ICd2dycgJiYgb2xVbml0ICE9PSAnZW0nKSkge1xuICAgICAgICAgICAgICAgIC8vIHdyb25nIG9uZUxpbmVXaWR0aCBmb3JtYXRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy52aWV3ZXJXaWR0aCA9IHZpZXdlcldpZHRoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnM7XG4gICAgfTtcbiAgICByZXR1cm4gT3B0aW9uc01vZGVsO1xufSgpKTtcbmV4cG9ydCB7IE9wdGlvbnNNb2RlbCB9O1xuIiwidmFyIFBhbGV0dGVzID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFBhbGV0dGVzKCkge1xuICAgIH1cbiAgICAvLyBBQSBwcm9wZW5zaXRpZXNcbiAgICBQYWxldHRlcy5jbHVzdGFsID0ge1xuICAgICAgICBBOiAnIzgwYTBmMCcsIEk6ICcjODBhMGYwJywgTDogJyM4MGEwZjAnLCBNOiAnIzgwYTBmMCcsIEY6ICcjODBhMGYwJywgVzogJyM4MGEwZjAnLCBWOiAnIzgwYTBmMCcsXG4gICAgICAgIEs6ICcjZjAxNTA1JywgUjogJyNmMDE1MDUnLCBFOiAnI2MwNDhjMCcsIEQ6ICcjYzA0OGMwJywgQzogJyNmMDgwODAnLCBHOiAnI2YwOTA0OCcsXG4gICAgICAgIE46ICcjMTVjMDE1JywgUTogJyMxNWMwMTUnLCBTOiAnIzE1YzAxNScsIFQ6ICcjMTVjMDE1JywgUDogJyNjMGMwMDAnLCBIOiAnIzE1YTRhNCcsIFk6ICcjMTVhNGE0J1xuICAgIH07XG4gICAgUGFsZXR0ZXMuemFwcG8gPSB7XG4gICAgICAgIEE6ICcjZmZhZmFmJywgUjogJyM2NDY0ZmYnLCBOOiAnIzAwZmYwMCcsIEQ6ICcjZmYwMDAwJywgQzogJyNmZmZmMDAnLCBROiAnIzAwZmYwMCcsIEU6ICcjZmYwMDAwJyxcbiAgICAgICAgRzogJyNmZjAwZmYnLCBIOiAnIzY0NjRmZicsIEk6ICcjZmZhZmFmJywgTDogJyNmZmFmYWYnLCBLOiAnI2ZmYWZhZicsIE06ICcjZmZjODAwJywgRjogJyNmZjAwZmYnLFxuICAgICAgICBQOiAnIzAwZmYwMCcsIFM6ICcjMDBmZjAwJywgVDogJyMxNWMwMTUnLCBXOiAnI2ZmYzgwMCcsIFY6ICcjZmZjODAwJywgWTogJyNmZmFmYWYnXG4gICAgfTtcbiAgICBQYWxldHRlcy50YXlsb3IgPSB7XG4gICAgICAgIEE6ICcjY2NmZjAwJywgUjogJyMwMDAwZmYnLCBOOiAnI2NjMDBmZicsIEQ6ICcjZmYwMDAwJywgQzogJyNmZmZmMDAnLCBROiAnI2ZmMDBjYycsIEU6ICcjZmYwMDY2JyxcbiAgICAgICAgRzogJyNmZjk5MDAnLCBIOiAnIzAwNjZmZicsIEk6ICcjNjZmZjAwJywgTDogJyMzM2ZmMDAnLCBLOiAnIzY2MDBmZicsIE06ICcjMDBmZjAwJywgRjogJyMwMGZmNjYnLFxuICAgICAgICBQOiAnI2ZmY2MwMCcsIFM6ICcjZmYzMzAwJywgVDogJyNmZjY2MDAnLCBXOiAnIzAwY2NmZicsIFY6ICcjMDBmZmNjJywgWTogJyM5OWZmMDAnXG4gICAgfTtcbiAgICBQYWxldHRlcy5oeWRyb3Bob2JpY2l0eSA9IHtcbiAgICAgICAgQTogJyNhZDAwNTInLCBSOiAnIzAwMDBmZicsIE46ICcjMGMwMGYzJywgRDogJyMwYzAwZjMnLCBDOiAnI2MyMDAzZCcsIFE6ICcjMGMwMGYzJywgRTogJyMwYzAwZjMnLFxuICAgICAgICBHOiAnIzZhMDA5NScsIEg6ICcjMTUwMGVhJywgSTogJyNmZjAwMDAnLCBMOiAnI2VhMDAxNScsIEs6ICcjMDAwMGZmJywgTTogJyNiMDAwNGYnLCBGOiAnI2NiMDAzNCcsXG4gICAgICAgIFA6ICcjNDYwMGI5JywgUzogJyM1ZTAwYTEnLCBUOiAnIzYxMDA5ZScsIFc6ICcjNWIwMGE0JywgVjogJyM0ZjAwYjAnLCBZOiAnI2Y2MDAwOScsXG4gICAgICAgIEI6ICcjMGMwMGYzJywgWDogJyM2ODAwOTcnLCBaOiAnIzBjMDBmMydcbiAgICB9O1xuICAgIFBhbGV0dGVzLmhlbGl4cHJvcGVuc2l0eSA9IHtcbiAgICAgICAgQTogJyNlNzE4ZTcnLCBSOiAnIzZmOTA2ZicsIE46ICcjMWJlNDFiJywgRDogJyM3Nzg4NzcnLCBDOiAnIzIzZGMyMycsIFE6ICcjOTI2ZDkyJywgRTogJyNmZjAwZmYnLFxuICAgICAgICBHOiAnIzAwZmYwMCcsIEg6ICcjNzU4YTc1JywgSTogJyM4YTc1OGEnLCBMOiAnI2FlNTFhZScsIEs6ICcjYTA1ZmEwJywgTTogJyNlZjEwZWYnLCBGOiAnIzk4Njc5OCcsXG4gICAgICAgIFA6ICcjMDBmZjAwJywgUzogJyMzNmM5MzYnLCBUOiAnIzQ3Yjg0NycsIFc6ICcjOGE3NThhJywgVjogJyMyMWRlMjEnLCBZOiAnIzg1N2E4NScsXG4gICAgICAgIEI6ICcjNDliNjQ5JywgWDogJyM3NThhNzUnLCBaOiAnI2M5MzZjOSdcbiAgICB9O1xuICAgIFBhbGV0dGVzLnN0cmFuZHByb3BlbnNpdHkgPSB7XG4gICAgICAgIEE6ICcjNTg1OGE3JywgUjogJyM2YjZiOTQnLCBOOiAnIzY0NjQ5YicsIEQ6ICcjMjEyMWRlJywgQzogJyM5ZDlkNjInLCBROiAnIzhjOGM3MycsIEU6ICcjMDAwMGZmJyxcbiAgICAgICAgRzogJyM0OTQ5YjYnLCBIOiAnIzYwNjA5ZicsIEk6ICcjZWNlYzEzJywgTDogJyNiMmIyNGQnLCBLOiAnIzQ3NDdiOCcsIE06ICcjODI4MjdkJywgRjogJyNjMmMyM2QnLFxuICAgICAgICBQOiAnIzIzMjNkYycsIFM6ICcjNDk0OWI2JywgVDogJyM5ZDlkNjInLCBXOiAnI2MwYzAzZicsIFY6ICcjZDNkMzJjJywgWTogJyNmZmZmMDAnLFxuICAgICAgICBCOiAnIzQzNDNiYycsIFg6ICcjNzk3OTg2JywgWjogJyM0NzQ3YjgnXG4gICAgfTtcbiAgICBQYWxldHRlcy50dXJucHJvcGVuc2l0eSA9IHtcbiAgICAgICAgQTogJyMyY2QzZDMnLCBSOiAnIzcwOGY4ZicsIE46ICcjZmYwMDAwJywgRDogJyNlODE3MTcnLCBDOiAnI2E4NTc1NycsIFE6ICcjM2ZjMGMwJywgRTogJyM3Nzg4ODgnLFxuICAgICAgICBHOiAnI2ZmMDAwMCcsIEg6ICcjNzA4ZjhmJywgSTogJyMwMGZmZmYnLCBMOiAnIzFjZTNlMycsIEs6ICcjN2U4MTgxJywgTTogJyMxZWUxZTEnLCBGOiAnIzFlZTFlMScsXG4gICAgICAgIFA6ICcjZjYwOTA5JywgUzogJyNlMTFlMWUnLCBUOiAnIzczOGM4YycsIFc6ICcjNzM4YzhjJywgVjogJyM5ZDYyNjInLCBZOiAnIzA3ZjhmOCcsXG4gICAgICAgIEI6ICcjZjMwYzBjJywgWDogJyM3YzgzODMnLCBaOiAnIzViYTRhNCdcbiAgICB9O1xuICAgIFBhbGV0dGVzLmJ1cmllZGluZGV4ID0ge1xuICAgICAgICBBOiAnIzAwYTM1YycsIFI6ICcjMDBmYzAzJywgTjogJyMwMGViMTQnLCBEOiAnIzAwZWIxNCcsIEM6ICcjMDAwMGZmJywgUTogJyMwMGYxMGUnLCBFOiAnIzAwZjEwZScsXG4gICAgICAgIEc6ICcjMDA5ZDYyJywgSDogJyMwMGQ1MmEnLCBJOiAnIzAwNTRhYicsIEw6ICcjMDA3Yjg0JywgSzogJyMwMGZmMDAnLCBNOiAnIzAwOTc2OCcsIEY6ICcjMDA4Nzc4JyxcbiAgICAgICAgUDogJyMwMGUwMWYnLCBTOiAnIzAwZDUyYScsIFQ6ICcjMDBkYjI0JywgVzogJyMwMGE4NTcnLCBWOiAnIzAwZTYxOScsIFk6ICcjMDA1ZmEwJyxcbiAgICAgICAgQjogJyMwMGViMTQnLCBYOiAnIzAwYjY0OScsIFo6ICcjMDBmMTBlJ1xuICAgIH07XG4gICAgUGFsZXR0ZXMubnVjbGVvdGlkZSA9IHtcbiAgICAgICAgQTogJyM2NEY3M0YnLCBDOiAnI0ZGQjM0MCcsIEc6ICcjRUI0MTNDJywgVDogJyMzQzg4RUUnLCBVOiAnIzNDODhFRSdcbiAgICB9O1xuICAgIFBhbGV0dGVzLnB1cmluZXB5cmltaWRpbmUgPSB7XG4gICAgICAgIEE6ICcjRkY4M0ZBJywgQzogJyM0MEUwRDAnLCBHOiAnI0ZGODNGQScsIFQ6ICcjNDBFMEQwJywgVTogJyM0MEUwRDAnLCBSOiAnI0ZGODNGQScsIFk6ICcjNDBFMEQwJ1xuICAgIH07XG4gICAgUGFsZXR0ZXMuY29uc2Vuc3VzTGV2ZWxzSWRlbnRpdHkgPSB7XG4gICAgICAgIDEwMDogWycjMEEwQTBBJywgJyNGRkZGRkYnXSxcbiAgICAgICAgNzA6IFsnIzMzMzMzMycsICcjRkZGRkZGJ10sXG4gICAgICAgIDQwOiBbJyM3MDcwNzAnLCAnI0ZGRkZGRiddLFxuICAgICAgICAxMDogWycjQTNBM0EzJywgJyNGRkZGRkYnXSxcbiAgICAgICAgMDogWycjRkZGRkZGJywgJyNGRkZGRkYnXVxuICAgIH07XG4gICAgLy8gY29sb3VyIHNjaGVtZSBpbiBMZXNrLCBJbnRyb2R1Y3Rpb24gdG8gQmlvaW5mb3JtYXRpY3NcbiAgICBQYWxldHRlcy5jb25zZW5zdXNBYUxlc2sgPSB7XG4gICAgICAgIEE6IFsnbicsICcjZjA5MDQ4JywgJyNGRkZGRkYnXSxcbiAgICAgICAgRzogWyduJywgJyNmMDkwNDgnLCAnI0ZGRkZGRiddLFxuICAgICAgICBTOiBbJ24nLCAnI2YwOTA0OCcsICcjRkZGRkZGJ10sXG4gICAgICAgIFQ6IFsnbicsICcjZjA5MDQ4JywgJyNGRkZGRkYnXSxcbiAgICAgICAgQzogWydoJywgJyM1NThCNkUnLCAnI0ZGRkZGRiddLFxuICAgICAgICBWOiBbJ2gnLCAnIzU1OEI2RScsICcjRkZGRkZGJ10sXG4gICAgICAgIEk6IFsnaCcsICcjNTU4QjZFJywgJyNGRkZGRkYnXSxcbiAgICAgICAgTDogWydoJywgJyM1NThCNkUnLCAnI0ZGRkZGRiddLFxuICAgICAgICBQOiBbJ2gnLCAnIzU1OEI2RScsICcjRkZGRkZGJ10sXG4gICAgICAgIEY6IFsnaCcsICcjNTU4QjZFJywgJyNGRkZGRkYnXSxcbiAgICAgICAgWTogWydoJywgJyM1NThCNkUnLCAnI0ZGRkZGRiddLFxuICAgICAgICBNOiBbJ2gnLCAnIzU1OEI2RScsICcjRkZGRkZGJ10sXG4gICAgICAgIFc6IFsnaCcsICcjNTU4QjZFJywgJyNGRkZGRkYnXSxcbiAgICAgICAgTjogWydwJywgJyNENDM1OEQnLCAnI0ZGRkZGRiddLFxuICAgICAgICBROiBbJ3AnLCAnI0Q0MzU4RCcsICcjRkZGRkZGJ10sXG4gICAgICAgIEg6IFsncCcsICcjRDQzNThEJywgJyNGRkZGRkYnXSxcbiAgICAgICAgRDogWyd+JywgJyNBMTA3MDInLCAnI0ZGRkZGRiddLFxuICAgICAgICBFOiBbJ34nLCAnI0ExMDcwMicsICcjRkZGRkZGJ10sXG4gICAgICAgIEs6IFsnKycsICcjMzYyNkE3JywgJyNGRkZGRkYnXSxcbiAgICAgICAgUjogWycrJywgJyMzNjI2QTcnLCAnI0ZGRkZGRiddIC8vICs6IHBvc2l0aXZlbHkgY2hhcmdlZFxuICAgIH07XG4gICAgUGFsZXR0ZXMuc3Vic3RpdHV0aW9uTWF0cml4Qmxvc3VtID0geyBXRjogWycjQ0ZEQkYyJywgJyMwMDAwMDAnXSwgUVE6IFsnI0ExQjhFMycsICcjMDAwMDAwJ10sXG4gICAgICAgIEhIOiBbJyM3Mjk0RDUnLCAnIzAwMDAwMCddLCBZWTogWycjODFBMEQ5JywgJyMwMDAwMDAnXSwgWlo6IFsnI0ExQjhFMycsICcjMDAwMDAwJ10sXG4gICAgICAgIENDOiBbJyM2Mjg4RDAnLCAnIzAwMDAwMCddLCBQUDogWycjODFBMEQ5JywgJyMwMDAwMDAnXSwgVkk6IFsnI0IwQzRFOCcsICcjMDAwMDAwJ10sXG4gICAgICAgIFZNOiBbJyNDRkRCRjInLCAnIzAwMDAwMCddLCBLSzogWycjQTFCOEUzJywgJyMwMDAwMDAnXSwgWks6IFsnI0NGREJGMicsICcjMDAwMDAwJ10sXG4gICAgICAgIEROOiBbJyNDRkRCRjInLCAnIzAwMDAwMCddLCBTUzogWycjQTFCOEUzJywgJyMwMDAwMDAnXSwgUVI6IFsnI0NGREJGMicsICcjMDAwMDAwJ10sXG4gICAgICAgIE5OOiBbJyM5MUFDREUnLCAnIzAwMDAwMCddLCBZRjogWycjQjBDNEU4JywgJyMwMDAwMDAnXSwgVkw6IFsnI0NGREJGMicsICcjMDAwMDAwJ10sXG4gICAgICAgIEtSOiBbJyNDMENGRUQnLCAnIzAwMDAwMCddLCBFRDogWycjQzBDRkVEJywgJyMwMDAwMDAnXSwgVlY6IFsnI0ExQjhFMycsICcjMDAwMDAwJ10sXG4gICAgICAgIE1JOiBbJyNDRkRCRjInLCAnIzAwMDAwMCddLCBNTTogWycjQTFCOEUzJywgJyMwMDAwMDAnXSwgWkQ6IFsnI0NGREJGMicsICcjMDAwMDAwJ10sXG4gICAgICAgIEZGOiBbJyM5MUFDREUnLCAnIzAwMDAwMCddLCBCRDogWycjQTFCOEUzJywgJyMwMDAwMDAnXSwgSE46IFsnI0NGREJGMicsICcjMDAwMDAwJ10sXG4gICAgICAgIFRUOiBbJyNBMUI4RTMnLCAnIzAwMDAwMCddLCBTTjogWycjQ0ZEQkYyJywgJyMwMDAwMDAnXSwgTEw6IFsnI0ExQjhFMycsICcjMDAwMDAwJ10sXG4gICAgICAgIEVROiBbJyNDMENGRUQnLCAnIzAwMDAwMCddLCBZVzogWycjQzBDRkVEJywgJyMwMDAwMDAnXSwgRUU6IFsnI0ExQjhFMycsICcjMDAwMDAwJ10sXG4gICAgICAgIEtROiBbJyNDRkRCRjInLCAnIzAwMDAwMCddLCBXVzogWycjMzg2N0JDJywgJyMwMDAwMDAnXSwgTUw6IFsnI0MwQ0ZFRCcsICcjMDAwMDAwJ10sXG4gICAgICAgIEtFOiBbJyNDRkRCRjInLCAnIzAwMDAwMCddLCBaRTogWycjQTFCOEUzJywgJyMwMDAwMDAnXSwgWlE6IFsnI0IwQzRFOCcsICcjMDAwMDAwJ10sXG4gICAgICAgIEJFOiBbJyNDRkRCRjInLCAnIzAwMDAwMCddLCBERDogWycjOTFBQ0RFJywgJyMwMDAwMDAnXSwgU0E6IFsnI0NGREJGMicsICcjMDAwMDAwJ10sXG4gICAgICAgIFlIOiBbJyNDMENGRUQnLCAnIzAwMDAwMCddLCBHRzogWycjOTFBQ0RFJywgJyMwMDAwMDAnXSwgQUE6IFsnI0ExQjhFMycsICcjMDAwMDAwJ10sXG4gICAgICAgIElJOiBbJyNBMUI4RTMnLCAnIzAwMDAwMCddLCBUUzogWycjQ0ZEQkYyJywgJyMwMDAwMDAnXSwgUlI6IFsnI0ExQjhFMycsICcjMDAwMDAwJ10sXG4gICAgICAgIExJOiBbJyNDMENGRUQnLCAnIzAwMDAwMCddLCBaQjogWycjQ0ZEQkYyJywgJyMwMDAwMDAnXSwgQk46IFsnI0IwQzRFOCcsICcjMDAwMDAwJ10sXG4gICAgICAgIEJCOiBbJyNBMUI4RTMnLCAnIzAwMDAwMCddXG4gICAgfTtcbiAgICByZXR1cm4gUGFsZXR0ZXM7XG59KCkpO1xuZXhwb3J0IHsgUGFsZXR0ZXMgfTtcbiIsInZhciBQYXR0ZXJuc01vZGVsID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFBhdHRlcm5zTW9kZWwoKSB7XG4gICAgfVxuICAgIC8vIGZpbmQgaW5kZXggb2YgbWF0Y2hlZCByZWdleCBwb3NpdGlvbnMgYW5kIGNyZWF0ZSBhcnJheSBvZiByZWdpb25zIHdpdGggY29sb3JcbiAgICBQYXR0ZXJuc01vZGVsLnByb3RvdHlwZS5wcm9jZXNzID0gZnVuY3Rpb24gKHBhdHRlcm5zLCBzZXF1ZW5jZXMpIHtcbiAgICAgICAgaWYgKCFwYXR0ZXJucykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZWdpb25zID0gW107IC8vIE91dFBhdHRlcm5zXG4gICAgICAgIHZhciBfbG9vcF8xID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1jb25kaXRpb25hbC1hc3NpZ25tZW50XG4gICAgICAgICAgICB2YXIgcGF0dGVybiA9IGVsZW1lbnQucGF0dGVybjtcbiAgICAgICAgICAgIHZhciBzdHIgPSB2b2lkIDA7XG4gICAgICAgICAgICBpZiAoc2VxdWVuY2VzLmZpbmQoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHguaWQgPT09IGVsZW1lbnQuc2VxdWVuY2VJZDsgfSkpIHtcbiAgICAgICAgICAgICAgICBzdHIgPSBzZXF1ZW5jZXMuZmluZChmdW5jdGlvbiAoeCkgeyByZXR1cm4geC5pZCA9PT0gZWxlbWVudC5zZXF1ZW5jZUlkOyB9KS5zZXF1ZW5jZTtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5zdGFydCAmJiBlbGVtZW50LmVuZCkge1xuICAgICAgICAgICAgICAgICAgICBzdHIgPSBzdHIuc3Vic3RyKGVsZW1lbnQuc3RhcnQgLSAxLCBlbGVtZW50LmVuZCAtIChlbGVtZW50LnN0YXJ0IC0gMSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzXzEucmVnZXhNYXRjaChzdHIsIHBhdHRlcm4sIHJlZ2lvbnMsIGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2EgPSAwLCBzZXF1ZW5jZXNfMSA9IHNlcXVlbmNlczsgX2EgPCBzZXF1ZW5jZXNfMS5sZW5ndGg7IF9hKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlcSA9IHNlcXVlbmNlc18xW19hXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVnZXhcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuc3RhcnQgJiYgZWxlbWVudC5lbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ciA9IHNlcS5zZXF1ZW5jZS5zdWJzdHIoZWxlbWVudC5zdGFydCAtIDEsIGVsZW1lbnQuZW5kIC0gKGVsZW1lbnQuc3RhcnQgLSAxKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpc18xLnJlZ2V4TWF0Y2goc3RyLCBwYXR0ZXJuLCByZWdpb25zLCBlbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHZhciB0aGlzXzEgPSB0aGlzO1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgcGF0dGVybnNfMSA9IHBhdHRlcm5zOyBfaSA8IHBhdHRlcm5zXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IHBhdHRlcm5zXzFbX2ldO1xuICAgICAgICAgICAgX2xvb3BfMShlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVnaW9ucztcbiAgICB9O1xuICAgIFBhdHRlcm5zTW9kZWwucHJvdG90eXBlLnJlZ2V4TWF0Y2ggPSBmdW5jdGlvbiAoc3RyLCBwYXR0ZXJuLCByZWdpb25zLCBlbGVtZW50KSB7XG4gICAgICAgIHZhciByZSA9IG5ldyBSZWdFeHAocGF0dGVybiwgXCJnXCIpO1xuICAgICAgICB2YXIgbWF0Y2g7XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1jb25kaXRpb25hbC1hc3NpZ25tZW50XG4gICAgICAgIHdoaWxlICgobWF0Y2ggPSByZS5leGVjKHN0cikpICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJlZ2lvbnMucHVzaCh7IHN0YXJ0OiArbWF0Y2guaW5kZXggKyAxLCBlbmQ6ICttYXRjaC5pbmRleCArICttYXRjaFswXS5sZW5ndGgsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBlbGVtZW50LmJhY2tncm91bmRDb2xvciwgY29sb3I6IGVsZW1lbnQuY29sb3IsIGJhY2tncm91bmRJbWFnZTogZWxlbWVudC5iYWNrZ3JvdW5kSW1hZ2UsXG4gICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6IGVsZW1lbnQuYm9yZGVyQ29sb3IsIGJvcmRlclN0eWxlOiBlbGVtZW50LmJvcmRlclN0eWxlLCBzZXF1ZW5jZUlkOiBlbGVtZW50LnNlcXVlbmNlSWQgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBQYXR0ZXJuc01vZGVsO1xufSgpKTtcbmV4cG9ydCB7IFBhdHRlcm5zTW9kZWwgfTtcbiIsImltcG9ydCB7IE9wdGlvbnNNb2RlbCB9IGZyb20gJy4vb3B0aW9ucy5tb2RlbCc7XG5pbXBvcnQgeyBSb3dzTW9kZWwgfSBmcm9tICcuL3Jvd3MubW9kZWwnO1xuaW1wb3J0IHsgQ29sb3JzTW9kZWwgfSBmcm9tICcuL2NvbG9ycy5tb2RlbCc7XG5pbXBvcnQgeyBTZWxlY3Rpb25Nb2RlbCB9IGZyb20gJy4vc2VsZWN0aW9uLm1vZGVsJztcbmltcG9ydCB7IEljb25zTW9kZWwgfSBmcm9tICcuL2ljb25zLm1vZGVsJztcbmltcG9ydCB7IFNlcXVlbmNlSW5mb01vZGVsIH0gZnJvbSAnLi9zZXF1ZW5jZUluZm9Nb2RlbCc7XG5pbXBvcnQgeyBFdmVudHNNb2RlbCB9IGZyb20gJy4vZXZlbnRzLm1vZGVsJztcbmltcG9ydCB7IFBhdHRlcm5zTW9kZWwgfSBmcm9tICcuL3BhdHRlcm5zLm1vZGVsJztcbmltcG9ydCB7IENvbnNlbnN1c01vZGVsIH0gZnJvbSAnLi9jb25zZW5zdXMubW9kZWwnO1xudmFyIFByb1NlcVZpZXdlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQcm9TZXFWaWV3ZXIoZGl2SWQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5kaXZJZCA9IGRpdklkO1xuICAgICAgICB0aGlzLmluaXQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBuZXcgT3B0aW9uc01vZGVsKCk7XG4gICAgICAgIHRoaXMucm93cyA9IG5ldyBSb3dzTW9kZWwoKTtcbiAgICAgICAgdGhpcy5jb25zZW5zdXMgPSBuZXcgQ29uc2Vuc3VzTW9kZWwoKTtcbiAgICAgICAgdGhpcy5yZWdpb25zID0gbmV3IENvbG9yc01vZGVsKCk7XG4gICAgICAgIHRoaXMucGF0dGVybnMgPSBuZXcgUGF0dGVybnNNb2RlbCgpO1xuICAgICAgICB0aGlzLmljb25zID0gbmV3IEljb25zTW9kZWwoKTtcbiAgICAgICAgdGhpcy5sYWJlbHMgPSBuZXcgU2VxdWVuY2VJbmZvTW9kZWwoKTtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb24gPSBuZXcgU2VsZWN0aW9uTW9kZWwoKTtcbiAgICAgICAgdGhpcy5ldmVudHMgPSBuZXcgRXZlbnRzTW9kZWwoKTtcbiAgICAgICAgd2luZG93Lm9ucmVzaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMuY2FsY3VsYXRlSWR4cyhmYWxzZSk7XG4gICAgICAgIH07XG4gICAgICAgIHdpbmRvdy5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMuY2FsY3VsYXRlSWR4cyh0cnVlKTtcbiAgICAgICAgfTsgLy8gaGFkIHRvIGFkZCB0aGlzIHRvIGNvdmVyIG1vYmlkYiB0b2dnbGUgZXZlbnRcbiAgICB9XG4gICAgUHJvU2VxVmlld2VyLnByb3RvdHlwZS5jYWxjdWxhdGVJZHhzID0gZnVuY3Rpb24gKGZsYWcpIHtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IFByb1NlcVZpZXdlci5zcXZMaXN0OyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIGlkID0gX2FbX2ldO1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNxdkJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICAgICAgICAgICAgdmFyIGNodW5rcyA9IHNxdkJvZHkuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY25rJyk7XG4gICAgICAgICAgICAgICAgdmFyIG9sZFRvcCA9IDA7XG4gICAgICAgICAgICAgICAgdmFyIG5ld1RvcCA9IDE7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaHVua3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZXJhc2Ugb2xkIGluZGV4ZXMgYmVmb3JlIHJlY2FsY3VsYXRpbmcgdGhlbVxuICAgICAgICAgICAgICAgICAgICBjaHVua3NbaV0uZmlyc3RFbGVtZW50Q2hpbGQuY2xhc3NOYW1lID0gJ2lkeCBoaWRkZW4nO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmxhZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXZvaWQgY2FsY3VsYXRpbmcgaWYgaWR4IGFscmVhZHkgc2V0XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2h1bmtzW2ldLmZpcnN0RWxlbWVudENoaWxkLmNsYXNzTmFtZSA9PT0gJ2lkeCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV3VG9wID0gY2h1bmtzW2ldLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIHdpbmRvdy5zY3JvbGxZO1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV3VG9wID4gb2xkVG9wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaHVua3NbaV0uZmlyc3RFbGVtZW50Q2hpbGQuY2xhc3NOYW1lID0gJ2lkeCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbGRUb3AgPSBuZXdUb3A7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFByb1NlcVZpZXdlci5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uIChpbnB1dHMpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgdmFyIHNxdkJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmRpdklkKTtcbiAgICAgICAgaWYgKHNxdkJvZHkpIHtcbiAgICAgICAgICAgIHNxdkJvZHkuaW5uZXJIVE1MID0gXCI8ZGl2IGNsYXNzPVxcXCJyb290XFxcIj4gPGRpdiBjbGFzcz1cXFwibG9hZGluZ1xcXCI+aW5wdXQgZXJyb3I8L2Rpdj4gPC9kaXY+XCI7XG4gICAgICAgIH1cbiAgICAgICAgUHJvU2VxVmlld2VyLnNxdkxpc3QucHVzaCh0aGlzLmRpdklkKTtcbiAgICAgICAgdmFyIGxhYmVscztcbiAgICAgICAgdmFyIGxhYmVsc0ZsYWc7XG4gICAgICAgIHZhciBzdGFydEluZGV4ZXM7XG4gICAgICAgIHZhciB0b29sdGlwcztcbiAgICAgICAgdmFyIGRhdGE7XG4gICAgICAgIC8qKiBjaGVjayBhbmQgcHJvY2VzcyBwYXJhbWV0ZXJzIGlucHV0ICovXG4gICAgICAgIGlucHV0cy5vcHRpb25zID0gdGhpcy5wYXJhbXMucHJvY2VzcyhpbnB1dHMub3B0aW9ucywgaW5wdXRzLmNvbnNlbnN1cyk7XG4gICAgICAgIC8qKiBjaGVjayBhbmQgY29uc2Vuc3VzIGlucHV0ICBhbmQgZ2xvYmFsIGNvbG9yU2NoZW1lICovXG4gICAgICAgIGlmIChpbnB1dHMub3B0aW9ucykge1xuICAgICAgICAgICAgX2EgPSB0aGlzLmNvbnNlbnN1cy5wcm9jZXNzKGlucHV0cy5zZXF1ZW5jZXMsIGlucHV0cy5yZWdpb25zLCBpbnB1dHMub3B0aW9ucyksIGlucHV0cy5zZXF1ZW5jZXMgPSBfYVswXSwgaW5wdXRzLnJlZ2lvbnMgPSBfYVsxXTtcbiAgICAgICAgfVxuICAgICAgICAvKiogY2hlY2sgYW5kIHByb2Nlc3MgcGF0dGVybnMgaW5wdXQgKi9cbiAgICAgICAgaW5wdXRzLnBhdHRlcm5zID0gdGhpcy5wYXR0ZXJucy5wcm9jZXNzKGlucHV0cy5wYXR0ZXJucywgaW5wdXRzLnNlcXVlbmNlcyk7XG4gICAgICAgIC8qKiBjaGVjayBhbmQgcHJvY2VzcyBjb2xvcnMgaW5wdXQgKi9cbiAgICAgICAgaW5wdXRzLnJlZ2lvbnMgPSB0aGlzLnJlZ2lvbnMucHJvY2VzcyhpbnB1dHMpO1xuICAgICAgICAvKiogY2hlY2sgYW5kIHByb2Nlc3MgaWNvbnMgaW5wdXQgKi9cbiAgICAgICAgdmFyIGljb25zID0gdGhpcy5pY29ucy5wcm9jZXNzKGlucHV0cy5yZWdpb25zLCBpbnB1dHMuc2VxdWVuY2VzLCBpbnB1dHMuaWNvbnMpO1xuICAgICAgICAvKiogY2hlY2sgYW5kIHByb2Nlc3Mgc2VxdWVuY2VzIGlucHV0ICovXG4gICAgICAgIGRhdGEgPSB0aGlzLnJvd3MucHJvY2VzcyhpbnB1dHMuc2VxdWVuY2VzLCBpY29ucywgaW5wdXRzLnJlZ2lvbnMsIGlucHV0cy5vcHRpb25zKTtcbiAgICAgICAgLyoqIGNoZWNrIGFuZCBwcm9jZXNzIGxhYmVscyBpbnB1dCAqL1xuICAgICAgICBfYiA9IHRoaXMubGFiZWxzLnByb2Nlc3MoaW5wdXRzLnJlZ2lvbnMsIGlucHV0cy5zZXF1ZW5jZXMpLCBsYWJlbHMgPSBfYlswXSwgc3RhcnRJbmRleGVzID0gX2JbMV0sIHRvb2x0aXBzID0gX2JbMl0sIGxhYmVsc0ZsYWcgPSBfYlszXTtcbiAgICAgICAgLyoqIGNyZWF0ZS91cGRhdGUgc3F2LWJvZHkgaHRtbCAqL1xuICAgICAgICB0aGlzLmNyZWF0ZUdVSShkYXRhLCBsYWJlbHMsIHN0YXJ0SW5kZXhlcywgdG9vbHRpcHMsIGlucHV0cy5vcHRpb25zLCBsYWJlbHNGbGFnKTtcbiAgICAgICAgLyoqIGxpc3RlbiBjb3B5IHBhc3RlIGV2ZW50cyAqL1xuICAgICAgICB0aGlzLnNlbGVjdGlvbi5wcm9jZXNzKCk7XG4gICAgICAgIC8qKiBsaXN0ZW4gc2VsZWN0aW9uIGV2ZW50cyAqL1xuICAgICAgICB0aGlzLmV2ZW50cy5vblJlZ2lvblNlbGVjdGVkKCk7XG4gICAgfTtcbiAgICBQcm9TZXFWaWV3ZXIucHJvdG90eXBlLmdlbmVyYXRlTGFiZWxzID0gZnVuY3Rpb24gKGlkeCwgbGFiZWxzLCBzdGFydEluZGV4ZXMsIGluZGV4ZXNMb2NhdGlvbiwgY2h1bmtTaXplLCBmb250U2l6ZSwgdG9vbHRpcHMsIGRhdGEsIGxpbmVTZXBhcmF0aW9uKSB7XG4gICAgICAgIHZhciBsYWJlbHNodG1sID0gJyc7XG4gICAgICAgIHZhciBsYWJlbHNDb250YWluZXIgPSAnJztcbiAgICAgICAgdmFyIG5vR2Fwc0xhYmVscyA9IFtdO1xuICAgICAgICBpZiAobGFiZWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmIChpbmRleGVzTG9jYXRpb24gIT0gJ2xhdGVyYWwnKSB7XG4gICAgICAgICAgICAgICAgbGFiZWxzaHRtbCArPSBcIjxzcGFuIGNsYXNzPVxcXCJsYmwtaGlkZGVuXFxcIiBzdHlsZT1cXFwibWFyZ2luLWJvdHRvbTpcIiArIGxpbmVTZXBhcmF0aW9uICsgXCI7XFxcIj48L3NwYW4+XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZmxhZyA9IHZvaWQgMDtcbiAgICAgICAgICAgIHZhciBjb3VudCA9IC0xO1xuICAgICAgICAgICAgdmFyIHNlcU4gPSAtMTtcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgZGF0YV8xID0gZGF0YTsgX2kgPCBkYXRhXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlcU51bSA9IGRhdGFfMVtfaV07XG4gICAgICAgICAgICAgICAgaWYgKG5vR2Fwc0xhYmVscy5sZW5ndGggPCBkYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBub0dhcHNMYWJlbHMucHVzaCgwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VxTiArPSAxO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHJlcyBpbiBzZXFOdW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlcU51bVtyZXNdLmNoYXIgJiYgc2VxTnVtW3Jlc10uY2hhci5pbmNsdWRlcygnc3ZnJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYWcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGZsYWcpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9HYXBzTGFiZWxzW3NlcU5dID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpZHgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxpbmUgd2l0aCBvbmx5IGljb25zLCBubyBuZWVkIGZvciBpbmRleFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxzaHRtbCArPSBcIjxzcGFuIGNsYXNzPVxcXCJsYmwtaGlkZGVuXFxcIiBzdHlsZT1cXFwibWFyZ2luLWJvdHRvbTpcIiArIGxpbmVTZXBhcmF0aW9uICsgXCJcXFwiPjxzcGFuIGNsYXNzPVxcXCJsYmxcXFwiPiBcIiArIG5vR2Fwc0xhYmVsc1tzZXFOXSArIFwiPC9zcGFuPjwvc3Bhbj5cIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsc2h0bWwgKz0gXCI8c3BhbiBjbGFzcz1cXFwibGJsLWhpZGRlblxcXCIgc3R5bGU9XFxcIm1hcmdpbi1ib3R0b206XCIgKyBsaW5lU2VwYXJhdGlvbiArIFwiXFxcIj48c3BhbiBjbGFzcz1cXFwibGJsXFxcIj48L3NwYW4+PC9zcGFuPlwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb3VudCArPSAxO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaWR4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNodW5rU2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxhdGVyYWwgaW5kZXggcmVndWxhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsc2h0bWwgKz0gXCI8c3BhbiBjbGFzcz1cXFwibGJsLWhpZGRlblxcXCIgc3R5bGU9XFxcIndpZHRoOiBcIiArIGZvbnRTaXplICsgXCI7bWFyZ2luLWJvdHRvbTpcIiArIGxpbmVTZXBhcmF0aW9uICsgXCJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwibGJsXFxcIiA+XCIgKyAoKHN0YXJ0SW5kZXhlc1tjb3VudF0gLSAxKSArIGlkeCkgKyBcIjwvc3Bhbj48L3NwYW4+XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbm9HYXBzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciByZXMgaW4gc2VxTnVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgrcmVzIDw9IChpZHgpICYmIHNlcU51bVtyZXNdLmNoYXIgIT09ICctJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9HYXBzICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGF0ZXJhbCBpbmRleCBnYXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub0dhcHNMYWJlbHNbc2VxTl0gPSBub0dhcHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxzaHRtbCArPSBcIjxzcGFuIGNsYXNzPVxcXCJsYmwtaGlkZGVuXFxcIiBzdHlsZT1cXFwid2lkdGg6ICBcIiArIGZvbnRTaXplICsgXCI7bWFyZ2luLWJvdHRvbTpcIiArIGxpbmVTZXBhcmF0aW9uICsgXCJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwibGJsXFxcIiA+XCIgKyAoKHN0YXJ0SW5kZXhlc1tjb3VudF0gLSAxKSArIG5vR2Fwc0xhYmVsc1tzZXFOXSkgKyBcIjwvc3Bhbj48L3NwYW4+XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbHNodG1sICs9IFwiPHNwYW4gY2xhc3M9XFxcImxibC1oaWRkZW5cXFwiIHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOlwiICsgbGluZVNlcGFyYXRpb24gKyBcIlxcXCI+PHNwYW4gY2xhc3M9XFxcImxibFxcXCI+XCIgKyBsYWJlbHNbY291bnRdICsgdG9vbHRpcHNbY291bnRdICsgXCI8L3NwYW4+PC9zcGFuPlwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZsYWcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbmRleGVzTG9jYXRpb24gPT0gJ2xhdGVyYWwnIHx8ICdib3RoJykge1xuICAgICAgICAgICAgICAgIGxhYmVsc0NvbnRhaW5lciA9IFwiPHNwYW4gY2xhc3M9XFxcImxibENvbnRhaW5lclxcXCIgc3R5bGU9XFxcImRpc3BsYXk6IGlubGluZS1ibG9ja1xcXCI+XCIgKyBsYWJlbHNodG1sICsgXCI8L3NwYW4+XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBhZGQgbWFyZ2luIGluIGNhc2Ugd2Ugb25seSBoYXZlIGxhYmVscyBhbmQgbm8gaW5kZXhlc1xuICAgICAgICAgICAgICAgIGxhYmVsc0NvbnRhaW5lciA9IFwiPHNwYW4gY2xhc3M9XFxcImxibENvbnRhaW5lclxcXCIgc3R5bGU9XFxcIm1hcmdpbi1yaWdodDoxMHB4O2Rpc3BsYXk6IGlubGluZS1ibG9ja1xcXCI+XCIgKyBsYWJlbHNodG1sICsgXCI8L3NwYW4+XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxhYmVsc0NvbnRhaW5lcjtcbiAgICB9O1xuICAgIFByb1NlcVZpZXdlci5wcm90b3R5cGUuYWRkVG9wSW5kZXhlcyA9IGZ1bmN0aW9uIChjaHVua1NpemUsIHgsIG1heFRvcCwgcm93TWFyZ2luQm90dG9tKSB7XG4gICAgICAgIHZhciBjZWxscyA9ICcnO1xuICAgICAgICAvLyBhZGRpbmcgdG9wIGluZGV4ZXNcbiAgICAgICAgdmFyIGNodW5rVG9wSW5kZXg7XG4gICAgICAgIGlmICh4ICUgY2h1bmtTaXplID09PSAwICYmIHggPD0gbWF4VG9wKSB7XG4gICAgICAgICAgICBjaHVua1RvcEluZGV4ID0gXCI8c3BhbiBjbGFzcz1cXFwiY2VsbFxcXCIgc3R5bGU9XFxcIi13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7ZGlyZWN0aW9uOiBydGw7ZGlzcGxheTpibG9jazt3aWR0aDowLjZlbTttYXJnaW4tYm90dG9tOlwiICsgcm93TWFyZ2luQm90dG9tICsgXCJcXFwiPlwiICsgeCArIFwiPC9zcGFuPlwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2h1bmtUb3BJbmRleCA9IFwiPHNwYW4gY2xhc3M9XFxcImNlbGxcXFwiIHN0eWxlPVxcXCItd2Via2l0LXVzZXItc2VsZWN0OiBub25lO2Rpc3BsYXk6YmxvY2s7dmlzaWJpbGl0eTogaGlkZGVuO21hcmdpbi1ib3R0b206XCIgKyByb3dNYXJnaW5Cb3R0b20gKyBcIlxcXCI+MDwvc3Bhbj5cIjtcbiAgICAgICAgfVxuICAgICAgICBjZWxscyArPSBjaHVua1RvcEluZGV4O1xuICAgICAgICByZXR1cm4gY2VsbHM7XG4gICAgfTtcbiAgICBQcm9TZXFWaWV3ZXIucHJvdG90eXBlLmNyZWF0ZUdVSSA9IGZ1bmN0aW9uIChkYXRhLCBsYWJlbHMsIHN0YXJ0SW5kZXhlcywgdG9vbHRpcHMsIG9wdGlvbnMsIGxhYmVsc0ZsYWcpIHtcbiAgICAgICAgdmFyIHNxdkJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmRpdklkKTtcbiAgICAgICAgLy8gY29udmVydCB0byBub2RlcyB0byBpbXByb3ZlIHJlbmRlcmluZyAoaWRlYSB0byB0cnkpOlxuICAgICAgICAvLyBDcmVhdGUgbmV3IGVsZW1lbnRcbiAgICAgICAgLy8gY29uc3Qgcm9vdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAvLyAvLyBBZGQgY2xhc3MgdG8gZWxlbWVudFxuICAgICAgICAvLyByb290LmNsYXNzTmFtZSA9ICdteS1uZXctZWxlbWVudCc7XG4gICAgICAgIC8vIC8vIEFkZCBjb2xvclxuICAgICAgICAvLyByb290LnN0eWxlLmNvbG9yID0gJ3JlZCc7XG4gICAgICAgIC8vIC8vIEZpbGwgZWxlbWVudCB3aXRoIGh0bWxcbiAgICAgICAgLy8gcm9vdC5pbm5lckhUTUwgPSBgYDtcbiAgICAgICAgLy8gLy8gQWRkIGVsZW1lbnQgbm9kZSB0byBET00gZ3JhcGhcbiAgICAgICAgLy8gc3F2Qm9keS5hcHBlbmRDaGlsZChyb290KTtcbiAgICAgICAgLy8gLy8gRXhpdFxuICAgICAgICAvLyByZXR1cm47XG4gICAgICAgIGlmICghc3F2Qm9keSkge1xuICAgICAgICAgICAgLy8gQ2Fubm90IGZpbmQgc3F2LWJvZHkgZWxlbWVudFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjaHVua1NpemUgPSBvcHRpb25zLmNodW5rU2l6ZTtcbiAgICAgICAgdmFyIGZvbnRTaXplID0gb3B0aW9ucy5mb250U2l6ZTtcbiAgICAgICAgdmFyIGNodW5rU2VwYXJhdGlvbiA9IG9wdGlvbnMuY2h1bmtTZXBhcmF0aW9uO1xuICAgICAgICB2YXIgaW5kZXhlc0xvY2F0aW9uID0gb3B0aW9ucy5pbmRleGVzTG9jYXRpb247XG4gICAgICAgIHZhciB3cmFwTGluZSA9IG9wdGlvbnMud3JhcExpbmU7XG4gICAgICAgIHZhciB2aWV3ZXJXaWR0aCA9IG9wdGlvbnMudmlld2VyV2lkdGg7XG4gICAgICAgIHZhciBsaW5lU2VwYXJhdGlvbiA9IG9wdGlvbnMubGluZVNlcGFyYXRpb24gKyAnOyc7XG4gICAgICAgIHZhciBmTnVtID0gK2ZvbnRTaXplLnN1YnN0cigwLCBmb250U2l6ZS5sZW5ndGggLSAyKTtcbiAgICAgICAgdmFyIGZVbml0ID0gZm9udFNpemUuc3Vic3RyKGZvbnRTaXplLmxlbmd0aCAtIDIsIDIpO1xuICAgICAgICAvLyBtYXhJZHggPSBsZW5ndGggb2YgdGhlIGxvbmdlc3Qgc2VxdWVuY2VcbiAgICAgICAgdmFyIG1heElkeCA9IDA7XG4gICAgICAgIHZhciBtYXhUb3AgPSAwO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIGRhdGFfMiA9IGRhdGE7IF9pIDwgZGF0YV8yLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIHJvdyA9IGRhdGFfMltfaV07XG4gICAgICAgICAgICBpZiAobWF4SWR4IDwgT2JqZWN0LmtleXMocm93KS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBtYXhJZHggPSBPYmplY3Qua2V5cyhyb3cpLmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYXhUb3AgPCBPYmplY3Qua2V5cyhyb3cpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIG1heFRvcCA9IE9iamVjdC5rZXlzKHJvdykubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBsZW5naHRJbmRleCA9IG1heElkeC50b1N0cmluZygpLmxlbmd0aDtcbiAgICAgICAgdmFyIGluZGV4V2lkdGggPSAoZk51bSAqIGxlbmdodEluZGV4KS50b1N0cmluZygpICsgZlVuaXQ7XG4gICAgICAgIC8vIGNvbnNpZGVyIHRoZSBsYXN0IGNodW5rIGV2ZW4gaWYgaXMgbm90IGxvbmcgZW5vdWdoXG4gICAgICAgIGlmIChjaHVua1NpemUgPiAwKSB7XG4gICAgICAgICAgICBtYXhJZHggKz0gKGNodW5rU2l6ZSAtIChtYXhJZHggJSBjaHVua1NpemUpKSAlIGNodW5rU2l6ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBnZW5lcmF0ZSBsYWJlbHNcbiAgICAgICAgdmFyIGxhYmVsc0NvbnRhaW5lciA9IHRoaXMuZ2VuZXJhdGVMYWJlbHMoZmFsc2UsIGxhYmVscywgc3RhcnRJbmRleGVzLCBpbmRleGVzTG9jYXRpb24sIGZhbHNlLCBpbmRleFdpZHRoLCB0b29sdGlwcywgZGF0YSwgbGluZVNlcGFyYXRpb24pO1xuICAgICAgICB2YXIgaW5kZXggPSAnJztcbiAgICAgICAgdmFyIGNhcmRzID0gJyc7XG4gICAgICAgIHZhciBjZWxsO1xuICAgICAgICB2YXIgZW50aXR5O1xuICAgICAgICB2YXIgc3R5bGU7XG4gICAgICAgIHZhciBodG1sID0gJyc7XG4gICAgICAgIHZhciBpZHhOdW0gPSAwO1xuICAgICAgICB2YXIgaWR4O1xuICAgICAgICB2YXIgY2VsbHMgPSAnJztcbiAgICAgICAgZm9yICh2YXIgeCA9IDE7IHggPD0gbWF4SWR4OyB4KyspIHtcbiAgICAgICAgICAgIGlmIChpbmRleGVzTG9jYXRpb24gIT0gJ2xhdGVyYWwnKSB7XG4gICAgICAgICAgICAgICAgY2VsbHMgPSB0aGlzLmFkZFRvcEluZGV4ZXMoY2h1bmtTaXplLCB4LCBtYXhUb3AsIGxpbmVTZXBhcmF0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDtcbiAgICAgICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgZGF0YS5sZW5ndGg7IHkrKykge1xuICAgICAgICAgICAgICAgIGVudGl0eSA9IGRhdGFbeV1beF07XG4gICAgICAgICAgICAgICAgc3R5bGUgPSAnZm9udC1zaXplOiAxZW07ZGlzcGxheTpibG9jaztoZWlnaHQ6MWVtO2xpbmUtaGVpZ2h0OjFlbTttYXJnaW4tYm90dG9tOicgKyBsaW5lU2VwYXJhdGlvbjtcbiAgICAgICAgICAgICAgICBpZiAoeSA9PT0gZGF0YS5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlID0gJ2ZvbnQtc2l6ZTogMWVtO2Rpc3BsYXk6YmxvY2s7bGluZS1oZWlnaHQ6MWVtO21hcmdpbi1ib3R0b206JyArIGxpbmVTZXBhcmF0aW9uO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWVudGl0eSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBlbXB0eWZpbGxlclxuICAgICAgICAgICAgICAgICAgICBzdHlsZSA9ICdmb250LXNpemU6IDFlbTtkaXNwbGF5OmJsb2NrO2NvbG9yOiByZ2JhKDAsIDAsIDAsIDApO2hlaWdodDoxZW07bGluZS1oZWlnaHQ6MWVtO21hcmdpbi1ib3R0b206JyArIGxpbmVTZXBhcmF0aW9uO1xuICAgICAgICAgICAgICAgICAgICBjZWxsID0gXCI8c3BhbiBzdHlsZT1cXFwiXCIgKyBzdHlsZSArIFwiXFxcIj5BPC9zcGFuPlwiOyAvLyBtb2NrIGNoYXIsIHRoaXMgaGFzIHRvIGJlIGRvbmUgdG8gaGF2ZSBjaHVua3MgYWxsIG9mIHRoZSBzYW1lIGxlbmd0aCAobGFzdCBjaHVuayBjYW4ndCBiZSBzaG9ydGVyKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVudGl0eS50YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlICs9IFwiXCIgKyBlbnRpdHkudGFyZ2V0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbnRpdHkuY2hhciAmJiAhZW50aXR5LmNoYXIuaW5jbHVkZXMoJ3N2ZycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB5IGlzIHRoZSByb3csIHggaXMgdGhlIGNvbHVtblxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbCA9IFwiPHNwYW4gY2xhc3M9XFxcImNlbGxcXFwiIGRhdGEtcmVzLXg9J1wiICsgeCArIFwiJyBkYXRhLXJlcy15PSAnXCIgKyB5ICsgXCInIGRhdGEtcmVzLWlkPSAnXCIgKyB0aGlzLmRpdklkICsgXCInXFxuICAgICAgICAgICAgICAgICAgICBzdHlsZT1cXFwiXCIgKyBzdHlsZSArIFwiXFxcIj5cIiArIGVudGl0eS5jaGFyICsgXCI8L3NwYW4+XCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZSArPSAnLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTsnO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbCA9IFwiPHNwYW4gc3R5bGU9XFxcIlwiICsgc3R5bGUgKyBcIlxcXCI+XCIgKyBlbnRpdHkuY2hhciArIFwiPC9zcGFuPlwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNlbGxzICs9IGNlbGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXJkcyArPSBcIjxkaXYgY2xhc3M9XFxcImNyZFxcXCI+XCIgKyBjZWxscyArIFwiPC9kaXY+XCI7IC8vIHdpZHRoIDMvNWVtIHRvIHJlZHVjZSB3aGl0ZSBzcGFjZSBhcm91bmQgbGV0dGVyc1xuICAgICAgICAgICAgY2VsbHMgPSAnJztcbiAgICAgICAgICAgIGlmIChjaHVua1NpemUgPiAwICYmIHggJSBjaHVua1NpemUgPT09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zaWRlcmluZyB0aGUgcm93IG9mIHRvcCBpbmRleGVzXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ZXNMb2NhdGlvbiAhPSAndG9wJykge1xuICAgICAgICAgICAgICAgICAgICBpZHhOdW0gKz0gY2h1bmtTaXplOyAvLyBsYXRlcmFsIGluZGV4IChzZXQgb25seSBpZiB0b3AgaW5kZXhlcyBtaXNzaW5nKVxuICAgICAgICAgICAgICAgICAgICBpZHggPSBpZHhOdW0gLSAoY2h1bmtTaXplIC0gMSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFkZGluZyBsYWJlbHNcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdhcHNDb250YWluZXIgPSB0aGlzLmdlbmVyYXRlTGFiZWxzKGlkeCwgbGFiZWxzLCBzdGFydEluZGV4ZXMsIGluZGV4ZXNMb2NhdGlvbiwgY2h1bmtTaXplLCBpbmRleFdpZHRoLCBmYWxzZSwgZGF0YSwgbGluZVNlcGFyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGFiZWxzWzBdID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBnYXBzQ29udGFpbmVyOyAvLyBsYXRlcmFsIG51bWJlciBpbmRleGVzXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGxhYmVsc0NvbnRhaW5lciArIGdhcHNDb250YWluZXI7IC8vIGxhdGVyYWwgbnVtYmVyIGluZGV4ZXMgKyBsYWJlbHNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIWxhYmVsc0ZsYWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gZ2Fwc0NvbnRhaW5lcjsgLy8gbGF0ZXJhbCBudW1iZXIgaW5kZXhlc1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBsYWJlbHNDb250YWluZXIgKyBnYXBzQ29udGFpbmVyOyAvLyBsYXRlcmFsIG51bWJlciBpbmRleGVzICsgbGFiZWxzXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gbGFiZWxzQ29udGFpbmVyOyAvLyB0b3BcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaW5kZXggPSBcIjxkaXYgY2xhc3M9XFxcImlkeCBoaWRkZW5cXFwiPlwiICsgaW5kZXggKyBcIjwvZGl2PlwiO1xuICAgICAgICAgICAgICAgIHN0eWxlID0gXCJmb250LXNpemU6IFwiICsgZm9udFNpemUgKyBcIjtcIjtcbiAgICAgICAgICAgICAgICBpZiAoeCAhPT0gbWF4SWR4KSB7XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlICs9ICdwYWRkaW5nLXJpZ2h0OiAnICsgY2h1bmtTZXBhcmF0aW9uICsgJ2VtOyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdHlsZSArPSAnbWFyZ2luLXJpZ2h0OiAnICsgY2h1bmtTZXBhcmF0aW9uICsgJ2VtOyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBjaHVuayA9ICcnO1xuICAgICAgICAgICAgICAgIGlmIChsYWJlbHNGbGFnIHx8IG9wdGlvbnMuY29uc2Vuc3VzVHlwZSB8fCBpbmRleGVzTG9jYXRpb24gPT0gJ2JvdGgnIHx8IGluZGV4ZXNMb2NhdGlvbiA9PSAnbGF0ZXJhbCcpIHsgLy8gYm90aFxuICAgICAgICAgICAgICAgICAgICBjaHVuayA9IFwiPGRpdiBjbGFzcz1cXFwiY25rXFxcIiBzdHlsZT1cXFwiXCIgKyBzdHlsZSArIFwiXFxcIj5cIiArIGluZGV4ICsgXCI8ZGl2IGNsYXNzPVxcXCJjcmRzXFxcIj5cIiArIGNhcmRzICsgXCI8L2Rpdj48L2Rpdj5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNodW5rID0gXCI8ZGl2IGNsYXNzPVxcXCJjbmtcXFwiIHN0eWxlPVxcXCJcIiArIHN0eWxlICsgXCJcXFwiPjxkaXYgY2xhc3M9XFxcImlkeCBoaWRkZW5cXFwiPjwvZGl2PjxkaXYgY2xhc3M9XFxcImNyZHNcXFwiPlwiICsgY2FyZHMgKyBcIjwvZGl2PjwvZGl2PlwiOyAvLyB0b3BcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FyZHMgPSAnJztcbiAgICAgICAgICAgICAgICBpbmRleCA9ICcnO1xuICAgICAgICAgICAgICAgIGh0bWwgKz0gY2h1bms7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGlubmVySFRNTDtcbiAgICAgICAgaWYgKHdyYXBMaW5lKSB7XG4gICAgICAgICAgICBpbm5lckhUTUwgPSBcIjxkaXYgY2xhc3M9XFxcInJvb3RcXFwiPiAgIFwiICsgaHRtbCArIFwiIDwvZGl2PlwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaW5uZXJIVE1MID0gXCI8ZGl2IGNsYXNzPVxcXCJyb290XFxcIiBzdHlsZT1cXFwiZGlzcGxheTogZmxleFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cXFwiZGlzcGxheTppbmxpbmUtYmxvY2s7b3ZlcmZsb3cteDpzY3JvbGw7d2hpdGUtc3BhY2U6IG5vd3JhcDt3aWR0aDpcIiArIHZpZXdlcldpZHRoICsgXCJcXFwiPiBcIiArIGh0bWwgKyBcIjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlwiO1xuICAgICAgICB9XG4gICAgICAgIHNxdkJvZHkuaW5uZXJIVE1MID0gaW5uZXJIVE1MO1xuICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ3Jlc2l6ZScpKTtcbiAgICB9O1xuICAgIFByb1NlcVZpZXdlci5zcXZMaXN0ID0gW107XG4gICAgcmV0dXJuIFByb1NlcVZpZXdlcjtcbn0oKSk7XG5leHBvcnQgeyBQcm9TZXFWaWV3ZXIgfTtcbi8vIC8vIFZFUlkgSU1QT1JUQU5UIEFORCBVU0VGVUwgVE8gQkUgQUJMRSBUTyBIQVZFIEEgV09SS0lORyBCVU5ETEUuSlMhISBORVZFUiBERUxFVEUgVEhJUyBMSU5FXG4vLyAod2luZG93IGFzIGFueSkuUHJvU2VxVmlld2VyID0gUHJvU2VxVmlld2VyO1xuIiwiaW1wb3J0IHsgUGFsZXR0ZXMgfSBmcm9tICcuL3BhbGV0dGVzJztcbmltcG9ydCB7IENvbG9yc01vZGVsIH0gZnJvbSAnLi9jb2xvcnMubW9kZWwnO1xudmFyIFJvd3NNb2RlbCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBSb3dzTW9kZWwoKSB7XG4gICAgICAgIHRoaXMuc3Vic3RpdHV0aXZlSWQgPSA5OTk5OTk5OTk5OTk5OTtcbiAgICB9XG4gICAgUm93c01vZGVsLnByb3RvdHlwZS5wcm9jZXNzUm93cyA9IGZ1bmN0aW9uIChyb3dzLCBpY29ucywgcmVnaW9ucywgb3B0KSB7XG4gICAgICAgIHZhciBhbGxEYXRhID0gW107XG4gICAgICAgIC8vIGRlY2lkZSB3aGljaCBjb2xvciBpcyBtb3JlIGltcG9ydGFudCBpbiBjYXNlIG9mIG92ZXJ3cml0aW5nXG4gICAgICAgIHZhciBjb2xvcmluZ09yZGVyID0gWydjdXN0b20nLCAnY2x1c3RhbCcsICd6YXBwbycsICdncmFkaWVudCcsICdiaW5hcnknXTtcbiAgICAgICAgLy8gb3JkZXIgcm93IE51bWJlcnNcbiAgICAgICAgdmFyIHJvd051bXNPcmRlcmVkID0gT2JqZWN0LmtleXMocm93cykubWFwKE51bWJlcikuc29ydChmdW5jdGlvbiAobjEsIG4yKSB7IHJldHVybiBuMSAtIG4yOyB9KTtcbiAgICAgICAgLy8gb3JkZXIga2V5cyBvZiBSb3cgb2JqZWN0XG4gICAgICAgIHZhciBvcmRlcmVkID0ge307XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgcm93TnVtc09yZGVyZWRfMSA9IHJvd051bXNPcmRlcmVkOyBfaSA8IHJvd051bXNPcmRlcmVkXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgcm93TnVtID0gcm93TnVtc09yZGVyZWRfMVtfaV07XG4gICAgICAgICAgICBvcmRlcmVkW3Jvd051bV0gPSBPYmplY3Qua2V5cyhyb3dzWytyb3dOdW1dKS5tYXAoTnVtYmVyKS5zb3J0KGZ1bmN0aW9uIChuMSwgbjIpIHsgcmV0dXJuIG4xIC0gbjI7IH0pO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkYXRhO1xuICAgICAgICB2YXIgY29sb3JpbmdSb3dOdW1zO1xuICAgICAgICB2YXIgdG1wO1xuICAgICAgICAvLyBsb29wIHRocm91Z2ggZGF0YSByb3dzXG4gICAgICAgIGZvciAodmFyIF9hID0gMCwgcm93TnVtc09yZGVyZWRfMiA9IHJvd051bXNPcmRlcmVkOyBfYSA8IHJvd051bXNPcmRlcmVkXzIubGVuZ3RoOyBfYSsrKSB7XG4gICAgICAgICAgICB2YXIgcm93TnVtID0gcm93TnVtc09yZGVyZWRfMltfYV07XG4gICAgICAgICAgICB0bXAgPSBvcmRlcmVkW3Jvd051bV07XG4gICAgICAgICAgICAvLyBkYXRhIGtleTogaW5kZXhlcywgdmFsdWU6IGNoYXJzXG4gICAgICAgICAgICBkYXRhID0gcm93c1tyb3dOdW1dO1xuICAgICAgICAgICAgLy8gZGF0YVtyb3dOdW1dLmxhYmVsID0gdGhpcy5yb3dzLmdldExhYmVsKHJvd051bSwgdGhpcy5zZXF1ZW5jZXMpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YSlcbiAgICAgICAgICAgIGlmIChyZWdpb25zKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2IgPSAwLCBfYyA9IGNvbG9yaW5nT3JkZXIucmV2ZXJzZSgpOyBfYiA8IF9jLmxlbmd0aDsgX2IrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29sb3JpbmcgPSBfY1tfYl07XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yaW5nUm93TnVtcyA9IENvbG9yc01vZGVsLmdldFJvd3NMaXN0KGNvbG9yaW5nKS5tYXAoTnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgY29sb3JpbmcgZm9yIHRoZSBkYXRhIHJvd1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29sb3JpbmdSb3dOdW1zLmluZGV4T2Yocm93TnVtKSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdvIHRvIG5leHQgY29sb3JpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBwb3NpdGlvbnMgPSBDb2xvcnNNb2RlbC5nZXRQb3NpdGlvbnMoY29sb3JpbmcsIHJvd051bSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHBvc2l0aW9ucyA9IHN0YXJ0LCBlbmQsIHRhcmdldCAoYmdjb2xvciB8fCBmZ2NvbG9yKVxuICAgICAgICAgICAgICAgICAgICBpZiAocG9zaXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIF9kID0gMCwgcG9zaXRpb25zXzEgPSBwb3NpdGlvbnM7IF9kIDwgcG9zaXRpb25zXzEubGVuZ3RoOyBfZCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBwb3NpdGlvbnNfMVtfZF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IGUuc3RhcnQ7IGkgPD0gZS5lbmQ7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWRhdGFbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlLmJhY2tncm91bmRDb2xvciAmJiAhZS5iYWNrZ3JvdW5kQ29sb3Iuc3RhcnRzV2l0aCgnIycpKSB7IC8vIGlzIGEgcGFsZXR0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUuYmFja2dyb3VuZENvbG9yID09ICdjdXN0b20nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtpXS5iYWNrZ3JvdW5kQ29sb3IgPSBvcHQuY3VzdG9tUGFsZXR0ZVtkYXRhW2ldLmNoYXJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtpXS5iYWNrZ3JvdW5kQ29sb3IgPSBQYWxldHRlc1tlLmJhY2tncm91bmRDb2xvcl1bZGF0YVtpXS5jaGFyXTsgLy8gZS5iYWNrZ3JvdW5kY29sb3IgPSB6YXBwbywgY2x1c3RhbC4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2ldLmJhY2tncm91bmRDb2xvciA9IGUuYmFja2dyb3VuZENvbG9yOyAvLyBpcyBhIHJlZ2lvbiBvciBwYXR0ZXJuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtpXS50YXJnZXQgPSBlLnRhcmdldCArICdiYWNrZ3JvdW5kLWNvbG9yOicgKyBkYXRhW2ldLmJhY2tncm91bmRDb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGljb25zICE9PSB7fSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaWNvbnNEYXRhID0gaWNvbnNbcm93TnVtXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGljb25zRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxsRGF0YS5wdXNoKGljb25zRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhbGxEYXRhLnB1c2goZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFsbERhdGE7XG4gICAgfTtcbiAgICBSb3dzTW9kZWwucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbiAoc2VxdWVuY2VzLCBpY29ucywgcmVnaW9ucywgb3B0KSB7XG4gICAgICAgIC8vIGNoZWNrIGFuZCBzZXQgZ2xvYmFsIHNlcXVlbmNlQ29sb3JcbiAgICAgICAgaWYgKG9wdCAmJiBvcHQuc2VxdWVuY2VDb2xvcikge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBzZXF1ZW5jZXNfMSA9IHNlcXVlbmNlczsgX2kgPCBzZXF1ZW5jZXNfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VxdWVuY2UgPSBzZXF1ZW5jZXNfMVtfaV07XG4gICAgICAgICAgICAgICAgaWYgKCFzZXF1ZW5jZS5zZXF1ZW5jZUNvbG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcXVlbmNlLnNlcXVlbmNlQ29sb3IgPSBvcHQuc2VxdWVuY2VDb2xvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8ga2VlcCBwcmV2aW91cyBkYXRhXG4gICAgICAgIGlmICghc2VxdWVuY2VzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVzZXQgZGF0YVxuICAgICAgICB2YXIgcm93cyA9IHt9O1xuICAgICAgICAvLyBjaGVjayBpZiB0aGVyZSBhcmUgdW5kZWZpbmVkIG9yIGR1cGxpY2F0ZSBpZHMgYW5kIHByZXBhcmUgdG8gcmVzZXQgdGhlbVxuICAgICAgICB2YXIgdmFsdWVzID0gW107XG4gICAgICAgIHZhciB1bmRlZmluZWRWYWx1ZXMgPSAwO1xuICAgICAgICBmb3IgKHZhciBfYSA9IDAsIF9iID0gT2JqZWN0LmtleXMoc2VxdWVuY2VzKTsgX2EgPCBfYi5sZW5ndGg7IF9hKyspIHtcbiAgICAgICAgICAgIHZhciByID0gX2JbX2FdO1xuICAgICAgICAgICAgaWYgKGlzTmFOKCtzZXF1ZW5jZXNbcl0uaWQpKSB7XG4gICAgICAgICAgICAgICAgLy8gbWlzc2luZyBpZFxuICAgICAgICAgICAgICAgIHVuZGVmaW5lZFZhbHVlcyArPSAxO1xuICAgICAgICAgICAgICAgIHNlcXVlbmNlc1tyXS5pZCA9IHRoaXMuc3Vic3RpdHV0aXZlSWQ7XG4gICAgICAgICAgICAgICAgdGhpcy5zdWJzdGl0dXRpdmVJZCAtPSAxO1xuICAgICAgICAgICAgICAgIC8vIG90aGVyd2lzZSBqdXN0IHJlc2V0IG1pc3NpbmcgaWRzIGFuZCBsb2cgdGhlIHJlc2V0dGVkIGlkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWVzLmluY2x1ZGVzKCtzZXF1ZW5jZXNbcl0uaWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIER1cGxpY2F0ZSBzZXF1ZW5jZSBpZFxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgc2VxdWVuY2VzW3JdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goK3NlcXVlbmNlc1tyXS5pZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIF9jID0gMCwgX2QgPSBPYmplY3Qua2V5cyhzZXF1ZW5jZXMpOyBfYyA8IF9kLmxlbmd0aDsgX2MrKykge1xuICAgICAgICAgICAgdmFyIHJvdyA9IF9kW19jXTtcbiAgICAgICAgICAgIC8qKiBjaGVjayBzZXF1ZW5jZXMgaWQgdHlwZSAqL1xuICAgICAgICAgICAgdmFyIGlkID0gdm9pZCAwO1xuICAgICAgICAgICAgaWYgKGlzTmFOKCtzZXF1ZW5jZXNbcm93XS5pZCkpIHtcbiAgICAgICAgICAgICAgICBpZCA9IHZhbHVlcy5zb3J0KClbdmFsdWVzLmxlbmd0aCAtIDFdICsgMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlkID0gc2VxdWVuY2VzW3Jvd10uaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiogc2V0IHJvdyBjaGFycyAqL1xuICAgICAgICAgICAgcm93c1tpZF0gPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIF9lID0gMCwgX2YgPSBPYmplY3Qua2V5cyhzZXF1ZW5jZXNbcm93XS5zZXF1ZW5jZSk7IF9lIDwgX2YubGVuZ3RoOyBfZSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlkeCA9IF9mW19lXTtcbiAgICAgICAgICAgICAgICB2YXIgaWR4S2V5ID0gKCtpZHggKyAxKS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIHZhciBjaGFyID0gc2VxdWVuY2VzW3Jvd10uc2VxdWVuY2VbaWR4XTtcbiAgICAgICAgICAgICAgICByb3dzW2lkXVtpZHhLZXldID0geyBjaGFyOiBjaGFyIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc1Jvd3Mocm93cywgaWNvbnMsIHJlZ2lvbnMsIG9wdCk7XG4gICAgfTtcbiAgICByZXR1cm4gUm93c01vZGVsO1xufSgpKTtcbmV4cG9ydCB7IFJvd3NNb2RlbCB9O1xuIiwidmFyIFNlbGVjdGlvbk1vZGVsID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNlbGVjdGlvbk1vZGVsKCkge1xuICAgICAgICB0aGlzLmV2ZW50X3NlcXVlbmNlID0gW107XG4gICAgfVxuICAgIFNlbGVjdGlvbk1vZGVsLnByb3RvdHlwZS5zZXRfc3RhcnQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgaWQ7XG4gICAgICAgIHZhciBlbGVtZW50O1xuICAgICAgICBpZiAoZS5wYXRoKSB7XG4gICAgICAgICAgICAvLyBjaHJvbWUgc3VwcG9ydFxuICAgICAgICAgICAgZWxlbWVudCA9IGUucGF0aFswXTtcbiAgICAgICAgICAgIGlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudC5kYXRhc2V0LnJlc0lkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGZpcmVmb3ggc3VwcG9ydFxuICAgICAgICAgICAgZWxlbWVudCA9IGUub3JpZ2luYWxUYXJnZXQ7XG4gICAgICAgICAgICBpZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnQuZGF0YXNldC5yZXNJZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sYXN0SWQgPSBlbGVtZW50LmRhdGFzZXQucmVzSWQ7XG4gICAgICAgIHRoaXMubGFzdFNxdiA9IGlkO1xuICAgICAgICB0aGlzLnN0YXJ0ID0geyB5OiBlbGVtZW50LmRhdGFzZXQucmVzWSwgeDogZWxlbWVudC5kYXRhc2V0LnJlc1gsIHNxdklkOiBlbGVtZW50LmRhdGFzZXQucmVzSWQgfTtcbiAgICAgICAgdGhpcy5sYXN0T3ZlciA9IHsgeTogZWxlbWVudC5kYXRhc2V0LnJlc1ksIHg6IGVsZW1lbnQuZGF0YXNldC5yZXNYLCBzcXZJZDogZWxlbWVudC5kYXRhc2V0LnJlc0lkIH07XG4gICAgICAgIHZhciBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXJlcy1pZD0nICsgZWxlbWVudC5kYXRhc2V0LnJlc0lkICsgJ10nKTtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25oaWdobGlnaHQoZWxlbWVudHMpO1xuICAgICAgICB0aGlzLmZpcnN0T3ZlciA9IGZhbHNlO1xuICAgIH07XG4gICAgU2VsZWN0aW9uTW9kZWwucHJvdG90eXBlLnNlbGVjdGlvbmhpZ2hsaWdodCA9IGZ1bmN0aW9uIChlbGVtZW50cykge1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIGVsZW1lbnRzXzEgPSBlbGVtZW50czsgX2kgPCBlbGVtZW50c18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIHNlbGVjdGlvbiA9IGVsZW1lbnRzXzFbX2ldO1xuICAgICAgICAgICAgdmFyIHggPSArc2VsZWN0aW9uLmdldEF0dHJpYnV0ZSgnZGF0YS1yZXMteCcpO1xuICAgICAgICAgICAgdmFyIHkgPSArc2VsZWN0aW9uLmdldEF0dHJpYnV0ZSgnZGF0YS1yZXMteScpO1xuICAgICAgICAgICAgdmFyIGZpcnN0WCA9IE1hdGgubWluKCt0aGlzLnN0YXJ0LngsICt0aGlzLmxhc3RPdmVyLngpO1xuICAgICAgICAgICAgdmFyIGxhc3RYID0gTWF0aC5tYXgoK3RoaXMuc3RhcnQueCwgK3RoaXMubGFzdE92ZXIueCk7XG4gICAgICAgICAgICB2YXIgZmlyc3RZID0gTWF0aC5taW4oK3RoaXMuc3RhcnQueSwgK3RoaXMubGFzdE92ZXIueSk7XG4gICAgICAgICAgICB2YXIgbGFzdFkgPSBNYXRoLm1heCgrdGhpcy5zdGFydC55LCArdGhpcy5sYXN0T3Zlci55KTtcbiAgICAgICAgICAgIC8vIG9uIGV2ZXJ5IGRyYWcgcmVzZWxlY3QgdGhlIHdob2xlIGFyZWEgLi4uXG4gICAgICAgICAgICBpZiAoeCA+PSArZmlyc3RYICYmIHggPD0gK2xhc3RYICYmXG4gICAgICAgICAgICAgICAgeSA+PSArZmlyc3RZICYmIHkgPD0gK2xhc3RZICYmXG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uLmdldEF0dHJpYnV0ZSgnZGF0YS1yZXMtaWQnKSA9PT0gdGhpcy5sYXN0T3Zlci5zcXZJZCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGlvbi5jbGFzc0xpc3QuYWRkKCdoaWdobGlnaHQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGVjdGlvbi5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgU2VsZWN0aW9uTW9kZWwucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBzZXF1ZW5jZVZpZXdlcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjZWxsJyk7XG4gICAgICAgIC8vIHJlbW92ZSBzZWxlY3Rpb24gb24gbmV3IGNsaWNrXG4gICAgICAgIHdpbmRvdy5vbm1vdXNlZG93biA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgX3RoaXMuZXZlbnRfc2VxdWVuY2UucHVzaCgwKTtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgc2VxdWVuY2VWaWV3ZXJzXzIgPSBzZXF1ZW5jZVZpZXdlcnM7IF9pIDwgc2VxdWVuY2VWaWV3ZXJzXzIubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNxdiA9IHNlcXVlbmNlVmlld2Vyc18yW19pXTtcbiAgICAgICAgICAgICAgICBzcXYub25tb3VzZWRvd24gPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5zZXRfc3RhcnQoZSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfdGhpcy5ldmVudF9zZXF1ZW5jZVswXSA9PSAwICYmIF90aGlzLmV2ZW50X3NlcXVlbmNlWzFdID09IDEgJiYgX3RoaXMuZXZlbnRfc2VxdWVuY2VbMl0gPT0gMiAmJiBfdGhpcy5ldmVudF9zZXF1ZW5jZVswXSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gbGVmdCBjbGlja1xuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXJlcy1pZD0nICsgX3RoaXMubGFzdElkICsgJ10nKTtcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2EgPSAwLCBlbGVtZW50c18yID0gZWxlbWVudHM7IF9hIDwgZWxlbWVudHNfMi5sZW5ndGg7IF9hKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdGlvbiA9IGVsZW1lbnRzXzJbX2FdO1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb24uY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgZmlyc3QgY2xpY2sgb3V0c2lkZSBzcXZEaXYgKGZpcnN0IGlmIGlzIHZhbGlkIGluIENocm9tZSwgc2Vjb25kIGluIGZpcmVmb3gpXG4gICAgICAgICAgICBpZiAoIWV2ZW50LnRhcmdldC5kYXRhc2V0LnJlc1gpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5maXJzdE92ZXIgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGV2ZW50LmV4cGxpY2l0T3JpZ2luYWxUYXJnZXQgJiYgZXZlbnQuZXhwbGljaXRPcmlnaW5hbFRhcmdldC5kYXRhc2V0KSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuZmlyc3RPdmVyID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLmV2ZW50X3NlcXVlbmNlID0gWzBdO1xuICAgICAgICB9O1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgc2VxdWVuY2VWaWV3ZXJzXzEgPSBzZXF1ZW5jZVZpZXdlcnM7IF9pIDwgc2VxdWVuY2VWaWV3ZXJzXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgc3F2ID0gc2VxdWVuY2VWaWV3ZXJzXzFbX2ldO1xuICAgICAgICAgICAgc3F2Lm9ubW91c2VvdmVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoISgxIGluIF90aGlzLmV2ZW50X3NlcXVlbmNlKSkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5ldmVudF9zZXF1ZW5jZS5wdXNoKDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMuZmlyc3RPdmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnNldF9zdGFydChlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgaWYgKGUucGF0aCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gZS5wYXRoWzBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IGUub3JpZ2luYWxUYXJnZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5zdGFydCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5sYXN0T3ZlciA9IHsgeTogZWxlbWVudC5kYXRhc2V0LnJlc1ksIHg6IGVsZW1lbnQuZGF0YXNldC5yZXNYLCBzcXZJZDogZWxlbWVudC5kYXRhc2V0LnJlc0lkIH07XG4gICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXJlcy1pZD0nICsgZWxlbWVudC5kYXRhc2V0LnJlc0lkICsgJ10nKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF90aGlzLmxhc3RJZCA9PSBlbGVtZW50LmRhdGFzZXQucmVzSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnNlbGVjdGlvbmhpZ2hsaWdodChlbGVtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGRvY3VtZW50LmJvZHkub25tb3VzZXVwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMuZXZlbnRfc2VxdWVuY2UucHVzaCgyKTtcbiAgICAgICAgICAgIF90aGlzLmZpcnN0T3ZlciA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKF90aGlzLnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuc3RhcnQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoX3RoaXMuZXZlbnRfc2VxdWVuY2VbMF0gPT0gMCAmJiBfdGhpcy5ldmVudF9zZXF1ZW5jZVsxXSA9PSAyKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtcmVzLWlkPScgKyBfdGhpcy5sYXN0SWQgKyAnXScpO1xuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIGVsZW1lbnRzXzMgPSBlbGVtZW50czsgX2kgPCBlbGVtZW50c18zLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0aW9uID0gZWxlbWVudHNfM1tfaV07XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbi5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1yZXMtaWQ9JyArIF90aGlzLmxhc3RJZCArICddJyk7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBlID0gZSB8fCB3aW5kb3cuZXZlbnQ7XG4gICAgICAgICAgICB2YXIga2V5ID0gZS53aGljaCB8fCBlLmtleUNvZGU7IC8vIGtleUNvZGUgZGV0ZWN0aW9uXG4gICAgICAgICAgICB2YXIgY3RybCA9IGUuY3RybEtleSA/IGUuY3RybEtleSA6ICgoa2V5ID09PSAxNykpOyAvLyBjdHJsIGRldGVjdGlvblxuICAgICAgICAgICAgaWYgKGtleSA9PT0gNjcgJiYgY3RybCkge1xuICAgICAgICAgICAgICAgIHZhciB0ZXh0VG9QYXN0ZSA9ICcnO1xuICAgICAgICAgICAgICAgIHZhciB0ZXh0RGljdCA9IHt9O1xuICAgICAgICAgICAgICAgIHZhciByb3cgPSAnJztcbiAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Zm9yaW5cbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBlbGVtZW50c180ID0gZWxlbWVudHM7IF9pIDwgZWxlbWVudHNfNC5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdGlvbiA9IGVsZW1lbnRzXzRbX2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0aW9uLmNsYXNzTGlzdC5jb250YWlucygnaGlnaGxpZ2h0JykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGV4dERpY3Rbc2VsZWN0aW9uLmdldEF0dHJpYnV0ZSgnZGF0YS1yZXMteScpXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHREaWN0W3NlbGVjdGlvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtcmVzLXknKV0gPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5ldyBsaW5lIHdoZW4gbmV3IHJvd1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGlvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtcmVzLXknKSAhPT0gcm93ICYmIHJvdyAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0RGljdFtzZWxlY3Rpb24uZ2V0QXR0cmlidXRlKCdkYXRhLXJlcy15JyldICs9IHNlbGVjdGlvbi5pbm5lclRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0RGljdFtzZWxlY3Rpb24uZ2V0QXR0cmlidXRlKCdkYXRhLXJlcy15JyldICs9IHNlbGVjdGlvbi5pbm5lclRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByb3cgPSBzZWxlY3Rpb24uZ2V0QXR0cmlidXRlKCdkYXRhLXJlcy15Jyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGZsYWcgPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgdGV4dFJvdyBpbiB0ZXh0RGljdCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmxhZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dFRvUGFzdGUgKz0gJ1xcbicgKyB0ZXh0RGljdFt0ZXh0Um93XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRUb1Bhc3RlICs9IHRleHREaWN0W3RleHRSb3ddO1xuICAgICAgICAgICAgICAgICAgICAgICAgZmxhZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRleHRUb1Bhc3RlICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb3B5IHRvIGNsaXBib2FyZCBmb3IgdGhlIHBhc3RlIGV2ZW50XG4gICAgICAgICAgICAgICAgICAgIHZhciBkdW1teSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZHVtbXkpO1xuICAgICAgICAgICAgICAgICAgICBkdW1teS52YWx1ZSA9IHRleHRUb1Bhc3RlO1xuICAgICAgICAgICAgICAgICAgICBkdW1teS5zZWxlY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkdW1teSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBldnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ29uSGlnaGxpZ2h0U2VsZWN0aW9uJywgeyBkZXRhaWw6IHsgdGV4dDogdGV4dFRvUGFzdGUsIGV2ZW50VHlwZTogJ2hpZ2hsaWdodCBzZWxlY3Rpb24nIH0gfSk7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGV2dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCBmYWxzZSk7XG4gICAgfTtcbiAgICByZXR1cm4gU2VsZWN0aW9uTW9kZWw7XG59KCkpO1xuZXhwb3J0IHsgU2VsZWN0aW9uTW9kZWwgfTtcbiIsInZhciBTZXF1ZW5jZUluZm9Nb2RlbCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTZXF1ZW5jZUluZm9Nb2RlbCgpIHtcbiAgICAgICAgdGhpcy5pc0hUTUwgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgICAgICB2YXIgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzdHIpO1xuICAgICAgICAgICAgLy8gcmVtb3ZlIGFsbCBub24gdGV4dCBub2RlcyBmcm9tIGZyYWdtZW50XG4gICAgICAgICAgICBmcmFnbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcqJykuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHsgcmV0dXJuIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpOyB9KTtcbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIHRleHRDb250ZW50LCB0aGVuIG5vdCBhIHB1cmUgSFRNTFxuICAgICAgICAgICAgcmV0dXJuICEoZnJhZ21lbnQudGV4dENvbnRlbnQgfHwgJycpLnRyaW0oKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgU2VxdWVuY2VJbmZvTW9kZWwucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbiAocmVnaW9ucywgc2VxdWVuY2VzKSB7XG4gICAgICAgIHZhciBsYWJlbHMgPSBbXTtcbiAgICAgICAgdmFyIHN0YXJ0SW5kZXhlcyA9IFtdO1xuICAgICAgICB2YXIgdG9vbHRpcHMgPSBbXTtcbiAgICAgICAgdmFyIGZsYWc7XG4gICAgICAgIHNlcXVlbmNlcy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhLmlkIC0gYi5pZDsgfSk7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgc2VxdWVuY2VzXzEgPSBzZXF1ZW5jZXM7IF9pIDwgc2VxdWVuY2VzXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgc2VxID0gc2VxdWVuY2VzXzFbX2ldO1xuICAgICAgICAgICAgaWYgKCFzZXEpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZXEuc3RhcnRJbmRleCkge1xuICAgICAgICAgICAgICAgIHN0YXJ0SW5kZXhlcy5wdXNoKHNlcS5zdGFydEluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0YXJ0SW5kZXhlcy5wdXNoKDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlcS5sYWJlbFRvb2x0aXApIHtcbiAgICAgICAgICAgICAgICB0b29sdGlwcy5wdXNoKHNlcS5sYWJlbFRvb2x0aXApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdG9vbHRpcHMucHVzaCgnPHNwYW4+PC9zcGFuPicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlcS5sYWJlbCAmJiAhdGhpcy5pc0hUTUwoc2VxLmxhYmVsKSkge1xuICAgICAgICAgICAgICAgIGxhYmVscy5wdXNoKHNlcS5sYWJlbCk7XG4gICAgICAgICAgICAgICAgZmxhZyA9IHRydWU7IC8vIHRvIGNoZWNrIGlmIEkgaGF2ZSBhdCBsZWFzdCBvbmUgbGFiZWxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxhYmVscy5wdXNoKCcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW2xhYmVscywgc3RhcnRJbmRleGVzLCB0b29sdGlwcywgZmxhZ107XG4gICAgfTtcbiAgICByZXR1cm4gU2VxdWVuY2VJbmZvTW9kZWw7XG59KCkpO1xuZXhwb3J0IHsgU2VxdWVuY2VJbmZvTW9kZWwgfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgUHJvU2VxVmlld2VyIH0gZnJvbSAnLi9saWIvcHJvc2Vxdmlld2VyJztcbmV4cG9ydCB7IFByb1NlcVZpZXdlciB9O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==