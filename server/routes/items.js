
const router = require('express').Router();
const Item = require('../models/Item');

// Get all lost and found items
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching items',
            error: error.message
        });
    }
});

module.exports = router;