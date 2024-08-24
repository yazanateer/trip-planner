const express = require('express');
const axios = require('axios');
const router = express.Router();

// POST /api/trips/generate
router.post('/generate', async (req, res) => {
  const { country, tripType } = req.body;

  try {
    // Generate trip data (mocked for now)
    const tripData = generateTripData(country, tripType);

    // Generate image using Stable Horde API
    const imageResponse = await axios.post(
      'https://stablehorde.net/api/v2/generate/async',
      {
        prompt: `${country} landscape`,
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
          'accept': 'application/json',
          'apikey': process.env.STABLE_HORDE_API_KEY,
          'Client-Agent': 'your-app-name:1.0.0',
          'Content-Type': 'application/json'
        }
      }
    );

    const imageUrl = await getImageUrl(imageResponse.data.id);

    // Return trip data without saving to a database
    const trip = {
      country,
      tripType,
      day1: tripData.day1,
      day2: tripData.day2,
      day3: tripData.day3,
      imageUrl,
      prompt: `${country} landscape`
    };

    res.status(201).json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating trip' });
  }
});

// Function to generate mock trip data (replace with LLM API call)
function generateTripData(country, tripType) {
  return {
    day1: { route: `Day 1 route in ${country}` },
    day2: { route: `Day 2 route in ${country}` },
    day3: { route: `Day 3 route in ${country}` },
  };
}

// Function to get image URL using the image generation ID
async function getImageUrl(id) {
  const response = await axios.get(
    `https://stablehorde.net/api/v2/generate/status/${id}`,
    {
      headers: {
        'accept': 'application/json',
        'Client-Agent': 'your-app-name:1.0.0'
      }
    }
  );

  return response.data.generations[0].img;
}

module.exports = router;
