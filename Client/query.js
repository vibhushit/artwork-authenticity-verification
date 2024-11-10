const{ClientApplication}=require('./client')
let ArtistClient=new ClientApplication()
ArtistClient.generateAndSubmitTxn(
    "artist",
    "Admin",
    "artchannel",
    "Artwork",
    "PaintingContract",
    "queryTxn",
    "",
    "readPainting",
    "P01",
    
).then(message => {
    console.log(message.toString())
})
