const express = require('express');
const cors = require('cors');
const dataRoutes = require('./routes/dataRoutes');


const app = express();
const PORT = 3001;


app.use(cors());
app.use(express.json());

app.use('/api/sensorData', dataRoutes)

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});