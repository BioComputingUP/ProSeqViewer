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
  pattern: any, // TODO try string
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

export interface Options {
  fontSize?: string,
  chunkSize?: number, // number of chunk letters
  chunkSeparation?: number, // space between chunks
  sidebarWidth?: string,
  indexesLocation?: string, // "top" / "lateral"
  wrapLine?: boolean,
  lineSeparation?: string, // margin bottom of  horizontal rows

  sequenceColor?: string | {}, // colorscheme, introduce option for custom input
  consensusDotThreshold?: number
  sequenceColorMatrix?: string | {} // blosum&co

  consensusColorIdentity?: string | {}, // {50: ["bg_color", "fg_color"]}, <-- consensusIdentical
  consensusColorMapping?: string | {}, // {G: ["+", "bg_color", "fg_color"]} <-- consensusPhysical

  selection?: string
}

export interface Input {
  sequences: Array<Sequences>,
  regions?: Array<Regions>,
  patterns?: Array<Patterns>,
  icons?: Array<Icons>,
  options?: Options,
}
