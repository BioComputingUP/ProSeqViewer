export class SequenceInfoModel {

  process(regions, sequences) {
    const labels = [];
    const startIndexes = [];
    const tooltips = [];
    let flag;
    sequences.sort((a, b) => a.id - b.id);
    for (const seq of sequences) {
      if (!seq) { continue; }
      if (seq.startIndex) {
        startIndexes.push(seq.startIndex);
      } else {
        startIndexes.push(1);
      }
      if (seq.labelTooltip) {
        tooltips.push(seq.labelTooltip);
      } else {
        tooltips.push('<span></span>');
      }
      if (seq.label && !this.isHTML(seq.label) ) {
        labels.push(seq.label);
        flag = true // to check if I have at least one label
      } else {
        labels.push('');
      }
    }

    return [labels, startIndexes, tooltips, flag];
  }

  isHTML = (str) => {
    const fragment = document.createRange().createContextualFragment(str);

    // remove all non text nodes from fragment
    fragment.querySelectorAll('*').forEach(el => el.parentNode.removeChild(el));

    // if there is textContent, then not a pure HTML
    return !(fragment.textContent || '').trim();
  }
}
