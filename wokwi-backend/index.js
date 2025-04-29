const express = require('express');
const cors = require('cors');
const dataRoutes = require('./routes/dataRoutes');
const fs = require("fs");
const {all} = require("express/lib/application");

global.datas = [];
global.queue = 0;

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/sensorData', dataRoutes)

app.listen(PORT, () => {
    fs.readFile('./dummyInput.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        const dataArray = data.split("\n");//
        let sanitized = dataArray.map((item) => item.replace("\r", ''));
        sanitized = sanitized.filter((item) => item);
        const allData = []
        for (let i = 0; i < sanitized.length; i += 3) {
            const temperature = sanitized[i].split(" ")[1];
            const humidity = ((sanitized[i+1].split(" "))[1]).split("%")[0];
            const light = sanitized[i+2].split(" ")[3];
            const dataObj = {
                "temperature" : temperature,
                "humidity": humidity,//
                "light": light,
            };
            allData.push(dataObj);
            global.datas = allData
        }


    });
    console.log(`Server running at http://localhost:${PORT}`);
});