const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const STABLEHORDE_API_KEY = '6r4NMLyVTkkNqvz1EEQ2Iw';

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
    console.log(id);

    // Polling to check the status and retrieve the image
    const statusResponse = await axios.get(
      `https://stablehorde.net/api/v2/generate/status/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const pollStatus = async (id) => {
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
        return pollStatus(id);
      }
    };
    
    // Poll until the image is generated
    const imageUrl = await pollStatus(id);
    console.log('Status Response:', statusResponse.data);
    
    const tripData = {
      country,
      tripType,
      routes: [
        { name: 'Route 1', distance: 100, pointsOfInterest: ['Point A', 'Point B'] },
        { name: 'Route 2', distance: 120, pointsOfInterest: ['Point C', 'Point D'] },
        { name: 'Route 3', distance: 90, pointsOfInterest: ['Point E', 'Point F'] },
      ],
      imageUrl, // Include the generated image URL
    };

    res.json(tripData);
  } catch (error) {
    console.error('Error generating trip data:', error.message);
    res.status(500).send('Error generating trip data');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
