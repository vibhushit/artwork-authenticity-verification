const { EventListener } = require('./events')

let ArtistEvent = new EventListener();
ArtistEvent.txnEventListener("artist", "Admin", "artchannel",
    "Artwork", "PaintingContract", "createPainting",
    "P03", "Pablo", "Picaso", "2022");

