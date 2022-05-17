(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["proseqviewer"] = factory();
	else
		root["proseqviewer"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
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
            result.letterStyle = "color:".concat(e.color, ";");
        }
        if (e.backgroundColor) {
            result.letterStyle += "background-color:".concat(e.backgroundColor, ";");
        }
        if (e.backgroundImage) {
            result.letterStyle += "background-image: ".concat(e.backgroundImage, ";");
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
    ProSeqViewer.prototype.addTopIndexes = function (chunkSize, x, maxTop, rowMarginBottom) {
        var cells = '';
        // adding top indexes
        var chunkTopIndex;
        if (x % chunkSize === 0 && x <= maxTop) {
            chunkTopIndex = "<span class=\"cell\" style=\"-webkit-user-select: none;direction: rtl;display:block;width:0.6em;margin-bottom:".concat(rowMarginBottom, "\">").concat(x, "</span>");
        }
        else {
            chunkTopIndex = "<span class=\"cell\" style=\"-webkit-user-select: none;display:block;visibility: hidden;margin-bottom:".concat(rowMarginBottom, "\">0</span>");
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
                    cell = "<span style=\"".concat(style, "\">A</span>"); // mock char, this has to be done to have chunks all of the same length (last chunk can't be shorter)
                }
                else {
                    if (entity.target) {
                        style += "".concat(entity.target);
                    }
                    if (entity.char && !entity.char.includes('svg')) {
                        // y is the row, x is the column
                        cell = "<span class=\"cell\" data-res-x='".concat(x, "' data-res-y= '").concat(y, "' data-res-id= '").concat(this.divId, "'\n                    style=\"").concat(style, "\">").concat(entity.char, "</span>");
                    }
                    else {
                        style += '-webkit-user-select: none;';
                        cell = "<span style=\"".concat(style, "\">").concat(entity.char, "</span>");
                    }
                }
                cells += cell;
            }
            cards += "<div class=\"crd\">".concat(cells, "</div>"); // width 3/5em to reduce white space around letters
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
                index = "<div class=\"idx hidden\">".concat(index, "</div>");
                style = "font-size: ".concat(fontSize, ";");
                if (x !== maxIdx) {
                    style += 'padding-right: ' + chunkSeparation + 'em;';
                }
                else {
                    style += 'margin-right: ' + chunkSeparation + 'em;';
                }
                var chunk = '';
                if (labelsFlag || options.consensusType || indexesLocation == 'both' || indexesLocation == 'lateral') { // both
                    chunk = "<div class=\"cnk\" style=\"".concat(style, "\">").concat(index, "<div class=\"crds\">").concat(cards, "</div></div>");
                }
                else {
                    chunk = "<div class=\"cnk\" style=\"".concat(style, "\"><div class=\"idx hidden\"></div><div class=\"crds\">").concat(cards, "</div></div>"); // top
                }
                cards = '';
                index = '';
                html += chunk;
            }
        }
        var innerHTML;
        if (wrapLine) {
            innerHTML = "<div class=\"root\">   ".concat(html, " </div>");
        }
        else {
            innerHTML = "<div class=\"root\" style=\"display: flex\">\n                        <div style=\"display:inline-block;overflow-x:scroll;white-space: nowrap;width:".concat(viewerWidth, "\"> ").concat(html, "</div>\n                        </div>");
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

// export function initViewer(...args): ProSeqViewer {
//     // Define viewer
//     return new ProSeqViewer(...args);
//     // // Define sequences
//     // const sequences = [
//     //     {
//     //         sequence: 'GTREVPADAYYGVHTLRAIENFYISNNKISDIPEFVRGMVMVKKAAAMANKELQTIPKSVANAIIAACDEVLNNGKCMDQFPVDVYQGGAGTSVNMNTNEVLANIGLELMGHQKGEYQYLNPNDHVNKCQSTNDAYPTGFRIAV',
//     //         id: 1,
//     //         label: 'ASPA_ECOLI/13-156'
//     //     },
//     //     {
//     //         sequence: 'GEKQIEADVYYGIQTLRASENFPITGYKIHEE..MINALAIVKKAAALANMDVKRLYEGIGQAIVQAADEILE.GKWHDQFIVDPIQGGAGTSMNMNANEVIGNRALEIMGHKKGDYIHLSPNTHVNMSQSTNDVFPTAIHIST',
//     //         id: 2,
//     //         label: 'ASPA_BACSU/16-156'
//     //     },
//     //     {
//     //         sequence: 'MKYTDTAPKLFMNTGTKFPRRIIWS.............MGVLKKSCAKVNADLGLLDKKIADSIIKASDDLID.GKLDDKIVLDVFQTGSGTGLNMNVNEVIAEVASSYSN......LKVHPNDHVNFGQSSNDTVPTAIRIAA',
//     //         id: 3,
//     //         label: 'FUMC_SACS2/1-124'
//     //     },
//     //     {
//     //         sequence: 'GRFTQAADQRFKQFNDSLRFDYRLAEQDIV.......GSVAWSKALVTVGVLT....AEEQAQLEEALNVLLEDVRARPQQILESDAEDIHSWVEGKLIDKVG.................QLGKKLHTGRSRNDQVATDLKLWC',
//     //         id: 4,
//     //         label: 'ARLY_ECOLI/6-191'
//     //     },
//     //     {
//     //         sequence: 'GRFVGAVDPIMEKFNASIAYDRHLWEVDVQ.......GSKAYSRGLEKAGLLT....KAEMDQILHGLDKVAEEWAQG.TFKLNSNDEDIHTANERRLKELIG.................ATAGKLHTGRSRNDQVVTDLRLWM',
//     //         id: 5,
//     //         label: 'ARLY_HUMAN/11-195'
//     //     },
//     //     {
//     //         sequence: 'GGRFSGATDPLMAEFNKSIYSGKEMCEEDVI.......GSMAYAKALCQKNVIS....EEELNSILKGLEQIQREWNSG.QFVLEPSDEDVHTANERRLTEIIG.................DVAGKLHTGRSRNDQVTTDLRLW',
//     //         id: 6,
//     //         label: 'ARLY_SCHPO/12-106'
//     //     },
//     //     {
//     //         sequence: 'GRFTGATDPLMDLYNASLPYDKVMYDADLT.......GTKVYTQGLNKLGLIT....TEELHLIHQGLEQIRQEWHDN.KFIIKAGDEDIHTANERRLGEIIG................KNISGKVHTGRSRNDQVATDMRIFV',
//     //         id: 7,
//     //         label: 'Q59R31_CANAL/14-121'
//     //     },
//     //     {
//     //         sequence: 'GRFTGKTDPLMEKFNESLPFDKRLWAEDIK.......GSQAYAKALAKAGILT....HVEAASIVDGLSKVAEEWQSG.VFVVKPGDEDIHTANERRLTELIG.................AVGGKLHTGRSRNDQVATDYRLWL',
//     //         id: 8,
//     //         label: 'A0A125YZR4_VOLCA/23-118'
//     //     }
//     // ];
//     // // Define icons
//     // const icons = [
//     //     {
//     //         sequenceId: 1,
//     //         start: 1,
//     //         end: 1,
//     //         icon: 'noSecondary'
//     //     }, {
//     //         sequenceId: 1,
//     //         start: 2,
//     //         end: 7,
//     //         icon: 'strand'
//     //     }, {sequenceId: 1, start: 8, end: 8, icon: 'arrowRight'}, {
//     //         sequenceId: 1,
//     //         start: 9,
//     //         end: 12,
//     //         icon: 'noSecondary'
//     //     }, {sequenceId: 1, start: 13, end: 21, icon: 'helix'}, {
//     //         sequenceId: 1,
//     //         start: 22,
//     //         end: 34,
//     //         icon: 'noSecondary'
//     //     }, {sequenceId: 1, start: 35, end: 52, icon: 'helix'}, {
//     //         sequenceId: 1,
//     //         start: 53,
//     //         end: 57,
//     //         icon: 'noSecondary'
//     //     }, {sequenceId: 1, start: 58, end: 71, icon: 'helix'}, {
//     //         sequenceId: 1,
//     //         start: 72,
//     //         end: 72,
//     //         icon: 'noSecondary'
//     //     }, {sequenceId: 1, start: 73, end: 75, icon: 'turn'}, {
//     //         sequenceId: 1,
//     //         start: 76,
//     //         end: 91,
//     //         icon: 'noSecondary'
//     //     }, {sequenceId: 1, start: 92, end: 108, icon: 'helix'}, {
//     //         sequenceId: 1,
//     //         start: 109,
//     //         end: 111,
//     //         icon: 'turn'
//     //     }, {sequenceId: 1, start: 112, end: 121, icon: 'noSecondary'}, {
//     //         sequenceId: 1,
//     //         start: 122,
//     //         end: 126,
//     //         icon: 'helix'
//     //     }
//     // ];
//     // // Define options
//     // const options = {chunkSize: 10, sequenceColor: 'blosum62'};
//     // // Define consensus
//     // const consensus = {color: 'physical', dotThreshold: 70}
//     // // Draw a viewer
//     // psv.draw({sequences, options, icons, consensus});
// }
// //
// // initViewer();

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wcm9zZXF2aWV3ZXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL3Byb3NlcXZpZXdlci8uL3NyYy9saWIvY29sb3JzLm1vZGVsLnRzIiwid2VicGFjazovL3Byb3NlcXZpZXdlci8uL3NyYy9saWIvY29uc2Vuc3VzLm1vZGVsLnRzIiwid2VicGFjazovL3Byb3NlcXZpZXdlci8uL3NyYy9saWIvZXZlbnRzLm1vZGVsLnRzIiwid2VicGFjazovL3Byb3NlcXZpZXdlci8uL3NyYy9saWIvaWNvbnMubW9kZWwudHMiLCJ3ZWJwYWNrOi8vcHJvc2Vxdmlld2VyLy4vc3JjL2xpYi9pY29ucy50cyIsIndlYnBhY2s6Ly9wcm9zZXF2aWV3ZXIvLi9zcmMvbGliL29wdGlvbnMubW9kZWwudHMiLCJ3ZWJwYWNrOi8vcHJvc2Vxdmlld2VyLy4vc3JjL2xpYi9wYWxldHRlcy50cyIsIndlYnBhY2s6Ly9wcm9zZXF2aWV3ZXIvLi9zcmMvbGliL3BhdHRlcm5zLm1vZGVsLnRzIiwid2VicGFjazovL3Byb3NlcXZpZXdlci8uL3NyYy9saWIvcHJvc2Vxdmlld2VyLnRzIiwid2VicGFjazovL3Byb3NlcXZpZXdlci8uL3NyYy9saWIvcm93cy5tb2RlbC50cyIsIndlYnBhY2s6Ly9wcm9zZXF2aWV3ZXIvLi9zcmMvbGliL3NlbGVjdGlvbi5tb2RlbC50cyIsIndlYnBhY2s6Ly9wcm9zZXF2aWV3ZXIvLi9zcmMvbGliL3NlcXVlbmNlSW5mb01vZGVsLnRzIiwid2VicGFjazovL3Byb3NlcXZpZXdlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9wcm9zZXF2aWV3ZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3Byb3NlcXZpZXdlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3Byb3NlcXZpZXdlci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3Byb3NlcXZpZXdlci8uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7Ozs7Ozs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNELGdCQUFnQjtBQUN0RTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MsMEdBQTBHO0FBQ3pKO0FBQ0E7QUFDQSxvREFBb0QsZ0JBQWdCO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdHQUF3RztBQUN4RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQseUJBQXlCO0FBQzlFO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QyxnQ0FBZ0MsRUFBRTtBQUMvRSw2REFBNkQsZ0NBQWdDLEVBQUU7QUFDL0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsMkRBQTJEO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtREFBbUQsMEJBQTBCO0FBQzdFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQiwyREFBMkQ7QUFDOUU7QUFD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bEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLEdBQUcsa0RBQWtEO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxHQUFHLHlEQUF5RDtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBLG9CQUFvQixxQ0FBcUM7QUFDekQ7QUFDQTtBQUNBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wicHJvc2Vxdmlld2VyXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcInByb3NlcXZpZXdlclwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsInZhciBDb2xvcnNNb2RlbCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDb2xvcnNNb2RlbCgpIHtcbiAgICB9XG4gICAgQ29sb3JzTW9kZWwuZ2V0Um93c0xpc3QgPSBmdW5jdGlvbiAoY29sb3JpbmcpIHtcbiAgICAgICAgdmFyIG91dENvbCA9IHRoaXMucGFsZXR0ZVtjb2xvcmluZ107XG4gICAgICAgIGlmICghb3V0Q29sKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG91dENvbCk7XG4gICAgfTtcbiAgICBDb2xvcnNNb2RlbC5nZXRQb3NpdGlvbnMgPSBmdW5jdGlvbiAoY29sb3JpbmcsIHJvd051bSkge1xuICAgICAgICB2YXIgb3V0Q29sO1xuICAgICAgICBvdXRDb2wgPSB0aGlzLnBhbGV0dGVbY29sb3JpbmddO1xuICAgICAgICBpZiAoIW91dENvbCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIG91dENvbCA9IG91dENvbFtyb3dOdW1dO1xuICAgICAgICBpZiAoIW91dENvbCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIG91dENvbCA9IG91dENvbC5wb3NpdGlvbnM7XG4gICAgICAgIGlmICghb3V0Q29sKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dENvbDtcbiAgICB9O1xuICAgIENvbG9yc01vZGVsLnByb3RvdHlwZS5wcm9jZXNzID0gZnVuY3Rpb24gKGFsbElucHV0cykge1xuICAgICAgICBpZiAoIWFsbElucHV0cy5yZWdpb25zKSB7XG4gICAgICAgICAgICBhbGxJbnB1dHMucmVnaW9ucyA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhbGxJbnB1dHMub3B0aW9ucyAmJiAhYWxsSW5wdXRzLm9wdGlvbnMuc2VxdWVuY2VDb2xvcikge1xuICAgICAgICAgICAgdmFyIHNlcXVlbmNlQ29sb3JSZWdpb25zID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gYWxsSW5wdXRzLnNlcXVlbmNlczsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VxdWVuY2UgPSBfYVtfaV07XG4gICAgICAgICAgICAgICAgaWYgKHNlcXVlbmNlLnNlcXVlbmNlQ29sb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBzZXF1ZW5jZUNvbG9yUmVnaW9ucy5wdXNoKHsgc2VxdWVuY2VJZDogc2VxdWVuY2UuaWQsIHN0YXJ0OiAxLCBlbmQ6IHNlcXVlbmNlLnNlcXVlbmNlLmxlbmd0aCwgc2VxdWVuY2VDb2xvcjogc2VxdWVuY2Uuc2VxdWVuY2VDb2xvciB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciBfYiA9IDAsIF9jID0gYWxsSW5wdXRzLnJlZ2lvbnM7IF9iIDwgX2MubGVuZ3RoOyBfYisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlZyA9IF9jW19iXTtcbiAgICAgICAgICAgICAgICBpZiAoIXJlZy5iYWNrZ3JvdW5kQ29sb3IgJiYgcmVnLnNlcXVlbmNlSWQgIT09IC05OTk5OTk5OTk5OTk5OCkge1xuICAgICAgICAgICAgICAgICAgICBzZXF1ZW5jZUNvbG9yUmVnaW9ucy5wdXNoKHJlZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlcXVlbmNlQ29sb3JSZWdpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBhbGxJbnB1dHMucmVnaW9ucyA9IHNlcXVlbmNlQ29sb3JSZWdpb25zO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBhbGxSZWdpb25zID0gQXJyYXkucHJvdG90eXBlLmNvbmNhdChhbGxJbnB1dHMuaWNvbnMsIGFsbElucHV0cy5yZWdpb25zLCBhbGxJbnB1dHMucGF0dGVybnMpOyAvLyBvcmRlcmluZ1xuICAgICAgICB2YXIgbmV3UmVnaW9ucyA9IHRoaXMuZml4TWlzc2luZ0lkcyhhbGxSZWdpb25zLCBhbGxJbnB1dHMuc2VxdWVuY2VzKTtcbiAgICAgICAgbmV3UmVnaW9ucyA9IHRoaXMudHJhbnNmb3JtSW5wdXQoYWxsUmVnaW9ucywgbmV3UmVnaW9ucywgYWxsSW5wdXRzLnNlcXVlbmNlcywgYWxsSW5wdXRzLm9wdGlvbnMpO1xuICAgICAgICB0aGlzLnRyYW5zZm9ybUNvbG9ycyhhbGxJbnB1dHMub3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBuZXdSZWdpb25zO1xuICAgIH07XG4gICAgLy8gdHJhbnNmb3JtIGlucHV0IHN0cnVjdHVyZVxuICAgIENvbG9yc01vZGVsLnByb3RvdHlwZS50cmFuc2Zvcm1JbnB1dCA9IGZ1bmN0aW9uIChyZWdpb25zLCBuZXdSZWdpb25zLCBzZXF1ZW5jZXMsIGdsb2JhbENvbG9yKSB7XG4gICAgICAgIC8vIGlmIGRvbid0IHJlY2VpdmUgbmV3IGNvbG9ycywga2VlcCBvbGQgY29sb3JzXG4gICAgICAgIGlmICghcmVnaW9ucykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIGlmIHJlY2VpdmUgbmV3IGNvbG9ycywgY2hhbmdlIHRoZW1cbiAgICAgICAgQ29sb3JzTW9kZWwucGFsZXR0ZSA9IHt9O1xuICAgICAgICB2YXIgaW5mbztcbiAgICAgICAgaWYgKCFnbG9iYWxDb2xvcikge1xuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBzZXF1ZW5jZXNfMSA9IHNlcXVlbmNlczsgX2kgPCBzZXF1ZW5jZXNfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VxID0gc2VxdWVuY2VzXzFbX2ldO1xuICAgICAgICAgICAgICAgIHZhciByZWcgPSB7IHNlcXVlbmNlSWQ6IHNlcS5pZCwgYmFja2dyb3VuZENvbG9yOiAnJywgc3RhcnQ6IDEsIGVuZDogc2VxLnNlcXVlbmNlLmxlbmd0aCwgc2VxdWVuY2VDb2xvcjogJycgfTtcbiAgICAgICAgICAgICAgICBpZiAoc2VxLnNlcXVlbmNlQ29sb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVnLmJhY2tncm91bmRDb2xvciA9IHNlcS5zZXF1ZW5jZUNvbG9yO1xuICAgICAgICAgICAgICAgICAgICByZWcuc2VxdWVuY2VDb2xvciA9IHNlcS5zZXF1ZW5jZUNvbG9yO1xuICAgICAgICAgICAgICAgICAgICBpbmZvID0gdGhpcy5zZXRTZXF1ZW5jZUNvbG9yKHJlZywgc2VxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIF9sb29wXzEgPSBmdW5jdGlvbiAocmVnKSB7XG4gICAgICAgICAgICB2YXIgc2VxdWVuY2VDb2xvciA9IHZvaWQgMDtcbiAgICAgICAgICAgIGlmIChyZWcuaWNvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBcImNvbnRpbnVlXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VxdWVuY2VzLmZpbmQoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHguaWQgPT09IHJlZy5zZXF1ZW5jZUlkOyB9KSkge1xuICAgICAgICAgICAgICAgIHNlcXVlbmNlQ29sb3IgPSBzZXF1ZW5jZXMuZmluZChmdW5jdGlvbiAoeCkgeyByZXR1cm4geC5pZCA9PT0gcmVnLnNlcXVlbmNlSWQ7IH0pLnNlcXVlbmNlQ29sb3I7XG4gICAgICAgICAgICAgICAgaWYgKHNlcXVlbmNlQ29sb3IgJiYgIWdsb2JhbENvbG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNlcXVlbmNlQ29sb3IgaXMgc2V0LiBDYW5ub3Qgc2V0IGJhY2tncm91bmRDb2xvclxuICAgICAgICAgICAgICAgICAgICByZWcuc2VxdWVuY2VDb2xvciA9IHNlcXVlbmNlQ29sb3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5mbyA9IHRoaXNfMS5wcm9jZXNzQ29sb3IocmVnKTtcbiAgICAgICAgICAgIGlmIChpbmZvID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcImNvbnRpbnVlXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBDb2xvcnNNb2RlbC5wYWxldHRlW2luZm8udHlwZV1baW5mby5zZXF1ZW5jZUlkXS5wb3NpdGlvbnNcbiAgICAgICAgICAgICAgICAucHVzaCh7IHN0YXJ0OiByZWcuc3RhcnQsIGVuZDogcmVnLmVuZCwgdGFyZ2V0OiBpbmZvLmxldHRlclN0eWxlIH0pO1xuICAgICAgICAgICAgaWYgKHNlcXVlbmNlQ29sb3IgJiYgc2VxdWVuY2VDb2xvci5pbmNsdWRlcygnYmluYXJ5JykpIHtcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgQ29sb3JzTW9kZWwucGFsZXR0ZVtpbmZvLnR5cGVdLmJpbmFyeUNvbG9ycyA9IHRoaXNfMS5nZXRCaW5hcnlDb2xvcnMoc2VxdWVuY2VDb2xvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHZhciB0aGlzXzEgPSB0aGlzO1xuICAgICAgICAvLyBvdmVyd3JpdGUgcmVnaW9uIGNvbG9yIGlmIHNlcXVlbmNlQ29sb3IgaXMgc2V0XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZm9yICh2YXIgX2EgPSAwLCBuZXdSZWdpb25zXzEgPSBuZXdSZWdpb25zOyBfYSA8IG5ld1JlZ2lvbnNfMS5sZW5ndGg7IF9hKyspIHtcbiAgICAgICAgICAgIHZhciByZWcgPSBuZXdSZWdpb25zXzFbX2FdO1xuICAgICAgICAgICAgX2xvb3BfMShyZWcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdSZWdpb25zO1xuICAgIH07XG4gICAgQ29sb3JzTW9kZWwucHJvdG90eXBlLnNldFNlcXVlbmNlQ29sb3IgPSBmdW5jdGlvbiAocmVnLCBzZXEpIHtcbiAgICAgICAgdmFyIGluZm87XG4gICAgICAgIGluZm8gPSB0aGlzLnByb2Nlc3NDb2xvcihyZWcpO1xuICAgICAgICBDb2xvcnNNb2RlbC5wYWxldHRlW2luZm8udHlwZV1baW5mby5zZXF1ZW5jZUlkXS5wb3NpdGlvbnNcbiAgICAgICAgICAgIC5wdXNoKHsgc3RhcnQ6IHJlZy5zdGFydCwgZW5kOiByZWcuZW5kLCB0YXJnZXQ6IGluZm8ubGV0dGVyU3R5bGUgfSk7XG4gICAgICAgIGlmIChzZXEuc2VxdWVuY2VDb2xvci5pbmNsdWRlcygnYmluYXJ5JykpIHtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIENvbG9yc01vZGVsLnBhbGV0dGVbaW5mby50eXBlXS5iaW5hcnlDb2xvcnMgPSB0aGlzLmdldEJpbmFyeUNvbG9ycyhzZXEuc2VxdWVuY2VDb2xvcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluZm87XG4gICAgfTtcbiAgICBDb2xvcnNNb2RlbC5wcm90b3R5cGUuZml4TWlzc2luZ0lkcyA9IGZ1bmN0aW9uIChyZWdpb25zLCBzZXF1ZW5jZXMpIHtcbiAgICAgICAgdmFyIG5ld1JlZ2lvbnMgPSBbXTtcbiAgICAgICAgdmFyIF9sb29wXzIgPSBmdW5jdGlvbiAocmVnKSB7XG4gICAgICAgICAgICBpZiAoIXJlZykge1xuICAgICAgICAgICAgICAgIHJldHVybiBcImNvbnRpbnVlXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VxdWVuY2VzLmZpbmQoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHguaWQgPT09IHJlZy5zZXF1ZW5jZUlkOyB9KSkge1xuICAgICAgICAgICAgICAgIG5ld1JlZ2lvbnMucHVzaChyZWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2EgPSAwLCBzZXF1ZW5jZXNfMiA9IHNlcXVlbmNlczsgX2EgPCBzZXF1ZW5jZXNfMi5sZW5ndGg7IF9hKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlcSA9IHNlcXVlbmNlc18yW19hXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1JlZyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Zm9yaW5cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHJlZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlZ1trZXldICE9PSAnc2VxdWVuY2VJZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdSZWdba2V5XSA9IHJlZ1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3UmVnWydzZXF1ZW5jZUlkJ10gPSBzZXEuaWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV3UmVnaW9ucy5wdXNoKG5ld1JlZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIHJlZ2lvbnNfMSA9IHJlZ2lvbnM7IF9pIDwgcmVnaW9uc18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIHJlZyA9IHJlZ2lvbnNfMVtfaV07XG4gICAgICAgICAgICBfbG9vcF8yKHJlZyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld1JlZ2lvbnM7XG4gICAgfTtcbiAgICBDb2xvcnNNb2RlbC5wcm90b3R5cGUudHJhbnNmb3JtQ29sb3JzID0gZnVuY3Rpb24gKG9wdCkge1xuICAgICAgICB2YXIgc2VxdWVuY2VDb2xvciA9IG9wdC5zZXF1ZW5jZUNvbG9yO1xuICAgICAgICB2YXIgYXJyQ29sb3JzO1xuICAgICAgICB2YXIgbjtcbiAgICAgICAgdmFyIGM7XG4gICAgICAgIGZvciAodmFyIHR5cGUgaW4gQ29sb3JzTW9kZWwucGFsZXR0ZSkge1xuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnZ3JhZGllbnQnOiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpmb3JpblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciByb3cgaW4gQ29sb3JzTW9kZWwucGFsZXR0ZVt0eXBlXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYyA9IENvbG9yc01vZGVsLnBhbGV0dGVbdHlwZV1bcm93XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG4gPSBjLnBvc2l0aW9ucy5sZW5ndGggKyBjLmNoYXJzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyckNvbG9ycyA9IHRoaXMuZ3JhZGllbnQobik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjLnBvc2l0aW9ucy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiAoYS5zdGFydCA+IGIuc3RhcnQpID8gMSA6IC0xOyB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSBjLnBvc2l0aW9uczsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IF9hW19pXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLmJhY2tncm91bmRDb2xvciA9IGFyckNvbG9ycy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAnYmluYXJ5Jzoge1xuICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Zm9yaW5cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcm93IGluIENvbG9yc01vZGVsLnBhbGV0dGVbdHlwZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3cgPT09ICdiaW5hcnlDb2xvcnMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjID0gQ29sb3JzTW9kZWwucGFsZXR0ZVt0eXBlXVtyb3ddO1xuICAgICAgICAgICAgICAgICAgICAgICAgbiA9IGMucG9zaXRpb25zLmxlbmd0aCArIGMuY2hhcnMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJyQ29sb3JzID0gdGhpcy5iaW5hcnkobiwgQ29sb3JzTW9kZWwucGFsZXR0ZVt0eXBlXS5iaW5hcnlDb2xvcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYy5wb3NpdGlvbnMuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gKGEuc3RhcnQgPiBiLnN0YXJ0KSA/IDEgOiAtMTsgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBfYiA9IDAsIF9jID0gYy5wb3NpdGlvbnM7IF9iIDwgX2MubGVuZ3RoOyBfYisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBfY1tfYl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5iYWNrZ3JvdW5kQ29sb3IgPSBhcnJDb2xvcnMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2Ugc2VxdWVuY2VDb2xvcjoge1xuICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Zm9yaW5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ29sb3JzTW9kZWwucGFsZXR0ZVt0eXBlXTogYW4gb2JqIHdpdGggcmVnaW9ucyBhbmQgY29sb3IgYXNzb2NpYXRlZCBlcy4gcG9zaXRpb25zOiAxLTIwMCwgemFwcG9cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcm93IGluIENvbG9yc01vZGVsLnBhbGV0dGVbdHlwZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgPSBDb2xvcnNNb2RlbC5wYWxldHRlW3R5cGVdW3Jvd107XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYy5wb3NpdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIF9kID0gMCwgX2UgPSBjLnBvc2l0aW9uczsgX2QgPCBfZS5sZW5ndGg7IF9kKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBvcyA9IF9lW19kXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zLmJhY2tncm91bmRDb2xvciA9IHNlcXVlbmNlQ29sb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgQ29sb3JzTW9kZWwucHJvdG90eXBlLnByb2Nlc3NDb2xvciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSB7IHR5cGU6ICdjdXN0b20nLCBzZXF1ZW5jZUlkOiAtMSwgbGV0dGVyU3R5bGU6ICcnIH07XG4gICAgICAgIC8vIGNoZWNrIGlmIHJvdyBrZXkgaXMgYSBudW1iZXJcbiAgICAgICAgaWYgKGUuc2VxdWVuY2VJZCA9PT0gdW5kZWZpbmVkIHx8IGlzTmFOKCtlLnNlcXVlbmNlSWQpKSB7XG4gICAgICAgICAgICAvLyB3cm9uZyBlbnRpdHkgcm93IGtleVxuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdC5zZXF1ZW5jZUlkID0gK2Uuc2VxdWVuY2VJZDtcbiAgICAgICAgLy8gdHJhbnNmb3JtIHRhcmdldCBpbiBDU1MgcHJvcGVydHlcbiAgICAgICAgaWYgKGUuY29sb3IpIHtcbiAgICAgICAgICAgIHJlc3VsdC5sZXR0ZXJTdHlsZSA9IFwiY29sb3I6XCIuY29uY2F0KGUuY29sb3IsIFwiO1wiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZS5iYWNrZ3JvdW5kQ29sb3IpIHtcbiAgICAgICAgICAgIHJlc3VsdC5sZXR0ZXJTdHlsZSArPSBcImJhY2tncm91bmQtY29sb3I6XCIuY29uY2F0KGUuYmFja2dyb3VuZENvbG9yLCBcIjtcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGUuYmFja2dyb3VuZEltYWdlKSB7XG4gICAgICAgICAgICByZXN1bHQubGV0dGVyU3R5bGUgKz0gXCJiYWNrZ3JvdW5kLWltYWdlOiBcIi5jb25jYXQoZS5iYWNrZ3JvdW5kSW1hZ2UsIFwiO1wiKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBkZWZpbmUgY29sb3Igb3IgcGFsZXR0ZVxuICAgICAgICBpZiAoZS5zZXF1ZW5jZUNvbG9yKSB7XG4gICAgICAgICAgICByZXN1bHQudHlwZSA9IGUuc2VxdWVuY2VDb2xvcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0LnR5cGUuaW5jbHVkZXMoJ2JpbmFyeScpKSB7XG4gICAgICAgICAgICByZXN1bHQudHlwZSA9ICdiaW5hcnknO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJlc2VydmluZyBzcGFjZSBmb3IgdGhlIHRyYW5zZm9ybWVkIG9iamVjdCAodGhpcy5wYWxldHRlKVxuICAgICAgICAvLyBpZiBjb2xvciB0eXBlIG5vdCBpbnNlcnRlZCB5ZXRcbiAgICAgICAgaWYgKCEocmVzdWx0LnR5cGUgaW4gQ29sb3JzTW9kZWwucGFsZXR0ZSkpIHtcbiAgICAgICAgICAgIENvbG9yc01vZGVsLnBhbGV0dGVbcmVzdWx0LnR5cGVdID0ge307XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgcm93IG5vdCBpbnNlcnRlZCB5ZXRcbiAgICAgICAgaWYgKCEocmVzdWx0LnNlcXVlbmNlSWQgaW4gQ29sb3JzTW9kZWwucGFsZXR0ZVtyZXN1bHQudHlwZV0pKSB7XG4gICAgICAgICAgICBDb2xvcnNNb2RlbC5wYWxldHRlW3Jlc3VsdC50eXBlXVtyZXN1bHQuc2VxdWVuY2VJZF0gPSB7IHBvc2l0aW9uczogW10sIGNoYXJzOiBbXSB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgICBDb2xvcnNNb2RlbC5wcm90b3R5cGUuZ3JhZGllbnQgPSBmdW5jdGlvbiAobikge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVubHlTcGFjZWRDb2xvcnMobik7XG4gICAgfTtcbiAgICBDb2xvcnNNb2RlbC5wcm90b3R5cGUuZ2V0QmluYXJ5Q29sb3JzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY29sb3IxID0gJyM5M0UxRDgnO1xuICAgICAgICB2YXIgY29sb3IyID0gJyNGRkE2OUUnO1xuICAgICAgICByZXR1cm4gW2NvbG9yMSwgY29sb3IyXTtcbiAgICB9O1xuICAgIENvbG9yc01vZGVsLnByb3RvdHlwZS5iaW5hcnkgPSBmdW5jdGlvbiAobiwgYmluYXJ5Q29sb3JzKSB7XG4gICAgICAgIHZhciByZWcgPSAwO1xuICAgICAgICB2YXIgZmxhZztcbiAgICAgICAgdmFyIGFyckNvbG9ycyA9IFtdO1xuICAgICAgICB3aGlsZSAocmVnIDwgbikge1xuICAgICAgICAgICAgaWYgKGZsYWcpIHtcbiAgICAgICAgICAgICAgICBhcnJDb2xvcnMucHVzaChiaW5hcnlDb2xvcnNbMF0pO1xuICAgICAgICAgICAgICAgIGZsYWcgPSAhZmxhZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGFyckNvbG9ycy5wdXNoKGJpbmFyeUNvbG9yc1sxXSk7XG4gICAgICAgICAgICAgICAgZmxhZyA9ICFmbGFnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVnICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFyckNvbG9ycztcbiAgICB9O1xuICAgIENvbG9yc01vZGVsLnByb3RvdHlwZS5ldmVubHlTcGFjZWRDb2xvcnMgPSBmdW5jdGlvbiAobikge1xuICAgICAgICAvKiogaG93IHRvIGdvIGFyb3VuZCB0aGUgcmdiIHdoZWVsICovXG4gICAgICAgIC8qKiBhZGQgdG8gbmV4dCByZ2IgY29tcG9uZW50LCBzdWJ0cmFjdCB0byBwcmV2aW91cyAqL1xuICAgICAgICAvKiogIGV4LjogMjU1LDAsMCAtKGFkZCktPiAyNTUsMjU1LDAgLShzdWJ0cmFjdCktPiAwLDI1NSwwICovXG4gICAgICAgIC8vIHN0YXJ0aW5nIGNvbG9yOiByZWRcbiAgICAgICAgdmFyIHJnYiA9IFsyNTUsIDAsIDBdO1xuICAgICAgICAvLyAxNTM2IGNvbG9ycyBpbiB0aGUgcmdiIHdoZWVsXG4gICAgICAgIHZhciBkZWx0YSA9IE1hdGguZmxvb3IoMTUzNiAvIG4pO1xuICAgICAgICB2YXIgcmVtYWluZGVyO1xuICAgICAgICB2YXIgYWRkID0gdHJ1ZTtcbiAgICAgICAgdmFyIHZhbHVlID0gMDtcbiAgICAgICAgdmFyIHRtcDtcbiAgICAgICAgdmFyIGNvbG9ycyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcmVtYWluZGVyID0gZGVsdGE7XG4gICAgICAgICAgICB3aGlsZSAocmVtYWluZGVyID4gMCkge1xuICAgICAgICAgICAgICAgIGlmIChhZGQpIHtcbiAgICAgICAgICAgICAgICAgICAgdG1wID0gKCgodmFsdWUgKyAxKSAlIDMpICsgMykgJSAzO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmdiW3RtcF0gKyByZW1haW5kZXIgPiAyNTUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbWFpbmRlciAtPSAoMjU1IC0gcmdiW3RtcF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmdiW3RtcF0gPSAyNTU7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdG1wO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmdiW3RtcF0gKz0gcmVtYWluZGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVtYWluZGVyID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdG1wID0gKCgodmFsdWUgLSAxKSAlIDMpICsgMykgJSAzO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmdiW3RtcF0gLSByZW1haW5kZXIgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW1haW5kZXIgLT0gcmdiW3RtcF07XG4gICAgICAgICAgICAgICAgICAgICAgICByZ2JbdG1wXSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmdiW3RtcF0gLT0gcmVtYWluZGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVtYWluZGVyID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbG9ycy5wdXNoKCdyZ2JhKCcgKyByZ2JbMF0gKyAnLCcgKyByZ2JbMV0gKyAnLCcgKyByZ2JbMl0gKyAnLCAwLjQpJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbG9ycztcbiAgICB9O1xuICAgIHJldHVybiBDb2xvcnNNb2RlbDtcbn0oKSk7XG5leHBvcnQgeyBDb2xvcnNNb2RlbCB9O1xuIiwiaW1wb3J0IHsgUGFsZXR0ZXMgfSBmcm9tICcuL3BhbGV0dGVzJztcbnZhciBDb25zZW5zdXNNb2RlbCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDb25zZW5zdXNNb2RlbCgpIHtcbiAgICB9XG4gICAgQ29uc2Vuc3VzTW9kZWwuc2V0Q29uc2Vuc3VzSW5mbyA9IGZ1bmN0aW9uICh0eXBlLCBzZXF1ZW5jZXMpIHtcbiAgICAgICAgdmFyIGlkSWRlbnRpdHkgPSAtOTk5OTk5OTk5OTk5OTk7XG4gICAgICAgIHZhciBpZFBoeXNpY2FsID0gLTk5OTk5OTk5OTk5OTk4O1xuICAgICAgICB2YXIgY29uc2Vuc3VzSW5mbyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlcXVlbmNlc1swXS5zZXF1ZW5jZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGNvbnNlbnN1c0NvbHVtbiA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBzZXF1ZW5jZXNfMSA9IHNlcXVlbmNlczsgX2kgPCBzZXF1ZW5jZXNfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VxdWVuY2UgPSBzZXF1ZW5jZXNfMVtfaV07XG4gICAgICAgICAgICAgICAgdmFyIGxldHRlciA9IHNlcXVlbmNlLnNlcXVlbmNlW2ldO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAncGh5c2ljYWwnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXF1ZW5jZS5pZCA9PT0gaWRJZGVudGl0eSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGxldHRlciBpbiBQYWxldHRlcy5jb25zZW5zdXNBYUxlc2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlciA9IFBhbGV0dGVzLmNvbnNlbnN1c0FhTGVza1tsZXR0ZXJdWzBdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VxdWVuY2UuaWQgPT09IGlkUGh5c2ljYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChsZXR0ZXIgPT09ICctJyB8fCAhbGV0dGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoY29uc2Vuc3VzQ29sdW1uW2xldHRlcl0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc2Vuc3VzQ29sdW1uW2xldHRlcl0gKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNlbnN1c0NvbHVtbltsZXR0ZXJdID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zZW5zdXNJbmZvLnB1c2goY29uc2Vuc3VzQ29sdW1uKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29uc2Vuc3VzSW5mbztcbiAgICB9O1xuICAgIENvbnNlbnN1c01vZGVsLmNyZWF0ZUNvbnNlbnN1cyA9IGZ1bmN0aW9uICh0eXBlLCBjb25zZW5zdXMsIGNvbnNlbnN1czIsIHNlcXVlbmNlcywgcmVnaW9ucywgdGhyZXNob2xkLCBwYWxldHRlKSB7XG4gICAgICAgIGlmICh0aHJlc2hvbGQgPCA1MCkge1xuICAgICAgICAgICAgdGhyZXNob2xkID0gMTAwIC0gdGhyZXNob2xkO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpZCA9IC05OTk5OTk5OTk5OTk5OTtcbiAgICAgICAgdmFyIGxhYmVsO1xuICAgICAgICBpZiAodHlwZSA9PT0gJ3BoeXNpY2FsJykge1xuICAgICAgICAgICAgbGFiZWwgPSAnQ29uc2Vuc3VzIHBoeXNpY2FsICcgKyB0aHJlc2hvbGQgKyAnJSc7XG4gICAgICAgICAgICBpZCA9IC05OTk5OTk5OTk5OTk5ODtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxhYmVsID0gJ0NvbnNlbnN1cyBpZGVudGl0eSAnICsgdGhyZXNob2xkICsgJyUnO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjb25zZW5zdXNTZXF1ZW5jZSA9ICcnO1xuICAgICAgICB2YXIgX2xvb3BfMSA9IGZ1bmN0aW9uIChjb2x1bW4pIHtcbiAgICAgICAgICAgIHZhciBfYSwgX2IsIF9jO1xuICAgICAgICAgICAgdmFyIG1heExldHRlciA9IHZvaWQgMDtcbiAgICAgICAgICAgIHZhciBtYXhJbmRleCA9IHZvaWQgMDtcbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhjb25zZW5zdXNbY29sdW1uXSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgbWF4TGV0dGVyID0gJy4nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbWF4TGV0dGVyID0gT2JqZWN0LmtleXMoY29uc2Vuc3VzW2NvbHVtbl0pLnJlZHVjZShmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29uc2Vuc3VzW2NvbHVtbl1bYV0gPiBjb25zZW5zdXNbY29sdW1uXVtiXSA/IGEgOiBiO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG1heEluZGV4ID0gY29uc2Vuc3VzW2NvbHVtbl1bbWF4TGV0dGVyXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBiYWNrZ3JvdW5kQ29sb3IgPSB2b2lkIDA7XG4gICAgICAgICAgICB2YXIgY29sb3IgPSB2b2lkIDA7XG4gICAgICAgICAgICB2YXIgZnJlcXVlbmN5ID0gKG1heEluZGV4IC8gc2VxdWVuY2VzLmxlbmd0aCkgKiAxMDA7XG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gJ3BoeXNpY2FsJykge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNlbnN1cyBpZCB0byBzZWUgaWYgSSBoYXZlIGFsbCBsZXR0ZXJzIGVxdWFsc1xuICAgICAgICAgICAgICAgIC8vIGVxdWFscyBsZXR0ZXJzIGhhdmUgcHJlY2VkZW5jZSBvdmVyIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICB2YXIgbWF4TGV0dGVySWQgPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgdmFyIG1heEluZGV4SWQgPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKGNvbnNlbnN1c1tjb2x1bW5dKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4TGV0dGVySWQgPSAnLic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBtYXhMZXR0ZXJJZCA9IE9iamVjdC5rZXlzKGNvbnNlbnN1czJbY29sdW1uXSkucmVkdWNlKGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29uc2Vuc3VzMltjb2x1bW5dW2FdID4gY29uc2Vuc3VzMltjb2x1bW5dW2JdID8gYSA6IGI7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBtYXhJbmRleElkID0gY29uc2Vuc3VzMltjb2x1bW5dW21heExldHRlcklkXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGZyZXF1ZW5jeUlkID0gKG1heEluZGV4SWQgLyBzZXF1ZW5jZXMubGVuZ3RoKSAqIDEwMDtcbiAgICAgICAgICAgICAgICBpZiAoZnJlcXVlbmN5SWQgPj0gdGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgIG1heExldHRlciA9IG1heExldHRlcklkO1xuICAgICAgICAgICAgICAgICAgICBfYSA9IENvbnNlbnN1c01vZGVsLnNldENvbG9yc0lkZW50aXR5KGZyZXF1ZW5jeUlkLCBwYWxldHRlLCAncGh5c2ljYWwnKSwgYmFja2dyb3VuZENvbG9yID0gX2FbMF0sIGNvbG9yID0gX2FbMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZnJlcXVlbmN5ID49IHRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2IgPSBDb25zZW5zdXNNb2RlbC5zZXRDb2xvcnNQaHlzaWNhbChtYXhMZXR0ZXIsIHBhbGV0dGUpLCBiYWNrZ3JvdW5kQ29sb3IgPSBfYlswXSwgY29sb3IgPSBfYlsxXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIF9jID0gQ29uc2Vuc3VzTW9kZWwuc2V0Q29sb3JzSWRlbnRpdHkoZnJlcXVlbmN5LCBwYWxldHRlLCAnaWRlbnRpdHknKSwgYmFja2dyb3VuZENvbG9yID0gX2NbMF0sIGNvbG9yID0gX2NbMV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZnJlcXVlbmN5IDwgdGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgbWF4TGV0dGVyID0gJy4nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gKyAxIGJlY2F1c2UgcmVzaWR1ZXMgc3RhcnQgZnJvbSAxIGFuZCBub3QgMFxuICAgICAgICAgICAgcmVnaW9ucy5wdXNoKHsgc3RhcnQ6ICtjb2x1bW4gKyAxLCBlbmQ6ICtjb2x1bW4gKyAxLCBzZXF1ZW5jZUlkOiBpZCwgYmFja2dyb3VuZENvbG9yOiBiYWNrZ3JvdW5kQ29sb3IsIGNvbG9yOiBjb2xvciB9KTtcbiAgICAgICAgICAgIGNvbnNlbnN1c1NlcXVlbmNlICs9IG1heExldHRlcjtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmZvcmluXG4gICAgICAgIGZvciAodmFyIGNvbHVtbiBpbiBjb25zZW5zdXMpIHtcbiAgICAgICAgICAgIF9sb29wXzEoY29sdW1uKTtcbiAgICAgICAgfVxuICAgICAgICBzZXF1ZW5jZXMucHVzaCh7IGlkOiBpZCwgc2VxdWVuY2U6IGNvbnNlbnN1c1NlcXVlbmNlLCBsYWJlbDogbGFiZWwgfSk7XG4gICAgICAgIHJldHVybiBbc2VxdWVuY2VzLCByZWdpb25zXTtcbiAgICB9O1xuICAgIENvbnNlbnN1c01vZGVsLnNldENvbG9yc0lkZW50aXR5ID0gZnVuY3Rpb24gKGZyZXF1ZW5jeSwgcGFsZXR0ZSwgZmxhZykge1xuICAgICAgICB2YXIgYmFja2dyb3VuZENvbG9yO1xuICAgICAgICB2YXIgY29sb3I7XG4gICAgICAgIHZhciBmaW5hbFBhbGV0dGU7XG4gICAgICAgIGlmIChwYWxldHRlICYmIHR5cGVvZiBwYWxldHRlICE9PSAnc3RyaW5nJyAmJiBmbGFnID09ICdpZGVudGl0eScpIHtcbiAgICAgICAgICAgIGZpbmFsUGFsZXR0ZSA9IHBhbGV0dGU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmaW5hbFBhbGV0dGUgPSBQYWxldHRlcy5jb25zZW5zdXNMZXZlbHNJZGVudGl0eTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3RlcHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGZpbmFsUGFsZXR0ZSkge1xuICAgICAgICAgICAgc3RlcHMucHVzaCgra2V5KTsgLy8gNDJcbiAgICAgICAgfVxuICAgICAgICBzdGVwcyA9IHN0ZXBzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGEgPCBiID8gMSA6IGEgPiBiID8gLTEgOiAwOyB9KTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBzdGVwc18xID0gc3RlcHM7IF9pIDwgc3RlcHNfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBzdGVwID0gc3RlcHNfMVtfaV07XG4gICAgICAgICAgICBpZiAoZnJlcXVlbmN5ID49IHN0ZXApIHtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSBmaW5hbFBhbGV0dGVbc3RlcF1bMF07XG4gICAgICAgICAgICAgICAgY29sb3IgPSBmaW5hbFBhbGV0dGVbc3RlcF1bMV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtiYWNrZ3JvdW5kQ29sb3IsIGNvbG9yXTtcbiAgICB9O1xuICAgIENvbnNlbnN1c01vZGVsLnNldENvbG9yc1BoeXNpY2FsID0gZnVuY3Rpb24gKGxldHRlciwgcGFsZXR0ZSkge1xuICAgICAgICB2YXIgZmluYWxQYWxldHRlO1xuICAgICAgICB2YXIgYmFja2dyb3VuZENvbG9yO1xuICAgICAgICB2YXIgY29sb3I7XG4gICAgICAgIGlmIChwYWxldHRlICYmIHR5cGVvZiBwYWxldHRlICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZmluYWxQYWxldHRlID0gcGFsZXR0ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZpbmFsUGFsZXR0ZSA9IFBhbGV0dGVzLmNvbnNlbnN1c0FhTGVzaztcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBlbCBpbiBmaW5hbFBhbGV0dGUpIHtcbiAgICAgICAgICAgIGlmIChmaW5hbFBhbGV0dGVbZWxdWzBdID09IGxldHRlcikge1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvciA9IGZpbmFsUGFsZXR0ZVtlbF1bMV07XG4gICAgICAgICAgICAgICAgY29sb3IgPSBmaW5hbFBhbGV0dGVbZWxdWzJdO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbYmFja2dyb3VuZENvbG9yLCBjb2xvcl07XG4gICAgfTtcbiAgICBDb25zZW5zdXNNb2RlbC5wcm90b3R5cGUucHJvY2VzcyA9IGZ1bmN0aW9uIChzZXF1ZW5jZXMsIHJlZ2lvbnMsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgaWYgKCFyZWdpb25zKSB7XG4gICAgICAgICAgICByZWdpb25zID0gW107XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG1heElkeCA9IDA7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgc2VxdWVuY2VzXzIgPSBzZXF1ZW5jZXM7IF9pIDwgc2VxdWVuY2VzXzIubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgcm93ID0gc2VxdWVuY2VzXzJbX2ldO1xuICAgICAgICAgICAgaWYgKG1heElkeCA8IHJvdy5zZXF1ZW5jZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBtYXhJZHggPSByb3cuc2VxdWVuY2UubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIF9jID0gMCwgc2VxdWVuY2VzXzMgPSBzZXF1ZW5jZXM7IF9jIDwgc2VxdWVuY2VzXzMubGVuZ3RoOyBfYysrKSB7XG4gICAgICAgICAgICB2YXIgcm93ID0gc2VxdWVuY2VzXzNbX2NdO1xuICAgICAgICAgICAgdmFyIGRpZmYgPSBtYXhJZHggLSByb3cuc2VxdWVuY2UubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGRpZmYgPiAwICYmIHJvdy5pZCAhPT0gLTk5OTk5OTk5OTk5OTk5ICYmIHJvdy5pZCAhPT0gLTk5OTk5OTk5OTk5OTk4KSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkaWZmOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgcm93LnNlcXVlbmNlICs9ICctJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMuc2VxdWVuY2VDb2xvck1hdHJpeCkge1xuICAgICAgICAgICAgcmVnaW9ucyA9IFtdO1xuICAgICAgICAgICAgc2VxdWVuY2VzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGEuaWQgLSBiLmlkOyB9KTtcbiAgICAgICAgICAgIHZhciBtaW4gPSBzZXF1ZW5jZXNbMF07XG4gICAgICAgICAgICB2YXIgcGFsZXR0ZSA9IFBhbGV0dGVzLnN1YnN0aXR1dGlvbk1hdHJpeEJsb3N1bTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHBhbGV0dGUpXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5zZXF1ZW5jZUNvbG9yTWF0cml4UGFsZXR0ZSkge1xuICAgICAgICAgICAgICAgIHBhbGV0dGUgPSBvcHRpb25zLnNlcXVlbmNlQ29sb3JNYXRyaXhQYWxldHRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGtleSA9IHZvaWQgMDtcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpwcmVmZXItZm9yLW9mXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1pbi5zZXF1ZW5jZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIF9kID0gMCwgc2VxdWVuY2VzXzQgPSBzZXF1ZW5jZXM7IF9kIDwgc2VxdWVuY2VzXzQubGVuZ3RoOyBfZCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzZXF1ZW5jZSA9IHNlcXVlbmNlc180W19kXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlcXVlbmNlLmlkID09PSBtaW4uaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IHNlcXVlbmNlLnNlcXVlbmNlW2ldICsgc2VxdWVuY2Uuc2VxdWVuY2VbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5IGluIHBhbGV0dGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWdpb25zLnB1c2goeyBzZXF1ZW5jZUlkOiBzZXF1ZW5jZS5pZCwgc3RhcnQ6IGkgKyAxLCBlbmQ6IGkgKyAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHBhbGV0dGVba2V5XVswXSwgY29sb3I6IHBhbGV0dGVba2V5XVsxXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNjb3JlIHdpdGggZmlyc3Qgc2VxdWVuY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IHNlcXVlbmNlLnNlcXVlbmNlW2ldICsgbWluLnNlcXVlbmNlW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleSBpbiBwYWxldHRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVnaW9ucy5wdXNoKHsgc2VxdWVuY2VJZDogc2VxdWVuY2UuaWQsIHN0YXJ0OiBpICsgMSwgZW5kOiBpICsgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBwYWxldHRlW2tleV1bMF0gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChwYWxldHRlW21pbi5zZXF1ZW5jZVtpXSArIHNlcXVlbmNlLnNlcXVlbmNlW2ldXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IG1pbi5zZXF1ZW5jZVtpXSArIHNlcXVlbmNlLnNlcXVlbmNlW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZ2lvbnMucHVzaCh7IHNlcXVlbmNlSWQ6IHNlcXVlbmNlLmlkLCBzdGFydDogaSArIDEsIGVuZDogaSArIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogcGFsZXR0ZVtrZXldWzBdLCBjb2xvcjogcGFsZXR0ZVtrZXldWzFdIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG9wdGlvbnMuc2VxdWVuY2VDb2xvcikge1xuICAgICAgICAgICAgcmVnaW9ucyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgX2UgPSAwLCBzZXF1ZW5jZXNfNSA9IHNlcXVlbmNlczsgX2UgPCBzZXF1ZW5jZXNfNS5sZW5ndGg7IF9lKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VxdWVuY2UgPSBzZXF1ZW5jZXNfNVtfZV07XG4gICAgICAgICAgICAgICAgc2VxdWVuY2Uuc2VxdWVuY2VDb2xvciA9IG9wdGlvbnMuc2VxdWVuY2VDb2xvcjtcbiAgICAgICAgICAgICAgICByZWdpb25zLnB1c2goeyBzZXF1ZW5jZUlkOiBzZXF1ZW5jZS5pZCwgc3RhcnQ6IDEsIGVuZDogc2VxdWVuY2Uuc2VxdWVuY2UubGVuZ3RoLCBzZXF1ZW5jZUNvbG9yOiBvcHRpb25zLnNlcXVlbmNlQ29sb3IgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNvbnNlbnN1c0luZm9JZGVudGl0eTtcbiAgICAgICAgdmFyIGNvbnNlbnN1c0luZm9QaHlzaWNhbDtcbiAgICAgICAgaWYgKG9wdGlvbnMuY29uc2Vuc3VzQ29sb3JJZGVudGl0eSkge1xuICAgICAgICAgICAgY29uc2Vuc3VzSW5mb0lkZW50aXR5ID0gQ29uc2Vuc3VzTW9kZWwuc2V0Q29uc2Vuc3VzSW5mbygnaWRlbnRpdHknLCBzZXF1ZW5jZXMpO1xuICAgICAgICAgICAgX2EgPSBDb25zZW5zdXNNb2RlbC5jcmVhdGVDb25zZW5zdXMoJ2lkZW50aXR5JywgY29uc2Vuc3VzSW5mb0lkZW50aXR5LCBmYWxzZSwgc2VxdWVuY2VzLCByZWdpb25zLCBvcHRpb25zLmRvdFRocmVzaG9sZCwgb3B0aW9ucy5jb25zZW5zdXNDb2xvcklkZW50aXR5KSwgc2VxdWVuY2VzID0gX2FbMF0sIHJlZ2lvbnMgPSBfYVsxXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChvcHRpb25zLmNvbnNlbnN1c0NvbG9yTWFwcGluZykge1xuICAgICAgICAgICAgY29uc2Vuc3VzSW5mb1BoeXNpY2FsID0gQ29uc2Vuc3VzTW9kZWwuc2V0Q29uc2Vuc3VzSW5mbygncGh5c2ljYWwnLCBzZXF1ZW5jZXMpO1xuICAgICAgICAgICAgaWYgKCFjb25zZW5zdXNJbmZvSWRlbnRpdHkpIHtcbiAgICAgICAgICAgICAgICBjb25zZW5zdXNJbmZvSWRlbnRpdHkgPSBDb25zZW5zdXNNb2RlbC5zZXRDb25zZW5zdXNJbmZvKCdpZGVudGl0eScsIHNlcXVlbmNlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfYiA9IENvbnNlbnN1c01vZGVsLmNyZWF0ZUNvbnNlbnN1cygncGh5c2ljYWwnLCBjb25zZW5zdXNJbmZvUGh5c2ljYWwsIGNvbnNlbnN1c0luZm9JZGVudGl0eSwgc2VxdWVuY2VzLCByZWdpb25zLCBvcHRpb25zLmRvdFRocmVzaG9sZCwgb3B0aW9ucy5jb25zZW5zdXNDb2xvck1hcHBpbmcpLCBzZXF1ZW5jZXMgPSBfYlswXSwgcmVnaW9ucyA9IF9iWzFdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbc2VxdWVuY2VzLCByZWdpb25zXTtcbiAgICB9O1xuICAgIHJldHVybiBDb25zZW5zdXNNb2RlbDtcbn0oKSk7XG5leHBvcnQgeyBDb25zZW5zdXNNb2RlbCB9O1xuIiwidmFyIEV2ZW50c01vZGVsID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEV2ZW50c01vZGVsKCkge1xuICAgIH1cbiAgICBFdmVudHNNb2RlbC5wcm90b3R5cGUub25SZWdpb25TZWxlY3RlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNlcXVlbmNlVmlld2VycyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NlbGwnKTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIHNlcXVlbmNlVmlld2Vyc18xID0gc2VxdWVuY2VWaWV3ZXJzOyBfaSA8IHNlcXVlbmNlVmlld2Vyc18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIHNxdiA9IHNlcXVlbmNlVmlld2Vyc18xW19pXTtcbiAgICAgICAgICAgIHNxdi5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIGZ1bmN0aW9uIChyKSB7XG4gICAgICAgICAgICAgICAgdmFyIGV2dCA9IG5ldyBDdXN0b21FdmVudCgnb25SZWdpb25TZWxlY3RlZCcsIHsgZGV0YWlsOiB7IGNoYXI6IHIuc3JjRWxlbWVudC5pbm5lckhUTUwsIHg6IHIuc3JjRWxlbWVudC5kYXRhc2V0LnJlc1gsIHk6IHIuc3JjRWxlbWVudC5kYXRhc2V0LnJlc1kgfSB9KTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChldnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBFdmVudHNNb2RlbDtcbn0oKSk7XG5leHBvcnQgeyBFdmVudHNNb2RlbCB9O1xuIiwiaW1wb3J0IHsgSWNvbnMgfSBmcm9tICcuL2ljb25zJztcbnZhciBJY29uc01vZGVsID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEljb25zTW9kZWwoKSB7XG4gICAgfVxuICAgIEljb25zTW9kZWwucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbiAocmVnaW9ucywgc2VxdWVuY2VzLCBpY29uc1BhdGhzKSB7XG4gICAgICAgIHZhciByb3dzID0ge307XG4gICAgICAgIGlmIChyZWdpb25zICYmIHNlcXVlbmNlcykge1xuICAgICAgICAgICAgdmFyIF9sb29wXzEgPSBmdW5jdGlvbiAoc2VxKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2EgPSAwLCByZWdpb25zXzEgPSByZWdpb25zOyBfYSA8IHJlZ2lvbnNfMS5sZW5ndGg7IF9hKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlZyA9IHJlZ2lvbnNfMVtfYV07XG4gICAgICAgICAgICAgICAgICAgIGlmICgrc2VxLmlkID09PSByZWcuc2VxdWVuY2VJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyb3dzW3NlcS5pZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dzW3NlcS5pZF0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpmb3JpblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHNlcXVlbmNlcy5maW5kKGZ1bmN0aW9uICh4KSB7IHJldHVybiB4LmlkID09PSBzZXEuaWQ7IH0pLnNlcXVlbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ID0gKCtrZXkgKyAxKS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoYXJzIHdpdGggaWNvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgra2V5ID49IHJlZy5zdGFydCAmJiAra2V5IDw9IHJlZy5lbmQgJiYgcmVnLmljb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlZy5pY29uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVnaW9uID0gcmVnLmVuZCAtIChyZWcuc3RhcnQgLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjZW50ZXIgPSBNYXRoLmZsb29yKHJlZ2lvbiAvIDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGljb24gPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVnLmNvbG9yICYmIHJlZy5jb2xvclswXSA9PT0gJygnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVnLmNvbG9yID0gJ3JnYicgKyByZWcuY29sb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkZWZhdWx0IGljb25zXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHJlZy5pY29uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnbG9sbGlwb3AnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb24gPSBJY29ucy5sb2xsaXBvcDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Fycm93UmlnaHQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb24gPSBJY29ucy5hcnJvd1JpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJyb3dMZWZ0Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uID0gSWNvbnMuYXJyb3dMZWZ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnc3RyYW5kJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uID0gSWNvbnMuc3RyYW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnbm9TZWNvbmRhcnknOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb24gPSBJY29ucy5ub1NlY29uZGFyeTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2hlbGl4Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uID0gSWNvbnMuaGVsaXg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd0dXJuJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uID0gSWNvbnMudHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY3VzdG9taXphYmxlIGljb25zIChzdmcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb24gPSByZWcuaWNvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlZy5kaXNwbGF5ID09PSAnY2VudGVyJyAmJiAra2V5ID09PSByZWcuc3RhcnQgKyBjZW50ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dzW3NlcS5pZF1ba2V5XSA9IHsgY2hhcjogaWNvbiB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoIXJlZy5kaXNwbGF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93c1tzZXEuaWRdW2tleV0gPSB7IGNoYXI6IGljb24gfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGFycyB3aXRob3V0IGljb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJvd3Nbc2VxLmlkXVtrZXldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd3Nbc2VxLmlkXVtrZXldID0geyBjaGFyOiAnJyB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIHNlcXVlbmNlc18xID0gc2VxdWVuY2VzOyBfaSA8IHNlcXVlbmNlc18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIHZhciBzZXEgPSBzZXF1ZW5jZXNfMVtfaV07XG4gICAgICAgICAgICAgICAgX2xvb3BfMShzZXEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBmaWx0ZXJlZFJvd3MgPSB7fTtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmZvcmluXG4gICAgICAgIGZvciAodmFyIHJvdyBpbiByb3dzKSB7XG4gICAgICAgICAgICB2YXIgZmxhZyA9IHZvaWQgMDtcbiAgICAgICAgICAgIHZhciBjaGFycyA9IHJvd3Nbcm93XTtcbiAgICAgICAgICAgIGZvciAodmFyIGNoYXIgaW4gcm93c1tyb3ddKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJvd3Nbcm93XVtjaGFyXS5jaGFyICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICBmbGFnID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZmxhZykge1xuICAgICAgICAgICAgICAgIGZpbHRlcmVkUm93c1tyb3ddID0gY2hhcnM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkUm93cztcbiAgICB9O1xuICAgIHJldHVybiBJY29uc01vZGVsO1xufSgpKTtcbmV4cG9ydCB7IEljb25zTW9kZWwgfTtcbiIsInZhciBJY29ucyA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBJY29ucygpIHtcbiAgICB9XG4gICAgSWNvbnMubG9sbGlwb3AgPSAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIwLjdlbVwiIHg9XCIwXCIgeT1cIjBcIiBpZD1cImxvbGxpcG9wXCIgdmlld0JveD1cIjAgMCAzNDAuMTYgOTUwLjkzXCI+PHBhdGggZmlsbD1cInJnYigyNTUsIDk5LCA3MSlcIiBkPVwiTTMxMS40NjUsMTQxLjIzMmMwLDc4LTYzLjIzMSwxNDEuMjMyLTE0MS4yMzIsMTQxLjIzMiAgYy03OCwwLTE0MS4yMzItNjMuMjMyLTE0MS4yMzItMTQxLjIzMlM5Mi4yMzIsMCwxNzAuMjMyLDBDMjQ4LjIzMywwLDMxMS40NjUsNjMuMjMyLDMxMS40NjUsMTQxLjIzMnogTTE5NCwyODAuODc4aC00Ny45ODNWNTY2LjkzICBIMTk0VjI4MC44Nzh6XCIvPjwvc3ZnPic7XG4gICAgSWNvbnMuYXJyb3dMZWZ0ID0gJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMC43ZW1cIiBpZD1cIkxpdmVsbG9fMVwiIHg9XCIwcHhcIiB5PVwiMHB4XCIgdmlld0JveD1cIjAgMCA5NjMuNzggMTU4Ny40XCIgZW5hYmxlLWJhY2tncm91bmQ9XCJuZXcgMCAwIDk2My43OCAxNTg3LjRcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPjxyZWN0IHN0eWxlPVwiZmlsbDp0cmFuc3BhcmVudFwiIHg9XCIwLjQ3N1wiIHk9XCI0MTIuODE4XCIgc3Ryb2tlPVwiIzAwMDAwMFwiIHN0cm9rZS1taXRlcmxpbWl0PVwiMTBcIiB3aWR0aD1cIjk2My43ODFcIiBoZWlnaHQ9XCI3NjMuNjM2XCIvPjxnPjxkZWZzPjxyZWN0IHdpZHRoPVwiOTY0XCIgaGVpZ2h0PVwiMTU4N1wiPjwvcmVjdD48L2RlZnM+PGNsaXBQYXRoPjx1c2Ugb3ZlcmZsb3c9XCJ2aXNpYmxlXCI+PC91c2U+PC9jbGlwUGF0aD48cG9seWdvbiBzdHlsZT1cImZpbGw6I0ZEREQwRDtcIiBmaWxsLXJ1bGU9XCJldmVub2RkXCIgY2xpcC1ydWxlPVwiZXZlbm9kZFwiIHBvaW50cz1cIjE1ODkuNjQsNDExLjc3IDE1ODkuNjQsMTE3OS4zNyAgICA3NTYuMDQsMTE3OS4zNyA3NTYuMDQsMTU5MS4xNSAwLDc5NS41NyA3NTYuMDQsMCA3NTYuMDQsNDExLjc3ICBcIj4gPC9wb2x5Z29uPjwvZz48L3N2Zz4nO1xuICAgIEljb25zLmFycm93UmlnaHQgPSAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIwLjdlbVwiIGlkPVwiTGF5ZXJfMVwiIHg9XCIwcHhcIiB5PVwiMHB4XCIgdmlld0JveD1cIjAgMCA5NjQgMTU4N1wiIGVuYWJsZS1iYWNrZ3JvdW5kPVwibmV3IDAgMCA5NjQgMTU4N1wiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+ICA8aW1hZ2UgaWQ9XCJpbWFnZTBcIiB3aWR0aD1cIjk2NFwiIGhlaWdodD1cIjE1ODdcIiB4PVwiMFwiIHk9XCIwXCIgaHJlZj1cImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBOFFBQUFZekNBTUFBQUFGM1FUREFBQUFCR2RCVFVFQUFMR1BDL3hoQlFBQUFDQmpTRkpOIEFBQjZKZ0FBZ0lRQUFQb0FBQUNBNkFBQWRUQUFBT3BnQUFBNm1BQUFGM0NjdWxFOEFBQUJ6bEJNVkVYLy8vLy8vZlArNjI3KzYzSC8gL09mLy9PdjkzUTM5NHpiLy9Pejk1RDcvL2ZMOTVVai8vdmIrNTFMLy92bis2RjcvLy96KzZXTC8vLzMrNjIvLy8vNys3WHorN29UKyA4Slg5M1E3KzhxTDkzUS8rODZqOTNoSCs5TFA5M2hUKzlyNzkzaGYvOThqOTN4bi8rTXo5M3g3LytkVDk0Q1QvK3R6OTRTci8rK1A5IDRqTC8vT24rNkYzKzZXSCs3SHYrN1lMKzhacis4NmYrOUxMKzlyMy85OGYvK012OTRpMy8vT2I5NHpYOTVEMy8vZkg5NVVmKzUxSCsgNTFiLy92cis2bTMrN0hyKzdZSCs4SlQrOFpuKzhxYis5TEg5M2hYKzlzSC8rZFAvKytYKzVsRCs1MVgrN0huKzdZRCs3NHIrOHFYKyA5cnorOXNEOTN4ai8rTXI5NENQLyt0djk0U245NFN6OTVEejk1VWIrNWt2KzZXRCs2bXorN1gvKzdvbjkzUkQrOUxEOTNoTCs5Ylg5IDN4My8rZEw5NENiLyt0Ny8rK1Q5NGpULy92WDk1a3IrNTFUKzZtdis3WDcrN29mKzhKais4cVQrOXIvLzk4bi8rZEgvK3RyLy9PcjkgNUR2Ly9mRDk1RC8rNTFQKzZGLys3WDMrN29iKzhKZis4cVArOUsvKzlMVDk0Qi8vK2RYOTRDWC8rdDM5NFN2OTRqUDk1VW4rNm1yKyA2M0QrOEpiOTN4eis3NHY5M2hQKzdvajk0enYrN29QLy9lLys3SGo5NUVEKzdvWC8rTkQ5NVVYKzZXUCs5SzcrOHFIU0RnWFFBQUFBIEFXSkxSMFFBaUFVZFNBQUFBQWx3U0ZsekFBQUFZQUFBQUdBQThHdEN6d0FBQUFkMFNVMUZCK1FNQ2dvakkvb1ZmWlFBQUMrcVNVUkIgVkhqYTdkMTNneDNGdmVkaExheWFaR0FBWTRaaEVFS0lKQkFtcjhqWWdDN1JnQkFJRVN4QVpJSEpPUW9RMFFzczE5ZDM5OTJ1VFZTWSBjTTdwcnY1VmVKNVhVRjExUHY5SjMxbXpwaTcvNDdERERqdjhmMGFmQXBqWjJ1NWZqamd5K2hqQXJINk11RHZxNk9oekFEUDZLZUx1IG1OOUZId1NZemM4UmQ4Y2VGMzBTWUNhL1JOd2RQeGQ5RkdBV3YwYmNuWEJpOUZtQUdmd1djWGZTNzZNUEEweHZ2NGk3azZNUEEweHYgLzRpN1AwU2ZCcGphQVJGM3AwUWZCNWpXZ1JIUG54cDlIbUJLQjBiY0xad1dmU0JnT2dkRjNDMmVIbjBpWUNvSFI5eXRPeVA2U01BMCBEb200VzM5bTlKbUFLUndhY2JmaHJPaERBWk5iSXVKdTQ5blJwd0ltdGxURTNUbm5SaDhMbU5TU0VYZm5uUjk5TG1CQ1MwZmNiYm9nICttREFaSmFKMk93V2xHSzVpTTF1UVNHV2pkanNGcFJoK1lqTmJrRVJWb2k0dTNBdStuVEFxbGFLdU50c2RndXl0MkxFM1dGbXR5QjMgSzBmY1hSUjlQbUFWcTBUYy9USDZnTURLVm92WTdCWmtidFdJdTR1amp3aXNaUFdJRnk2SlBpT3dndFVqN2hZdmpUNGtzTHdKSXU3VyBYUlo5U21CWmswVGNyYjg4K3BqQWNpYUt1TnR3UmZRNWdXVk1GckhaTGNqV2hCR2IzWUpjVFJxeDJTM0kxTVFSZDFmK3IraXpBa3VZIFBPSnVpOWt0eU5BVUVYZFhYUjE5V3VBUTAwVGNYV04yQzdJelZjVGR0V2EzSURmVFJkeGRkMzMwZ1lFRFRSbHh0M2t1K3NUQUFhYU4gdUx2QjdCWmtaZXFJdXh1amp3enNiL3FJdXo5Rm54bll6d3dSZDMrT1BqVHdtMWtpN202S1BqWHdxNWtpWHJnNSt0akFMMmFLdUZ1OCBKZnJjd005bWk5anNGbVJqeG9pN3JmOFJmWExnUjdOR2JIWUxNakZ6eE4zR1c2UFBEcXpwRTdIWkxjaENqNGpOYmtFTytrVGNYWGxiIDlQR0JYaEYzVzlaR254K2ExeTlpczFzUXJtZkVacmNnV3QrSXU5dk5ia0dvM2hGM2Q1amRna2o5SXphN0JhRUdpTmpzRmtRYUl1THUgenVpdmdJWU5FbkYzVi9SblFMdUdpYmo3Uy9SM1FMTUdpdGpzRmtRWkt1S0Z1Nk8vQkJvMVZNUm10eURJWUJGMzYrNkovaFpvMG5BUiBkMXZ2amY0WWFOR0FFWGZiN292K0dtalFrQkdiM1lJQWcwYmNiYjgvK251Z09jTkczRDFnZGd0R05uREUzUTZ6V3pDdW9TTTJ1d1VqIEd6emk3a0d6V3pDbTRTUHVkcHJkZ2hFbGlMaDdTTVV3bmhRUm05MkNFU1dKdUh0NEx2cTdvQmxwSXU0ZU1ic0ZJMGtVc2RrdEdFdXEgaUx0SG83OE1HcEVzNHU2djBaOEdiVWdYc2RrdEdFWENpTTF1d1JnU1J0enRlaXo2NjZBQktTUHVIbjhpK3ZPZ2Zra2pOcnNGNmFXTiAyT3dXSkpjNDRtNzNrOUZmQ0pWTEhiSFpMVWdzZWNUZFUwOUhmeU5VTFgzRTNZNW5vajhTYWpaQ3hOMnpacmNnblRFaU5yc0ZDWTBTIGNiZnp1ZWp2aEdxTkUzSDN2Tmt0U0dTa2lMczlacmNnamJFaU5yc0ZpWXdXY2ZlQzJTMUlZYnlJdThOVkRBbU1HSEgzWXZUSFFvM0cgakxqN1cvVFhRb1ZHamJoN0tmcHpvVDdqUmp6L2N2VDNRblhHamRqc0ZneHU1SWpOYnNIUXhvNjQyL3BLOUNkRFhVYVB1TnYyYXZRMyBRMVhHajdqYi9WcjBSME5OQWlMdXRyOGUvZFZRa1lpSXpXN0JnRUlpTnJzRnc0bUp1SHYyamVnUGgxb0VSZHk5K1ZiMGwwTWxvaUx1IDNqNDYrdE9oRG1FUm05MkNZY1JGM0wxelhQVEhRdzBDSSs3ZW5ZditlcWhBWk1SbXQyQUFvUkdiM1lMK1lpUHUzb3YrZmloZWNNVGQgKzlFWEFLV0xqcmo3SVBvR29IRGhFYzkvR0gwRlVMYndpTHRkSDBYZkFSUXRQdUp1OGVQb1M0Q1NaUkJ4dC9XTTZGdUFndVVRc2RrdCA2Q0dMaU0xdXdlenlpTGpiKzBuMFJVQ3BNb200Ky9TejZKdUFRdVVTY2JmUDdCYk1KSnVJdTgvTmJzRXM4b25ZN0JiTUpLT0l6VzdCIExIS0t1UHZDN0JaTUxhdUl6VzdCOVBLS3VEdCtMdnBDb0RTWlJkeDlhYkFIcHBOYnhOMVhLb2FwWkJleDJTMllUbjRSbTkyQ3FXUVkgY2ZkMTlLVkFTWEtNMk93V1RDSEhpTHVGMDZLdkJjcVJaY1RkNHVuUjl3TEZ5RFBpYnAzWkxaaFFwaEYzNjgrTXZoa29SSzRSZDkrWSAzWUtKWkJ0eHQvZnM2THVCSXVRYnNka3RtRWpHRVhmN3pvKytIU2hBemhGM204eHV3YXF5anJnNzRzam8rNEhzNVIxeGQ1VFpMVmhGIDVoRjN4NWpkZ3BYbEhuRjNyTmt0V0ZIMkVadmRncFhsSDNGM3dvblJsd1E1S3lEaTdpU3pXN0M4RWlMdVRvNitKY2hZRVJGM2Y0aSsgSnNoWEdSRjNwMFRmRTJTcmtJam5UNDIrS01oVklSR2IzWUxsbEJLeDJTMVlSakVSbTkyQ3BaVVRzZGt0V0ZKQkVYY2J6b3ErTGNoUSBTUkdiM1lJbEZCVnhkODY1MGZjRjJTa3I0dTQ4czF0d2tNSWlOcnNGQnlzdFlyTmJjSkRpSWphN0JRY3FMMkt6VzNDQUFpTTJ1d1g3IEt6SGk3c0s1Nkd1RGZCUVpjYmZaN0JiOG9zeUl1OFBNYnNIUENvMjR1eWo2NGlBWHBVYmMvVEg2NWlBVHhVWnNkZ3QrVW03RTNjWFIgZHdkWktEamloVXVpTHc5eVVIREUzZUtsMGJjSEdTZzVZck5ic0tid2lMdjFsMGZmSDRRck8rSnV3eFhSRndqUkNvKzQyMmgyaTlhViBIckhaTFpwWGZNUm10MmhkK1JGM215Nkl2a1NJVkVIRTNSYXpXN1NzaG9pN3E2Nk92a2FJVTBYRTNUVm10MmhYSFJGMzE1cmRvbG1WIFJOeGRkMzMwVFVLUVdpTHVOczlGWHlYRXFDYmk3Z2F6VzdTcG5vaTdHNlB2RWtKVUZISDNwK2pMaEFnMVJkejlPZm8ySVVCVkVYYzMgUlY4bmpLK3VpQmR1anI1UEdGMWRFWGVMdDBSZktJeXRzb2k3ZFpkRjN5aU1yTGFJdTYzL0VYMmxNSzdxSWphN1JXdnFpN2piZUd2MCBwY0tZS296WTdCWnRxVEZpczFzMHBjcUl1eXR2aTc1WEdFMmRFWGRiMWtaZkxJeWwwb2pOYnRHT1dpTTJ1MFV6cW8yNHU5M3NGbTJvIE4rTHVEck5iTktIaWlNMXUwWWFhSXphN1JST3FqdGpzRmkyb08rTHVydWo3aGVRcWo3ajdlL1FGUTJxMVIyeDJpK3BWSC9IQzNkRlggREdsVkg3SFpMV3BYZjhSbXQ2aGNBeEYzVysrTnZtVklxSVdJdTIzM1JWOHpwTk5FeEdhM3FGa2JFWGZiNzQrK2FFaWxrWWk3Qjh4dSBVYXRXSXU1Mm1OMmlVczFFYkhhTFdyVVRjZmVnMlMycTFGREUzVTZ6VzlTb3BZaTdoMVJNaFpxSzJPd1dOV29yWXJOYlZLaXhpTHRIIHpHNVJtOVlpN3U2TXZuRVlXSE1SZDQ5R1h6a01xNzJJdTc5RzN6a01xc0dJelc1Umx4WWpOcnRGVlZxTXVGdDhMUHJhWVRoTlJ0ejkgNzN1aTd4MEcwMmJFWnJlb1NLTVJtOTJpSHExRzNPMStNdnJxWVJqTlJteDJpMXEwRzNIMzFOUFJsdzlEYURqaWJzY3owYmNQQTJnNSA0dTVaczF0VW9PbUl6VzVSZzdZajduWStGLzBBMEZmakVYZlBtOTJpZEsxSDNPMHh1MFhobW8rNGUzZ3UrZzJnRnhGM0w1amRvbWdpIDdyckRWVXpKUlB3dkwwYS9BdlFnNG4vN052b1pZSFlpL3RGTDBlOEFNeFB4aitaZmpuNEltSldJZjdMcnNlaVhnQm1KK0dlUFB4SDkgRkRBYkVmOWk2eXZSYndFekVmR3Z0cjBhL1Jnd0N4SC94dXdXUlJMeGZyYS9IdjBjTUQwUjc4L3NGZ1VTOFFITWJsRWVFUi9JN0JiRiBFZkZCM253citrbGdPaUkrMk50SFI3OEpURVhFaHpDN1JWbEVmS2c5eDBXL0NreEJ4RXQ0ZHk3NldXQnlJbDZLMlMwS0l1SWxtZDJpIEhDSmVtdGt0aWlIaVpid2YvVEl3SVJFdjU0UG9wNEhKaUhnNVpyY29oSWlYdGV1ajZNZUJTWWg0ZVlzZlI3OE9URURFSzloNlJ2VHogd09wRXZCS3pXeFJBeEN2YS9WcjBBOEZxUkx5eXZaOUV2eENzUXNTcitQU3o2Q2VDbFlsNE5mdk1icEUzRWEvcTh6ZWlId2xXSXVMViBtZDBpYXlLZWdOa3RjaWJpU1h4aGRvdDhpWGdpNzVqZElsc2luc3p4YzlFdkJjc1E4WVMrTk5oRHBrUThxYTlVVEo1RVBMSDNvdDhLIGxpVGl5Wm5kSWtzaW5zTFgwYThGU3hEeEZPWS9qSDR1T0pTSXA3RndXdlI3d1NGRVBKWEYwNk1mREE0bTR1bXNNN3RGYmtROHBmVm4gUmo4WkhFakUwL3JHN0JaNUVmSFU5cDRkL1dpd1B4RlB6K3dXV1JIeERQYWRILzFzOEJzUno4THNGaGtSOFV5K003dEZOa1E4bTZQTSBicEVMRWMvb0dMTmJaRUxFc3pyVzdCWjVFUEhNekc2UkJ4SFA3b1FUbzE4UDFvaTRsNVBNYnBFQkVmZHhjdlR6Z1loNytrUDArNEdJIGV6SzdSVGdSOXpOL2F2UUwwandSOTJSMmkyZ2k3c3ZzRnNGRTNKdlpMV0tKdUQrelc0UVM4UUEybkJYOWpMUk14RU13dTBVZ0VRL2kgMDNPakg1SjJpWGdZNTVuZElvcUlCN0xKN0JaQlJEeVVJNDZNZmtzYUplTEJtTjBpaG9pSFkzYUxFQ0lla05rdElvaDRTQmZPUmI4biBEUkx4b014dU1UNFJEK3N3czF1TVRjUUR1eWo2UldtT2lJZjJmZlNUMGhvUkQrNlU2RGVsTVNJZTNzWFJqMHBiUkR5OGhVdWlYNVdtIGlEaUJ4VXVqbjVXV2lEZ0ZzMXVNU01SSnJMODgrbUZwaDRqVDJIQkY5TXZTREJFbnN0SHNGaU1SY1Nybm1OMWlIQ0pPeHV3VzR4QnggT3BzdWlINWRtaURpaExhWTNXSUVJazdwcXF1ajM1Y0dpRGlwYTh4dWtaeUkwN3JXN0JhcGlUaXg2NjZQZm1KcUorTFVOcHZkSWkwUiBKMmQyaTdSRW5ONk4wWTlNM1VROGdqOUZ2ekpWRS9FWXpHNlJrSWhIY1ZQME8xTXhFWTlpNGVib2g2WmVJaDZIMlMyU0VmRkkxbDBXIC9kVFVTc1JqTWJ0RklpSWVqZGt0MGhEeGVEYmVHdjNhVkVuRUl6SzdSUW9pSHBQWkxSSVE4YWl1dkMzNndhbVBpTWRsZG92QmlYaGsgWnJjWW1vakhabmFMZ1lsNGRMZWIzV0pRSWg3ZkhXYTNHSktJQTJ5ZWkzNTJhaUxpQ0RlWTNXSTRJZzV4WS9TN1V4RVJ4N2dyK3VHcCBoNGlEL0QzNjVhbUdpS09ZM1dJZ0lvNnljSGYwMjFNSkVZZFp2Q1g2OGFtRGlPT1kzV0lRSWc2MDlkN281NmNHSW82MDRiN285NmNDIElnNWxkb3YrUkJ4cisvM1J2d0NLSitKZ0Q1amRvaWNSUnpPN1JVOGlEcmRsYmZTUGdMS0pPTjZEWnJmb1E4UVoyR2wyaXg1RW5JT0ggVkR5cS8xT1hjNk4vdi96Yk84Ynp4clFyK3IycGtkbXRNWW1ZRkI0eHV6VWVFWlBFbmRHLzdJYUltRFFlamY1cHQwUEVKUExYNk45MiBNMFJNS21hM1JpSmlVakc3TlJJUms0elpyWEdJbUhUVzNSUDkrMjZDaUVuSTdOWVlSRXhLMjh4dXBTZGlrdHI5WlBSUHZINGlKaTJ6IFc4bUptTVNlZWpyNlIxNDdFWlBhRHJOYmFZbVk1SjQxdTVXVWlFblA3RlpTSW1ZRU81K0wvcUhYVE1TTTRYbXpXK21JbUZIc3VUNzYgcDE0dkVUT09oK2VpZit2VkVqRWplY0hzVmlJaVppdy9SUC9ZYXlWaVJ2Tmk5Sys5VWlKbVBOOUcvOXpySkdKRzlGTDA3NzFLSW1aRSA4eTlILytCckpHTEd0T3V4NkY5OGhVVE1xQjUvSXZvblh4OFJNNjZ0cjBULzVxc2pZa2EyN2RYb0gzMXRSTXpZekc0TlRNU01idnZyIDBULzd1b2lZOFpuZEdwU0lDYkRqbWVnZmZrMUVUQVN6V3dNU01TSGVmQ3Y2cDE4UEVSUGpQNCtPL3UxWFE4UUVNYnMxRkJFVFpjOXggMGIvK1NvaVlNTy9PUmYvODZ5Qmk0cGpkR29TSUNYUzRpZ2NnWWlLWjNScUFpQW4xZm5RQkZSQXhzVDZJVHFCOElpYVcyYTNlUkV5dyBYUjlGUjFBNkVSUHQ4WStqS3lpY2lBbTM5WXpvRE1vbVl1S1ozZXBGeEdSZzkydlJJWlJNeE9SZzd5ZlJKUlJNeEdUaDA4K2lVeWlYIGlNbkRQck5ic3hJeG1majhqZWdZU2lWaWNtRjJhMFlpSmh0dm05MmFpWWpKeHhkbXQyWWhZakx5anRtdEdZaVluQncvRjExRWdVUk0gVnI0MDJETTFFWk9YcjFROExSR1RtZmVpbXlpT2lNbU4yYTBwaVpqc21OMmFqb2pKenZ5SDBWbVVSY1RrWitHMDZDNktJbUl5dFBoeCBkQmdsRVRFNU1yczFCUkdUcGZWblJxZFJEaEdUcDIvTWJrMUt4R1RLN05ha1JFeXV6RzVOU01Sa2E5LzUwWG1VUWNUa3kreldSRVJNIHhyNHp1elVCRVpPem84eHVyVTdFWk8wWXMxdXJFakY1TzliczFtcEVUT2JNYnExR3hPVHVoQk9qSzhtY2lNbmVTV2EzVmlSaThuZHkgZENaNUV6RUYrRWQwSjFrVE1TWDRPanFVbkltWUVzeWZHbDFLeGtSTUVjeHVMVS9FbEdIeDlPaFdzaVZpQ3JITzdOWXlSRXdwekc0dCBROFFVNDV2L2lzNGxUeUttSEh2UGp1NGxTeUttSUdhM2xpSmlTbUoyYXdraXBpaWJ6RzRkUXNTVTVZZ2pvNXZKam9ncGpObXRnNG1ZIDBwamRPb2lJS1k3WnJRT0ptUEpjT0JmZFRWWkVUSUhNYnUxUHhKVEk3TlorUkV5Ukxvb3VKeU1pcGt6ZlI2ZVREeEZUcUZPaTI4bUcgaUNuVnhkSHg1RUxFbEdyaGt1aDZNaUZpaW1WMjZ5Y2lwbHhtdDM0a1lncTIvdkxvZ0hJZ1lrcTI0YXpvZ2pJZ1lvcTIwZXlXaUNuYyBPZWRHTnhST3hCVHV2T1pudDBSTTZUWmRFRjJSaUtHZjFtZTNSRXo1cnJvNnVpTVJRei9YTkQyN0pXSnFjRzNMczFzaXBnclhYUitkIGtvaWhuODN0em02Sm1Fb2MxdXpzbG9pcFJiT3pXeUttR24rS3JrbkUwRk9qczFzaXBpSVhSL2NrWXVobjRlYm9vRVFNL1N4ZUdsMlUgaUtHZmRaZEZKeVZpNktmQjJTMFJVNWtOVjBSSEpXTG9aK090MFZXSkdQcHBiWFpMeE5TbnNka3RFVk9oSzIrTERrdkUwTStXbG1hMyBSRXlWV3ByZEVqRjFhbWgyUzhSVTZ2Wm1acmRFVEszdWFHVjJTOFJVYS9OY2RGNGlobjV1YUdOMlM4UlU3TWJvdmtRTVBkMFZIWmlJIG9hYy9SeGNtWXVqcHB1akVSQXo5TkRDN0pXSXF0M2hMZEdRaWhuNnFuOTBTTWRYYmVtOTBaaUtHZmlxZjNSSXhEYWg3ZGt2RXRHRDcgL2RHbGlSajZlYURpMlMwUjA0YUtaN2RFVENPMnJJMk9UY1RRejRPMXptNkptR2JzckhSMlM4UzA0NkU2S3hZeERhbHpka3ZFdEtUSyAyUzBSMDVSSEtwemRFakZ0dVRNNk9SRkRUNDlHTnlkaTZPa3YwZEdKR0hxcWJYWkx4RFJuNGU3bzdFUU0vVlEydXlWaUdyVHVudWp3IFJBejlWRFc3SldLYXRPMis2UFJFRFAzc2ZqSzZQUkZEUC9YTWJvbVlWajMxZEhSOUlvWitkbFF5dXlWaTJ2VnNIYk5iSXFaaGRjeHUgaVppVzdYd3V1a0FSUXovUFZ6QzdKV0xhdHFmODJTMFIwN2lINTZJakZESDA4MExwczFzaXBuay9SRmNvWXVpcDhOa3RFVVAzYlhTSCBJb2FlWG9vT1VjVFF6M3pKczFzaWhuL1o5VmgwaWlLR2ZoNS9JcnBGRVVNL1cxK0pqbEhFMEUreHMxc2locCtWT3JzbFl2akY5dGVqIGV4UXg5RlBtN0phSTRUYzdub2t1VXNUUVQ0bXpXeUtHL2IzNVZuU1RJb1orL2xuYzdKYUk0VURGelc2SkdBNnk1N2pvTEVVTS9idzcgRjkybGlLR2ZzbWEzUkF5SE9yeWtpa1VNUzNneHVrd1JRMDkvaTA1VHhORFRCOUZ0aWhqNm1YODVPazRSUXorN1BvcXVVOFRRVHlteiBXeUtHNVd3OUk3cFBFVU0vMjE2TkRsVEUwTS91MTZJTEZUSDBzL2VUNkVSRkRQMTgrbGwwb3lLR2Z2WmxQN3NsWWxqWjUyOUVWeXBpIDZDZjMyUzBSdzJyZVBqcTZVeEZEUDE5a1Bic2xZbGpkT3puUGJva1lKbkQ4WEhTcUlvWit2c3gzc0VmRU1KR3ZzcTFZeERDWjk2SmogRlRIMDlINTByU0tHbmpLZDNSSXhUR3IrdytoZVJRejlMSndXSGF5SW9aL0ZqNk9MRlRIMGsrUHNsb2hoR3R2T2pHNVd4TkRQTjluTiBib2tZcHBQZDdKYUlZVXE1elc2SkdLYTE3L3pvYmtVTS9lUTF1eVZpbU41M09jMXVpUmhta05Qc2xvaGhGc2ZrTTdzbFlwakpzZG5NIGJva1lacFBON0phSVlVYi9mV0owdmlLR2ZrN0tZM1pMeERDems2UDdGVEgwOUkvb2dFVU1QWDBkWGJDSW9aLzVVNk1URmpIMGs4SHMgbG9paGw4WFRSUXhsV3hjOXV5Vmk2R2w5OE95V2lLR3Y0Tmt0RVVOdmU4OFdNWlF0ZEhaTHhEQ0F5Tmt0RWNNUU5zWE5ib2tZQm5IRSBrU0tHc2gwVk5ic2xZaGhJMU95V2lHRW9RYk5iSW9iQlhEZ25ZaWpiQ1JHeld5S0dBVVhNYm9rWWhoUXd1eVZpR05UM0lvYkNuU0ppIEtOdm9zMXNpaG9FdFhDSmlLTnZJczFzaWhzR05PN3NsWWhqZStzdEZER1hiY0phSW9Xd2J4NXZkRWpFa2NjNjVJb2F5blRmVzdKYUkgSVpGTkY0Z1l5amJTN0phSUlabWpyaFl4bE8yYU1XYTNSQXdKWFR2QzdKYUlJYVhycmhjeGxHMXo4dGt0RVVOYWg2V2UzUkl4SkhhUiBpS0Z3ZnhReEZDN3Q3SmFJSWIyTFJReGxTenE3SldJWXdlS2xJb2F5cmJ0TXhGQzJkTE5iSW9aeGJMaEN4RkMyamJlS0dNcVdhSFpMIHhEQ2FOTE5iSW9ieFhIbWJpS0ZzV3hMTWJva1l4blRWOExOYklvWlJEVCs3SldJWTErQ3pXeUtHa2QweDhPeVdpR0ZzbStkRURHVzcgWWREWkxSSEQrRzRVTVJUdUxoRkQ0ZjRzWWlqY1RTS0dzaTNjTEdJbzIrSXRJb2F5RFRXN0pXS0lzdlZlRVVQWmhwbmRFakhFR1dSMiBTOFFRNkp6N1JReGxlNkQvN0phSUlWVC8yUzBSUTZ3dGEwVU1aZXM3dXlWaWlMYXozK3lXaUNIYzdiMW10MFFNOFhyTmJva1lNdEJuIGRrdkVrSU5IWnAvZEVqRms0VTRSUStGbW50MFNNV1RpTHlLR3dzMDR1eVZpeU1YQzNTS0dzczAydXlWaXlNZTZlMFFNWlp0bGRrdkUga0pOdDk0a1l5cmI3U1JGRDJiWlBPN3NsWXNqTVUwK0xHTXEyWTdyWkxSRkRkcDZkYW5aTHhKQ2ZCNmVaM1JJeFpHam5jeUtHc2owLyArWGllaUNGTGV5YWUzUkl4NU9uaE9SRkQyU2FkM1JJeDVPb0hFVVBoSGhVeEZPNWJFVVBoWGhJeGxHMStndGt0RVVQT2RqMG1ZaWpiIDQwK0lHTXEyOVJVUlE5bFdtOTBTTWVSdWxka3RFVVAydHI4dVlpamJpck5iSW9ZQzdIaEd4RkMyRldhM1JBeEZlUE10RVVQWi92bWMgaUtGc3k4MXVpUmhLc2VjNEVVUFozcDBUTVpUdGhkK0xHTXAyK085RkRHVjdVY1JRdUwrSkdBcjNrb2loYlBNdml4akt0dXNqRVVQWiBEcHJkRWpFVTU4RFpMUkZEZWJhOUttSW8yKzdYUkF4bDIyOTJTOFJRcEtjK0V6R1ViZDh6SW9heWZmNkdpS0ZzUDg5dWlSaUs5ZmJSIElvYXlmZkU3RVVQWjNqbE94RkMyZCtkRURHWDdvNGloYU0rdUZUR1U3TjkvYUUzRVVLNGYvK1NwaUtGWVAvMHZDQkZEcVhZLzZWOXMgUWNsK1dRWVFNWlRwMTQwZUVVT1JmbHZMRXpHVWFOZGpsajJnWlBzdnlJc1lDclQvMzNJUk1aVG5XN3ZUVUxRRC83NnBpS0UwUC9oYiBURkMwRjM0dllpalp3M1ArdENtVWJNLzEvc2c0bE96NTM2MFJNUlJzNTNOclJBd0ZlL0RxTlNLR2dqMjdkbzJJb1dBN2Jsc2pZaWpZIGo0TmFJb1ppYmI5L2pZaWhZRDhQYW9rWUNyWHR2alVpaG9KdHZYZU5pS0ZnNis1WkkySW8yT0l0YTBRTUJWdTRlNDJJb1dRM3JSRXggbE95dmEwUU1KWHQwallpaFpIZXUxckNJSVd1UC9GN0VVTExOYzZzMkxHTEkyQjNYcjk2d2lDRmZELzF1Z29aRkRObmFPVkhESW9aYyBMVG1vSldJb3hwYTFrelVzWXNqVGxiZE4yTENJSVVzUG5EOXB3eUtHSEMwN3FDVmlLTUxHV3lkdldNU1FudzMzVGRHd2lDRTdLdzFxIGlSanl0KzZ5cVJvV01XUm01VUV0RVVQdUZtNmVzbUVSUTE1dW1yWmhFVU5XL2o1MXd5S0duTncxZmNNaWhvemNPRVBESW9aODNMRDYgb0phSUlXT1RER3FKR1BJMTBhQ1dpQ0ZidHg4M1c4TWloanhjTTltZ2xvZ2hVMWROT0tnbFlzalRsaU5uYmxqRWtJSEpCN1ZFRERrNiBiL0pCTFJGRGhzNDV0MC9ESW9ab1V3MXFpUml5cytHS2ZnMkxHR0t0djd4bnd5S0dVTk1PYW9rWThySjRhZStHUlF5QnBoL1VFakZrIFpmcEJMUkZEVGs0Wm9tRVJRNWcvRGRLd2lDSEtSY00wTEdJSWN0aE1nMW9paGx4c1BuR2doa1VNSWE2YmNWQkx4SkNIYTJjZDFCSXggWkdIMlFTMFJRdzU2REdxSkdETFFaMUJMeEJCdjB3V0ROaXhpR0ZtL1FTMFJRN1NlZzFvaWhtQWJ6eDY2WVJIRG1EYWNOWGpESW9ZUiA5Ui9VRWpGRVduZEdnb1pGREtNWllsQkx4QkJuNFpJa0RZc1l4bkp4bW9aRkRDTVpabEJMeEJEbCsxUU5peGhHTWRTZ2xvZ2h4bUNEIFdpS0dFQ2NNTnFnbFlvaHc0VnpDaGtVTXlSMDc0S0NXaUdGOHh3dzVxQ1ZpR04xUlI2ZHRXTVNRMWhIRERtcUpHRWEyNlkzVURZc1kgVXRvMzlLQ1dpR0ZVbjM2V3ZtRVJRenA3aHgvVUVqR01LTVdnbG9oaFBPdlBIS1ZoRVVNaWFRYTFSQXhqV1R4OXBJWkZERWtzbkRaVyB3eUtHRk9aUEhhMWhFVU1LWDQvWHNJZ2hnVCtNMkxDSVlYZ25qOW13aUdGd0p5VWMxQkl4cEpkMFVFdkVrTnp4YytNMkxHSVlWdUpCIExSRkRZcWtIdFVRTWFTVWYxQkl4SlBYZFcrTTNMR0lZenVmcEI3VkVEQW1OTWFnbFlraG5sRUV0RVVNeWV6K0phVmpFTUl4dlhndHEgV01Rd2lMRUd0VVFNYVd3ZGExQkx4SkRFNHNkeERZc1kraHR4VUV2RWtNRDhoNUVOaXhoNkczTlFTOFF3dlBkakd4WXg5UFJlY01NaSBobjYrR25kUVM4UXdzQy9ER3hZeDlESDZvSmFJWVZEdmpENm9KV0lZMGhmakQycUpHQWIwZHNDZ2xvaGhPRzlHREdxSkdBWVRNNmdsIFloakt2bWVpNHhVeDlCRTFxQ1ZpR0ViWW9KYUlZUkM3d3dhMVJBeEQyUFpxZExnaWhqNGlCN1ZFRFAwOS9uRjB0aUtHUG5aOUZGMnQgaUtHUCtaZWpveFV4OVBKQmRMTWlobDZpQjdWRURQMjhHRjJzaUtHWHcrUEhlRVFNUGJ5UVk4TWlob205T3hmZHE0aWhqejA1REdxSiBHR2IyZkJhRFdpS0dXZjFuSG9OYUlvWVo1VEtvSldLWXpiTnJvMU1WTWZTeEk1dEJMUkhETEo1Nk9qcFVFVU1mMjErUDdsVEUwTWZ1IEo2TXpGVEgwa2RlZ2xvaGhXbHRmaVk1VXhOREg0MDlFTnlwaTZHUFhZOUdKaWhqNnlHOVFTOFF3bFplaUF4VXg5UEp0ZEo4aWhsNGUgamM1VHhORExEOUYxaWhoNnlYTlFTOFF3cVlmbm91TVVNZlN4NS9yb05rVU1mV1E3cUNWaW1Nak81NkxMRkRIMDhlRFYwV0dLR1BySSBlVkJMeExDNkhiZEZaeWxpNkNQdlFTMFJ3MnEyM3g4ZHBZaWhqOXdIdFVRTUs5dDJYM1NTSW9ZK3R0NGJYYVNJb1k5MTkwUUhLV0xvIFkvR1c2QjVGREgwczNCMmRvNGlobDV1aWF4UXg5UEtYNkJoRkRMMFVNcWdsWWxqR25kRXBpaGg2ZWFTVVFTMFJ3NUkyejBXWEtHTG8gNDQ1eUJyVkVERXQ0cUtCQkxSSERvWGFXM2JDSWFWNVpnMW9paG9OdEtXdFFTOFJ3a0NzTEc5UVNNUnpvZ2ZPakV4UXg5Rkhlb0phSSBZWDhiYjQwT1VNVFF4NFlDQjdWRURMOHBjbEJMeFBDcmRaZEYxeWRpNktQUVFTMFJ3ODhXYm81dVQ4VFFTNm1EV2lLR24vdzl1andSIFF5OTNSWWNuWXVqbHh1anVSQXk5M0ZEd29KYUlvZkJCTFJGRDRZTmFJb2JiajR1T1RzVFF4eldGRDJxSm1OWmRWZnFnbG9ocDNKWWogbzRzVE1mUlJ3YUNXaUduYWVSVU1hb21ZbHAxemJuUnVJb1krNmhqVUVqSHQybkJGZEd3aWhqN1dYeDdkbW9paGoyb0d0VVJNb3hZdiBqUzVOeE5CSFJZTmFJcVpORlExcWlaZ21uUktkbVlpaGx6OUZWeVppNk9XaTZNaEVETDBjVnRlZ2xvaHB6dVlUb3hzVE1mUnhYVzJEIFdpS21NZGRXTjZnbFl0cFM0YUNXaUdsS2pZTmFJcVlsUjlRNHFDVmlHckxwZ3VpNlJBeDlWRHFvSldLYVVldWdsb2hweGNhem85TVMgTWZTeDRhem9za1FNZlZROHFDVmltckR1ak9pdVJBeDlMSjRlblpXSW9ZK0ZTNktyRWpIMGNuRjBWQ0tHWGlvZjFCSXgxZnMrT2lrUiBReS9WRDJxSm1NclZQNmdsWXVwMlF2MkRXaUttYWhmT1JmY2tZdWpqMkJZR3RVUk14WTVwWWxCTHhOVHJxS09qWXhJeDlOSEtvSmFJIHFkV21ONkpURWpIMHNhK1pRUzBSVTZkUFA0c09TY1RReDk2R0JyVkVUSTJhR3RRU01SVmFmMlowUlNLR1Bob2IxQkl4MVdsdFVFdkUgMUdiaHRPaUU0b21Za3MyZkdsMVFCa1JNeWI2T0RpZ0hJcVpnLzRqdUp3c2lwbHduUitlVEJ4RlRySk5hSE5SYWdvZ3BWWnVEV2tzUSBNWVU2Zmk0Nm5seUltREsxT3FpMUJCRlRwR1lIdFpZZ1lrcjBkck9EV2tzUU1RWDY3cTNvY0hJaVlzcnplY09EV2tzUU1jVnBlbEJyIENTS21ORzBQYWkxQnhCUm03eWZSMGVSR3hKVGxtOWVpbThtT2lDbEs4NE5hU3hBeEpkbmEvS0RXRWtSTVFSWS9qZzRtUnlLbUhBYTEgbGlSaWlqSC9ZWFF1ZVJJeHhmZ2d1cFpNaVpoU3ZCOGRTNjVFVENIZWkyNGxXeUttREY4WjFGcU9pQ25DbHhwZWxvZ3BnVUd0RllpWSBBcnhqVUdzRklpWi9YeGpVV29tSXlaNUJyWldKbU55OWFWQnJaU0ltY3dhMVZpTmk4cmJ2bWVoR3NpZGlzbVpRYTNVaUptY0d0U1lnIFlqSzIyNkRXQkVSTXZyYTlHdDFIRVVSTXRneHFUVWJFNU9yeGo2UHJLSVNJeWRTdWo2TGpLSVdJeWRQOHk5RnRGRVBFNU1tZzFzUkUgVEpZTWFrMU94T1RveGVnd1NpSmlNblM0TVo0cGlKajh2S0RoYVlpWTdMdzdGNTFGV1VSTWJ2WVkxSnFPaU1uTTh3YTFwaVJpOHZMUCA1NktiS0k2SXlZcEJyZW1KbUp3OHV6YTZpQUtKbUl6c01LZzFBeEdUajZlZWp1NmhTQ0ltRzl0Zmo4NmhUQ0ltRjd1ZmpLNmhVQ0ltIEV3YTFaaVZpOHJEMWxlZ1dpaVZpc3ZENEU5RXBsRXZFNUdEWFk5RWxGRXpFWkdEKzd1Z1FTaVppTXZCU2RBZEZFekh4dm8zT29Hd2kgSnR5ajBSVVVUc1JFK3lFNmd0S0ptR0FHdGZvU01iRWVub3R1b0hnaUp0U2U2Nk1US0orSWlXUlFhd0FpSnRCT2cxb0RFREZ4SHJ3NiArdmRmQlJFVHhxRFdNRVJNbEIyM1JmLzZLeUZpZ2hqVUdvcUlpYkg5L3VqZmZqVkVUQWlEV3NNUk1SRzIzUmY5eTYrSWlBbXc5ZDdvIEgzNU5STXo0MXQwVC9idXZpb2daM2VJdDBULzd1b2lZc1MwWTFCcVdpQm5iVGRFLyt0cUltSkg5SmZvM1h4MFJNeTZEV29NVE1hTzYgTS9vWFh5RVJNNlpIREdvTlQ4U01hUE5jOUErK1JpSm1QSGNZMUVwQnhJem1JWU5hU1lpWXNlelVjQm9pWmlRR3RWSVJNZVBZWWxBciBGUkV6aWlzTmFpVWpZc2J3d1BuUnYvU0tpWmdSR05SS1NjU2t0L0hXNk45NTFVUk1jaHV1aVA2WjEwM0VwR1pRS3pFUms5aTZ5NkovIDVMVVRNV2taMUVwT3hDUzFjSFAwVDd4K0lpWXBnMXJwaVppVS9oejlBMitCaUVub3J1amZkeE5FVERvM1J2KzgyeUJpa3JuQm9OWW8gUkV3cUJyVkdJbUlTTWFnMUZoR1R4dTNIUmYrMm15RmlrcmpHb05ab1JFd0tWeG5VR28rSVNXRExrZEUvN0paODlIK3I4ditpZjczOCBtMEV0WnJjMit1Zkx2NXhuVUl2WmlUZ0Q1NXdiL1RPZ1pDS09aMUNMWGtRY3pxQVcvWWc0MnZyTG8zOERGRTdFd1F4cTBaZUlZeTFlIEd2MExvSGdpRG1WUWkvNUVIT3JpNlBlbkFpS09kRXIwODFNREVRZjZVL1RyVXdVUng3a28rdkdwZzRqREhHWlFpMEdJT01ybUU2UGYgbmtxSU9NaDFCclVZaUloalhHdFFpNkdJT0lSQkxZWWo0Z2dHdFJpUWlBTWNZVkNMQVlsNGZKc3VpSDUxcWlMaTBSblVZbGdpSHB0QiBMUVltNHBGdFBEdjZ5YW1OaU1lMTRhem9GNmM2SWg2VlFTMkdKK0l4clRzaityMnBrSWhIdEhoNjlITlRJeEdQWitHUzZOZW1TaUllIHo4WFJqMDJkUkR3YWcxcWtJZUt4ZkIvOTFOUkt4Q014cUVVcUloN0hTUWExU0VYRW96akJvQmJKaUhnTUY4NUZ2ek1WRS9FSWpqV28gUlVJaVR1OFlnMXFrSk9Ma2pqbzYrcEdwbTRoVE02aEZZaUpPYk5NYjBVOU03VVNjMWo2RFdxUW00cVErL1N6NmdhbWZpRlBhYTFDTCA5RVNjMERmL0ZmMjh0RURFNmF3L00vcDFhWUtJa3pHb3hUaEVuSXBCTFVZaTRrUVdUb3QrV2xvaDRqVG1UNDErV1pvaDRqUytqbjVZIDJpSGlKUDRSL2E0MFJNUXBuQno5ckxSRXhBa1kxR0pNSWg2ZVFTMUdKZUxCSFQ4WC9haTBSY1JETTZqRnlFUThNSU5hakUzRXczcmIgb0JaakUvR2d2bnNyK2tGcGo0aUg5TGxCTGNZbjRnRVoxQ0tDaUlkalVJc1FJaDdNM2sraUg1TTJpWGdvMzd3Vy9aWTBTc1FEMldaUSBpeUFpSHNaV2cxcEVFZkVnRmorT2ZramFKZUloR05RaWtJZ0hNUDloOURQU01oRVA0SVBvVjZScEl1N3YvZWhIcEcwaTd1Mjk2RGVrIGNTTHU2eXVEV3NRU2NVOWZhcGhnSXU3SG9CYmhSTnpMT3dhMUNDZmlQcjR3cUVVOEVmZGdVSXNjaUhoMmJ4clVJZ2NpbnBsQkxmSWcgNGxudGV5YjY3ZUJISXA2UlFTMXlJZUxaR05RaUd5S2V5VzZEV21SRHhMUFk5bXIwdThHdlJEd0RnMXJrUk1UVGUvemo2RmVEL1loNCBhcnMraW40MDJKK0lwelgvY3ZTYndRRkVQQzJEV21SR3hGUDZXL1NMd1VGRVBKMFhveDhNRGliaXFSeHVqSWZzaUhnYUwyaVkvSWg0IEN1L09SVDhYSEVyRWs5dGpVSXNjaVhoaXp4dlVJa3NpbnRRL240dCtLMWlTaUNka1VJdGNpWGd5ejY2TmZpbFlob2duc3NPZ0Z0a1MgOFNTZWVqcjZuV0JaSXA3QTl0ZWpud21XSitMVjdYNHkrcFZnQlNKZWxVRXQ4aWJpMVd4OUpmcU5ZRVVpWHNYalQwUS9FYXhNeEN2YiA5VmowQzhFcVJMeWkrYnVqSHdoV0krSVZ2UlQ5UHJBcUVhL2syK2puZ2RXSmVBV1BScjhPVEVERXkvc2grbkZnRWlKZWxrRXR5aURpIDVUdzhGLzAyTUJFUkwyUFA5ZEZQQTVNUjhkSU1hbEVNRVM5cHAwRXRpaUhpcFR4NGRmUzd3TVJFdkFTRFdwUkV4SWZhY1Z2MHE4QVUgUkh3SWcxcVVSY1FIMjM1LzlKdkFWRVI4RUlOYWxFYkVCOXAyWC9TTHdKUkVmSUN0OTBZL0NFeEx4UHRiZDAvMGU4RFVSTHlmeFZ1aSBud09tSitMZkxCalVva1FpL3MxTjBZOEJzeER4ci80Uy9SWXdFeEgvd3FBV2hSTHh6KzZNZmdtWWtZaC84b2hCTFVvbDRoOXRub3QrIENKaVZpUC90RG9OYWxFdkUvL0tRUVMwS0p1S3UyNmxoU2laaWcxb1VUc1JiREdwUnR1WWp2dEtnRm9WclBlSUh6bzkrQWVpcDhZZ04gYWxHK3RpUGVlR3YwL1VOdlRVZTg0WXJvNjRmK1dvN1lvQlpWYURqaWRaZEZYejRNb2QySURXcFJpV1lqWHJnNSt1cGhHTTFHYkZDTCBXclFhOForakx4NkcwbWpFZDBYZk93eW16WWh2akw1MkdFNlRFZDlnVUl1S3RCaXhRUzJxMG1ERUJyV29TM3NSMzM1YzlKM0RvSnFMICtCcURXbFNtdFlpdk1xaEZiUnFMZU11UjBSY09RMnNyWW9OYVZLaXBpTTh6cUVXRldvcjRuSE9qYnhzU2FDaGlnMXJVcVoySURXcFIgcVdZaVhuOTU5RlZER3ExRWJGQ0xhalVTOGVLbDBSY05xYlFSc1VFdEt0Wkd4QmRIWHpPazAwVEVwMFRmTWlUVVFzUi9qTDVrU0ttQiBpQytLdm1OSXF2NklEek9vUmQycWozanppZEZYREduVkh2RjFCcldvWGVVUlgydFFpK3JWSGJGQkxScFFkY1JIR2RTaUFUVkhmSVJCIExWcFFjY1NiTG9pK1hCaER2UkViMUtJUjFVWnNVSXRXMUJyeHhyT2pieFpHVW1uRUc4Nkt2bGdZUzUwUkc5U2lJVlZHdk82TTZHdUYgOGRRWThlTHAwYmNLSTZvdzRvVkxvaThWeGxSZnhQTVhSOThwaktxK2lBMXEwWmpxSXY0KytrWmhaTFZGYkZDTDVsUVc4VWtHdFdoTyBYUkdmWUZDTDlsUVY4WVZ6MGRjSjQ2c3A0bU1OYXRHaWlpSSt4cUFXVGFvbjRxT09qcjVMQ0ZGTnhBYTFhRlV0RVc5Nkkvb21JVWdsIEVlOHpxRVd6Nm9qNDA4K2k3eEhDVkJIeFhvTmFOS3lHaUw5NUxmb1dJVkFGRWE4L00vb1NJVkw1RVJ2VW9uSEZSMnhRaTlhVkh2SEMgYWRFM0NNRUtqM2orMU9nTGhHaUZSL3gxOVAxQnVMSWova2YwOVVHOG9pTStPZnIySUFNbFIyeFFDOVlVSGZGL0c5U0NOU1ZIZlB4YyA5TjFCRm9xTjJLQVcvS1RVaUExcXdjOEtqZmh0ZzFyd3N6SWovdTZ0Nkh1RGJCUVo4ZWNHdGVCWEpVWnNVQXYyVTJERUJyVmdmK1ZGIHZQZVQ2RHVEckJRWHNVRXRPRkJwRVc4enFBVUhLaXppclFhMTRDQmxSYno0Y2ZSOVFYYUtpdGlnRmh5cXBJam5QNHkrTGNoUVNSRi8gRUgxWmtLT0NJbjQvK3E0Z1MrVkUvRjcwVlVHZWlvbjRLNE5hc0tSU0l2NVN3N0MwUWlJMnFBWExLU1BpZHd4cXdYS0tpUGdMZzFxdyByQklpTnFnRkt5Z2c0amNOYXNFSzhvL1lvQmFzS1B1STl6MFRmVVdRdDl3ak5xZ0ZxOGc4WW9OYXNKcThJOTV0VUF0V2szWEUyMTZOIHZoN0lYODRSRzlTQ0NXUWM4ZU5QUkY4T2xDRGZpSGQ5RkgwM1VJUnNJNTUvT2ZwcW9BelpSbXhRQ3lhVGE4Ui9pNzRZS0VXbUViOFkgZlM5UWpEd2pQdHdZRDB3cXk0aGYwREJNTE1lSTM1Mkx2aFVvU0lZUjd6R29CVlBJTCtMbkRXckJOTEtMK0ovUFJWOEpsQ1czaUExcSB3WlF5aS9qWnRkRVhBcVhKSytJZEJyVmdXbGxGL05UVDBkY0I1Y2twNHUydlI5OEdGQ2lqaUhjL0dYMFpVS0o4SXQ1MlgvUmRRSkd5IGlYanJLOUZYQVdYS0pXS0RXakNqVENMZTlWajBSVUNwOG9oNC91N29lNEJpNVJIeFM5SFhBT1hLSXVKdm8yOEJDcFpEeEk5R1h3S1UgTElPSWY0aStBeWhhZk1RR3RhQ1g4SWdmbm91K0FpaGJkTVI3cm8rK0FTaGNjTVFHdGFDdjJJaDNHdFNDdmtJamZ2RHE2TStIOGtWRyBiRkFMQmhBWThZN2JvajhlYWhBWHNVRXRHRVJZeE52dmovNTBxRU5VeEFhMVlDQkJFUnZVZ3FIRVJMejEzdWp2aG1xRVJMenVudWpQIGhucEVSTHg0Uy9SWFEwVUNJbDR3cUFVRENvajRwdWh2aHFxTUgvRmZvajhaNmpKNnhBYTFZRmhqUjN4bjlBZERiVWFPK0JHRFdqQ3cgY1NQZVBCZjl2VkNkVVNPK3c2QVdERzdNaUI4eXFBWERHekhpblJxR0JNYUwyS0FXSkRGYXhGc01ha0VTWTBWOHBVRXRTR09raUI4NCBQL3BEb1ZialJIeU9RUzFJWlpTSU45NGEvWmxRcnpFaTNuQkY5RmRDeFVhSTJLQVdwSlErNG5XWFJYOGpWQzE1eEFhMUlLM1VFUy9jIEhQMkZVTG5VRVJ2VWdzUVNSL3puNk8rRDZxV04rSzdvejRQNkpZMzR4dWl2Z3dha2pQZ0dnMXFRWHNLSURXckJHTkpGYkZBTFJwRXMgNHR1UGkvNDBhRU9xaUs4eHFBWGpTQlR4VlFhMVlDUnBJdDV5WlBSM1FUT1NSR3hRQzhhVEl1THpER3JCZUJKRWZNNjUwUjhGTFJrKyBZb05hTUtyQkl6YW9CZU1hT3VMMWwwZC9FVFJtNElnTmFzSFlobzE0OGRMbzc0SG1EQnJ4d2lYUm53UHRHVFRpaTZPL0JobzBaTVNuIFJIOE10R2pBaVA4WS9TM1FwT0VpdmlqNlU2Qk5nMFY4bUVFdENERlV4SnRQalA0U2FOUkFFVjluVUF1Q0RCUHh0UWExSU1vZ0VSdlUgZ2poRFJIeVVRUzJJTTBERVJ4alVna0Q5STk1MFFmUTNRTk42UjJ4UUMyTDFqZGlnRmdUckdmSEdzNk0vQUZyWEwrSU5aMFdmSDVyWCBLMktEV2hDdlQ4VHJ6b2crUGRBbjRzWFRvdzhQOUluWW9CWmtZZWFJNXkrT1Bqcndiek5IYkZBTDhqQnJ4TjlISHh6NHlZd1JueHg5IGJ1Qm5zMFY4a2tFdHlNVk1FWjlnVUF1eU1VdkVGODVGbnhyNDFRd1JIMnRRQ3pJeWZjVEhHTlNDbkV3ZDhWRkhSeDhaMk4rMEVSdlUgZ3N4TUdmR21ONklQREJ4b3VvajNHZFNDM0V3VjhhZWZSUjhYT05nMEVlODFxQVg1bVNMaWIxNkxQaXh3cU1ralhuOW05Rm1CSlV3YyBzVUV0eU5Pa0VSdlVna3hOR1BIQ2FkRUhCWlkyV2NUenAwYWZFMWpHWkJGL0hYMU1ZRGtUUmZ5UDZGTUN5NW9rWW9OYWtMRUpJamFvIEJUbGJQZUwvTnFnRk9WczE0dVBub284SXJHUzFpQTFxUWVaV2lmZ0xnMXFRdVpVamZ0dWdGdVJ1eFlpL2V5djZlTUJxVm9yNGM0TmEga0w4VklqYW9CU1ZZUG1LRFdsQ0VaU1BlKzBuMDBZQkpMQmV4UVMwb3hESVJiek9vQllWWU91S3RCcldnRkV0R3ZQaHg5TEdBU1MwViBzVUV0S01nU0VjOS9HSDBvWUhKTFJQeEI5Sm1BS1J3YThmdlJSd0ttY1VqRTcwV2ZDSmpLd1JGL1pWQUx5bkpReEY5cUdBcHpZTVR2IHprV2ZCNWpTQVJHL1kxQUxpck4veEFhMW9FRDdSV3hRQzByMFc4UnZHdFNDRXYwYXNVRXRLTk12RWU5N0p2b2t3RXgranZncGcxcFEgcUo4aTN2NTY5RG1BR2YwWThXNkRXbENzZjBlODdkWG9Vd0F6VzJ0UUM4cTJ0bnY4aWVnekFEMnMzZlZSOUJHQVBvNThPZm9FTUxMLyBEMXB3V2ZTbFp3bStBQUFBSlhSRldIUmtZWFJsT21OeVpXRjBaUUF5TURJd0xURXlMVEV3VkRFd09qTTFPak0xS3pBd09qQXdwSnIwIGNRQUFBQ1YwUlZoMFpHRjBaVHB0YjJScFpua0FNakF5TUMweE1pMHhNRlF4TURvek5Ub3pOU3N3TURvd01OWEhUTTBBQUFBQVNVVk8gUks1Q1lJST1cIi8+PC9zdmc+JztcbiAgICBJY29ucy5zdHJhbmQgPSAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIwLjdlbVwiIGlkPVwiTGl2ZWxsb18xXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB2aWV3Qm94PVwiMCAwIDk2My43OCAxNTg3LjRcIiBlbmFibGUtYmFja2dyb3VuZD1cIm5ldyAwIDAgOTYzLjc4IDE1ODcuNFwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+PHJlY3Qgc3R5bGU9XCJmaWxsOiNGREREMEQ7XCIgeD1cIjAuNDc3XCIgeT1cIjQxMi44MThcIiBzdHJva2U9XCIjMDAwMDAwXCIgc3Ryb2tlLW1pdGVybGltaXQ9XCIxMFwiIHdpZHRoPVwiOTYzLjc4MVwiIGhlaWdodD1cIjc2My42MzZcIi8+PC9zdmc+JztcbiAgICBJY29ucy5ub1NlY29uZGFyeSA9ICc8c3ZnIHg9XCIwcHhcIiB5PVwiMHB4XCIgd2lkdGg9XCIwLjdlbVwiIHZpZXdCb3g9XCIwIDAgOTYzLjc4IDE1ODcuNFwiPjxyZWN0IHN0eWxlPVwiZmlsbDojNzA2RjZGO1wiIHg9XCIwLjQ3OFwiIHk9XCI2NjUuNTQ1XCIgd2lkdGg9XCI5NjMuNzgxXCIgaGVpZ2h0PVwiMjU2LjM2NFwiLz48L3N2Zz4nO1xuICAgIEljb25zLmhlbGl4ID0gJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMC43ZW1cIiBpZD1cIkxpdmVsbG9fMVwiIHg9XCIwcHhcIiB5PVwiMHB4XCIgdmlld0JveD1cIjAgMCA5NjMuNzggMTU4Ny40XCIgZW5hYmxlLWJhY2tncm91bmQ9XCJuZXcgMCAwIDk2My43OCAxNTg3LjRcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPjxwYXRoIGQ9XCJNMCw2NjUuNTQ1XCIvPjxwYXRoIHN0eWxlPVwiZmlsbDpyZ2IoMjQwLDAsMTI4KTtcIiBkPVwiTTcsNjkxYy0yLjgyNSw1OS42NTksOC40MzUsMTE2LjY1Myw2Ljk2MiwxNzYuMzA5ICBjLTIuMTI2LDg2LjExOSw4Ljk5OSwxNjguOTUzLDIxLjk2NywyNTMuNzRjNy42NzMsNTAuMTcsMTYuMTgzLDEwMC4yNzEsMjcuNzYyLDE0OS43MDZjMTcuNTM4LDc0Ljg3MywzNS42MzUsMTQ4LjQwMiw4MS44MDEsMjExLjM1ICBjMzMuMDM3LDQ1LjA0NSw3Ni41NDIsNjkuODU5LDEzMC41MjEsNzkuMDU2YzE0Ny45NTksMjUuMjA4LDIyNS4xODctMTExLjIyOSwyNTEuOTI5LTIzMi42NzQgIGMyMC41NTMtOTMuMzQ4LDI2LjAyNy0xODguOTk2LDM1Ljk2My0yODMuODI3YzEyLjE2LTExNi4wOTUtOS44NTQtMjQ5LjEzOSw1MS41MzUtMzU0LjUzMyAgYzI2LjIxNi00NS4wMDgsNzkuOTEyLTg3LjgxMSwxMzQuMDQ0LTkzLjY3YzY1LjQ5Ny03LjA5LDExMy42ODksNTIuNTksMTM1LjM4NCwxMDcuNTA2ICBjMjUuNjQ4LDY0LjkyNywzMy4zMjIsMTQxLjU3OSw3MC4xODQsMjAxLjUyOGMxNy4yNDQtMTYuMjYxLDEwLjMyMy03MC41Nyw5LjQ4Ny05NS4xNGMtMS41MDYtNDQuMzA3LDAuODIzLTgzLjMzOS02Ljk2MS0xMjYuOTYgIGMtMjAuMzk1LTExNC4yNzktMjIuOTkyLTIzNi44MDQtNTQuNTY1LTM0Ny44MDhDODY4LjM0LDIxMy42NzgsODEyLjY2My02Mi42MDIsNjI3LjI1NywxMi40NTkgIEM0NzkuNTM4LDcyLjI2NCw0NDguODkzLDI3Ny43NzEsNDMxLjE0Nyw0MTcuMTljLTguNDgxLDY2LjYzMi0xMy44NTQsMTMzLjYyMy0yMi41ODEsMjAwLjIyNSAgYy04LjQ1Nyw2NC41NDQtNS45LDEyNy41OTMtMjIuNDQ0LDE5MS45NzljLTE3Ljc1Miw2OS4wODktNTUuNzM5LDE3Ni45NDctMTI5Ljk4NywyMDIuOTUyYy0zNC42MzMsMTIuMTI3LTcyLjcyNyw3LjY0Ni0xMDQtMTAuNzg3ICBDMzkuMTkzLDkzNC45ODcsNTUuMzI2LDc4Ni4xMjgsNyw2ODFcIi8+PC9zdmc+JztcbiAgICBJY29ucy50dXJuID0gJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMC43ZW1cIiBpZD1cIkxpdmVsbG9fMVwiIHg9XCIwcHhcIiB5PVwiMHB4XCIgdmlld0JveD1cIjAgMCA5NjMuNzggMTU4Ny40XCIgZW5hYmxlLWJhY2tncm91bmQ9XCJuZXcgMCAwIDk2My43OCAxNTg3LjRcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPjxwYXRoIGZpbGw9XCIjNjA4MGZmXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIHN0cm9rZS13aWR0aD1cIjVcIiBzdHJva2UtbWl0ZXJsaW1pdD1cIjEwXCIgZD1cIk0xMjYuODM2LDcwNC4xNDRjLTQyLjk5NiwyOC41NC04NS4xMDMtNC42ODgtMTIzLjU0MS0yOC4xNyAgYzUuNDE2LDMuMzA5LTEuODAzLDgzLjI0OS0xLjAwNCw5My40NGMzLjQzOCw0My44ODksMS4yODIsODAuMjk4LDI4Ljc2MywxMTYuMTcxYzYyLjQ0NSw4MS41MTcsMjEwLjc3NSw5NC40MDIsMjY3LjAzMi0xLjkzICBjNTAuOTM5LTg3LjIyOSw0Ni4yNjMtMTg2LjU1Niw1My40NjctMjgzLjM4N2M2LjExLTgyLjEyNS0xLjU4NC0xNDYuNDEsNzYuMjIxLTE5NC4yNTMgIGM2NC41NjctMzkuNzA0LDEzNi4zNTQtMTEuNDIxLDE2Ni40NTcsNTQuMDY2YzY1LjY2NiwxNDIuODUzLTEzLjMxMSwzNzUuMDI1LDE0Ni4xODUsNDcwLjUxMSAgYzQ1LjgzOCwyNy40NDIsMTA4LjU1NiwyMC40ODMsMTU1LjAxMy0xLjYyMWMyMS43MjMtMTAuMzM2LDUwLjAxNC0yNy44NTgsNjAuNDMzLTUwLjgyMmMxMS43MzUtMjUuODY5LDIuOTY1LTYwLjMwNiwzLjc4Ny04Ny42NjMgIGMxLjA2OC0zNS41NSw5LjMwMi03OS4yMDgtMC42MjgtMTEzLjU5NmMtMjAuNjE3LDEwLjkwMy0zMy44MzIsMzAuMy01OS4xNDIsMzguODk2Yy0yOC42MDEsOS43MTMtNjAuNzc3LDEwLjQ3OS04Mi45MzYtMTMuMTIyICBjLTI2LjE3Ny0yNy44OTEtMTkuNDk3LTcyLjY0My0yNC4wMTMtMTA3LjUwNWMtNy45ODYtNjEuNjY0LTguODMzLTEyNC4zMzQtMTQuNzQ4LTE4Ni4yMjcgIEM3NjYuMzk3LDI4NS42NDEsNzM4LjI4NywxNjEuODIsNjUxLjAwNyw2OC44MThDNTgyLjQ4Mi00LjE5OCw0NTcuODYzLTE5Ljg1OCwzNzIuNjk2LDM0LjAyICBjLTcyLjI0Miw0NS43MDUtMTIzLjk5MSw5MS41MzQtMTUxLjE2NCwxNzYuMDg5Yy0yOS43ODEsOTIuNjczLTM4Ljc3MywyMDAuMjg1LTM4LjQ3NSwyOTcuODY3ICBjMC4xNjcsNTQuODItMi4zNDIsMTUxLjMzNC00OC4yNCwxOTAuMTUyQzEzMi4xNTQsNzAwLjM4LDEyOS40OTMsNzAyLjM4LDEyNi44MzYsNzA0LjE0NHpcIi8+PC9zdmc+JztcbiAgICByZXR1cm4gSWNvbnM7XG59KCkpO1xuZXhwb3J0IHsgSWNvbnMgfTtcbiIsInZhciBPcHRpb25zTW9kZWwgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gT3B0aW9uc01vZGVsKCkge1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAgICAgICBmb250U2l6ZTogJzE0cHgnLFxuICAgICAgICAgICAgY2h1bmtTaXplOiAxMCxcbiAgICAgICAgICAgIGNodW5rU2VwYXJhdGlvbjogMSxcbiAgICAgICAgICAgIGVtcHR5RmlsbGVyOiAnICcsXG4gICAgICAgICAgICBpbmRleGVzTG9jYXRpb246IG51bGwsXG4gICAgICAgICAgICB3cmFwTGluZTogdHJ1ZSxcbiAgICAgICAgICAgIHZpZXdlcldpZHRoOiAnJyxcbiAgICAgICAgICAgIGRvdFRocmVzaG9sZDogOTAsXG4gICAgICAgICAgICBsaW5lU2VwYXJhdGlvbjogJzVweCcsXG4gICAgICAgICAgICBzZXF1ZW5jZUNvbG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBjdXN0b21QYWxldHRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBzZXF1ZW5jZUNvbG9yTWF0cml4OiB1bmRlZmluZWQsXG4gICAgICAgICAgICBzZXF1ZW5jZUNvbG9yTWF0cml4UGFsZXR0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgY29uc2Vuc3VzQ29sb3JJZGVudGl0eTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgY29uc2Vuc3VzQ29sb3JNYXBwaW5nOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBzZWxlY3Rpb246IHVuZGVmaW5lZFxuICAgICAgICB9O1xuICAgIH1cbiAgICBPcHRpb25zTW9kZWwucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbiAob3B0LCBjb25zZW5zdXMpIHtcbiAgICAgICAgLyoqIGNoZWNrIGlucHV0IGZvbnRTaXplICovXG4gICAgICAgIGlmIChvcHQgJiYgb3B0LmZvbnRTaXplKSB7XG4gICAgICAgICAgICB2YXIgZlNpemUgPSBvcHQuZm9udFNpemU7XG4gICAgICAgICAgICB2YXIgZk51bSA9ICtmU2l6ZS5zdWJzdHIoMCwgZlNpemUubGVuZ3RoIC0gMik7XG4gICAgICAgICAgICB2YXIgZlVuaXQgPSBmU2l6ZS5zdWJzdHIoZlNpemUubGVuZ3RoIC0gMiwgMik7XG4gICAgICAgICAgICBpZiAoaXNOYU4oZk51bSkgfHwgKGZVbml0ICE9PSAncHgnICYmIGZVbml0ICE9PSAndncnICYmIGZVbml0ICE9PSAnZW0nKSkge1xuICAgICAgICAgICAgICAgIC8vIHdyb25nIGZvbnRTaXplIGZvcm1hdFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmZvbnRTaXplID0gZlNpemU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBmb250U2l6ZSBub3Qgc2V0XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuZm9udFNpemUgPSAnMTRweCc7IC8vIGRlZmF1bHQgcmVzZXRcbiAgICAgICAgfVxuICAgICAgICAvKiogY2hlY2sgaW5wdXQgY2h1bmtTaXplICovXG4gICAgICAgIGlmIChvcHQgJiYgb3B0LmNodW5rU2l6ZSkge1xuICAgICAgICAgICAgdmFyIGNTaXplID0gK29wdC5jaHVua1NpemU7XG4gICAgICAgICAgICBpZiAoaXNOYU4oY1NpemUpIHx8IGNTaXplIDwgMCkge1xuICAgICAgICAgICAgICAgIC8vIHdyb25nIGNodW5rU2l6ZSBmb3JtYXRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5jaHVua1NpemUgPSBjU2l6ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKiogY2hlY2sgaW5wdXQgc3BhY2VTaXplICovXG4gICAgICAgIGlmIChvcHQgJiYgb3B0LmNodW5rU2VwYXJhdGlvbikge1xuICAgICAgICAgICAgdmFyIGNodW5rU2VwYXJhdGlvbiA9ICtvcHQuY2h1bmtTZXBhcmF0aW9uO1xuICAgICAgICAgICAgaWYgKGNodW5rU2VwYXJhdGlvbiA+PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmNodW5rU2VwYXJhdGlvbiA9IGNodW5rU2VwYXJhdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0ICYmIG9wdC5jaHVua1NpemUgPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmNodW5rU2l6ZSA9IDE7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuY2h1bmtTZXBhcmF0aW9uID0gMDtcbiAgICAgICAgfVxuICAgICAgICAvKiogY2hlY2sgaW5kZXhlc0xvY2F0aW9uIHZhbHVlICovXG4gICAgICAgIGlmIChvcHQgJiYgb3B0LmluZGV4ZXNMb2NhdGlvbikge1xuICAgICAgICAgICAgaWYgKG9wdC5pbmRleGVzTG9jYXRpb24gPT0gXCJ0b3BcIiB8fCBvcHQuaW5kZXhlc0xvY2F0aW9uID09IFwibGF0ZXJhbFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmluZGV4ZXNMb2NhdGlvbiA9IG9wdC5pbmRleGVzTG9jYXRpb247XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLyoqIGNoZWNrIHNlbGVjdGlvbiB2YWx1ZSAqL1xuICAgICAgICBpZiAob3B0ICYmIG9wdC5zZWxlY3Rpb24pIHtcbiAgICAgICAgICAgIGlmIChvcHQuc2VsZWN0aW9uID09IFwiY29sdW1uc2VsZWN0aW9uXCIgfHwgb3B0LnNlbGVjdGlvbiA9PSBcImFyZWFzZWxlY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zZWxlY3Rpb24gPSBvcHQuc2VsZWN0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8qKiBjaGVjayBzZXF1ZW5jZUNvbG9yIHZhbHVlICovXG4gICAgICAgIGlmIChvcHQgJiYgb3B0LnNlcXVlbmNlQ29sb3IpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0LnNlcXVlbmNlQ29sb3IgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvcHQuc2VxdWVuY2VDb2xvcik7XG4gICAgICAgICAgICAgICAgaWYgKGtleXNbMF0ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zZXF1ZW5jZUNvbG9yID0gJ2N1c3RvbSc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5jdXN0b21QYWxldHRlID0gb3B0LnNlcXVlbmNlQ29sb3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuc2VxdWVuY2VDb2xvck1hdHJpeCA9ICdjdXN0b20nO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuc2VxdWVuY2VDb2xvck1hdHJpeFBhbGV0dGUgPSBvcHQuc2VxdWVuY2VDb2xvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAob3B0LnNlcXVlbmNlQ29sb3IgPT09IFwiYmxvc3VtNjJcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuc2VxdWVuY2VDb2xvck1hdHJpeCA9IG9wdC5zZXF1ZW5jZUNvbG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChvcHQuc2VxdWVuY2VDb2xvciA9PT0gXCJjbHVzdGFsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnNlcXVlbmNlQ29sb3IgPSBvcHQuc2VxdWVuY2VDb2xvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLyoqIGNoZWNrIGNvbnNlbnN1c1R5cGUgdmFsdWUgKi9cbiAgICAgICAgaWYgKGNvbnNlbnN1cyAmJiBjb25zZW5zdXMuY29sb3IpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc2Vuc3VzLmNvbG9yICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoY29uc2Vuc3VzLmNvbG9yKTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIChrZXlzWzBdKSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmNvbnNlbnN1c0NvbG9ySWRlbnRpdHkgPSBjb25zZW5zdXMuY29sb3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuY29uc2Vuc3VzQ29sb3JNYXBwaW5nID0gY29uc2Vuc3VzLmNvbG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChjb25zZW5zdXMuY29sb3IgPT09IFwiaWRlbnRpdHlcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuY29uc2Vuc3VzQ29sb3JJZGVudGl0eSA9IGNvbnNlbnN1cy5jb2xvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY29uc2Vuc3VzLmNvbG9yID09PSBcInBoeXNpY2FsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmNvbnNlbnN1c0NvbG9yTWFwcGluZyA9IGNvbnNlbnN1cy5jb2xvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLyoqIGNoZWNrIGNvbnNlbnN1c1RocmVzaG9sZCB2YWx1ZSAqL1xuICAgICAgICBpZiAoY29uc2Vuc3VzICYmIGNvbnNlbnN1cy5kb3RUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc2Vuc3VzLmRvdFRocmVzaG9sZCA9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5kb3RUaHJlc2hvbGQgPSBjb25zZW5zdXMuZG90VGhyZXNob2xkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8qKiBjaGVjayByb3dNYXJnaW5Cb3R0b20gdmFsdWUgKi9cbiAgICAgICAgaWYgKG9wdCAmJiBvcHQubGluZVNlcGFyYXRpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdmFyIHJTaXplID0gb3B0LmxpbmVTZXBhcmF0aW9uO1xuICAgICAgICAgICAgdmFyIHJOdW0gPSArclNpemUuc3Vic3RyKDAsIHJTaXplLmxlbmd0aCAtIDIpO1xuICAgICAgICAgICAgdmFyIHJVbml0ID0gclNpemUuc3Vic3RyKHJTaXplLmxlbmd0aCAtIDIsIDIpO1xuICAgICAgICAgICAgaWYgKGlzTmFOKHJOdW0pIHx8IChyVW5pdCAhPT0gJ3B4JyAmJiByVW5pdCAhPT0gJ3Z3JyAmJiByVW5pdCAhPT0gJ2VtJykpIHtcbiAgICAgICAgICAgICAgICAvLyB3cm9uZyBsaW5lU2VwYXJhdGlvbiBmb3JtYXRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5saW5lU2VwYXJhdGlvbiA9IHJTaXplO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gbGluZVNlcGFyYXRpb24gbm90IHNldFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmxpbmVTZXBhcmF0aW9uID0gJzVweCc7IC8vIGRlZmF1bHQgcmVzZXRcbiAgICAgICAgfVxuICAgICAgICAvKiogY2hlY2sgd3JhcGxpbmUgdmFsdWUgKi9cbiAgICAgICAgaWYgKG9wdCAmJiB0eXBlb2Ygb3B0LndyYXBMaW5lID09ICdib29sZWFuJykge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLndyYXBMaW5lID0gb3B0LndyYXBMaW5lO1xuICAgICAgICB9XG4gICAgICAgIC8qKiBjaGVjayBvbmVMaW5lV2lkdGggKi9cbiAgICAgICAgaWYgKG9wdCAmJiBvcHQudmlld2VyV2lkdGgpIHtcbiAgICAgICAgICAgIHZhciB2aWV3ZXJXaWR0aCA9IG9wdC52aWV3ZXJXaWR0aDtcbiAgICAgICAgICAgIHZhciBvbE51bSA9ICt2aWV3ZXJXaWR0aC5zdWJzdHIoMCwgdmlld2VyV2lkdGgubGVuZ3RoIC0gMik7XG4gICAgICAgICAgICB2YXIgb2xVbml0ID0gdmlld2VyV2lkdGguc3Vic3RyKHZpZXdlcldpZHRoLmxlbmd0aCAtIDIsIDIpO1xuICAgICAgICAgICAgaWYgKGlzTmFOKG9sTnVtKSB8fCAob2xVbml0ICE9PSAncHgnICYmIG9sVW5pdCAhPT0gJ3Z3JyAmJiBvbFVuaXQgIT09ICdlbScpKSB7XG4gICAgICAgICAgICAgICAgLy8gd3Jvbmcgb25lTGluZVdpZHRoIGZvcm1hdFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnZpZXdlcldpZHRoID0gdmlld2VyV2lkdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucztcbiAgICB9O1xuICAgIHJldHVybiBPcHRpb25zTW9kZWw7XG59KCkpO1xuZXhwb3J0IHsgT3B0aW9uc01vZGVsIH07XG4iLCJ2YXIgUGFsZXR0ZXMgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUGFsZXR0ZXMoKSB7XG4gICAgfVxuICAgIC8vIEFBIHByb3BlbnNpdGllc1xuICAgIFBhbGV0dGVzLmNsdXN0YWwgPSB7XG4gICAgICAgIEE6ICcjODBhMGYwJywgSTogJyM4MGEwZjAnLCBMOiAnIzgwYTBmMCcsIE06ICcjODBhMGYwJywgRjogJyM4MGEwZjAnLCBXOiAnIzgwYTBmMCcsIFY6ICcjODBhMGYwJyxcbiAgICAgICAgSzogJyNmMDE1MDUnLCBSOiAnI2YwMTUwNScsIEU6ICcjYzA0OGMwJywgRDogJyNjMDQ4YzAnLCBDOiAnI2YwODA4MCcsIEc6ICcjZjA5MDQ4JyxcbiAgICAgICAgTjogJyMxNWMwMTUnLCBROiAnIzE1YzAxNScsIFM6ICcjMTVjMDE1JywgVDogJyMxNWMwMTUnLCBQOiAnI2MwYzAwMCcsIEg6ICcjMTVhNGE0JywgWTogJyMxNWE0YTQnXG4gICAgfTtcbiAgICBQYWxldHRlcy56YXBwbyA9IHtcbiAgICAgICAgQTogJyNmZmFmYWYnLCBSOiAnIzY0NjRmZicsIE46ICcjMDBmZjAwJywgRDogJyNmZjAwMDAnLCBDOiAnI2ZmZmYwMCcsIFE6ICcjMDBmZjAwJywgRTogJyNmZjAwMDAnLFxuICAgICAgICBHOiAnI2ZmMDBmZicsIEg6ICcjNjQ2NGZmJywgSTogJyNmZmFmYWYnLCBMOiAnI2ZmYWZhZicsIEs6ICcjZmZhZmFmJywgTTogJyNmZmM4MDAnLCBGOiAnI2ZmMDBmZicsXG4gICAgICAgIFA6ICcjMDBmZjAwJywgUzogJyMwMGZmMDAnLCBUOiAnIzE1YzAxNScsIFc6ICcjZmZjODAwJywgVjogJyNmZmM4MDAnLCBZOiAnI2ZmYWZhZidcbiAgICB9O1xuICAgIFBhbGV0dGVzLnRheWxvciA9IHtcbiAgICAgICAgQTogJyNjY2ZmMDAnLCBSOiAnIzAwMDBmZicsIE46ICcjY2MwMGZmJywgRDogJyNmZjAwMDAnLCBDOiAnI2ZmZmYwMCcsIFE6ICcjZmYwMGNjJywgRTogJyNmZjAwNjYnLFxuICAgICAgICBHOiAnI2ZmOTkwMCcsIEg6ICcjMDA2NmZmJywgSTogJyM2NmZmMDAnLCBMOiAnIzMzZmYwMCcsIEs6ICcjNjYwMGZmJywgTTogJyMwMGZmMDAnLCBGOiAnIzAwZmY2NicsXG4gICAgICAgIFA6ICcjZmZjYzAwJywgUzogJyNmZjMzMDAnLCBUOiAnI2ZmNjYwMCcsIFc6ICcjMDBjY2ZmJywgVjogJyMwMGZmY2MnLCBZOiAnIzk5ZmYwMCdcbiAgICB9O1xuICAgIFBhbGV0dGVzLmh5ZHJvcGhvYmljaXR5ID0ge1xuICAgICAgICBBOiAnI2FkMDA1MicsIFI6ICcjMDAwMGZmJywgTjogJyMwYzAwZjMnLCBEOiAnIzBjMDBmMycsIEM6ICcjYzIwMDNkJywgUTogJyMwYzAwZjMnLCBFOiAnIzBjMDBmMycsXG4gICAgICAgIEc6ICcjNmEwMDk1JywgSDogJyMxNTAwZWEnLCBJOiAnI2ZmMDAwMCcsIEw6ICcjZWEwMDE1JywgSzogJyMwMDAwZmYnLCBNOiAnI2IwMDA0ZicsIEY6ICcjY2IwMDM0JyxcbiAgICAgICAgUDogJyM0NjAwYjknLCBTOiAnIzVlMDBhMScsIFQ6ICcjNjEwMDllJywgVzogJyM1YjAwYTQnLCBWOiAnIzRmMDBiMCcsIFk6ICcjZjYwMDA5JyxcbiAgICAgICAgQjogJyMwYzAwZjMnLCBYOiAnIzY4MDA5NycsIFo6ICcjMGMwMGYzJ1xuICAgIH07XG4gICAgUGFsZXR0ZXMuaGVsaXhwcm9wZW5zaXR5ID0ge1xuICAgICAgICBBOiAnI2U3MThlNycsIFI6ICcjNmY5MDZmJywgTjogJyMxYmU0MWInLCBEOiAnIzc3ODg3NycsIEM6ICcjMjNkYzIzJywgUTogJyM5MjZkOTInLCBFOiAnI2ZmMDBmZicsXG4gICAgICAgIEc6ICcjMDBmZjAwJywgSDogJyM3NThhNzUnLCBJOiAnIzhhNzU4YScsIEw6ICcjYWU1MWFlJywgSzogJyNhMDVmYTAnLCBNOiAnI2VmMTBlZicsIEY6ICcjOTg2Nzk4JyxcbiAgICAgICAgUDogJyMwMGZmMDAnLCBTOiAnIzM2YzkzNicsIFQ6ICcjNDdiODQ3JywgVzogJyM4YTc1OGEnLCBWOiAnIzIxZGUyMScsIFk6ICcjODU3YTg1JyxcbiAgICAgICAgQjogJyM0OWI2NDknLCBYOiAnIzc1OGE3NScsIFo6ICcjYzkzNmM5J1xuICAgIH07XG4gICAgUGFsZXR0ZXMuc3RyYW5kcHJvcGVuc2l0eSA9IHtcbiAgICAgICAgQTogJyM1ODU4YTcnLCBSOiAnIzZiNmI5NCcsIE46ICcjNjQ2NDliJywgRDogJyMyMTIxZGUnLCBDOiAnIzlkOWQ2MicsIFE6ICcjOGM4YzczJywgRTogJyMwMDAwZmYnLFxuICAgICAgICBHOiAnIzQ5NDliNicsIEg6ICcjNjA2MDlmJywgSTogJyNlY2VjMTMnLCBMOiAnI2IyYjI0ZCcsIEs6ICcjNDc0N2I4JywgTTogJyM4MjgyN2QnLCBGOiAnI2MyYzIzZCcsXG4gICAgICAgIFA6ICcjMjMyM2RjJywgUzogJyM0OTQ5YjYnLCBUOiAnIzlkOWQ2MicsIFc6ICcjYzBjMDNmJywgVjogJyNkM2QzMmMnLCBZOiAnI2ZmZmYwMCcsXG4gICAgICAgIEI6ICcjNDM0M2JjJywgWDogJyM3OTc5ODYnLCBaOiAnIzQ3NDdiOCdcbiAgICB9O1xuICAgIFBhbGV0dGVzLnR1cm5wcm9wZW5zaXR5ID0ge1xuICAgICAgICBBOiAnIzJjZDNkMycsIFI6ICcjNzA4ZjhmJywgTjogJyNmZjAwMDAnLCBEOiAnI2U4MTcxNycsIEM6ICcjYTg1NzU3JywgUTogJyMzZmMwYzAnLCBFOiAnIzc3ODg4OCcsXG4gICAgICAgIEc6ICcjZmYwMDAwJywgSDogJyM3MDhmOGYnLCBJOiAnIzAwZmZmZicsIEw6ICcjMWNlM2UzJywgSzogJyM3ZTgxODEnLCBNOiAnIzFlZTFlMScsIEY6ICcjMWVlMWUxJyxcbiAgICAgICAgUDogJyNmNjA5MDknLCBTOiAnI2UxMWUxZScsIFQ6ICcjNzM4YzhjJywgVzogJyM3MzhjOGMnLCBWOiAnIzlkNjI2MicsIFk6ICcjMDdmOGY4JyxcbiAgICAgICAgQjogJyNmMzBjMGMnLCBYOiAnIzdjODM4MycsIFo6ICcjNWJhNGE0J1xuICAgIH07XG4gICAgUGFsZXR0ZXMuYnVyaWVkaW5kZXggPSB7XG4gICAgICAgIEE6ICcjMDBhMzVjJywgUjogJyMwMGZjMDMnLCBOOiAnIzAwZWIxNCcsIEQ6ICcjMDBlYjE0JywgQzogJyMwMDAwZmYnLCBROiAnIzAwZjEwZScsIEU6ICcjMDBmMTBlJyxcbiAgICAgICAgRzogJyMwMDlkNjInLCBIOiAnIzAwZDUyYScsIEk6ICcjMDA1NGFiJywgTDogJyMwMDdiODQnLCBLOiAnIzAwZmYwMCcsIE06ICcjMDA5NzY4JywgRjogJyMwMDg3NzgnLFxuICAgICAgICBQOiAnIzAwZTAxZicsIFM6ICcjMDBkNTJhJywgVDogJyMwMGRiMjQnLCBXOiAnIzAwYTg1NycsIFY6ICcjMDBlNjE5JywgWTogJyMwMDVmYTAnLFxuICAgICAgICBCOiAnIzAwZWIxNCcsIFg6ICcjMDBiNjQ5JywgWjogJyMwMGYxMGUnXG4gICAgfTtcbiAgICBQYWxldHRlcy5udWNsZW90aWRlID0ge1xuICAgICAgICBBOiAnIzY0RjczRicsIEM6ICcjRkZCMzQwJywgRzogJyNFQjQxM0MnLCBUOiAnIzNDODhFRScsIFU6ICcjM0M4OEVFJ1xuICAgIH07XG4gICAgUGFsZXR0ZXMucHVyaW5lcHlyaW1pZGluZSA9IHtcbiAgICAgICAgQTogJyNGRjgzRkEnLCBDOiAnIzQwRTBEMCcsIEc6ICcjRkY4M0ZBJywgVDogJyM0MEUwRDAnLCBVOiAnIzQwRTBEMCcsIFI6ICcjRkY4M0ZBJywgWTogJyM0MEUwRDAnXG4gICAgfTtcbiAgICBQYWxldHRlcy5jb25zZW5zdXNMZXZlbHNJZGVudGl0eSA9IHtcbiAgICAgICAgMTAwOiBbJyMwQTBBMEEnLCAnI0ZGRkZGRiddLFxuICAgICAgICA3MDogWycjMzMzMzMzJywgJyNGRkZGRkYnXSxcbiAgICAgICAgNDA6IFsnIzcwNzA3MCcsICcjRkZGRkZGJ10sXG4gICAgICAgIDEwOiBbJyNBM0EzQTMnLCAnI0ZGRkZGRiddLFxuICAgICAgICAwOiBbJyNGRkZGRkYnLCAnI0ZGRkZGRiddXG4gICAgfTtcbiAgICAvLyBjb2xvdXIgc2NoZW1lIGluIExlc2ssIEludHJvZHVjdGlvbiB0byBCaW9pbmZvcm1hdGljc1xuICAgIFBhbGV0dGVzLmNvbnNlbnN1c0FhTGVzayA9IHtcbiAgICAgICAgQTogWyduJywgJyNmMDkwNDgnLCAnI0ZGRkZGRiddLFxuICAgICAgICBHOiBbJ24nLCAnI2YwOTA0OCcsICcjRkZGRkZGJ10sXG4gICAgICAgIFM6IFsnbicsICcjZjA5MDQ4JywgJyNGRkZGRkYnXSxcbiAgICAgICAgVDogWyduJywgJyNmMDkwNDgnLCAnI0ZGRkZGRiddLFxuICAgICAgICBDOiBbJ2gnLCAnIzU1OEI2RScsICcjRkZGRkZGJ10sXG4gICAgICAgIFY6IFsnaCcsICcjNTU4QjZFJywgJyNGRkZGRkYnXSxcbiAgICAgICAgSTogWydoJywgJyM1NThCNkUnLCAnI0ZGRkZGRiddLFxuICAgICAgICBMOiBbJ2gnLCAnIzU1OEI2RScsICcjRkZGRkZGJ10sXG4gICAgICAgIFA6IFsnaCcsICcjNTU4QjZFJywgJyNGRkZGRkYnXSxcbiAgICAgICAgRjogWydoJywgJyM1NThCNkUnLCAnI0ZGRkZGRiddLFxuICAgICAgICBZOiBbJ2gnLCAnIzU1OEI2RScsICcjRkZGRkZGJ10sXG4gICAgICAgIE06IFsnaCcsICcjNTU4QjZFJywgJyNGRkZGRkYnXSxcbiAgICAgICAgVzogWydoJywgJyM1NThCNkUnLCAnI0ZGRkZGRiddLFxuICAgICAgICBOOiBbJ3AnLCAnI0Q0MzU4RCcsICcjRkZGRkZGJ10sXG4gICAgICAgIFE6IFsncCcsICcjRDQzNThEJywgJyNGRkZGRkYnXSxcbiAgICAgICAgSDogWydwJywgJyNENDM1OEQnLCAnI0ZGRkZGRiddLFxuICAgICAgICBEOiBbJ34nLCAnI0ExMDcwMicsICcjRkZGRkZGJ10sXG4gICAgICAgIEU6IFsnficsICcjQTEwNzAyJywgJyNGRkZGRkYnXSxcbiAgICAgICAgSzogWycrJywgJyMzNjI2QTcnLCAnI0ZGRkZGRiddLFxuICAgICAgICBSOiBbJysnLCAnIzM2MjZBNycsICcjRkZGRkZGJ10gLy8gKzogcG9zaXRpdmVseSBjaGFyZ2VkXG4gICAgfTtcbiAgICBQYWxldHRlcy5zdWJzdGl0dXRpb25NYXRyaXhCbG9zdW0gPSB7IFdGOiBbJyNDRkRCRjInLCAnIzAwMDAwMCddLCBRUTogWycjQTFCOEUzJywgJyMwMDAwMDAnXSxcbiAgICAgICAgSEg6IFsnIzcyOTRENScsICcjMDAwMDAwJ10sIFlZOiBbJyM4MUEwRDknLCAnIzAwMDAwMCddLCBaWjogWycjQTFCOEUzJywgJyMwMDAwMDAnXSxcbiAgICAgICAgQ0M6IFsnIzYyODhEMCcsICcjMDAwMDAwJ10sIFBQOiBbJyM4MUEwRDknLCAnIzAwMDAwMCddLCBWSTogWycjQjBDNEU4JywgJyMwMDAwMDAnXSxcbiAgICAgICAgVk06IFsnI0NGREJGMicsICcjMDAwMDAwJ10sIEtLOiBbJyNBMUI4RTMnLCAnIzAwMDAwMCddLCBaSzogWycjQ0ZEQkYyJywgJyMwMDAwMDAnXSxcbiAgICAgICAgRE46IFsnI0NGREJGMicsICcjMDAwMDAwJ10sIFNTOiBbJyNBMUI4RTMnLCAnIzAwMDAwMCddLCBRUjogWycjQ0ZEQkYyJywgJyMwMDAwMDAnXSxcbiAgICAgICAgTk46IFsnIzkxQUNERScsICcjMDAwMDAwJ10sIFlGOiBbJyNCMEM0RTgnLCAnIzAwMDAwMCddLCBWTDogWycjQ0ZEQkYyJywgJyMwMDAwMDAnXSxcbiAgICAgICAgS1I6IFsnI0MwQ0ZFRCcsICcjMDAwMDAwJ10sIEVEOiBbJyNDMENGRUQnLCAnIzAwMDAwMCddLCBWVjogWycjQTFCOEUzJywgJyMwMDAwMDAnXSxcbiAgICAgICAgTUk6IFsnI0NGREJGMicsICcjMDAwMDAwJ10sIE1NOiBbJyNBMUI4RTMnLCAnIzAwMDAwMCddLCBaRDogWycjQ0ZEQkYyJywgJyMwMDAwMDAnXSxcbiAgICAgICAgRkY6IFsnIzkxQUNERScsICcjMDAwMDAwJ10sIEJEOiBbJyNBMUI4RTMnLCAnIzAwMDAwMCddLCBITjogWycjQ0ZEQkYyJywgJyMwMDAwMDAnXSxcbiAgICAgICAgVFQ6IFsnI0ExQjhFMycsICcjMDAwMDAwJ10sIFNOOiBbJyNDRkRCRjInLCAnIzAwMDAwMCddLCBMTDogWycjQTFCOEUzJywgJyMwMDAwMDAnXSxcbiAgICAgICAgRVE6IFsnI0MwQ0ZFRCcsICcjMDAwMDAwJ10sIFlXOiBbJyNDMENGRUQnLCAnIzAwMDAwMCddLCBFRTogWycjQTFCOEUzJywgJyMwMDAwMDAnXSxcbiAgICAgICAgS1E6IFsnI0NGREJGMicsICcjMDAwMDAwJ10sIFdXOiBbJyMzODY3QkMnLCAnIzAwMDAwMCddLCBNTDogWycjQzBDRkVEJywgJyMwMDAwMDAnXSxcbiAgICAgICAgS0U6IFsnI0NGREJGMicsICcjMDAwMDAwJ10sIFpFOiBbJyNBMUI4RTMnLCAnIzAwMDAwMCddLCBaUTogWycjQjBDNEU4JywgJyMwMDAwMDAnXSxcbiAgICAgICAgQkU6IFsnI0NGREJGMicsICcjMDAwMDAwJ10sIEREOiBbJyM5MUFDREUnLCAnIzAwMDAwMCddLCBTQTogWycjQ0ZEQkYyJywgJyMwMDAwMDAnXSxcbiAgICAgICAgWUg6IFsnI0MwQ0ZFRCcsICcjMDAwMDAwJ10sIEdHOiBbJyM5MUFDREUnLCAnIzAwMDAwMCddLCBBQTogWycjQTFCOEUzJywgJyMwMDAwMDAnXSxcbiAgICAgICAgSUk6IFsnI0ExQjhFMycsICcjMDAwMDAwJ10sIFRTOiBbJyNDRkRCRjInLCAnIzAwMDAwMCddLCBSUjogWycjQTFCOEUzJywgJyMwMDAwMDAnXSxcbiAgICAgICAgTEk6IFsnI0MwQ0ZFRCcsICcjMDAwMDAwJ10sIFpCOiBbJyNDRkRCRjInLCAnIzAwMDAwMCddLCBCTjogWycjQjBDNEU4JywgJyMwMDAwMDAnXSxcbiAgICAgICAgQkI6IFsnI0ExQjhFMycsICcjMDAwMDAwJ11cbiAgICB9O1xuICAgIHJldHVybiBQYWxldHRlcztcbn0oKSk7XG5leHBvcnQgeyBQYWxldHRlcyB9O1xuIiwidmFyIFBhdHRlcm5zTW9kZWwgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUGF0dGVybnNNb2RlbCgpIHtcbiAgICB9XG4gICAgLy8gZmluZCBpbmRleCBvZiBtYXRjaGVkIHJlZ2V4IHBvc2l0aW9ucyBhbmQgY3JlYXRlIGFycmF5IG9mIHJlZ2lvbnMgd2l0aCBjb2xvclxuICAgIFBhdHRlcm5zTW9kZWwucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbiAocGF0dGVybnMsIHNlcXVlbmNlcykge1xuICAgICAgICBpZiAoIXBhdHRlcm5zKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlZ2lvbnMgPSBbXTsgLy8gT3V0UGF0dGVybnNcbiAgICAgICAgdmFyIF9sb29wXzEgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbmRpdGlvbmFsLWFzc2lnbm1lbnRcbiAgICAgICAgICAgIHZhciBwYXR0ZXJuID0gZWxlbWVudC5wYXR0ZXJuO1xuICAgICAgICAgICAgdmFyIHN0ciA9IHZvaWQgMDtcbiAgICAgICAgICAgIGlmIChzZXF1ZW5jZXMuZmluZChmdW5jdGlvbiAoeCkgeyByZXR1cm4geC5pZCA9PT0gZWxlbWVudC5zZXF1ZW5jZUlkOyB9KSkge1xuICAgICAgICAgICAgICAgIHN0ciA9IHNlcXVlbmNlcy5maW5kKGZ1bmN0aW9uICh4KSB7IHJldHVybiB4LmlkID09PSBlbGVtZW50LnNlcXVlbmNlSWQ7IH0pLnNlcXVlbmNlO1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnN0YXJ0ICYmIGVsZW1lbnQuZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0ciA9IHN0ci5zdWJzdHIoZWxlbWVudC5zdGFydCAtIDEsIGVsZW1lbnQuZW5kIC0gKGVsZW1lbnQuc3RhcnQgLSAxKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXNfMS5yZWdleE1hdGNoKHN0ciwgcGF0dGVybiwgcmVnaW9ucywgZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfYSA9IDAsIHNlcXVlbmNlc18xID0gc2VxdWVuY2VzOyBfYSA8IHNlcXVlbmNlc18xLmxlbmd0aDsgX2ErKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VxID0gc2VxdWVuY2VzXzFbX2FdO1xuICAgICAgICAgICAgICAgICAgICAvLyByZWdleFxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5zdGFydCAmJiBlbGVtZW50LmVuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyID0gc2VxLnNlcXVlbmNlLnN1YnN0cihlbGVtZW50LnN0YXJ0IC0gMSwgZWxlbWVudC5lbmQgLSAoZWxlbWVudC5zdGFydCAtIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzXzEucmVnZXhNYXRjaChzdHIsIHBhdHRlcm4sIHJlZ2lvbnMsIGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHRoaXNfMSA9IHRoaXM7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBwYXR0ZXJuc18xID0gcGF0dGVybnM7IF9pIDwgcGF0dGVybnNfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gcGF0dGVybnNfMVtfaV07XG4gICAgICAgICAgICBfbG9vcF8xKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZWdpb25zO1xuICAgIH07XG4gICAgUGF0dGVybnNNb2RlbC5wcm90b3R5cGUucmVnZXhNYXRjaCA9IGZ1bmN0aW9uIChzdHIsIHBhdHRlcm4sIHJlZ2lvbnMsIGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIHJlID0gbmV3IFJlZ0V4cChwYXR0ZXJuLCBcImdcIik7XG4gICAgICAgIHZhciBtYXRjaDtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbmRpdGlvbmFsLWFzc2lnbm1lbnRcbiAgICAgICAgd2hpbGUgKChtYXRjaCA9IHJlLmV4ZWMoc3RyKSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmVnaW9ucy5wdXNoKHsgc3RhcnQ6ICttYXRjaC5pbmRleCArIDEsIGVuZDogK21hdGNoLmluZGV4ICsgK21hdGNoWzBdLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGVsZW1lbnQuYmFja2dyb3VuZENvbG9yLCBjb2xvcjogZWxlbWVudC5jb2xvciwgYmFja2dyb3VuZEltYWdlOiBlbGVtZW50LmJhY2tncm91bmRJbWFnZSxcbiAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogZWxlbWVudC5ib3JkZXJDb2xvciwgYm9yZGVyU3R5bGU6IGVsZW1lbnQuYm9yZGVyU3R5bGUsIHNlcXVlbmNlSWQ6IGVsZW1lbnQuc2VxdWVuY2VJZCB9KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIFBhdHRlcm5zTW9kZWw7XG59KCkpO1xuZXhwb3J0IHsgUGF0dGVybnNNb2RlbCB9O1xuIiwiaW1wb3J0IHsgT3B0aW9uc01vZGVsIH0gZnJvbSAnLi9vcHRpb25zLm1vZGVsJztcbmltcG9ydCB7IFJvd3NNb2RlbCB9IGZyb20gJy4vcm93cy5tb2RlbCc7XG5pbXBvcnQgeyBDb2xvcnNNb2RlbCB9IGZyb20gJy4vY29sb3JzLm1vZGVsJztcbmltcG9ydCB7IFNlbGVjdGlvbk1vZGVsIH0gZnJvbSAnLi9zZWxlY3Rpb24ubW9kZWwnO1xuaW1wb3J0IHsgSWNvbnNNb2RlbCB9IGZyb20gJy4vaWNvbnMubW9kZWwnO1xuaW1wb3J0IHsgU2VxdWVuY2VJbmZvTW9kZWwgfSBmcm9tICcuL3NlcXVlbmNlSW5mb01vZGVsJztcbmltcG9ydCB7IEV2ZW50c01vZGVsIH0gZnJvbSAnLi9ldmVudHMubW9kZWwnO1xuaW1wb3J0IHsgUGF0dGVybnNNb2RlbCB9IGZyb20gJy4vcGF0dGVybnMubW9kZWwnO1xuaW1wb3J0IHsgQ29uc2Vuc3VzTW9kZWwgfSBmcm9tICcuL2NvbnNlbnN1cy5tb2RlbCc7XG52YXIgUHJvU2VxVmlld2VyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFByb1NlcVZpZXdlcihkaXZJZCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmRpdklkID0gZGl2SWQ7XG4gICAgICAgIHRoaXMuaW5pdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnBhcmFtcyA9IG5ldyBPcHRpb25zTW9kZWwoKTtcbiAgICAgICAgdGhpcy5yb3dzID0gbmV3IFJvd3NNb2RlbCgpO1xuICAgICAgICB0aGlzLmNvbnNlbnN1cyA9IG5ldyBDb25zZW5zdXNNb2RlbCgpO1xuICAgICAgICB0aGlzLnJlZ2lvbnMgPSBuZXcgQ29sb3JzTW9kZWwoKTtcbiAgICAgICAgdGhpcy5wYXR0ZXJucyA9IG5ldyBQYXR0ZXJuc01vZGVsKCk7XG4gICAgICAgIHRoaXMuaWNvbnMgPSBuZXcgSWNvbnNNb2RlbCgpO1xuICAgICAgICB0aGlzLmxhYmVscyA9IG5ldyBTZXF1ZW5jZUluZm9Nb2RlbCgpO1xuICAgICAgICB0aGlzLnNlbGVjdGlvbiA9IG5ldyBTZWxlY3Rpb25Nb2RlbCgpO1xuICAgICAgICB0aGlzLmV2ZW50cyA9IG5ldyBFdmVudHNNb2RlbCgpO1xuICAgICAgICB3aW5kb3cub25yZXNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5jYWxjdWxhdGVJZHhzKGZhbHNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgd2luZG93Lm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5jYWxjdWxhdGVJZHhzKHRydWUpO1xuICAgICAgICB9OyAvLyBoYWQgdG8gYWRkIHRoaXMgdG8gY292ZXIgbW9iaWRiIHRvZ2dsZSBldmVudFxuICAgIH1cbiAgICBQcm9TZXFWaWV3ZXIucHJvdG90eXBlLmNhbGN1bGF0ZUlkeHMgPSBmdW5jdGlvbiAoZmxhZykge1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gUHJvU2VxVmlld2VyLnNxdkxpc3Q7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgaWQgPSBfYVtfaV07XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3F2Qm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgICAgICAgICAgICB2YXIgY2h1bmtzID0gc3F2Qm9keS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjbmsnKTtcbiAgICAgICAgICAgICAgICB2YXIgb2xkVG9wID0gMDtcbiAgICAgICAgICAgICAgICB2YXIgbmV3VG9wID0gMTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNodW5rcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAvLyBlcmFzZSBvbGQgaW5kZXhlcyBiZWZvcmUgcmVjYWxjdWxhdGluZyB0aGVtXG4gICAgICAgICAgICAgICAgICAgIGNodW5rc1tpXS5maXJzdEVsZW1lbnRDaGlsZC5jbGFzc05hbWUgPSAnaWR4IGhpZGRlbic7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmbGFnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhdm9pZCBjYWxjdWxhdGluZyBpZiBpZHggYWxyZWFkeSBzZXRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaHVua3NbaV0uZmlyc3RFbGVtZW50Q2hpbGQuY2xhc3NOYW1lID09PSAnaWR4Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBuZXdUb3AgPSBjaHVua3NbaV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgd2luZG93LnNjcm9sbFk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdUb3AgPiBvbGRUb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNodW5rc1tpXS5maXJzdEVsZW1lbnRDaGlsZC5jbGFzc05hbWUgPSAnaWR4JztcbiAgICAgICAgICAgICAgICAgICAgICAgIG9sZFRvcCA9IG5ld1RvcDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgUHJvU2VxVmlld2VyLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24gKGlucHV0cykge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICB2YXIgc3F2Qm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZGl2SWQpO1xuICAgICAgICBpZiAoc3F2Qm9keSkge1xuICAgICAgICAgICAgc3F2Qm9keS5pbm5lckhUTUwgPSBcIjxkaXYgY2xhc3M9XFxcInJvb3RcXFwiPiA8ZGl2IGNsYXNzPVxcXCJsb2FkaW5nXFxcIj5pbnB1dCBlcnJvcjwvZGl2PiA8L2Rpdj5cIjtcbiAgICAgICAgfVxuICAgICAgICBQcm9TZXFWaWV3ZXIuc3F2TGlzdC5wdXNoKHRoaXMuZGl2SWQpO1xuICAgICAgICB2YXIgbGFiZWxzO1xuICAgICAgICB2YXIgbGFiZWxzRmxhZztcbiAgICAgICAgdmFyIHN0YXJ0SW5kZXhlcztcbiAgICAgICAgdmFyIHRvb2x0aXBzO1xuICAgICAgICB2YXIgZGF0YTtcbiAgICAgICAgLyoqIGNoZWNrIGFuZCBwcm9jZXNzIHBhcmFtZXRlcnMgaW5wdXQgKi9cbiAgICAgICAgaW5wdXRzLm9wdGlvbnMgPSB0aGlzLnBhcmFtcy5wcm9jZXNzKGlucHV0cy5vcHRpb25zLCBpbnB1dHMuY29uc2Vuc3VzKTtcbiAgICAgICAgLyoqIGNoZWNrIGFuZCBjb25zZW5zdXMgaW5wdXQgIGFuZCBnbG9iYWwgY29sb3JTY2hlbWUgKi9cbiAgICAgICAgaWYgKGlucHV0cy5vcHRpb25zKSB7XG4gICAgICAgICAgICBfYSA9IHRoaXMuY29uc2Vuc3VzLnByb2Nlc3MoaW5wdXRzLnNlcXVlbmNlcywgaW5wdXRzLnJlZ2lvbnMsIGlucHV0cy5vcHRpb25zKSwgaW5wdXRzLnNlcXVlbmNlcyA9IF9hWzBdLCBpbnB1dHMucmVnaW9ucyA9IF9hWzFdO1xuICAgICAgICB9XG4gICAgICAgIC8qKiBjaGVjayBhbmQgcHJvY2VzcyBwYXR0ZXJucyBpbnB1dCAqL1xuICAgICAgICBpbnB1dHMucGF0dGVybnMgPSB0aGlzLnBhdHRlcm5zLnByb2Nlc3MoaW5wdXRzLnBhdHRlcm5zLCBpbnB1dHMuc2VxdWVuY2VzKTtcbiAgICAgICAgLyoqIGNoZWNrIGFuZCBwcm9jZXNzIGNvbG9ycyBpbnB1dCAqL1xuICAgICAgICBpbnB1dHMucmVnaW9ucyA9IHRoaXMucmVnaW9ucy5wcm9jZXNzKGlucHV0cyk7XG4gICAgICAgIC8qKiBjaGVjayBhbmQgcHJvY2VzcyBpY29ucyBpbnB1dCAqL1xuICAgICAgICB2YXIgaWNvbnMgPSB0aGlzLmljb25zLnByb2Nlc3MoaW5wdXRzLnJlZ2lvbnMsIGlucHV0cy5zZXF1ZW5jZXMsIGlucHV0cy5pY29ucyk7XG4gICAgICAgIC8qKiBjaGVjayBhbmQgcHJvY2VzcyBzZXF1ZW5jZXMgaW5wdXQgKi9cbiAgICAgICAgZGF0YSA9IHRoaXMucm93cy5wcm9jZXNzKGlucHV0cy5zZXF1ZW5jZXMsIGljb25zLCBpbnB1dHMucmVnaW9ucywgaW5wdXRzLm9wdGlvbnMpO1xuICAgICAgICAvKiogY2hlY2sgYW5kIHByb2Nlc3MgbGFiZWxzIGlucHV0ICovXG4gICAgICAgIF9iID0gdGhpcy5sYWJlbHMucHJvY2VzcyhpbnB1dHMucmVnaW9ucywgaW5wdXRzLnNlcXVlbmNlcyksIGxhYmVscyA9IF9iWzBdLCBzdGFydEluZGV4ZXMgPSBfYlsxXSwgdG9vbHRpcHMgPSBfYlsyXSwgbGFiZWxzRmxhZyA9IF9iWzNdO1xuICAgICAgICAvKiogY3JlYXRlL3VwZGF0ZSBzcXYtYm9keSBodG1sICovXG4gICAgICAgIHRoaXMuY3JlYXRlR1VJKGRhdGEsIGxhYmVscywgc3RhcnRJbmRleGVzLCB0b29sdGlwcywgaW5wdXRzLm9wdGlvbnMsIGxhYmVsc0ZsYWcpO1xuICAgICAgICAvKiogbGlzdGVuIGNvcHkgcGFzdGUgZXZlbnRzICovXG4gICAgICAgIHRoaXMuc2VsZWN0aW9uLnByb2Nlc3MoKTtcbiAgICAgICAgLyoqIGxpc3RlbiBzZWxlY3Rpb24gZXZlbnRzICovXG4gICAgICAgIHRoaXMuZXZlbnRzLm9uUmVnaW9uU2VsZWN0ZWQoKTtcbiAgICB9O1xuICAgIFByb1NlcVZpZXdlci5wcm90b3R5cGUuZ2VuZXJhdGVMYWJlbHMgPSBmdW5jdGlvbiAoaWR4LCBsYWJlbHMsIHN0YXJ0SW5kZXhlcywgaW5kZXhlc0xvY2F0aW9uLCBjaHVua1NpemUsIGZvbnRTaXplLCB0b29sdGlwcywgZGF0YSwgbGluZVNlcGFyYXRpb24pIHtcbiAgICAgICAgdmFyIGxhYmVsc2h0bWwgPSAnJztcbiAgICAgICAgdmFyIGxhYmVsc0NvbnRhaW5lciA9ICcnO1xuICAgICAgICB2YXIgbm9HYXBzTGFiZWxzID0gW107XG4gICAgICAgIGlmIChsYWJlbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKGluZGV4ZXNMb2NhdGlvbiAhPSAnbGF0ZXJhbCcpIHtcbiAgICAgICAgICAgICAgICBsYWJlbHNodG1sICs9IFwiPHNwYW4gY2xhc3M9XFxcImxibC1oaWRkZW5cXFwiIHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOlwiLmNvbmNhdChsaW5lU2VwYXJhdGlvbiwgXCI7XFxcIj48L3NwYW4+XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGZsYWcgPSB2b2lkIDA7XG4gICAgICAgICAgICB2YXIgY291bnQgPSAtMTtcbiAgICAgICAgICAgIHZhciBzZXFOID0gLTE7XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIGRhdGFfMSA9IGRhdGE7IF9pIDwgZGF0YV8xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIHZhciBzZXFOdW0gPSBkYXRhXzFbX2ldO1xuICAgICAgICAgICAgICAgIGlmIChub0dhcHNMYWJlbHMubGVuZ3RoIDwgZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9HYXBzTGFiZWxzLnB1c2goMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlcU4gKz0gMTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciByZXMgaW4gc2VxTnVtKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXFOdW1bcmVzXS5jaGFyICYmIHNlcU51bVtyZXNdLmNoYXIuaW5jbHVkZXMoJ3N2ZycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmbGFnID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChmbGFnKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vR2Fwc0xhYmVsc1tzZXFOXSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaWR4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsaW5lIHdpdGggb25seSBpY29ucywgbm8gbmVlZCBmb3IgaW5kZXhcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsc2h0bWwgKz0gXCI8c3BhbiBjbGFzcz1cXFwibGJsLWhpZGRlblxcXCIgc3R5bGU9XFxcIm1hcmdpbi1ib3R0b206XCIuY29uY2F0KGxpbmVTZXBhcmF0aW9uLCBcIlxcXCI+PHNwYW4gY2xhc3M9XFxcImxibFxcXCI+IFwiKS5jb25jYXQobm9HYXBzTGFiZWxzW3NlcU5dLCBcIjwvc3Bhbj48L3NwYW4+XCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxzaHRtbCArPSBcIjxzcGFuIGNsYXNzPVxcXCJsYmwtaGlkZGVuXFxcIiBzdHlsZT1cXFwibWFyZ2luLWJvdHRvbTpcIi5jb25jYXQobGluZVNlcGFyYXRpb24sIFwiXFxcIj48c3BhbiBjbGFzcz1cXFwibGJsXFxcIj48L3NwYW4+PC9zcGFuPlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY291bnQgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkeCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjaHVua1NpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsYXRlcmFsIGluZGV4IHJlZ3VsYXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbHNodG1sICs9IFwiPHNwYW4gY2xhc3M9XFxcImxibC1oaWRkZW5cXFwiIHN0eWxlPVxcXCJ3aWR0aDogXCIuY29uY2F0KGZvbnRTaXplLCBcIjttYXJnaW4tYm90dG9tOlwiKS5jb25jYXQobGluZVNlcGFyYXRpb24sIFwiXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcImxibFxcXCIgPlwiKS5jb25jYXQoKHN0YXJ0SW5kZXhlc1tjb3VudF0gLSAxKSArIGlkeCwgXCI8L3NwYW4+PC9zcGFuPlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBub0dhcHMgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHJlcyBpbiBzZXFOdW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCtyZXMgPD0gKGlkeCkgJiYgc2VxTnVtW3Jlc10uY2hhciAhPT0gJy0nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub0dhcHMgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsYXRlcmFsIGluZGV4IGdhcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vR2Fwc0xhYmVsc1tzZXFOXSA9IG5vR2FwcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbHNodG1sICs9IFwiPHNwYW4gY2xhc3M9XFxcImxibC1oaWRkZW5cXFwiIHN0eWxlPVxcXCJ3aWR0aDogIFwiLmNvbmNhdChmb250U2l6ZSwgXCI7bWFyZ2luLWJvdHRvbTpcIikuY29uY2F0KGxpbmVTZXBhcmF0aW9uLCBcIlxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJsYmxcXFwiID5cIikuY29uY2F0KChzdGFydEluZGV4ZXNbY291bnRdIC0gMSkgKyBub0dhcHNMYWJlbHNbc2VxTl0sIFwiPC9zcGFuPjwvc3Bhbj5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbHNodG1sICs9IFwiPHNwYW4gY2xhc3M9XFxcImxibC1oaWRkZW5cXFwiIHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOlwiLmNvbmNhdChsaW5lU2VwYXJhdGlvbiwgXCJcXFwiPjxzcGFuIGNsYXNzPVxcXCJsYmxcXFwiPlwiKS5jb25jYXQobGFiZWxzW2NvdW50XSkuY29uY2F0KHRvb2x0aXBzW2NvdW50XSwgXCI8L3NwYW4+PC9zcGFuPlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmbGFnID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5kZXhlc0xvY2F0aW9uID09ICdsYXRlcmFsJyB8fCAnYm90aCcpIHtcbiAgICAgICAgICAgICAgICBsYWJlbHNDb250YWluZXIgPSBcIjxzcGFuIGNsYXNzPVxcXCJsYmxDb250YWluZXJcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OiBpbmxpbmUtYmxvY2tcXFwiPlwiLmNvbmNhdChsYWJlbHNodG1sLCBcIjwvc3Bhbj5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBhZGQgbWFyZ2luIGluIGNhc2Ugd2Ugb25seSBoYXZlIGxhYmVscyBhbmQgbm8gaW5kZXhlc1xuICAgICAgICAgICAgICAgIGxhYmVsc0NvbnRhaW5lciA9IFwiPHNwYW4gY2xhc3M9XFxcImxibENvbnRhaW5lclxcXCIgc3R5bGU9XFxcIm1hcmdpbi1yaWdodDoxMHB4O2Rpc3BsYXk6IGlubGluZS1ibG9ja1xcXCI+XCIuY29uY2F0KGxhYmVsc2h0bWwsIFwiPC9zcGFuPlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGFiZWxzQ29udGFpbmVyO1xuICAgIH07XG4gICAgUHJvU2VxVmlld2VyLnByb3RvdHlwZS5hZGRUb3BJbmRleGVzID0gZnVuY3Rpb24gKGNodW5rU2l6ZSwgeCwgbWF4VG9wLCByb3dNYXJnaW5Cb3R0b20pIHtcbiAgICAgICAgdmFyIGNlbGxzID0gJyc7XG4gICAgICAgIC8vIGFkZGluZyB0b3AgaW5kZXhlc1xuICAgICAgICB2YXIgY2h1bmtUb3BJbmRleDtcbiAgICAgICAgaWYgKHggJSBjaHVua1NpemUgPT09IDAgJiYgeCA8PSBtYXhUb3ApIHtcbiAgICAgICAgICAgIGNodW5rVG9wSW5kZXggPSBcIjxzcGFuIGNsYXNzPVxcXCJjZWxsXFxcIiBzdHlsZT1cXFwiLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtkaXJlY3Rpb246IHJ0bDtkaXNwbGF5OmJsb2NrO3dpZHRoOjAuNmVtO21hcmdpbi1ib3R0b206XCIuY29uY2F0KHJvd01hcmdpbkJvdHRvbSwgXCJcXFwiPlwiKS5jb25jYXQoeCwgXCI8L3NwYW4+XCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2h1bmtUb3BJbmRleCA9IFwiPHNwYW4gY2xhc3M9XFxcImNlbGxcXFwiIHN0eWxlPVxcXCItd2Via2l0LXVzZXItc2VsZWN0OiBub25lO2Rpc3BsYXk6YmxvY2s7dmlzaWJpbGl0eTogaGlkZGVuO21hcmdpbi1ib3R0b206XCIuY29uY2F0KHJvd01hcmdpbkJvdHRvbSwgXCJcXFwiPjA8L3NwYW4+XCIpO1xuICAgICAgICB9XG4gICAgICAgIGNlbGxzICs9IGNodW5rVG9wSW5kZXg7XG4gICAgICAgIHJldHVybiBjZWxscztcbiAgICB9O1xuICAgIFByb1NlcVZpZXdlci5wcm90b3R5cGUuY3JlYXRlR1VJID0gZnVuY3Rpb24gKGRhdGEsIGxhYmVscywgc3RhcnRJbmRleGVzLCB0b29sdGlwcywgb3B0aW9ucywgbGFiZWxzRmxhZykge1xuICAgICAgICB2YXIgc3F2Qm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZGl2SWQpO1xuICAgICAgICAvLyBjb252ZXJ0IHRvIG5vZGVzIHRvIGltcHJvdmUgcmVuZGVyaW5nIChpZGVhIHRvIHRyeSk6XG4gICAgICAgIC8vIENyZWF0ZSBuZXcgZWxlbWVudFxuICAgICAgICAvLyBjb25zdCByb290ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIC8vIC8vIEFkZCBjbGFzcyB0byBlbGVtZW50XG4gICAgICAgIC8vIHJvb3QuY2xhc3NOYW1lID0gJ215LW5ldy1lbGVtZW50JztcbiAgICAgICAgLy8gLy8gQWRkIGNvbG9yXG4gICAgICAgIC8vIHJvb3Quc3R5bGUuY29sb3IgPSAncmVkJztcbiAgICAgICAgLy8gLy8gRmlsbCBlbGVtZW50IHdpdGggaHRtbFxuICAgICAgICAvLyByb290LmlubmVySFRNTCA9IGBgO1xuICAgICAgICAvLyAvLyBBZGQgZWxlbWVudCBub2RlIHRvIERPTSBncmFwaFxuICAgICAgICAvLyBzcXZCb2R5LmFwcGVuZENoaWxkKHJvb3QpO1xuICAgICAgICAvLyAvLyBFeGl0XG4gICAgICAgIC8vIHJldHVybjtcbiAgICAgICAgaWYgKCFzcXZCb2R5KSB7XG4gICAgICAgICAgICAvLyBDYW5ub3QgZmluZCBzcXYtYm9keSBlbGVtZW50XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNodW5rU2l6ZSA9IG9wdGlvbnMuY2h1bmtTaXplO1xuICAgICAgICB2YXIgZm9udFNpemUgPSBvcHRpb25zLmZvbnRTaXplO1xuICAgICAgICB2YXIgY2h1bmtTZXBhcmF0aW9uID0gb3B0aW9ucy5jaHVua1NlcGFyYXRpb247XG4gICAgICAgIHZhciBpbmRleGVzTG9jYXRpb24gPSBvcHRpb25zLmluZGV4ZXNMb2NhdGlvbjtcbiAgICAgICAgdmFyIHdyYXBMaW5lID0gb3B0aW9ucy53cmFwTGluZTtcbiAgICAgICAgdmFyIHZpZXdlcldpZHRoID0gb3B0aW9ucy52aWV3ZXJXaWR0aDtcbiAgICAgICAgdmFyIGxpbmVTZXBhcmF0aW9uID0gb3B0aW9ucy5saW5lU2VwYXJhdGlvbiArICc7JztcbiAgICAgICAgdmFyIGZOdW0gPSArZm9udFNpemUuc3Vic3RyKDAsIGZvbnRTaXplLmxlbmd0aCAtIDIpO1xuICAgICAgICB2YXIgZlVuaXQgPSBmb250U2l6ZS5zdWJzdHIoZm9udFNpemUubGVuZ3RoIC0gMiwgMik7XG4gICAgICAgIC8vIG1heElkeCA9IGxlbmd0aCBvZiB0aGUgbG9uZ2VzdCBzZXF1ZW5jZVxuICAgICAgICB2YXIgbWF4SWR4ID0gMDtcbiAgICAgICAgdmFyIG1heFRvcCA9IDA7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgZGF0YV8yID0gZGF0YTsgX2kgPCBkYXRhXzIubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgcm93ID0gZGF0YV8yW19pXTtcbiAgICAgICAgICAgIGlmIChtYXhJZHggPCBPYmplY3Qua2V5cyhyb3cpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIG1heElkeCA9IE9iamVjdC5rZXlzKHJvdykubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1heFRvcCA8IE9iamVjdC5rZXlzKHJvdykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgbWF4VG9wID0gT2JqZWN0LmtleXMocm93KS5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxlbmdodEluZGV4ID0gbWF4SWR4LnRvU3RyaW5nKCkubGVuZ3RoO1xuICAgICAgICB2YXIgaW5kZXhXaWR0aCA9IChmTnVtICogbGVuZ2h0SW5kZXgpLnRvU3RyaW5nKCkgKyBmVW5pdDtcbiAgICAgICAgLy8gY29uc2lkZXIgdGhlIGxhc3QgY2h1bmsgZXZlbiBpZiBpcyBub3QgbG9uZyBlbm91Z2hcbiAgICAgICAgaWYgKGNodW5rU2l6ZSA+IDApIHtcbiAgICAgICAgICAgIG1heElkeCArPSAoY2h1bmtTaXplIC0gKG1heElkeCAlIGNodW5rU2l6ZSkpICUgY2h1bmtTaXplO1xuICAgICAgICB9XG4gICAgICAgIC8vIGdlbmVyYXRlIGxhYmVsc1xuICAgICAgICB2YXIgbGFiZWxzQ29udGFpbmVyID0gdGhpcy5nZW5lcmF0ZUxhYmVscyhmYWxzZSwgbGFiZWxzLCBzdGFydEluZGV4ZXMsIGluZGV4ZXNMb2NhdGlvbiwgZmFsc2UsIGluZGV4V2lkdGgsIHRvb2x0aXBzLCBkYXRhLCBsaW5lU2VwYXJhdGlvbik7XG4gICAgICAgIHZhciBpbmRleCA9ICcnO1xuICAgICAgICB2YXIgY2FyZHMgPSAnJztcbiAgICAgICAgdmFyIGNlbGw7XG4gICAgICAgIHZhciBlbnRpdHk7XG4gICAgICAgIHZhciBzdHlsZTtcbiAgICAgICAgdmFyIGh0bWwgPSAnJztcbiAgICAgICAgdmFyIGlkeE51bSA9IDA7XG4gICAgICAgIHZhciBpZHg7XG4gICAgICAgIHZhciBjZWxscyA9ICcnO1xuICAgICAgICBmb3IgKHZhciB4ID0gMTsgeCA8PSBtYXhJZHg7IHgrKykge1xuICAgICAgICAgICAgaWYgKGluZGV4ZXNMb2NhdGlvbiAhPSAnbGF0ZXJhbCcpIHtcbiAgICAgICAgICAgICAgICBjZWxscyA9IHRoaXMuYWRkVG9wSW5kZXhlcyhjaHVua1NpemUsIHgsIG1heFRvcCwgbGluZVNlcGFyYXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgO1xuICAgICAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCBkYXRhLmxlbmd0aDsgeSsrKSB7XG4gICAgICAgICAgICAgICAgZW50aXR5ID0gZGF0YVt5XVt4XTtcbiAgICAgICAgICAgICAgICBzdHlsZSA9ICdmb250LXNpemU6IDFlbTtkaXNwbGF5OmJsb2NrO2hlaWdodDoxZW07bGluZS1oZWlnaHQ6MWVtO21hcmdpbi1ib3R0b206JyArIGxpbmVTZXBhcmF0aW9uO1xuICAgICAgICAgICAgICAgIGlmICh5ID09PSBkYXRhLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgc3R5bGUgPSAnZm9udC1zaXplOiAxZW07ZGlzcGxheTpibG9jaztsaW5lLWhlaWdodDoxZW07bWFyZ2luLWJvdHRvbTonICsgbGluZVNlcGFyYXRpb247XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghZW50aXR5KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGVtcHR5ZmlsbGVyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlID0gJ2ZvbnQtc2l6ZTogMWVtO2Rpc3BsYXk6YmxvY2s7Y29sb3I6IHJnYmEoMCwgMCwgMCwgMCk7aGVpZ2h0OjFlbTtsaW5lLWhlaWdodDoxZW07bWFyZ2luLWJvdHRvbTonICsgbGluZVNlcGFyYXRpb247XG4gICAgICAgICAgICAgICAgICAgIGNlbGwgPSBcIjxzcGFuIHN0eWxlPVxcXCJcIi5jb25jYXQoc3R5bGUsIFwiXFxcIj5BPC9zcGFuPlwiKTsgLy8gbW9jayBjaGFyLCB0aGlzIGhhcyB0byBiZSBkb25lIHRvIGhhdmUgY2h1bmtzIGFsbCBvZiB0aGUgc2FtZSBsZW5ndGggKGxhc3QgY2h1bmsgY2FuJ3QgYmUgc2hvcnRlcilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbnRpdHkudGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZSArPSBcIlwiLmNvbmNhdChlbnRpdHkudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZW50aXR5LmNoYXIgJiYgIWVudGl0eS5jaGFyLmluY2x1ZGVzKCdzdmcnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8geSBpcyB0aGUgcm93LCB4IGlzIHRoZSBjb2x1bW5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwgPSBcIjxzcGFuIGNsYXNzPVxcXCJjZWxsXFxcIiBkYXRhLXJlcy14PSdcIi5jb25jYXQoeCwgXCInIGRhdGEtcmVzLXk9ICdcIikuY29uY2F0KHksIFwiJyBkYXRhLXJlcy1pZD0gJ1wiKS5jb25jYXQodGhpcy5kaXZJZCwgXCInXFxuICAgICAgICAgICAgICAgICAgICBzdHlsZT1cXFwiXCIpLmNvbmNhdChzdHlsZSwgXCJcXFwiPlwiKS5jb25jYXQoZW50aXR5LmNoYXIsIFwiPC9zcGFuPlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlICs9ICctd2Via2l0LXVzZXItc2VsZWN0OiBub25lOyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsID0gXCI8c3BhbiBzdHlsZT1cXFwiXCIuY29uY2F0KHN0eWxlLCBcIlxcXCI+XCIpLmNvbmNhdChlbnRpdHkuY2hhciwgXCI8L3NwYW4+XCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNlbGxzICs9IGNlbGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXJkcyArPSBcIjxkaXYgY2xhc3M9XFxcImNyZFxcXCI+XCIuY29uY2F0KGNlbGxzLCBcIjwvZGl2PlwiKTsgLy8gd2lkdGggMy81ZW0gdG8gcmVkdWNlIHdoaXRlIHNwYWNlIGFyb3VuZCBsZXR0ZXJzXG4gICAgICAgICAgICBjZWxscyA9ICcnO1xuICAgICAgICAgICAgaWYgKGNodW5rU2l6ZSA+IDAgJiYgeCAlIGNodW5rU2l6ZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNpZGVyaW5nIHRoZSByb3cgb2YgdG9wIGluZGV4ZXNcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXhlc0xvY2F0aW9uICE9ICd0b3AnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlkeE51bSArPSBjaHVua1NpemU7IC8vIGxhdGVyYWwgaW5kZXggKHNldCBvbmx5IGlmIHRvcCBpbmRleGVzIG1pc3NpbmcpXG4gICAgICAgICAgICAgICAgICAgIGlkeCA9IGlkeE51bSAtIChjaHVua1NpemUgLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gYWRkaW5nIGxhYmVsc1xuICAgICAgICAgICAgICAgICAgICB2YXIgZ2Fwc0NvbnRhaW5lciA9IHRoaXMuZ2VuZXJhdGVMYWJlbHMoaWR4LCBsYWJlbHMsIHN0YXJ0SW5kZXhlcywgaW5kZXhlc0xvY2F0aW9uLCBjaHVua1NpemUsIGluZGV4V2lkdGgsIGZhbHNlLCBkYXRhLCBsaW5lU2VwYXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsYWJlbHNbMF0gPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGdhcHNDb250YWluZXI7IC8vIGxhdGVyYWwgbnVtYmVyIGluZGV4ZXNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gbGFiZWxzQ29udGFpbmVyICsgZ2Fwc0NvbnRhaW5lcjsgLy8gbGF0ZXJhbCBudW1iZXIgaW5kZXhlcyArIGxhYmVsc1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghbGFiZWxzRmxhZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBnYXBzQ29udGFpbmVyOyAvLyBsYXRlcmFsIG51bWJlciBpbmRleGVzXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGxhYmVsc0NvbnRhaW5lciArIGdhcHNDb250YWluZXI7IC8vIGxhdGVyYWwgbnVtYmVyIGluZGV4ZXMgKyBsYWJlbHNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBsYWJlbHNDb250YWluZXI7IC8vIHRvcFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpbmRleCA9IFwiPGRpdiBjbGFzcz1cXFwiaWR4IGhpZGRlblxcXCI+XCIuY29uY2F0KGluZGV4LCBcIjwvZGl2PlwiKTtcbiAgICAgICAgICAgICAgICBzdHlsZSA9IFwiZm9udC1zaXplOiBcIi5jb25jYXQoZm9udFNpemUsIFwiO1wiKTtcbiAgICAgICAgICAgICAgICBpZiAoeCAhPT0gbWF4SWR4KSB7XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlICs9ICdwYWRkaW5nLXJpZ2h0OiAnICsgY2h1bmtTZXBhcmF0aW9uICsgJ2VtOyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdHlsZSArPSAnbWFyZ2luLXJpZ2h0OiAnICsgY2h1bmtTZXBhcmF0aW9uICsgJ2VtOyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBjaHVuayA9ICcnO1xuICAgICAgICAgICAgICAgIGlmIChsYWJlbHNGbGFnIHx8IG9wdGlvbnMuY29uc2Vuc3VzVHlwZSB8fCBpbmRleGVzTG9jYXRpb24gPT0gJ2JvdGgnIHx8IGluZGV4ZXNMb2NhdGlvbiA9PSAnbGF0ZXJhbCcpIHsgLy8gYm90aFxuICAgICAgICAgICAgICAgICAgICBjaHVuayA9IFwiPGRpdiBjbGFzcz1cXFwiY25rXFxcIiBzdHlsZT1cXFwiXCIuY29uY2F0KHN0eWxlLCBcIlxcXCI+XCIpLmNvbmNhdChpbmRleCwgXCI8ZGl2IGNsYXNzPVxcXCJjcmRzXFxcIj5cIikuY29uY2F0KGNhcmRzLCBcIjwvZGl2PjwvZGl2PlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNodW5rID0gXCI8ZGl2IGNsYXNzPVxcXCJjbmtcXFwiIHN0eWxlPVxcXCJcIi5jb25jYXQoc3R5bGUsIFwiXFxcIj48ZGl2IGNsYXNzPVxcXCJpZHggaGlkZGVuXFxcIj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJjcmRzXFxcIj5cIikuY29uY2F0KGNhcmRzLCBcIjwvZGl2PjwvZGl2PlwiKTsgLy8gdG9wXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhcmRzID0gJyc7XG4gICAgICAgICAgICAgICAgaW5kZXggPSAnJztcbiAgICAgICAgICAgICAgICBodG1sICs9IGNodW5rO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBpbm5lckhUTUw7XG4gICAgICAgIGlmICh3cmFwTGluZSkge1xuICAgICAgICAgICAgaW5uZXJIVE1MID0gXCI8ZGl2IGNsYXNzPVxcXCJyb290XFxcIj4gICBcIi5jb25jYXQoaHRtbCwgXCIgPC9kaXY+XCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaW5uZXJIVE1MID0gXCI8ZGl2IGNsYXNzPVxcXCJyb290XFxcIiBzdHlsZT1cXFwiZGlzcGxheTogZmxleFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cXFwiZGlzcGxheTppbmxpbmUtYmxvY2s7b3ZlcmZsb3cteDpzY3JvbGw7d2hpdGUtc3BhY2U6IG5vd3JhcDt3aWR0aDpcIi5jb25jYXQodmlld2VyV2lkdGgsIFwiXFxcIj4gXCIpLmNvbmNhdChodG1sLCBcIjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlwiKTtcbiAgICAgICAgfVxuICAgICAgICBzcXZCb2R5LmlubmVySFRNTCA9IGlubmVySFRNTDtcbiAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdyZXNpemUnKSk7XG4gICAgfTtcbiAgICBQcm9TZXFWaWV3ZXIuc3F2TGlzdCA9IFtdO1xuICAgIHJldHVybiBQcm9TZXFWaWV3ZXI7XG59KCkpO1xuZXhwb3J0IHsgUHJvU2VxVmlld2VyIH07XG4vLyAvLyBWRVJZIElNUE9SVEFOVCBBTkQgVVNFRlVMIFRPIEJFIEFCTEUgVE8gSEFWRSBBIFdPUktJTkcgQlVORExFLkpTISEgTkVWRVIgREVMRVRFIFRISVMgTElORVxuLy8gKHdpbmRvdyBhcyBhbnkpLlByb1NlcVZpZXdlciA9IFByb1NlcVZpZXdlcjtcbiIsImltcG9ydCB7IFBhbGV0dGVzIH0gZnJvbSAnLi9wYWxldHRlcyc7XG5pbXBvcnQgeyBDb2xvcnNNb2RlbCB9IGZyb20gJy4vY29sb3JzLm1vZGVsJztcbnZhciBSb3dzTW9kZWwgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUm93c01vZGVsKCkge1xuICAgICAgICB0aGlzLnN1YnN0aXR1dGl2ZUlkID0gOTk5OTk5OTk5OTk5OTk7XG4gICAgfVxuICAgIFJvd3NNb2RlbC5wcm90b3R5cGUucHJvY2Vzc1Jvd3MgPSBmdW5jdGlvbiAocm93cywgaWNvbnMsIHJlZ2lvbnMsIG9wdCkge1xuICAgICAgICB2YXIgYWxsRGF0YSA9IFtdO1xuICAgICAgICAvLyBkZWNpZGUgd2hpY2ggY29sb3IgaXMgbW9yZSBpbXBvcnRhbnQgaW4gY2FzZSBvZiBvdmVyd3JpdGluZ1xuICAgICAgICB2YXIgY29sb3JpbmdPcmRlciA9IFsnY3VzdG9tJywgJ2NsdXN0YWwnLCAnemFwcG8nLCAnZ3JhZGllbnQnLCAnYmluYXJ5J107XG4gICAgICAgIC8vIG9yZGVyIHJvdyBOdW1iZXJzXG4gICAgICAgIHZhciByb3dOdW1zT3JkZXJlZCA9IE9iamVjdC5rZXlzKHJvd3MpLm1hcChOdW1iZXIpLnNvcnQoZnVuY3Rpb24gKG4xLCBuMikgeyByZXR1cm4gbjEgLSBuMjsgfSk7XG4gICAgICAgIC8vIG9yZGVyIGtleXMgb2YgUm93IG9iamVjdFxuICAgICAgICB2YXIgb3JkZXJlZCA9IHt9O1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIHJvd051bXNPcmRlcmVkXzEgPSByb3dOdW1zT3JkZXJlZDsgX2kgPCByb3dOdW1zT3JkZXJlZF8xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIHJvd051bSA9IHJvd051bXNPcmRlcmVkXzFbX2ldO1xuICAgICAgICAgICAgb3JkZXJlZFtyb3dOdW1dID0gT2JqZWN0LmtleXMocm93c1srcm93TnVtXSkubWFwKE51bWJlcikuc29ydChmdW5jdGlvbiAobjEsIG4yKSB7IHJldHVybiBuMSAtIG4yOyB9KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGF0YTtcbiAgICAgICAgdmFyIGNvbG9yaW5nUm93TnVtcztcbiAgICAgICAgdmFyIHRtcDtcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGRhdGEgcm93c1xuICAgICAgICBmb3IgKHZhciBfYSA9IDAsIHJvd051bXNPcmRlcmVkXzIgPSByb3dOdW1zT3JkZXJlZDsgX2EgPCByb3dOdW1zT3JkZXJlZF8yLmxlbmd0aDsgX2ErKykge1xuICAgICAgICAgICAgdmFyIHJvd051bSA9IHJvd051bXNPcmRlcmVkXzJbX2FdO1xuICAgICAgICAgICAgdG1wID0gb3JkZXJlZFtyb3dOdW1dO1xuICAgICAgICAgICAgLy8gZGF0YSBrZXk6IGluZGV4ZXMsIHZhbHVlOiBjaGFyc1xuICAgICAgICAgICAgZGF0YSA9IHJvd3Nbcm93TnVtXTtcbiAgICAgICAgICAgIC8vIGRhdGFbcm93TnVtXS5sYWJlbCA9IHRoaXMucm93cy5nZXRMYWJlbChyb3dOdW0sIHRoaXMuc2VxdWVuY2VzKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgICAgICAgICBpZiAocmVnaW9ucykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIF9iID0gMCwgX2MgPSBjb2xvcmluZ09yZGVyLnJldmVyc2UoKTsgX2IgPCBfYy5sZW5ndGg7IF9iKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbG9yaW5nID0gX2NbX2JdO1xuICAgICAgICAgICAgICAgICAgICBjb2xvcmluZ1Jvd051bXMgPSBDb2xvcnNNb2RlbC5nZXRSb3dzTGlzdChjb2xvcmluZykubWFwKE51bWJlcik7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIGNvbG9yaW5nIGZvciB0aGUgZGF0YSByb3dcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbG9yaW5nUm93TnVtcy5pbmRleE9mKHJvd051bSkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBnbyB0byBuZXh0IGNvbG9yaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zaXRpb25zID0gQ29sb3JzTW9kZWwuZ2V0UG9zaXRpb25zKGNvbG9yaW5nLCByb3dOdW0pO1xuICAgICAgICAgICAgICAgICAgICAvLyBwb3NpdGlvbnMgPSBzdGFydCwgZW5kLCB0YXJnZXQgKGJnY29sb3IgfHwgZmdjb2xvcilcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvc2l0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBfZCA9IDAsIHBvc2l0aW9uc18xID0gcG9zaXRpb25zOyBfZCA8IHBvc2l0aW9uc18xLmxlbmd0aDsgX2QrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlID0gcG9zaXRpb25zXzFbX2RdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBlLnN0YXJ0OyBpIDw9IGUuZW5kOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFkYXRhW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZS5iYWNrZ3JvdW5kQ29sb3IgJiYgIWUuYmFja2dyb3VuZENvbG9yLnN0YXJ0c1dpdGgoJyMnKSkgeyAvLyBpcyBhIHBhbGV0dGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlLmJhY2tncm91bmRDb2xvciA9PSAnY3VzdG9tJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbaV0uYmFja2dyb3VuZENvbG9yID0gb3B0LmN1c3RvbVBhbGV0dGVbZGF0YVtpXS5jaGFyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbaV0uYmFja2dyb3VuZENvbG9yID0gUGFsZXR0ZXNbZS5iYWNrZ3JvdW5kQ29sb3JdW2RhdGFbaV0uY2hhcl07IC8vIGUuYmFja2dyb3VuZGNvbG9yID0gemFwcG8sIGNsdXN0YWwuLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtpXS5iYWNrZ3JvdW5kQ29sb3IgPSBlLmJhY2tncm91bmRDb2xvcjsgLy8gaXMgYSByZWdpb24gb3IgcGF0dGVyblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbaV0udGFyZ2V0ID0gZS50YXJnZXQgKyAnYmFja2dyb3VuZC1jb2xvcjonICsgZGF0YVtpXS5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpY29ucyAhPT0ge30pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGljb25zRGF0YSA9IGljb25zW3Jvd051bV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChpY29uc0RhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsbERhdGEucHVzaChpY29uc0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWxsRGF0YS5wdXNoKGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbGxEYXRhO1xuICAgIH07XG4gICAgUm93c01vZGVsLnByb3RvdHlwZS5wcm9jZXNzID0gZnVuY3Rpb24gKHNlcXVlbmNlcywgaWNvbnMsIHJlZ2lvbnMsIG9wdCkge1xuICAgICAgICAvLyBjaGVjayBhbmQgc2V0IGdsb2JhbCBzZXF1ZW5jZUNvbG9yXG4gICAgICAgIGlmIChvcHQgJiYgb3B0LnNlcXVlbmNlQ29sb3IpIHtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgc2VxdWVuY2VzXzEgPSBzZXF1ZW5jZXM7IF9pIDwgc2VxdWVuY2VzXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlcXVlbmNlID0gc2VxdWVuY2VzXzFbX2ldO1xuICAgICAgICAgICAgICAgIGlmICghc2VxdWVuY2Uuc2VxdWVuY2VDb2xvcikge1xuICAgICAgICAgICAgICAgICAgICBzZXF1ZW5jZS5zZXF1ZW5jZUNvbG9yID0gb3B0LnNlcXVlbmNlQ29sb3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGtlZXAgcHJldmlvdXMgZGF0YVxuICAgICAgICBpZiAoIXNlcXVlbmNlcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJlc2V0IGRhdGFcbiAgICAgICAgdmFyIHJvd3MgPSB7fTtcbiAgICAgICAgLy8gY2hlY2sgaWYgdGhlcmUgYXJlIHVuZGVmaW5lZCBvciBkdXBsaWNhdGUgaWRzIGFuZCBwcmVwYXJlIHRvIHJlc2V0IHRoZW1cbiAgICAgICAgdmFyIHZhbHVlcyA9IFtdO1xuICAgICAgICB2YXIgdW5kZWZpbmVkVmFsdWVzID0gMDtcbiAgICAgICAgZm9yICh2YXIgX2EgPSAwLCBfYiA9IE9iamVjdC5rZXlzKHNlcXVlbmNlcyk7IF9hIDwgX2IubGVuZ3RoOyBfYSsrKSB7XG4gICAgICAgICAgICB2YXIgciA9IF9iW19hXTtcbiAgICAgICAgICAgIGlmIChpc05hTigrc2VxdWVuY2VzW3JdLmlkKSkge1xuICAgICAgICAgICAgICAgIC8vIG1pc3NpbmcgaWRcbiAgICAgICAgICAgICAgICB1bmRlZmluZWRWYWx1ZXMgKz0gMTtcbiAgICAgICAgICAgICAgICBzZXF1ZW5jZXNbcl0uaWQgPSB0aGlzLnN1YnN0aXR1dGl2ZUlkO1xuICAgICAgICAgICAgICAgIHRoaXMuc3Vic3RpdHV0aXZlSWQgLT0gMTtcbiAgICAgICAgICAgICAgICAvLyBvdGhlcndpc2UganVzdCByZXNldCBtaXNzaW5nIGlkcyBhbmQgbG9nIHRoZSByZXNldHRlZCBpZFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlcy5pbmNsdWRlcygrc2VxdWVuY2VzW3JdLmlkKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBEdXBsaWNhdGUgc2VxdWVuY2UgaWRcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHNlcXVlbmNlc1tyXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKCtzZXF1ZW5jZXNbcl0uaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBfYyA9IDAsIF9kID0gT2JqZWN0LmtleXMoc2VxdWVuY2VzKTsgX2MgPCBfZC5sZW5ndGg7IF9jKyspIHtcbiAgICAgICAgICAgIHZhciByb3cgPSBfZFtfY107XG4gICAgICAgICAgICAvKiogY2hlY2sgc2VxdWVuY2VzIGlkIHR5cGUgKi9cbiAgICAgICAgICAgIHZhciBpZCA9IHZvaWQgMDtcbiAgICAgICAgICAgIGlmIChpc05hTigrc2VxdWVuY2VzW3Jvd10uaWQpKSB7XG4gICAgICAgICAgICAgICAgaWQgPSB2YWx1ZXMuc29ydCgpW3ZhbHVlcy5sZW5ndGggLSAxXSArIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZCA9IHNlcXVlbmNlc1tyb3ddLmlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyoqIHNldCByb3cgY2hhcnMgKi9cbiAgICAgICAgICAgIHJvd3NbaWRdID0ge307XG4gICAgICAgICAgICBmb3IgKHZhciBfZSA9IDAsIF9mID0gT2JqZWN0LmtleXMoc2VxdWVuY2VzW3Jvd10uc2VxdWVuY2UpOyBfZSA8IF9mLmxlbmd0aDsgX2UrKykge1xuICAgICAgICAgICAgICAgIHZhciBpZHggPSBfZltfZV07XG4gICAgICAgICAgICAgICAgdmFyIGlkeEtleSA9ICgraWR4ICsgMSkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICB2YXIgY2hhciA9IHNlcXVlbmNlc1tyb3ddLnNlcXVlbmNlW2lkeF07XG4gICAgICAgICAgICAgICAgcm93c1tpZF1baWR4S2V5XSA9IHsgY2hhcjogY2hhciB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NSb3dzKHJvd3MsIGljb25zLCByZWdpb25zLCBvcHQpO1xuICAgIH07XG4gICAgcmV0dXJuIFJvd3NNb2RlbDtcbn0oKSk7XG5leHBvcnQgeyBSb3dzTW9kZWwgfTtcbiIsInZhciBTZWxlY3Rpb25Nb2RlbCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTZWxlY3Rpb25Nb2RlbCgpIHtcbiAgICAgICAgdGhpcy5ldmVudF9zZXF1ZW5jZSA9IFtdO1xuICAgIH1cbiAgICBTZWxlY3Rpb25Nb2RlbC5wcm90b3R5cGUuc2V0X3N0YXJ0ID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGlkO1xuICAgICAgICB2YXIgZWxlbWVudDtcbiAgICAgICAgaWYgKGUucGF0aCkge1xuICAgICAgICAgICAgLy8gY2hyb21lIHN1cHBvcnRcbiAgICAgICAgICAgIGVsZW1lbnQgPSBlLnBhdGhbMF07XG4gICAgICAgICAgICBpZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnQuZGF0YXNldC5yZXNJZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBmaXJlZm94IHN1cHBvcnRcbiAgICAgICAgICAgIGVsZW1lbnQgPSBlLm9yaWdpbmFsVGFyZ2V0O1xuICAgICAgICAgICAgaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50LmRhdGFzZXQucmVzSWQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFzdElkID0gZWxlbWVudC5kYXRhc2V0LnJlc0lkO1xuICAgICAgICB0aGlzLmxhc3RTcXYgPSBpZDtcbiAgICAgICAgdGhpcy5zdGFydCA9IHsgeTogZWxlbWVudC5kYXRhc2V0LnJlc1ksIHg6IGVsZW1lbnQuZGF0YXNldC5yZXNYLCBzcXZJZDogZWxlbWVudC5kYXRhc2V0LnJlc0lkIH07XG4gICAgICAgIHRoaXMubGFzdE92ZXIgPSB7IHk6IGVsZW1lbnQuZGF0YXNldC5yZXNZLCB4OiBlbGVtZW50LmRhdGFzZXQucmVzWCwgc3F2SWQ6IGVsZW1lbnQuZGF0YXNldC5yZXNJZCB9O1xuICAgICAgICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1yZXMtaWQ9JyArIGVsZW1lbnQuZGF0YXNldC5yZXNJZCArICddJyk7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uaGlnaGxpZ2h0KGVsZW1lbnRzKTtcbiAgICAgICAgdGhpcy5maXJzdE92ZXIgPSBmYWxzZTtcbiAgICB9O1xuICAgIFNlbGVjdGlvbk1vZGVsLnByb3RvdHlwZS5zZWxlY3Rpb25oaWdobGlnaHQgPSBmdW5jdGlvbiAoZWxlbWVudHMpIHtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBlbGVtZW50c18xID0gZWxlbWVudHM7IF9pIDwgZWxlbWVudHNfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3Rpb24gPSBlbGVtZW50c18xW19pXTtcbiAgICAgICAgICAgIHZhciB4ID0gK3NlbGVjdGlvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtcmVzLXgnKTtcbiAgICAgICAgICAgIHZhciB5ID0gK3NlbGVjdGlvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtcmVzLXknKTtcbiAgICAgICAgICAgIHZhciBmaXJzdFggPSBNYXRoLm1pbigrdGhpcy5zdGFydC54LCArdGhpcy5sYXN0T3Zlci54KTtcbiAgICAgICAgICAgIHZhciBsYXN0WCA9IE1hdGgubWF4KCt0aGlzLnN0YXJ0LngsICt0aGlzLmxhc3RPdmVyLngpO1xuICAgICAgICAgICAgdmFyIGZpcnN0WSA9IE1hdGgubWluKCt0aGlzLnN0YXJ0LnksICt0aGlzLmxhc3RPdmVyLnkpO1xuICAgICAgICAgICAgdmFyIGxhc3RZID0gTWF0aC5tYXgoK3RoaXMuc3RhcnQueSwgK3RoaXMubGFzdE92ZXIueSk7XG4gICAgICAgICAgICAvLyBvbiBldmVyeSBkcmFnIHJlc2VsZWN0IHRoZSB3aG9sZSBhcmVhIC4uLlxuICAgICAgICAgICAgaWYgKHggPj0gK2ZpcnN0WCAmJiB4IDw9ICtsYXN0WCAmJlxuICAgICAgICAgICAgICAgIHkgPj0gK2ZpcnN0WSAmJiB5IDw9ICtsYXN0WSAmJlxuICAgICAgICAgICAgICAgIHNlbGVjdGlvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtcmVzLWlkJykgPT09IHRoaXMubGFzdE92ZXIuc3F2SWQpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb24uY2xhc3NMaXN0LmFkZCgnaGlnaGxpZ2h0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb24uY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNlbGVjdGlvbk1vZGVsLnByb3RvdHlwZS5wcm9jZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgc2VxdWVuY2VWaWV3ZXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2VsbCcpO1xuICAgICAgICAvLyByZW1vdmUgc2VsZWN0aW9uIG9uIG5ldyBjbGlja1xuICAgICAgICB3aW5kb3cub25tb3VzZWRvd24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIF90aGlzLmV2ZW50X3NlcXVlbmNlLnB1c2goMCk7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIHNlcXVlbmNlVmlld2Vyc18yID0gc2VxdWVuY2VWaWV3ZXJzOyBfaSA8IHNlcXVlbmNlVmlld2Vyc18yLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIHZhciBzcXYgPSBzZXF1ZW5jZVZpZXdlcnNfMltfaV07XG4gICAgICAgICAgICAgICAgc3F2Lm9ubW91c2Vkb3duID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuc2V0X3N0YXJ0KGUpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoX3RoaXMuZXZlbnRfc2VxdWVuY2VbMF0gPT0gMCAmJiBfdGhpcy5ldmVudF9zZXF1ZW5jZVsxXSA9PSAxICYmIF90aGlzLmV2ZW50X3NlcXVlbmNlWzJdID09IDIgJiYgX3RoaXMuZXZlbnRfc2VxdWVuY2VbMF0gPT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIGxlZnQgY2xpY2tcbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1yZXMtaWQ9JyArIF90aGlzLmxhc3RJZCArICddJyk7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgIGZvciAodmFyIF9hID0gMCwgZWxlbWVudHNfMiA9IGVsZW1lbnRzOyBfYSA8IGVsZW1lbnRzXzIubGVuZ3RoOyBfYSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3Rpb24gPSBlbGVtZW50c18yW19hXTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmIGZpcnN0IGNsaWNrIG91dHNpZGUgc3F2RGl2IChmaXJzdCBpZiBpcyB2YWxpZCBpbiBDaHJvbWUsIHNlY29uZCBpbiBmaXJlZm94KVxuICAgICAgICAgICAgaWYgKCFldmVudC50YXJnZXQuZGF0YXNldC5yZXNYKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuZmlyc3RPdmVyID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChldmVudC5leHBsaWNpdE9yaWdpbmFsVGFyZ2V0ICYmIGV2ZW50LmV4cGxpY2l0T3JpZ2luYWxUYXJnZXQuZGF0YXNldCkge1xuICAgICAgICAgICAgICAgIF90aGlzLmZpcnN0T3ZlciA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy5ldmVudF9zZXF1ZW5jZSA9IFswXTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIHNlcXVlbmNlVmlld2Vyc18xID0gc2VxdWVuY2VWaWV3ZXJzOyBfaSA8IHNlcXVlbmNlVmlld2Vyc18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIHNxdiA9IHNlcXVlbmNlVmlld2Vyc18xW19pXTtcbiAgICAgICAgICAgIHNxdi5vbm1vdXNlb3ZlciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEoMSBpbiBfdGhpcy5ldmVudF9zZXF1ZW5jZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZXZlbnRfc2VxdWVuY2UucHVzaCgxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLmZpcnN0T3Zlcikge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5zZXRfc3RhcnQoZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50O1xuICAgICAgICAgICAgICAgIGlmIChlLnBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IGUucGF0aFswXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBlLm9yaWdpbmFsVGFyZ2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMuc3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubGFzdE92ZXIgPSB7IHk6IGVsZW1lbnQuZGF0YXNldC5yZXNZLCB4OiBlbGVtZW50LmRhdGFzZXQucmVzWCwgc3F2SWQ6IGVsZW1lbnQuZGF0YXNldC5yZXNJZCB9O1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1yZXMtaWQ9JyArIGVsZW1lbnQuZGF0YXNldC5yZXNJZCArICddJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfdGhpcy5sYXN0SWQgPT0gZWxlbWVudC5kYXRhc2V0LnJlc0lkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5zZWxlY3Rpb25oaWdobGlnaHQoZWxlbWVudHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudC5ib2R5Lm9ubW91c2V1cCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLmV2ZW50X3NlcXVlbmNlLnB1c2goMik7XG4gICAgICAgICAgICBfdGhpcy5maXJzdE92ZXIgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChfdGhpcy5zdGFydCkge1xuICAgICAgICAgICAgICAgIF90aGlzLnN0YXJ0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKF90aGlzLmV2ZW50X3NlcXVlbmNlWzBdID09IDAgJiYgX3RoaXMuZXZlbnRfc2VxdWVuY2VbMV0gPT0gMikge1xuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXJlcy1pZD0nICsgX3RoaXMubGFzdElkICsgJ10nKTtcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBlbGVtZW50c18zID0gZWxlbWVudHM7IF9pIDwgZWxlbWVudHNfMy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdGlvbiA9IGVsZW1lbnRzXzNbX2ldO1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb24uY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtcmVzLWlkPScgKyBfdGhpcy5sYXN0SWQgKyAnXScpO1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgZSA9IGUgfHwgd2luZG93LmV2ZW50O1xuICAgICAgICAgICAgdmFyIGtleSA9IGUud2hpY2ggfHwgZS5rZXlDb2RlOyAvLyBrZXlDb2RlIGRldGVjdGlvblxuICAgICAgICAgICAgdmFyIGN0cmwgPSBlLmN0cmxLZXkgPyBlLmN0cmxLZXkgOiAoKGtleSA9PT0gMTcpKTsgLy8gY3RybCBkZXRlY3Rpb25cbiAgICAgICAgICAgIGlmIChrZXkgPT09IDY3ICYmIGN0cmwpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGV4dFRvUGFzdGUgPSAnJztcbiAgICAgICAgICAgICAgICB2YXIgdGV4dERpY3QgPSB7fTtcbiAgICAgICAgICAgICAgICB2YXIgcm93ID0gJyc7XG4gICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmZvcmluXG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgZWxlbWVudHNfNCA9IGVsZW1lbnRzOyBfaSA8IGVsZW1lbnRzXzQubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3Rpb24gPSBlbGVtZW50c180W19pXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGlvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZ2hsaWdodCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRleHREaWN0W3NlbGVjdGlvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtcmVzLXknKV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0RGljdFtzZWxlY3Rpb24uZ2V0QXR0cmlidXRlKCdkYXRhLXJlcy15JyldID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBuZXcgbGluZSB3aGVuIG5ldyByb3dcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3Rpb24uZ2V0QXR0cmlidXRlKCdkYXRhLXJlcy15JykgIT09IHJvdyAmJiByb3cgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dERpY3Rbc2VsZWN0aW9uLmdldEF0dHJpYnV0ZSgnZGF0YS1yZXMteScpXSArPSBzZWxlY3Rpb24uaW5uZXJUZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dERpY3Rbc2VsZWN0aW9uLmdldEF0dHJpYnV0ZSgnZGF0YS1yZXMteScpXSArPSBzZWxlY3Rpb24uaW5uZXJUZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcm93ID0gc2VsZWN0aW9uLmdldEF0dHJpYnV0ZSgnZGF0YS1yZXMteScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBmbGFnID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHRleHRSb3cgaW4gdGV4dERpY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZsYWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRUb1Bhc3RlICs9ICdcXG4nICsgdGV4dERpY3RbdGV4dFJvd107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0VG9QYXN0ZSArPSB0ZXh0RGljdFt0ZXh0Um93XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYWcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0ZXh0VG9QYXN0ZSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29weSB0byBjbGlwYm9hcmQgZm9yIHRoZSBwYXN0ZSBldmVudFxuICAgICAgICAgICAgICAgICAgICB2YXIgZHVtbXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGR1bW15KTtcbiAgICAgICAgICAgICAgICAgICAgZHVtbXkudmFsdWUgPSB0ZXh0VG9QYXN0ZTtcbiAgICAgICAgICAgICAgICAgICAgZHVtbXkuc2VsZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjb3B5Jyk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZHVtbXkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXZ0ID0gbmV3IEN1c3RvbUV2ZW50KCdvbkhpZ2hsaWdodFNlbGVjdGlvbicsIHsgZGV0YWlsOiB7IHRleHQ6IHRleHRUb1Bhc3RlLCBldmVudFR5cGU6ICdoaWdobGlnaHQgc2VsZWN0aW9uJyB9IH0pO1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChldnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgZmFsc2UpO1xuICAgIH07XG4gICAgcmV0dXJuIFNlbGVjdGlvbk1vZGVsO1xufSgpKTtcbmV4cG9ydCB7IFNlbGVjdGlvbk1vZGVsIH07XG4iLCJ2YXIgU2VxdWVuY2VJbmZvTW9kZWwgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU2VxdWVuY2VJbmZvTW9kZWwoKSB7XG4gICAgICAgIHRoaXMuaXNIVE1MID0gZnVuY3Rpb24gKHN0cikge1xuICAgICAgICAgICAgdmFyIGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc3RyKTtcbiAgICAgICAgICAgIC8vIHJlbW92ZSBhbGwgbm9uIHRleHQgbm9kZXMgZnJvbSBmcmFnbWVudFxuICAgICAgICAgICAgZnJhZ21lbnQucXVlcnlTZWxlY3RvckFsbCgnKicpLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7IHJldHVybiBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTsgfSk7XG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyB0ZXh0Q29udGVudCwgdGhlbiBub3QgYSBwdXJlIEhUTUxcbiAgICAgICAgICAgIHJldHVybiAhKGZyYWdtZW50LnRleHRDb250ZW50IHx8ICcnKS50cmltKCk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIFNlcXVlbmNlSW5mb01vZGVsLnByb3RvdHlwZS5wcm9jZXNzID0gZnVuY3Rpb24gKHJlZ2lvbnMsIHNlcXVlbmNlcykge1xuICAgICAgICB2YXIgbGFiZWxzID0gW107XG4gICAgICAgIHZhciBzdGFydEluZGV4ZXMgPSBbXTtcbiAgICAgICAgdmFyIHRvb2x0aXBzID0gW107XG4gICAgICAgIHZhciBmbGFnO1xuICAgICAgICBzZXF1ZW5jZXMuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYS5pZCAtIGIuaWQ7IH0pO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIHNlcXVlbmNlc18xID0gc2VxdWVuY2VzOyBfaSA8IHNlcXVlbmNlc18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIHNlcSA9IHNlcXVlbmNlc18xW19pXTtcbiAgICAgICAgICAgIGlmICghc2VxKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VxLnN0YXJ0SW5kZXgpIHtcbiAgICAgICAgICAgICAgICBzdGFydEluZGV4ZXMucHVzaChzZXEuc3RhcnRJbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdGFydEluZGV4ZXMucHVzaCgxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZXEubGFiZWxUb29sdGlwKSB7XG4gICAgICAgICAgICAgICAgdG9vbHRpcHMucHVzaChzZXEubGFiZWxUb29sdGlwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRvb2x0aXBzLnB1c2goJzxzcGFuPjwvc3Bhbj4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZXEubGFiZWwgJiYgIXRoaXMuaXNIVE1MKHNlcS5sYWJlbCkpIHtcbiAgICAgICAgICAgICAgICBsYWJlbHMucHVzaChzZXEubGFiZWwpO1xuICAgICAgICAgICAgICAgIGZsYWcgPSB0cnVlOyAvLyB0byBjaGVjayBpZiBJIGhhdmUgYXQgbGVhc3Qgb25lIGxhYmVsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsYWJlbHMucHVzaCgnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtsYWJlbHMsIHN0YXJ0SW5kZXhlcywgdG9vbHRpcHMsIGZsYWddO1xuICAgIH07XG4gICAgcmV0dXJuIFNlcXVlbmNlSW5mb01vZGVsO1xufSgpKTtcbmV4cG9ydCB7IFNlcXVlbmNlSW5mb01vZGVsIH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImV4cG9ydCB7IFByb1NlcVZpZXdlciB9IGZyb20gXCIuL2xpYi9wcm9zZXF2aWV3ZXJcIjtcbi8vIGV4cG9ydCBmdW5jdGlvbiBpbml0Vmlld2VyKC4uLmFyZ3MpOiBQcm9TZXFWaWV3ZXIge1xuLy8gICAgIC8vIERlZmluZSB2aWV3ZXJcbi8vICAgICByZXR1cm4gbmV3IFByb1NlcVZpZXdlciguLi5hcmdzKTtcbi8vICAgICAvLyAvLyBEZWZpbmUgc2VxdWVuY2VzXG4vLyAgICAgLy8gY29uc3Qgc2VxdWVuY2VzID0gW1xuLy8gICAgIC8vICAgICB7XG4vLyAgICAgLy8gICAgICAgICBzZXF1ZW5jZTogJ0dUUkVWUEFEQVlZR1ZIVExSQUlFTkZZSVNOTktJU0RJUEVGVlJHTVZNVktLQUFBTUFOS0VMUVRJUEtTVkFOQUlJQUFDREVWTE5OR0tDTURRRlBWRFZZUUdHQUdUU1ZOTU5UTkVWTEFOSUdMRUxNR0hRS0dFWVFZTE5QTkRIVk5LQ1FTVE5EQVlQVEdGUklBVicsXG4vLyAgICAgLy8gICAgICAgICBpZDogMSxcbi8vICAgICAvLyAgICAgICAgIGxhYmVsOiAnQVNQQV9FQ09MSS8xMy0xNTYnXG4vLyAgICAgLy8gICAgIH0sXG4vLyAgICAgLy8gICAgIHtcbi8vICAgICAvLyAgICAgICAgIHNlcXVlbmNlOiAnR0VLUUlFQURWWVlHSVFUTFJBU0VORlBJVEdZS0lIRUUuLk1JTkFMQUlWS0tBQUFMQU5NRFZLUkxZRUdJR1FBSVZRQUFERUlMRS5HS1dIRFFGSVZEUElRR0dBR1RTTU5NTkFORVZJR05SQUxFSU1HSEtLR0RZSUhMU1BOVEhWTk1TUVNUTkRWRlBUQUlISVNUJyxcbi8vICAgICAvLyAgICAgICAgIGlkOiAyLFxuLy8gICAgIC8vICAgICAgICAgbGFiZWw6ICdBU1BBX0JBQ1NVLzE2LTE1Nidcbi8vICAgICAvLyAgICAgfSxcbi8vICAgICAvLyAgICAge1xuLy8gICAgIC8vICAgICAgICAgc2VxdWVuY2U6ICdNS1lURFRBUEtMRk1OVEdUS0ZQUlJJSVdTLi4uLi4uLi4uLi4uLk1HVkxLS1NDQUtWTkFETEdMTERLS0lBRFNJSUtBU0RETElELkdLTERES0lWTERWRlFUR1NHVEdMTk1OVk5FVklBRVZBU1NZU04uLi4uLi5MS1ZIUE5ESFZORkdRU1NORFRWUFRBSVJJQUEnLFxuLy8gICAgIC8vICAgICAgICAgaWQ6IDMsXG4vLyAgICAgLy8gICAgICAgICBsYWJlbDogJ0ZVTUNfU0FDUzIvMS0xMjQnXG4vLyAgICAgLy8gICAgIH0sXG4vLyAgICAgLy8gICAgIHtcbi8vICAgICAvLyAgICAgICAgIHNlcXVlbmNlOiAnR1JGVFFBQURRUkZLUUZORFNMUkZEWVJMQUVRRElWLi4uLi4uLkdTVkFXU0tBTFZUVkdWTFQuLi4uQUVFUUFRTEVFQUxOVkxMRURWUkFSUFFRSUxFU0RBRURJSFNXVkVHS0xJREtWRy4uLi4uLi4uLi4uLi4uLi4uUUxHS0tMSFRHUlNSTkRRVkFURExLTFdDJyxcbi8vICAgICAvLyAgICAgICAgIGlkOiA0LFxuLy8gICAgIC8vICAgICAgICAgbGFiZWw6ICdBUkxZX0VDT0xJLzYtMTkxJ1xuLy8gICAgIC8vICAgICB9LFxuLy8gICAgIC8vICAgICB7XG4vLyAgICAgLy8gICAgICAgICBzZXF1ZW5jZTogJ0dSRlZHQVZEUElNRUtGTkFTSUFZRFJITFdFVkRWUS4uLi4uLi5HU0tBWVNSR0xFS0FHTExULi4uLktBRU1EUUlMSEdMREtWQUVFV0FRRy5URktMTlNOREVESUhUQU5FUlJMS0VMSUcuLi4uLi4uLi4uLi4uLi4uLkFUQUdLTEhUR1JTUk5EUVZWVERMUkxXTScsXG4vLyAgICAgLy8gICAgICAgICBpZDogNSxcbi8vICAgICAvLyAgICAgICAgIGxhYmVsOiAnQVJMWV9IVU1BTi8xMS0xOTUnXG4vLyAgICAgLy8gICAgIH0sXG4vLyAgICAgLy8gICAgIHtcbi8vICAgICAvLyAgICAgICAgIHNlcXVlbmNlOiAnR0dSRlNHQVREUExNQUVGTktTSVlTR0tFTUNFRURWSS4uLi4uLi5HU01BWUFLQUxDUUtOVklTLi4uLkVFRUxOU0lMS0dMRVFJUVJFV05TRy5RRlZMRVBTREVEVkhUQU5FUlJMVEVJSUcuLi4uLi4uLi4uLi4uLi4uLkRWQUdLTEhUR1JTUk5EUVZUVERMUkxXJyxcbi8vICAgICAvLyAgICAgICAgIGlkOiA2LFxuLy8gICAgIC8vICAgICAgICAgbGFiZWw6ICdBUkxZX1NDSFBPLzEyLTEwNidcbi8vICAgICAvLyAgICAgfSxcbi8vICAgICAvLyAgICAge1xuLy8gICAgIC8vICAgICAgICAgc2VxdWVuY2U6ICdHUkZUR0FURFBMTURMWU5BU0xQWURLVk1ZREFETFQuLi4uLi4uR1RLVllUUUdMTktMR0xJVC4uLi5URUVMSExJSFFHTEVRSVJRRVdIRE4uS0ZJSUtBR0RFRElIVEFORVJSTEdFSUlHLi4uLi4uLi4uLi4uLi4uLktOSVNHS1ZIVEdSU1JORFFWQVRETVJJRlYnLFxuLy8gICAgIC8vICAgICAgICAgaWQ6IDcsXG4vLyAgICAgLy8gICAgICAgICBsYWJlbDogJ1E1OVIzMV9DQU5BTC8xNC0xMjEnXG4vLyAgICAgLy8gICAgIH0sXG4vLyAgICAgLy8gICAgIHtcbi8vICAgICAvLyAgICAgICAgIHNlcXVlbmNlOiAnR1JGVEdLVERQTE1FS0ZORVNMUEZES1JMV0FFRElLLi4uLi4uLkdTUUFZQUtBTEFLQUdJTFQuLi4uSFZFQUFTSVZER0xTS1ZBRUVXUVNHLlZGVlZLUEdERURJSFRBTkVSUkxURUxJRy4uLi4uLi4uLi4uLi4uLi4uQVZHR0tMSFRHUlNSTkRRVkFURFlSTFdMJyxcbi8vICAgICAvLyAgICAgICAgIGlkOiA4LFxuLy8gICAgIC8vICAgICAgICAgbGFiZWw6ICdBMEExMjVZWlI0X1ZPTENBLzIzLTExOCdcbi8vICAgICAvLyAgICAgfVxuLy8gICAgIC8vIF07XG4vLyAgICAgLy8gLy8gRGVmaW5lIGljb25zXG4vLyAgICAgLy8gY29uc3QgaWNvbnMgPSBbXG4vLyAgICAgLy8gICAgIHtcbi8vICAgICAvLyAgICAgICAgIHNlcXVlbmNlSWQ6IDEsXG4vLyAgICAgLy8gICAgICAgICBzdGFydDogMSxcbi8vICAgICAvLyAgICAgICAgIGVuZDogMSxcbi8vICAgICAvLyAgICAgICAgIGljb246ICdub1NlY29uZGFyeSdcbi8vICAgICAvLyAgICAgfSwge1xuLy8gICAgIC8vICAgICAgICAgc2VxdWVuY2VJZDogMSxcbi8vICAgICAvLyAgICAgICAgIHN0YXJ0OiAyLFxuLy8gICAgIC8vICAgICAgICAgZW5kOiA3LFxuLy8gICAgIC8vICAgICAgICAgaWNvbjogJ3N0cmFuZCdcbi8vICAgICAvLyAgICAgfSwge3NlcXVlbmNlSWQ6IDEsIHN0YXJ0OiA4LCBlbmQ6IDgsIGljb246ICdhcnJvd1JpZ2h0J30sIHtcbi8vICAgICAvLyAgICAgICAgIHNlcXVlbmNlSWQ6IDEsXG4vLyAgICAgLy8gICAgICAgICBzdGFydDogOSxcbi8vICAgICAvLyAgICAgICAgIGVuZDogMTIsXG4vLyAgICAgLy8gICAgICAgICBpY29uOiAnbm9TZWNvbmRhcnknXG4vLyAgICAgLy8gICAgIH0sIHtzZXF1ZW5jZUlkOiAxLCBzdGFydDogMTMsIGVuZDogMjEsIGljb246ICdoZWxpeCd9LCB7XG4vLyAgICAgLy8gICAgICAgICBzZXF1ZW5jZUlkOiAxLFxuLy8gICAgIC8vICAgICAgICAgc3RhcnQ6IDIyLFxuLy8gICAgIC8vICAgICAgICAgZW5kOiAzNCxcbi8vICAgICAvLyAgICAgICAgIGljb246ICdub1NlY29uZGFyeSdcbi8vICAgICAvLyAgICAgfSwge3NlcXVlbmNlSWQ6IDEsIHN0YXJ0OiAzNSwgZW5kOiA1MiwgaWNvbjogJ2hlbGl4J30sIHtcbi8vICAgICAvLyAgICAgICAgIHNlcXVlbmNlSWQ6IDEsXG4vLyAgICAgLy8gICAgICAgICBzdGFydDogNTMsXG4vLyAgICAgLy8gICAgICAgICBlbmQ6IDU3LFxuLy8gICAgIC8vICAgICAgICAgaWNvbjogJ25vU2Vjb25kYXJ5J1xuLy8gICAgIC8vICAgICB9LCB7c2VxdWVuY2VJZDogMSwgc3RhcnQ6IDU4LCBlbmQ6IDcxLCBpY29uOiAnaGVsaXgnfSwge1xuLy8gICAgIC8vICAgICAgICAgc2VxdWVuY2VJZDogMSxcbi8vICAgICAvLyAgICAgICAgIHN0YXJ0OiA3Mixcbi8vICAgICAvLyAgICAgICAgIGVuZDogNzIsXG4vLyAgICAgLy8gICAgICAgICBpY29uOiAnbm9TZWNvbmRhcnknXG4vLyAgICAgLy8gICAgIH0sIHtzZXF1ZW5jZUlkOiAxLCBzdGFydDogNzMsIGVuZDogNzUsIGljb246ICd0dXJuJ30sIHtcbi8vICAgICAvLyAgICAgICAgIHNlcXVlbmNlSWQ6IDEsXG4vLyAgICAgLy8gICAgICAgICBzdGFydDogNzYsXG4vLyAgICAgLy8gICAgICAgICBlbmQ6IDkxLFxuLy8gICAgIC8vICAgICAgICAgaWNvbjogJ25vU2Vjb25kYXJ5J1xuLy8gICAgIC8vICAgICB9LCB7c2VxdWVuY2VJZDogMSwgc3RhcnQ6IDkyLCBlbmQ6IDEwOCwgaWNvbjogJ2hlbGl4J30sIHtcbi8vICAgICAvLyAgICAgICAgIHNlcXVlbmNlSWQ6IDEsXG4vLyAgICAgLy8gICAgICAgICBzdGFydDogMTA5LFxuLy8gICAgIC8vICAgICAgICAgZW5kOiAxMTEsXG4vLyAgICAgLy8gICAgICAgICBpY29uOiAndHVybidcbi8vICAgICAvLyAgICAgfSwge3NlcXVlbmNlSWQ6IDEsIHN0YXJ0OiAxMTIsIGVuZDogMTIxLCBpY29uOiAnbm9TZWNvbmRhcnknfSwge1xuLy8gICAgIC8vICAgICAgICAgc2VxdWVuY2VJZDogMSxcbi8vICAgICAvLyAgICAgICAgIHN0YXJ0OiAxMjIsXG4vLyAgICAgLy8gICAgICAgICBlbmQ6IDEyNixcbi8vICAgICAvLyAgICAgICAgIGljb246ICdoZWxpeCdcbi8vICAgICAvLyAgICAgfVxuLy8gICAgIC8vIF07XG4vLyAgICAgLy8gLy8gRGVmaW5lIG9wdGlvbnNcbi8vICAgICAvLyBjb25zdCBvcHRpb25zID0ge2NodW5rU2l6ZTogMTAsIHNlcXVlbmNlQ29sb3I6ICdibG9zdW02Mid9O1xuLy8gICAgIC8vIC8vIERlZmluZSBjb25zZW5zdXNcbi8vICAgICAvLyBjb25zdCBjb25zZW5zdXMgPSB7Y29sb3I6ICdwaHlzaWNhbCcsIGRvdFRocmVzaG9sZDogNzB9XG4vLyAgICAgLy8gLy8gRHJhdyBhIHZpZXdlclxuLy8gICAgIC8vIHBzdi5kcmF3KHtzZXF1ZW5jZXMsIG9wdGlvbnMsIGljb25zLCBjb25zZW5zdXN9KTtcbi8vIH1cbi8vIC8vXG4vLyAvLyBpbml0Vmlld2VyKCk7XG4iXSwic291cmNlUm9vdCI6IiJ9