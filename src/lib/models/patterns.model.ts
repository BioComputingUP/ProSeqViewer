import {Log} from './log.model';

export class PatternsModel {

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
      } else {
        for (const seq of sequences) {
          // regex
          if (element.start && element.end) {
            str = seq.sequence.substr(element.start - 1, element.end - (element.start - 1));
          } else {
            Log.w(2, 'missing region bounds.');
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
      regions.push({start: +match.index + 1, end: +match.index + +match[0].length,
        backgroundColor: element.backgroundColor, color: element.color, backgroundImage: element.backgroundImage,
        borderColor: element.borderColor, borderStyle: element.borderStyle, sequenceId: element.sequenceId});
    }
  }

}
