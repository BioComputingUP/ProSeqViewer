import {start} from "repl";

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
  lastSqv;
  lastId;
  firstOver;
  event_sequence = [];


  private set_start(e) {
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
    this.selectionhighlight(elements);
    this.firstOver = false;

  }

  private selectionhighlight(elements) {

    for (const selection of elements) {
      const x = +selection.getAttribute('data-res-x');
      const y = +selection.getAttribute('data-res-y');


      let firstX = Math.min(+this.start.x, +this.lastOver.x);
      let lastX =  Math.max(+this.start.x, +this.lastOver.x);
      let firstY = Math.min(+this.start.y, +this.lastOver.y);
      let lastY = Math.max(+this.start.y, +this.lastOver.y);


      // on every drag reselect the whole area ...
      if (x >= +firstX && x <= +lastX &&
        y >= +firstY && y <= +lastY &&
        selection.getAttribute('data-res-id') === this.lastOver.sqvId ) {
        selection.classList.add('highlight');
      } else {
        selection.classList.remove('highlight');
      }
    }
  }

  public process() {
    const sequenceViewers = document.getElementsByClassName('cell');




    // remove selection on new click
    window.onmousedown = (event) => {

      this.event_sequence.push(0);


      // @ts-ignore
      for (const sqv of sequenceViewers) {
        sqv.onmousedown = (e) => {
            this.set_start(e);
          }
        }

      if (this.event_sequence[0] == 0 && this.event_sequence[1] == 1 && this.event_sequence[2] == 2 && this.event_sequence[0]== 0) {
        // left click

        const elements = document.querySelectorAll('[data-res-id=' + this.lastId + ']');
        // @ts-ignore
        for (const selection of elements) {
          selection.classList.remove('highlight');
        }

      }

      // if first click outside sqvDiv (first if is valid in Chrome, second in firefox)
      if (!event.target.dataset.resX) {
        this.firstOver = true;
      }
      if (event.explicitOriginalTarget && event.explicitOriginalTarget.dataset) {
        this.firstOver = true;
      }

      this.event_sequence = [0];

    };



      // @ts-ignore
      for (const sqv of sequenceViewers) {

        sqv.onmouseover = (e: any) => {

          if (!(1 in this.event_sequence)){
            this.event_sequence.push(1);
          }

          if(this.firstOver) {

            this.set_start(e);
          }

          let element;
          if (e.path) { element = e.path[0]; } else { element = e.originalTarget; }

          if (this.start) {

            this.lastOver = {y: element.dataset.resY, x: element.dataset.resX, sqvId: element.dataset.resId};

            const elements = document.querySelectorAll('[data-res-id=' + element.dataset.resId + ']');
            if (this.lastId == element.dataset.resId) {
              this.selectionhighlight(elements);
            }

          }

        };
      }


    document.body.onmouseup = () => {
      this.event_sequence.push(2);
      this.firstOver = false;
      if (this.start) {
        this.start = undefined;
      }
      if (this.event_sequence[0] == 0 && this.event_sequence[1] == 2) {
          const elements = document.querySelectorAll('[data-res-id=' + this.lastId + ']');
          // @ts-ignore
          for (const selection of elements) {
            selection.classList.remove('highlight');
          }
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
