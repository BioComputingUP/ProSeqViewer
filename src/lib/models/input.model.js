class InputModel {
    process(input1, input2, input3, input4, input5, input6, input7) {
        // check inputs type and inputs ordering
        const allInputs = { sequences: [], regions: [], patterns: [], icons: [], options: {}, iconsHtml: {} };
        const ordering = [];
        this.checkInput(allInputs, ordering, input1);
        this.checkInput(allInputs, ordering, input2);
        this.checkInput(allInputs, ordering, input3);
        this.checkInput(allInputs, ordering, input4);
        this.checkInput(allInputs, ordering, input5);
        this.checkInput(allInputs, ordering, input6);
        this.checkInput(allInputs, ordering, input7);
        if (!allInputs.sequences) {
            throw Error('sequence missing');
        }
        return [allInputs, ordering];
    }
    checkInput(allInputs, ordering, input) {
        if (!Array.isArray(input)) {
            if (input) {
                if (input.id === 'icons') {
                    allInputs.iconsHtml = input;
                }
                else if (input.id === 'paths') {
                    allInputs.iconsPaths = input;
                }
                else {
                    allInputs.options = input;
                }
            }
            return;
        }
        for (const element of input) {
            if (element.sequence) {
                allInputs.sequences = input;
                break;
            }
            else if (!ordering.includes('patterns') && element.pattern) {
                allInputs.patterns = input;
                ordering.push('patterns');
            }
            else if (!ordering.includes('regions') && (element.backgroundColor || element.color && !element.pattern && !element.icon)) {
                allInputs.regions = input;
                ordering.push('regions');
            }
            else if (element.icon) {
                allInputs.icons = input;
            }
        }
    }
}
exports.InputModel = InputModel;
