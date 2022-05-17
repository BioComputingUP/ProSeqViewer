import {ProSeqViewer} from "./index";

function initViewer(): void {
    // Initialize ProSeqViewer
    const psv = new ProSeqViewer('psv');
    // DEBUG
    console.log(psv);
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
    // Define options
    const options = {chunkSize: 10, sequenceColor: 'blosum62' };
    // Draw viewer
    psv.draw({ sequences, options });
}

// Wait for document to be loaded
initViewer();