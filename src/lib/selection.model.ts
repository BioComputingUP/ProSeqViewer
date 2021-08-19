interface Cell {
  x: string;
  y: string;
  char?: string;
  sequenceId?: number;
  sqvId: string;
}

export class SelectionModel {

  start: Cell;
  end: Cell;
  isDown: boolean;
  lastOver: Cell;
  lastSqv;
  selection;
  alreadySelected;

  public process() {
    const sequenceViewers = document.getElementsByClassName('cell');

    window.onmousedown = () => {
      // remove selection on new click
      if (this.selection) {
        for ( const el of this.selection) { el.classList.remove('highlight');  }
      }
    };

    // @ts-ignore
    for (const sqv of sequenceViewers) {

      sqv.onmousedown = (e: any) => {
        if (this.selection) {
          for ( const el of this.selection) { el.classList.remove('highlight');  }
        }
        this.selection = [];
        this.alreadySelected = {};

        let id;
        let element;
        if (e.path) {
          // chrome support
          element = e.path[0];
          id = document.getElementById(element.dataset.resId);
        } else {
          // firefox support
          element = e.originalTarget;
          id = document.getElementById(element.dataset.resId);
        }

        this.lastSqv = id;
        this.isDown = true;
        this.start = {y: element.dataset.resY, x: element.dataset.resX, sqvId: element.dataset.resId};
      };

      sqv.onmouseover = (e: any) => {
        let element;
        if (e.path) { element = e.path[0]; } else { element = e.originalTarget; }

        if (this.isDown) {
          this.lastOver = {y: element.dataset.resY, x: element.dataset.resX, sqvId: element.dataset.resId};
          for (let i = +this.start.y; i <= +this.lastOver.y; i++) {
            const elements = document.querySelectorAll('[data-res-y=' + CSS.escape(i.toString()) + ']');
            // highlight selected elements
            // @ts-ignore
            for (const selection of elements) {
              // on every drag reselect the whole area ...
              if (+selection.getAttribute('data-res-x') >= +this.start.x && +selection.getAttribute('data-res-x') <= +this.lastOver.x &&
                selection.getAttribute('data-res-id') === this.lastOver.sqvId ) {
                // ... but push only new elements
                if (!this.alreadySelected[selection.dataset.resY + '-' + selection.dataset.resX]) {
                  this.selection.push(selection);
                  selection.classList.add('highlight');
                }
                this.alreadySelected[selection.dataset.resY + '-' + selection.dataset.resX] = 'selected';
              }
            }
          }
        }
      };
    }

    document.body.onmouseup = (e: any) => {

      let element;
      if (e.path) { element = e.path[0]; } else { element = e.originalTarget; }
      if (this.isDown) {

        // lastSelection out of cells
        if (!element.dataset.resY) {
          this.end = {y: this.lastOver.y, x: this.lastOver.x, sqvId: this.lastOver.sqvId};
        } else {
          // lastSelection on a cell
          this.end = {y: element.dataset.resY, x: element.dataset.resX, sqvId: element.dataset.resId};
        }
        this.isDown = false;
    }
  };

    document.body.addEventListener('keydown', (e: any) => {

      e = e || window.event;
      const key = e.which || e.keyCode; // keyCode detection
      const ctrl = e.ctrlKey ? e.ctrlKey : ((key === 17)); // ctrl detection
      if ( key === 67 && ctrl ) {
        let textToPaste = '';
        const textDict = {};
        let row = '';
        for ( const el in this.selection) {
          if (!textDict[this.selection[el].getAttribute('data-res-y')]) {
            textDict[this.selection[el].getAttribute('data-res-y')] = '';
          }
          // new line when new row
          if (this.selection[el].getAttribute('data-res-y') !== row && row !== '') {
            textDict[this.selection[el].getAttribute('data-res-y')] += this.selection[el].innerText;
          } else {
            textDict[this.selection[el].getAttribute('data-res-y')] += this.selection[el].innerText;
          }
          this.selection[el].classList.remove('highlight');
          row = this.selection[el].getAttribute('data-res-y');
        }

        let flag;
        for (const textRow in textDict) {
          if (flag){
            textToPaste +=  '\n' + textDict[textRow];
          } else {
            textToPaste +=  textDict[textRow];
            flag = true;
          }
        }

        // copy to clipboard for the paste event
        const dummy = document.createElement('textarea');
        document.body.appendChild(dummy);
        dummy.value = textToPaste;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
      }
    }, false);


    // window.dispatchEvent(evt); // todo x


  }}
