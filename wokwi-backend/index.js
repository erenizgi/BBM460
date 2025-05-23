const express = require('express');
const cors = require('cors');
const dataRoutes = require('./routes/dataRoutes');
const mqtt = require('mqtt');
const fs = require("fs");

global.datas = [];
global.queue = 0;

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/sensorData', dataRoutes)
global.latestMessage = "";

const mqttClient = mqtt.connect("mqtt://broker.hivemq.com:1883");
mqttClient.on('connect', () => {
    console.log("MQTT bağlandı!");
    mqttClient.subscribe("wokwi/erenBBM460");
});

mqttClient.on('message', (topic, message) => {
    console.log(`Geldi: ${message.toString()}`);
    global.latestMessage = message.toString();
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});