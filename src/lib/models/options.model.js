var log_model_1 = require('./log.model');
class OptionsModel {
    constructor() {
        this.options = {
            fontSize: '14px',
            chunkSize: 10,
            spaceSize: 1,
            logLevel: 'none',
            emptyFiller: '-',
            topIndexes: false,
            lateralIndexes: false,
            lateralIndexesGap: false,
            lateralIndexStart: 0,
            sidebarWidth: '2em',
            oneLineSetting: false,
            oneLineWidth: '300px',
            consensusType: null,
            consensusThreshold: 90
        };
    }
    process(opt) {
        if (opt === undefined) {
            log_model_1.Log.w(1, 'undefined parameters.');
            return;
        }
        /** check input fontSize */
        if (opt.fontSize !== undefined) {
            const fSize = opt.fontSize;
            const fNum = +fSize.substr(0, fSize.length - 2);
            const fUnit = fSize.substr(fSize.length - 2, 2);
            if (isNaN(fNum) || (fUnit !== 'px' && fUnit !== 'vw' && fUnit !== 'em')) {
                log_model_1.Log.w(1, 'wrong fontSize format.');
            }
            else {
                this.options.fontSize = fSize;
            }
        }
        else {
            log_model_1.Log.w(2, 'fontSize not set.');
            this.options.fontSize = '14px'; // default reset
        }
        /** check input sidebarWidth */
        if (opt.sidebarWidth !== undefined) {
            const sidebarWidth = opt.sidebarWidth;
            const sNum = +sidebarWidth.substr(0, sidebarWidth.length - 2);
            const sUnit = sidebarWidth.substr(sidebarWidth.length - 2, 2);
            if (isNaN(sNum) || (sUnit !== 'px' && sUnit !== 'vw' && sUnit !== 'em')) {
                log_model_1.Log.w(1, 'wrong sidebarWidth format.');
            }
            else {
                this.options.sidebarWidth = sidebarWidth;
            }
        }
        else {
            log_model_1.Log.w(2, 'sidebarWidth not set.');
        }
        /** check input chunkSize */
        if (opt.chunkSize !== undefined) {
            const cSize = +opt.chunkSize;
            if (isNaN(cSize) || cSize < 0) {
                log_model_1.Log.w(1, 'wrong chunkSize format.');
            }
            else {
                this.options.chunkSize = cSize;
            }
        }
        else {
            log_model_1.Log.w(2, 'chunkSize not set.');
        }
        /** check input spaceSize */
        if (opt.spaceSize !== undefined) {
            const cSize = +opt.spaceSize;
            if (isNaN(cSize) || cSize < 0) {
                log_model_1.Log.w(1, 'wrong spaceSize format.');
            }
            else {
                this.options.spaceSize = cSize;
            }
        }
        else {
            log_model_1.Log.w(2, 'spaceSize not set.');
        }
        /** check log value */
        if (opt.logLevel !== undefined) {
            this.options.logLevel = opt.logLevel;
            console.log(opt.logLevel);
            switch (opt.logLevel) {
                case 'none': {
                    log_model_1.Log.s(0);
                    break;
                }
                case 'error': {
                    log_model_1.Log.s(1);
                    break;
                }
                case 'warn': {
                    log_model_1.Log.s(2);
                    break;
                }
            }
        }
        else {
            log_model_1.Log.w(2, 'log not set.');
        }
        /** check topIndexes value */
        if (opt.topIndexes) {
            if (typeof opt.topIndexes !== 'boolean') {
                log_model_1.Log.w(1, 'wrong index type.');
            }
            else {
                this.options.topIndexes = opt.topIndexes;
            }
        }
        /** check colorScheme value */
        if (opt.colorScheme) {
            if (typeof opt.colorScheme !== 'string') {
                log_model_1.Log.w(1, 'wrong index type.');
            }
            else {
                this.options.colorScheme = opt.colorScheme;
            }
        }
        /** check lateralIndexesGap value */
        if (opt.lateralIndexesGap) {
            if (typeof opt.lateralIndexesGap !== 'boolean') {
                log_model_1.Log.w(1, 'wrong index type.');
            }
            else {
                this.options.lateralIndexesGap = opt.lateralIndexesGap;
            }
        }
        /** check lateralIndexes value */
        if (opt.lateralIndexes) {
            if (typeof opt.lateralIndexes !== 'boolean') {
                log_model_1.Log.w(1, 'wrong index type.');
            }
            else {
                this.options.lateralIndexes = opt.lateralIndexes;
            }
        }
        /** check consensusType value */
        if (opt.consensusType) {
            if (typeof opt.consensusType !== 'string') {
                log_model_1.Log.w(1, 'wrong consensus type.');
            }
            else {
                this.options.consensusType = opt.consensusType;
            }
        }
        /** check consensusThreshold value */
        if (opt.consensusThreshold) {
            if (typeof opt.consensusThreshold !== 'number') {
                log_model_1.Log.w(1, 'wrong threshold type.');
            }
            else {
                this.options.consensusThreshold = opt.consensusThreshold;
            }
        }
        /** check oneLineSetting value */
        if (opt.oneLineSetting) {
            if (typeof opt.oneLineSetting !== 'boolean' && opt.oneLineSetting) {
                log_model_1.Log.w(1, 'wrong oneLineSetting format.');
            }
            else {
                this.options.oneLineSetting = opt.oneLineSetting;
            }
        }
        else {
            this.options.oneLineSetting = false;
        }
        /** check oneLineWidth fontSize */
        if (opt.oneLineWidth) {
            const oneLineWidth = opt.oneLineWidth;
            const olNum = +oneLineWidth.substr(0, oneLineWidth.length - 2);
            const olUnit = oneLineWidth.substr(oneLineWidth.length - 2, 2);
            if (isNaN(olNum) || (olUnit !== 'px' && olUnit !== 'vw' && olUnit !== 'em')) {
                log_model_1.Log.w(1, 'wrong oneLineWidth format.');
            }
            else {
                this.options.oneLineWidth = oneLineWidth;
            }
        }
        return this.options;
    }
}
exports.OptionsModel = OptionsModel;
