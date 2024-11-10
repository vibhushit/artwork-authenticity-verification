const express = require("express"); //Import Express
const Joi = require("joi"); //Import Joi
const app = express(); //Create Express Application on the app variable
app.use(express.json()); //used the json file

const { ClientApplication } = require("../Client/client");
const { Events } = require("../Event/events");

// let eventClient = new Events();
// eventClient.contractEventListner(
//   "artist",
//   "Admin",
//   "artchannel",
//   "Artwork",
//   "PaintingContract",
//   "addPaintingEvent"
// );

//Give data to the server
const paintingData = [
  { id: 1, artist: "Pablo", title: "Mexico city", yearCreated: "2023" },
  { id: 2, artist: "Pablo2", title: "Mexico city2", yearCreated: "2023" },
  { id: 3, artist: "Pablo3", title: "Mexico city3", yearCreated: "2023" },
  { id: 4, artist: "Pablo4", title: "Mexico city4", yearCreated: "2023" },
  { id: 5, artist: "Pablo5", title: "Mexico city5", yearCreated: "2023" },
];

//Read Request Handlers
// Display the Message when the URL consist of '/'
app.get("/", (req, res) => {
  res.send("Welcome to Artwork Authenticity Verification!");
});


//http://localhost:8080/api/getAllPaintings
app.get("/api/getAllPaintings", (req, res) => {
  //res.send(paintingData);

  let painting = "";

  let ArtistClient = new ClientApplication();
  ArtistClient.generateAndSubmitTxn(
    "gallery",
    "Admin",
    "artchannel",
    "Artwork",
    "ArtGalleryContract",
    "queryTxn",
    "",
    "queryAllPaintings"
    
  ).then((message) => {
    painting = message;
    console.log(message.toString())
    if (!painting)
    res
      .status(404)
      .send(
        '<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>'
      );
  res.send(painting);
  });


});

//http://localhost:8080/api/getVerifiedPaintings
app.get("/api/getVerifiedPaintings", (req, res) => {
  //res.send(paintingData);

  let painting = "";

  let ArtistClient = new ClientApplication();
  ArtistClient.generateAndSubmitTxn(
    "gallery",
    "Admin",
    "artchannel",
    "Artwork",
    "ArtGalleryContract",
    "queryTxn",
    "",
    "queryVerifiedPaintings",
    true
  ).then((message) => {
    painting = message;
    console.log(message.toString())
    if (!painting)
    res
      .status(404)
      .send(
        '<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>'
      );
  res.send(painting);
  });


});


//http://localhost:8080/api/paintingData/4

app.get("/api/paintingData/:id", (req, res) => {
  const pid = req.params.id;
  let painting = "";

  let ArtistClient = new ClientApplication();
  ArtistClient.generateAndSubmitTxn(
    "artist",
    "Admin",
    "artchannel",
    "Artwork",
    "PaintingContract",
    "queryTxn",
    "",
    "readPainting",
    pid
  ).then((message) => {
    painting = message;
    console.log(message.toString())
    if (!painting)
    res
      .status(404)
      .send(
        '<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>'
      );
  res.send(painting);
  });
});

// { 
//   "id":"P03",
//   "artist": "Pablo",
//   "title" : " Mexican Nights ",
//   "yearCreated" : "2023"
// }
// http://localhost:8080/api/createPainting

app.post("/api/createPainting", (req, res) => {
    
    const id = req.body.id;
    const artist = req.body.artist;
    const title = req.body.title;
    const yearCreated = req.body.yearCreated;
  
    let ArtistClient = new ClientApplication();
    ArtistClient.generateAndSubmitTxn(
      "artist",
      "Admin",
      "artchannel",
      "Artwork",
      "PaintingContract",
      "invokeTxn",
      "",
      "createPainting",
      id, artist, title, yearCreated
    ).then(message => {
        console.log("Message is $$$$", message)
        res.status(200).send({ message: "Added Painting" })
      });
});

//http://localhost:8080/api/paintingData/4
//body-raw-text-specify the model to be updated with all other details
//{"artist":"eeeeeee","title":"City" ,"yearCreated": "2023"}

app.put("/api/paintingData/:id", (req, res) => {
  const painting = paintingData.find((p) => p.id === parseInt(req.params.id));
  if (!painting)
    res
      .status(404)
      .send(
        '<h2 style="font-family: Malgun Gothic; color: darkred;">Not Found!! </h2>'
      );

  const { error } = validatePainting(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  painting.artist = req.body.artist;
  res.send(painting);
});

//Delete Request Handler
// Delete Painting Details
//http://localhost:8080/api/paintingData/1
app.delete("/api/paintingData/:id", (req, res) => {
  const painting = paintingData.find((p) => p.id === parseInt(req.params.id));
  if (!painting)
    res
      .status(404)
      .send(
        '<h2 style="font-family: Malgun Gothic; color: darkred;">Not Found!!</h2>'
      );

  const index = paintingData.indexOf(painting);
  paintingData.splice(index, 1);

  res.send(painting);
});
//Validate Information
function validatePainting(painting) {
  const schema = Joi.object({
    artist: Joi.string().required(),
    title: Joi.string().required(),
    yearCreated: Joi.string().required(),
  });

  const validation = schema.validate(painting);
  return validation;
}

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));
