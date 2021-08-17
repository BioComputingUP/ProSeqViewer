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

  static substitutionMatrixBlosum = { WF: {backgroundColor: '#CFDBF2'}, QQ: {backgroundColor: '#A1B8E3'},
      HH: {backgroundColor: '#7294D5'}, YY: {backgroundColor: '#81A0D9'}, ZZ: {backgroundColor: '#A1B8E3'},
      CC: {backgroundColor: '#6288D0'}, PP: {backgroundColor: '#81A0D9'}, VI: {backgroundColor: '#B0C4E8'},
      VM: {backgroundColor: '#CFDBF2'}, KK: {backgroundColor: '#A1B8E3'}, ZK: {backgroundColor: '#CFDBF2'},
      DN: {backgroundColor: '#CFDBF2'}, SS: {backgroundColor: '#A1B8E3'}, QR: {backgroundColor: '#CFDBF2'},
      NN: {backgroundColor: '#91ACDE'}, YF: {backgroundColor: '#B0C4E8'}, VL: {backgroundColor: '#CFDBF2'},
      KR: {backgroundColor: '#C0CFED'}, ED: {backgroundColor: '#C0CFED'}, VV: {backgroundColor: '#A1B8E3'},
      MI: {backgroundColor: '#CFDBF2'}, MM: {backgroundColor: '#A1B8E3'}, ZD: {backgroundColor: '#CFDBF2'},
      FF: {backgroundColor: '#91ACDE'}, BD: {backgroundColor: '#A1B8E3'}, HN: {backgroundColor: '#CFDBF2'},
      TT: {backgroundColor: '#A1B8E3'}, SN: {backgroundColor: '#CFDBF2'}, LL: {backgroundColor: '#A1B8E3'},
      EQ: {backgroundColor: '#C0CFED'}, YW: {backgroundColor: '#C0CFED'}, EE: {backgroundColor: '#A1B8E3'},
      KQ: {backgroundColor: '#CFDBF2'}, WW: {backgroundColor: '#3867BC'}, ML: {backgroundColor: '#C0CFED'},
      KE: {backgroundColor: '#CFDBF2'}, ZE: {backgroundColor: '#A1B8E3'}, ZQ: {backgroundColor: '#B0C4E8'},
      BE: {backgroundColor: '#CFDBF2'}, DD: {backgroundColor: '#91ACDE'}, SA: {backgroundColor: '#CFDBF2'},
      YH: {backgroundColor: '#C0CFED'}, GG: {backgroundColor: '#91ACDE'}, AA: {backgroundColor: '#A1B8E3'},
      II: {backgroundColor: '#A1B8E3'}, TS: {backgroundColor: '#CFDBF2'}, RR: {backgroundColor: '#A1B8E3'},
      LI: {backgroundColor: '#C0CFED'}, ZB: {backgroundColor: '#CFDBF2'}, BN: {backgroundColor: '#B0C4E8'},
      BB: {backgroundColor: '#A1B8E3'}
    };
}

// original blosum matrix with values < 0, removed from my matrix since we color them white
// static blosum62 = { WF: 1, LR: -2, SP: -1, VT: '0', QQ: 5, NA: -2, ZY: -2, WR: -3, QA: -1, SD: '0', HH: 8, SH: -1, HD: -1, LN: -3, WA: -3,
//   YM: -1, GR: -2, YI: -1, YE: -2, BY: -3, YA: -2, VD: -3, BS: '0', YY: 7, GN: '0', EC: -4, YQ: -1, ZZ: 4, VA: '0', CC: 9, MR: -1, VE: -2,
//   TN: '0', PP: 7, VI: 3, VS: -2, ZP: -1, VM: 1, TF: -2, VQ: -2, KK: 5, PD: -1, IH: -3, ID: -3, TR: -1, PL: -3, KG: -2, MN: -2,
//   PH: -2, FQ: -3, ZG: -2, XL: -1, TM: -1, ZC: -3, XH: -1, DR: -2, BW: -4, XD: -1, ZK: 1, FA: -2, ZW: -3, FE: -3, DN: 1, BK: '0',
//   XX: -1, FI: '0', BG: -1, XT: '0', FM: '0', BC: -3, ZI: -3, ZV: -2, SS: 4, LQ: -2, WE: -3, QR: 1, NN: 6, WM: -1, QC: -3, WI: -3, SC: -1,
//   LA: -1, SG: '0', LE: -3, WQ: -2, HG: -2, SK: '0', QN: '0', NR: '0', HC: -3, YN: -2, GQ: -2, YF: 3, CA: '0', VL: 1, GE: -2, GA: '0',
//   KR: 2, ED: 2, YR: -2, MQ: '0', TI: -1, CD: -3, VF: -1, TA: '0', TP: -1, BP: -2, TE: -1, VN: -3, PG: -2, MA: -1, KH: -1, VR: -3,
//   PC: -3, ME: -2, KL: -2, VV: 4, MI: 1, TQ: -1, IG: -4, PK: -1, MM: 5, KD: -1, IC: -1, ZD: 1, FR: -3, XK: -1, QD: '0', XG: -1, ZL: -3,
//   XC: -2, ZH: '0', BL: -4, BH: '0', FF: 6, XW: -2, BD: 4, DA: -2, SL: -2, XS: '0', FN: -3, SR: -1, WD: -4, VY: -1, WL: -2, HR: '0',
//   WH: -2, HN: 1, WT: -2, TT: 5, SF: -2, WP: -4, LD: -4, BI: -3, LH: -3, SN: 1, BT: -1, LL: 4, YK: -2, EQ: 2, YG: -3, ZS: '0', YC: -2,
//   GD: -1, BV: -3, EA: -1, YW: 2, EE: 5, YS: -2, CN: -3, VC: -1, TH: -2, PR: -2, VG: -3, TL: -1, VK: -2, KQ: 1, RA: -1, IR: -3, TD: -1,
//   PF: -4, IN: -3, KI: -3, MD: -3, VW: -3, WW: 11, MH: -2, PN: -2, KA: -1, ML: 2, KE: 1, ZE: 4, XN: -1, ZA: -1, ZM: -1, XF: -1,
//   KC: -3, BQ: '0', XB: -1, BM: -3, FC: -2, ZQ: 3, XZ: -1, FG: -3, BE: 1, XV: -1, FK: -3, BA: -2, XR: -1, DD: 6, WG: -2, ZF: -3, SQ: '0',
//   WC: -2, WK: -3, HQ: '0', LC: -1, WN: -4, SA: 1, LG: -4, WS: -3, SE: '0', HE: '0', SI: -2, HA: -2, SM: -1, YL: -1, YH: 2,
//   YD: -3, ER: '0', XP: -2, GG: 6, GC: -3, EN: '0', YT: -2, YP: -3, TK: -1, AA: 4, PQ: -1, TC: -1, VH: -3, TG: -2, IQ: -3, ZT: -1,
//   CR: -3, VP: -2, PE: -1, MC: -1, KN: '0', II: 4, PA: -1, MG: -3, TS: 1, IE: -3, PM: -2, MK: -1, IA: -1, PI: -3, RR: 5, XM: -1, LI: 2,
//   XI: -1, ZB: 1, XE: -1, ZN: '0', XA: '0', BR: -1, BN: 3, FD: -3, XY: -1, ZR: '0', FH: -1, BF: -3, FL: '0', XQ: -1, BB: 4
// };
