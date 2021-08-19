export class EventsModel {

  public onRegionSelected() {

    const sequenceViewers = document.getElementsByClassName('cell');

    // @ts-ignore
    for (const sqv of sequenceViewers) {

      sqv.addEventListener('dblclick', r => {

          const evt = new CustomEvent('onRegionSelected', {detail: {char: r.srcElement.innerHTML, x: r.srcElement.dataset.resX, y:  r.srcElement.dataset.resY}} );
          window.dispatchEvent(evt);

        });
    }

  }

}



