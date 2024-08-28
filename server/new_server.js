const express = require('express');
const axios = require('axios');
const cors = require('cors');
const Groq = require("groq-sdk");

const mongoose = require('mongoose');
const Trip = require('./models/Trip');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const STABLEHORDE_API_KEY = '6r4NMLyVTkkNqvz1EEQ2Iw';
const GROQ_API_KEY = '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';
const groq = new Groq({ apiKey: GROQ_API_KEY });

mongoose.connect('mongodb://localhost:27017/trips_Database', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.post('/generate-trip', async (req, res) => {
  const { country, tripType } = req.body;

  try {
    // First request to initiate the image generation
    const response = await axios.post(
      'https://stablehorde.net/api/v2/generate/async',
      {
        prompt: `Generate a 3-day trip itinerary in ${country} by ${tripType}.`,
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
            `https://stablehorde.net/api/v2/generate/status/${id}`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          // If done, return the image URL
          if (statusResponse.data.done) {
            const generations = statusResponse.data.generations;
            if (generations && generations.length > 0) {
              return generations[0].img;
            } else {
              throw new Error('Image generation failed or no image returned.');
            }
          } else {
            // If not done, wait for some time and then poll again
            await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5 seconds
          }
        } catch (error) {
          console.error('Error while polling:', error.message);
          await new Promise(resolve => setTimeout(resolve, 10000)); // wait 10 seconds before retrying
        }
      }
    };

    // Poll until the image is generated
    const imageUrl = await pollStatus(id);
    console.log('Image URL:', imageUrl);



        // Get the zones description
        const zonesResponse = await axios.post('http://localhost:5000/generate-zones', { country, tripType });
        const zonesText = zonesResponse.data.zones.join('\n');
    
        // Save trip data to MongoDB using the Trip model
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


app.post('/generate-zones', async (req, res) => {
  const { country, tripType } = req.body;

  try {
    // Define the distance limits based on the trip type
    let distanceRange;
    if (tripType === 'bicycle') {
      distanceRange = 'maximum of 80 km per day';
    } else if (tripType === 'car') {
      distanceRange = 'between 80 km and 300 km per day';
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Generate a 3-day trip itinerary in ${country} by ${tripType}. The trip should include three consecutive zones (city to city), each day within a distance of ${distanceRange}. For each zone, please provide:
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
