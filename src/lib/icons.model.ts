import {Icons} from './icons';

export class IconsModel {

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

                  // default icons

                  switch (reg.icon) {
                    case 'lollipop': {
                      icon = Icons.lollipop;
                      break;
                    }
                    case 'arrowRight': {
                      icon = Icons.arrowRight;
                      break;
                    }
                    case 'arrowLeft': {
                      icon = Icons.arrowLeft;
                      break;
                    }
                    case 'strand': {
                      icon = Icons.strand;
                      break;
                    }
                    case 'noSecondary': {
                      icon = Icons.noSecondary;
                      break;
                    }
                    case 'helix': {
                      icon = Icons.helix;
                      break;
                    }
                    case 'turn': {
                      icon = Icons.turn;
                      break;
                    }
                    default: {
                      // customizable icons
                      if (iconsHtml && iconsHtml[reg.icon]) {
                        icon = iconsHtml[reg.icon];
                      }
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
