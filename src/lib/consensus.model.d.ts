export declare class ConsensusModel {
    static setConsensusInfo(type: any, sequences: any): any[];
    static createConsensus(type: any, consensus: any, consensus2: any, sequences: any, regions: any, threshold: any): any[];
    static setColorsIdentity(frequency: any): any[];
    static setColorsPhysical(letter: any): any[];
    static resetOrdering(ordering: any): any;
    process(sequences: any, regions: any, options: any, ordering: any): any[];
}
