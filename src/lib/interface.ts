export interface Sequences {
  sequence: string,
  id?: number,
  label?: string,
  sequenceColor?: string,
  labelTooltip?: string,
  startIndex?: number
}


export interface Regions {
  sequenceId: number,
  start: number,
  end: number,
  backgroundColor?: string,
  color?: string,
  backgroundImage?: string
}


export interface Patterns {
  sequenceId: number,
  pattern: string,
  start?: number,
  end?: number,
  backgroundColor?: string,
  color?: string,
  backgroundImage?: string
}


export interface Icons {
  sequenceId: number,
  start: number,
  end: number,
  icon: string,  // TODO check if placeholder or <svg> block (maybe to be implemented)
  display?: string,  // center
}


export type Index = 'top' | 'left';


export interface Options {
  fontSize?: string,
  chunkSize?: number, // number of chunk letters
  chunkSeparation?: number, // space between chunks
  viewerWidth?: string,
  // indexesLocation?: string, // "top" / "lateral"
  indexLocation?: Index | Index[],
  wrapLine?: boolean,
  lineSeparation?: string, // margin bottom of  horizontal rows

  sequenceColor?: string | {}, // colorscheme, introduce option for custom input
  selection?: string
}


export interface Consensus {
  color: string | {},
  dotThreshold?: number
}


export interface Input {
  consensus?: Consensus;
  sequences: Array<Sequences>,
  regions?: Array<Regions>,
  patterns?: Array<Patterns>,
  icons?: Array<Icons>,
  options?: Options,
}

