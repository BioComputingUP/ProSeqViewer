(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("ProSeqViewer", [], factory);
	else if(typeof exports === 'object')
		exports["ProSeqViewer"] = factory();
	else
		root["ProSeqViewer"] = factory();
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
var ColorsModel =
/** @class */
function () {
  function ColorsModel() {}

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
          sequenceColorRegions.push({
            sequenceId: sequence.id,
            start: 1,
            end: sequence.sequence.length,
            sequenceColor: sequence.sequenceColor
          });
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
  }; // transform input structure


  ColorsModel.prototype.transformInput = function (regions, newRegions, sequences, globalColor) {
    // if don't receive new colors, keep old colors
    if (!regions) {
      return;
    } // if receive new colors, change them


    ColorsModel.palette = {};
    var info;

    if (!globalColor) {
      for (var _i = 0, sequences_1 = sequences; _i < sequences_1.length; _i++) {
        var seq = sequences_1[_i];
        var reg = {
          sequenceId: seq.id,
          backgroundColor: '',
          start: 1,
          end: seq.sequence.length,
          sequenceColor: ''
        };

        if (seq.sequenceColor) {
          reg.backgroundColor = seq.sequenceColor;
          reg.sequenceColor = seq.sequenceColor;
          info = this.setSequenceColor(reg, seq);
        }
      }
    }

    var _loop_1 = function _loop_1(reg) {
      var sequenceColor = void 0;

      if (reg.icon) {
        return "continue";
      }

      if (sequences.find(function (x) {
        return x.id === reg.sequenceId;
      })) {
        sequenceColor = sequences.find(function (x) {
          return x.id === reg.sequenceId;
        }).sequenceColor;

        if (sequenceColor && !globalColor) {
          // sequenceColor is set. Cannot set backgroundColor
          reg.sequenceColor = sequenceColor;
        }
      }

      info = this_1.processColor(reg);

      if (info === -1) {
        return "continue";
      }

      ColorsModel.palette[info.type][info.sequenceId].positions.push({
        start: reg.start,
        end: reg.end,
        target: info.letterStyle
      });

      if (sequenceColor && sequenceColor.includes('binary')) {
        // @ts-ignore
        ColorsModel.palette[info.type].binaryColors = this_1.getBinaryColors(sequenceColor);
      }
    };

    var this_1 = this; // overwrite region color if sequenceColor is set
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
    ColorsModel.palette[info.type][info.sequenceId].positions.push({
      start: reg.start,
      end: reg.end,
      target: info.letterStyle
    });

    if (seq.sequenceColor.includes('binary')) {
      // @ts-ignore
      ColorsModel.palette[info.type].binaryColors = this.getBinaryColors(seq.sequenceColor);
    }

    return info;
  };

  ColorsModel.prototype.fixMissingIds = function (regions, sequences) {
    var newRegions = [];

    var _loop_2 = function _loop_2(reg) {
      if (!reg) {
        return "continue";
      }

      if (sequences.find(function (x) {
        return x.id === reg.sequenceId;
      })) {
        newRegions.push(reg);
      } else {
        for (var _a = 0, sequences_2 = sequences; _a < sequences_2.length; _a++) {
          var seq = sequences_2[_a];
          var newReg = {}; // tslint:disable-next-line:forin

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
        case 'gradient':
          {
            // tslint:disable-next-line:forin
            for (var row in ColorsModel.palette[type]) {
              c = ColorsModel.palette[type][row];
              n = c.positions.length + c.chars.length;
              arrColors = this.gradient(n);
              c.positions.sort(function (a, b) {
                return a.start > b.start ? 1 : -1;
              });

              for (var _i = 0, _a = c.positions; _i < _a.length; _i++) {
                var e = _a[_i];
                e.backgroundColor = arrColors.pop();
              }
            }

            break;
          }

        case 'binary':
          {
            // tslint:disable-next-line:forin
            for (var row in ColorsModel.palette[type]) {
              if (row === 'binaryColors') {
                continue;
              }

              c = ColorsModel.palette[type][row];
              n = c.positions.length + c.chars.length;
              arrColors = this.binary(n, ColorsModel.palette[type].binaryColors);
              c.positions.sort(function (a, b) {
                return a.start > b.start ? 1 : -1;
              });

              for (var _b = 0, _c = c.positions; _b < _c.length; _b++) {
                var e = _c[_b];
                e.backgroundColor = arrColors.pop();
              }
            }

            break;
          }

        case sequenceColor:
          {
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
    var result = {
      type: 'custom',
      sequenceId: -1,
      letterStyle: ''
    }; // check if row key is a number

    if (e.sequenceId === undefined || isNaN(+e.sequenceId)) {
      // wrong entity row key
      return -1;
    }

    result.sequenceId = +e.sequenceId; // transform target in CSS property

    if (e.color) {
      result.letterStyle = "color:".concat(e.color, ";");
    }

    if (e.backgroundColor) {
      result.letterStyle += "background-color:".concat(e.backgroundColor, ";");
    }

    if (e.backgroundImage) {
      result.letterStyle += "background-image: ".concat(e.backgroundImage, ";");
    } // define color or palette


    if (e.sequenceColor) {
      result.type = e.sequenceColor;
    }

    if (result.type.includes('binary')) {
      result.type = 'binary';
    } // reserving space for the transformed object (this.palette)
    // if color type not inserted yet


    if (!(result.type in ColorsModel.palette)) {
      ColorsModel.palette[result.type] = {};
    } // if row not inserted yet


    if (!(result.sequenceId in ColorsModel.palette[result.type])) {
      ColorsModel.palette[result.type][result.sequenceId] = {
        positions: [],
        chars: []
      };
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
      } else {
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
    var rgb = [255, 0, 0]; // 1536 colors in the rgb wheel

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
          tmp = ((value + 1) % 3 + 3) % 3;

          if (rgb[tmp] + remainder > 255) {
            remainder -= 255 - rgb[tmp];
            rgb[tmp] = 255;
            add = false;
            value = tmp;
          } else {
            rgb[tmp] += remainder;
            remainder = 0;
          }
        } else {
          tmp = ((value - 1) % 3 + 3) % 3;

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
  };

  return ColorsModel;
}();



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


var ConsensusModel =
/** @class */
function () {
  function ConsensusModel() {}

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
        } else {
          if (sequence.id === idPhysical) {
            continue;
          }
        }

        if (letter === '-' || !letter) {
          continue;
        }

        if (consensusColumn[letter]) {
          consensusColumn[letter] += 1;
        } else {
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
    } else {
      label = 'Consensus identity ' + threshold + '%';
    }

    var consensusSequence = '';

    var _loop_1 = function _loop_1(column) {
      var _a, _b, _c;

      var maxLetter = void 0;
      var maxIndex = void 0;

      if (Object.keys(consensus[column]).length === 0) {
        maxLetter = '.';
      } else {
        maxLetter = Object.keys(consensus[column]).reduce(function (a, b) {
          return consensus[column][a] > consensus[column][b] ? a : b;
        });
        maxIndex = consensus[column][maxLetter];
      }

      var backgroundColor = void 0;
      var color = void 0;
      var frequency = maxIndex / sequences.length * 100;

      if (type === 'physical') {
        // consensus id to see if I have all letters equals
        // equals letters have precedence over properties
        var maxLetterId = void 0;
        var maxIndexId = void 0;

        if (Object.keys(consensus[column]).length === 0) {
          maxLetterId = '.';
        } else {
          maxLetterId = Object.keys(consensus2[column]).reduce(function (a, b) {
            return consensus2[column][a] > consensus2[column][b] ? a : b;
          });
          maxIndexId = consensus2[column][maxLetterId];
        }

        var frequencyId = maxIndexId / sequences.length * 100;

        if (frequencyId >= threshold) {
          maxLetter = maxLetterId;
          _a = ConsensusModel.setColorsIdentity(frequencyId, palette, 'physical'), backgroundColor = _a[0], color = _a[1];
        } else {
          if (frequency >= threshold) {
            _b = ConsensusModel.setColorsPhysical(maxLetter, palette), backgroundColor = _b[0], color = _b[1];
          }
        }
      } else {
        _c = ConsensusModel.setColorsIdentity(frequency, palette, 'identity'), backgroundColor = _c[0], color = _c[1];
      }

      if (frequency < threshold) {
        maxLetter = '.';
      } // + 1 because residues start from 1 and not 0


      regions.push({
        start: +column + 1,
        end: +column + 1,
        sequenceId: id,
        backgroundColor: backgroundColor,
        color: color
      });
      consensusSequence += maxLetter;
    }; // tslint:disable-next-line:forin


    for (var column in consensus) {
      _loop_1(column);
    }

    sequences.push({
      id: id,
      sequence: consensusSequence,
      label: label
    });
    return [sequences, regions];
  };

  ConsensusModel.setColorsIdentity = function (frequency, palette, flag) {
    var backgroundColor;
    var color;
    var finalPalette;

    if (palette && typeof palette !== 'string' && flag == 'identity') {
      finalPalette = palette;
    } else {
      finalPalette = _palettes__WEBPACK_IMPORTED_MODULE_0__.Palettes.consensusLevelsIdentity;
    }

    var steps = [];

    for (var key in finalPalette) {
      steps.push(+key); // 42
    }

    steps = steps.sort(function (a, b) {
      return a < b ? 1 : a > b ? -1 : 0;
    });

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
    } else {
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
      sequences.sort(function (a, b) {
        return a.id - b.id;
      });
      var min = sequences[0];
      var palette = _palettes__WEBPACK_IMPORTED_MODULE_0__.Palettes.substitutionMatrixBlosum; // console.log(palette)

      if (options.sequenceColorMatrixPalette) {
        palette = options.sequenceColorMatrixPalette;
      }

      var key = void 0; // tslint:disable-next-line:prefer-for-of

      for (var i = 0; i < min.sequence.length; i++) {
        for (var _d = 0, sequences_4 = sequences; _d < sequences_4.length; _d++) {
          var sequence = sequences_4[_d];

          if (sequence.id === min.id) {
            key = sequence.sequence[i] + sequence.sequence[i];

            if (key in palette) {
              regions.push({
                sequenceId: sequence.id,
                start: i + 1,
                end: i + 1,
                backgroundColor: palette[key][0],
                color: palette[key][1]
              });
            }
          } else {
            // score with first sequence
            key = sequence.sequence[i] + min.sequence[i];

            if (key in palette) {
              regions.push({
                sequenceId: sequence.id,
                start: i + 1,
                end: i + 1,
                backgroundColor: palette[key][0]
              });
            } else if (palette[min.sequence[i] + sequence.sequence[i]]) {
              key = min.sequence[i] + sequence.sequence[i];
              regions.push({
                sequenceId: sequence.id,
                start: i + 1,
                end: i + 1,
                backgroundColor: palette[key][0],
                color: palette[key][1]
              });
            }
          }
        }
      }
    } else if (options.sequenceColor) {
      regions = [];

      for (var _e = 0, sequences_5 = sequences; _e < sequences_5.length; _e++) {
        var sequence = sequences_5[_e];
        sequence.sequenceColor = options.sequenceColor;
        regions.push({
          sequenceId: sequence.id,
          start: 1,
          end: sequence.sequence.length,
          sequenceColor: options.sequenceColor
        });
      }
    }

    var consensusInfoIdentity;
    var consensusInfoPhysical;

    if (options.consensusColorIdentity) {
      consensusInfoIdentity = ConsensusModel.setConsensusInfo('identity', sequences);
      _a = ConsensusModel.createConsensus('identity', consensusInfoIdentity, false, sequences, regions, options.dotThreshold, options.consensusColorIdentity), sequences = _a[0], regions = _a[1];
    } else if (options.consensusColorMapping) {
      consensusInfoPhysical = ConsensusModel.setConsensusInfo('physical', sequences);

      if (!consensusInfoIdentity) {
        consensusInfoIdentity = ConsensusModel.setConsensusInfo('identity', sequences);
      }

      _b = ConsensusModel.createConsensus('physical', consensusInfoPhysical, consensusInfoIdentity, sequences, regions, options.dotThreshold, options.consensusColorMapping), sequences = _b[0], regions = _b[1];
    }

    return [sequences, regions];
  };

  return ConsensusModel;
}();



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
var EventsModel =
/** @class */
function () {
  function EventsModel() {}

  EventsModel.prototype.onRegionSelected = function () {
    var sequenceViewers = document.getElementsByClassName('cell'); // @ts-ignore

    for (var _i = 0, sequenceViewers_1 = sequenceViewers; _i < sequenceViewers_1.length; _i++) {
      var sqv = sequenceViewers_1[_i];
      sqv.addEventListener('dblclick', function (r) {
        var evt = new CustomEvent('onRegionSelected', {
          detail: {
            "char": r.srcElement.innerHTML,
            x: r.srcElement.dataset.resX,
            y: r.srcElement.dataset.resY
          }
        });
        window.dispatchEvent(evt);
      });
    }
  };

  return EventsModel;
}();



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


var IconsModel =
/** @class */
function () {
  function IconsModel() {}

  IconsModel.prototype.process = function (regions, sequences, iconsPaths) {
    var rows = {};

    if (regions && sequences) {
      var _loop_1 = function _loop_1(seq) {
        for (var _a = 0, regions_1 = regions; _a < regions_1.length; _a++) {
          var reg = regions_1[_a];

          if (+seq.id === reg.sequenceId) {
            if (!rows[seq.id]) {
              rows[seq.id] = {};
            } // tslint:disable-next-line:forin


            for (var key in sequences.find(function (x) {
              return x.id === seq.id;
            }).sequence) {
              key = (+key + 1).toString(); // chars with icon

              if (+key >= reg.start && +key <= reg.end && reg.icon) {
                if (reg.icon) {
                  var region = reg.end - (reg.start - 1);
                  var center = Math.floor(region / 2);
                  var icon = void 0;

                  if (reg.color && reg.color[0] === '(') {
                    reg.color = 'rgb' + reg.color;
                  } // default icons


                  switch (reg.icon) {
                    case 'lollipop':
                      {
                        icon = _icons__WEBPACK_IMPORTED_MODULE_0__.Icons.lollipop;
                        break;
                      }

                    case 'arrowRight':
                      {
                        icon = _icons__WEBPACK_IMPORTED_MODULE_0__.Icons.arrowRight;
                        break;
                      }

                    case 'arrowLeft':
                      {
                        icon = _icons__WEBPACK_IMPORTED_MODULE_0__.Icons.arrowLeft;
                        break;
                      }

                    case 'strand':
                      {
                        icon = _icons__WEBPACK_IMPORTED_MODULE_0__.Icons.strand;
                        break;
                      }

                    case 'noSecondary':
                      {
                        icon = _icons__WEBPACK_IMPORTED_MODULE_0__.Icons.noSecondary;
                        break;
                      }

                    case 'helix':
                      {
                        icon = _icons__WEBPACK_IMPORTED_MODULE_0__.Icons.helix;
                        break;
                      }

                    case 'turn':
                      {
                        icon = _icons__WEBPACK_IMPORTED_MODULE_0__.Icons.turn;
                        break;
                      }

                    default:
                      {
                        // customizable icons (svg)
                        icon = reg.icon;
                        break;
                      }
                  }

                  if (reg.display === 'center' && +key === reg.start + center) {
                    rows[seq.id][key] = {
                      "char": icon
                    };
                  } else if (!reg.display) {
                    rows[seq.id][key] = {
                      "char": icon
                    };
                  }
                }
              } // chars without icon


              if (!rows[seq.id][key]) {
                rows[seq.id][key] = {
                  "char": ''
                };
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

    var filteredRows = {}; // tslint:disable-next-line:forin

    for (var row in rows) {
      var flag = void 0;
      var chars = rows[row];

      for (var _char in rows[row]) {
        if (rows[row][_char]["char"] !== '') {
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
}();



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
var Icons =
/** @class */
function () {
  function Icons() {}

  Icons.lollipop = '<svg xmlns="http://www.w3.org/2000/svg" width="0.7em" x="0" y="0" id="lollipop" viewBox="0 0 340.16 950.93"><path fill="rgb(255, 99, 71)" d="M311.465,141.232c0,78-63.231,141.232-141.232,141.232  c-78,0-141.232-63.232-141.232-141.232S92.232,0,170.232,0C248.233,0,311.465,63.232,311.465,141.232z M194,280.878h-47.983V566.93  H194V280.878z"/></svg>';
  Icons.arrowLeft = '<svg xmlns="http://www.w3.org/2000/svg" width="0.7em" id="Livello_1" x="0px" y="0px" viewBox="0 0 963.78 1587.4" enable-background="new 0 0 963.78 1587.4" xml:space="preserve"><rect style="fill:transparent" x="0.477" y="412.818" stroke="#000000" stroke-miterlimit="10" width="963.781" height="763.636"/><g><defs><rect width="964" height="1587"></rect></defs><clipPath><use overflow="visible"></use></clipPath><polygon style="fill:#FDDD0D;" fill-rule="evenodd" clip-rule="evenodd" points="1589.64,411.77 1589.64,1179.37    756.04,1179.37 756.04,1591.15 0,795.57 756.04,0 756.04,411.77  "> </polygon></g></svg>';
  Icons.arrowRight = '<svg xmlns="http://www.w3.org/2000/svg" width="0.7em" id="Layer_1" x="0px" y="0px" viewBox="0 0 964 1587" enable-background="new 0 0 964 1587" xml:space="preserve">  <image id="image0" width="964" height="1587" x="0" y="0" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA8QAAAYzCAMAAAAF3QTDAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABzlBMVEX//////fP+627+63H/ /Of//Ov93Q394zb//Oz95D7//fL95Uj//vb+51L//vn+6F7///z+6WL///3+62////7+7Xz+7oT+ 8JX93Q7+8qL93Q/+86j93hH+9LP93hT+9r793hf/98j93xn/+Mz93x7/+dT94CT/+tz94Sr/++P9 4jL//On+6F3+6WH+7Hv+7YL+8Zr+86f+9LL+9r3/98f/+Mv94i3//Ob94zX95D3//fH95Uf+51H+ 51b//vr+6m3+7Hr+7YH+8JT+8Zn+8qb+9LH93hX+9sH/+dP/++X+5lD+51X+7Hn+7YD+74r+8qX+ 9rz+9sD93xj/+Mr94CP/+tv94Sn94Sz95Dz95Ub+5kv+6WD+6mz+7X/+7on93RD+9LD93hL+9bX9 3x3/+dL94Cb/+t7/++T94jT//vX95kr+51T+6mv+7X7+7of+8Jj+8qT+9r//98n/+dH/+tr//Or9 5Dv//fD95D/+51P+6F/+7X3+7ob+8Jf+8qP+9K/+9LT94B//+dX94CX/+t394Sv94jP95Un+6mr+ 63D+8Jb93xz+74v93hP+7oj94zv+7oP//e/+7Hj95ED+7oX/+ND95UX+6WP+9K7+8qHSDgXQAAAA AWJLR0QAiAUdSAAAAAlwSFlzAAAAYAAAAGAA8GtCzwAAAAd0SU1FB+QMCgojI/oVfZQAAC+qSURB VHja7d13gx3FvedhLayaZGAAY4ZhEEKIJBAmr8jYgC7RgBAIESxAZIHJOQoQ0Qss19d3992uTVSY cM7prv5VeJ5XUF11Pv9J31mzpi7/47DDDjv8f0afApjZ2u5fjjgy+hjArH6MuDvq6OhzADP6KeLu mN9FHwSYzc8Rd8ceF30SYCa/RNwdPxd9FGAWv0bcnXBi9FmAGfwWcXfS76MPA0xvv4i7k6MPA0xv /4i7P0SfBpjaARF3p0QfB5jWgRHPnxp9HmBKB0bcLZwWfSBgOgdF3C2eHn0iYCoHR9ytOyP6SMA0 Dom4W39m9JmAKRwacbfhrOhDAZNbIuJu49nRpwImtlTE3TnnRh8LmNSSEXfnnR99LmBCS0fcbbog +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 RK5CYII="/></svg>';
  Icons.strand = '<svg xmlns="http://www.w3.org/2000/svg" width="0.7em" id="Livello_1" x="0px" y="0px" viewBox="0 0 963.78 1587.4" enable-background="new 0 0 963.78 1587.4" xml:space="preserve"><rect style="fill:#FDDD0D;" x="0.477" y="412.818" stroke="#000000" stroke-miterlimit="10" width="963.781" height="763.636"/></svg>';
  Icons.noSecondary = '<svg x="0px" y="0px" width="0.7em" viewBox="0 0 963.78 1587.4"><rect style="fill:#706F6F;" x="0.478" y="665.545" width="963.781" height="256.364"/></svg>';
  Icons.helix = '<svg xmlns="http://www.w3.org/2000/svg" width="0.7em" id="Livello_1" x="0px" y="0px" viewBox="0 0 963.78 1587.4" enable-background="new 0 0 963.78 1587.4" xml:space="preserve"><path d="M0,665.545"/><path style="fill:rgb(240,0,128);" d="M7,691c-2.825,59.659,8.435,116.653,6.962,176.309  c-2.126,86.119,8.999,168.953,21.967,253.74c7.673,50.17,16.183,100.271,27.762,149.706c17.538,74.873,35.635,148.402,81.801,211.35  c33.037,45.045,76.542,69.859,130.521,79.056c147.959,25.208,225.187-111.229,251.929-232.674  c20.553-93.348,26.027-188.996,35.963-283.827c12.16-116.095-9.854-249.139,51.535-354.533  c26.216-45.008,79.912-87.811,134.044-93.67c65.497-7.09,113.689,52.59,135.384,107.506  c25.648,64.927,33.322,141.579,70.184,201.528c17.244-16.261,10.323-70.57,9.487-95.14c-1.506-44.307,0.823-83.339-6.961-126.96  c-20.395-114.279-22.992-236.804-54.565-347.808C868.34,213.678,812.663-62.602,627.257,12.459  C479.538,72.264,448.893,277.771,431.147,417.19c-8.481,66.632-13.854,133.623-22.581,200.225  c-8.457,64.544-5.9,127.593-22.444,191.979c-17.752,69.089-55.739,176.947-129.987,202.952c-34.633,12.127-72.727,7.646-104-10.787  C39.193,934.987,55.326,786.128,7,681"/></svg>';
  Icons.turn = '<svg xmlns="http://www.w3.org/2000/svg" width="0.7em" id="Livello_1" x="0px" y="0px" viewBox="0 0 963.78 1587.4" enable-background="new 0 0 963.78 1587.4" xml:space="preserve"><path fill="#6080ff" stroke="#000000" stroke-width="5" stroke-miterlimit="10" d="M126.836,704.144c-42.996,28.54-85.103-4.688-123.541-28.17  c5.416,3.309-1.803,83.249-1.004,93.44c3.438,43.889,1.282,80.298,28.763,116.171c62.445,81.517,210.775,94.402,267.032-1.93  c50.939-87.229,46.263-186.556,53.467-283.387c6.11-82.125-1.584-146.41,76.221-194.253  c64.567-39.704,136.354-11.421,166.457,54.066c65.666,142.853-13.311,375.025,146.185,470.511  c45.838,27.442,108.556,20.483,155.013-1.621c21.723-10.336,50.014-27.858,60.433-50.822c11.735-25.869,2.965-60.306,3.787-87.663  c1.068-35.55,9.302-79.208-0.628-113.596c-20.617,10.903-33.832,30.3-59.142,38.896c-28.601,9.713-60.777,10.479-82.936-13.122  c-26.177-27.891-19.497-72.643-24.013-107.505c-7.986-61.664-8.833-124.334-14.748-186.227  C766.397,285.641,738.287,161.82,651.007,68.818C582.482-4.198,457.863-19.858,372.696,34.02  c-72.242,45.705-123.991,91.534-151.164,176.089c-29.781,92.673-38.773,200.285-38.475,297.867  c0.167,54.82-2.342,151.334-48.24,190.152C132.154,700.38,129.493,702.38,126.836,704.144z"/></svg>';
  return Icons;
}();



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
var OptionsModel =
/** @class */
function () {
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

      if (isNaN(fNum) || fUnit !== 'px' && fUnit !== 'vw' && fUnit !== 'em') {// wrong fontSize format
      } else {
        this.options.fontSize = fSize;
      }
    } else {
      // fontSize not set
      this.options.fontSize = '14px'; // default reset
    }
    /** check input chunkSize */


    if (opt && opt.chunkSize) {
      var cSize = +opt.chunkSize;

      if (isNaN(cSize) || cSize < 0) {// wrong chunkSize format
      } else {
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
        } else {
          this.options.sequenceColorMatrix = 'custom';
          this.options.sequenceColorMatrixPalette = opt.sequenceColor;
        }
      } else {
        if (opt.sequenceColor === "blosum62") {
          this.options.sequenceColorMatrix = opt.sequenceColor;
        } else if (opt.sequenceColor === "clustal") {
          this.options.sequenceColor = opt.sequenceColor;
        }
      }
    }
    /** check consensusType value */


    if (consensus && consensus.color) {
      if (typeof consensus.color !== 'string') {
        var keys = Object.keys(consensus.color);

        if (typeof keys[0] === 'string') {
          this.options.consensusColorIdentity = consensus.color;
        } else {
          this.options.consensusColorMapping = consensus.color;
        }
      } else {
        if (consensus.color === "identity") {
          this.options.consensusColorIdentity = consensus.color;
        } else if (consensus.color === "physical") {
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

      if (isNaN(rNum) || rUnit !== 'px' && rUnit !== 'vw' && rUnit !== 'em') {// wrong lineSeparation format
      } else {
        this.options.lineSeparation = rSize;
      }
    } else {
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

      if (isNaN(olNum) || olUnit !== 'px' && olUnit !== 'vw' && olUnit !== 'em') {// wrong oneLineWidth format
      } else {
        this.options.viewerWidth = viewerWidth;
      }
    }

    return this.options;
  };

  return OptionsModel;
}();



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
var Palettes =
/** @class */
function () {
  function Palettes() {} // AA propensities


  Palettes.clustal = {
    A: '#80a0f0',
    I: '#80a0f0',
    L: '#80a0f0',
    M: '#80a0f0',
    F: '#80a0f0',
    W: '#80a0f0',
    V: '#80a0f0',
    K: '#f01505',
    R: '#f01505',
    E: '#c048c0',
    D: '#c048c0',
    C: '#f08080',
    G: '#f09048',
    N: '#15c015',
    Q: '#15c015',
    S: '#15c015',
    T: '#15c015',
    P: '#c0c000',
    H: '#15a4a4',
    Y: '#15a4a4'
  };
  Palettes.zappo = {
    A: '#ffafaf',
    R: '#6464ff',
    N: '#00ff00',
    D: '#ff0000',
    C: '#ffff00',
    Q: '#00ff00',
    E: '#ff0000',
    G: '#ff00ff',
    H: '#6464ff',
    I: '#ffafaf',
    L: '#ffafaf',
    K: '#ffafaf',
    M: '#ffc800',
    F: '#ff00ff',
    P: '#00ff00',
    S: '#00ff00',
    T: '#15c015',
    W: '#ffc800',
    V: '#ffc800',
    Y: '#ffafaf'
  };
  Palettes.taylor = {
    A: '#ccff00',
    R: '#0000ff',
    N: '#cc00ff',
    D: '#ff0000',
    C: '#ffff00',
    Q: '#ff00cc',
    E: '#ff0066',
    G: '#ff9900',
    H: '#0066ff',
    I: '#66ff00',
    L: '#33ff00',
    K: '#6600ff',
    M: '#00ff00',
    F: '#00ff66',
    P: '#ffcc00',
    S: '#ff3300',
    T: '#ff6600',
    W: '#00ccff',
    V: '#00ffcc',
    Y: '#99ff00'
  };
  Palettes.hydrophobicity = {
    A: '#ad0052',
    R: '#0000ff',
    N: '#0c00f3',
    D: '#0c00f3',
    C: '#c2003d',
    Q: '#0c00f3',
    E: '#0c00f3',
    G: '#6a0095',
    H: '#1500ea',
    I: '#ff0000',
    L: '#ea0015',
    K: '#0000ff',
    M: '#b0004f',
    F: '#cb0034',
    P: '#4600b9',
    S: '#5e00a1',
    T: '#61009e',
    W: '#5b00a4',
    V: '#4f00b0',
    Y: '#f60009',
    B: '#0c00f3',
    X: '#680097',
    Z: '#0c00f3'
  };
  Palettes.helixpropensity = {
    A: '#e718e7',
    R: '#6f906f',
    N: '#1be41b',
    D: '#778877',
    C: '#23dc23',
    Q: '#926d92',
    E: '#ff00ff',
    G: '#00ff00',
    H: '#758a75',
    I: '#8a758a',
    L: '#ae51ae',
    K: '#a05fa0',
    M: '#ef10ef',
    F: '#986798',
    P: '#00ff00',
    S: '#36c936',
    T: '#47b847',
    W: '#8a758a',
    V: '#21de21',
    Y: '#857a85',
    B: '#49b649',
    X: '#758a75',
    Z: '#c936c9'
  };
  Palettes.strandpropensity = {
    A: '#5858a7',
    R: '#6b6b94',
    N: '#64649b',
    D: '#2121de',
    C: '#9d9d62',
    Q: '#8c8c73',
    E: '#0000ff',
    G: '#4949b6',
    H: '#60609f',
    I: '#ecec13',
    L: '#b2b24d',
    K: '#4747b8',
    M: '#82827d',
    F: '#c2c23d',
    P: '#2323dc',
    S: '#4949b6',
    T: '#9d9d62',
    W: '#c0c03f',
    V: '#d3d32c',
    Y: '#ffff00',
    B: '#4343bc',
    X: '#797986',
    Z: '#4747b8'
  };
  Palettes.turnpropensity = {
    A: '#2cd3d3',
    R: '#708f8f',
    N: '#ff0000',
    D: '#e81717',
    C: '#a85757',
    Q: '#3fc0c0',
    E: '#778888',
    G: '#ff0000',
    H: '#708f8f',
    I: '#00ffff',
    L: '#1ce3e3',
    K: '#7e8181',
    M: '#1ee1e1',
    F: '#1ee1e1',
    P: '#f60909',
    S: '#e11e1e',
    T: '#738c8c',
    W: '#738c8c',
    V: '#9d6262',
    Y: '#07f8f8',
    B: '#f30c0c',
    X: '#7c8383',
    Z: '#5ba4a4'
  };
  Palettes.buriedindex = {
    A: '#00a35c',
    R: '#00fc03',
    N: '#00eb14',
    D: '#00eb14',
    C: '#0000ff',
    Q: '#00f10e',
    E: '#00f10e',
    G: '#009d62',
    H: '#00d52a',
    I: '#0054ab',
    L: '#007b84',
    K: '#00ff00',
    M: '#009768',
    F: '#008778',
    P: '#00e01f',
    S: '#00d52a',
    T: '#00db24',
    W: '#00a857',
    V: '#00e619',
    Y: '#005fa0',
    B: '#00eb14',
    X: '#00b649',
    Z: '#00f10e'
  };
  Palettes.nucleotide = {
    A: '#64F73F',
    C: '#FFB340',
    G: '#EB413C',
    T: '#3C88EE',
    U: '#3C88EE'
  };
  Palettes.purinepyrimidine = {
    A: '#FF83FA',
    C: '#40E0D0',
    G: '#FF83FA',
    T: '#40E0D0',
    U: '#40E0D0',
    R: '#FF83FA',
    Y: '#40E0D0'
  };
  Palettes.consensusLevelsIdentity = {
    100: ['#0A0A0A', '#FFFFFF'],
    70: ['#333333', '#FFFFFF'],
    40: ['#707070', '#FFFFFF'],
    10: ['#A3A3A3', '#FFFFFF'],
    0: ['#FFFFFF', '#FFFFFF']
  }; // colour scheme in Lesk, Introduction to Bioinformatics

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
  Palettes.substitutionMatrixBlosum = {
    WF: ['#CFDBF2', '#000000'],
    QQ: ['#A1B8E3', '#000000'],
    HH: ['#7294D5', '#000000'],
    YY: ['#81A0D9', '#000000'],
    ZZ: ['#A1B8E3', '#000000'],
    CC: ['#6288D0', '#000000'],
    PP: ['#81A0D9', '#000000'],
    VI: ['#B0C4E8', '#000000'],
    VM: ['#CFDBF2', '#000000'],
    KK: ['#A1B8E3', '#000000'],
    ZK: ['#CFDBF2', '#000000'],
    DN: ['#CFDBF2', '#000000'],
    SS: ['#A1B8E3', '#000000'],
    QR: ['#CFDBF2', '#000000'],
    NN: ['#91ACDE', '#000000'],
    YF: ['#B0C4E8', '#000000'],
    VL: ['#CFDBF2', '#000000'],
    KR: ['#C0CFED', '#000000'],
    ED: ['#C0CFED', '#000000'],
    VV: ['#A1B8E3', '#000000'],
    MI: ['#CFDBF2', '#000000'],
    MM: ['#A1B8E3', '#000000'],
    ZD: ['#CFDBF2', '#000000'],
    FF: ['#91ACDE', '#000000'],
    BD: ['#A1B8E3', '#000000'],
    HN: ['#CFDBF2', '#000000'],
    TT: ['#A1B8E3', '#000000'],
    SN: ['#CFDBF2', '#000000'],
    LL: ['#A1B8E3', '#000000'],
    EQ: ['#C0CFED', '#000000'],
    YW: ['#C0CFED', '#000000'],
    EE: ['#A1B8E3', '#000000'],
    KQ: ['#CFDBF2', '#000000'],
    WW: ['#3867BC', '#000000'],
    ML: ['#C0CFED', '#000000'],
    KE: ['#CFDBF2', '#000000'],
    ZE: ['#A1B8E3', '#000000'],
    ZQ: ['#B0C4E8', '#000000'],
    BE: ['#CFDBF2', '#000000'],
    DD: ['#91ACDE', '#000000'],
    SA: ['#CFDBF2', '#000000'],
    YH: ['#C0CFED', '#000000'],
    GG: ['#91ACDE', '#000000'],
    AA: ['#A1B8E3', '#000000'],
    II: ['#A1B8E3', '#000000'],
    TS: ['#CFDBF2', '#000000'],
    RR: ['#A1B8E3', '#000000'],
    LI: ['#C0CFED', '#000000'],
    ZB: ['#CFDBF2', '#000000'],
    BN: ['#B0C4E8', '#000000'],
    BB: ['#A1B8E3', '#000000']
  };
  return Palettes;
}();



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
var PatternsModel =
/** @class */
function () {
  function PatternsModel() {} // find index of matched regex positions and create array of regions with color


  PatternsModel.prototype.process = function (patterns, sequences) {
    if (!patterns) {
      return;
    }

    var regions = []; // OutPatterns

    var _loop_1 = function _loop_1(element) {
      // tslint:disable-next-line:no-conditional-assignment
      var pattern = element.pattern;
      var str = void 0;

      if (sequences.find(function (x) {
        return x.id === element.sequenceId;
      })) {
        str = sequences.find(function (x) {
          return x.id === element.sequenceId;
        }).sequence;

        if (element.start && element.end) {
          str = str.substr(element.start - 1, element.end - (element.start - 1));
        }

        this_1.regexMatch(str, pattern, regions, element);
      } else {
        for (var _a = 0, sequences_1 = sequences; _a < sequences_1.length; _a++) {
          var seq = sequences_1[_a]; // regex

          if (element.start && element.end) {
            str = seq.sequence.substr(element.start - 1, element.end - (element.start - 1));
          }

          this_1.regexMatch(str, pattern, regions, element);
        }
      }
    };

    var this_1 = this; // @ts-ignore

    for (var _i = 0, patterns_1 = patterns; _i < patterns_1.length; _i++) {
      var element = patterns_1[_i];

      _loop_1(element);
    }

    return regions;
  };

  PatternsModel.prototype.regexMatch = function (str, pattern, regions, element) {
    var re = new RegExp(pattern, "g");
    var match; // tslint:disable-next-line:no-conditional-assignment

    while ((match = re.exec(str)) != null) {
      regions.push({
        start: +match.index + 1,
        end: +match.index + +match[0].length,
        backgroundColor: element.backgroundColor,
        color: element.color,
        backgroundImage: element.backgroundImage,
        borderColor: element.borderColor,
        borderStyle: element.borderStyle,
        sequenceId: element.sequenceId
      });
    }
  };

  return PatternsModel;
}();



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



var RowsModel =
/** @class */
function () {
  function RowsModel() {
    this.substitutiveId = 99999999999999;
  }

  RowsModel.prototype.processRows = function (rows, icons, regions, opt) {
    var allData = []; // decide which color is more important in case of overwriting

    var coloringOrder = ['custom', 'clustal', 'zappo', 'gradient', 'binary']; // order row Numbers

    var rowNumsOrdered = Object.keys(rows).map(Number).sort(function (n1, n2) {
      return n1 - n2;
    }); // order keys of Row object

    var ordered = {};

    for (var _i = 0, rowNumsOrdered_1 = rowNumsOrdered; _i < rowNumsOrdered_1.length; _i++) {
      var rowNum = rowNumsOrdered_1[_i];
      ordered[rowNum] = Object.keys(rows[+rowNum]).map(Number).sort(function (n1, n2) {
        return n1 - n2;
      });
    }

    var data;
    var coloringRowNums;
    var tmp; // loop through data rows

    for (var _a = 0, rowNumsOrdered_2 = rowNumsOrdered; _a < rowNumsOrdered_2.length; _a++) {
      var rowNum = rowNumsOrdered_2[_a];
      tmp = ordered[rowNum]; // data key: indexes, value: chars

      data = rows[rowNum]; // data[rowNum].label = this.rows.getLabel(rowNum, this.sequences);
      // console.log(data)

      if (regions) {
        for (var _b = 0, _c = coloringOrder.reverse(); _b < _c.length; _b++) {
          var coloring = _c[_b];
          coloringRowNums = _colors_model__WEBPACK_IMPORTED_MODULE_1__.ColorsModel.getRowsList(coloring).map(Number); // if there is coloring for the data row

          if (coloringRowNums.indexOf(rowNum) < 0) {
            // go to next coloring
            continue;
          }

          var positions = _colors_model__WEBPACK_IMPORTED_MODULE_1__.ColorsModel.getPositions(coloring, rowNum); // positions = start, end, target (bgcolor || fgcolor)

          if (positions.length > 0) {
            for (var _d = 0, positions_1 = positions; _d < positions_1.length; _d++) {
              var e = positions_1[_d];

              for (var i = e.start; i <= e.end; i++) {
                if (!data[i]) {
                  continue;
                }

                if (e.backgroundColor && !e.backgroundColor.startsWith('#')) {
                  // is a palette
                  if (e.backgroundColor == 'custom') {
                    data[i].backgroundColor = opt.customPalette[data[i]["char"]];
                  } else {
                    data[i].backgroundColor = _palettes__WEBPACK_IMPORTED_MODULE_0__.Palettes[e.backgroundColor][data[i]["char"]]; // e.backgroundcolor = zappo, clustal..
                  }
                } else {
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
    } // keep previous data


    if (!sequences) {
      return;
    } // reset data


    var rows = {}; // check if there are undefined or duplicate ids and prepare to reset them

    var values = [];
    var undefinedValues = 0;

    for (var _a = 0, _b = Object.keys(sequences); _a < _b.length; _a++) {
      var r = _b[_a];

      if (isNaN(+sequences[r].id)) {
        // missing id
        undefinedValues += 1;
        sequences[r].id = this.substitutiveId;
        this.substitutiveId -= 1; // otherwise just reset missing ids and log the resetted id
      } else {
        if (values.includes(+sequences[r].id)) {
          // Duplicate sequence id
          delete sequences[r];
        } else {
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
      } else {
        id = sequences[row].id;
      }
      /** set row chars */


      rows[id] = {};

      for (var _e = 0, _f = Object.keys(sequences[row].sequence); _e < _f.length; _e++) {
        var idx = _f[_e];
        var idxKey = (+idx + 1).toString();
        var _char = sequences[row].sequence[idx];
        rows[id][idxKey] = {
          "char": _char
        };
      }
    }

    return this.processRows(rows, icons, regions, opt);
  };

  return RowsModel;
}();



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
var SelectionModel =
/** @class */
function () {
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
    } else {
      // firefox support
      element = e.originalTarget;
      id = document.getElementById(element.dataset.resId);
    }

    this.lastId = element.dataset.resId;
    this.lastSqv = id;
    this.start = {
      y: element.dataset.resY,
      x: element.dataset.resX,
      sqvId: element.dataset.resId
    };
    this.lastOver = {
      y: element.dataset.resY,
      x: element.dataset.resX,
      sqvId: element.dataset.resId
    };
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
      var lastY = Math.max(+this.start.y, +this.lastOver.y); // on every drag reselect the whole area ...

      if (x >= +firstX && x <= +lastX && y >= +firstY && y <= +lastY && selection.getAttribute('data-res-id') === this.lastOver.sqvId) {
        selection.classList.add('highlight');
      } else {
        selection.classList.remove('highlight');
      }
    }
  };

  SelectionModel.prototype.process = function () {
    var _this = this;

    var sequenceViewers = document.getElementsByClassName('cell'); // remove selection on new click

    window.onmousedown = function (event) {
      _this.event_sequence.push(0); // @ts-ignore


      for (var _i = 0, sequenceViewers_2 = sequenceViewers; _i < sequenceViewers_2.length; _i++) {
        var sqv = sequenceViewers_2[_i];

        sqv.onmousedown = function (e) {
          _this.set_start(e);
        };
      }

      if (_this.event_sequence[0] == 0 && _this.event_sequence[1] == 1 && _this.event_sequence[2] == 2 && _this.event_sequence[0] == 0) {
        // left click
        var elements = document.querySelectorAll('[data-res-id=' + _this.lastId + ']'); // @ts-ignore

        for (var _a = 0, elements_2 = elements; _a < elements_2.length; _a++) {
          var selection = elements_2[_a];
          selection.classList.remove('highlight');
        }
      } // if first click outside sqvDiv (first if is valid in Chrome, second in firefox)


      if (!event.target.dataset.resX) {
        _this.firstOver = true;
      }

      if (event.explicitOriginalTarget && event.explicitOriginalTarget.dataset) {
        _this.firstOver = true;
      }

      _this.event_sequence = [0];
    }; // @ts-ignore


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
        } else {
          element = e.originalTarget;
        }

        if (_this.start) {
          _this.lastOver = {
            y: element.dataset.resY,
            x: element.dataset.resX,
            sqvId: element.dataset.resId
          };
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
        var elements = document.querySelectorAll('[data-res-id=' + _this.lastId + ']'); // @ts-ignore

        for (var _i = 0, elements_3 = elements; _i < elements_3.length; _i++) {
          var selection = elements_3[_i];
          selection.classList.remove('highlight');
        }
      }
    };

    document.body.addEventListener('keydown', function (e) {
      var elements = document.querySelectorAll('[data-res-id=' + _this.lastId + ']'); // @ts-ignore

      e = e || window.event;
      var key = e.which || e.keyCode; // keyCode detection

      var ctrl = e.ctrlKey ? e.ctrlKey : key === 17; // ctrl detection

      if (key === 67 && ctrl) {
        var textToPaste = '';
        var textDict = {};
        var row = ''; // tslint:disable-next-line:forin
        // @ts-ignore

        for (var _i = 0, elements_4 = elements; _i < elements_4.length; _i++) {
          var selection = elements_4[_i];

          if (selection.classList.contains('highlight')) {
            if (!textDict[selection.getAttribute('data-res-y')]) {
              textDict[selection.getAttribute('data-res-y')] = '';
            } // new line when new row


            if (selection.getAttribute('data-res-y') !== row && row !== '') {
              textDict[selection.getAttribute('data-res-y')] += selection.innerText;
            } else {
              textDict[selection.getAttribute('data-res-y')] += selection.innerText;
            }

            row = selection.getAttribute('data-res-y');
          }
        }

        var flag = void 0;

        for (var textRow in textDict) {
          if (flag) {
            textToPaste += '\n' + textDict[textRow];
          } else {
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
          var evt = new CustomEvent('onHighlightSelection', {
            detail: {
              text: textToPaste,
              eventType: 'highlight selection'
            }
          });
          window.dispatchEvent(evt);
        }
      }
    }, false);
  };

  return SelectionModel;
}();



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
var SequenceInfoModel =
/** @class */
function () {
  function SequenceInfoModel() {
    this.isHTML = function (str) {
      var fragment = document.createRange().createContextualFragment(str); // remove all non text nodes from fragment

      fragment.querySelectorAll('*').forEach(function (el) {
        return el.parentNode.removeChild(el);
      }); // if there is textContent, then not a pure HTML

      return !(fragment.textContent || '').trim();
    };
  }

  SequenceInfoModel.prototype.process = function (regions, sequences) {
    var labels = [];
    var startIndexes = [];
    var tooltips = [];
    var flag;
    sequences.sort(function (a, b) {
      return a.id - b.id;
    });

    for (var _i = 0, sequences_1 = sequences; _i < sequences_1.length; _i++) {
      var seq = sequences_1[_i];

      if (!seq) {
        continue;
      }

      if (seq.startIndex) {
        startIndexes.push(seq.startIndex);
      } else {
        startIndexes.push(1);
      }

      if (seq.labelTooltip) {
        tooltips.push(seq.labelTooltip);
      } else {
        tooltips.push('<span></span>');
      }

      if (seq.label && !this.isHTML(seq.label)) {
        labels.push(seq.label);
        flag = true; // to check if I have at least one label
      } else {
        labels.push('');
      }
    }

    return [labels, startIndexes, tooltips, flag];
  };

  return SequenceInfoModel;
}();



/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[3]!./src/styles.scss":
/*!*********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[3]!./src/styles.scss ***!
  \*********************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".root {\n  font-family: monospace, monospace; }\n\n.container {\n  margin-left: 0; }\n\n.cnk {\n  position: relative;\n  white-space: nowrap;\n  display: inline-block;\n  vertical-align: top; }\n\n.idx {\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -webkit-user-select: none;\n  -webkit-touch-callout: none; }\n\n.hidden {\n  display: none; }\n\n.lblContainer {\n  direction: rtl; }\n\n.lbl-hidden {\n  padding-left: 2px;\n  padding-right: 5px;\n  -webkit-user-select: none;\n  display: block;\n  height: 1em;\n  line-height: 1em;\n  margin-bottom: 1.5em;\n  font-style: italic;\n  justify-content: flex-end;\n  flex-direction: column; }\n\n.lbl {\n  font-size: 1em; }\n\n.cell {\n  margin-bottom: 1.5em;\n  height: 1em;\n  display: inline-block; }\n\n.highlight {\n  background-color: #EBD270 !important; }\n\n/* 'card' name is not available because used by bootstrap */\n.crd {\n  position: relative;\n  display: inline-block; }\n\n.crds {\n  display: inline-block;\n  -webkit-user-select: none; }\n", "",{"version":3,"sources":["webpack://./src/styles.scss"],"names":[],"mappings":"AAAA;EACE,iCAAiC,EAAA;;AAGnC;EACE,cAAc,EAAA;;AAGhB;EACE,kBAAkB;EAClB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB,EAAA;;AAGrB;EACE,kBAAkB;EAClB,qBAAqB;EACrB,mBAAmB;EACnB,sBAAsB;EACtB,qBAAqB;EACrB,yBAAyB;EACzB,2BAA2B,EAAA;;AAG7B;EACE,aAAa,EAAA;;AAGf;EACE,cAAc,EAAA;;AAGhB;EACE,iBAAiB;EACjB,kBAAkB;EAClB,yBAAyB;EACzB,cAAa;EACb,WAAU;EACV,gBAAe;EACf,oBAAoB;EACpB,kBAAkB;EAClB,yBAAyB;EACzB,sBAAsB,EAAA;;AAGxB;EACE,cAAc,EAAA;;AAGhB;EACE,oBAAoB;EACpB,WAAW;EACX,qBAAqB,EAAA;;AAGvB;EACE,oCAAmC,EAAA;;AAGrC,2DAAA;AACA;EACE,kBAAkB;EAClB,qBAAqB,EAAA;;AAGvB;EACE,qBAAqB;EACrB,yBAAyB,EAAA","sourcesContent":[".root{\n  font-family: monospace, monospace;\n}\n\n.container {\n  margin-left: 0;\n}\n\n.cnk {\n  position: relative;\n  white-space: nowrap;\n  display: inline-block;\n  vertical-align: top;\n}\n\n.idx {\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -webkit-user-select: none;\n  -webkit-touch-callout: none;\n}\n\n.hidden {\n  display: none;\n}\n\n.lblContainer {\n  direction: rtl;\n}\n\n.lbl-hidden {\n  padding-left: 2px;\n  padding-right: 5px;\n  -webkit-user-select: none;\n  display:block;\n  height:1em;\n  line-height:1em;\n  margin-bottom: 1.5em;\n  font-style: italic;\n  justify-content: flex-end;\n  flex-direction: column;\n}\n\n.lbl {\n  font-size: 1em;\n}\n\n.cell{\n  margin-bottom: 1.5em;\n  height: 1em;\n  display: inline-block;\n}\n\n.highlight {\n  background-color: #EBD270!important;;\n}\n\n/* 'card' name is not available because used by bootstrap */\n.crd {\n  position: relative;\n  display: inline-block;\n}\n\n.crds {\n  display: inline-block;\n  -webkit-user-select: none;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./src/styles.scss":
/*!*************************!*\
  !*** ./src/styles.scss ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_3_styles_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../node_modules/resolve-url-loader/index.js!../node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[3]!./styles.scss */ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[3]!./src/styles.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_3_styles_scss__WEBPACK_IMPORTED_MODULE_6__.default, options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_3_styles_scss__WEBPACK_IMPORTED_MODULE_6__.default && _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_3_styles_scss__WEBPACK_IMPORTED_MODULE_6__.default.locals ? _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_3_styles_scss__WEBPACK_IMPORTED_MODULE_6__.default.locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

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
/******/ 			id: moduleId,
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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/*!*****************************!*\
  !*** ./src/proseqviewer.ts ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_options_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/options.model */ "./src/lib/options.model.ts");
/* harmony import */ var _lib_rows_model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/rows.model */ "./src/lib/rows.model.ts");
/* harmony import */ var _lib_colors_model__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/colors.model */ "./src/lib/colors.model.ts");
/* harmony import */ var _lib_selection_model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/selection.model */ "./src/lib/selection.model.ts");
/* harmony import */ var _lib_icons_model__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/icons.model */ "./src/lib/icons.model.ts");
/* harmony import */ var _lib_sequenceInfoModel__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lib/sequenceInfoModel */ "./src/lib/sequenceInfoModel.ts");
/* harmony import */ var _lib_events_model__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./lib/events.model */ "./src/lib/events.model.ts");
/* harmony import */ var _lib_patterns_model__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./lib/patterns.model */ "./src/lib/patterns.model.ts");
/* harmony import */ var _lib_consensus_model__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./lib/consensus.model */ "./src/lib/consensus.model.ts");
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./styles.scss */ "./src/styles.scss");








 // Add custom style

 // Export the actual ProSeqViewer constructor

var ProSeqViewer =
/** @class */
function () {
  function ProSeqViewer(divId) {
    var _this = this;

    this.divId = divId;
    this.init = false;
    this.params = new _lib_options_model__WEBPACK_IMPORTED_MODULE_0__.OptionsModel();
    this.rows = new _lib_rows_model__WEBPACK_IMPORTED_MODULE_1__.RowsModel();
    this.consensus = new _lib_consensus_model__WEBPACK_IMPORTED_MODULE_8__.ConsensusModel();
    this.regions = new _lib_colors_model__WEBPACK_IMPORTED_MODULE_2__.ColorsModel();
    this.patterns = new _lib_patterns_model__WEBPACK_IMPORTED_MODULE_7__.PatternsModel();
    this.icons = new _lib_icons_model__WEBPACK_IMPORTED_MODULE_4__.IconsModel();
    this.labels = new _lib_sequenceInfoModel__WEBPACK_IMPORTED_MODULE_5__.SequenceInfoModel();
    this.selection = new _lib_selection_model__WEBPACK_IMPORTED_MODULE_3__.SelectionModel();
    this.events = new _lib_events_model__WEBPACK_IMPORTED_MODULE_6__.EventsModel();

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
          if (seqNum[res]["char"] && seqNum[res]["char"].includes('svg')) {
            flag = true;
            break;
          }
        }

        if (flag) {
          noGapsLabels[seqN] = '';

          if (idx) {
            // line with only icons, no need for index
            labelshtml += "<span class=\"lbl-hidden\" style=\"margin-bottom:".concat(lineSeparation, "\"><span class=\"lbl\"> ").concat(noGapsLabels[seqN], "</span></span>");
          } else {
            labelshtml += "<span class=\"lbl-hidden\" style=\"margin-bottom:".concat(lineSeparation, "\"><span class=\"lbl\"></span></span>");
          }
        } else {
          count += 1;

          if (idx) {
            if (!chunkSize) {
              // lateral index regular
              labelshtml += "<span class=\"lbl-hidden\" style=\"width: ".concat(fontSize, ";margin-bottom:").concat(lineSeparation, "\">\n                            <span class=\"lbl\" >").concat(startIndexes[count] - 1 + idx, "</span></span>");
            } else {
              var noGaps = 0;

              for (var res in seqNum) {
                if (+res <= idx && seqNum[res]["char"] !== '-') {
                  noGaps += 1;
                }
              } // lateral index gap


              noGapsLabels[seqN] = noGaps;
              labelshtml += "<span class=\"lbl-hidden\" style=\"width:  ".concat(fontSize, ";margin-bottom:").concat(lineSeparation, "\">\n                            <span class=\"lbl\" >").concat(startIndexes[count] - 1 + noGapsLabels[seqN], "</span></span>");
            }
          } else {
            labelshtml += "<span class=\"lbl-hidden\" style=\"margin-bottom:".concat(lineSeparation, "\"><span class=\"lbl\">").concat(labels[count]).concat(tooltips[count], "</span></span>");
          }
        }

        flag = false;
      }

      if (indexesLocation == 'lateral' || 'both') {
        labelsContainer = "<span class=\"lblContainer\" style=\"display: inline-block\">".concat(labelshtml, "</span>");
      } else {
        // add margin in case we only have labels and no indexes
        labelsContainer = "<span class=\"lblContainer\" style=\"margin-right:10px;display: inline-block\">".concat(labelshtml, "</span>");
      }
    }

    return labelsContainer;
  };

  ProSeqViewer.prototype.addTopIndexes = function (chunkSize, x, maxTop, rowMarginBottom) {
    var cells = ''; // adding top indexes

    var chunkTopIndex;

    if (x % chunkSize === 0 && x <= maxTop) {
      chunkTopIndex = "<span class=\"cell\" style=\"-webkit-user-select: none;direction: rtl;display:block;width:0.6em;margin-bottom:".concat(rowMarginBottom, "\">").concat(x, "</span>");
    } else {
      chunkTopIndex = "<span class=\"cell\" style=\"-webkit-user-select: none;display:block;visibility: hidden;margin-bottom:".concat(rowMarginBottom, "\">0</span>");
    }

    cells += chunkTopIndex;
    return cells;
  };

  ProSeqViewer.prototype.createGUI = function (data, labels, startIndexes, tooltips, options, labelsFlag) {
    var sqvBody = document.getElementById(this.divId); // convert to nodes to improve rendering (idea to try):
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
    var fUnit = fontSize.substr(fontSize.length - 2, 2); // maxIdx = length of the longest sequence

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
    var indexWidth = (fNum * lenghtIndex).toString() + fUnit; // consider the last chunk even if is not long enough

    if (chunkSize > 0) {
      maxIdx += (chunkSize - maxIdx % chunkSize) % chunkSize;
    } // generate labels


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
        } else {
          if (entity.target) {
            style += "".concat(entity.target);
          }

          if (entity["char"] && !entity["char"].includes('svg')) {
            // y is the row, x is the column
            cell = "<span class=\"cell\" data-res-x='".concat(x, "' data-res-y= '").concat(y, "' data-res-id= '").concat(this.divId, "'\n                    style=\"").concat(style, "\">").concat(entity["char"], "</span>");
          } else {
            style += '-webkit-user-select: none;';
            cell = "<span style=\"".concat(style, "\">").concat(entity["char"], "</span>");
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

          idx = idxNum - (chunkSize - 1); // adding labels

          var gapsContainer = this.generateLabels(idx, labels, startIndexes, indexesLocation, chunkSize, indexWidth, false, data, lineSeparation);

          if (labels[0] === '') {
            index = gapsContainer; // lateral number indexes
          } else {
            index = labelsContainer + gapsContainer; // lateral number indexes + labels
          }

          if (!labelsFlag) {
            index = gapsContainer; // lateral number indexes
          } else {
            index = labelsContainer + gapsContainer; // lateral number indexes + labels
          }
        } else {
          index = labelsContainer; // top
        }

        index = "<div class=\"idx hidden\">".concat(index, "</div>");
        style = "font-size: ".concat(fontSize, ";");

        if (x !== maxIdx) {
          style += 'padding-right: ' + chunkSeparation + 'em;';
        } else {
          style += 'margin-right: ' + chunkSeparation + 'em;';
        }

        var chunk = '';

        if (labelsFlag || options.consensusType || indexesLocation == 'both' || indexesLocation == 'lateral') {
          // both
          chunk = "<div class=\"cnk\" style=\"".concat(style, "\">").concat(index, "<div class=\"crds\">").concat(cards, "</div></div>");
        } else {
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
    } else {
      innerHTML = "<div class=\"root\" style=\"display: flex\">\n                        <div style=\"display:inline-block;overflow-x:scroll;white-space: nowrap;width:".concat(viewerWidth, "\"> ").concat(html, "</div>\n                        </div>");
    }

    sqvBody.innerHTML = innerHTML;
    window.dispatchEvent(new Event('resize'));
  };

  ProSeqViewer.sqvList = [];
  return ProSeqViewer;
}();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProSeqViewer);
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Qcm9TZXFWaWV3ZXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL1Byb1NlcVZpZXdlci8uL3NyYy9saWIvY29sb3JzLm1vZGVsLnRzIiwid2VicGFjazovL1Byb1NlcVZpZXdlci8uL3NyYy9saWIvY29uc2Vuc3VzLm1vZGVsLnRzIiwid2VicGFjazovL1Byb1NlcVZpZXdlci8uL3NyYy9saWIvZXZlbnRzLm1vZGVsLnRzIiwid2VicGFjazovL1Byb1NlcVZpZXdlci8uL3NyYy9saWIvaWNvbnMubW9kZWwudHMiLCJ3ZWJwYWNrOi8vUHJvU2VxVmlld2VyLy4vc3JjL2xpYi9pY29ucy50cyIsIndlYnBhY2s6Ly9Qcm9TZXFWaWV3ZXIvLi9zcmMvbGliL29wdGlvbnMubW9kZWwudHMiLCJ3ZWJwYWNrOi8vUHJvU2VxVmlld2VyLy4vc3JjL2xpYi9wYWxldHRlcy50cyIsIndlYnBhY2s6Ly9Qcm9TZXFWaWV3ZXIvLi9zcmMvbGliL3BhdHRlcm5zLm1vZGVsLnRzIiwid2VicGFjazovL1Byb1NlcVZpZXdlci8uL3NyYy9saWIvcm93cy5tb2RlbC50cyIsIndlYnBhY2s6Ly9Qcm9TZXFWaWV3ZXIvLi9zcmMvbGliL3NlbGVjdGlvbi5tb2RlbC50cyIsIndlYnBhY2s6Ly9Qcm9TZXFWaWV3ZXIvLi9zcmMvbGliL3NlcXVlbmNlSW5mb01vZGVsLnRzIiwid2VicGFjazovL1Byb1NlcVZpZXdlci8uL3NyYy9zdHlsZXMuc2NzcyIsIndlYnBhY2s6Ly9Qcm9TZXFWaWV3ZXIvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL1Byb1NlcVZpZXdlci8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL1Byb1NlcVZpZXdlci8uL3NyYy9zdHlsZXMuc2Nzcz81ZTk1Iiwid2VicGFjazovL1Byb1NlcVZpZXdlci8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9Qcm9TZXFWaWV3ZXIvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL1Byb1NlcVZpZXdlci8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9Qcm9TZXFWaWV3ZXIvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vUHJvU2VxVmlld2VyLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vUHJvU2VxVmlld2VyLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vUHJvU2VxVmlld2VyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1Byb1NlcVZpZXdlci93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9Qcm9TZXFWaWV3ZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL1Byb1NlcVZpZXdlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL1Byb1NlcVZpZXdlci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL1Byb1NlcVZpZXdlci8uL3NyYy9wcm9zZXF2aWV3ZXIudHMiXSwibmFtZXMiOlsiQ29sb3JzTW9kZWwiLCJnZXRSb3dzTGlzdCIsImNvbG9yaW5nIiwib3V0Q29sIiwicGFsZXR0ZSIsIk9iamVjdCIsImtleXMiLCJnZXRQb3NpdGlvbnMiLCJyb3dOdW0iLCJwb3NpdGlvbnMiLCJwcm90b3R5cGUiLCJwcm9jZXNzIiwiYWxsSW5wdXRzIiwicmVnaW9ucyIsIm9wdGlvbnMiLCJzZXF1ZW5jZUNvbG9yIiwic2VxdWVuY2VDb2xvclJlZ2lvbnMiLCJfaSIsIl9hIiwic2VxdWVuY2VzIiwibGVuZ3RoIiwic2VxdWVuY2UiLCJwdXNoIiwic2VxdWVuY2VJZCIsImlkIiwic3RhcnQiLCJlbmQiLCJfYiIsIl9jIiwicmVnIiwiYmFja2dyb3VuZENvbG9yIiwiYWxsUmVnaW9ucyIsIkFycmF5IiwiY29uY2F0IiwiaWNvbnMiLCJwYXR0ZXJucyIsIm5ld1JlZ2lvbnMiLCJmaXhNaXNzaW5nSWRzIiwidHJhbnNmb3JtSW5wdXQiLCJ0cmFuc2Zvcm1Db2xvcnMiLCJnbG9iYWxDb2xvciIsImluZm8iLCJzZXF1ZW5jZXNfMSIsInNlcSIsInNldFNlcXVlbmNlQ29sb3IiLCJfbG9vcF8xIiwiaWNvbiIsImZpbmQiLCJ4IiwidGhpc18xIiwicHJvY2Vzc0NvbG9yIiwidHlwZSIsInRhcmdldCIsImxldHRlclN0eWxlIiwiaW5jbHVkZXMiLCJiaW5hcnlDb2xvcnMiLCJnZXRCaW5hcnlDb2xvcnMiLCJuZXdSZWdpb25zXzEiLCJfbG9vcF8yIiwic2VxdWVuY2VzXzIiLCJuZXdSZWciLCJrZXkiLCJyZWdpb25zXzEiLCJvcHQiLCJhcnJDb2xvcnMiLCJuIiwiYyIsInJvdyIsImNoYXJzIiwiZ3JhZGllbnQiLCJzb3J0IiwiYSIsImIiLCJlIiwicG9wIiwiYmluYXJ5IiwiX2QiLCJfZSIsInBvcyIsInJlc3VsdCIsInVuZGVmaW5lZCIsImlzTmFOIiwiY29sb3IiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJldmVubHlTcGFjZWRDb2xvcnMiLCJjb2xvcjEiLCJjb2xvcjIiLCJmbGFnIiwicmdiIiwiZGVsdGEiLCJNYXRoIiwiZmxvb3IiLCJyZW1haW5kZXIiLCJhZGQiLCJ2YWx1ZSIsInRtcCIsImNvbG9ycyIsImkiLCJDb25zZW5zdXNNb2RlbCIsInNldENvbnNlbnN1c0luZm8iLCJpZElkZW50aXR5IiwiaWRQaHlzaWNhbCIsImNvbnNlbnN1c0luZm8iLCJjb25zZW5zdXNDb2x1bW4iLCJsZXR0ZXIiLCJQYWxldHRlcyIsImNyZWF0ZUNvbnNlbnN1cyIsImNvbnNlbnN1cyIsImNvbnNlbnN1czIiLCJ0aHJlc2hvbGQiLCJsYWJlbCIsImNvbnNlbnN1c1NlcXVlbmNlIiwiY29sdW1uIiwibWF4TGV0dGVyIiwibWF4SW5kZXgiLCJyZWR1Y2UiLCJmcmVxdWVuY3kiLCJtYXhMZXR0ZXJJZCIsIm1heEluZGV4SWQiLCJmcmVxdWVuY3lJZCIsInNldENvbG9yc0lkZW50aXR5Iiwic2V0Q29sb3JzUGh5c2ljYWwiLCJmaW5hbFBhbGV0dGUiLCJzdGVwcyIsInN0ZXBzXzEiLCJzdGVwIiwiZWwiLCJtYXhJZHgiLCJzZXF1ZW5jZXNfMyIsImRpZmYiLCJzZXF1ZW5jZUNvbG9yTWF0cml4IiwibWluIiwic2VxdWVuY2VDb2xvck1hdHJpeFBhbGV0dGUiLCJzZXF1ZW5jZXNfNCIsInNlcXVlbmNlc181IiwiY29uc2Vuc3VzSW5mb0lkZW50aXR5IiwiY29uc2Vuc3VzSW5mb1BoeXNpY2FsIiwiY29uc2Vuc3VzQ29sb3JJZGVudGl0eSIsImRvdFRocmVzaG9sZCIsImNvbnNlbnN1c0NvbG9yTWFwcGluZyIsIkV2ZW50c01vZGVsIiwib25SZWdpb25TZWxlY3RlZCIsInNlcXVlbmNlVmlld2VycyIsImRvY3VtZW50IiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsInNlcXVlbmNlVmlld2Vyc18xIiwic3F2IiwiYWRkRXZlbnRMaXN0ZW5lciIsInIiLCJldnQiLCJDdXN0b21FdmVudCIsImRldGFpbCIsInNyY0VsZW1lbnQiLCJpbm5lckhUTUwiLCJkYXRhc2V0IiwicmVzWCIsInkiLCJyZXNZIiwid2luZG93IiwiZGlzcGF0Y2hFdmVudCIsIkljb25zTW9kZWwiLCJpY29uc1BhdGhzIiwicm93cyIsInRvU3RyaW5nIiwicmVnaW9uIiwiY2VudGVyIiwiSWNvbnMiLCJkaXNwbGF5IiwiZmlsdGVyZWRSb3dzIiwiY2hhciIsImxvbGxpcG9wIiwiYXJyb3dMZWZ0IiwiYXJyb3dSaWdodCIsInN0cmFuZCIsIm5vU2Vjb25kYXJ5IiwiaGVsaXgiLCJ0dXJuIiwiT3B0aW9uc01vZGVsIiwiZm9udFNpemUiLCJjaHVua1NpemUiLCJjaHVua1NlcGFyYXRpb24iLCJlbXB0eUZpbGxlciIsImluZGV4ZXNMb2NhdGlvbiIsIndyYXBMaW5lIiwidmlld2VyV2lkdGgiLCJsaW5lU2VwYXJhdGlvbiIsImN1c3RvbVBhbGV0dGUiLCJzZWxlY3Rpb24iLCJmU2l6ZSIsImZOdW0iLCJzdWJzdHIiLCJmVW5pdCIsImNTaXplIiwiclNpemUiLCJyTnVtIiwiclVuaXQiLCJvbE51bSIsIm9sVW5pdCIsImNsdXN0YWwiLCJBIiwiSSIsIkwiLCJNIiwiRiIsIlciLCJWIiwiSyIsIlIiLCJFIiwiRCIsIkMiLCJHIiwiTiIsIlEiLCJTIiwiVCIsIlAiLCJIIiwiWSIsInphcHBvIiwidGF5bG9yIiwiaHlkcm9waG9iaWNpdHkiLCJCIiwiWCIsIloiLCJoZWxpeHByb3BlbnNpdHkiLCJzdHJhbmRwcm9wZW5zaXR5IiwidHVybnByb3BlbnNpdHkiLCJidXJpZWRpbmRleCIsIm51Y2xlb3RpZGUiLCJVIiwicHVyaW5lcHlyaW1pZGluZSIsImNvbnNlbnN1c0xldmVsc0lkZW50aXR5IiwiY29uc2Vuc3VzQWFMZXNrIiwic3Vic3RpdHV0aW9uTWF0cml4Qmxvc3VtIiwiV0YiLCJRUSIsIkhIIiwiWVkiLCJaWiIsIkNDIiwiUFAiLCJWSSIsIlZNIiwiS0siLCJaSyIsIkROIiwiU1MiLCJRUiIsIk5OIiwiWUYiLCJWTCIsIktSIiwiRUQiLCJWViIsIk1JIiwiTU0iLCJaRCIsIkZGIiwiQkQiLCJITiIsIlRUIiwiU04iLCJMTCIsIkVRIiwiWVciLCJFRSIsIktRIiwiV1ciLCJNTCIsIktFIiwiWkUiLCJaUSIsIkJFIiwiREQiLCJTQSIsIllIIiwiR0ciLCJBQSIsIklJIiwiVFMiLCJSUiIsIkxJIiwiWkIiLCJCTiIsIkJCIiwiUGF0dGVybnNNb2RlbCIsImVsZW1lbnQiLCJwYXR0ZXJuIiwic3RyIiwicmVnZXhNYXRjaCIsInBhdHRlcm5zXzEiLCJyZSIsIlJlZ0V4cCIsIm1hdGNoIiwiZXhlYyIsImluZGV4IiwiYm9yZGVyQ29sb3IiLCJib3JkZXJTdHlsZSIsIlJvd3NNb2RlbCIsInN1YnN0aXR1dGl2ZUlkIiwicHJvY2Vzc1Jvd3MiLCJhbGxEYXRhIiwiY29sb3JpbmdPcmRlciIsInJvd051bXNPcmRlcmVkIiwibWFwIiwiTnVtYmVyIiwibjEiLCJuMiIsIm9yZGVyZWQiLCJyb3dOdW1zT3JkZXJlZF8xIiwiZGF0YSIsImNvbG9yaW5nUm93TnVtcyIsInJvd051bXNPcmRlcmVkXzIiLCJyZXZlcnNlIiwiaW5kZXhPZiIsInBvc2l0aW9uc18xIiwic3RhcnRzV2l0aCIsImljb25zRGF0YSIsInZhbHVlcyIsInVuZGVmaW5lZFZhbHVlcyIsIl9mIiwiaWR4IiwiaWR4S2V5IiwiU2VsZWN0aW9uTW9kZWwiLCJldmVudF9zZXF1ZW5jZSIsInNldF9zdGFydCIsInBhdGgiLCJnZXRFbGVtZW50QnlJZCIsInJlc0lkIiwib3JpZ2luYWxUYXJnZXQiLCJsYXN0SWQiLCJsYXN0U3F2Iiwic3F2SWQiLCJsYXN0T3ZlciIsImVsZW1lbnRzIiwicXVlcnlTZWxlY3RvckFsbCIsInNlbGVjdGlvbmhpZ2hsaWdodCIsImZpcnN0T3ZlciIsImVsZW1lbnRzXzEiLCJnZXRBdHRyaWJ1dGUiLCJmaXJzdFgiLCJsYXN0WCIsIm1heCIsImZpcnN0WSIsImxhc3RZIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiX3RoaXMiLCJvbm1vdXNlZG93biIsImV2ZW50Iiwic2VxdWVuY2VWaWV3ZXJzXzIiLCJlbGVtZW50c18yIiwiZXhwbGljaXRPcmlnaW5hbFRhcmdldCIsIm9ubW91c2VvdmVyIiwiYm9keSIsIm9ubW91c2V1cCIsImVsZW1lbnRzXzMiLCJ3aGljaCIsImtleUNvZGUiLCJjdHJsIiwiY3RybEtleSIsInRleHRUb1Bhc3RlIiwidGV4dERpY3QiLCJlbGVtZW50c180IiwiY29udGFpbnMiLCJpbm5lclRleHQiLCJ0ZXh0Um93IiwiZHVtbXkiLCJjcmVhdGVFbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCJzZWxlY3QiLCJleGVjQ29tbWFuZCIsInJlbW92ZUNoaWxkIiwidGV4dCIsImV2ZW50VHlwZSIsIlNlcXVlbmNlSW5mb01vZGVsIiwiaXNIVE1MIiwiZnJhZ21lbnQiLCJjcmVhdGVSYW5nZSIsImNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudCIsImZvckVhY2giLCJwYXJlbnROb2RlIiwidGV4dENvbnRlbnQiLCJ0cmltIiwibGFiZWxzIiwic3RhcnRJbmRleGVzIiwidG9vbHRpcHMiLCJzdGFydEluZGV4IiwibGFiZWxUb29sdGlwIiwiUHJvU2VxVmlld2VyIiwiZGl2SWQiLCJpbml0IiwicGFyYW1zIiwiZXZlbnRzIiwib25yZXNpemUiLCJjYWxjdWxhdGVJZHhzIiwib25jbGljayIsInNxdkxpc3QiLCJzcXZCb2R5IiwiY2h1bmtzIiwib2xkVG9wIiwibmV3VG9wIiwiZmlyc3RFbGVtZW50Q2hpbGQiLCJjbGFzc05hbWUiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3AiLCJzY3JvbGxZIiwiZHJhdyIsImlucHV0cyIsImxhYmVsc0ZsYWciLCJjcmVhdGVHVUkiLCJnZW5lcmF0ZUxhYmVscyIsImxhYmVsc2h0bWwiLCJsYWJlbHNDb250YWluZXIiLCJub0dhcHNMYWJlbHMiLCJjb3VudCIsInNlcU4iLCJkYXRhXzEiLCJzZXFOdW0iLCJyZXMiLCJub0dhcHMiLCJhZGRUb3BJbmRleGVzIiwibWF4VG9wIiwicm93TWFyZ2luQm90dG9tIiwiY2VsbHMiLCJjaHVua1RvcEluZGV4IiwiZGF0YV8yIiwibGVuZ2h0SW5kZXgiLCJpbmRleFdpZHRoIiwiY2FyZHMiLCJjZWxsIiwiZW50aXR5Iiwic3R5bGUiLCJodG1sIiwiaWR4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RyxjQUF2RyxDQUFSO1FBQ0gsQ0FGRCxNQUdLO1VBQ0RPLEtBQUssR0FBRyw4QkFBOEJwWixNQUE5QixDQUFxQ2daLEtBQXJDLEVBQTRDLHlEQUE1QyxFQUF1R2haLE1BQXZHLENBQThHNlksS0FBOUcsRUFBcUgsY0FBckgsQ0FBUixDQURDLENBQzZJO1FBQ2pKOztRQUNEQSxLQUFLLEdBQUcsRUFBUjtRQUNBdEksS0FBSyxHQUFHLEVBQVI7UUFDQTBJLElBQUksSUFBSUcsS0FBUjtNQUNIO0lBQ0o7O0lBQ0QsSUFBSTVSLFNBQUo7O0lBQ0EsSUFBSThCLFFBQUosRUFBYztNQUNWOUIsU0FBUyxHQUFHLDBCQUEwQnhILE1BQTFCLENBQWlDaVosSUFBakMsRUFBdUMsU0FBdkMsQ0FBWjtJQUNILENBRkQsTUFHSztNQUNEelIsU0FBUyxHQUFHLHVKQUF1SnhILE1BQXZKLENBQThKdUosV0FBOUosRUFBMkssTUFBM0ssRUFBbUx2SixNQUFuTCxDQUEwTGlaLElBQTFMLEVBQWdNLHdDQUFoTSxDQUFaO0lBQ0g7O0lBQ0RuQyxPQUFPLENBQUN0UCxTQUFSLEdBQW9CQSxTQUFwQjtJQUNBSyxNQUFNLENBQUNDLGFBQVAsQ0FBcUIsSUFBSXdSLEtBQUosQ0FBVSxRQUFWLENBQXJCO0VBQ0gsQ0E5SUQ7O0VBK0lBakQsWUFBWSxDQUFDUSxPQUFiLEdBQXVCLEVBQXZCO0VBQ0EsT0FBT1IsWUFBUDtBQUNILENBcFRpQyxFQUFsQzs7QUFxVEEsaUVBQWVBLFlBQWYsRSIsImZpbGUiOiJwcm9zZXF2aWV3ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIlByb1NlcVZpZXdlclwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJQcm9TZXFWaWV3ZXJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiUHJvU2VxVmlld2VyXCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwidmFyIENvbG9yc01vZGVsID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENvbG9yc01vZGVsKCkge1xuICAgIH1cbiAgICBDb2xvcnNNb2RlbC5nZXRSb3dzTGlzdCA9IGZ1bmN0aW9uIChjb2xvcmluZykge1xuICAgICAgICB2YXIgb3V0Q29sID0gdGhpcy5wYWxldHRlW2NvbG9yaW5nXTtcbiAgICAgICAgaWYgKCFvdXRDb2wpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMob3V0Q29sKTtcbiAgICB9O1xuICAgIENvbG9yc01vZGVsLmdldFBvc2l0aW9ucyA9IGZ1bmN0aW9uIChjb2xvcmluZywgcm93TnVtKSB7XG4gICAgICAgIHZhciBvdXRDb2w7XG4gICAgICAgIG91dENvbCA9IHRoaXMucGFsZXR0ZVtjb2xvcmluZ107XG4gICAgICAgIGlmICghb3V0Q29sKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgb3V0Q29sID0gb3V0Q29sW3Jvd051bV07XG4gICAgICAgIGlmICghb3V0Q29sKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgb3V0Q29sID0gb3V0Q29sLnBvc2l0aW9ucztcbiAgICAgICAgaWYgKCFvdXRDb2wpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0Q29sO1xuICAgIH07XG4gICAgQ29sb3JzTW9kZWwucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbiAoYWxsSW5wdXRzKSB7XG4gICAgICAgIGlmICghYWxsSW5wdXRzLnJlZ2lvbnMpIHtcbiAgICAgICAgICAgIGFsbElucHV0cy5yZWdpb25zID0gW107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFsbElucHV0cy5vcHRpb25zICYmICFhbGxJbnB1dHMub3B0aW9ucy5zZXF1ZW5jZUNvbG9yKSB7XG4gICAgICAgICAgICB2YXIgc2VxdWVuY2VDb2xvclJlZ2lvbnMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSBhbGxJbnB1dHMuc2VxdWVuY2VzOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIHZhciBzZXF1ZW5jZSA9IF9hW19pXTtcbiAgICAgICAgICAgICAgICBpZiAoc2VxdWVuY2Uuc2VxdWVuY2VDb2xvcikge1xuICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgIHNlcXVlbmNlQ29sb3JSZWdpb25zLnB1c2goeyBzZXF1ZW5jZUlkOiBzZXF1ZW5jZS5pZCwgc3RhcnQ6IDEsIGVuZDogc2VxdWVuY2Uuc2VxdWVuY2UubGVuZ3RoLCBzZXF1ZW5jZUNvbG9yOiBzZXF1ZW5jZS5zZXF1ZW5jZUNvbG9yIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIF9iID0gMCwgX2MgPSBhbGxJbnB1dHMucmVnaW9uczsgX2IgPCBfYy5sZW5ndGg7IF9iKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVnID0gX2NbX2JdO1xuICAgICAgICAgICAgICAgIGlmICghcmVnLmJhY2tncm91bmRDb2xvciAmJiByZWcuc2VxdWVuY2VJZCAhPT0gLTk5OTk5OTk5OTk5OTk4KSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcXVlbmNlQ29sb3JSZWdpb25zLnB1c2gocmVnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VxdWVuY2VDb2xvclJlZ2lvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGFsbElucHV0cy5yZWdpb25zID0gc2VxdWVuY2VDb2xvclJlZ2lvbnM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGFsbFJlZ2lvbnMgPSBBcnJheS5wcm90b3R5cGUuY29uY2F0KGFsbElucHV0cy5pY29ucywgYWxsSW5wdXRzLnJlZ2lvbnMsIGFsbElucHV0cy5wYXR0ZXJucyk7IC8vIG9yZGVyaW5nXG4gICAgICAgIHZhciBuZXdSZWdpb25zID0gdGhpcy5maXhNaXNzaW5nSWRzKGFsbFJlZ2lvbnMsIGFsbElucHV0cy5zZXF1ZW5jZXMpO1xuICAgICAgICBuZXdSZWdpb25zID0gdGhpcy50cmFuc2Zvcm1JbnB1dChhbGxSZWdpb25zLCBuZXdSZWdpb25zLCBhbGxJbnB1dHMuc2VxdWVuY2VzLCBhbGxJbnB1dHMub3B0aW9ucyk7XG4gICAgICAgIHRoaXMudHJhbnNmb3JtQ29sb3JzKGFsbElucHV0cy5vcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIG5ld1JlZ2lvbnM7XG4gICAgfTtcbiAgICAvLyB0cmFuc2Zvcm0gaW5wdXQgc3RydWN0dXJlXG4gICAgQ29sb3JzTW9kZWwucHJvdG90eXBlLnRyYW5zZm9ybUlucHV0ID0gZnVuY3Rpb24gKHJlZ2lvbnMsIG5ld1JlZ2lvbnMsIHNlcXVlbmNlcywgZ2xvYmFsQ29sb3IpIHtcbiAgICAgICAgLy8gaWYgZG9uJ3QgcmVjZWl2ZSBuZXcgY29sb3JzLCBrZWVwIG9sZCBjb2xvcnNcbiAgICAgICAgaWYgKCFyZWdpb25zKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgcmVjZWl2ZSBuZXcgY29sb3JzLCBjaGFuZ2UgdGhlbVxuICAgICAgICBDb2xvcnNNb2RlbC5wYWxldHRlID0ge307XG4gICAgICAgIHZhciBpbmZvO1xuICAgICAgICBpZiAoIWdsb2JhbENvbG9yKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIHNlcXVlbmNlc18xID0gc2VxdWVuY2VzOyBfaSA8IHNlcXVlbmNlc18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIHZhciBzZXEgPSBzZXF1ZW5jZXNfMVtfaV07XG4gICAgICAgICAgICAgICAgdmFyIHJlZyA9IHsgc2VxdWVuY2VJZDogc2VxLmlkLCBiYWNrZ3JvdW5kQ29sb3I6ICcnLCBzdGFydDogMSwgZW5kOiBzZXEuc2VxdWVuY2UubGVuZ3RoLCBzZXF1ZW5jZUNvbG9yOiAnJyB9O1xuICAgICAgICAgICAgICAgIGlmIChzZXEuc2VxdWVuY2VDb2xvcikge1xuICAgICAgICAgICAgICAgICAgICByZWcuYmFja2dyb3VuZENvbG9yID0gc2VxLnNlcXVlbmNlQ29sb3I7XG4gICAgICAgICAgICAgICAgICAgIHJlZy5zZXF1ZW5jZUNvbG9yID0gc2VxLnNlcXVlbmNlQ29sb3I7XG4gICAgICAgICAgICAgICAgICAgIGluZm8gPSB0aGlzLnNldFNlcXVlbmNlQ29sb3IocmVnLCBzZXEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgX2xvb3BfMSA9IGZ1bmN0aW9uIChyZWcpIHtcbiAgICAgICAgICAgIHZhciBzZXF1ZW5jZUNvbG9yID0gdm9pZCAwO1xuICAgICAgICAgICAgaWYgKHJlZy5pY29uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiY29udGludWVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZXF1ZW5jZXMuZmluZChmdW5jdGlvbiAoeCkgeyByZXR1cm4geC5pZCA9PT0gcmVnLnNlcXVlbmNlSWQ7IH0pKSB7XG4gICAgICAgICAgICAgICAgc2VxdWVuY2VDb2xvciA9IHNlcXVlbmNlcy5maW5kKGZ1bmN0aW9uICh4KSB7IHJldHVybiB4LmlkID09PSByZWcuc2VxdWVuY2VJZDsgfSkuc2VxdWVuY2VDb2xvcjtcbiAgICAgICAgICAgICAgICBpZiAoc2VxdWVuY2VDb2xvciAmJiAhZ2xvYmFsQ29sb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gc2VxdWVuY2VDb2xvciBpcyBzZXQuIENhbm5vdCBzZXQgYmFja2dyb3VuZENvbG9yXG4gICAgICAgICAgICAgICAgICAgIHJlZy5zZXF1ZW5jZUNvbG9yID0gc2VxdWVuY2VDb2xvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbmZvID0gdGhpc18xLnByb2Nlc3NDb2xvcihyZWcpO1xuICAgICAgICAgICAgaWYgKGluZm8gPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiY29udGludWVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIENvbG9yc01vZGVsLnBhbGV0dGVbaW5mby50eXBlXVtpbmZvLnNlcXVlbmNlSWRdLnBvc2l0aW9uc1xuICAgICAgICAgICAgICAgIC5wdXNoKHsgc3RhcnQ6IHJlZy5zdGFydCwgZW5kOiByZWcuZW5kLCB0YXJnZXQ6IGluZm8ubGV0dGVyU3R5bGUgfSk7XG4gICAgICAgICAgICBpZiAoc2VxdWVuY2VDb2xvciAmJiBzZXF1ZW5jZUNvbG9yLmluY2x1ZGVzKCdiaW5hcnknKSkge1xuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICBDb2xvcnNNb2RlbC5wYWxldHRlW2luZm8udHlwZV0uYmluYXJ5Q29sb3JzID0gdGhpc18xLmdldEJpbmFyeUNvbG9ycyhzZXF1ZW5jZUNvbG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHRoaXNfMSA9IHRoaXM7XG4gICAgICAgIC8vIG92ZXJ3cml0ZSByZWdpb24gY29sb3IgaWYgc2VxdWVuY2VDb2xvciBpcyBzZXRcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBmb3IgKHZhciBfYSA9IDAsIG5ld1JlZ2lvbnNfMSA9IG5ld1JlZ2lvbnM7IF9hIDwgbmV3UmVnaW9uc18xLmxlbmd0aDsgX2ErKykge1xuICAgICAgICAgICAgdmFyIHJlZyA9IG5ld1JlZ2lvbnNfMVtfYV07XG4gICAgICAgICAgICBfbG9vcF8xKHJlZyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld1JlZ2lvbnM7XG4gICAgfTtcbiAgICBDb2xvcnNNb2RlbC5wcm90b3R5cGUuc2V0U2VxdWVuY2VDb2xvciA9IGZ1bmN0aW9uIChyZWcsIHNlcSkge1xuICAgICAgICB2YXIgaW5mbztcbiAgICAgICAgaW5mbyA9IHRoaXMucHJvY2Vzc0NvbG9yKHJlZyk7XG4gICAgICAgIENvbG9yc01vZGVsLnBhbGV0dGVbaW5mby50eXBlXVtpbmZvLnNlcXVlbmNlSWRdLnBvc2l0aW9uc1xuICAgICAgICAgICAgLnB1c2goeyBzdGFydDogcmVnLnN0YXJ0LCBlbmQ6IHJlZy5lbmQsIHRhcmdldDogaW5mby5sZXR0ZXJTdHlsZSB9KTtcbiAgICAgICAgaWYgKHNlcS5zZXF1ZW5jZUNvbG9yLmluY2x1ZGVzKCdiaW5hcnknKSkge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgQ29sb3JzTW9kZWwucGFsZXR0ZVtpbmZvLnR5cGVdLmJpbmFyeUNvbG9ycyA9IHRoaXMuZ2V0QmluYXJ5Q29sb3JzKHNlcS5zZXF1ZW5jZUNvbG9yKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5mbztcbiAgICB9O1xuICAgIENvbG9yc01vZGVsLnByb3RvdHlwZS5maXhNaXNzaW5nSWRzID0gZnVuY3Rpb24gKHJlZ2lvbnMsIHNlcXVlbmNlcykge1xuICAgICAgICB2YXIgbmV3UmVnaW9ucyA9IFtdO1xuICAgICAgICB2YXIgX2xvb3BfMiA9IGZ1bmN0aW9uIChyZWcpIHtcbiAgICAgICAgICAgIGlmICghcmVnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiY29udGludWVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZXF1ZW5jZXMuZmluZChmdW5jdGlvbiAoeCkgeyByZXR1cm4geC5pZCA9PT0gcmVnLnNlcXVlbmNlSWQ7IH0pKSB7XG4gICAgICAgICAgICAgICAgbmV3UmVnaW9ucy5wdXNoKHJlZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfYSA9IDAsIHNlcXVlbmNlc18yID0gc2VxdWVuY2VzOyBfYSA8IHNlcXVlbmNlc18yLmxlbmd0aDsgX2ErKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VxID0gc2VxdWVuY2VzXzJbX2FdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3UmVnID0ge307XG4gICAgICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpmb3JpblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gcmVnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVnW2tleV0gIT09ICdzZXF1ZW5jZUlkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1JlZ1trZXldID0gcmVnW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdSZWdbJ3NlcXVlbmNlSWQnXSA9IHNlcS5pZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBuZXdSZWdpb25zLnB1c2gobmV3UmVnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgcmVnaW9uc18xID0gcmVnaW9uczsgX2kgPCByZWdpb25zXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgcmVnID0gcmVnaW9uc18xW19pXTtcbiAgICAgICAgICAgIF9sb29wXzIocmVnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3UmVnaW9ucztcbiAgICB9O1xuICAgIENvbG9yc01vZGVsLnByb3RvdHlwZS50cmFuc2Zvcm1Db2xvcnMgPSBmdW5jdGlvbiAob3B0KSB7XG4gICAgICAgIHZhciBzZXF1ZW5jZUNvbG9yID0gb3B0LnNlcXVlbmNlQ29sb3I7XG4gICAgICAgIHZhciBhcnJDb2xvcnM7XG4gICAgICAgIHZhciBuO1xuICAgICAgICB2YXIgYztcbiAgICAgICAgZm9yICh2YXIgdHlwZSBpbiBDb2xvcnNNb2RlbC5wYWxldHRlKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdncmFkaWVudCc6IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmZvcmluXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHJvdyBpbiBDb2xvcnNNb2RlbC5wYWxldHRlW3R5cGVdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjID0gQ29sb3JzTW9kZWwucGFsZXR0ZVt0eXBlXVtyb3ddO1xuICAgICAgICAgICAgICAgICAgICAgICAgbiA9IGMucG9zaXRpb25zLmxlbmd0aCArIGMuY2hhcnMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJyQ29sb3JzID0gdGhpcy5ncmFkaWVudChuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMucG9zaXRpb25zLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIChhLnN0YXJ0ID4gYi5zdGFydCkgPyAxIDogLTE7IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IGMucG9zaXRpb25zOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlID0gX2FbX2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuYmFja2dyb3VuZENvbG9yID0gYXJyQ29sb3JzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICdiaW5hcnknOiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpmb3JpblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciByb3cgaW4gQ29sb3JzTW9kZWwucGFsZXR0ZVt0eXBlXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvdyA9PT0gJ2JpbmFyeUNvbG9ycycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGMgPSBDb2xvcnNNb2RlbC5wYWxldHRlW3R5cGVdW3Jvd107XG4gICAgICAgICAgICAgICAgICAgICAgICBuID0gYy5wb3NpdGlvbnMubGVuZ3RoICsgYy5jaGFycy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJDb2xvcnMgPSB0aGlzLmJpbmFyeShuLCBDb2xvcnNNb2RlbC5wYWxldHRlW3R5cGVdLmJpbmFyeUNvbG9ycyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjLnBvc2l0aW9ucy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiAoYS5zdGFydCA+IGIuc3RhcnQpID8gMSA6IC0xOyB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIF9iID0gMCwgX2MgPSBjLnBvc2l0aW9uczsgX2IgPCBfYy5sZW5ndGg7IF9iKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IF9jW19iXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLmJhY2tncm91bmRDb2xvciA9IGFyckNvbG9ycy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSBzZXF1ZW5jZUNvbG9yOiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpmb3JpblxuICAgICAgICAgICAgICAgICAgICAvLyBDb2xvcnNNb2RlbC5wYWxldHRlW3R5cGVdOiBhbiBvYmogd2l0aCByZWdpb25zIGFuZCBjb2xvciBhc3NvY2lhdGVkIGVzLiBwb3NpdGlvbnM6IDEtMjAwLCB6YXBwb1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciByb3cgaW4gQ29sb3JzTW9kZWwucGFsZXR0ZVt0eXBlXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYyA9IENvbG9yc01vZGVsLnBhbGV0dGVbdHlwZV1bcm93XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjLnBvc2l0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgX2QgPSAwLCBfZSA9IGMucG9zaXRpb25zOyBfZCA8IF9lLmxlbmd0aDsgX2QrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcG9zID0gX2VbX2RdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3MuYmFja2dyb3VuZENvbG9yID0gc2VxdWVuY2VDb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBDb2xvcnNNb2RlbC5wcm90b3R5cGUucHJvY2Vzc0NvbG9yID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHsgdHlwZTogJ2N1c3RvbScsIHNlcXVlbmNlSWQ6IC0xLCBsZXR0ZXJTdHlsZTogJycgfTtcbiAgICAgICAgLy8gY2hlY2sgaWYgcm93IGtleSBpcyBhIG51bWJlclxuICAgICAgICBpZiAoZS5zZXF1ZW5jZUlkID09PSB1bmRlZmluZWQgfHwgaXNOYU4oK2Uuc2VxdWVuY2VJZCkpIHtcbiAgICAgICAgICAgIC8vIHdyb25nIGVudGl0eSByb3cga2V5XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0LnNlcXVlbmNlSWQgPSArZS5zZXF1ZW5jZUlkO1xuICAgICAgICAvLyB0cmFuc2Zvcm0gdGFyZ2V0IGluIENTUyBwcm9wZXJ0eVxuICAgICAgICBpZiAoZS5jb2xvcikge1xuICAgICAgICAgICAgcmVzdWx0LmxldHRlclN0eWxlID0gXCJjb2xvcjpcIi5jb25jYXQoZS5jb2xvciwgXCI7XCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlLmJhY2tncm91bmRDb2xvcikge1xuICAgICAgICAgICAgcmVzdWx0LmxldHRlclN0eWxlICs9IFwiYmFja2dyb3VuZC1jb2xvcjpcIi5jb25jYXQoZS5iYWNrZ3JvdW5kQ29sb3IsIFwiO1wiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZS5iYWNrZ3JvdW5kSW1hZ2UpIHtcbiAgICAgICAgICAgIHJlc3VsdC5sZXR0ZXJTdHlsZSArPSBcImJhY2tncm91bmQtaW1hZ2U6IFwiLmNvbmNhdChlLmJhY2tncm91bmRJbWFnZSwgXCI7XCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGRlZmluZSBjb2xvciBvciBwYWxldHRlXG4gICAgICAgIGlmIChlLnNlcXVlbmNlQ29sb3IpIHtcbiAgICAgICAgICAgIHJlc3VsdC50eXBlID0gZS5zZXF1ZW5jZUNvbG9yO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQudHlwZS5pbmNsdWRlcygnYmluYXJ5JykpIHtcbiAgICAgICAgICAgIHJlc3VsdC50eXBlID0gJ2JpbmFyeSc7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVzZXJ2aW5nIHNwYWNlIGZvciB0aGUgdHJhbnNmb3JtZWQgb2JqZWN0ICh0aGlzLnBhbGV0dGUpXG4gICAgICAgIC8vIGlmIGNvbG9yIHR5cGUgbm90IGluc2VydGVkIHlldFxuICAgICAgICBpZiAoIShyZXN1bHQudHlwZSBpbiBDb2xvcnNNb2RlbC5wYWxldHRlKSkge1xuICAgICAgICAgICAgQ29sb3JzTW9kZWwucGFsZXR0ZVtyZXN1bHQudHlwZV0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpZiByb3cgbm90IGluc2VydGVkIHlldFxuICAgICAgICBpZiAoIShyZXN1bHQuc2VxdWVuY2VJZCBpbiBDb2xvcnNNb2RlbC5wYWxldHRlW3Jlc3VsdC50eXBlXSkpIHtcbiAgICAgICAgICAgIENvbG9yc01vZGVsLnBhbGV0dGVbcmVzdWx0LnR5cGVdW3Jlc3VsdC5zZXF1ZW5jZUlkXSA9IHsgcG9zaXRpb25zOiBbXSwgY2hhcnM6IFtdIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICAgIENvbG9yc01vZGVsLnByb3RvdHlwZS5ncmFkaWVudCA9IGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2ZW5seVNwYWNlZENvbG9ycyhuKTtcbiAgICB9O1xuICAgIENvbG9yc01vZGVsLnByb3RvdHlwZS5nZXRCaW5hcnlDb2xvcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjb2xvcjEgPSAnIzkzRTFEOCc7XG4gICAgICAgIHZhciBjb2xvcjIgPSAnI0ZGQTY5RSc7XG4gICAgICAgIHJldHVybiBbY29sb3IxLCBjb2xvcjJdO1xuICAgIH07XG4gICAgQ29sb3JzTW9kZWwucHJvdG90eXBlLmJpbmFyeSA9IGZ1bmN0aW9uIChuLCBiaW5hcnlDb2xvcnMpIHtcbiAgICAgICAgdmFyIHJlZyA9IDA7XG4gICAgICAgIHZhciBmbGFnO1xuICAgICAgICB2YXIgYXJyQ29sb3JzID0gW107XG4gICAgICAgIHdoaWxlIChyZWcgPCBuKSB7XG4gICAgICAgICAgICBpZiAoZmxhZykge1xuICAgICAgICAgICAgICAgIGFyckNvbG9ycy5wdXNoKGJpbmFyeUNvbG9yc1swXSk7XG4gICAgICAgICAgICAgICAgZmxhZyA9ICFmbGFnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYXJyQ29sb3JzLnB1c2goYmluYXJ5Q29sb3JzWzFdKTtcbiAgICAgICAgICAgICAgICBmbGFnID0gIWZsYWc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZWcgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJyQ29sb3JzO1xuICAgIH07XG4gICAgQ29sb3JzTW9kZWwucHJvdG90eXBlLmV2ZW5seVNwYWNlZENvbG9ycyA9IGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIC8qKiBob3cgdG8gZ28gYXJvdW5kIHRoZSByZ2Igd2hlZWwgKi9cbiAgICAgICAgLyoqIGFkZCB0byBuZXh0IHJnYiBjb21wb25lbnQsIHN1YnRyYWN0IHRvIHByZXZpb3VzICovXG4gICAgICAgIC8qKiAgZXguOiAyNTUsMCwwIC0oYWRkKS0+IDI1NSwyNTUsMCAtKHN1YnRyYWN0KS0+IDAsMjU1LDAgKi9cbiAgICAgICAgLy8gc3RhcnRpbmcgY29sb3I6IHJlZFxuICAgICAgICB2YXIgcmdiID0gWzI1NSwgMCwgMF07XG4gICAgICAgIC8vIDE1MzYgY29sb3JzIGluIHRoZSByZ2Igd2hlZWxcbiAgICAgICAgdmFyIGRlbHRhID0gTWF0aC5mbG9vcigxNTM2IC8gbik7XG4gICAgICAgIHZhciByZW1haW5kZXI7XG4gICAgICAgIHZhciBhZGQgPSB0cnVlO1xuICAgICAgICB2YXIgdmFsdWUgPSAwO1xuICAgICAgICB2YXIgdG1wO1xuICAgICAgICB2YXIgY29sb3JzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICByZW1haW5kZXIgPSBkZWx0YTtcbiAgICAgICAgICAgIHdoaWxlIChyZW1haW5kZXIgPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFkZCkge1xuICAgICAgICAgICAgICAgICAgICB0bXAgPSAoKCh2YWx1ZSArIDEpICUgMykgKyAzKSAlIDM7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZ2JbdG1wXSArIHJlbWFpbmRlciA+IDI1NSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVtYWluZGVyIC09ICgyNTUgLSByZ2JbdG1wXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZ2JbdG1wXSA9IDI1NTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0bXA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZ2JbdG1wXSArPSByZW1haW5kZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW1haW5kZXIgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0bXAgPSAoKCh2YWx1ZSAtIDEpICUgMykgKyAzKSAlIDM7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZ2JbdG1wXSAtIHJlbWFpbmRlciA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbWFpbmRlciAtPSByZ2JbdG1wXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJnYlt0bXBdID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZ2JbdG1wXSAtPSByZW1haW5kZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW1haW5kZXIgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29sb3JzLnB1c2goJ3JnYmEoJyArIHJnYlswXSArICcsJyArIHJnYlsxXSArICcsJyArIHJnYlsyXSArICcsIDAuNCknKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29sb3JzO1xuICAgIH07XG4gICAgcmV0dXJuIENvbG9yc01vZGVsO1xufSgpKTtcbmV4cG9ydCB7IENvbG9yc01vZGVsIH07XG4iLCJpbXBvcnQgeyBQYWxldHRlcyB9IGZyb20gJy4vcGFsZXR0ZXMnO1xudmFyIENvbnNlbnN1c01vZGVsID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENvbnNlbnN1c01vZGVsKCkge1xuICAgIH1cbiAgICBDb25zZW5zdXNNb2RlbC5zZXRDb25zZW5zdXNJbmZvID0gZnVuY3Rpb24gKHR5cGUsIHNlcXVlbmNlcykge1xuICAgICAgICB2YXIgaWRJZGVudGl0eSA9IC05OTk5OTk5OTk5OTk5OTtcbiAgICAgICAgdmFyIGlkUGh5c2ljYWwgPSAtOTk5OTk5OTk5OTk5OTg7XG4gICAgICAgIHZhciBjb25zZW5zdXNJbmZvID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VxdWVuY2VzWzBdLnNlcXVlbmNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY29uc2Vuc3VzQ29sdW1uID0ge307XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIHNlcXVlbmNlc18xID0gc2VxdWVuY2VzOyBfaSA8IHNlcXVlbmNlc18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIHZhciBzZXF1ZW5jZSA9IHNlcXVlbmNlc18xW19pXTtcbiAgICAgICAgICAgICAgICB2YXIgbGV0dGVyID0gc2VxdWVuY2Uuc2VxdWVuY2VbaV07XG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdwaHlzaWNhbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlcXVlbmNlLmlkID09PSBpZElkZW50aXR5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobGV0dGVyIGluIFBhbGV0dGVzLmNvbnNlbnN1c0FhTGVzaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyID0gUGFsZXR0ZXMuY29uc2Vuc3VzQWFMZXNrW2xldHRlcl1bMF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXF1ZW5jZS5pZCA9PT0gaWRQaHlzaWNhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGxldHRlciA9PT0gJy0nIHx8ICFsZXR0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChjb25zZW5zdXNDb2x1bW5bbGV0dGVyXSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zZW5zdXNDb2x1bW5bbGV0dGVyXSArPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc2Vuc3VzQ29sdW1uW2xldHRlcl0gPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNlbnN1c0luZm8ucHVzaChjb25zZW5zdXNDb2x1bW4pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb25zZW5zdXNJbmZvO1xuICAgIH07XG4gICAgQ29uc2Vuc3VzTW9kZWwuY3JlYXRlQ29uc2Vuc3VzID0gZnVuY3Rpb24gKHR5cGUsIGNvbnNlbnN1cywgY29uc2Vuc3VzMiwgc2VxdWVuY2VzLCByZWdpb25zLCB0aHJlc2hvbGQsIHBhbGV0dGUpIHtcbiAgICAgICAgaWYgKHRocmVzaG9sZCA8IDUwKSB7XG4gICAgICAgICAgICB0aHJlc2hvbGQgPSAxMDAgLSB0aHJlc2hvbGQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGlkID0gLTk5OTk5OTk5OTk5OTk5O1xuICAgICAgICB2YXIgbGFiZWw7XG4gICAgICAgIGlmICh0eXBlID09PSAncGh5c2ljYWwnKSB7XG4gICAgICAgICAgICBsYWJlbCA9ICdDb25zZW5zdXMgcGh5c2ljYWwgJyArIHRocmVzaG9sZCArICclJztcbiAgICAgICAgICAgIGlkID0gLTk5OTk5OTk5OTk5OTk4O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGFiZWwgPSAnQ29uc2Vuc3VzIGlkZW50aXR5ICcgKyB0aHJlc2hvbGQgKyAnJSc7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNvbnNlbnN1c1NlcXVlbmNlID0gJyc7XG4gICAgICAgIHZhciBfbG9vcF8xID0gZnVuY3Rpb24gKGNvbHVtbikge1xuICAgICAgICAgICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgICAgICAgICB2YXIgbWF4TGV0dGVyID0gdm9pZCAwO1xuICAgICAgICAgICAgdmFyIG1heEluZGV4ID0gdm9pZCAwO1xuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKGNvbnNlbnN1c1tjb2x1bW5dKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBtYXhMZXR0ZXIgPSAnLic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBtYXhMZXR0ZXIgPSBPYmplY3Qua2V5cyhjb25zZW5zdXNbY29sdW1uXSkucmVkdWNlKGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb25zZW5zdXNbY29sdW1uXVthXSA+IGNvbnNlbnN1c1tjb2x1bW5dW2JdID8gYSA6IGI7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbWF4SW5kZXggPSBjb25zZW5zdXNbY29sdW1uXVttYXhMZXR0ZXJdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGJhY2tncm91bmRDb2xvciA9IHZvaWQgMDtcbiAgICAgICAgICAgIHZhciBjb2xvciA9IHZvaWQgMDtcbiAgICAgICAgICAgIHZhciBmcmVxdWVuY3kgPSAobWF4SW5kZXggLyBzZXF1ZW5jZXMubGVuZ3RoKSAqIDEwMDtcbiAgICAgICAgICAgIGlmICh0eXBlID09PSAncGh5c2ljYWwnKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc2Vuc3VzIGlkIHRvIHNlZSBpZiBJIGhhdmUgYWxsIGxldHRlcnMgZXF1YWxzXG4gICAgICAgICAgICAgICAgLy8gZXF1YWxzIGxldHRlcnMgaGF2ZSBwcmVjZWRlbmNlIG92ZXIgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgIHZhciBtYXhMZXR0ZXJJZCA9IHZvaWQgMDtcbiAgICAgICAgICAgICAgICB2YXIgbWF4SW5kZXhJZCA9IHZvaWQgMDtcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoY29uc2Vuc3VzW2NvbHVtbl0pLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBtYXhMZXR0ZXJJZCA9ICcuJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG1heExldHRlcklkID0gT2JqZWN0LmtleXMoY29uc2Vuc3VzMltjb2x1bW5dKS5yZWR1Y2UoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb25zZW5zdXMyW2NvbHVtbl1bYV0gPiBjb25zZW5zdXMyW2NvbHVtbl1bYl0gPyBhIDogYjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIG1heEluZGV4SWQgPSBjb25zZW5zdXMyW2NvbHVtbl1bbWF4TGV0dGVySWRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgZnJlcXVlbmN5SWQgPSAobWF4SW5kZXhJZCAvIHNlcXVlbmNlcy5sZW5ndGgpICogMTAwO1xuICAgICAgICAgICAgICAgIGlmIChmcmVxdWVuY3lJZCA+PSB0aHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4TGV0dGVyID0gbWF4TGV0dGVySWQ7XG4gICAgICAgICAgICAgICAgICAgIF9hID0gQ29uc2Vuc3VzTW9kZWwuc2V0Q29sb3JzSWRlbnRpdHkoZnJlcXVlbmN5SWQsIHBhbGV0dGUsICdwaHlzaWNhbCcpLCBiYWNrZ3JvdW5kQ29sb3IgPSBfYVswXSwgY29sb3IgPSBfYVsxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmcmVxdWVuY3kgPj0gdGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfYiA9IENvbnNlbnN1c01vZGVsLnNldENvbG9yc1BoeXNpY2FsKG1heExldHRlciwgcGFsZXR0ZSksIGJhY2tncm91bmRDb2xvciA9IF9iWzBdLCBjb2xvciA9IF9iWzFdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgX2MgPSBDb25zZW5zdXNNb2RlbC5zZXRDb2xvcnNJZGVudGl0eShmcmVxdWVuY3ksIHBhbGV0dGUsICdpZGVudGl0eScpLCBiYWNrZ3JvdW5kQ29sb3IgPSBfY1swXSwgY29sb3IgPSBfY1sxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmcmVxdWVuY3kgPCB0aHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICBtYXhMZXR0ZXIgPSAnLic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyArIDEgYmVjYXVzZSByZXNpZHVlcyBzdGFydCBmcm9tIDEgYW5kIG5vdCAwXG4gICAgICAgICAgICByZWdpb25zLnB1c2goeyBzdGFydDogK2NvbHVtbiArIDEsIGVuZDogK2NvbHVtbiArIDEsIHNlcXVlbmNlSWQ6IGlkLCBiYWNrZ3JvdW5kQ29sb3I6IGJhY2tncm91bmRDb2xvciwgY29sb3I6IGNvbG9yIH0pO1xuICAgICAgICAgICAgY29uc2Vuc3VzU2VxdWVuY2UgKz0gbWF4TGV0dGVyO1xuICAgICAgICB9O1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Zm9yaW5cbiAgICAgICAgZm9yICh2YXIgY29sdW1uIGluIGNvbnNlbnN1cykge1xuICAgICAgICAgICAgX2xvb3BfMShjb2x1bW4pO1xuICAgICAgICB9XG4gICAgICAgIHNlcXVlbmNlcy5wdXNoKHsgaWQ6IGlkLCBzZXF1ZW5jZTogY29uc2Vuc3VzU2VxdWVuY2UsIGxhYmVsOiBsYWJlbCB9KTtcbiAgICAgICAgcmV0dXJuIFtzZXF1ZW5jZXMsIHJlZ2lvbnNdO1xuICAgIH07XG4gICAgQ29uc2Vuc3VzTW9kZWwuc2V0Q29sb3JzSWRlbnRpdHkgPSBmdW5jdGlvbiAoZnJlcXVlbmN5LCBwYWxldHRlLCBmbGFnKSB7XG4gICAgICAgIHZhciBiYWNrZ3JvdW5kQ29sb3I7XG4gICAgICAgIHZhciBjb2xvcjtcbiAgICAgICAgdmFyIGZpbmFsUGFsZXR0ZTtcbiAgICAgICAgaWYgKHBhbGV0dGUgJiYgdHlwZW9mIHBhbGV0dGUgIT09ICdzdHJpbmcnICYmIGZsYWcgPT0gJ2lkZW50aXR5Jykge1xuICAgICAgICAgICAgZmluYWxQYWxldHRlID0gcGFsZXR0ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZpbmFsUGFsZXR0ZSA9IFBhbGV0dGVzLmNvbnNlbnN1c0xldmVsc0lkZW50aXR5O1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdGVwcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gZmluYWxQYWxldHRlKSB7XG4gICAgICAgICAgICBzdGVwcy5wdXNoKCtrZXkpOyAvLyA0MlxuICAgICAgICB9XG4gICAgICAgIHN0ZXBzID0gc3RlcHMuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYSA8IGIgPyAxIDogYSA+IGIgPyAtMSA6IDA7IH0pO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIHN0ZXBzXzEgPSBzdGVwczsgX2kgPCBzdGVwc18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIHN0ZXAgPSBzdGVwc18xW19pXTtcbiAgICAgICAgICAgIGlmIChmcmVxdWVuY3kgPj0gc3RlcCkge1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvciA9IGZpbmFsUGFsZXR0ZVtzdGVwXVswXTtcbiAgICAgICAgICAgICAgICBjb2xvciA9IGZpbmFsUGFsZXR0ZVtzdGVwXVsxXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW2JhY2tncm91bmRDb2xvciwgY29sb3JdO1xuICAgIH07XG4gICAgQ29uc2Vuc3VzTW9kZWwuc2V0Q29sb3JzUGh5c2ljYWwgPSBmdW5jdGlvbiAobGV0dGVyLCBwYWxldHRlKSB7XG4gICAgICAgIHZhciBmaW5hbFBhbGV0dGU7XG4gICAgICAgIHZhciBiYWNrZ3JvdW5kQ29sb3I7XG4gICAgICAgIHZhciBjb2xvcjtcbiAgICAgICAgaWYgKHBhbGV0dGUgJiYgdHlwZW9mIHBhbGV0dGUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBmaW5hbFBhbGV0dGUgPSBwYWxldHRlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZmluYWxQYWxldHRlID0gUGFsZXR0ZXMuY29uc2Vuc3VzQWFMZXNrO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGVsIGluIGZpbmFsUGFsZXR0ZSkge1xuICAgICAgICAgICAgaWYgKGZpbmFsUGFsZXR0ZVtlbF1bMF0gPT0gbGV0dGVyKSB7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yID0gZmluYWxQYWxldHRlW2VsXVsxXTtcbiAgICAgICAgICAgICAgICBjb2xvciA9IGZpbmFsUGFsZXR0ZVtlbF1bMl07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtiYWNrZ3JvdW5kQ29sb3IsIGNvbG9yXTtcbiAgICB9O1xuICAgIENvbnNlbnN1c01vZGVsLnByb3RvdHlwZS5wcm9jZXNzID0gZnVuY3Rpb24gKHNlcXVlbmNlcywgcmVnaW9ucywgb3B0aW9ucykge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICBpZiAoIXJlZ2lvbnMpIHtcbiAgICAgICAgICAgIHJlZ2lvbnMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbWF4SWR4ID0gMDtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBzZXF1ZW5jZXNfMiA9IHNlcXVlbmNlczsgX2kgPCBzZXF1ZW5jZXNfMi5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciByb3cgPSBzZXF1ZW5jZXNfMltfaV07XG4gICAgICAgICAgICBpZiAobWF4SWR4IDwgcm93LnNlcXVlbmNlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIG1heElkeCA9IHJvdy5zZXF1ZW5jZS5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgX2MgPSAwLCBzZXF1ZW5jZXNfMyA9IHNlcXVlbmNlczsgX2MgPCBzZXF1ZW5jZXNfMy5sZW5ndGg7IF9jKyspIHtcbiAgICAgICAgICAgIHZhciByb3cgPSBzZXF1ZW5jZXNfM1tfY107XG4gICAgICAgICAgICB2YXIgZGlmZiA9IG1heElkeCAtIHJvdy5zZXF1ZW5jZS5sZW5ndGg7XG4gICAgICAgICAgICBpZiAoZGlmZiA+IDAgJiYgcm93LmlkICE9PSAtOTk5OTk5OTk5OTk5OTkgJiYgcm93LmlkICE9PSAtOTk5OTk5OTk5OTk5OTgpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRpZmY7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICByb3cuc2VxdWVuY2UgKz0gJy0nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5zZXF1ZW5jZUNvbG9yTWF0cml4KSB7XG4gICAgICAgICAgICByZWdpb25zID0gW107XG4gICAgICAgICAgICBzZXF1ZW5jZXMuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYS5pZCAtIGIuaWQ7IH0pO1xuICAgICAgICAgICAgdmFyIG1pbiA9IHNlcXVlbmNlc1swXTtcbiAgICAgICAgICAgIHZhciBwYWxldHRlID0gUGFsZXR0ZXMuc3Vic3RpdHV0aW9uTWF0cml4Qmxvc3VtO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocGFsZXR0ZSlcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNlcXVlbmNlQ29sb3JNYXRyaXhQYWxldHRlKSB7XG4gICAgICAgICAgICAgICAgcGFsZXR0ZSA9IG9wdGlvbnMuc2VxdWVuY2VDb2xvck1hdHJpeFBhbGV0dGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIga2V5ID0gdm9pZCAwO1xuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnByZWZlci1mb3Itb2ZcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWluLnNlcXVlbmNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2QgPSAwLCBzZXF1ZW5jZXNfNCA9IHNlcXVlbmNlczsgX2QgPCBzZXF1ZW5jZXNfNC5sZW5ndGg7IF9kKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlcXVlbmNlID0gc2VxdWVuY2VzXzRbX2RdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VxdWVuY2UuaWQgPT09IG1pbi5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5ID0gc2VxdWVuY2Uuc2VxdWVuY2VbaV0gKyBzZXF1ZW5jZS5zZXF1ZW5jZVtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXkgaW4gcGFsZXR0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZ2lvbnMucHVzaCh7IHNlcXVlbmNlSWQ6IHNlcXVlbmNlLmlkLCBzdGFydDogaSArIDEsIGVuZDogaSArIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogcGFsZXR0ZVtrZXldWzBdLCBjb2xvcjogcGFsZXR0ZVtrZXldWzFdIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2NvcmUgd2l0aCBmaXJzdCBzZXF1ZW5jZVxuICAgICAgICAgICAgICAgICAgICAgICAga2V5ID0gc2VxdWVuY2Uuc2VxdWVuY2VbaV0gKyBtaW4uc2VxdWVuY2VbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5IGluIHBhbGV0dGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWdpb25zLnB1c2goeyBzZXF1ZW5jZUlkOiBzZXF1ZW5jZS5pZCwgc3RhcnQ6IGkgKyAxLCBlbmQ6IGkgKyAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHBhbGV0dGVba2V5XVswXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBhbGV0dGVbbWluLnNlcXVlbmNlW2ldICsgc2VxdWVuY2Uuc2VxdWVuY2VbaV1dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ID0gbWluLnNlcXVlbmNlW2ldICsgc2VxdWVuY2Uuc2VxdWVuY2VbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVnaW9ucy5wdXNoKHsgc2VxdWVuY2VJZDogc2VxdWVuY2UuaWQsIHN0YXJ0OiBpICsgMSwgZW5kOiBpICsgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBwYWxldHRlW2tleV1bMF0sIGNvbG9yOiBwYWxldHRlW2tleV1bMV0gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAob3B0aW9ucy5zZXF1ZW5jZUNvbG9yKSB7XG4gICAgICAgICAgICByZWdpb25zID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBfZSA9IDAsIHNlcXVlbmNlc181ID0gc2VxdWVuY2VzOyBfZSA8IHNlcXVlbmNlc181Lmxlbmd0aDsgX2UrKykge1xuICAgICAgICAgICAgICAgIHZhciBzZXF1ZW5jZSA9IHNlcXVlbmNlc181W19lXTtcbiAgICAgICAgICAgICAgICBzZXF1ZW5jZS5zZXF1ZW5jZUNvbG9yID0gb3B0aW9ucy5zZXF1ZW5jZUNvbG9yO1xuICAgICAgICAgICAgICAgIHJlZ2lvbnMucHVzaCh7IHNlcXVlbmNlSWQ6IHNlcXVlbmNlLmlkLCBzdGFydDogMSwgZW5kOiBzZXF1ZW5jZS5zZXF1ZW5jZS5sZW5ndGgsIHNlcXVlbmNlQ29sb3I6IG9wdGlvbnMuc2VxdWVuY2VDb2xvciB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgY29uc2Vuc3VzSW5mb0lkZW50aXR5O1xuICAgICAgICB2YXIgY29uc2Vuc3VzSW5mb1BoeXNpY2FsO1xuICAgICAgICBpZiAob3B0aW9ucy5jb25zZW5zdXNDb2xvcklkZW50aXR5KSB7XG4gICAgICAgICAgICBjb25zZW5zdXNJbmZvSWRlbnRpdHkgPSBDb25zZW5zdXNNb2RlbC5zZXRDb25zZW5zdXNJbmZvKCdpZGVudGl0eScsIHNlcXVlbmNlcyk7XG4gICAgICAgICAgICBfYSA9IENvbnNlbnN1c01vZGVsLmNyZWF0ZUNvbnNlbnN1cygnaWRlbnRpdHknLCBjb25zZW5zdXNJbmZvSWRlbnRpdHksIGZhbHNlLCBzZXF1ZW5jZXMsIHJlZ2lvbnMsIG9wdGlvbnMuZG90VGhyZXNob2xkLCBvcHRpb25zLmNvbnNlbnN1c0NvbG9ySWRlbnRpdHkpLCBzZXF1ZW5jZXMgPSBfYVswXSwgcmVnaW9ucyA9IF9hWzFdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG9wdGlvbnMuY29uc2Vuc3VzQ29sb3JNYXBwaW5nKSB7XG4gICAgICAgICAgICBjb25zZW5zdXNJbmZvUGh5c2ljYWwgPSBDb25zZW5zdXNNb2RlbC5zZXRDb25zZW5zdXNJbmZvKCdwaHlzaWNhbCcsIHNlcXVlbmNlcyk7XG4gICAgICAgICAgICBpZiAoIWNvbnNlbnN1c0luZm9JZGVudGl0eSkge1xuICAgICAgICAgICAgICAgIGNvbnNlbnN1c0luZm9JZGVudGl0eSA9IENvbnNlbnN1c01vZGVsLnNldENvbnNlbnN1c0luZm8oJ2lkZW50aXR5Jywgc2VxdWVuY2VzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9iID0gQ29uc2Vuc3VzTW9kZWwuY3JlYXRlQ29uc2Vuc3VzKCdwaHlzaWNhbCcsIGNvbnNlbnN1c0luZm9QaHlzaWNhbCwgY29uc2Vuc3VzSW5mb0lkZW50aXR5LCBzZXF1ZW5jZXMsIHJlZ2lvbnMsIG9wdGlvbnMuZG90VGhyZXNob2xkLCBvcHRpb25zLmNvbnNlbnN1c0NvbG9yTWFwcGluZyksIHNlcXVlbmNlcyA9IF9iWzBdLCByZWdpb25zID0gX2JbMV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtzZXF1ZW5jZXMsIHJlZ2lvbnNdO1xuICAgIH07XG4gICAgcmV0dXJuIENvbnNlbnN1c01vZGVsO1xufSgpKTtcbmV4cG9ydCB7IENvbnNlbnN1c01vZGVsIH07XG4iLCJ2YXIgRXZlbnRzTW9kZWwgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRXZlbnRzTW9kZWwoKSB7XG4gICAgfVxuICAgIEV2ZW50c01vZGVsLnByb3RvdHlwZS5vblJlZ2lvblNlbGVjdGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc2VxdWVuY2VWaWV3ZXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2VsbCcpO1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgc2VxdWVuY2VWaWV3ZXJzXzEgPSBzZXF1ZW5jZVZpZXdlcnM7IF9pIDwgc2VxdWVuY2VWaWV3ZXJzXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgc3F2ID0gc2VxdWVuY2VWaWV3ZXJzXzFbX2ldO1xuICAgICAgICAgICAgc3F2LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgICAgICAgICB2YXIgZXZ0ID0gbmV3IEN1c3RvbUV2ZW50KCdvblJlZ2lvblNlbGVjdGVkJywgeyBkZXRhaWw6IHsgY2hhcjogci5zcmNFbGVtZW50LmlubmVySFRNTCwgeDogci5zcmNFbGVtZW50LmRhdGFzZXQucmVzWCwgeTogci5zcmNFbGVtZW50LmRhdGFzZXQucmVzWSB9IH0pO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGV2dCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIEV2ZW50c01vZGVsO1xufSgpKTtcbmV4cG9ydCB7IEV2ZW50c01vZGVsIH07XG4iLCJpbXBvcnQgeyBJY29ucyB9IGZyb20gJy4vaWNvbnMnO1xudmFyIEljb25zTW9kZWwgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gSWNvbnNNb2RlbCgpIHtcbiAgICB9XG4gICAgSWNvbnNNb2RlbC5wcm90b3R5cGUucHJvY2VzcyA9IGZ1bmN0aW9uIChyZWdpb25zLCBzZXF1ZW5jZXMsIGljb25zUGF0aHMpIHtcbiAgICAgICAgdmFyIHJvd3MgPSB7fTtcbiAgICAgICAgaWYgKHJlZ2lvbnMgJiYgc2VxdWVuY2VzKSB7XG4gICAgICAgICAgICB2YXIgX2xvb3BfMSA9IGZ1bmN0aW9uIChzZXEpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfYSA9IDAsIHJlZ2lvbnNfMSA9IHJlZ2lvbnM7IF9hIDwgcmVnaW9uc18xLmxlbmd0aDsgX2ErKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVnID0gcmVnaW9uc18xW19hXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCtzZXEuaWQgPT09IHJlZy5zZXF1ZW5jZUlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJvd3Nbc2VxLmlkXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd3Nbc2VxLmlkXSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmZvcmluXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gc2VxdWVuY2VzLmZpbmQoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHguaWQgPT09IHNlcS5pZDsgfSkuc2VxdWVuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgPSAoK2tleSArIDEpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hhcnMgd2l0aCBpY29uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCtrZXkgPj0gcmVnLnN0YXJ0ICYmICtrZXkgPD0gcmVnLmVuZCAmJiByZWcuaWNvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVnLmljb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWdpb24gPSByZWcuZW5kIC0gKHJlZy5zdGFydCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNlbnRlciA9IE1hdGguZmxvb3IocmVnaW9uIC8gMik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaWNvbiA9IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWcuY29sb3IgJiYgcmVnLmNvbG9yWzBdID09PSAnKCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWcuY29sb3IgPSAncmdiJyArIHJlZy5jb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQgaWNvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAocmVnLmljb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdsb2xsaXBvcCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbiA9IEljb25zLmxvbGxpcG9wO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJyb3dSaWdodCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbiA9IEljb25zLmFycm93UmlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdhcnJvd0xlZnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb24gPSBJY29ucy5hcnJvd0xlZnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdzdHJhbmQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb24gPSBJY29ucy5zdHJhbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdub1NlY29uZGFyeSc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbiA9IEljb25zLm5vU2Vjb25kYXJ5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnaGVsaXgnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb24gPSBJY29ucy5oZWxpeDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3R1cm4nOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb24gPSBJY29ucy50dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjdXN0b21pemFibGUgaWNvbnMgKHN2ZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbiA9IHJlZy5pY29uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVnLmRpc3BsYXkgPT09ICdjZW50ZXInICYmICtrZXkgPT09IHJlZy5zdGFydCArIGNlbnRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd3Nbc2VxLmlkXVtrZXldID0geyBjaGFyOiBpY29uIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICghcmVnLmRpc3BsYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dzW3NlcS5pZF1ba2V5XSA9IHsgY2hhcjogaWNvbiB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoYXJzIHdpdGhvdXQgaWNvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcm93c1tzZXEuaWRdW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93c1tzZXEuaWRdW2tleV0gPSB7IGNoYXI6ICcnIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgc2VxdWVuY2VzXzEgPSBzZXF1ZW5jZXM7IF9pIDwgc2VxdWVuY2VzXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlcSA9IHNlcXVlbmNlc18xW19pXTtcbiAgICAgICAgICAgICAgICBfbG9vcF8xKHNlcSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZpbHRlcmVkUm93cyA9IHt9O1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Zm9yaW5cbiAgICAgICAgZm9yICh2YXIgcm93IGluIHJvd3MpIHtcbiAgICAgICAgICAgIHZhciBmbGFnID0gdm9pZCAwO1xuICAgICAgICAgICAgdmFyIGNoYXJzID0gcm93c1tyb3ddO1xuICAgICAgICAgICAgZm9yICh2YXIgY2hhciBpbiByb3dzW3Jvd10pIHtcbiAgICAgICAgICAgICAgICBpZiAocm93c1tyb3ddW2NoYXJdLmNoYXIgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGZsYWcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmbGFnKSB7XG4gICAgICAgICAgICAgICAgZmlsdGVyZWRSb3dzW3Jvd10gPSBjaGFycztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmlsdGVyZWRSb3dzO1xuICAgIH07XG4gICAgcmV0dXJuIEljb25zTW9kZWw7XG59KCkpO1xuZXhwb3J0IHsgSWNvbnNNb2RlbCB9O1xuIiwidmFyIEljb25zID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEljb25zKCkge1xuICAgIH1cbiAgICBJY29ucy5sb2xsaXBvcCA9ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjAuN2VtXCIgeD1cIjBcIiB5PVwiMFwiIGlkPVwibG9sbGlwb3BcIiB2aWV3Qm94PVwiMCAwIDM0MC4xNiA5NTAuOTNcIj48cGF0aCBmaWxsPVwicmdiKDI1NSwgOTksIDcxKVwiIGQ9XCJNMzExLjQ2NSwxNDEuMjMyYzAsNzgtNjMuMjMxLDE0MS4yMzItMTQxLjIzMiwxNDEuMjMyICBjLTc4LDAtMTQxLjIzMi02My4yMzItMTQxLjIzMi0xNDEuMjMyUzkyLjIzMiwwLDE3MC4yMzIsMEMyNDguMjMzLDAsMzExLjQ2NSw2My4yMzIsMzExLjQ2NSwxNDEuMjMyeiBNMTk0LDI4MC44NzhoLTQ3Ljk4M1Y1NjYuOTMgIEgxOTRWMjgwLjg3OHpcIi8+PC9zdmc+JztcbiAgICBJY29ucy5hcnJvd0xlZnQgPSAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIwLjdlbVwiIGlkPVwiTGl2ZWxsb18xXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB2aWV3Qm94PVwiMCAwIDk2My43OCAxNTg3LjRcIiBlbmFibGUtYmFja2dyb3VuZD1cIm5ldyAwIDAgOTYzLjc4IDE1ODcuNFwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+PHJlY3Qgc3R5bGU9XCJmaWxsOnRyYW5zcGFyZW50XCIgeD1cIjAuNDc3XCIgeT1cIjQxMi44MThcIiBzdHJva2U9XCIjMDAwMDAwXCIgc3Ryb2tlLW1pdGVybGltaXQ9XCIxMFwiIHdpZHRoPVwiOTYzLjc4MVwiIGhlaWdodD1cIjc2My42MzZcIi8+PGc+PGRlZnM+PHJlY3Qgd2lkdGg9XCI5NjRcIiBoZWlnaHQ9XCIxNTg3XCI+PC9yZWN0PjwvZGVmcz48Y2xpcFBhdGg+PHVzZSBvdmVyZmxvdz1cInZpc2libGVcIj48L3VzZT48L2NsaXBQYXRoPjxwb2x5Z29uIHN0eWxlPVwiZmlsbDojRkRERDBEO1wiIGZpbGwtcnVsZT1cImV2ZW5vZGRcIiBjbGlwLXJ1bGU9XCJldmVub2RkXCIgcG9pbnRzPVwiMTU4OS42NCw0MTEuNzcgMTU4OS42NCwxMTc5LjM3ICAgIDc1Ni4wNCwxMTc5LjM3IDc1Ni4wNCwxNTkxLjE1IDAsNzk1LjU3IDc1Ni4wNCwwIDc1Ni4wNCw0MTEuNzcgIFwiPiA8L3BvbHlnb24+PC9nPjwvc3ZnPic7XG4gICAgSWNvbnMuYXJyb3dSaWdodCA9ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjAuN2VtXCIgaWQ9XCJMYXllcl8xXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB2aWV3Qm94PVwiMCAwIDk2NCAxNTg3XCIgZW5hYmxlLWJhY2tncm91bmQ9XCJuZXcgMCAwIDk2NCAxNTg3XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj4gIDxpbWFnZSBpZD1cImltYWdlMFwiIHdpZHRoPVwiOTY0XCIgaGVpZ2h0PVwiMTU4N1wiIHg9XCIwXCIgeT1cIjBcIiBocmVmPVwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUE4UUFBQVl6Q0FNQUFBQUYzUVREQUFBQUJHZEJUVUVBQUxHUEMveGhCUUFBQUNCalNGSk4gQUFCNkpnQUFnSVFBQVBvQUFBQ0E2QUFBZFRBQUFPcGdBQUE2bUFBQUYzQ2N1bEU4QUFBQnpsQk1WRVgvLy8vLy9mUCs2MjcrNjNILyAvT2YvL092OTNRMzk0emIvL096OTVENy8vZkw5NVVqLy92Yis1MUwvL3ZuKzZGNy8vL3orNldMLy8vMys2Mi8vLy83KzdYeis3b1QrIDhKWDkzUTcrOHFMOTNRLys4Nmo5M2hIKzlMUDkzaFQrOXI3OTNoZi85OGo5M3huLytNejkzeDcvK2RUOTRDVC8rdHo5NFNyLysrUDkgNGpMLy9Pbis2RjMrNldIKzdIdis3WUwrOFpyKzg2Zis5TEwrOXIzLzk4Zi8rTXY5NGkzLy9PYjk0elg5NUQzLy9mSDk1VWYrNTFIKyA1MWIvL3ZyKzZtMys3SHIrN1lIKzhKVCs4Wm4rOHFiKzlMSDkzaFgrOXNILytkUC8rK1grNWxEKzUxWCs3SG4rN1lEKzc0cis4cVgrIDlyeis5c0Q5M3hqLytNcjk0Q1AvK3R2OTRTbjk0U3o5NUR6OTVVYis1a3YrNldEKzZteis3WC8rN29uOTNSRCs5TEQ5M2hMKzliWDkgM3gzLytkTDk0Q2IvK3Q3LysrVDk0alQvL3ZYOTVrcis1MVQrNm12KzdYNys3b2YrOEpqKzhxVCs5ci8vOThuLytkSC8rdHIvL09yOSA1RHYvL2ZEOTVELys1MVArNkYvKzdYMys3b2IrOEpmKzhxUCs5Sy8rOUxUOTRCLy8rZFg5NENYLyt0Mzk0U3Y5NGpQOTVVbis2bXIrIDYzRCs4SmI5M3h6Kzc0djkzaFArN29qOTR6dis3b1AvL2UvKzdIajk1RUQrN29YLytORDk1VVgrNldQKzlLNys4cUhTRGdYUUFBQUEgQVdKTFIwUUFpQVVkU0FBQUFBbHdTRmx6QUFBQVlBQUFBR0FBOEd0Q3p3QUFBQWQwU1UxRkIrUU1DZ29qSS9vVmZaUUFBQytxU1VSQiBWSGphN2QxM2d4M0Z2ZWRoTGF5YVpHQUFZNFpoRUVLSUpCQW1yOGpZZ0M3UmdCQUlFU3hBWklISk9Rb1EwUXNzMTlkMzk5MnVUVlNZIGNNN3BydjVWZUo1WFVGMTFQdjlKMzFtenBpNy80N0RERGp2OGYwYWZBcGpaMnU1ZmpqZ3kraGpBckg2TXVEdnE2T2h6QURQNktlTHUgbU45Rkh3U1l6YzhSZDhjZUYzMFNZQ2EvUk53ZFB4ZDlGR0FXdjBiY25YQmk5Rm1BR2Z3V2NYZlM3Nk1QQTB4dnY0aTdrNk1QQTB4diAvNGk3UDBTZkJwamFBUkYzcDBRZkI1aldnUkhQbnhwOUhtQktCMGJjTFp3V2ZTQmdPZ2RGM0MyZUhuMGlZQ29IUjl5dE95UDZTTUEwIERvbTRXMzltOUptQUtSd2FjYmZock9oREFaTmJJdUp1NDluUnB3SW10bFRFM1RublJoOExtTlNTRVhmbm5SOTlMbUJDUzBmY2Jib2cgK21EQVpKYUoyT3dXbEdLNWlNMXVRU0dXamRqc0ZwUmgrWWpOYmtFUlZvaTR1M0F1K25UQXFsYUt1TnRzZGd1eXQyTEUzV0ZtdHlCMyBLMGZjWFJSOVBtQVZxMFRjL1RINmdNREtWb3ZZN0Jaa2J0V0l1NHVqandpc1pQV0lGeTZKUGlPd2d0VWo3aFl2alQ0a3NMd0pJdTdXIFhSWjlTbUJaazBUY3JiODgrcGpBY2lhS3VOdHdSZlE1Z1dWTUZySFpMY2pXaEJHYjNZSmNUUnF4MlMzSTFNUVJkMWYrcitpekFrdVkgUE9KdWk5a3R5TkFVRVhkWFhSMTlXdUFRMDBUY1hXTjJDN0l6VmNUZHRXYTNJRGZUUmR4ZGQzMzBnWUVEVFJseHQza3Urc1RBQWFhTiB1THZCN0Jaa1plcUl1eHVqand6c2IvcUl1ejlGbnhuWXp3d1JkMytPUGpUd20xa2k3bTZLUGpYd3E1a2lYcmc1K3RqQUwyYUt1RnU4IEpmcmN3TTltaTlqc0ZtUmp4b2k3cmY4UmZYTGdSN05HYkhZTE1qRnp4TjNHVzZQUERxenBFN0haTGNoQ2o0ak5ia0VPK2tUY1hYbGIgOVBHQlhoRjNXOVpHbngrYTF5OWlzMXNRcm1mRVpyY2dXdCtJdTl2TmJrR28zaEYzZDVqZGdrajlJemE3QmFFR2lOanNGa1FhSXVMdSB6dWl2Z0lZTkVuRjNWL1JuUUx1R2liajdTL1IzUUxNR2l0anNGa1FaS3VLRnU2Ty9CQm8xVk1SbXR5RElZQkYzNis2Si9oWm8wbkFSIGQxdnZqZjRZYU5HQUVYZmI3b3YrR21qUWtCR2IzWUlBZzBiY2JiOC8rbnVnT2NORzNEMWdkZ3RHTm5ERTNRNnpXekN1b1NNMnV3VWogR3p6aTdrR3pXekNtNFNQdWRwcmRnaEVsaUxoN1NNVXduaFFSbTkyQ0VTV0p1SHQ0THZxN29CbHBJdTRlTWJzRkkwa1VzZGt0R0V1cSBpTHRIbzc4TUdwRXM0dTZ2MFo4R2JVZ1hzZGt0R0VYQ2lNMXV3UmdTUnR6dGVpejY2NkFCS1NQdUhuOGkrdk9nZmtrak5yc0Y2YVdOIDJPd1dKSmM0NG03M2s5RmZDSlZMSGJIWkxVZ3NlY1RkVTA5SGZ5TlVMWDNFM1k1bm9qOFNhalpDeE4yelpyY2duVEVpTnJzRkNZMFMgY2JmenVlanZoR3FORTNIM3ZOa3RTR1NraUxzOVpyY2dqYkVpTnJzRmlZd1djZmVDMlMxSVlieUl1OE5WREFtTUdISDNZdlRIUW8zRyBqTGo3Vy9UWFFvVkdqYmg3S2Zwem9UN2pSanovY3ZUM1FuWEdqZGpzRmd4dTVJak5ic0hReG82NDIvcEs5Q2REWFVhUHVOdjJhdlEzIFExWEdqN2piL1ZyMFIwTk5BaUx1dHI4ZS9kVlFrWWlJelc3QmdFSWlOcnNGdzRtSnVIdjJqZWdQaDFvRVJkeTkrVmIwbDBNbG9pTHUgM2o0Nit0T2hEbUVSbTkyQ1ljUkYzTDF6WFBUSFF3MENJKzdlbll2K2VxaEFaTVJtdDJBQW9SR2IzWUwrWWlQdTNvditmaWhlY01UZCArOUVYQUtXTGpyajdJUG9Hb0hEaEVjOS9HSDBGVUxid2lMdGRIMFhmQVJRdFB1SnU4ZVBvUzRDU1pSQnh0L1dNNkZ1QWd1VVFzZGt0IDZDR0xpTTF1d2V6eWlMamIrMG4wUlVDcE1vbTQrL1N6Nkp1QVF1VVNjYmZQN0JiTUpKdUl1OC9OYnNFczhvblk3QmJNSktPSXpXN0IgTEhLS3VQdkM3QlpNTGF1SXpXN0I5UEtLdUR0K0x2cENvRFNaUmR4OWFiQUhwcE5ieE4xWEtvYXBaQmV4MlMyWVRuNFJtOTJDcVdRWSBjZmQxOUtWQVNYS00yT3dXVENISGlMdUYwNkt2QmNxUlpjVGQ0dW5SOXdMRnlEUGlicDNaTFpoUXBoRjM2OCtNdmhrb1JLNFJkOStZIDNZS0paQnR4dC9mczZMdUJJdVFic2RrdG1FakdFWGY3em8rK0hTaEF6aEYzbTh4dXdhcXlqcmc3NHNqbys0SHM1UjF4ZDVUWkxWaEYgNWhGM3g1amRncFhsSG5GM3JOa3RXRkgyRVp2ZGdwWGxIM0Yzd29uUmx3UTVLeURpN2lTelc3QzhFaUx1VG82K0pjaFlFUkYzZjRpKyBKc2hYR1JGM3AwVGZFMlNya0lqblQ0MitLTWhWSVJHYjNZTGxsQkt4MlMxWVJqRVJtOTJDcFpVVHNka3RXRkpCRVhjYnpvcStMY2hRIFNSR2IzWUlsRkJWeGQ4NjUwZmNGMlNrcjR1NDhzMXR3a01JaU5yc0ZCeXN0WXJOYmNKRGlJamE3QlFjcUwyS3pXM0NBQWlNMnV3WDcgS3pIaTdzSzU2R3VEZkJRWmNiZlo3QmI4b3N5SXU4UE1ic0hQQ28yNHV5ajY0aUFYcFViYy9USDY1aUFUeFVac2RndCtVbTdFM2NYUiBkd2RaS0RqaWhVdWlMdzl5VUhERTNlS2wwYmNIR1NnNVlyTmJzS2J3aUx2MWwwZmZINFFyTytKdXd4WFJGd2pSQ28rNDIyaDJpOWFWIEhySFpMWnBYZk1SbXQyaGQrUkYzbXk2SXZrU0lWRUhFM1Jhelc3U3Nob2k3cTY2T3ZrYUlVMFhFM1RWbXQyaFhIUkYzMTVyZG9sbVYgUk54ZGQzMzBUVUtRV2lMdU5zOUZYeVhFcUNiaTdnYXpXN1Nwbm9pN0c2UHZFa0pVRkhIM3ArakxoQWcxUmR6OU9mbzJJVUJWRVhjMyBSVjhuaksrdWlCZHVqcjVQR0YxZEVYZUx0MFJmS0l5dHNvaTdkWmRGM3lpTXJMYUl1NjMvRVgybE1LN3FJamE3Uld2cWk3amJlR3YwIHBjS1lLb3pZN0JadHFURmlzMXMwcGNxSXV5dHZpNzVYR0UyZEVYZGIxa1pmTEl5bDBvak5idEdPV2lNMnUwVXpxbzI0dTkzc0ZtMm8gTitMdURyTmJOS0hpaU0xdTBZYWFJemE3UlJPcWp0anNGaTJvTytMdXJ1ajdoZVFxajdqN2UvUUZRMnExUjJ4MmkrcFZIL0hDM2RGWCBER2xWSDdIWkxXcFhmOFJtdDZoY0F4RjNXKytOdm1WSXFJV0l1MjMzUlY4enBOTkV4R2EzcUZrYkVYZmI3NCsrYUVpbGtZaTdCOHh1IFVhdFdJdTUybU4yaVVzMUViSGFMV3JVVGNmZWcyUzJxMUZERTNVNnpXOVNvcFlpN2gxUk1oWnFLMk93V05Xb3JZck5iVktpeGlMdEggekc1Um05WWk3dTZNdm5FWVdITVJkNDlHWHprTXE3Mkl1NzlHM3prTXFzR0l6VzVSbHhZak5ydEZWVnFNdUZ0OExQcmFZVGhOUnR6OSA3M3VpN3gwRzAyYkVacmVvU0tNUm05MmlIcTFHM08xK012cnFZUmpOUm14MmkxcTBHM0gzMU5QUmx3OURhRGppYnNjejBiY1BBMmc1IDR1NVpzMXRVb09tSXpXNVJnN1lqN25ZK0YvMEEwRmZqRVhmUG05MmlkSzFIM08weHUwWGhtbys0ZTNndStnMmdGeEYzTDVqZG9tZ2kgN3JyRFZVekpSUHd2TDBhL0F2UWc0bi83TnZvWllIWWkvdEZMMGU4QU14UHhqK1pmam40SW1KV0lmN0xyc2VpWGdCbUorR2VQUHhIOSBGREFiRWY5aTZ5dlJid0V6RWZHdnRyMGEvUmd3Q3hIL3h1d1dSUkx4ZnJhL0h2MGNNRDBSNzgvc0ZnVVM4UUhNYmxFZUVSL0k3QmJGIEVmRkIzbndyK2tsZ09pSSsyTnRIUjc4SlRFWEVoekM3UlZsRWZLZzl4MFcvQ2t4QnhFdDRkeTc2V1dCeUlsNksyUzBLSXVJbG1kMmkgSENKZW10a3RpaUhpWmJ3Zi9USXdJUkV2NTRQb3A0SEppSGc1WnJjb2hJaVh0ZXVqNk1lQlNZaDRlWXNmUjc4T1RFREVLOWg2UnZUeiB3T3BFdkJLeld4UkF4Q3ZhL1ZyMEE4RnFSTHl5dlo5RXZ4Q3NRc1NyK1BTejZDZUNsWWw0TmZ2TWJwRTNFYS9xOHplaUh3bFdJdUxWIG1kMGlheUtlZ05rdGNpYmlTWHhoZG90OGlYZ2k3NWpkSWxzaW5zenhjOUV2QmNzUThZUytOTmhEcGtROHFhOVVUSjVFUExIM290OEsgbGlUaXlabmRJa3NpbnNMWDBhOEZTeER4Rk9ZL2pINHVPSlNJcDdGd1d2Ujd3U0ZFUEpYRjA2TWZEQTRtNHVtc003dEZia1E4cGZWbiBSajhaSEVqRTAvckc3Qlo1RWZIVTlwNGQvV2l3UHhGUHord1dXUkh4RFBhZEgvMXM4QnNSejhMc0Zoa1I4VXkrTTd0Rk5rUThtNlBNIGJwRUxFYy9vR0xOYlpFTEVzenJXN0JaNUVQSE16RzZSQnhIUDdvUVRvMThQMW9pNGw1UE1icEVCRWZkeGN2VHpnWWg3K2tQMCs0R0kgZXpLN1JUZ1I5ek4vYXZRTDBqd1I5MlIyaTJnaTdzdnNGc0ZFM0p2WkxXS0p1RCt6VzRRUzhRQTJuQlg5akxSTXhFTXd1MFVnRVEvaSAwM09qSDVKMmlYZ1k1NW5kSW9xSUI3TEo3QlpCUkR5VUk0Nk1ma3NhSmVMQm1OMGlob2lIWTNhTEVDSWVrTmt0SW9oNFNCZk9SYjhuIERSTHhvTXh1TVQ0UkQrc3dzMXVNVGNRRHV5ajZSV21PaUlmMmZmU1QwaG9SRCs2VTZEZWxNU0llM3NYUmowcGJSRHk4aFV1aVg1V20gaURpQnhVdWpuNVdXaURnRnMxdU1TTVJKckw4OCttRnBoNGpUMkhCRjlNdlNEQkVuc3RIc0ZpTVJjU3JubU4xaUhDSk94dXdXNHhCeCBPcHN1aUg1ZG1pRGloTGFZM1dJRUlrN3BxcXVqMzVjR2lEaXBhOHh1a1p5STA3clc3QmFwaVRpeDY2NlBmbUpxSitMVU5wdmRJaTBSIEoyZDJpN1JFbk42TjBZOU0zVVE4Z2o5RnZ6SlZFL0VZekc2UmtJaEhjVlAwTzFNeEVZOWk0ZWJvaDZaZUloNkgyUzJTRWZGSTFsMFcgL2RUVVNzUmpNYnRGSWlJZWpka3QwaER4ZURiZUd2M2FWRW5FSXpLN1JRb2lIcFBaTFJJUThhaXV2QzM2d2FtUGlNZGxkb3ZCaVhoayBacmNZbW9qSFpuYUxnWWw0ZExlYjNXSlFJaDdmSFdhM0dKS0lBMnllaTM1MmFpTGlDRGVZM1dJNElnNXhZL1M3VXhFUng3Z3IrdUdwIGg0aUQvRDM2NWFtR2lLT1kzV0lnSW82eWNIZjAyMU1KRVlkWnZDWDY4YW1EaU9PWTNXSVFJZzYwOWQ3bzU2Y0dJbzYwNGI3bzk2Y0MgSWc1bGRvditSQnhyKy8zUnZ3Q0tKK0pnRDVqZG9pY1JSek83UlU4aURyZGxiZlNQZ0xLSk9ONkRacmZvUThRWjJHbDJpeDVFbklPSCBWRHlxLzFPWGM2Ti92L3piTzhienhyUXIrcjJwa2RtdE1ZbVlGQjR4dXpVZUVaUEVuZEcvN0lhSW1EUWVqZjVwdDBQRUpQTFg2TjkyIE0wUk1LbWEzUmlKaVVqRzdOUklSazR6WnJYR0ltSFRXM1JQOSsyNkNpRW5JN05ZWVJFeEsyOHh1cFNkaWt0cjlaUFJQdkg0aUppMnogVzhtSm1NU2VlanI2UjE0N0VaUGFEck5iYVltWTVKNDF1NVdVaUVuUDdGWlNJbVlFTzUrTC9xSFhUTVNNNFhtelcrbUltRkhzdVQ3NiBwMTR2RVRPT2grZWlmK3ZWRWpFamVjSHNWaUlpWml3L1JQL1lheVZpUnZOaTlLKzlVaUptUE45Ry85enJKR0pHOUZMMDc3MUtJbVpFIDh5OUgvK0JySkdMR3RPdXg2Rjk4aFVUTXFCNS9Jdm9uWHg4Uk02NnRyMFQvNXFzallrYTI3ZFhvSDMxdFJNell6RzROVE1TTWJ2dnIgMFQvN3VvaVk4Wm5kR3BTSUNiRGptZWdmZmsxRVRBU3pXd01TTVNIZWZDdjZwMThQRVJQalA0K08vdTFYUThRRU1iczFGQkVUWmM5eCAwYi8rU29pWU1PL09SZi84NnlCaTRwamRHb1NJQ1hTNGlnY2dZaUtaM1JxQWlBbjFmblFCRlJBeHNUNklUcUI4SWlhVzJhM2VSRXl3IFhSOUZSMUE2RVJQdDhZK2pLeWljaUFtMzlZem9ETW9tWXVLWjNlcEZ4R1JnOTJ2UklaUk14T1JnN3lmUkpSUk14R1RoMDgraVV5aVggaU1uRFByTmJzeEl4bWZqOGplZ1lTaVZpY21GMmEwWWlKaHR2bTkyYWlZakp4eGRtdDJZaFlqTHlqdG10R1lpWW5Cdy9GMTFFZ1VSTSBWcjQwMkRNMUVaT1hyMVE4TFJHVG1mZWlteWlPaU1tTjJhMHBpWmpzbU4yYWpvakp6dnlIMFZtVVJjVGtaK0cwNkM2S0ltSXl0UGh4IGRCZ2xFVEU1TXJzMUJSR1RwZlZuUnFkUkRoR1RwMi9NYmsxS3hHVEs3TmFrUkV5dXpHNU5TTVJrYTkvNTBYbVVRY1RreSt6V1JFUk0geHI0enV6VUJFWk96bzh4dXJVN0VaTzBZczF1ckVqRjVPOWJzMW1wRVRPYk1icTFHeE9UdWhCT2pLOG1jaU1uZVNXYTNWaVJpOG5keSBkQ1o1RXpFRitFZDBKMWtUTVNYNE9qcVVuSW1ZRXN5ZkdsMUt4a1JNRWN4dUxVL0VsR0h4OU9oV3NpVmlDckhPN05ZeVJFd3B6RzR0IFE4UVU0NXYvaXM0bFR5S21ISHZQanU0bFN5S21JR2EzbGlKaVNtSjJhd2tpcGlpYnpHNGRRc1NVNVlnam81dkpqb2dwak5tdGc0bVkgMHBqZE9vaUlLWTdaclFPSm1QSmNPQmZkVFZaRVRJSE1idTFQeEpUSTdOWitSRXlSTG9vdUp5TWlwa3pmUjZlVER4RlRxRk9pMjhtRyBpQ25WeGRIeDVFTEVsR3Joa3VoNk1pRmlpbVYyNnljaXBseG10MzRrWWdxMi92TG9nSElnWWtxMjRhem9naklnWW9xMjBleVdpQ25jIE9lZEdOeFJPeEJUdXZPWm50MFJNNlRaZEVGMlJpS0dmMW1lM1JFejVycm82dWlNUlF6L1hORDI3SldKcWNHM0xzMXNpcGdyWFhSK2Qga29paG44M3R6bTZKbUVvYzF1enNsb2lwUmJPeld5S21HbitLcmtuRTBGT2pzMXNpcGlJWFIvY2tZdWhuNGVib29FUU0vU3hlR2wyVSBpS0dmZFpkRkp5Vmk2S2ZCMlMwUlU1a05WMFJISldMb1orT3QwVldKR1BwcGJYWkx4TlNuc2RrdEVWT2hLMitMRGt2RTBNK1dsbWEzIFJFeVZXcHJkRWpGMWFtaDJTOFJVNnZabVpyZEVUSzN1YUdWMlM4UlVhL05jZEY0aWhuNXVhR04yUzhSVTdNYm92a1FNUGQwVkhaaUkgb2FjL1J4Y21ZdWpwcHVqRVJBejlOREM3SldJcXQzaExkR1FpaG42cW45MFNNZFhiZW05MFppS0dmaXFmM1JJeERhaDdka3ZFdEdENyAvZEdsaVJqNmVhRGkyUzBSMDRhS1o3ZEVUQ08yckkyT1RjVFF6NE8xem02Sm1HYnNySFIyUzhTMDQ2RTZLeFl4RGFsemRrdkV0S1RLIDJTMFIwNVJIS3B6ZEVqRnR1VE02T1JGRFQ0OUdOeWRpNk9rdjBkR0pHSHFxYlhaTHhEUm40ZTdvN0VRTS9WUTJ1eVZpR3JUdW51ancgUkF6OVZEVzdKV0thdE8yKzZQUkVEUDNzZmpLNlBSRkRQL1hNYm9tWVZqMzFkSFI5SW9aK2RsUXl1eVZpMnZWc0hiTmJJcVpoZGN4dSBpWmlXN1h3dXVrQVJRei9QVnpDN0pXTGF0cWY4MlMwUjA3aUg1NklqRkRIMDgwTHBzMXNpcG5rL1JGY29ZdWlwOE5rdEVVUDNiWFNIIElvYWVYb29PVWNUUXozekpzMXNpaG4vWjlWaDBpaUtHZmg1L0lycEZFVU0vVzErSmpsSEUwRSt4czFzaWhwK1ZPcnNsWXZqRjl0ZWogZXhReDlGUG03SmFJNFRjN25va3VVc1RRVDRteld5S0cvYjM1Vm5TVElvWisvbG5jN0phSTRVREZ6VzZKR0E2eTU3am9MRVVNL2J3NyBGOTJsaUtHZnNtYTNSQXlIT3J5a2lrVU1TM2d4dWt3UlEwOS9pMDVUeE5EVEI5RnRpaGo2bVg4NU9rNFJReis3UG9xdVU4VFFUeW16IFd5S0c1V3c5STdwUEVVTS8yMTZORGxURTBNL3UxNklMRlRIMHMvZVQ2RVJGRFAxOCtsbDBveUtHZnZabFA3c2xZbGpaNTI5RVZ5cGkgNkNmMzJTMFJ3MnJlUGpxNlV4RkRQMTlrUGJzbFlsamRPem5QYm9rWUpuRDhYSFNxSW9aK3ZzeDNzRWZFTUpHdnNxMVl4RENaOTZKaiBGVEgwOUg1MHJTS0duaktkM1JJeFRHcit3K2hlUlF6OUxKd1dIYXlJb1ovRmo2T0xGVEgwaytQc2xvaGhHdHZPakc1V3hORFBOOW5OIGJva1lwcFBkN0phSVlVcTV6VzZKR0thMTcvem9ia1VNL2VRMXV5VmltTjUzT2MxdWlSaG1rTlBzbG9oaEZzZmtNN3NsWXBqSnNkbk0gYm9rWVpwUE43SmFJWVViL2ZXSjB2aUtHZms3S1kzWkx4REN6azZQN0ZUSDA5SS9vZ0VVTVBYMGRYYkNJb1ovNVU2TVRGakgwazhIcyBsb2lobDhYVFJReGxXeGM5dXlWaTZHbDk4T3lXaUtHdjROa3RFVU52ZTg4V01aUXRkSFpMeERDQXlOa3RFY01RTnNYTmJva1lCbkhFIGtTS0dzaDBWTmJzbFloaEkxT3lXaUdFb1FiTmJJb2JCWERnbllpamJDUkd6V3lLR0FVWE1ib2tZaGhRd3V5VmlHTlQzSW9iQ25TSmkgS052b3Mxc2lob0V0WENKaUtOdklzMXNpaHNHTk83c2xZaGplK3N0RkRHWGJjSmFJb1d3Yng1dmRFakVrY2M2NUlvYXluVGZXN0phSSBJWkZORjRnWXlqYlM3SmFJSVptanJoWXhsTzJhTVdhM1JBd0pYVHZDN0phSUlhWHJyaGN4bEcxejh0a3RFVU5haDZXZTNSSXhKSGFSIGlLRndmeFF4RkM3dDdKYUlJYjJMUlF4bFN6cTdKV0lZd2VLbElvYXlyYnRNeEZDMmRMTmJJb1p4YkxoQ3hGQzJqYmVLR01xV2FIWkwgeERDYU5MTmJJb2J4WEhtYmlLRnNXeExNYm9rWXhuVFY4TE5iSW9aUkRUKzdKV0lZMStDeld5S0drZDB4OE95V2lHRnNtK2RFREdXNyBZZERaTFJIRCtHNFVNUlR1TGhGRDRmNHNZaWpjVFNLR3NpM2NMR0lvMitJdElvYXlEVFc3SldLSXN2VmVFVVBaaHBuZEVqSEVHV1IyIFM4UVE2Sno3UlF4bGU2RC83SmFJSVZULzJTMFJRNnd0YTBVTVplczd1eVZpaUxhejMreVdpQ0hjN2IxbXQwUU04WHJOYm9rWU10Qm4gZGt2RWtJTkhacC9kRWpGazRVNFJRK0ZtbnQwU01XVGlMeUtHd3MwNHV5Vml5TVhDM1NLR3NzMDJ1eVZpeU1lNmUwUU1aWnRsZGt2RSBrSk50OTRrWXlyYjdTUkZEMmJaUE83c2xZc2pNVTArTEdNcTJZN3JaTFJGRGRwNmRhblpMeEpDZkI2ZVozUkl4WkdqbmN5S0dzajAvICtYaWVpQ0ZMZXlhZTNSSXg1T25oT1JGRDJTYWQzUkl4NU9vSEVVUGhIaFV4Rk81YkVVUGhYaEl4bEcxK2d0a3RFVVBPZGowbVlpamIgNDArSUdNcTI5UlVSUTlsV205MFNNZVJ1bGRrdEVVUDJ0cjh1WWlqYmlyTmJJb1lDN0hoR3hGQzJGV2EzUkF4RmVQTXRFVVBaL3ZtYyBpS0ZzeTgxdWlSaEtzZWM0RVVQWjNwMFRNWlR0aGQrTEdNcDIrTzlGREdWN1VjUlF1TCtKR0FyM2tvaWhiUE12aXhqS3R1c2pFVVBaIERwcmRFakVVNThEWkxSRkRlYmE5S21JbzIrN1hSQXhsMjI5MlM4UlFwS2MrRXpHVWJkOHpJb2F5ZmY2R2lLRnNQODl1aVJpSzlmYlIgSW9heWZmRTdFVVBaM2psT3hGQzJkK2RFREdYN280aWhhTSt1RlRHVTdOOS9hRTNFVUs0Zi8rU3BpS0ZZUC8wdkNCRkRxWFkvNlY5cyBRY2wrV1FZUU1aVHAxNDBlRVVPUmZsdkxFekdVYU5kamxqMmdaUHN2eUlzWUNyVC8zM0lSTVpUblc3dlRVTFFELzc2cGlLRTBQL2hiIFRGQzBGMzR2WWlqWnczUCt0Q21VYk0vMS9zZzRsT3o1MzYwUk1SUnM1M05yUkF3RmUvRHFOU0tHZ2oyN2RvMklvV0E3YmxzallpalkgajROYUlvWmliYjkvallpaFlEOFBhb2tZQ3JYdHZqVWlob0p0dlhlTmlLRmc2KzVaSTJJbzJPSXRhMFFNQlZ1NGU0MklvV1EzclJFeCBsT3l2YTBRTUpYdDBqWWloWkhldTFyQ0lJV3VQL0Y3RVVMTE5jNnMyTEdMSTJCM1hyOTZ3aUNGZkQvMXVnb1pGRE5uYU9WSERJb1pjIExUbW9KV0lveHBhMWt6VXNZc2pUbGJkTjJMQ0lJVXNQbkQ5cHd5S0dIQzA3cUNWaUtNTEdXeWR2V01TUW53MzNUZEd3aUNFN0t3MXEgaVJqeXQrNnlxUm9XTVdSbTVVRXRFVVB1Rm02ZXNtRVJRMTV1bXJaaEVVTlcvajUxd3lLR25OdzFmY01paG96Y09FUERJb1o4M0xENiBvSmFJSVdPVERHcUpHUEkxMGFDV2lDRmJ0eDgzVzhNaWhqeGNNOW1nbG9naFUxZE5PS2dsWXNqVGxpTm5ibGpFa0lISkI3VkVERGs2IGIvSkJMUkZEaHM0NXQwL0RJb1pvVXcxcWlSaXlzK0dLZmcyTEdHS3R2N3hud3lLR1VOTU9hb2tZOHJKNGFlK0dSUXlCcGgvVUVqRmsgWmZwQkxSRkRUazRab21FUlE1Zy9EZEt3aUNIS1JjTTBMR0lJY3RoTWcxb2lobHhzUG5HZ2hrVU1JYTZiY1ZCTHhKQ0hhMmNkMUJJeCBaR0gyUVMwUlF3NTZER3FKR0RMUVoxQkx4QkJ2MHdXRE5peGlHRm0vUVMwUlE3U2VnMW9paG1BYnp4NjZZUkhEbURhY05YakRJb1lSIDlSL1VFakZFV25kR2dvWkZES01aWWxCTHhCQm40WklrRFlzWXhuSnhtb1pGRENNWlpsQkx4QkRsKzFRTml4aEdNZFNnbG9naHhtQ0QgV2lLR0VDY01OcWdsWW9odzRWekNoa1VNeVIwNzRLQ1dpR0Y4eHd3NXFDVmlHTjFSUjZkdFdNU1ExaEhERG1xSkdFYTI2WTNVRFlzWSBVdG8zOUtDV2lHRlVuMzZXdm1FUlF6cDdoeC9VRWpHTUtNV2dsb2hoUE92UEhLVmhFVU1pYVFhMVJBeGpXVHg5cElaRkRFa3NuRFpXIHd5S0dGT1pQSGExaEVVTUtYNC9Yc0lnaGdUK00yTENJWVhnbmo5bXdpR0Z3SnlVYzFCSXhwSmQwVUV2RWtOenhjK00yTEdJWVZ1SkIgTFJGRFlxa0h0VVFNYVNVZjFCSXhKUFhkVytNM0xHSVl6dWZwQjdWRURBbU5NYWdsWWtobmxFRXRFVU15ZXorSmFWakVNSXh2WGd0cSBXTVF3aUxFR3RVUU1hV3dkYTFCTHhKREU0c2R4RFlzWStodHhVRXZFa01EOGg1RU5peGg2RzNOUVM4UXd2UGRqR3hZeDlQUmVjTU1pIGhuNitHbmRRUzhRd3NDL0RHeFl4OURINm9KYUlZVkR2akQ2b0pXSVkwaGZqRDJxSkdBYjBkc0NnbG9oaE9HOUdER3FKR0FZVE02Z2wgWWhqS3ZtZWk0eFV4OUJFMXFDVmlHRWJZb0phSVlSQzd3d2ExUkF4RDJQWnFkTGdpaGo0aUI3VkVEUDA5L25GMHRpS0dQblo5RkYydCBpS0dQK1plam94VXg5UEpCZExNaWhsNmlCN1ZFRFAyOEdGMnNpS0dYdytQSGVFUU1QYnlRWThNaWhvbTlPeGZkcTRpaGp6MDVER3FKIEdHYjJmQmFEV2lLR1dmMW5Ib05hSW9ZWjVUS29KV0tZemJOcm8xTVZNZlN4STV0QkxSSERMSjU2T2pwVUVVTWYyMStQN2xURTBNZnUgSjZNekZUSDBrZGVnbG9oaFdsdGZpWTVVeE5ESDQwOUVOeXBpNkdQWFk5R0ppaGo2eUc5UVM4UXdsWmVpQXhVeDlQSnRkSjhpaGw0ZSBqYzVUeE5ETEQ5RjFpaGg2eVhOUVM4UXdxWWZub3VNVU1mU3g1L3JvTmtVTWZXUTdxQ1ZpbU1qTzU2TExGREgwOGVEVjBXR0tHUHJJIGVWQkx4TEM2SGJkRlp5bGk2Q1B2UVMwUncycTIzeDhkcFlpaGo5d0h0VVFNSzl0MlgzU1NJb1krdHQ0YlhhU0lvWTkxOTBRSEtXTG8gWS9HVzZCNUZESDBzM0IyZG80aWhsNXVpYXhReDlQS1g2QmhGREwwVU1xZ2xZbGpHbmRFcGloaDZlYVNVUVMwUnc1STJ6MFdYS0dMbyA0NDV5QnJWRURFdDRxS0JCTFJIRG9YYVczYkNJYVY1Wmcxb2lob050S1d0UVM4UndrQ3NMRzlRU01Sem9nZk9qRXhReDlGSGVvSmFJIFlYOGJiNDBPVU1UUXg0WUNCN1ZFREw4cGNsQkx4UENyZFpkRjF5ZGk2S1BRUVMwUnc4OFdibzV1VDhUUVM2bURXaUtHbi93OXVqd1IgUXk5M1JZY25ZdWpseHVqdVJBeTkzRkR3b0phSW9mQkJMUkZENFlOYUlvYmJqNHVPVHNUUXh6V0ZEMnFKbU5aZFZmcWdsb2hwM0pZaiBvNHNUTWZSUndhQ1dpR25hZVJVTWFvbVlscDF6Ym5SdUlvWSs2aGpVRWpIdDJuQkZkR3dpaGo3V1h4N2Rtb2loajJvR3RVUk1veFl2IGpTNU54TkJIUllOYUlxWk5GUTFxaVpnbW5SS2RtWWlobHo5RlZ5Wmk2T1dpNk1oRURMMGNWdGVnbG9ocHp1WVRveHNUTWZSeFhXMkQgV2lLbU1kZFdONmdsWXRwUzRhQ1dpR2xLallOYUlxWWxSOVE0cUNWaUdyTHBndWk2UkF4OVZEcW9KV0thVWV1Z2xvaHB4Y2F6bzlNUyBNZlN4NGF6b3NrUU1mVlE4cUNWaW1yRHVqT2l1UkF4OUxKNGVuWldJb1krRlM2S3JFakgwY25GMFZDS0dYaW9mMUJJeDFmcytPaWtSIFF5L1ZEMnFKbU1yVlA2Z2xZdXAyUXYyRFdpS21haGZPUmZja1l1amoyQllHdFVSTXhZNXBZbEJMeE5UcnFLT2pZeEl4OU5IS29KYUkgcWRXbU42SlRFakgwc2ErWlFTMFJVNmRQUDRzT1NjVFF4OTZHQnJWRVRJMmFHdFFTTVJWYWYyWjBSU0tHUGhvYjFCSXgxV2x0VUV2RSAxR2JodE9pRTRvbVlrczJmR2wxUUJrUk15YjZPRGlnSElxWmcvNGp1SndzaXBsd25SK2VUQnhGVHJKTmFITlJhZ29ncFZadURXa3NRIE1ZVTZmaTQ2bmx5SW1ESzFPcWkxQkJGVHBHWUh0WllnWWtyMGRyT0RXa3NRTVFYNjdxM29jSElpWXNyemVjT0RXa3NRTWNWcGVsQnIgQ1NLbU5HMFBhaTFCeEJSbTd5ZlIwZVJHeEpUbG05ZWltOG1PaUNsSzg0TmFTeEF4SmRuYS9LRFdFa1JNUVJZL2pnNG1SeUttSEFhMSBsaVJpaWpIL1lYUXVlUkl4eGZnZ3VwWk1pWmhTdkI4ZFM2NUVUQ0hlaTI0bFd5S21ERjhaMUZxT2lDbkNseHBlbG9ncGdVR3RGWWlZIEFyeGpVR3NGSWlaL1h4alVXb21JeVo1QnJaV0ptTnk5YVZCclpTSW1jd2ExVmlOaThyYnZtZWhHc2lkaXNtWlFhM1VpSm1jR3RTWWcgWWpLMjI2RFdCRVJNdnJhOUd0MUhFVVJNdGd4cVRVYkU1T3J4ajZQcktJU0l5ZFN1ajZMaktJV0l5ZFA4eTlGdEZFUEU1TW1nMXNSRSBUSllNYWsxT3hPVG94ZWd3U2lKaU1uUzRNWjRwaUpqOHZLRGhhWWlZN0x3N0Y1MUZXVVJNYnZZWTFKcU9pTW5NOHdhMXBpUmk4dkxQIDU2S2JLSTZJeVlwQnJlbUptSnc4dXphNmlBS0ptSXpzTUtnMUF4R1RqNmVlanU2aFNDSW1HOXRmajg2aFRDSW1GN3Vmaks2aFVDSW0gRXdhMVppVmk4ckQxbGVnV2lpVmlzdkQ0RTlFcGxFdkU1R0RYWTlFbEZFekVaR0QrN3VnUVNpWmlNdkJTZEFkRkV6SHh2bzNPb0d3aSBKdHlqMFJVVVRzUkUreUU2Z3RLSm1HQUd0Zm9TTWJFZW5vdHVvSGdpSnRTZTY2TVRLSitJaVdSUWF3QWlKdEJPZzFvREVERnhIcnc2ICt2ZGZCUkVUeHFEV01FUk1sQjIzUmYvNkt5RmlnaGpVR29xSWliSDkvdWpmZmpWRVRBaURXc01STVJHMjNSZjl5NitJaUFtdzlkN28gSDM1TlJNejQxdDBUL2J1dmlvZ1ozZUl0MFQvN3VvaVlzUzBZMUJxV2lCbmJUZEUvK3RxSW1KSDlKZm8zWHgwUk15NkRXb01UTWFPNiBNL29YWHlFUk02WkhER29OVDhTTWFQTmM5QSsrUmlKbVBIY1kxRXBCeEl6bUlZTmFTWWlZc2V6VWNCb2laaVFHdFZJUk1lUFlZbEFyIEZSRXppaXNOYWlVallzYnd3UG5Sdi9TS2laZ1JHTlJLU2NTa3QvSFc2Tjk1MVVSTWNodXVpUDZaMTAzRXBHWlFLekVSazlpNnk2Si8gNUxVVE1Xa1oxRXBPeENTMWNIUDBUN3grSWlZcGcxcnBpWmlVL2h6OUEyK0JpRW5vcnVqZmR4TkVURG8zUnYrODJ5Qmlrcm5Cb05ZbyBSRXdxQnJWR0ltSVNNYWcxRmhHVHh1M0hSZisybXlGaWtyakdvTlpvUkV3S1Z4blVHbytJU1dETGtkRS83Slo4OUgrcjh2K2lmNzM4IG0wRXRacmMyK3VmTHY1eG5VSXZaaVRnRDU1d2IvVE9nWkNLT1oxQ0xYa1FjenFBVy9ZZzQydnJMbzM4REZFN0V3UXhxMFplSVl5MWUgR3YwTG9IZ2lEbVZRaS81RUhPcmk2UGVuQWlLT2RFcjA4MU1ERVFmNlUvVHJVd1VSeDdrbyt2R3BnNGpESEdaUWkwR0lPTXJtRTZQZiBua3FJT01oMUJyVVlpSWhqWEd0UWk2R0lPSVJCTFlZajRnZ0d0UmlRaUFNY1lWQ0xBWWw0ZkpzdWlINTFxaUxpMFJuVVlsZ2lIcHRCIExRWW00cEZ0UER2NnlhbU5pTWUxNGF6b0Y2YzZJaDZWUVMyR0orSXhyVHNqK3IycGtJaEh0SGg2OUhOVEl4R1BaK0dTNk5lbVNpSWUgejhYUmowMmRSRHdhZzFxa0llS3hmQi85MU5SS3hDTXhxRVVxSWg3SFNRYTFTRVhFb3pqQm9CYkppSGdNRjg1RnZ6TVZFL0VJampXbyBSVUlpVHU4WWcxcWtKT0xrampvNitwR3BtNGhUTTZoRllpSk9iTk1iMFU5TTdVU2MxajZEV3FRbTRxUSsvU3o2Z2FtZmlGUGFhMUNMIDlFU2MwRGYvRmYyOHRFREU2YXcvTS9wMWFZS0lrekdveFRoRW5JcEJMVVlpNGtRV1RvdCtXbG9oNGpUbVQ0MStXWm9oNGpTK2puNVkgMmlIaUpQNFIvYTQwUk1RcG5CejlyTFJFeEFrWTFHSk1JaDZlUVMxR0plTEJIVDhYL2FpMFJjUkRNNmpGeUVROE1JTmFqRTNFdzNyYiBvQlpqRS9HZ3Zuc3Ira0ZwajRpSDlMbEJMY1luNGdFWjFDS0NpSWRqVUlzUUloN00zaytpSDVNMmlYZ28zN3dXL1pZMFNzUUQyV1pRIGl5QWlIc1pXZzFwRUVmRWdGaitPZmtqYUplSWhHTlFpa0lnSE1QOWg5RFBTTWhFUDRJUG9WNlJwSXU3di9laEhwRzBpN3UyOTZEZWsgY1NMdTZ5dURXc1FTY1U5ZmFwaGdJdTdIb0JiaFJOekxPd2ExQ0NmaVByNHdxRVU4RWZkZ1VJc2NpSGgyYnhyVUlnY2lucGxCTGZJZyA0bG50ZXliNjdlQkhJcDZSUVMxeUllTFpHTlFpR3lLZXlXNkRXbVJEeExQWTltcjB1OEd2UkR3RGcxcmtSTVRUZS96ajZGZUQvWWg0IGFycytpbjQwMkorSXB6WC9jdlNid1FGRVBDMkRXbVJHeEZQNlcvU0x3VUZFUEowWG94OE1EaWJpcVJ4dWpJZnNpSGdhTDJpWS9JaDQgQ3UvT1JUOFhIRXJFazl0alVJc2NpWGhpenh2VUlrc2ludFEvbjR0K0sxaVNpQ2RrVUl0Y2lYZ3l6NjZOZmlsWWhvZ25zc09nRnRrUyA4U1NlZWpyNm5XQlpJcDdBOXRlam53bVdKK0xWN1g0eStwVmdCU0plbFVFdDhpYmkxV3g5SmZxTllFVWlYc1hqVDBRL0VheE14Q3ZiIDlWajBDOEVxUkx5aStidWpId2hXSStJVnZSVDlQckFxRWEvazIram5nZFdKZUFXUFJyOE9URURFeS9zaCtuRmdFaUplbGtFdHlpRGkgNVR3OEYvMDJNQkVSTDJQUDlkRlBBNU1SOGRJTWFsRU1FUzlwcDBFdGlpSGlwVHg0ZGZTN3dNUkV2QVNEV3BSRXhJZmFjVnYwcThBVSBSSHdJZzFxVVJjUUgyMzUvOUp2QVZFUjhFSU5hbEViRUI5cDJYL1NMd0pSRWZJQ3Q5MFkvQ0V4THhQdGJkMC8wZThEVVJMeWZ4VnVpIG53T21KK0xmTEJqVW9rUWkvczFOMFk4QnN4RHhyLzRTL1JZd0V4SC93cUFXaFJMeHorNk1mZ21Za1loLzhvaEJMVW9sNGg5dG5vdCsgQ0ppVmlQL3REb05hbEV2RS8vS1FRUzBLSnVLdTI2bGhTaVppZzFvVVRzUmJER3BSdHVZanZ0S2dGb1ZyUGVJSHpvOStBZWlwOFlnTiBhbEcrdGlQZWVHdjAvVU52VFVlODRZcm82NGYrV283WW9CWlZhRGppZFpkRlh6NE1vZDJJRFdwUmlXWWpYcmc1K3VwaEdNMUdiRkNMIFdyUWE4WitqTHg2RzBtakVkMFhmT3d5bXpZaHZqTDUyR0U2VEVkOWdVSXVLdEJpeFFTMnEwbURFQnJXb1Mzc1IzMzVjOUozRG9KcUwgK0JxRFdsU210WWl2TXFoRmJScUxlTXVSMFJjT1Eyc3JZb05hVktpcGlNOHpxRVdGV29yNG5IT2pieHNTYUNoaWcxclVxWjJJRFdwUiBxV1lpWG45NTlGVkRHcTFFYkZDTGFqVVM4ZUtsMFJjTnFiUVJzVUV0S3RaR3hCZEhYek9rMDBURXAwVGZNaVRVUXNSL2pMNWtTS21CIGlDK0t2bU5JcXY2SUR6T29SZDJxajNqemlkRlhER25WSHZGMUJyV29YZVVSWDJ0UWkrclZIYkZCTFJwUWRjUkhHZFNpQVRWSGZJUkIgTFZwUWNjU2JMb2krWEJoRHZSRWIxS0lSMVVac1VJdFcxQnJ4eHJPamJ4WkdVbW5FRzg2S3ZsZ1lTNTBSRzlTaUlWVkd2TzZNNkd1RiA4ZFFZOGVMcDBiY0tJNm93NG9WTG9pOFZ4bFJmeFBNWFI5OHBqS3EraUExcTBaanFJdjQrK2taaFpMVkZiRkNMNWxRVzhVa0d0V2hPIFhSR2ZZRkNMOWxRVjhZVnowZGNKNDZzcDRtTU5hdEdpaWlJK3hxQVdUYW9uNHFPT2pyNUxDRkZOeEFhMWFGVXRFVzk2SS9vbUlVZ2wgRWU4enFFV3o2b2o0MDgraTd4SENWQkh4WG9OYU5LeUdpTDk1TGZvV0lWQUZFYTgvTS9vU0lWTDVFUnZVb25IRlIyeFFpOWFWSHZIQyBhZEUzQ01FS2ozaisxT2dMaEdpRlIveDE5UDFCdUxJai9rZjA5VUc4b2lNK09mcjJJQU1sUjJ4UUM5WVVIZkYvRzlTQ05TVkhmUHhjIDlOMUJGb3FOMktBVy9LVFVpQTFxd2M4S2pmaHRnMXJ3c3pJai91NnQ2SHVEYkJRWjhlY0d0ZUJYSlVac1VBdjJVMkRFQnJWZ2YrVkYgdlBlVDZEdURyQlFYc1VFdE9GQnBFVzh6cUFVSEtpemlyUWExNENCbFJiejRjZlI5UVhhS2l0aWdGaHlxcElqblA0eStMY2hRU1JGLyBFSDFaa0tPQ0luNC8rcTRnUytWRS9GNzBWVUdlaW9uNEs0TmFzS1JTSXY1U3c3QzBRaUkycUFYTEtTUGlkd3hxd1hLS2lQZ0xnMXF3IHJCSWlOcWdGS3lnZzRqY05hc0VLOG8vWW9CYXNLUHVJOXowVGZVV1F0OXdqTnFnRnE4ZzhZb05hc0pxOEk5NXRVQXRXazNYRTIxNk4gdmg3SVg4NFJHOVNDQ1dRYzhlTlBSRjhPbENEZmlIZDlGSDAzVUlSc0k1NS9PZnBxb0F6WlJteFFDeWFUYThSL2k3NFlLRVdtRWI4WSBmUzlRakR3alB0d1lEMHdxeTRoZjBEQk1MTWVJMzUyTHZoVW9TSVlSN3pHb0JWUElMK0xuRFdyQk5MS0wrSi9QUlY4SmxDVzNpQTFxIHdaUXlpL2padGRFWEFxWEpLK0lkQnJWZ1dsbEYvTlRUMGRjQjVja3A0dTJ2Ujk4R0ZDaWppSGMvR1gwWlVLSjhJdDUyWC9SZFFKR3kgaVhqcks5RlhBV1hLSldLRFdqQ2pUQ0xlOVZqMFJVQ3A4b2g0L3U3b2U0Qmk1Ukh4UzlIWEFPWEtJdUp2bzI4QkNwWkR4STlHWHdLVSBMSU9JZjRpK0F5aGFmTVFHdGFDWDhJZ2Zub3UrQWloYmRNUjdybysrQVNoY2NNUUd0YUN2MkloM0d0U0N2a0lqZnZEcTZNK0g4a1ZHIGJGQUxCaEFZOFk3Ym9qOGVhaEFYc1VFdEdFUll4TnZ2ai81MHFFTlV4QWExWUNCQkVSdlVncUhFUkx6MTN1anZobXFFUkx6dW51alAgaG5wRVJMeDRTL1JYUTBVQ0lsNHdxQVVEQ29qNHB1aHZocXFNSC9GZm9qOFo2ako2eEFhMVlGaGpSM3huOUFkRGJVYU8rQkdEV2pDdyBjU1BlUEJmOXZWQ2RVU08rdzZBV0RHN01pQjh5cUFYREd6SGluUnFHQk1hTDJLQVdKREZheEZzTWFrRVNZMFY4cFVFdFNHT2tpQjg0IFAvcERvVmJqUkh5T1FTMUlaWlNJTjk0YS9abFFyekVpM25CRjlGZEN4VWFJMktBV3BKUSs0bldYUlg4alZDMTV4QWExSUszVUVTL2MgSFAyRlVMblVFUnZVZ3NRU1Ivem42TytENnFXTitLN296NFA2SlkzNHh1aXZnd2FralBnR2cxcVFYc0tJRFdyQkdOSkZiRkFMUnBFcyA0dHVQaS80MGFFT3FpSzh4cUFYalNCVHhWUWExWUNScEl0NXlaUFIzUVRPU1JHeFFDOGFUSXVMekRHckJlQkpFZk02NTBSOEZMUmsrIFlvTmFNS3JCSXphb0JlTWFPdUwxbDBkL0VUUm00SWdOYXNIWWhvMTQ4ZExvNzRIbURCcnh3aVhSbndQdEdUVGlpNk8vQmhvMFpNU24gUkg4TXRHakFpUDhZL1MzUXBPRWl2aWo2VTZCTmcwVjhtRUV0Q0RGVXhKdFBqUDRTYU5SQUVWOW5VQXVDREJQeHRRYTFJTW9nRVJ2VSBnamhEUkh5VVFTMklNMERFUnhqVWdrRDlJOTUwUWZRM1FOTjZSMnhRQzJMMWpkaWdGZ1RyR2ZIR3M2TS9BRnJYTCtJTlowV2ZINXJYIEsyS0RXaEN2VDhUcnpvZytQZEFuNHNYVG93OFA5SW5Zb0Jaa1llYUk1eStPUGpyd2J6TkhiRkFMOGpCcnhOOUhIeHo0eVl3Um54eDkgYnVCbnMwVjhra0V0eU1WTUVaOWdVQXV5TVV2RUY4NUZueHI0MVF3UkgydFFDekl5ZmNUSEdOU0NuRXdkOFZGSFJ4OFoyTiswRVJ2VSBnc3hNR2ZHbU42SVBEQnhvdW9qM0dkU0MzRXdWOGFlZlJSOFhPTmcwRWU4MXFBWDVtU0xpYjE2TFBpeHdxTWtqWG45bTlGbUJKVXdjIHNVRXR5Tk9rRVJ2VWdreE5HUEhDYWRFSEJaWTJXY1R6cDBhZkUxakdaQkYvSFgxTVlEa1RSZnlQNkZNQ3k1b2tZb05ha0xFSklqYW8gQlRsYlBlTC9OcWdGT1ZzMTR1UG5vbzhJckdTMWlBMXFRZVpXaWZnTGcxcVF1WlVqZnR1Z0Z1UnV4WWkvZXl2NmVNQnFWb3I0YzROYSBrTDhWSWphb0JTVllQbUtEV2xDRVpTUGUrMG4wMFlCSkxCZXhRUzBveERJUmJ6T29CWVZZT3VLdEJyV2dGRXRHdlBoeDlMR0FTUzBWIHNVRXRLTWdTRWM5L0dIMG9ZSEpMUlB4QjlKbUFLUndhOGZ2UlJ3S21jVWpFNzBXZkNKakt3UkYvWlZBTHluSlF4RjlxR0FwellNVHYgemtXZkI1alNBUkcvWTFBTGlyTi94QWExb0VEN1JXeFFDMHIwVzhSdkd0U0NFdjBhc1VFdEtOTXZFZTk3SnZva3dFeCtqdmdwZzFwUSBxSjhpM3Y1NjlEbUFHZjBZOFc2RFdsQ3NmMGU4N2RYb1V3QXpXMnRRQzhxMnRudjhpZWd6QUQyczNmVlI5QkdBUG81OE9mb0VNTEwvIEQxcHdXZlNsWndtK0FBQUFKWFJGV0hSa1lYUmxPbU55WldGMFpRQXlNREl3TFRFeUxURXdWREV3T2pNMU9qTTFLekF3T2pBd3BKcjAgY1FBQUFDVjBSVmgwWkdGMFpUcHRiMlJwWm5rQU1qQXlNQzB4TWkweE1GUXhNRG96TlRvek5Tc3dNRG93TU5YSFRNMEFBQUFBU1VWTyBSSzVDWUlJPVwiLz48L3N2Zz4nO1xuICAgIEljb25zLnN0cmFuZCA9ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjAuN2VtXCIgaWQ9XCJMaXZlbGxvXzFcIiB4PVwiMHB4XCIgeT1cIjBweFwiIHZpZXdCb3g9XCIwIDAgOTYzLjc4IDE1ODcuNFwiIGVuYWJsZS1iYWNrZ3JvdW5kPVwibmV3IDAgMCA5NjMuNzggMTU4Ny40XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj48cmVjdCBzdHlsZT1cImZpbGw6I0ZEREQwRDtcIiB4PVwiMC40NzdcIiB5PVwiNDEyLjgxOFwiIHN0cm9rZT1cIiMwMDAwMDBcIiBzdHJva2UtbWl0ZXJsaW1pdD1cIjEwXCIgd2lkdGg9XCI5NjMuNzgxXCIgaGVpZ2h0PVwiNzYzLjYzNlwiLz48L3N2Zz4nO1xuICAgIEljb25zLm5vU2Vjb25kYXJ5ID0gJzxzdmcgeD1cIjBweFwiIHk9XCIwcHhcIiB3aWR0aD1cIjAuN2VtXCIgdmlld0JveD1cIjAgMCA5NjMuNzggMTU4Ny40XCI+PHJlY3Qgc3R5bGU9XCJmaWxsOiM3MDZGNkY7XCIgeD1cIjAuNDc4XCIgeT1cIjY2NS41NDVcIiB3aWR0aD1cIjk2My43ODFcIiBoZWlnaHQ9XCIyNTYuMzY0XCIvPjwvc3ZnPic7XG4gICAgSWNvbnMuaGVsaXggPSAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIwLjdlbVwiIGlkPVwiTGl2ZWxsb18xXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB2aWV3Qm94PVwiMCAwIDk2My43OCAxNTg3LjRcIiBlbmFibGUtYmFja2dyb3VuZD1cIm5ldyAwIDAgOTYzLjc4IDE1ODcuNFwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+PHBhdGggZD1cIk0wLDY2NS41NDVcIi8+PHBhdGggc3R5bGU9XCJmaWxsOnJnYigyNDAsMCwxMjgpO1wiIGQ9XCJNNyw2OTFjLTIuODI1LDU5LjY1OSw4LjQzNSwxMTYuNjUzLDYuOTYyLDE3Ni4zMDkgIGMtMi4xMjYsODYuMTE5LDguOTk5LDE2OC45NTMsMjEuOTY3LDI1My43NGM3LjY3Myw1MC4xNywxNi4xODMsMTAwLjI3MSwyNy43NjIsMTQ5LjcwNmMxNy41MzgsNzQuODczLDM1LjYzNSwxNDguNDAyLDgxLjgwMSwyMTEuMzUgIGMzMy4wMzcsNDUuMDQ1LDc2LjU0Miw2OS44NTksMTMwLjUyMSw3OS4wNTZjMTQ3Ljk1OSwyNS4yMDgsMjI1LjE4Ny0xMTEuMjI5LDI1MS45MjktMjMyLjY3NCAgYzIwLjU1My05My4zNDgsMjYuMDI3LTE4OC45OTYsMzUuOTYzLTI4My44MjdjMTIuMTYtMTE2LjA5NS05Ljg1NC0yNDkuMTM5LDUxLjUzNS0zNTQuNTMzICBjMjYuMjE2LTQ1LjAwOCw3OS45MTItODcuODExLDEzNC4wNDQtOTMuNjdjNjUuNDk3LTcuMDksMTEzLjY4OSw1Mi41OSwxMzUuMzg0LDEwNy41MDYgIGMyNS42NDgsNjQuOTI3LDMzLjMyMiwxNDEuNTc5LDcwLjE4NCwyMDEuNTI4YzE3LjI0NC0xNi4yNjEsMTAuMzIzLTcwLjU3LDkuNDg3LTk1LjE0Yy0xLjUwNi00NC4zMDcsMC44MjMtODMuMzM5LTYuOTYxLTEyNi45NiAgYy0yMC4zOTUtMTE0LjI3OS0yMi45OTItMjM2LjgwNC01NC41NjUtMzQ3LjgwOEM4NjguMzQsMjEzLjY3OCw4MTIuNjYzLTYyLjYwMiw2MjcuMjU3LDEyLjQ1OSAgQzQ3OS41MzgsNzIuMjY0LDQ0OC44OTMsMjc3Ljc3MSw0MzEuMTQ3LDQxNy4xOWMtOC40ODEsNjYuNjMyLTEzLjg1NCwxMzMuNjIzLTIyLjU4MSwyMDAuMjI1ICBjLTguNDU3LDY0LjU0NC01LjksMTI3LjU5My0yMi40NDQsMTkxLjk3OWMtMTcuNzUyLDY5LjA4OS01NS43MzksMTc2Ljk0Ny0xMjkuOTg3LDIwMi45NTJjLTM0LjYzMywxMi4xMjctNzIuNzI3LDcuNjQ2LTEwNC0xMC43ODcgIEMzOS4xOTMsOTM0Ljk4Nyw1NS4zMjYsNzg2LjEyOCw3LDY4MVwiLz48L3N2Zz4nO1xuICAgIEljb25zLnR1cm4gPSAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIwLjdlbVwiIGlkPVwiTGl2ZWxsb18xXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB2aWV3Qm94PVwiMCAwIDk2My43OCAxNTg3LjRcIiBlbmFibGUtYmFja2dyb3VuZD1cIm5ldyAwIDAgOTYzLjc4IDE1ODcuNFwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+PHBhdGggZmlsbD1cIiM2MDgwZmZcIiBzdHJva2U9XCIjMDAwMDAwXCIgc3Ryb2tlLXdpZHRoPVwiNVwiIHN0cm9rZS1taXRlcmxpbWl0PVwiMTBcIiBkPVwiTTEyNi44MzYsNzA0LjE0NGMtNDIuOTk2LDI4LjU0LTg1LjEwMy00LjY4OC0xMjMuNTQxLTI4LjE3ICBjNS40MTYsMy4zMDktMS44MDMsODMuMjQ5LTEuMDA0LDkzLjQ0YzMuNDM4LDQzLjg4OSwxLjI4Miw4MC4yOTgsMjguNzYzLDExNi4xNzFjNjIuNDQ1LDgxLjUxNywyMTAuNzc1LDk0LjQwMiwyNjcuMDMyLTEuOTMgIGM1MC45MzktODcuMjI5LDQ2LjI2My0xODYuNTU2LDUzLjQ2Ny0yODMuMzg3YzYuMTEtODIuMTI1LTEuNTg0LTE0Ni40MSw3Ni4yMjEtMTk0LjI1MyAgYzY0LjU2Ny0zOS43MDQsMTM2LjM1NC0xMS40MjEsMTY2LjQ1Nyw1NC4wNjZjNjUuNjY2LDE0Mi44NTMtMTMuMzExLDM3NS4wMjUsMTQ2LjE4NSw0NzAuNTExICBjNDUuODM4LDI3LjQ0MiwxMDguNTU2LDIwLjQ4MywxNTUuMDEzLTEuNjIxYzIxLjcyMy0xMC4zMzYsNTAuMDE0LTI3Ljg1OCw2MC40MzMtNTAuODIyYzExLjczNS0yNS44NjksMi45NjUtNjAuMzA2LDMuNzg3LTg3LjY2MyAgYzEuMDY4LTM1LjU1LDkuMzAyLTc5LjIwOC0wLjYyOC0xMTMuNTk2Yy0yMC42MTcsMTAuOTAzLTMzLjgzMiwzMC4zLTU5LjE0MiwzOC44OTZjLTI4LjYwMSw5LjcxMy02MC43NzcsMTAuNDc5LTgyLjkzNi0xMy4xMjIgIGMtMjYuMTc3LTI3Ljg5MS0xOS40OTctNzIuNjQzLTI0LjAxMy0xMDcuNTA1Yy03Ljk4Ni02MS42NjQtOC44MzMtMTI0LjMzNC0xNC43NDgtMTg2LjIyNyAgQzc2Ni4zOTcsMjg1LjY0MSw3MzguMjg3LDE2MS44Miw2NTEuMDA3LDY4LjgxOEM1ODIuNDgyLTQuMTk4LDQ1Ny44NjMtMTkuODU4LDM3Mi42OTYsMzQuMDIgIGMtNzIuMjQyLDQ1LjcwNS0xMjMuOTkxLDkxLjUzNC0xNTEuMTY0LDE3Ni4wODljLTI5Ljc4MSw5Mi42NzMtMzguNzczLDIwMC4yODUtMzguNDc1LDI5Ny44NjcgIGMwLjE2Nyw1NC44Mi0yLjM0MiwxNTEuMzM0LTQ4LjI0LDE5MC4xNTJDMTMyLjE1NCw3MDAuMzgsMTI5LjQ5Myw3MDIuMzgsMTI2LjgzNiw3MDQuMTQ0elwiLz48L3N2Zz4nO1xuICAgIHJldHVybiBJY29ucztcbn0oKSk7XG5leHBvcnQgeyBJY29ucyB9O1xuIiwidmFyIE9wdGlvbnNNb2RlbCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBPcHRpb25zTW9kZWwoKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGZvbnRTaXplOiAnMTRweCcsXG4gICAgICAgICAgICBjaHVua1NpemU6IDEwLFxuICAgICAgICAgICAgY2h1bmtTZXBhcmF0aW9uOiAxLFxuICAgICAgICAgICAgZW1wdHlGaWxsZXI6ICcgJyxcbiAgICAgICAgICAgIGluZGV4ZXNMb2NhdGlvbjogbnVsbCxcbiAgICAgICAgICAgIHdyYXBMaW5lOiB0cnVlLFxuICAgICAgICAgICAgdmlld2VyV2lkdGg6ICcnLFxuICAgICAgICAgICAgZG90VGhyZXNob2xkOiA5MCxcbiAgICAgICAgICAgIGxpbmVTZXBhcmF0aW9uOiAnNXB4JyxcbiAgICAgICAgICAgIHNlcXVlbmNlQ29sb3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGN1c3RvbVBhbGV0dGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHNlcXVlbmNlQ29sb3JNYXRyaXg6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHNlcXVlbmNlQ29sb3JNYXRyaXhQYWxldHRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBjb25zZW5zdXNDb2xvcklkZW50aXR5OiB1bmRlZmluZWQsXG4gICAgICAgICAgICBjb25zZW5zdXNDb2xvck1hcHBpbmc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHNlbGVjdGlvbjogdW5kZWZpbmVkXG4gICAgICAgIH07XG4gICAgfVxuICAgIE9wdGlvbnNNb2RlbC5wcm90b3R5cGUucHJvY2VzcyA9IGZ1bmN0aW9uIChvcHQsIGNvbnNlbnN1cykge1xuICAgICAgICAvKiogY2hlY2sgaW5wdXQgZm9udFNpemUgKi9cbiAgICAgICAgaWYgKG9wdCAmJiBvcHQuZm9udFNpemUpIHtcbiAgICAgICAgICAgIHZhciBmU2l6ZSA9IG9wdC5mb250U2l6ZTtcbiAgICAgICAgICAgIHZhciBmTnVtID0gK2ZTaXplLnN1YnN0cigwLCBmU2l6ZS5sZW5ndGggLSAyKTtcbiAgICAgICAgICAgIHZhciBmVW5pdCA9IGZTaXplLnN1YnN0cihmU2l6ZS5sZW5ndGggLSAyLCAyKTtcbiAgICAgICAgICAgIGlmIChpc05hTihmTnVtKSB8fCAoZlVuaXQgIT09ICdweCcgJiYgZlVuaXQgIT09ICd2dycgJiYgZlVuaXQgIT09ICdlbScpKSB7XG4gICAgICAgICAgICAgICAgLy8gd3JvbmcgZm9udFNpemUgZm9ybWF0XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZm9udFNpemUgPSBmU2l6ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGZvbnRTaXplIG5vdCBzZXRcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5mb250U2l6ZSA9ICcxNHB4JzsgLy8gZGVmYXVsdCByZXNldFxuICAgICAgICB9XG4gICAgICAgIC8qKiBjaGVjayBpbnB1dCBjaHVua1NpemUgKi9cbiAgICAgICAgaWYgKG9wdCAmJiBvcHQuY2h1bmtTaXplKSB7XG4gICAgICAgICAgICB2YXIgY1NpemUgPSArb3B0LmNodW5rU2l6ZTtcbiAgICAgICAgICAgIGlmIChpc05hTihjU2l6ZSkgfHwgY1NpemUgPCAwKSB7XG4gICAgICAgICAgICAgICAgLy8gd3JvbmcgY2h1bmtTaXplIGZvcm1hdFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmNodW5rU2l6ZSA9IGNTaXplO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8qKiBjaGVjayBpbnB1dCBzcGFjZVNpemUgKi9cbiAgICAgICAgaWYgKG9wdCAmJiBvcHQuY2h1bmtTZXBhcmF0aW9uKSB7XG4gICAgICAgICAgICB2YXIgY2h1bmtTZXBhcmF0aW9uID0gK29wdC5jaHVua1NlcGFyYXRpb247XG4gICAgICAgICAgICBpZiAoY2h1bmtTZXBhcmF0aW9uID49IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuY2h1bmtTZXBhcmF0aW9uID0gY2h1bmtTZXBhcmF0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChvcHQgJiYgb3B0LmNodW5rU2l6ZSA9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuY2h1bmtTaXplID0gMTtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5jaHVua1NlcGFyYXRpb24gPSAwO1xuICAgICAgICB9XG4gICAgICAgIC8qKiBjaGVjayBpbmRleGVzTG9jYXRpb24gdmFsdWUgKi9cbiAgICAgICAgaWYgKG9wdCAmJiBvcHQuaW5kZXhlc0xvY2F0aW9uKSB7XG4gICAgICAgICAgICBpZiAob3B0LmluZGV4ZXNMb2NhdGlvbiA9PSBcInRvcFwiIHx8IG9wdC5pbmRleGVzTG9jYXRpb24gPT0gXCJsYXRlcmFsXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuaW5kZXhlc0xvY2F0aW9uID0gb3B0LmluZGV4ZXNMb2NhdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKiogY2hlY2sgc2VsZWN0aW9uIHZhbHVlICovXG4gICAgICAgIGlmIChvcHQgJiYgb3B0LnNlbGVjdGlvbikge1xuICAgICAgICAgICAgaWYgKG9wdC5zZWxlY3Rpb24gPT0gXCJjb2x1bW5zZWxlY3Rpb25cIiB8fCBvcHQuc2VsZWN0aW9uID09IFwiYXJlYXNlbGVjdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnNlbGVjdGlvbiA9IG9wdC5zZWxlY3Rpb247XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLyoqIGNoZWNrIHNlcXVlbmNlQ29sb3IgdmFsdWUgKi9cbiAgICAgICAgaWYgKG9wdCAmJiBvcHQuc2VxdWVuY2VDb2xvcikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHQuc2VxdWVuY2VDb2xvciAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9wdC5zZXF1ZW5jZUNvbG9yKTtcbiAgICAgICAgICAgICAgICBpZiAoa2V5c1swXS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnNlcXVlbmNlQ29sb3IgPSAnY3VzdG9tJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmN1c3RvbVBhbGV0dGUgPSBvcHQuc2VxdWVuY2VDb2xvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zZXF1ZW5jZUNvbG9yTWF0cml4ID0gJ2N1c3RvbSc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zZXF1ZW5jZUNvbG9yTWF0cml4UGFsZXR0ZSA9IG9wdC5zZXF1ZW5jZUNvbG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChvcHQuc2VxdWVuY2VDb2xvciA9PT0gXCJibG9zdW02MlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zZXF1ZW5jZUNvbG9yTWF0cml4ID0gb3B0LnNlcXVlbmNlQ29sb3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG9wdC5zZXF1ZW5jZUNvbG9yID09PSBcImNsdXN0YWxcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuc2VxdWVuY2VDb2xvciA9IG9wdC5zZXF1ZW5jZUNvbG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKiogY2hlY2sgY29uc2Vuc3VzVHlwZSB2YWx1ZSAqL1xuICAgICAgICBpZiAoY29uc2Vuc3VzICYmIGNvbnNlbnN1cy5jb2xvcikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zZW5zdXMuY29sb3IgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhjb25zZW5zdXMuY29sb3IpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKGtleXNbMF0pID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuY29uc2Vuc3VzQ29sb3JJZGVudGl0eSA9IGNvbnNlbnN1cy5jb2xvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5jb25zZW5zdXNDb2xvck1hcHBpbmcgPSBjb25zZW5zdXMuY29sb3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbnNlbnN1cy5jb2xvciA9PT0gXCJpZGVudGl0eVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5jb25zZW5zdXNDb2xvcklkZW50aXR5ID0gY29uc2Vuc3VzLmNvbG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChjb25zZW5zdXMuY29sb3IgPT09IFwicGh5c2ljYWxcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuY29uc2Vuc3VzQ29sb3JNYXBwaW5nID0gY29uc2Vuc3VzLmNvbG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKiogY2hlY2sgY29uc2Vuc3VzVGhyZXNob2xkIHZhbHVlICovXG4gICAgICAgIGlmIChjb25zZW5zdXMgJiYgY29uc2Vuc3VzLmRvdFRocmVzaG9sZCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zZW5zdXMuZG90VGhyZXNob2xkID09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmRvdFRocmVzaG9sZCA9IGNvbnNlbnN1cy5kb3RUaHJlc2hvbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLyoqIGNoZWNrIHJvd01hcmdpbkJvdHRvbSB2YWx1ZSAqL1xuICAgICAgICBpZiAob3B0ICYmIG9wdC5saW5lU2VwYXJhdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2YXIgclNpemUgPSBvcHQubGluZVNlcGFyYXRpb247XG4gICAgICAgICAgICB2YXIgck51bSA9ICtyU2l6ZS5zdWJzdHIoMCwgclNpemUubGVuZ3RoIC0gMik7XG4gICAgICAgICAgICB2YXIgclVuaXQgPSByU2l6ZS5zdWJzdHIoclNpemUubGVuZ3RoIC0gMiwgMik7XG4gICAgICAgICAgICBpZiAoaXNOYU4ock51bSkgfHwgKHJVbml0ICE9PSAncHgnICYmIHJVbml0ICE9PSAndncnICYmIHJVbml0ICE9PSAnZW0nKSkge1xuICAgICAgICAgICAgICAgIC8vIHdyb25nIGxpbmVTZXBhcmF0aW9uIGZvcm1hdFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmxpbmVTZXBhcmF0aW9uID0gclNpemU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBsaW5lU2VwYXJhdGlvbiBub3Qgc2V0XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMubGluZVNlcGFyYXRpb24gPSAnNXB4JzsgLy8gZGVmYXVsdCByZXNldFxuICAgICAgICB9XG4gICAgICAgIC8qKiBjaGVjayB3cmFwbGluZSB2YWx1ZSAqL1xuICAgICAgICBpZiAob3B0ICYmIHR5cGVvZiBvcHQud3JhcExpbmUgPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMud3JhcExpbmUgPSBvcHQud3JhcExpbmU7XG4gICAgICAgIH1cbiAgICAgICAgLyoqIGNoZWNrIG9uZUxpbmVXaWR0aCAqL1xuICAgICAgICBpZiAob3B0ICYmIG9wdC52aWV3ZXJXaWR0aCkge1xuICAgICAgICAgICAgdmFyIHZpZXdlcldpZHRoID0gb3B0LnZpZXdlcldpZHRoO1xuICAgICAgICAgICAgdmFyIG9sTnVtID0gK3ZpZXdlcldpZHRoLnN1YnN0cigwLCB2aWV3ZXJXaWR0aC5sZW5ndGggLSAyKTtcbiAgICAgICAgICAgIHZhciBvbFVuaXQgPSB2aWV3ZXJXaWR0aC5zdWJzdHIodmlld2VyV2lkdGgubGVuZ3RoIC0gMiwgMik7XG4gICAgICAgICAgICBpZiAoaXNOYU4ob2xOdW0pIHx8IChvbFVuaXQgIT09ICdweCcgJiYgb2xVbml0ICE9PSAndncnICYmIG9sVW5pdCAhPT0gJ2VtJykpIHtcbiAgICAgICAgICAgICAgICAvLyB3cm9uZyBvbmVMaW5lV2lkdGggZm9ybWF0XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMudmlld2VyV2lkdGggPSB2aWV3ZXJXaWR0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zO1xuICAgIH07XG4gICAgcmV0dXJuIE9wdGlvbnNNb2RlbDtcbn0oKSk7XG5leHBvcnQgeyBPcHRpb25zTW9kZWwgfTtcbiIsInZhciBQYWxldHRlcyA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQYWxldHRlcygpIHtcbiAgICB9XG4gICAgLy8gQUEgcHJvcGVuc2l0aWVzXG4gICAgUGFsZXR0ZXMuY2x1c3RhbCA9IHtcbiAgICAgICAgQTogJyM4MGEwZjAnLCBJOiAnIzgwYTBmMCcsIEw6ICcjODBhMGYwJywgTTogJyM4MGEwZjAnLCBGOiAnIzgwYTBmMCcsIFc6ICcjODBhMGYwJywgVjogJyM4MGEwZjAnLFxuICAgICAgICBLOiAnI2YwMTUwNScsIFI6ICcjZjAxNTA1JywgRTogJyNjMDQ4YzAnLCBEOiAnI2MwNDhjMCcsIEM6ICcjZjA4MDgwJywgRzogJyNmMDkwNDgnLFxuICAgICAgICBOOiAnIzE1YzAxNScsIFE6ICcjMTVjMDE1JywgUzogJyMxNWMwMTUnLCBUOiAnIzE1YzAxNScsIFA6ICcjYzBjMDAwJywgSDogJyMxNWE0YTQnLCBZOiAnIzE1YTRhNCdcbiAgICB9O1xuICAgIFBhbGV0dGVzLnphcHBvID0ge1xuICAgICAgICBBOiAnI2ZmYWZhZicsIFI6ICcjNjQ2NGZmJywgTjogJyMwMGZmMDAnLCBEOiAnI2ZmMDAwMCcsIEM6ICcjZmZmZjAwJywgUTogJyMwMGZmMDAnLCBFOiAnI2ZmMDAwMCcsXG4gICAgICAgIEc6ICcjZmYwMGZmJywgSDogJyM2NDY0ZmYnLCBJOiAnI2ZmYWZhZicsIEw6ICcjZmZhZmFmJywgSzogJyNmZmFmYWYnLCBNOiAnI2ZmYzgwMCcsIEY6ICcjZmYwMGZmJyxcbiAgICAgICAgUDogJyMwMGZmMDAnLCBTOiAnIzAwZmYwMCcsIFQ6ICcjMTVjMDE1JywgVzogJyNmZmM4MDAnLCBWOiAnI2ZmYzgwMCcsIFk6ICcjZmZhZmFmJ1xuICAgIH07XG4gICAgUGFsZXR0ZXMudGF5bG9yID0ge1xuICAgICAgICBBOiAnI2NjZmYwMCcsIFI6ICcjMDAwMGZmJywgTjogJyNjYzAwZmYnLCBEOiAnI2ZmMDAwMCcsIEM6ICcjZmZmZjAwJywgUTogJyNmZjAwY2MnLCBFOiAnI2ZmMDA2NicsXG4gICAgICAgIEc6ICcjZmY5OTAwJywgSDogJyMwMDY2ZmYnLCBJOiAnIzY2ZmYwMCcsIEw6ICcjMzNmZjAwJywgSzogJyM2NjAwZmYnLCBNOiAnIzAwZmYwMCcsIEY6ICcjMDBmZjY2JyxcbiAgICAgICAgUDogJyNmZmNjMDAnLCBTOiAnI2ZmMzMwMCcsIFQ6ICcjZmY2NjAwJywgVzogJyMwMGNjZmYnLCBWOiAnIzAwZmZjYycsIFk6ICcjOTlmZjAwJ1xuICAgIH07XG4gICAgUGFsZXR0ZXMuaHlkcm9waG9iaWNpdHkgPSB7XG4gICAgICAgIEE6ICcjYWQwMDUyJywgUjogJyMwMDAwZmYnLCBOOiAnIzBjMDBmMycsIEQ6ICcjMGMwMGYzJywgQzogJyNjMjAwM2QnLCBROiAnIzBjMDBmMycsIEU6ICcjMGMwMGYzJyxcbiAgICAgICAgRzogJyM2YTAwOTUnLCBIOiAnIzE1MDBlYScsIEk6ICcjZmYwMDAwJywgTDogJyNlYTAwMTUnLCBLOiAnIzAwMDBmZicsIE06ICcjYjAwMDRmJywgRjogJyNjYjAwMzQnLFxuICAgICAgICBQOiAnIzQ2MDBiOScsIFM6ICcjNWUwMGExJywgVDogJyM2MTAwOWUnLCBXOiAnIzViMDBhNCcsIFY6ICcjNGYwMGIwJywgWTogJyNmNjAwMDknLFxuICAgICAgICBCOiAnIzBjMDBmMycsIFg6ICcjNjgwMDk3JywgWjogJyMwYzAwZjMnXG4gICAgfTtcbiAgICBQYWxldHRlcy5oZWxpeHByb3BlbnNpdHkgPSB7XG4gICAgICAgIEE6ICcjZTcxOGU3JywgUjogJyM2ZjkwNmYnLCBOOiAnIzFiZTQxYicsIEQ6ICcjNzc4ODc3JywgQzogJyMyM2RjMjMnLCBROiAnIzkyNmQ5MicsIEU6ICcjZmYwMGZmJyxcbiAgICAgICAgRzogJyMwMGZmMDAnLCBIOiAnIzc1OGE3NScsIEk6ICcjOGE3NThhJywgTDogJyNhZTUxYWUnLCBLOiAnI2EwNWZhMCcsIE06ICcjZWYxMGVmJywgRjogJyM5ODY3OTgnLFxuICAgICAgICBQOiAnIzAwZmYwMCcsIFM6ICcjMzZjOTM2JywgVDogJyM0N2I4NDcnLCBXOiAnIzhhNzU4YScsIFY6ICcjMjFkZTIxJywgWTogJyM4NTdhODUnLFxuICAgICAgICBCOiAnIzQ5YjY0OScsIFg6ICcjNzU4YTc1JywgWjogJyNjOTM2YzknXG4gICAgfTtcbiAgICBQYWxldHRlcy5zdHJhbmRwcm9wZW5zaXR5ID0ge1xuICAgICAgICBBOiAnIzU4NThhNycsIFI6ICcjNmI2Yjk0JywgTjogJyM2NDY0OWInLCBEOiAnIzIxMjFkZScsIEM6ICcjOWQ5ZDYyJywgUTogJyM4YzhjNzMnLCBFOiAnIzAwMDBmZicsXG4gICAgICAgIEc6ICcjNDk0OWI2JywgSDogJyM2MDYwOWYnLCBJOiAnI2VjZWMxMycsIEw6ICcjYjJiMjRkJywgSzogJyM0NzQ3YjgnLCBNOiAnIzgyODI3ZCcsIEY6ICcjYzJjMjNkJyxcbiAgICAgICAgUDogJyMyMzIzZGMnLCBTOiAnIzQ5NDliNicsIFQ6ICcjOWQ5ZDYyJywgVzogJyNjMGMwM2YnLCBWOiAnI2QzZDMyYycsIFk6ICcjZmZmZjAwJyxcbiAgICAgICAgQjogJyM0MzQzYmMnLCBYOiAnIzc5Nzk4NicsIFo6ICcjNDc0N2I4J1xuICAgIH07XG4gICAgUGFsZXR0ZXMudHVybnByb3BlbnNpdHkgPSB7XG4gICAgICAgIEE6ICcjMmNkM2QzJywgUjogJyM3MDhmOGYnLCBOOiAnI2ZmMDAwMCcsIEQ6ICcjZTgxNzE3JywgQzogJyNhODU3NTcnLCBROiAnIzNmYzBjMCcsIEU6ICcjNzc4ODg4JyxcbiAgICAgICAgRzogJyNmZjAwMDAnLCBIOiAnIzcwOGY4ZicsIEk6ICcjMDBmZmZmJywgTDogJyMxY2UzZTMnLCBLOiAnIzdlODE4MScsIE06ICcjMWVlMWUxJywgRjogJyMxZWUxZTEnLFxuICAgICAgICBQOiAnI2Y2MDkwOScsIFM6ICcjZTExZTFlJywgVDogJyM3MzhjOGMnLCBXOiAnIzczOGM4YycsIFY6ICcjOWQ2MjYyJywgWTogJyMwN2Y4ZjgnLFxuICAgICAgICBCOiAnI2YzMGMwYycsIFg6ICcjN2M4MzgzJywgWjogJyM1YmE0YTQnXG4gICAgfTtcbiAgICBQYWxldHRlcy5idXJpZWRpbmRleCA9IHtcbiAgICAgICAgQTogJyMwMGEzNWMnLCBSOiAnIzAwZmMwMycsIE46ICcjMDBlYjE0JywgRDogJyMwMGViMTQnLCBDOiAnIzAwMDBmZicsIFE6ICcjMDBmMTBlJywgRTogJyMwMGYxMGUnLFxuICAgICAgICBHOiAnIzAwOWQ2MicsIEg6ICcjMDBkNTJhJywgSTogJyMwMDU0YWInLCBMOiAnIzAwN2I4NCcsIEs6ICcjMDBmZjAwJywgTTogJyMwMDk3NjgnLCBGOiAnIzAwODc3OCcsXG4gICAgICAgIFA6ICcjMDBlMDFmJywgUzogJyMwMGQ1MmEnLCBUOiAnIzAwZGIyNCcsIFc6ICcjMDBhODU3JywgVjogJyMwMGU2MTknLCBZOiAnIzAwNWZhMCcsXG4gICAgICAgIEI6ICcjMDBlYjE0JywgWDogJyMwMGI2NDknLCBaOiAnIzAwZjEwZSdcbiAgICB9O1xuICAgIFBhbGV0dGVzLm51Y2xlb3RpZGUgPSB7XG4gICAgICAgIEE6ICcjNjRGNzNGJywgQzogJyNGRkIzNDAnLCBHOiAnI0VCNDEzQycsIFQ6ICcjM0M4OEVFJywgVTogJyMzQzg4RUUnXG4gICAgfTtcbiAgICBQYWxldHRlcy5wdXJpbmVweXJpbWlkaW5lID0ge1xuICAgICAgICBBOiAnI0ZGODNGQScsIEM6ICcjNDBFMEQwJywgRzogJyNGRjgzRkEnLCBUOiAnIzQwRTBEMCcsIFU6ICcjNDBFMEQwJywgUjogJyNGRjgzRkEnLCBZOiAnIzQwRTBEMCdcbiAgICB9O1xuICAgIFBhbGV0dGVzLmNvbnNlbnN1c0xldmVsc0lkZW50aXR5ID0ge1xuICAgICAgICAxMDA6IFsnIzBBMEEwQScsICcjRkZGRkZGJ10sXG4gICAgICAgIDcwOiBbJyMzMzMzMzMnLCAnI0ZGRkZGRiddLFxuICAgICAgICA0MDogWycjNzA3MDcwJywgJyNGRkZGRkYnXSxcbiAgICAgICAgMTA6IFsnI0EzQTNBMycsICcjRkZGRkZGJ10sXG4gICAgICAgIDA6IFsnI0ZGRkZGRicsICcjRkZGRkZGJ11cbiAgICB9O1xuICAgIC8vIGNvbG91ciBzY2hlbWUgaW4gTGVzaywgSW50cm9kdWN0aW9uIHRvIEJpb2luZm9ybWF0aWNzXG4gICAgUGFsZXR0ZXMuY29uc2Vuc3VzQWFMZXNrID0ge1xuICAgICAgICBBOiBbJ24nLCAnI2YwOTA0OCcsICcjRkZGRkZGJ10sXG4gICAgICAgIEc6IFsnbicsICcjZjA5MDQ4JywgJyNGRkZGRkYnXSxcbiAgICAgICAgUzogWyduJywgJyNmMDkwNDgnLCAnI0ZGRkZGRiddLFxuICAgICAgICBUOiBbJ24nLCAnI2YwOTA0OCcsICcjRkZGRkZGJ10sXG4gICAgICAgIEM6IFsnaCcsICcjNTU4QjZFJywgJyNGRkZGRkYnXSxcbiAgICAgICAgVjogWydoJywgJyM1NThCNkUnLCAnI0ZGRkZGRiddLFxuICAgICAgICBJOiBbJ2gnLCAnIzU1OEI2RScsICcjRkZGRkZGJ10sXG4gICAgICAgIEw6IFsnaCcsICcjNTU4QjZFJywgJyNGRkZGRkYnXSxcbiAgICAgICAgUDogWydoJywgJyM1NThCNkUnLCAnI0ZGRkZGRiddLFxuICAgICAgICBGOiBbJ2gnLCAnIzU1OEI2RScsICcjRkZGRkZGJ10sXG4gICAgICAgIFk6IFsnaCcsICcjNTU4QjZFJywgJyNGRkZGRkYnXSxcbiAgICAgICAgTTogWydoJywgJyM1NThCNkUnLCAnI0ZGRkZGRiddLFxuICAgICAgICBXOiBbJ2gnLCAnIzU1OEI2RScsICcjRkZGRkZGJ10sXG4gICAgICAgIE46IFsncCcsICcjRDQzNThEJywgJyNGRkZGRkYnXSxcbiAgICAgICAgUTogWydwJywgJyNENDM1OEQnLCAnI0ZGRkZGRiddLFxuICAgICAgICBIOiBbJ3AnLCAnI0Q0MzU4RCcsICcjRkZGRkZGJ10sXG4gICAgICAgIEQ6IFsnficsICcjQTEwNzAyJywgJyNGRkZGRkYnXSxcbiAgICAgICAgRTogWyd+JywgJyNBMTA3MDInLCAnI0ZGRkZGRiddLFxuICAgICAgICBLOiBbJysnLCAnIzM2MjZBNycsICcjRkZGRkZGJ10sXG4gICAgICAgIFI6IFsnKycsICcjMzYyNkE3JywgJyNGRkZGRkYnXSAvLyArOiBwb3NpdGl2ZWx5IGNoYXJnZWRcbiAgICB9O1xuICAgIFBhbGV0dGVzLnN1YnN0aXR1dGlvbk1hdHJpeEJsb3N1bSA9IHsgV0Y6IFsnI0NGREJGMicsICcjMDAwMDAwJ10sIFFROiBbJyNBMUI4RTMnLCAnIzAwMDAwMCddLFxuICAgICAgICBISDogWycjNzI5NEQ1JywgJyMwMDAwMDAnXSwgWVk6IFsnIzgxQTBEOScsICcjMDAwMDAwJ10sIFpaOiBbJyNBMUI4RTMnLCAnIzAwMDAwMCddLFxuICAgICAgICBDQzogWycjNjI4OEQwJywgJyMwMDAwMDAnXSwgUFA6IFsnIzgxQTBEOScsICcjMDAwMDAwJ10sIFZJOiBbJyNCMEM0RTgnLCAnIzAwMDAwMCddLFxuICAgICAgICBWTTogWycjQ0ZEQkYyJywgJyMwMDAwMDAnXSwgS0s6IFsnI0ExQjhFMycsICcjMDAwMDAwJ10sIFpLOiBbJyNDRkRCRjInLCAnIzAwMDAwMCddLFxuICAgICAgICBETjogWycjQ0ZEQkYyJywgJyMwMDAwMDAnXSwgU1M6IFsnI0ExQjhFMycsICcjMDAwMDAwJ10sIFFSOiBbJyNDRkRCRjInLCAnIzAwMDAwMCddLFxuICAgICAgICBOTjogWycjOTFBQ0RFJywgJyMwMDAwMDAnXSwgWUY6IFsnI0IwQzRFOCcsICcjMDAwMDAwJ10sIFZMOiBbJyNDRkRCRjInLCAnIzAwMDAwMCddLFxuICAgICAgICBLUjogWycjQzBDRkVEJywgJyMwMDAwMDAnXSwgRUQ6IFsnI0MwQ0ZFRCcsICcjMDAwMDAwJ10sIFZWOiBbJyNBMUI4RTMnLCAnIzAwMDAwMCddLFxuICAgICAgICBNSTogWycjQ0ZEQkYyJywgJyMwMDAwMDAnXSwgTU06IFsnI0ExQjhFMycsICcjMDAwMDAwJ10sIFpEOiBbJyNDRkRCRjInLCAnIzAwMDAwMCddLFxuICAgICAgICBGRjogWycjOTFBQ0RFJywgJyMwMDAwMDAnXSwgQkQ6IFsnI0ExQjhFMycsICcjMDAwMDAwJ10sIEhOOiBbJyNDRkRCRjInLCAnIzAwMDAwMCddLFxuICAgICAgICBUVDogWycjQTFCOEUzJywgJyMwMDAwMDAnXSwgU046IFsnI0NGREJGMicsICcjMDAwMDAwJ10sIExMOiBbJyNBMUI4RTMnLCAnIzAwMDAwMCddLFxuICAgICAgICBFUTogWycjQzBDRkVEJywgJyMwMDAwMDAnXSwgWVc6IFsnI0MwQ0ZFRCcsICcjMDAwMDAwJ10sIEVFOiBbJyNBMUI4RTMnLCAnIzAwMDAwMCddLFxuICAgICAgICBLUTogWycjQ0ZEQkYyJywgJyMwMDAwMDAnXSwgV1c6IFsnIzM4NjdCQycsICcjMDAwMDAwJ10sIE1MOiBbJyNDMENGRUQnLCAnIzAwMDAwMCddLFxuICAgICAgICBLRTogWycjQ0ZEQkYyJywgJyMwMDAwMDAnXSwgWkU6IFsnI0ExQjhFMycsICcjMDAwMDAwJ10sIFpROiBbJyNCMEM0RTgnLCAnIzAwMDAwMCddLFxuICAgICAgICBCRTogWycjQ0ZEQkYyJywgJyMwMDAwMDAnXSwgREQ6IFsnIzkxQUNERScsICcjMDAwMDAwJ10sIFNBOiBbJyNDRkRCRjInLCAnIzAwMDAwMCddLFxuICAgICAgICBZSDogWycjQzBDRkVEJywgJyMwMDAwMDAnXSwgR0c6IFsnIzkxQUNERScsICcjMDAwMDAwJ10sIEFBOiBbJyNBMUI4RTMnLCAnIzAwMDAwMCddLFxuICAgICAgICBJSTogWycjQTFCOEUzJywgJyMwMDAwMDAnXSwgVFM6IFsnI0NGREJGMicsICcjMDAwMDAwJ10sIFJSOiBbJyNBMUI4RTMnLCAnIzAwMDAwMCddLFxuICAgICAgICBMSTogWycjQzBDRkVEJywgJyMwMDAwMDAnXSwgWkI6IFsnI0NGREJGMicsICcjMDAwMDAwJ10sIEJOOiBbJyNCMEM0RTgnLCAnIzAwMDAwMCddLFxuICAgICAgICBCQjogWycjQTFCOEUzJywgJyMwMDAwMDAnXVxuICAgIH07XG4gICAgcmV0dXJuIFBhbGV0dGVzO1xufSgpKTtcbmV4cG9ydCB7IFBhbGV0dGVzIH07XG4iLCJ2YXIgUGF0dGVybnNNb2RlbCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQYXR0ZXJuc01vZGVsKCkge1xuICAgIH1cbiAgICAvLyBmaW5kIGluZGV4IG9mIG1hdGNoZWQgcmVnZXggcG9zaXRpb25zIGFuZCBjcmVhdGUgYXJyYXkgb2YgcmVnaW9ucyB3aXRoIGNvbG9yXG4gICAgUGF0dGVybnNNb2RlbC5wcm90b3R5cGUucHJvY2VzcyA9IGZ1bmN0aW9uIChwYXR0ZXJucywgc2VxdWVuY2VzKSB7XG4gICAgICAgIGlmICghcGF0dGVybnMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVnaW9ucyA9IFtdOyAvLyBPdXRQYXR0ZXJuc1xuICAgICAgICB2YXIgX2xvb3BfMSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tY29uZGl0aW9uYWwtYXNzaWdubWVudFxuICAgICAgICAgICAgdmFyIHBhdHRlcm4gPSBlbGVtZW50LnBhdHRlcm47XG4gICAgICAgICAgICB2YXIgc3RyID0gdm9pZCAwO1xuICAgICAgICAgICAgaWYgKHNlcXVlbmNlcy5maW5kKGZ1bmN0aW9uICh4KSB7IHJldHVybiB4LmlkID09PSBlbGVtZW50LnNlcXVlbmNlSWQ7IH0pKSB7XG4gICAgICAgICAgICAgICAgc3RyID0gc2VxdWVuY2VzLmZpbmQoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHguaWQgPT09IGVsZW1lbnQuc2VxdWVuY2VJZDsgfSkuc2VxdWVuY2U7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuc3RhcnQgJiYgZWxlbWVudC5lbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyID0gc3RyLnN1YnN0cihlbGVtZW50LnN0YXJ0IC0gMSwgZWxlbWVudC5lbmQgLSAoZWxlbWVudC5zdGFydCAtIDEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpc18xLnJlZ2V4TWF0Y2goc3RyLCBwYXR0ZXJuLCByZWdpb25zLCBlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIF9hID0gMCwgc2VxdWVuY2VzXzEgPSBzZXF1ZW5jZXM7IF9hIDwgc2VxdWVuY2VzXzEubGVuZ3RoOyBfYSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzZXEgPSBzZXF1ZW5jZXNfMVtfYV07XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlZ2V4XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnN0YXJ0ICYmIGVsZW1lbnQuZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHIgPSBzZXEuc2VxdWVuY2Uuc3Vic3RyKGVsZW1lbnQuc3RhcnQgLSAxLCBlbGVtZW50LmVuZCAtIChlbGVtZW50LnN0YXJ0IC0gMSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXNfMS5yZWdleE1hdGNoKHN0ciwgcGF0dGVybiwgcmVnaW9ucywgZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB2YXIgdGhpc18xID0gdGhpcztcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIHBhdHRlcm5zXzEgPSBwYXR0ZXJuczsgX2kgPCBwYXR0ZXJuc18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBwYXR0ZXJuc18xW19pXTtcbiAgICAgICAgICAgIF9sb29wXzEoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlZ2lvbnM7XG4gICAgfTtcbiAgICBQYXR0ZXJuc01vZGVsLnByb3RvdHlwZS5yZWdleE1hdGNoID0gZnVuY3Rpb24gKHN0ciwgcGF0dGVybiwgcmVnaW9ucywgZWxlbWVudCkge1xuICAgICAgICB2YXIgcmUgPSBuZXcgUmVnRXhwKHBhdHRlcm4sIFwiZ1wiKTtcbiAgICAgICAgdmFyIG1hdGNoO1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tY29uZGl0aW9uYWwtYXNzaWdubWVudFxuICAgICAgICB3aGlsZSAoKG1hdGNoID0gcmUuZXhlYyhzdHIpKSAhPSBudWxsKSB7XG4gICAgICAgICAgICByZWdpb25zLnB1c2goeyBzdGFydDogK21hdGNoLmluZGV4ICsgMSwgZW5kOiArbWF0Y2guaW5kZXggKyArbWF0Y2hbMF0ubGVuZ3RoLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogZWxlbWVudC5iYWNrZ3JvdW5kQ29sb3IsIGNvbG9yOiBlbGVtZW50LmNvbG9yLCBiYWNrZ3JvdW5kSW1hZ2U6IGVsZW1lbnQuYmFja2dyb3VuZEltYWdlLFxuICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiBlbGVtZW50LmJvcmRlckNvbG9yLCBib3JkZXJTdHlsZTogZWxlbWVudC5ib3JkZXJTdHlsZSwgc2VxdWVuY2VJZDogZWxlbWVudC5zZXF1ZW5jZUlkIH0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gUGF0dGVybnNNb2RlbDtcbn0oKSk7XG5leHBvcnQgeyBQYXR0ZXJuc01vZGVsIH07XG4iLCJpbXBvcnQgeyBQYWxldHRlcyB9IGZyb20gJy4vcGFsZXR0ZXMnO1xuaW1wb3J0IHsgQ29sb3JzTW9kZWwgfSBmcm9tICcuL2NvbG9ycy5tb2RlbCc7XG52YXIgUm93c01vZGVsID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFJvd3NNb2RlbCgpIHtcbiAgICAgICAgdGhpcy5zdWJzdGl0dXRpdmVJZCA9IDk5OTk5OTk5OTk5OTk5O1xuICAgIH1cbiAgICBSb3dzTW9kZWwucHJvdG90eXBlLnByb2Nlc3NSb3dzID0gZnVuY3Rpb24gKHJvd3MsIGljb25zLCByZWdpb25zLCBvcHQpIHtcbiAgICAgICAgdmFyIGFsbERhdGEgPSBbXTtcbiAgICAgICAgLy8gZGVjaWRlIHdoaWNoIGNvbG9yIGlzIG1vcmUgaW1wb3J0YW50IGluIGNhc2Ugb2Ygb3ZlcndyaXRpbmdcbiAgICAgICAgdmFyIGNvbG9yaW5nT3JkZXIgPSBbJ2N1c3RvbScsICdjbHVzdGFsJywgJ3phcHBvJywgJ2dyYWRpZW50JywgJ2JpbmFyeSddO1xuICAgICAgICAvLyBvcmRlciByb3cgTnVtYmVyc1xuICAgICAgICB2YXIgcm93TnVtc09yZGVyZWQgPSBPYmplY3Qua2V5cyhyb3dzKS5tYXAoTnVtYmVyKS5zb3J0KGZ1bmN0aW9uIChuMSwgbjIpIHsgcmV0dXJuIG4xIC0gbjI7IH0pO1xuICAgICAgICAvLyBvcmRlciBrZXlzIG9mIFJvdyBvYmplY3RcbiAgICAgICAgdmFyIG9yZGVyZWQgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCByb3dOdW1zT3JkZXJlZF8xID0gcm93TnVtc09yZGVyZWQ7IF9pIDwgcm93TnVtc09yZGVyZWRfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciByb3dOdW0gPSByb3dOdW1zT3JkZXJlZF8xW19pXTtcbiAgICAgICAgICAgIG9yZGVyZWRbcm93TnVtXSA9IE9iamVjdC5rZXlzKHJvd3NbK3Jvd051bV0pLm1hcChOdW1iZXIpLnNvcnQoZnVuY3Rpb24gKG4xLCBuMikgeyByZXR1cm4gbjEgLSBuMjsgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRhdGE7XG4gICAgICAgIHZhciBjb2xvcmluZ1Jvd051bXM7XG4gICAgICAgIHZhciB0bXA7XG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCBkYXRhIHJvd3NcbiAgICAgICAgZm9yICh2YXIgX2EgPSAwLCByb3dOdW1zT3JkZXJlZF8yID0gcm93TnVtc09yZGVyZWQ7IF9hIDwgcm93TnVtc09yZGVyZWRfMi5sZW5ndGg7IF9hKyspIHtcbiAgICAgICAgICAgIHZhciByb3dOdW0gPSByb3dOdW1zT3JkZXJlZF8yW19hXTtcbiAgICAgICAgICAgIHRtcCA9IG9yZGVyZWRbcm93TnVtXTtcbiAgICAgICAgICAgIC8vIGRhdGEga2V5OiBpbmRleGVzLCB2YWx1ZTogY2hhcnNcbiAgICAgICAgICAgIGRhdGEgPSByb3dzW3Jvd051bV07XG4gICAgICAgICAgICAvLyBkYXRhW3Jvd051bV0ubGFiZWwgPSB0aGlzLnJvd3MuZ2V0TGFiZWwocm93TnVtLCB0aGlzLnNlcXVlbmNlcyk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRhKVxuICAgICAgICAgICAgaWYgKHJlZ2lvbnMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfYiA9IDAsIF9jID0gY29sb3JpbmdPcmRlci5yZXZlcnNlKCk7IF9iIDwgX2MubGVuZ3RoOyBfYisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2xvcmluZyA9IF9jW19iXTtcbiAgICAgICAgICAgICAgICAgICAgY29sb3JpbmdSb3dOdW1zID0gQ29sb3JzTW9kZWwuZ2V0Um93c0xpc3QoY29sb3JpbmcpLm1hcChOdW1iZXIpO1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBjb2xvcmluZyBmb3IgdGhlIGRhdGEgcm93XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2xvcmluZ1Jvd051bXMuaW5kZXhPZihyb3dOdW0pIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ28gdG8gbmV4dCBjb2xvcmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvc2l0aW9ucyA9IENvbG9yc01vZGVsLmdldFBvc2l0aW9ucyhjb2xvcmluZywgcm93TnVtKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gcG9zaXRpb25zID0gc3RhcnQsIGVuZCwgdGFyZ2V0IChiZ2NvbG9yIHx8IGZnY29sb3IpXG4gICAgICAgICAgICAgICAgICAgIGlmIChwb3NpdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgX2QgPSAwLCBwb3NpdGlvbnNfMSA9IHBvc2l0aW9uczsgX2QgPCBwb3NpdGlvbnNfMS5sZW5ndGg7IF9kKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IHBvc2l0aW9uc18xW19kXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gZS5zdGFydDsgaSA8PSBlLmVuZDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZGF0YVtpXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUuYmFja2dyb3VuZENvbG9yICYmICFlLmJhY2tncm91bmRDb2xvci5zdGFydHNXaXRoKCcjJykpIHsgLy8gaXMgYSBwYWxldHRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZS5iYWNrZ3JvdW5kQ29sb3IgPT0gJ2N1c3RvbScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2ldLmJhY2tncm91bmRDb2xvciA9IG9wdC5jdXN0b21QYWxldHRlW2RhdGFbaV0uY2hhcl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2ldLmJhY2tncm91bmRDb2xvciA9IFBhbGV0dGVzW2UuYmFja2dyb3VuZENvbG9yXVtkYXRhW2ldLmNoYXJdOyAvLyBlLmJhY2tncm91bmRjb2xvciA9IHphcHBvLCBjbHVzdGFsLi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbaV0uYmFja2dyb3VuZENvbG9yID0gZS5iYWNrZ3JvdW5kQ29sb3I7IC8vIGlzIGEgcmVnaW9uIG9yIHBhdHRlcm5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2ldLnRhcmdldCA9IGUudGFyZ2V0ICsgJ2JhY2tncm91bmQtY29sb3I6JyArIGRhdGFbaV0uYmFja2dyb3VuZENvbG9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaWNvbnMgIT09IHt9KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpY29uc0RhdGEgPSBpY29uc1tyb3dOdW1dO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaWNvbnNEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGxEYXRhLnB1c2goaWNvbnNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFsbERhdGEucHVzaChkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWxsRGF0YTtcbiAgICB9O1xuICAgIFJvd3NNb2RlbC5wcm90b3R5cGUucHJvY2VzcyA9IGZ1bmN0aW9uIChzZXF1ZW5jZXMsIGljb25zLCByZWdpb25zLCBvcHQpIHtcbiAgICAgICAgLy8gY2hlY2sgYW5kIHNldCBnbG9iYWwgc2VxdWVuY2VDb2xvclxuICAgICAgICBpZiAob3B0ICYmIG9wdC5zZXF1ZW5jZUNvbG9yKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIHNlcXVlbmNlc18xID0gc2VxdWVuY2VzOyBfaSA8IHNlcXVlbmNlc18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIHZhciBzZXF1ZW5jZSA9IHNlcXVlbmNlc18xW19pXTtcbiAgICAgICAgICAgICAgICBpZiAoIXNlcXVlbmNlLnNlcXVlbmNlQ29sb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VxdWVuY2Uuc2VxdWVuY2VDb2xvciA9IG9wdC5zZXF1ZW5jZUNvbG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBrZWVwIHByZXZpb3VzIGRhdGFcbiAgICAgICAgaWYgKCFzZXF1ZW5jZXMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyByZXNldCBkYXRhXG4gICAgICAgIHZhciByb3dzID0ge307XG4gICAgICAgIC8vIGNoZWNrIGlmIHRoZXJlIGFyZSB1bmRlZmluZWQgb3IgZHVwbGljYXRlIGlkcyBhbmQgcHJlcGFyZSB0byByZXNldCB0aGVtXG4gICAgICAgIHZhciB2YWx1ZXMgPSBbXTtcbiAgICAgICAgdmFyIHVuZGVmaW5lZFZhbHVlcyA9IDA7XG4gICAgICAgIGZvciAodmFyIF9hID0gMCwgX2IgPSBPYmplY3Qua2V5cyhzZXF1ZW5jZXMpOyBfYSA8IF9iLmxlbmd0aDsgX2ErKykge1xuICAgICAgICAgICAgdmFyIHIgPSBfYltfYV07XG4gICAgICAgICAgICBpZiAoaXNOYU4oK3NlcXVlbmNlc1tyXS5pZCkpIHtcbiAgICAgICAgICAgICAgICAvLyBtaXNzaW5nIGlkXG4gICAgICAgICAgICAgICAgdW5kZWZpbmVkVmFsdWVzICs9IDE7XG4gICAgICAgICAgICAgICAgc2VxdWVuY2VzW3JdLmlkID0gdGhpcy5zdWJzdGl0dXRpdmVJZDtcbiAgICAgICAgICAgICAgICB0aGlzLnN1YnN0aXR1dGl2ZUlkIC09IDE7XG4gICAgICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIGp1c3QgcmVzZXQgbWlzc2luZyBpZHMgYW5kIGxvZyB0aGUgcmVzZXR0ZWQgaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZXMuaW5jbHVkZXMoK3NlcXVlbmNlc1tyXS5pZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRHVwbGljYXRlIHNlcXVlbmNlIGlkXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzZXF1ZW5jZXNbcl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaCgrc2VxdWVuY2VzW3JdLmlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgX2MgPSAwLCBfZCA9IE9iamVjdC5rZXlzKHNlcXVlbmNlcyk7IF9jIDwgX2QubGVuZ3RoOyBfYysrKSB7XG4gICAgICAgICAgICB2YXIgcm93ID0gX2RbX2NdO1xuICAgICAgICAgICAgLyoqIGNoZWNrIHNlcXVlbmNlcyBpZCB0eXBlICovXG4gICAgICAgICAgICB2YXIgaWQgPSB2b2lkIDA7XG4gICAgICAgICAgICBpZiAoaXNOYU4oK3NlcXVlbmNlc1tyb3ddLmlkKSkge1xuICAgICAgICAgICAgICAgIGlkID0gdmFsdWVzLnNvcnQoKVt2YWx1ZXMubGVuZ3RoIC0gMV0gKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWQgPSBzZXF1ZW5jZXNbcm93XS5pZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qKiBzZXQgcm93IGNoYXJzICovXG4gICAgICAgICAgICByb3dzW2lkXSA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIgX2UgPSAwLCBfZiA9IE9iamVjdC5rZXlzKHNlcXVlbmNlc1tyb3ddLnNlcXVlbmNlKTsgX2UgPCBfZi5sZW5ndGg7IF9lKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaWR4ID0gX2ZbX2VdO1xuICAgICAgICAgICAgICAgIHZhciBpZHhLZXkgPSAoK2lkeCArIDEpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgdmFyIGNoYXIgPSBzZXF1ZW5jZXNbcm93XS5zZXF1ZW5jZVtpZHhdO1xuICAgICAgICAgICAgICAgIHJvd3NbaWRdW2lkeEtleV0gPSB7IGNoYXI6IGNoYXIgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzUm93cyhyb3dzLCBpY29ucywgcmVnaW9ucywgb3B0KTtcbiAgICB9O1xuICAgIHJldHVybiBSb3dzTW9kZWw7XG59KCkpO1xuZXhwb3J0IHsgUm93c01vZGVsIH07XG4iLCJ2YXIgU2VsZWN0aW9uTW9kZWwgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU2VsZWN0aW9uTW9kZWwoKSB7XG4gICAgICAgIHRoaXMuZXZlbnRfc2VxdWVuY2UgPSBbXTtcbiAgICB9XG4gICAgU2VsZWN0aW9uTW9kZWwucHJvdG90eXBlLnNldF9zdGFydCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBpZDtcbiAgICAgICAgdmFyIGVsZW1lbnQ7XG4gICAgICAgIGlmIChlLnBhdGgpIHtcbiAgICAgICAgICAgIC8vIGNocm9tZSBzdXBwb3J0XG4gICAgICAgICAgICBlbGVtZW50ID0gZS5wYXRoWzBdO1xuICAgICAgICAgICAgaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50LmRhdGFzZXQucmVzSWQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gZmlyZWZveCBzdXBwb3J0XG4gICAgICAgICAgICBlbGVtZW50ID0gZS5vcmlnaW5hbFRhcmdldDtcbiAgICAgICAgICAgIGlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudC5kYXRhc2V0LnJlc0lkKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxhc3RJZCA9IGVsZW1lbnQuZGF0YXNldC5yZXNJZDtcbiAgICAgICAgdGhpcy5sYXN0U3F2ID0gaWQ7XG4gICAgICAgIHRoaXMuc3RhcnQgPSB7IHk6IGVsZW1lbnQuZGF0YXNldC5yZXNZLCB4OiBlbGVtZW50LmRhdGFzZXQucmVzWCwgc3F2SWQ6IGVsZW1lbnQuZGF0YXNldC5yZXNJZCB9O1xuICAgICAgICB0aGlzLmxhc3RPdmVyID0geyB5OiBlbGVtZW50LmRhdGFzZXQucmVzWSwgeDogZWxlbWVudC5kYXRhc2V0LnJlc1gsIHNxdklkOiBlbGVtZW50LmRhdGFzZXQucmVzSWQgfTtcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtcmVzLWlkPScgKyBlbGVtZW50LmRhdGFzZXQucmVzSWQgKyAnXScpO1xuICAgICAgICB0aGlzLnNlbGVjdGlvbmhpZ2hsaWdodChlbGVtZW50cyk7XG4gICAgICAgIHRoaXMuZmlyc3RPdmVyID0gZmFsc2U7XG4gICAgfTtcbiAgICBTZWxlY3Rpb25Nb2RlbC5wcm90b3R5cGUuc2VsZWN0aW9uaGlnaGxpZ2h0ID0gZnVuY3Rpb24gKGVsZW1lbnRzKSB7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgZWxlbWVudHNfMSA9IGVsZW1lbnRzOyBfaSA8IGVsZW1lbnRzXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0aW9uID0gZWxlbWVudHNfMVtfaV07XG4gICAgICAgICAgICB2YXIgeCA9ICtzZWxlY3Rpb24uZ2V0QXR0cmlidXRlKCdkYXRhLXJlcy14Jyk7XG4gICAgICAgICAgICB2YXIgeSA9ICtzZWxlY3Rpb24uZ2V0QXR0cmlidXRlKCdkYXRhLXJlcy15Jyk7XG4gICAgICAgICAgICB2YXIgZmlyc3RYID0gTWF0aC5taW4oK3RoaXMuc3RhcnQueCwgK3RoaXMubGFzdE92ZXIueCk7XG4gICAgICAgICAgICB2YXIgbGFzdFggPSBNYXRoLm1heCgrdGhpcy5zdGFydC54LCArdGhpcy5sYXN0T3Zlci54KTtcbiAgICAgICAgICAgIHZhciBmaXJzdFkgPSBNYXRoLm1pbigrdGhpcy5zdGFydC55LCArdGhpcy5sYXN0T3Zlci55KTtcbiAgICAgICAgICAgIHZhciBsYXN0WSA9IE1hdGgubWF4KCt0aGlzLnN0YXJ0LnksICt0aGlzLmxhc3RPdmVyLnkpO1xuICAgICAgICAgICAgLy8gb24gZXZlcnkgZHJhZyByZXNlbGVjdCB0aGUgd2hvbGUgYXJlYSAuLi5cbiAgICAgICAgICAgIGlmICh4ID49ICtmaXJzdFggJiYgeCA8PSArbGFzdFggJiZcbiAgICAgICAgICAgICAgICB5ID49ICtmaXJzdFkgJiYgeSA8PSArbGFzdFkgJiZcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb24uZ2V0QXR0cmlidXRlKCdkYXRhLXJlcy1pZCcpID09PSB0aGlzLmxhc3RPdmVyLnNxdklkKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uLmNsYXNzTGlzdC5hZGQoJ2hpZ2hsaWdodCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBTZWxlY3Rpb25Nb2RlbC5wcm90b3R5cGUucHJvY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIHNlcXVlbmNlVmlld2VycyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NlbGwnKTtcbiAgICAgICAgLy8gcmVtb3ZlIHNlbGVjdGlvbiBvbiBuZXcgY2xpY2tcbiAgICAgICAgd2luZG93Lm9ubW91c2Vkb3duID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBfdGhpcy5ldmVudF9zZXF1ZW5jZS5wdXNoKDApO1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBzZXF1ZW5jZVZpZXdlcnNfMiA9IHNlcXVlbmNlVmlld2VyczsgX2kgPCBzZXF1ZW5jZVZpZXdlcnNfMi5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgc3F2ID0gc2VxdWVuY2VWaWV3ZXJzXzJbX2ldO1xuICAgICAgICAgICAgICAgIHNxdi5vbm1vdXNlZG93biA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnNldF9zdGFydChlKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKF90aGlzLmV2ZW50X3NlcXVlbmNlWzBdID09IDAgJiYgX3RoaXMuZXZlbnRfc2VxdWVuY2VbMV0gPT0gMSAmJiBfdGhpcy5ldmVudF9zZXF1ZW5jZVsyXSA9PSAyICYmIF90aGlzLmV2ZW50X3NlcXVlbmNlWzBdID09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBsZWZ0IGNsaWNrXG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtcmVzLWlkPScgKyBfdGhpcy5sYXN0SWQgKyAnXScpO1xuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfYSA9IDAsIGVsZW1lbnRzXzIgPSBlbGVtZW50czsgX2EgPCBlbGVtZW50c18yLmxlbmd0aDsgX2ErKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0aW9uID0gZWxlbWVudHNfMltfYV07XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbi5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiBmaXJzdCBjbGljayBvdXRzaWRlIHNxdkRpdiAoZmlyc3QgaWYgaXMgdmFsaWQgaW4gQ2hyb21lLCBzZWNvbmQgaW4gZmlyZWZveClcbiAgICAgICAgICAgIGlmICghZXZlbnQudGFyZ2V0LmRhdGFzZXQucmVzWCkge1xuICAgICAgICAgICAgICAgIF90aGlzLmZpcnN0T3ZlciA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXZlbnQuZXhwbGljaXRPcmlnaW5hbFRhcmdldCAmJiBldmVudC5leHBsaWNpdE9yaWdpbmFsVGFyZ2V0LmRhdGFzZXQpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5maXJzdE92ZXIgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RoaXMuZXZlbnRfc2VxdWVuY2UgPSBbMF07XG4gICAgICAgIH07XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBzZXF1ZW5jZVZpZXdlcnNfMSA9IHNlcXVlbmNlVmlld2VyczsgX2kgPCBzZXF1ZW5jZVZpZXdlcnNfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBzcXYgPSBzZXF1ZW5jZVZpZXdlcnNfMVtfaV07XG4gICAgICAgICAgICBzcXYub25tb3VzZW92ZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGlmICghKDEgaW4gX3RoaXMuZXZlbnRfc2VxdWVuY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmV2ZW50X3NlcXVlbmNlLnB1c2goMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5maXJzdE92ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuc2V0X3N0YXJ0KGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudDtcbiAgICAgICAgICAgICAgICBpZiAoZS5wYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBlLnBhdGhbMF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gZS5vcmlnaW5hbFRhcmdldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmxhc3RPdmVyID0geyB5OiBlbGVtZW50LmRhdGFzZXQucmVzWSwgeDogZWxlbWVudC5kYXRhc2V0LnJlc1gsIHNxdklkOiBlbGVtZW50LmRhdGFzZXQucmVzSWQgfTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtcmVzLWlkPScgKyBlbGVtZW50LmRhdGFzZXQucmVzSWQgKyAnXScpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoX3RoaXMubGFzdElkID09IGVsZW1lbnQuZGF0YXNldC5yZXNJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuc2VsZWN0aW9uaGlnaGxpZ2h0KGVsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZG9jdW1lbnQuYm9keS5vbm1vdXNldXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5ldmVudF9zZXF1ZW5jZS5wdXNoKDIpO1xuICAgICAgICAgICAgX3RoaXMuZmlyc3RPdmVyID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoX3RoaXMuc3RhcnQpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5zdGFydCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfdGhpcy5ldmVudF9zZXF1ZW5jZVswXSA9PSAwICYmIF90aGlzLmV2ZW50X3NlcXVlbmNlWzFdID09IDIpIHtcbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1yZXMtaWQ9JyArIF90aGlzLmxhc3RJZCArICddJyk7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgZWxlbWVudHNfMyA9IGVsZW1lbnRzOyBfaSA8IGVsZW1lbnRzXzMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3Rpb24gPSBlbGVtZW50c18zW19pXTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXJlcy1pZD0nICsgX3RoaXMubGFzdElkICsgJ10nKTtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcbiAgICAgICAgICAgIHZhciBrZXkgPSBlLndoaWNoIHx8IGUua2V5Q29kZTsgLy8ga2V5Q29kZSBkZXRlY3Rpb25cbiAgICAgICAgICAgIHZhciBjdHJsID0gZS5jdHJsS2V5ID8gZS5jdHJsS2V5IDogKChrZXkgPT09IDE3KSk7IC8vIGN0cmwgZGV0ZWN0aW9uXG4gICAgICAgICAgICBpZiAoa2V5ID09PSA2NyAmJiBjdHJsKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRleHRUb1Bhc3RlID0gJyc7XG4gICAgICAgICAgICAgICAgdmFyIHRleHREaWN0ID0ge307XG4gICAgICAgICAgICAgICAgdmFyIHJvdyA9ICcnO1xuICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpmb3JpblxuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIGVsZW1lbnRzXzQgPSBlbGVtZW50czsgX2kgPCBlbGVtZW50c180Lmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0aW9uID0gZWxlbWVudHNfNFtfaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3Rpb24uY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWdobGlnaHQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0ZXh0RGljdFtzZWxlY3Rpb24uZ2V0QXR0cmlidXRlKCdkYXRhLXJlcy15JyldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dERpY3Rbc2VsZWN0aW9uLmdldEF0dHJpYnV0ZSgnZGF0YS1yZXMteScpXSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV3IGxpbmUgd2hlbiBuZXcgcm93XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0aW9uLmdldEF0dHJpYnV0ZSgnZGF0YS1yZXMteScpICE9PSByb3cgJiYgcm93ICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHREaWN0W3NlbGVjdGlvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtcmVzLXknKV0gKz0gc2VsZWN0aW9uLmlubmVyVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHREaWN0W3NlbGVjdGlvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtcmVzLXknKV0gKz0gc2VsZWN0aW9uLmlubmVyVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdyA9IHNlbGVjdGlvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtcmVzLXknKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgZmxhZyA9IHZvaWQgMDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB0ZXh0Um93IGluIHRleHREaWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmbGFnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0VG9QYXN0ZSArPSAnXFxuJyArIHRleHREaWN0W3RleHRSb3ddO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dFRvUGFzdGUgKz0gdGV4dERpY3RbdGV4dFJvd107XG4gICAgICAgICAgICAgICAgICAgICAgICBmbGFnID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGV4dFRvUGFzdGUgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvcHkgdG8gY2xpcGJvYXJkIGZvciB0aGUgcGFzdGUgZXZlbnRcbiAgICAgICAgICAgICAgICAgICAgdmFyIGR1bW15ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkdW1teSk7XG4gICAgICAgICAgICAgICAgICAgIGR1bW15LnZhbHVlID0gdGV4dFRvUGFzdGU7XG4gICAgICAgICAgICAgICAgICAgIGR1bW15LnNlbGVjdCgpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGR1bW15KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGV2dCA9IG5ldyBDdXN0b21FdmVudCgnb25IaWdobGlnaHRTZWxlY3Rpb24nLCB7IGRldGFpbDogeyB0ZXh0OiB0ZXh0VG9QYXN0ZSwgZXZlbnRUeXBlOiAnaGlnaGxpZ2h0IHNlbGVjdGlvbicgfSB9KTtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoZXZ0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICB9O1xuICAgIHJldHVybiBTZWxlY3Rpb25Nb2RlbDtcbn0oKSk7XG5leHBvcnQgeyBTZWxlY3Rpb25Nb2RlbCB9O1xuIiwidmFyIFNlcXVlbmNlSW5mb01vZGVsID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNlcXVlbmNlSW5mb01vZGVsKCkge1xuICAgICAgICB0aGlzLmlzSFRNTCA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgICAgIHZhciBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHN0cik7XG4gICAgICAgICAgICAvLyByZW1vdmUgYWxsIG5vbiB0ZXh0IG5vZGVzIGZyb20gZnJhZ21lbnRcbiAgICAgICAgICAgIGZyYWdtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyonKS5mb3JFYWNoKGZ1bmN0aW9uIChlbCkgeyByZXR1cm4gZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7IH0pO1xuICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgdGV4dENvbnRlbnQsIHRoZW4gbm90IGEgcHVyZSBIVE1MXG4gICAgICAgICAgICByZXR1cm4gIShmcmFnbWVudC50ZXh0Q29udGVudCB8fCAnJykudHJpbSgpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBTZXF1ZW5jZUluZm9Nb2RlbC5wcm90b3R5cGUucHJvY2VzcyA9IGZ1bmN0aW9uIChyZWdpb25zLCBzZXF1ZW5jZXMpIHtcbiAgICAgICAgdmFyIGxhYmVscyA9IFtdO1xuICAgICAgICB2YXIgc3RhcnRJbmRleGVzID0gW107XG4gICAgICAgIHZhciB0b29sdGlwcyA9IFtdO1xuICAgICAgICB2YXIgZmxhZztcbiAgICAgICAgc2VxdWVuY2VzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGEuaWQgLSBiLmlkOyB9KTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBzZXF1ZW5jZXNfMSA9IHNlcXVlbmNlczsgX2kgPCBzZXF1ZW5jZXNfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBzZXEgPSBzZXF1ZW5jZXNfMVtfaV07XG4gICAgICAgICAgICBpZiAoIXNlcSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlcS5zdGFydEluZGV4KSB7XG4gICAgICAgICAgICAgICAgc3RhcnRJbmRleGVzLnB1c2goc2VxLnN0YXJ0SW5kZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RhcnRJbmRleGVzLnB1c2goMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VxLmxhYmVsVG9vbHRpcCkge1xuICAgICAgICAgICAgICAgIHRvb2x0aXBzLnB1c2goc2VxLmxhYmVsVG9vbHRpcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0b29sdGlwcy5wdXNoKCc8c3Bhbj48L3NwYW4+Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VxLmxhYmVsICYmICF0aGlzLmlzSFRNTChzZXEubGFiZWwpKSB7XG4gICAgICAgICAgICAgICAgbGFiZWxzLnB1c2goc2VxLmxhYmVsKTtcbiAgICAgICAgICAgICAgICBmbGFnID0gdHJ1ZTsgLy8gdG8gY2hlY2sgaWYgSSBoYXZlIGF0IGxlYXN0IG9uZSBsYWJlbFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbGFiZWxzLnB1c2goJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbbGFiZWxzLCBzdGFydEluZGV4ZXMsIHRvb2x0aXBzLCBmbGFnXTtcbiAgICB9O1xuICAgIHJldHVybiBTZXF1ZW5jZUluZm9Nb2RlbDtcbn0oKSk7XG5leHBvcnQgeyBTZXF1ZW5jZUluZm9Nb2RlbCB9O1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCIucm9vdCB7XFxuICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IH1cXG5cXG4uY29udGFpbmVyIHtcXG4gIG1hcmdpbi1sZWZ0OiAwOyB9XFxuXFxuLmNuayB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgdmVydGljYWwtYWxpZ246IHRvcDsgfVxcblxcbi5pZHgge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgdmVydGljYWwtYWxpZ246IHRvcDtcXG4gIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xcbiAgLXdlYmtpdC10b3VjaC1jYWxsb3V0OiBub25lOyB9XFxuXFxuLmhpZGRlbiB7XFxuICBkaXNwbGF5OiBub25lOyB9XFxuXFxuLmxibENvbnRhaW5lciB7XFxuICBkaXJlY3Rpb246IHJ0bDsgfVxcblxcbi5sYmwtaGlkZGVuIHtcXG4gIHBhZGRpbmctbGVmdDogMnB4O1xcbiAgcGFkZGluZy1yaWdodDogNXB4O1xcbiAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgaGVpZ2h0OiAxZW07XFxuICBsaW5lLWhlaWdodDogMWVtO1xcbiAgbWFyZ2luLWJvdHRvbTogMS41ZW07XFxuICBmb250LXN0eWxlOiBpdGFsaWM7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgfVxcblxcbi5sYmwge1xcbiAgZm9udC1zaXplOiAxZW07IH1cXG5cXG4uY2VsbCB7XFxuICBtYXJnaW4tYm90dG9tOiAxLjVlbTtcXG4gIGhlaWdodDogMWVtO1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrOyB9XFxuXFxuLmhpZ2hsaWdodCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjRUJEMjcwICFpbXBvcnRhbnQ7IH1cXG5cXG4vKiAnY2FyZCcgbmFtZSBpcyBub3QgYXZhaWxhYmxlIGJlY2F1c2UgdXNlZCBieSBib290c3RyYXAgKi9cXG4uY3JkIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jazsgfVxcblxcbi5jcmRzIHtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7IH1cXG5cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzLnNjc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRSxpQ0FBaUMsRUFBQTs7QUFHbkM7RUFDRSxjQUFjLEVBQUE7O0FBR2hCO0VBQ0Usa0JBQWtCO0VBQ2xCLG1CQUFtQjtFQUNuQixxQkFBcUI7RUFDckIsbUJBQW1CLEVBQUE7O0FBR3JCO0VBQ0Usa0JBQWtCO0VBQ2xCLHFCQUFxQjtFQUNyQixtQkFBbUI7RUFDbkIsc0JBQXNCO0VBQ3RCLHFCQUFxQjtFQUNyQix5QkFBeUI7RUFDekIsMkJBQTJCLEVBQUE7O0FBRzdCO0VBQ0UsYUFBYSxFQUFBOztBQUdmO0VBQ0UsY0FBYyxFQUFBOztBQUdoQjtFQUNFLGlCQUFpQjtFQUNqQixrQkFBa0I7RUFDbEIseUJBQXlCO0VBQ3pCLGNBQWE7RUFDYixXQUFVO0VBQ1YsZ0JBQWU7RUFDZixvQkFBb0I7RUFDcEIsa0JBQWtCO0VBQ2xCLHlCQUF5QjtFQUN6QixzQkFBc0IsRUFBQTs7QUFHeEI7RUFDRSxjQUFjLEVBQUE7O0FBR2hCO0VBQ0Usb0JBQW9CO0VBQ3BCLFdBQVc7RUFDWCxxQkFBcUIsRUFBQTs7QUFHdkI7RUFDRSxvQ0FBbUMsRUFBQTs7QUFHckMsMkRBQUE7QUFDQTtFQUNFLGtCQUFrQjtFQUNsQixxQkFBcUIsRUFBQTs7QUFHdkI7RUFDRSxxQkFBcUI7RUFDckIseUJBQXlCLEVBQUFcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLnJvb3R7XFxuICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7XFxufVxcblxcbi5jb250YWluZXIge1xcbiAgbWFyZ2luLWxlZnQ6IDA7XFxufVxcblxcbi5jbmsge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gIHZlcnRpY2FsLWFsaWduOiB0b3A7XFxufVxcblxcbi5pZHgge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgdmVydGljYWwtYWxpZ246IHRvcDtcXG4gIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xcbiAgLXdlYmtpdC10b3VjaC1jYWxsb3V0OiBub25lO1xcbn1cXG5cXG4uaGlkZGVuIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbi5sYmxDb250YWluZXIge1xcbiAgZGlyZWN0aW9uOiBydGw7XFxufVxcblxcbi5sYmwtaGlkZGVuIHtcXG4gIHBhZGRpbmctbGVmdDogMnB4O1xcbiAgcGFkZGluZy1yaWdodDogNXB4O1xcbiAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcXG4gIGRpc3BsYXk6YmxvY2s7XFxuICBoZWlnaHQ6MWVtO1xcbiAgbGluZS1oZWlnaHQ6MWVtO1xcbiAgbWFyZ2luLWJvdHRvbTogMS41ZW07XFxuICBmb250LXN0eWxlOiBpdGFsaWM7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuXFxuLmxibCB7XFxuICBmb250LXNpemU6IDFlbTtcXG59XFxuXFxuLmNlbGx7XFxuICBtYXJnaW4tYm90dG9tOiAxLjVlbTtcXG4gIGhlaWdodDogMWVtO1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbn1cXG5cXG4uaGlnaGxpZ2h0IHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNFQkQyNzAhaW1wb3J0YW50OztcXG59XFxuXFxuLyogJ2NhcmQnIG5hbWUgaXMgbm90IGF2YWlsYWJsZSBiZWNhdXNlIHVzZWQgYnkgYm9vdHN0cmFwICovXFxuLmNyZCB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxufVxcblxcbi5jcmRzIHtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTsgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcblxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cblxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuXG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07IC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG5cblxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuXG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblxuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuXG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG5cbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG5cbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cblxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgdmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgIHJldHVybiBcIi8qIyBzb3VyY2VVUkw9XCIuY29uY2F0KGNzc01hcHBpbmcuc291cmNlUm9vdCB8fCBcIlwiKS5jb25jYXQoc291cmNlLCBcIiAqL1wiKTtcbiAgICB9KTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG5cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzJdLnVzZVsxXSEuLi9ub2RlX21vZHVsZXMvcmVzb2x2ZS11cmwtbG9hZGVyL2luZGV4LmpzIS4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cnVsZVNldFsxXS5ydWxlc1syXS51c2VbM10hLi9zdHlsZXMuc2Nzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzJdLnVzZVsxXSEuLi9ub2RlX21vZHVsZXMvcmVzb2x2ZS11cmwtbG9hZGVyL2luZGV4LmpzIS4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cnVsZVNldFsxXS5ydWxlc1syXS51c2VbM10hLi9zdHlsZXMuc2Nzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcblxuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG5cbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG5cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuXG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuXG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB1cGRhdGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuXG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcblxuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuXG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuXG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuXG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTsgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcblxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuXG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuXG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuXG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcblxuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuXG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG5cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG5cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG5cbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuXG4gIGNzcyArPSBvYmouY3NzO1xuXG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cblxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG5cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuXG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfSAvLyBGb3Igb2xkIElFXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuXG5cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgT3B0aW9uc01vZGVsIH0gZnJvbSAnLi9saWIvb3B0aW9ucy5tb2RlbCc7XG5pbXBvcnQgeyBSb3dzTW9kZWwgfSBmcm9tICcuL2xpYi9yb3dzLm1vZGVsJztcbmltcG9ydCB7IENvbG9yc01vZGVsIH0gZnJvbSAnLi9saWIvY29sb3JzLm1vZGVsJztcbmltcG9ydCB7IFNlbGVjdGlvbk1vZGVsIH0gZnJvbSAnLi9saWIvc2VsZWN0aW9uLm1vZGVsJztcbmltcG9ydCB7IEljb25zTW9kZWwgfSBmcm9tICcuL2xpYi9pY29ucy5tb2RlbCc7XG5pbXBvcnQgeyBTZXF1ZW5jZUluZm9Nb2RlbCB9IGZyb20gJy4vbGliL3NlcXVlbmNlSW5mb01vZGVsJztcbmltcG9ydCB7IEV2ZW50c01vZGVsIH0gZnJvbSAnLi9saWIvZXZlbnRzLm1vZGVsJztcbmltcG9ydCB7IFBhdHRlcm5zTW9kZWwgfSBmcm9tICcuL2xpYi9wYXR0ZXJucy5tb2RlbCc7XG5pbXBvcnQgeyBDb25zZW5zdXNNb2RlbCB9IGZyb20gJy4vbGliL2NvbnNlbnN1cy5tb2RlbCc7XG4vLyBBZGQgY3VzdG9tIHN0eWxlXG5pbXBvcnQgJy4vc3R5bGVzLnNjc3MnO1xuLy8gRXhwb3J0IHRoZSBhY3R1YWwgUHJvU2VxVmlld2VyIGNvbnN0cnVjdG9yXG52YXIgUHJvU2VxVmlld2VyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFByb1NlcVZpZXdlcihkaXZJZCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmRpdklkID0gZGl2SWQ7XG4gICAgICAgIHRoaXMuaW5pdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnBhcmFtcyA9IG5ldyBPcHRpb25zTW9kZWwoKTtcbiAgICAgICAgdGhpcy5yb3dzID0gbmV3IFJvd3NNb2RlbCgpO1xuICAgICAgICB0aGlzLmNvbnNlbnN1cyA9IG5ldyBDb25zZW5zdXNNb2RlbCgpO1xuICAgICAgICB0aGlzLnJlZ2lvbnMgPSBuZXcgQ29sb3JzTW9kZWwoKTtcbiAgICAgICAgdGhpcy5wYXR0ZXJucyA9IG5ldyBQYXR0ZXJuc01vZGVsKCk7XG4gICAgICAgIHRoaXMuaWNvbnMgPSBuZXcgSWNvbnNNb2RlbCgpO1xuICAgICAgICB0aGlzLmxhYmVscyA9IG5ldyBTZXF1ZW5jZUluZm9Nb2RlbCgpO1xuICAgICAgICB0aGlzLnNlbGVjdGlvbiA9IG5ldyBTZWxlY3Rpb25Nb2RlbCgpO1xuICAgICAgICB0aGlzLmV2ZW50cyA9IG5ldyBFdmVudHNNb2RlbCgpO1xuICAgICAgICB3aW5kb3cub25yZXNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5jYWxjdWxhdGVJZHhzKGZhbHNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgd2luZG93Lm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5jYWxjdWxhdGVJZHhzKHRydWUpO1xuICAgICAgICB9OyAvLyBoYWQgdG8gYWRkIHRoaXMgdG8gY292ZXIgbW9iaWRiIHRvZ2dsZSBldmVudFxuICAgIH1cbiAgICBQcm9TZXFWaWV3ZXIucHJvdG90eXBlLmNhbGN1bGF0ZUlkeHMgPSBmdW5jdGlvbiAoZmxhZykge1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gUHJvU2VxVmlld2VyLnNxdkxpc3Q7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgaWQgPSBfYVtfaV07XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3F2Qm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgICAgICAgICAgICB2YXIgY2h1bmtzID0gc3F2Qm9keS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjbmsnKTtcbiAgICAgICAgICAgICAgICB2YXIgb2xkVG9wID0gMDtcbiAgICAgICAgICAgICAgICB2YXIgbmV3VG9wID0gMTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNodW5rcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAvLyBlcmFzZSBvbGQgaW5kZXhlcyBiZWZvcmUgcmVjYWxjdWxhdGluZyB0aGVtXG4gICAgICAgICAgICAgICAgICAgIGNodW5rc1tpXS5maXJzdEVsZW1lbnRDaGlsZC5jbGFzc05hbWUgPSAnaWR4IGhpZGRlbic7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmbGFnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhdm9pZCBjYWxjdWxhdGluZyBpZiBpZHggYWxyZWFkeSBzZXRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaHVua3NbaV0uZmlyc3RFbGVtZW50Q2hpbGQuY2xhc3NOYW1lID09PSAnaWR4Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBuZXdUb3AgPSBjaHVua3NbaV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgd2luZG93LnNjcm9sbFk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdUb3AgPiBvbGRUb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNodW5rc1tpXS5maXJzdEVsZW1lbnRDaGlsZC5jbGFzc05hbWUgPSAnaWR4JztcbiAgICAgICAgICAgICAgICAgICAgICAgIG9sZFRvcCA9IG5ld1RvcDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgUHJvU2VxVmlld2VyLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24gKGlucHV0cykge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICB2YXIgc3F2Qm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZGl2SWQpO1xuICAgICAgICBpZiAoc3F2Qm9keSkge1xuICAgICAgICAgICAgc3F2Qm9keS5pbm5lckhUTUwgPSBcIjxkaXYgY2xhc3M9XFxcInJvb3RcXFwiPiA8ZGl2IGNsYXNzPVxcXCJsb2FkaW5nXFxcIj5pbnB1dCBlcnJvcjwvZGl2PiA8L2Rpdj5cIjtcbiAgICAgICAgfVxuICAgICAgICBQcm9TZXFWaWV3ZXIuc3F2TGlzdC5wdXNoKHRoaXMuZGl2SWQpO1xuICAgICAgICB2YXIgbGFiZWxzO1xuICAgICAgICB2YXIgbGFiZWxzRmxhZztcbiAgICAgICAgdmFyIHN0YXJ0SW5kZXhlcztcbiAgICAgICAgdmFyIHRvb2x0aXBzO1xuICAgICAgICB2YXIgZGF0YTtcbiAgICAgICAgLyoqIGNoZWNrIGFuZCBwcm9jZXNzIHBhcmFtZXRlcnMgaW5wdXQgKi9cbiAgICAgICAgaW5wdXRzLm9wdGlvbnMgPSB0aGlzLnBhcmFtcy5wcm9jZXNzKGlucHV0cy5vcHRpb25zLCBpbnB1dHMuY29uc2Vuc3VzKTtcbiAgICAgICAgLyoqIGNoZWNrIGFuZCBjb25zZW5zdXMgaW5wdXQgIGFuZCBnbG9iYWwgY29sb3JTY2hlbWUgKi9cbiAgICAgICAgaWYgKGlucHV0cy5vcHRpb25zKSB7XG4gICAgICAgICAgICBfYSA9IHRoaXMuY29uc2Vuc3VzLnByb2Nlc3MoaW5wdXRzLnNlcXVlbmNlcywgaW5wdXRzLnJlZ2lvbnMsIGlucHV0cy5vcHRpb25zKSwgaW5wdXRzLnNlcXVlbmNlcyA9IF9hWzBdLCBpbnB1dHMucmVnaW9ucyA9IF9hWzFdO1xuICAgICAgICB9XG4gICAgICAgIC8qKiBjaGVjayBhbmQgcHJvY2VzcyBwYXR0ZXJucyBpbnB1dCAqL1xuICAgICAgICBpbnB1dHMucGF0dGVybnMgPSB0aGlzLnBhdHRlcm5zLnByb2Nlc3MoaW5wdXRzLnBhdHRlcm5zLCBpbnB1dHMuc2VxdWVuY2VzKTtcbiAgICAgICAgLyoqIGNoZWNrIGFuZCBwcm9jZXNzIGNvbG9ycyBpbnB1dCAqL1xuICAgICAgICBpbnB1dHMucmVnaW9ucyA9IHRoaXMucmVnaW9ucy5wcm9jZXNzKGlucHV0cyk7XG4gICAgICAgIC8qKiBjaGVjayBhbmQgcHJvY2VzcyBpY29ucyBpbnB1dCAqL1xuICAgICAgICB2YXIgaWNvbnMgPSB0aGlzLmljb25zLnByb2Nlc3MoaW5wdXRzLnJlZ2lvbnMsIGlucHV0cy5zZXF1ZW5jZXMsIGlucHV0cy5pY29ucyk7XG4gICAgICAgIC8qKiBjaGVjayBhbmQgcHJvY2VzcyBzZXF1ZW5jZXMgaW5wdXQgKi9cbiAgICAgICAgZGF0YSA9IHRoaXMucm93cy5wcm9jZXNzKGlucHV0cy5zZXF1ZW5jZXMsIGljb25zLCBpbnB1dHMucmVnaW9ucywgaW5wdXRzLm9wdGlvbnMpO1xuICAgICAgICAvKiogY2hlY2sgYW5kIHByb2Nlc3MgbGFiZWxzIGlucHV0ICovXG4gICAgICAgIF9iID0gdGhpcy5sYWJlbHMucHJvY2VzcyhpbnB1dHMucmVnaW9ucywgaW5wdXRzLnNlcXVlbmNlcyksIGxhYmVscyA9IF9iWzBdLCBzdGFydEluZGV4ZXMgPSBfYlsxXSwgdG9vbHRpcHMgPSBfYlsyXSwgbGFiZWxzRmxhZyA9IF9iWzNdO1xuICAgICAgICAvKiogY3JlYXRlL3VwZGF0ZSBzcXYtYm9keSBodG1sICovXG4gICAgICAgIHRoaXMuY3JlYXRlR1VJKGRhdGEsIGxhYmVscywgc3RhcnRJbmRleGVzLCB0b29sdGlwcywgaW5wdXRzLm9wdGlvbnMsIGxhYmVsc0ZsYWcpO1xuICAgICAgICAvKiogbGlzdGVuIGNvcHkgcGFzdGUgZXZlbnRzICovXG4gICAgICAgIHRoaXMuc2VsZWN0aW9uLnByb2Nlc3MoKTtcbiAgICAgICAgLyoqIGxpc3RlbiBzZWxlY3Rpb24gZXZlbnRzICovXG4gICAgICAgIHRoaXMuZXZlbnRzLm9uUmVnaW9uU2VsZWN0ZWQoKTtcbiAgICB9O1xuICAgIFByb1NlcVZpZXdlci5wcm90b3R5cGUuZ2VuZXJhdGVMYWJlbHMgPSBmdW5jdGlvbiAoaWR4LCBsYWJlbHMsIHN0YXJ0SW5kZXhlcywgaW5kZXhlc0xvY2F0aW9uLCBjaHVua1NpemUsIGZvbnRTaXplLCB0b29sdGlwcywgZGF0YSwgbGluZVNlcGFyYXRpb24pIHtcbiAgICAgICAgdmFyIGxhYmVsc2h0bWwgPSAnJztcbiAgICAgICAgdmFyIGxhYmVsc0NvbnRhaW5lciA9ICcnO1xuICAgICAgICB2YXIgbm9HYXBzTGFiZWxzID0gW107XG4gICAgICAgIGlmIChsYWJlbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKGluZGV4ZXNMb2NhdGlvbiAhPSAnbGF0ZXJhbCcpIHtcbiAgICAgICAgICAgICAgICBsYWJlbHNodG1sICs9IFwiPHNwYW4gY2xhc3M9XFxcImxibC1oaWRkZW5cXFwiIHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOlwiLmNvbmNhdChsaW5lU2VwYXJhdGlvbiwgXCI7XFxcIj48L3NwYW4+XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGZsYWcgPSB2b2lkIDA7XG4gICAgICAgICAgICB2YXIgY291bnQgPSAtMTtcbiAgICAgICAgICAgIHZhciBzZXFOID0gLTE7XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIGRhdGFfMSA9IGRhdGE7IF9pIDwgZGF0YV8xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIHZhciBzZXFOdW0gPSBkYXRhXzFbX2ldO1xuICAgICAgICAgICAgICAgIGlmIChub0dhcHNMYWJlbHMubGVuZ3RoIDwgZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9HYXBzTGFiZWxzLnB1c2goMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlcU4gKz0gMTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciByZXMgaW4gc2VxTnVtKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXFOdW1bcmVzXS5jaGFyICYmIHNlcU51bVtyZXNdLmNoYXIuaW5jbHVkZXMoJ3N2ZycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmbGFnID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChmbGFnKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vR2Fwc0xhYmVsc1tzZXFOXSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaWR4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsaW5lIHdpdGggb25seSBpY29ucywgbm8gbmVlZCBmb3IgaW5kZXhcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsc2h0bWwgKz0gXCI8c3BhbiBjbGFzcz1cXFwibGJsLWhpZGRlblxcXCIgc3R5bGU9XFxcIm1hcmdpbi1ib3R0b206XCIuY29uY2F0KGxpbmVTZXBhcmF0aW9uLCBcIlxcXCI+PHNwYW4gY2xhc3M9XFxcImxibFxcXCI+IFwiKS5jb25jYXQobm9HYXBzTGFiZWxzW3NlcU5dLCBcIjwvc3Bhbj48L3NwYW4+XCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxzaHRtbCArPSBcIjxzcGFuIGNsYXNzPVxcXCJsYmwtaGlkZGVuXFxcIiBzdHlsZT1cXFwibWFyZ2luLWJvdHRvbTpcIi5jb25jYXQobGluZVNlcGFyYXRpb24sIFwiXFxcIj48c3BhbiBjbGFzcz1cXFwibGJsXFxcIj48L3NwYW4+PC9zcGFuPlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY291bnQgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkeCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjaHVua1NpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsYXRlcmFsIGluZGV4IHJlZ3VsYXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbHNodG1sICs9IFwiPHNwYW4gY2xhc3M9XFxcImxibC1oaWRkZW5cXFwiIHN0eWxlPVxcXCJ3aWR0aDogXCIuY29uY2F0KGZvbnRTaXplLCBcIjttYXJnaW4tYm90dG9tOlwiKS5jb25jYXQobGluZVNlcGFyYXRpb24sIFwiXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcImxibFxcXCIgPlwiKS5jb25jYXQoKHN0YXJ0SW5kZXhlc1tjb3VudF0gLSAxKSArIGlkeCwgXCI8L3NwYW4+PC9zcGFuPlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBub0dhcHMgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHJlcyBpbiBzZXFOdW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCtyZXMgPD0gKGlkeCkgJiYgc2VxTnVtW3Jlc10uY2hhciAhPT0gJy0nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub0dhcHMgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsYXRlcmFsIGluZGV4IGdhcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vR2Fwc0xhYmVsc1tzZXFOXSA9IG5vR2FwcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbHNodG1sICs9IFwiPHNwYW4gY2xhc3M9XFxcImxibC1oaWRkZW5cXFwiIHN0eWxlPVxcXCJ3aWR0aDogIFwiLmNvbmNhdChmb250U2l6ZSwgXCI7bWFyZ2luLWJvdHRvbTpcIikuY29uY2F0KGxpbmVTZXBhcmF0aW9uLCBcIlxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJsYmxcXFwiID5cIikuY29uY2F0KChzdGFydEluZGV4ZXNbY291bnRdIC0gMSkgKyBub0dhcHNMYWJlbHNbc2VxTl0sIFwiPC9zcGFuPjwvc3Bhbj5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbHNodG1sICs9IFwiPHNwYW4gY2xhc3M9XFxcImxibC1oaWRkZW5cXFwiIHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOlwiLmNvbmNhdChsaW5lU2VwYXJhdGlvbiwgXCJcXFwiPjxzcGFuIGNsYXNzPVxcXCJsYmxcXFwiPlwiKS5jb25jYXQobGFiZWxzW2NvdW50XSkuY29uY2F0KHRvb2x0aXBzW2NvdW50XSwgXCI8L3NwYW4+PC9zcGFuPlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmbGFnID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5kZXhlc0xvY2F0aW9uID09ICdsYXRlcmFsJyB8fCAnYm90aCcpIHtcbiAgICAgICAgICAgICAgICBsYWJlbHNDb250YWluZXIgPSBcIjxzcGFuIGNsYXNzPVxcXCJsYmxDb250YWluZXJcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OiBpbmxpbmUtYmxvY2tcXFwiPlwiLmNvbmNhdChsYWJlbHNodG1sLCBcIjwvc3Bhbj5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBhZGQgbWFyZ2luIGluIGNhc2Ugd2Ugb25seSBoYXZlIGxhYmVscyBhbmQgbm8gaW5kZXhlc1xuICAgICAgICAgICAgICAgIGxhYmVsc0NvbnRhaW5lciA9IFwiPHNwYW4gY2xhc3M9XFxcImxibENvbnRhaW5lclxcXCIgc3R5bGU9XFxcIm1hcmdpbi1yaWdodDoxMHB4O2Rpc3BsYXk6IGlubGluZS1ibG9ja1xcXCI+XCIuY29uY2F0KGxhYmVsc2h0bWwsIFwiPC9zcGFuPlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGFiZWxzQ29udGFpbmVyO1xuICAgIH07XG4gICAgUHJvU2VxVmlld2VyLnByb3RvdHlwZS5hZGRUb3BJbmRleGVzID0gZnVuY3Rpb24gKGNodW5rU2l6ZSwgeCwgbWF4VG9wLCByb3dNYXJnaW5Cb3R0b20pIHtcbiAgICAgICAgdmFyIGNlbGxzID0gJyc7XG4gICAgICAgIC8vIGFkZGluZyB0b3AgaW5kZXhlc1xuICAgICAgICB2YXIgY2h1bmtUb3BJbmRleDtcbiAgICAgICAgaWYgKHggJSBjaHVua1NpemUgPT09IDAgJiYgeCA8PSBtYXhUb3ApIHtcbiAgICAgICAgICAgIGNodW5rVG9wSW5kZXggPSBcIjxzcGFuIGNsYXNzPVxcXCJjZWxsXFxcIiBzdHlsZT1cXFwiLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtkaXJlY3Rpb246IHJ0bDtkaXNwbGF5OmJsb2NrO3dpZHRoOjAuNmVtO21hcmdpbi1ib3R0b206XCIuY29uY2F0KHJvd01hcmdpbkJvdHRvbSwgXCJcXFwiPlwiKS5jb25jYXQoeCwgXCI8L3NwYW4+XCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2h1bmtUb3BJbmRleCA9IFwiPHNwYW4gY2xhc3M9XFxcImNlbGxcXFwiIHN0eWxlPVxcXCItd2Via2l0LXVzZXItc2VsZWN0OiBub25lO2Rpc3BsYXk6YmxvY2s7dmlzaWJpbGl0eTogaGlkZGVuO21hcmdpbi1ib3R0b206XCIuY29uY2F0KHJvd01hcmdpbkJvdHRvbSwgXCJcXFwiPjA8L3NwYW4+XCIpO1xuICAgICAgICB9XG4gICAgICAgIGNlbGxzICs9IGNodW5rVG9wSW5kZXg7XG4gICAgICAgIHJldHVybiBjZWxscztcbiAgICB9O1xuICAgIFByb1NlcVZpZXdlci5wcm90b3R5cGUuY3JlYXRlR1VJID0gZnVuY3Rpb24gKGRhdGEsIGxhYmVscywgc3RhcnRJbmRleGVzLCB0b29sdGlwcywgb3B0aW9ucywgbGFiZWxzRmxhZykge1xuICAgICAgICB2YXIgc3F2Qm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZGl2SWQpO1xuICAgICAgICAvLyBjb252ZXJ0IHRvIG5vZGVzIHRvIGltcHJvdmUgcmVuZGVyaW5nIChpZGVhIHRvIHRyeSk6XG4gICAgICAgIC8vIENyZWF0ZSBuZXcgZWxlbWVudFxuICAgICAgICAvLyBjb25zdCByb290ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIC8vIC8vIEFkZCBjbGFzcyB0byBlbGVtZW50XG4gICAgICAgIC8vIHJvb3QuY2xhc3NOYW1lID0gJ215LW5ldy1lbGVtZW50JztcbiAgICAgICAgLy8gLy8gQWRkIGNvbG9yXG4gICAgICAgIC8vIHJvb3Quc3R5bGUuY29sb3IgPSAncmVkJztcbiAgICAgICAgLy8gLy8gRmlsbCBlbGVtZW50IHdpdGggaHRtbFxuICAgICAgICAvLyByb290LmlubmVySFRNTCA9IGBgO1xuICAgICAgICAvLyAvLyBBZGQgZWxlbWVudCBub2RlIHRvIERPTSBncmFwaFxuICAgICAgICAvLyBzcXZCb2R5LmFwcGVuZENoaWxkKHJvb3QpO1xuICAgICAgICAvLyAvLyBFeGl0XG4gICAgICAgIC8vIHJldHVybjtcbiAgICAgICAgaWYgKCFzcXZCb2R5KSB7XG4gICAgICAgICAgICAvLyBDYW5ub3QgZmluZCBzcXYtYm9keSBlbGVtZW50XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNodW5rU2l6ZSA9IG9wdGlvbnMuY2h1bmtTaXplO1xuICAgICAgICB2YXIgZm9udFNpemUgPSBvcHRpb25zLmZvbnRTaXplO1xuICAgICAgICB2YXIgY2h1bmtTZXBhcmF0aW9uID0gb3B0aW9ucy5jaHVua1NlcGFyYXRpb247XG4gICAgICAgIHZhciBpbmRleGVzTG9jYXRpb24gPSBvcHRpb25zLmluZGV4ZXNMb2NhdGlvbjtcbiAgICAgICAgdmFyIHdyYXBMaW5lID0gb3B0aW9ucy53cmFwTGluZTtcbiAgICAgICAgdmFyIHZpZXdlcldpZHRoID0gb3B0aW9ucy52aWV3ZXJXaWR0aDtcbiAgICAgICAgdmFyIGxpbmVTZXBhcmF0aW9uID0gb3B0aW9ucy5saW5lU2VwYXJhdGlvbiArICc7JztcbiAgICAgICAgdmFyIGZOdW0gPSArZm9udFNpemUuc3Vic3RyKDAsIGZvbnRTaXplLmxlbmd0aCAtIDIpO1xuICAgICAgICB2YXIgZlVuaXQgPSBmb250U2l6ZS5zdWJzdHIoZm9udFNpemUubGVuZ3RoIC0gMiwgMik7XG4gICAgICAgIC8vIG1heElkeCA9IGxlbmd0aCBvZiB0aGUgbG9uZ2VzdCBzZXF1ZW5jZVxuICAgICAgICB2YXIgbWF4SWR4ID0gMDtcbiAgICAgICAgdmFyIG1heFRvcCA9IDA7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgZGF0YV8yID0gZGF0YTsgX2kgPCBkYXRhXzIubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgcm93ID0gZGF0YV8yW19pXTtcbiAgICAgICAgICAgIGlmIChtYXhJZHggPCBPYmplY3Qua2V5cyhyb3cpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIG1heElkeCA9IE9iamVjdC5rZXlzKHJvdykubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1heFRvcCA8IE9iamVjdC5rZXlzKHJvdykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgbWF4VG9wID0gT2JqZWN0LmtleXMocm93KS5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxlbmdodEluZGV4ID0gbWF4SWR4LnRvU3RyaW5nKCkubGVuZ3RoO1xuICAgICAgICB2YXIgaW5kZXhXaWR0aCA9IChmTnVtICogbGVuZ2h0SW5kZXgpLnRvU3RyaW5nKCkgKyBmVW5pdDtcbiAgICAgICAgLy8gY29uc2lkZXIgdGhlIGxhc3QgY2h1bmsgZXZlbiBpZiBpcyBub3QgbG9uZyBlbm91Z2hcbiAgICAgICAgaWYgKGNodW5rU2l6ZSA+IDApIHtcbiAgICAgICAgICAgIG1heElkeCArPSAoY2h1bmtTaXplIC0gKG1heElkeCAlIGNodW5rU2l6ZSkpICUgY2h1bmtTaXplO1xuICAgICAgICB9XG4gICAgICAgIC8vIGdlbmVyYXRlIGxhYmVsc1xuICAgICAgICB2YXIgbGFiZWxzQ29udGFpbmVyID0gdGhpcy5nZW5lcmF0ZUxhYmVscyhmYWxzZSwgbGFiZWxzLCBzdGFydEluZGV4ZXMsIGluZGV4ZXNMb2NhdGlvbiwgZmFsc2UsIGluZGV4V2lkdGgsIHRvb2x0aXBzLCBkYXRhLCBsaW5lU2VwYXJhdGlvbik7XG4gICAgICAgIHZhciBpbmRleCA9ICcnO1xuICAgICAgICB2YXIgY2FyZHMgPSAnJztcbiAgICAgICAgdmFyIGNlbGw7XG4gICAgICAgIHZhciBlbnRpdHk7XG4gICAgICAgIHZhciBzdHlsZTtcbiAgICAgICAgdmFyIGh0bWwgPSAnJztcbiAgICAgICAgdmFyIGlkeE51bSA9IDA7XG4gICAgICAgIHZhciBpZHg7XG4gICAgICAgIHZhciBjZWxscyA9ICcnO1xuICAgICAgICBmb3IgKHZhciB4ID0gMTsgeCA8PSBtYXhJZHg7IHgrKykge1xuICAgICAgICAgICAgaWYgKGluZGV4ZXNMb2NhdGlvbiAhPSAnbGF0ZXJhbCcpIHtcbiAgICAgICAgICAgICAgICBjZWxscyA9IHRoaXMuYWRkVG9wSW5kZXhlcyhjaHVua1NpemUsIHgsIG1heFRvcCwgbGluZVNlcGFyYXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgO1xuICAgICAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCBkYXRhLmxlbmd0aDsgeSsrKSB7XG4gICAgICAgICAgICAgICAgZW50aXR5ID0gZGF0YVt5XVt4XTtcbiAgICAgICAgICAgICAgICBzdHlsZSA9ICdmb250LXNpemU6IDFlbTtkaXNwbGF5OmJsb2NrO2hlaWdodDoxZW07bGluZS1oZWlnaHQ6MWVtO21hcmdpbi1ib3R0b206JyArIGxpbmVTZXBhcmF0aW9uO1xuICAgICAgICAgICAgICAgIGlmICh5ID09PSBkYXRhLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgc3R5bGUgPSAnZm9udC1zaXplOiAxZW07ZGlzcGxheTpibG9jaztsaW5lLWhlaWdodDoxZW07bWFyZ2luLWJvdHRvbTonICsgbGluZVNlcGFyYXRpb247XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghZW50aXR5KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGVtcHR5ZmlsbGVyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlID0gJ2ZvbnQtc2l6ZTogMWVtO2Rpc3BsYXk6YmxvY2s7Y29sb3I6IHJnYmEoMCwgMCwgMCwgMCk7aGVpZ2h0OjFlbTtsaW5lLWhlaWdodDoxZW07bWFyZ2luLWJvdHRvbTonICsgbGluZVNlcGFyYXRpb247XG4gICAgICAgICAgICAgICAgICAgIGNlbGwgPSBcIjxzcGFuIHN0eWxlPVxcXCJcIi5jb25jYXQoc3R5bGUsIFwiXFxcIj5BPC9zcGFuPlwiKTsgLy8gbW9jayBjaGFyLCB0aGlzIGhhcyB0byBiZSBkb25lIHRvIGhhdmUgY2h1bmtzIGFsbCBvZiB0aGUgc2FtZSBsZW5ndGggKGxhc3QgY2h1bmsgY2FuJ3QgYmUgc2hvcnRlcilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbnRpdHkudGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZSArPSBcIlwiLmNvbmNhdChlbnRpdHkudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZW50aXR5LmNoYXIgJiYgIWVudGl0eS5jaGFyLmluY2x1ZGVzKCdzdmcnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8geSBpcyB0aGUgcm93LCB4IGlzIHRoZSBjb2x1bW5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwgPSBcIjxzcGFuIGNsYXNzPVxcXCJjZWxsXFxcIiBkYXRhLXJlcy14PSdcIi5jb25jYXQoeCwgXCInIGRhdGEtcmVzLXk9ICdcIikuY29uY2F0KHksIFwiJyBkYXRhLXJlcy1pZD0gJ1wiKS5jb25jYXQodGhpcy5kaXZJZCwgXCInXFxuICAgICAgICAgICAgICAgICAgICBzdHlsZT1cXFwiXCIpLmNvbmNhdChzdHlsZSwgXCJcXFwiPlwiKS5jb25jYXQoZW50aXR5LmNoYXIsIFwiPC9zcGFuPlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlICs9ICctd2Via2l0LXVzZXItc2VsZWN0OiBub25lOyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsID0gXCI8c3BhbiBzdHlsZT1cXFwiXCIuY29uY2F0KHN0eWxlLCBcIlxcXCI+XCIpLmNvbmNhdChlbnRpdHkuY2hhciwgXCI8L3NwYW4+XCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNlbGxzICs9IGNlbGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXJkcyArPSBcIjxkaXYgY2xhc3M9XFxcImNyZFxcXCI+XCIuY29uY2F0KGNlbGxzLCBcIjwvZGl2PlwiKTsgLy8gd2lkdGggMy81ZW0gdG8gcmVkdWNlIHdoaXRlIHNwYWNlIGFyb3VuZCBsZXR0ZXJzXG4gICAgICAgICAgICBjZWxscyA9ICcnO1xuICAgICAgICAgICAgaWYgKGNodW5rU2l6ZSA+IDAgJiYgeCAlIGNodW5rU2l6ZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNpZGVyaW5nIHRoZSByb3cgb2YgdG9wIGluZGV4ZXNcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXhlc0xvY2F0aW9uICE9ICd0b3AnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlkeE51bSArPSBjaHVua1NpemU7IC8vIGxhdGVyYWwgaW5kZXggKHNldCBvbmx5IGlmIHRvcCBpbmRleGVzIG1pc3NpbmcpXG4gICAgICAgICAgICAgICAgICAgIGlkeCA9IGlkeE51bSAtIChjaHVua1NpemUgLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gYWRkaW5nIGxhYmVsc1xuICAgICAgICAgICAgICAgICAgICB2YXIgZ2Fwc0NvbnRhaW5lciA9IHRoaXMuZ2VuZXJhdGVMYWJlbHMoaWR4LCBsYWJlbHMsIHN0YXJ0SW5kZXhlcywgaW5kZXhlc0xvY2F0aW9uLCBjaHVua1NpemUsIGluZGV4V2lkdGgsIGZhbHNlLCBkYXRhLCBsaW5lU2VwYXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsYWJlbHNbMF0gPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGdhcHNDb250YWluZXI7IC8vIGxhdGVyYWwgbnVtYmVyIGluZGV4ZXNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gbGFiZWxzQ29udGFpbmVyICsgZ2Fwc0NvbnRhaW5lcjsgLy8gbGF0ZXJhbCBudW1iZXIgaW5kZXhlcyArIGxhYmVsc1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghbGFiZWxzRmxhZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBnYXBzQ29udGFpbmVyOyAvLyBsYXRlcmFsIG51bWJlciBpbmRleGVzXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGxhYmVsc0NvbnRhaW5lciArIGdhcHNDb250YWluZXI7IC8vIGxhdGVyYWwgbnVtYmVyIGluZGV4ZXMgKyBsYWJlbHNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBsYWJlbHNDb250YWluZXI7IC8vIHRvcFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpbmRleCA9IFwiPGRpdiBjbGFzcz1cXFwiaWR4IGhpZGRlblxcXCI+XCIuY29uY2F0KGluZGV4LCBcIjwvZGl2PlwiKTtcbiAgICAgICAgICAgICAgICBzdHlsZSA9IFwiZm9udC1zaXplOiBcIi5jb25jYXQoZm9udFNpemUsIFwiO1wiKTtcbiAgICAgICAgICAgICAgICBpZiAoeCAhPT0gbWF4SWR4KSB7XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlICs9ICdwYWRkaW5nLXJpZ2h0OiAnICsgY2h1bmtTZXBhcmF0aW9uICsgJ2VtOyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdHlsZSArPSAnbWFyZ2luLXJpZ2h0OiAnICsgY2h1bmtTZXBhcmF0aW9uICsgJ2VtOyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBjaHVuayA9ICcnO1xuICAgICAgICAgICAgICAgIGlmIChsYWJlbHNGbGFnIHx8IG9wdGlvbnMuY29uc2Vuc3VzVHlwZSB8fCBpbmRleGVzTG9jYXRpb24gPT0gJ2JvdGgnIHx8IGluZGV4ZXNMb2NhdGlvbiA9PSAnbGF0ZXJhbCcpIHsgLy8gYm90aFxuICAgICAgICAgICAgICAgICAgICBjaHVuayA9IFwiPGRpdiBjbGFzcz1cXFwiY25rXFxcIiBzdHlsZT1cXFwiXCIuY29uY2F0KHN0eWxlLCBcIlxcXCI+XCIpLmNvbmNhdChpbmRleCwgXCI8ZGl2IGNsYXNzPVxcXCJjcmRzXFxcIj5cIikuY29uY2F0KGNhcmRzLCBcIjwvZGl2PjwvZGl2PlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNodW5rID0gXCI8ZGl2IGNsYXNzPVxcXCJjbmtcXFwiIHN0eWxlPVxcXCJcIi5jb25jYXQoc3R5bGUsIFwiXFxcIj48ZGl2IGNsYXNzPVxcXCJpZHggaGlkZGVuXFxcIj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJjcmRzXFxcIj5cIikuY29uY2F0KGNhcmRzLCBcIjwvZGl2PjwvZGl2PlwiKTsgLy8gdG9wXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhcmRzID0gJyc7XG4gICAgICAgICAgICAgICAgaW5kZXggPSAnJztcbiAgICAgICAgICAgICAgICBodG1sICs9IGNodW5rO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBpbm5lckhUTUw7XG4gICAgICAgIGlmICh3cmFwTGluZSkge1xuICAgICAgICAgICAgaW5uZXJIVE1MID0gXCI8ZGl2IGNsYXNzPVxcXCJyb290XFxcIj4gICBcIi5jb25jYXQoaHRtbCwgXCIgPC9kaXY+XCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaW5uZXJIVE1MID0gXCI8ZGl2IGNsYXNzPVxcXCJyb290XFxcIiBzdHlsZT1cXFwiZGlzcGxheTogZmxleFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cXFwiZGlzcGxheTppbmxpbmUtYmxvY2s7b3ZlcmZsb3cteDpzY3JvbGw7d2hpdGUtc3BhY2U6IG5vd3JhcDt3aWR0aDpcIi5jb25jYXQodmlld2VyV2lkdGgsIFwiXFxcIj4gXCIpLmNvbmNhdChodG1sLCBcIjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlwiKTtcbiAgICAgICAgfVxuICAgICAgICBzcXZCb2R5LmlubmVySFRNTCA9IGlubmVySFRNTDtcbiAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdyZXNpemUnKSk7XG4gICAgfTtcbiAgICBQcm9TZXFWaWV3ZXIuc3F2TGlzdCA9IFtdO1xuICAgIHJldHVybiBQcm9TZXFWaWV3ZXI7XG59KCkpO1xuZXhwb3J0IGRlZmF1bHQgUHJvU2VxVmlld2VyO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==