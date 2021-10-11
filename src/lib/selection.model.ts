interface Cell {
  x: string;
  y: string;
  char?: string;
  sequenceId?: number;
  sqvId: string;
}

export class SelectionModel {

  start: Cell;
  lastOver: Cell;
  end: Cell;
  lastSqv;
  lastId;
  firstOver;

  private removeSelection(e) {
    let element;
    if (e.path) { element = e.path[0]; } else { element = e.originalTarget; }
    if (this.start) {

      // lastSelection out of cells
      if (!element.dataset.resY) {
        this.end = {y: this.lastOver.y, x: this.lastOver.x, sqvId: this.lastOver.sqvId};
      } else {
        // lastSelection on a cell
        this.end = {y: element.dataset.resY, x: element.dataset.resX, sqvId: element.dataset.resId};
      }
      this.start = undefined;
    }
  }

  private selectionhighlight(elements, options) {

    // in case we want to try implement both events, bugged at the moment
    // switch (options.selection) {
    //   case 'columnselection': {
    //     for (const selection of elements) {
    //       const x = +selection.getAttribute('data-res-x');
    //       const y = +selection.getAttribute('data-res-y');
    //       // on every drag reselect the whole area ...
    //       if (y >= +this.start.y && y <= 100000 && // I should look for max y, but I will spare time for now..
    //         x >= +this.start.x && x <= +this.lastOver.x &&
    //         selection.getAttribute('data-res-id') === this.lastOver.sqvId ) {
    //         selection.classList.add('highlight');
    //       } else {
    //         selection.classList.remove('highlight');
    //       }
    //     }
    //     break;
    //   }
    //   case 'areaselection': {
    //     for (const selection of elements) {
    //       const x = +selection.getAttribute('data-res-x');
    //       const y = +selection.getAttribute('data-res-y');
    //       // on every drag reselect the whole area ...
    //       if (x >= +this.start.x && x <= +this.lastOver.x &&
    //         y >= +this.start.y && y <= +this.lastOver.y &&
    //         selection.getAttribute('data-res-id') === this.lastOver.sqvId ) {
    //         selection.classList.add('highlight');
    //       } else {
    //         selection.classList.remove('highlight');
    //       }
    //     }
    //     break;
    //   }
    // }

    for (const selection of elements) {
      const x = +selection.getAttribute('data-res-x');
      const y = +selection.getAttribute('data-res-y');
      // on every drag reselect the whole area ...
      if (x >= +this.start.x && x <= +this.lastOver.x &&
        y >= +this.start.y && y <= +this.lastOver.y &&
        selection.getAttribute('data-res-id') === this.lastOver.sqvId ) {
        selection.classList.add('highlight');
      } else {
        selection.classList.remove('highlight');
      }
    }
  }

  public process(options) {
    // if we want to implement different selection events
    // if (!options || !options.selection) { return }

    const sequenceViewers = document.getElementsByClassName('cell');

    // remove selection on new click
    window.onmousedown = (event) => {
      this.firstOver = true;
      // right click
      if (event.which === 1) {
        const elements = document.querySelectorAll('[data-res-id=' + this.lastId + ']');
        // @ts-ignore
        for (const selection of elements) {
          selection.classList.remove('highlight');
        }
      }

    };

    // @ts-ignore
    for (const sqv of sequenceViewers) {

      sqv.onmouseover = (e: any) => {
        if(this.firstOver) {

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
          this.lastId = element.dataset.resId;
          this.lastSqv = id;

          this.start = {y: element.dataset.resY, x: element.dataset.resX, sqvId: element.dataset.resId};
          this.lastOver = {y: element.dataset.resY, x: element.dataset.resX, sqvId: element.dataset.resId};

          const elements = document.querySelectorAll('[data-res-id=' + element.dataset.resId + ']');
          this.selectionhighlight(elements, options);
          this.firstOver = false;
        }

          let element;
          if (e.path) { element = e.path[0]; } else { element = e.originalTarget; }

          if (this.start) {
            this.lastOver = {y: element.dataset.resY, x: element.dataset.resX, sqvId: element.dataset.resId};

            const elements = document.querySelectorAll('[data-res-id=' + element.dataset.resId + ']');
            if (this.lastId == element.dataset.resId) {
              this.selectionhighlight(elements, options);
            }

          }

      };
    }

    document.body.onmouseup = (e: any) => {

      let element;
      if (e.path) { element = e.path[0]; } else { element = e.originalTarget; }
      if (this.start) {

        // lastSelection out of cells
        if (!element.dataset.resY) {
          this.end = {y: this.lastOver.y, x: this.lastOver.x, sqvId: this.lastOver.sqvId};
        } else {
          // lastSelection on a cell
          this.end = {y: element.dataset.resY, x: element.dataset.resX, sqvId: element.dataset.resId};
        }
        this.start = undefined;
      }
    };

    document.body.addEventListener('keydown', (e: any) => {
      const elements = document.querySelectorAll('[data-res-id=' + this.lastId + ']');
      // @ts-ignore
      e = e || window.event;
      const key = e.which || e.keyCode; // keyCode detection
      const ctrl = e.ctrlKey ? e.ctrlKey : ((key === 17)); // ctrl detection
      if ( key === 67 && ctrl ) {
        let textToPaste = '';
        const textDict = {};
        let row = '';
        // tslint:disable-next-line:forin
        // @ts-ignore
        for ( const selection of elements) {
          if  (selection.classList.contains('highlight')) {
            if (!textDict[selection.getAttribute('data-res-y')]) {
              textDict[selection.getAttribute('data-res-y')] = '';
            }
            // new line when new row
            if (selection.getAttribute('data-res-y') !== row && row !== '') {
              textDict[selection.getAttribute('data-res-y')] += selection.innerText;
            } else {
              textDict[selection.getAttribute('data-res-y')] += selection.innerText;
            }
            selection.classList.remove('highlight');
            row = selection.getAttribute('data-res-y');
          }
        }

        let flag;
        for (const textRow in textDict) {
          if (flag) {
            textToPaste +=  '\n' + textDict[textRow];
          } else {
            textToPaste +=  textDict[textRow];
            flag = true;
          }
        }
        if (textToPaste !== '') {
          // copy to clipboard for the paste event
          const dummy = document.createElement('textarea');
          document.body.appendChild(dummy);
          dummy.value = textToPaste;


          dummy.select();
          document.execCommand('copy');
          document.body.removeChild(dummy);


          const evt = new CustomEvent('onHighlightSelection', {detail: {text: textToPaste, eventType: 'highlight selection'}} );
          window.dispatchEvent(evt);
        }
      }
    }, false);


  }}
