const { EventListener } = require('./events')

let ArtistEvent = new EventListener();
ArtistEvent.blockEventListener("artist", "Admin", "artchannel");