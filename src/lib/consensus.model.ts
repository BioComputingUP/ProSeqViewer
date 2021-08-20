import {Palettes} from './palettes';

export class ConsensusModel {



  static setConsensusInfo(type, sequences) {
    const idIdentity = -99999999999999;
    const idPhysical = -99999999999998;
    const consensusInfo = [];

    for (let i = 0; i < sequences[0].sequence.length; i++) {
        const consensusColumn = {};
        for (const sequence of sequences) {
          let letter = sequence.sequence[i];
          if (type === 'physical') {
            if (sequence.id === idIdentity) { continue; }
            if (letter in Palettes.consensusAaLesk) {
              letter = Palettes.consensusAaLesk[letter][0];
            }
          } else {
            if (sequence.id === idPhysical) { continue; }
          }
          if (letter === '-' || !letter) { continue; }
          if (consensusColumn[letter]) {
            consensusColumn[letter] += 1;
          } else {
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
    } else {
      label = 'Consensus identity ' + threshold + '%';
    }

    let consensusSequence = '';

    // tslint:disable-next-line:forin
    for (const column in consensus) {

      let maxLetter;
      let maxIndex;
      if (Object.keys(consensus[column]).length === 0) {
        maxLetter = '.';
      } else {
        maxLetter = Object.keys(consensus[column]).reduce((a, b) =>
          consensus[column][a] > consensus[column][b] ? a : b);
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
        } else {
          maxLetterId = Object.keys(consensus2[column]).reduce((a, b) =>
            consensus2[column][a] > consensus2[column][b] ? a : b);
          maxIndexId = consensus2[column][maxLetterId];
        }
        const frequencyId = (maxIndexId / sequences.length) * 100;
        if (frequencyId >= threshold) {
          maxLetter = maxLetterId;
          [backgroundColor, color] = ConsensusModel.setColorsIdentity(frequencyId, palette, 'physical');
        } else {

          if (frequency >= threshold) {
            [backgroundColor, color] = ConsensusModel.setColorsPhysical(maxLetter, palette);
          }
        }

      } else {
        [backgroundColor, color] = ConsensusModel.setColorsIdentity(frequency, palette, 'identity');
      }
      if (frequency < threshold) {
        maxLetter = '.';
      }
      // + 1 because residues start from 1 and not 0
      regions.push({start: +column + 1, end: +column + 1, sequenceId: id, backgroundColor, color });
      consensusSequence += maxLetter;
    }

    sequences.push({id, sequence: consensusSequence, label});

    return [sequences, regions];
  }

  static setColorsIdentity(frequency, palette, flag) {
    let backgroundColor;
    let color;
    let finalPalette;

    if (palette && typeof palette !== 'string' && flag == 'identity') {
      finalPalette = palette;
    } else {
      finalPalette = Palettes.consensusLevelsIdentity;
    }
    let steps = [];
    for (let key in finalPalette) {
        steps.push(+key); // 42
    }
    steps = steps.sort((a,b) =>  a < b ? 1 : a > b ? -1 : 0)

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
    } else {
      finalPalette = Palettes.consensusAaLesk;
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
    if (!regions) { regions = []}
    let maxIdx = 0;

    for (const row of sequences) {
      if (maxIdx < row.sequence.length) { maxIdx = row.sequence.length; }
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
        sequences.sort( (a, b) => a.id - b.id);
        const min = sequences[0];

        let palette = Palettes.substitutionMatrixBlosum;
        if (options.sequenceColorMatrixPalette) {
          palette = options.sequenceColorMatrixPalette
        }

        let key;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < min.sequence.length; i++) {
          for (const sequence of sequences) {

            if (sequence.id === min.id) {
              key = sequence.sequence[i] + sequence.sequence[i]
              if (key in palette) {

                regions.push({sequenceId: sequence.id, start: i + 1, end: i + 1,
                  backgroundColor: palette[key][0], color: palette[key][1]});
              }

            } else {

              // score with first sequence
              key = sequence.sequence[i] + min.sequence[i]
              if (key in palette) {
                regions.push({sequenceId: sequence.id, start: i + 1, end: i + 1,
                  backgroundColor: palette[key][0]});
              } else if (palette[min.sequence[i] + sequence.sequence[i]]) {
                key = min.sequence[i] + sequence.sequence[i]
                regions.push({sequenceId: sequence.id, start: i + 1, end: i + 1,
                  backgroundColor: palette[key][0], color: palette[key][1]});
              }

            }
          }

        }

      } else if (options.sequenceColor) {
      regions = [];
      for (const sequence of sequences) {
        sequence.sequenceColor = options.sequenceColor;
        regions.push({sequenceId: sequence.id, start:  1, end: sequence.sequence.length, sequenceColor: options.sequenceColor});
      }
    }

    let consensusInfoIdentity;
    let consensusInfoPhysical;

      if (options.consensusColorIdentity) {
        consensusInfoIdentity = ConsensusModel.setConsensusInfo('identity', sequences);
        [sequences, regions] = ConsensusModel.createConsensus('identity', consensusInfoIdentity, false, sequences, regions, options.consensusDotThreshold, options.consensusColorIdentity);
      } else if (options.consensusColorMapping) {
        consensusInfoPhysical = ConsensusModel.setConsensusInfo('physical', sequences);
        if (!consensusInfoIdentity) { consensusInfoIdentity = ConsensusModel.setConsensusInfo('identity', sequences); }
        [sequences, regions] = ConsensusModel.createConsensus('physical', consensusInfoPhysical, consensusInfoIdentity, sequences, regions, options.consensusDotThreshold, options.consensusColorMapping);
    }

    return [sequences, regions];
    }

}
