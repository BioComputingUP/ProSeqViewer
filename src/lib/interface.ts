export interface Sequence {
  sequence: string,
  id?: number,
  label?: string,
  colorScheme?: string,
  labelTooltip?: string,
  startIndex?: number
}

export interface Regions {
  sequenceid?: number,
  start?: number,
  end?: number,
  backgroundColor?: string,
  color?: string,
  backgroundImage?: string
}


export interface Patterns {
  sequenceId?: number,
  start?: number,
  end?: number,
  backgroundColor?: string,
  color?: string,
  backgroundImage?: string
  pattern?: any
}

export interface Icons {
  sequenceid?: number,
  start?: number,
  end?: number,
  display?: string,
  icon?: string,
}

export interface Options {
  fontSize?: string,
  chunkSize?: number,
  spaceSize?: number,
  topIndexes?: boolean,
  logLevel?: string,
  lateralIndexes?: boolean,
  oneLineSetting?: boolean,
  oneLineWidth?: string,
  lateralIndexesGap?: boolean,
  consensusType?: string,
  consensusThreshold?: number,
  consensusStartIndex?: number,
  rowMarginBottom?: string,
  colorScheme?: string
}

export interface IconsHtml {
  id?: number,
  lollipop?: number,
  arrowLeft?: number,
  arrowRight?: string,
  strand?: string,
  noSecondary?: string,
  helix?: string,
  turn?: string
}

export interface Arguments {
  sequences: Array<Sequence>,
  regions?: Array<Regions>,
  patterns?: Array<Patterns>,
  icons?: Array<Icons>,
  options?: Options,
  iconsHtml?: Array<IconsHtml>

}
