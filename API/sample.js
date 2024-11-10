const express = require('express'); //Import Express
const Joi = require('joi'); //Import Joi
const app = express(); //Create Express Application on the app variable
app.use(express.json()); //used the json file


//Give data to the server
const paintingData = [
    { id: 1, artist: 'Pablo', title: 'Mexico city', yearCreated: '2023' },
    { id: 2, artist: 'Pablo2', title: 'Mexico city2', yearCreated: '2023' },
    { id: 3, artist: 'Pablo3', title: 'Mexico city3', yearCreated: '2023' },
    { id: 4, artist: 'Pablo4', title: 'Mexico city4', yearCreated: '2023' },
    { id: 5, artist: 'Pablo5', title: 'Mexico city5', yearCreated: '2023' }
]

//Read Request Handlers
// Display the Message when the URL consist of '/'
app.get('/', (req, res) => {
    res.send('Welcome to Artwork Consortium!');
});
// Display the List Of Cars when URL consists of api 
//http://localhost:8080/api/paintingData
app.get('/api/paintingData', (req, res) => {
    res.send(paintingData);
});
// Display the Information Of Specific Car when you mention the id.
//http://localhost:8080/api/paintingData/4
app.get('/api/paintingData/:id', (req, res) => {
    const painting = paintingData.find(c => c.id === parseInt(req.params.id));
    //If there is no valid car ID, then display an error with the following message
    if (!painting) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>');
    res.send(painting);
});

//CREATE Request Handler
//CREATE New painting Information
//http://localhost:8080/api/paintingData
//body-raw-text-json
//{
//     "artist": "Pablo",
//     "title": "City",
//     "yearCreated": "2023"
// }
app.post('/api/paintingData', (req, res) => {

    const { error } = validatePainting(req.body);
    if (error) {
        res.status(400).send(error.details[0].message)
        return;
    }
    //Increment the painting id
    const painting = {
        id: paintingData.length + 1,
        artist: req.body.artist,
        title: req.body.title,
        yearCreated: req.body.yearCreated
    };
    paintingData.push(painting);
    res.send(painting);
});

//Update Request Handler
// Update Existing painting Information
//http://localhost:8080/api/paintingData/4
//body-raw-text-specify the model to be updated with all other details
//{"artist":"eeeeeee","title":"City" ,"yearCreated": "2023"}

app.put('/api/paintingData/:id', (req, res) => {
    const painting = paintingData.find(p => p.id === parseInt(req.params.id));
    if (!painting) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Not Found!! </h2>');

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
app.delete('/api/paintingData/:id', (req, res) => {

    const painting = paintingData.find(p => p.id === parseInt(req.params.id));
    if (!painting) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Not Found!!</h2>');

    const index = paintingData.indexOf(painting);
    paintingData.splice(index, 1);

    res.send(painting);
});
//Validate Information
function validateCar(painting) {
    const schema = Joi.object({
        artist: Joi.string().required(),
        title: Joi.string().required(),
        yearCreated: Joi.string().required()
    });

    const validation = schema.validate(painting);
    return validation
}


//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));

