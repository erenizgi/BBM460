const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
    try {
        const data = (global.latestMessage).split(" ");
        const latestData = {
            "temperature": data[0],
            "humidity": data[1],
            "light": data[2],
        }
        console.log(latestData);
        res.status(200).json({"data": latestData});
        if (global.queue === data.length){
            global.queue = 0;
        }
        return;
    } catch (err) {
        return res.status(500).json({ error: 'Could not read sensor data' });
    }
});
module.exports = router;