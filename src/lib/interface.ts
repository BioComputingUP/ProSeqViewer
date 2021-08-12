export interface Sequences {
  sequence: string,
  id?: number,
  label?: string,
  colorScheme?: string,
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
  spaceSize?: number, // space between chunks TODO rename into chunkSeparation
  oneLineWidth?: string, // TODO rename to sidebarWidth

  // indexesLocation: string,  // "top" / "lateral" / "both"
  topIndexes?: boolean,  // TODO test if possibile to have both lateral and top indexes, otherwise drop one of the two options
  lateralIndexes?: boolean,  // TODO see comment above

  consensusStartIndex?: number,  // TODO check if possible to remove
  lateralIndexesGap?: boolean, // TODO check if possible to remove

  oneLineSetting?: boolean,  // TODO rename to wrapLine
  rowMarginBottom?: string,  // TODO rename to lineSeparation

  // TODO refactor as appropriate
  // consensusColorIdentity: string | {}, // {50: ["bg_color", "fg_color"]},
  // consensusColorMapping: string | {}, // {G: ["+", "bg_color", "fg_color"]}
  // consensusDotThreshold: number,
  // sequenceColor?: string | {},
  // sequenceColorMatrix?: string | {}
// TODO refactor as appropriate, see above
  colorScheme?: string,
  consensusType?: string,
  consensusThreshold?: number

}

// TODO check whether it is necessary or not
export interface IconsHtml {
  id: number,
  lollipop?: string,
  arrowLeft?: number,
  arrowRight?: string,
  strand?: string,
  noSecondary?: string,
  helix?: string,
  turn?: string
}

export interface Input {
  sequences: Array<Sequences>,
  regions?: Array<Regions>,
  patterns?: Array<Patterns>,
  icons?: Array<Icons>,
  options?: Options,
  iconsHtml?: Array<IconsHtml> // TODO maybe remove
}
