const express = require('express');
const axios = require('axios');
const cors = require('cors');
const Groq = require("groq-sdk"); // the ai that generate an trip in three zones in the specific country with car/bike

const mongoose = require('mongoose');
const Trip = require('./models/Trip');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const STABLEHORDE_API_KEY = '6r4NMLyVTkkNqvz1EEQ2Iw'; //the api key for the stablehorde ai that we asked to use to generaete image 
const GROQ_API_KEY = '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';
const groq = new Groq({ apiKey: GROQ_API_KEY }); //initailzie the groq ( ai )

mongoose.connect('mongodb://localhost:27017/trips_Database', { useNewUrlParser: true, useUnifiedTopology: true }) //connect the server with the database we have craeted in mogno db 
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.post('/generate-trip', async (req, res) => { //the endpoint that genereate a trip image using the stablehorde ai 
  const { country, tripType } = req.body;
  try {
    const response = await axios.post(
      'https://stablehorde.net/api/v2/generate/async', //this will return to us an id that we in the next steps will use to get image url  
      {
        prompt: `Generate an image for ${country} in trip by ${tripType}.`,
        params: {
          cfg_scale: 7.5,
          denoising_strength: 0.75,
          seed: "312912",
          height: 512,
          width: 512,
          seed_variation: 1,
          steps: 10
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          apikey: `${STABLEHORDE_API_KEY}`,
        },
      }
    );

    const { id } = response.data;

    const pollStatus = async (id) => {
      while (true) {
        try {
          const statusResponse = await axios.get(
            `https://stablehorde.net/api/v2/generate/status/${id}`, //this api will enter the id that we got , and then will return to as the image url and display the img in the frontend
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          //here we will make a loop to wait and send the requrest to get the image until it get it 
          if (statusResponse.data.done) {
            const generations = statusResponse.data.generations;
            if (generations && generations.length > 0) {
              return generations[0].img;
            } else {
              throw new Error('Image generation failed or no image returned.');
            }
          } else {
            await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5 seconds then try again with the request
          }
        } catch (error) {
          console.error('Error while polling:', error.message);
          await new Promise(resolve => setTimeout(resolve, 10000));  // wait 10 seconds then try again with the request
        }
      }
    };

    
    const imageUrl = await pollStatus(id);
    console.log('Image URL:', imageUrl);



      //now we will generate the trip zones and description of it 
        const zonesResponse = await axios.post('http://localhost:5000/generate-zones', { country, tripType });
        const zonesText = zonesResponse.data.zones.join('\n');
    
        // save trip  in the mongodb 
        const trip = new Trip({
            country: country,
            tripType: tripType,
            imageUrl: imageUrl,
            zonesText: zonesText
        });

        await trip.save();
        console.log(`the trip data saved in mongoDB`);

    res.json({ imageUrl });
  } catch (error) {
    console.error('Error generating trip data:', error.message);
    res.status(500).send('Error generating trip data');
  }
});


app.post('/generate-zones', async (req, res) => { //here we will make the endpiont that send the request to the groq ai to genereate the trip details
  const { country, tripType } = req.body;

  try {
    let distanceRange;
    if (tripType === 'bicycle') { //craeting the message request to send to the ai 
      distanceRange = 'maximum of 80 km per day';
    } else if (tripType === 'car') {
      distanceRange = 'between 80 km and 300 km per day';
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Generate a 3-day trip itinerary in ${country} by ${tripType}. The trip should include three consecutive zones (city to city) such as from A to B then from B to C then from C to D , each day within a distance of ${distanceRange}. For each zone, please provide:
          1. Name of the zone (city or area).
          2. Distance of the route in kilometers.
          3. Points of interest along the way.
          4. Latitude and longitude coordinates for each zone.`,
        },
      ],
      model: "llama3-8b-8192",
    });

    const zones = chatCompletion.choices[0]?.message?.content.split('\n').filter(line => line);
    console.log(zones);
    res.json({ zones });
  } catch (error) {
    console.error('Error generating zones:', error.message);
    res.status(500).send('Error generating zones');
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
