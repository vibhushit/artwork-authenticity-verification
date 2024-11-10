const { EventListener } = require('./events')

let ArtistEvent = new EventListener();
ArtistEvent.contractEventListener("artist", "Admin", "artchannel",
    "Artwork", "PaintingContract", "addPaintingEvent");
