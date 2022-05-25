import ProSeqViewer from "./proseqviewer";

function initViewer(): void {
    // Initialize a new viewer
    let viewer = new ProSeqViewer('root');
    // Define sequences
    const sequences = [
        {
            sequence: 'GTREVPADAYYGVHTLRAIENFYISNNKISDIPEFVRGMVMVKKAAAMANKELQTIPKSVANAIIAACDEVLNNGKCMDQFPVDVYQGGAGTSVNMNTNEVLANIGLELMGHQKGEYQYLNPNDHVNKCQSTNDAYPTGFRIAV',
            id: 1,
            label: 'ASPA_ECOLI/13-156'
        },
        {
            sequence: 'GEKQIEADVYYGIQTLRASENFPITGYKIHEE..MINALAIVKKAAALANMDVKRLYEGIGQAIVQAADEILE.GKWHDQFIVDPIQGGAGTSMNMNANEVIGNRALEIMGHKKGDYIHLSPNTHVNMSQSTNDVFPTAIHIST',
            id: 2,
            label: 'ASPA_BACSU/16-156'
        },
        {
            sequence: 'MKYTDTAPKLFMNTGTKFPRRIIWS.............MGVLKKSCAKVNADLGLLDKKIADSIIKASDDLID.GKLDDKIVLDVFQTGSGTGLNMNVNEVIAEVASSYSN......LKVHPNDHVNFGQSSNDTVPTAIRIAA',
            id: 3,
            label: 'FUMC_SACS2/1-124'
        },
        {
            sequence: 'GRFTQAADQRFKQFNDSLRFDYRLAEQDIV.......GSVAWSKALVTVGVLT....AEEQAQLEEALNVLLEDVRARPQQILESDAEDIHSWVEGKLIDKVG.................QLGKKLHTGRSRNDQVATDLKLWC',
            id: 4,
            label: 'ARLY_ECOLI/6-191'
        },
        {
            sequence: 'GRFVGAVDPIMEKFNASIAYDRHLWEVDVQ.......GSKAYSRGLEKAGLLT....KAEMDQILHGLDKVAEEWAQG.TFKLNSNDEDIHTANERRLKELIG.................ATAGKLHTGRSRNDQVVTDLRLWM',
            id: 5,
            label: 'ARLY_HUMAN/11-195'
        },
        {
            sequence: 'GGRFSGATDPLMAEFNKSIYSGKEMCEEDVI.......GSMAYAKALCQKNVIS....EEELNSILKGLEQIQREWNSG.QFVLEPSDEDVHTANERRLTEIIG.................DVAGKLHTGRSRNDQVTTDLRLW',
            id: 6,
            label: 'ARLY_SCHPO/12-106'
        },
        {
            sequence: 'GRFTGATDPLMDLYNASLPYDKVMYDADLT.......GTKVYTQGLNKLGLIT....TEELHLIHQGLEQIRQEWHDN.KFIIKAGDEDIHTANERRLGEIIG................KNISGKVHTGRSRNDQVATDMRIFV',
            id: 7,
            label: 'Q59R31_CANAL/14-121'
        },
        {
            sequence: 'GRFTGKTDPLMEKFNESLPFDKRLWAEDIK.......GSQAYAKALAKAGILT....HVEAASIVDGLSKVAEEWQSG.VFVVKPGDEDIHTANERRLTELIG.................AVGGKLHTGRSRNDQVATDYRLWL',
            id: 8,
            label: 'A0A125YZR4_VOLCA/23-118'
        }
    ];
    // Define icons
    const icons = [
        {
            sequenceId: 1,
            start: 1,
            end: 1,
            icon: 'noSecondary'
        }, {
            sequenceId: 1,
            start: 2,
            end: 7,
            icon: 'strand'
        }, {sequenceId: 1, start: 8, end: 8, icon: 'arrowRight'}, {
            sequenceId: 1,
            start: 9,
            end: 12,
            icon: 'noSecondary'
        }, {sequenceId: 1, start: 13, end: 21, icon: 'helix'}, {
            sequenceId: 1,
            start: 22,
            end: 34,
            icon: 'noSecondary'
        }, {sequenceId: 1, start: 35, end: 52, icon: 'helix'}, {
            sequenceId: 1,
            start: 53,
            end: 57,
            icon: 'noSecondary'
        }, {sequenceId: 1, start: 58, end: 71, icon: 'helix'}, {
            sequenceId: 1,
            start: 72,
            end: 72,
            icon: 'noSecondary'
        }, {sequenceId: 1, start: 73, end: 75, icon: 'turn'}, {
            sequenceId: 1,
            start: 76,
            end: 91,
            icon: 'noSecondary'
        }, {sequenceId: 1, start: 92, end: 108, icon: 'helix'}, {
            sequenceId: 1,
            start: 109,
            end: 111,
            icon: 'turn'
        }, {sequenceId: 1, start: 112, end: 121, icon: 'noSecondary'}, {
            sequenceId: 1,
            start: 122,
            end: 126,
            icon: 'helix'
        }
    ];
    // Define options
    const options = {chunkSize: 10, sequenceColor: 'blosum62'};
    // Define consensus
    const consensus = {color: 'physical', dotThreshold: 70}
    // Draw a viewer
    viewer.draw({sequences, options, icons, consensus});
}

window.onload = initViewer;