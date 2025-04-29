const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
    try {

        return res.status(200).json({});
    } catch (err) {
        return res.status(500).json({ error: 'Could not read sensor data' });
    }
});
module.exports = router;