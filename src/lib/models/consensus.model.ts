import {Palettes} from '../palettes/palettes';

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
            letter = Palettes.letterTransform[letter];
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

  static createConsensus(type, consensus, consensus2, sequences, regions, threshold) {

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
          [backgroundColor, color] = ConsensusModel.setColorsIdentity(frequencyId);
        } else {
          if (frequency >= threshold) {
            [backgroundColor, color] = ConsensusModel.setColorsPhysical(maxLetter);
          }
        }

      } else {
        [backgroundColor, color] = ConsensusModel.setColorsIdentity(frequency);
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

  static setColorsIdentity(frequency) {
    let backgroundColor;
    let color;
    const step1 = 100;
    const step2 = 70;
    const step3 = 40;
    const step4 = 10;
    const step5 = 0;
    if (frequency === step1) {
      backgroundColor = Palettes.consensus[step1].backgroundColor;
      color = Palettes.consensus[step1].color;
    } else if (frequency > step2) {
      backgroundColor = Palettes.consensus[step2].backgroundColor;
      color = Palettes.consensus[step2].color;
    }  else if (frequency > step3) {
      backgroundColor = Palettes.consensus[step3].backgroundColor;
      color = Palettes.consensus[step3].color;
    }  else if (frequency > step4) {
      backgroundColor = Palettes.consensus[step4].backgroundColor;
      color = Palettes.consensus[step4].color;
    } else {
      backgroundColor = Palettes.consensus[step5].backgroundColor;
      color = Palettes.consensus[step5].color;
    }
    return [backgroundColor, color];
  }

  static setColorsPhysical(letter) {
    let backgroundColor;
    let color;
    backgroundColor = Palettes.physicalProp[letter].backgroundColor;
    color = Palettes.physicalProp[letter].color;
    return [backgroundColor, color];
  }
  static resetOrdering(ordering) {
    // in case there where no regions in input, well now there are
    if (!ordering.includes('regions')) {
      if (ordering) {
        ordering.unshift('regions');
      } else {
        ordering.push('regions');
      }
    }
    return ordering;
  }

process(sequences, regions, options, ordering) {

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

  if (options.colorScheme === 'blosum62') {
      regions = [];
      sequences.sort( (a, b) => a.id - b.id);

      const min = sequences[0];

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < min.sequence.length; i++) {
        for (const sequence of sequences) {
          let score;
          if (sequence.id === min.id) {
            score = Palettes.blosum62[sequence.sequence[i] + sequence.sequence[i]];
            // score with itself

            if (!score) { score = '-'; }
            regions.push({sequenceId: sequence.id, start: i + 1, end: i + 1,
              backgroundColor: Palettes.blosum[score].backgroundColor});

          } else {
            // score with first sequence
            if (Palettes.blosum62[sequence.sequence[i] + min.sequence[i]]) {
              score = Palettes.blosum62[sequence.sequence[i] + min.sequence[i]];
            } else {
              score = Palettes.blosum62[min.sequence[i] + sequence.sequence[i]];
            }

            if (!score) { score = '-'; }
            regions.push({sequenceId: sequence.id, start: i + 1, end: i + 1,
              backgroundColor: Palettes.blosum[score].backgroundColor});
          }
        }

      }

      ordering = ConsensusModel.resetOrdering(ordering);
    } else if (options.colorScheme === 'clustal') {
    regions = [];
    for (const sequence of sequences) {
      sequence.colorScheme = 'clustal';
      regions.push({sequenceId: sequence.id, start:  1, end: sequence.sequence.length, colorScheme: 'clustal'});
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
      if (!consensusInfoIdentity) { consensusInfoIdentity = ConsensusModel.setConsensusInfo('identity', sequences); }
      [sequences, regions] = ConsensusModel.createConsensus('physical', consensusInfoPhysical, consensusInfoIdentity, sequences, regions, options.consensusThreshold);
      ordering = ConsensusModel.resetOrdering(ordering);
      break;
    }
  }

  return [sequences, regions, ordering];
  }

}
