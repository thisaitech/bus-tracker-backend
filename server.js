const express = require('express');
const cors = require('cors'); // Import CORS to allow cross-origin requests
const app = express();
app.use(express.json());
app.use(cors()); // Use CORS

// In a real app, use a database (MongoDB, PostgreSQL). For this test, a variable is fine.
let latestBusData = {
    busId: "PB01", // Private Bus 01
    location: null,
    lastUpdate: null
};

// Endpoint for the DRIVER'S PHONE to send its location
app.post('/api/update-location', (req, res) => {
    const { busId, lat, lon } = req.body;

    if (busId !== latestBusData.busId) {
        return res.status(404).send('Bus not found.');
    }

    latestBusData.location = { lat, lon };
    latestBusData.lastUpdate = new Date();

    console.log(`Updated location for ${busId}:`, latestBusData.location);
    res.status(200).send({ message: "Location updated successfully" });
});

// Endpoint for the PASSENGER'S APP to get the bus location
app.get('/api/get-location/:busId', (req, res) => {
    if (req.params.busId === latestBusData.busId && latestBusData.location) {
        res.json(latestBusData);
    } else {
        res.status(404).send({ message: "No location data available for this bus yet." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Bus server running on port ${PORT}`);
});