const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
    try {
        fs.readFile('./dummyInput.txt', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
        });
        const data = global.datas;
        res.status(200).json({"data": (global.datas)[global.queue++]});
        if (global.queue === data.length){
            global.queue = 0;
        }
        return;
    } catch (err) {
        return res.status(500).json({ error: 'Could not read sensor data' });
    }
});
module.exports = router;