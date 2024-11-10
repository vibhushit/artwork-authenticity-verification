const{ClientApplication}=require('./client')
let ArtistClient=new ClientApplication()
ArtistClient.generateAndSubmitTxn(
    "artist",
    "Admin",
    "artchannel",
    "Artwork",
    "PaintingContract",
    "invokeTxn",
    "",
    "createPainting",
    "P01",
    "Pablo",
    "Mexican Dreams",
    "2000"
).then(message => {
    console.log(message.toString())
})


