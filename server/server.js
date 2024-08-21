const express = require('express');
const app = express();
const tripRoutes = require('./routes/trip_routes');

app.use(express.json());

app.use('/api', trip_routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});