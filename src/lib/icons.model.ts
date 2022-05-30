import {Icons} from './icons';
import Lollipop from '../assets/svg/lollipop.svg';
import NoSecondary from '../assets/svg/no-secondary.svg';
import AlphaHelix from '../assets/svg/alpha-helix.svg';
import BetaStrand from '../assets/svg/beta-strand.svg';
import BetaTurn from '../assets/svg/beta-turn.svg';
import ArrowRight from '../assets/svg/arrow-right.svg';
import ArrowLeft from '../assets/svg/arrow-left.svg';

export class IconsModel {

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
                      icon = `<img src="${Lollipop}" style="width: 100%; height: 100%;">`;
                      // icon = Icons.lollipop;
                      break;
                    }
                    case 'arrowRight': {
                      icon = `<img src="${ArrowRight}" style="width: 100%; height: 100%;">`;
                      break;
                    }
                    case 'arrowLeft': {
                      icon = `<img src="${ArrowLeft}" style="width: 100%; height: 100%;">`;
                      break;
                    }
                    case 'strand': {
                      icon = `<img src="${BetaStrand}" style="width: 100%; height: 100%;">`;
                      break;
                    }
                    case 'noSecondary': {
                      icon = `<img src="${NoSecondary}" style="width: 100%; height: 100%;">`;
                      break;
                    }
                    case 'helix': {
                      icon = `<img src="${AlphaHelix}" style="width: 100%; height: 100%;">`;
                      break;
                    }
                    case 'turn': {
                      icon = `<img src="${BetaTurn}" style="width: 100%; height: 100%;">`;
                      break;
                    }
                    default: {
                      // customizable icons (svg)
                        icon = reg.icon;
                      break;
                    }
                  }

                  if (reg.display === 'center' && +key === reg.start + center) {
                    rows[seq.id][key] = {char: icon};
                  } else if (!reg.display) {
                    rows[seq.id][key] = {char: icon};
                  }

                }
              }
              // chars without icon
              if (!rows[seq.id][key]) {
                rows[seq.id][key] = {char: ''};
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
