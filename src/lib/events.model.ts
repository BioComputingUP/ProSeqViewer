export class EventsModel {

  public onRegionSelected() {

    const sequenceViewers = document.getElementsByClassName('cell');

    // @ts-ignore
    for (const sqv of sequenceViewers) {

      sqv.addEventListener('dblclick', r => {
        console.log(r)

          const evt = new CustomEvent('onRegionSelected', { detail: r });
          window.dispatchEvent(evt);

        });
    }

  }

}



