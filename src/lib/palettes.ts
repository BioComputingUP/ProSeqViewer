export class Palettes {


  // AA propensities
  static clustal = {
    A: '#80a0f0', I: '#80a0f0', L: '#80a0f0', M: '#80a0f0', F: '#80a0f0', W: '#80a0f0', V: '#80a0f0',
    K: '#f01505', R: '#f01505', E: '#c048c0', D: '#c048c0', C: '#f08080', G: '#f09048',
    N: '#15c015', Q: '#15c015', S: '#15c015', T: '#15c015', P: '#c0c000', H: '#15a4a4', Y: '#15a4a4'
  };

  static zappo = {
    A: '#ffafaf', R: '#6464ff', N: '#00ff00', D: '#ff0000', C: '#ffff00', Q: '#00ff00',E: '#ff0000',
    G: '#ff00ff', H: '#6464ff', I: '#ffafaf', L: '#ffafaf',K: '#ffafaf', M: '#ffc800', F: '#ff00ff',
    P: '#00ff00', S: '#00ff00', T: '#15c015', W: '#ffc800', V: '#ffc800', Y: '#ffafaf'
  };

  static taylor = {
    A: '#ccff00', R: '#0000ff', N: '#cc00ff', D: '#ff0000', C: '#ffff00', Q: '#ff00cc',E: '#ff0066',
    G: '#ff9900', H: '#0066ff', I: '#66ff00', L: '#33ff00',K: '#6600ff', M: '#00ff00', F: '#00ff66',
    P: '#ffcc00', S: '#ff3300', T: '#ff6600', W: '#00ccff', V: '#00ffcc', Y: '#99ff00'
  };

  static hydrophobicity = {
    A: '#ad0052', R: '#0000ff', N: '#0c00f3', D: '#0c00f3', C: '#c2003d', Q: '#0c00f3',E: '#0c00f3',
    G: '#6a0095', H: '#1500ea', I: '#ff0000', L: '#ea0015',K: '#0000ff', M: '#b0004f', F: '#cb0034',
    P: '#4600b9', S: '#5e00a1', T: '#61009e', W: '#5b00a4', V: '#4f00b0', Y: '#f60009',
    B: '#0c00f3', X: '#680097', Z: '#0c00f3'
  };
  static helixpropensity = {
    A: '#e718e7', R: '#6f906f', N: '#1be41b', D: '#778877', C: '#23dc23', Q: '#926d92',E: '#ff00ff',
    G: '#00ff00', H: '#758a75', I: '#8a758a', L: '#ae51ae',K: '#a05fa0', M: '#ef10ef', F: '#986798',
    P: '#00ff00', S: '#36c936', T: '#47b847', W: '#8a758a', V: '#21de21', Y: '#857a85',
    B: '#49b649', X: '#758a75', Z: '#c936c9'
  };
  static strandpropensity = {
    A: '#5858a7', R: '#6b6b94', N: '#64649b', D: '#2121de', C: '#9d9d62', Q: '#8c8c73',E: '#0000ff',
    G: '#4949b6', H: '#60609f', I: '#ecec13', L: '#b2b24d',K: '#4747b8', M: '#82827d', F: '#c2c23d',
    P: '#2323dc', S: '#4949b6', T: '#9d9d62', W: '#c0c03f', V: '#d3d32c', Y: '#ffff00',
    B: '#4343bc', X: '#797986', Z: '#4747b8'
  };
  static turnpropensity = {
    A: '#2cd3d3', R: '#708f8f', N: '#ff0000', D: '#e81717', C: '#a85757', Q: '#3fc0c0',E: '#778888',
    G: '#ff0000', H: '#708f8f', I: '#00ffff', L: '#1ce3e3', K: '#7e8181', M: '#1ee1e1', F: '#1ee1e1',
    P: '#f60909', S: '#e11e1e', T: '#738c8c', W: '#738c8c', V: '#9d6262', Y: '#07f8f8',
    B: '#f30c0c', X: '#7c8383', Z: '#5ba4a4'
  };

  static buriedindex = {
    A: '#00a35c', R: '#00fc03', N: '#00eb14', D: '#00eb14', C: '#0000ff', Q: '#00f10e',E: '#00f10e',
    G: '#009d62', H: '#00d52a', I: '#0054ab', L: '#007b84', K: '#00ff00', M: '#009768', F: '#008778',
    P: '#00e01f', S: '#00d52a', T: '#00db24', W: '#00a857', V: '#00e619', Y: '#005fa0',
    B: '#00eb14', X: '#00b649', Z: '#00f10e'
  };

  static nucleotide = {
    A: '#64F73F', C: '#FFB340', G: '#EB413C', T: '#3C88EE', U: '#3C88EE'
  };
  static purinepyrimidine = {
    A: '#FF83FA', C: '#40E0D0', G: '#FF83FA', T: '#40E0D0', U: '#40E0D0', R: '#FF83FA', Y: '#40E0D0'
  };


  static consensusLevelsIdentity = {
    100: ['#0A0A0A', '#FFFFFF'],
    70:  ['#333333', '#FFFFFF'],
    40:  ['#707070', '#FFFFFF'],
    10:  ['#A3A3A3',  '#FFFFFF'],
    0:  ['#FFFFFF', '#FFFFFF']
  };

  // colour scheme in Lesk, Introduction to Bioinformatics
  static consensusAaLesk = {
    A: ['n', '#f09048', '#FFFFFF'],  // n: small nonpolar
    G: ['n', '#f09048', '#FFFFFF'],
    S: ['n', '#f09048', '#FFFFFF'],
    T: ['n', '#f09048', '#FFFFFF'],
    C: ['h', '#558B6E', '#FFFFFF'], // h, hydrophobic
    V: ['h', '#558B6E', '#FFFFFF'],
    I: ['h', '#558B6E', '#FFFFFF'],
    L: ['h', '#558B6E', '#FFFFFF'],
    P: ['h', '#558B6E', '#FFFFFF'],
    F: ['h', '#558B6E', '#FFFFFF'],
    Y: ['h', '#558B6E', '#FFFFFF'],
    M: ['h', '#558B6E', '#FFFFFF'],
    W: ['h', '#558B6E', '#FFFFFF'],
    N: ['p', '#D4358D', '#FFFFFF'], // p: polar
    Q: ['p', '#D4358D', '#FFFFFF'],
    H: ['p', '#D4358D', '#FFFFFF'],
    D: ['~', '#A10702', '#FFFFFF'], // ~: negatively charged
    E: ['~', '#A10702', '#FFFFFF'],
    K: ['+', '#3626A7', '#FFFFFF'],
    R: ['+', '#3626A7', '#FFFFFF']  // +: positively charged
  }

  static substitutionMatrixBlosum = { WF: [ '#CFDBF2', '#000000'], QQ: [ '#A1B8E3', '#000000'],
      HH: [ '#7294D5', '#000000'], YY: [ '#81A0D9', '#000000'], ZZ: [ '#A1B8E3', '#000000'],
      CC: [ '#6288D0', '#000000'], PP: [ '#81A0D9', '#000000'], VI: [ '#B0C4E8', '#000000'],
      VM: [ '#CFDBF2', '#000000'], KK: [ '#A1B8E3', '#000000'], ZK: [ '#CFDBF2', '#000000'],
      DN: [ '#CFDBF2', '#000000'], SS: [ '#A1B8E3', '#000000'], QR: [ '#CFDBF2', '#000000'],
      NN: [ '#91ACDE', '#000000'], YF: [ '#B0C4E8', '#000000'], VL: [ '#CFDBF2', '#000000'],
      KR: [ '#C0CFED', '#000000'], ED: [ '#C0CFED', '#000000'], VV: [ '#A1B8E3', '#000000'],
      MI: [ '#CFDBF2', '#000000'], MM: [ '#A1B8E3', '#000000'], ZD: [ '#CFDBF2', '#000000'],
      FF: [ '#91ACDE', '#000000'], BD: [ '#A1B8E3', '#000000'], HN: [ '#CFDBF2', '#000000'],
      TT: [ '#A1B8E3', '#000000'], SN: [ '#CFDBF2', '#000000'], LL: [ '#A1B8E3', '#000000'],
      EQ: [ '#C0CFED', '#000000'], YW: [ '#C0CFED', '#000000'], EE: [ '#A1B8E3', '#000000'],
      KQ: [ '#CFDBF2', '#000000'], WW: [ '#3867BC', '#000000'], ML: [ '#C0CFED', '#000000'],
      KE: [ '#CFDBF2', '#000000'], ZE: [ '#A1B8E3', '#000000'], ZQ: [ '#B0C4E8', '#000000'],
      BE: [ '#CFDBF2', '#000000'], DD: [ '#91ACDE', '#000000'], SA: [ '#CFDBF2', '#000000'],
      YH: [ '#C0CFED', '#000000'], GG: [ '#91ACDE', '#000000'], AA: [ '#A1B8E3', '#000000'],
      II: [ '#A1B8E3', '#000000'], TS: [ '#CFDBF2', '#000000'], RR: [ '#A1B8E3', '#000000'],
      LI: [ '#C0CFED', '#000000'], ZB: [ '#CFDBF2', '#000000'], BN: [ '#B0C4E8', '#000000'],
      BB: [ '#A1B8E3', '#000000']
    };
}
