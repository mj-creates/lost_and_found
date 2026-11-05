const router = require('express').Router();
const Item = require('../models/Item');
const auth = require('../middleware/auth');

// TEST ROUTE
router.post('/test', (req, res) => {
    console.log('TEST ROUTE HIT');

    res.status(200).json({
        success: true,
        message: 'POST ROUTE IS WORKING'
    });
});

// GET ALL ITEMS
router.get('/', async (req, res) => {
    try {
        const items = await Item.find()
            .populate('postedBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: items.length,
            items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching items',
            error: error.message
        });
    }
});

// CREATE ITEM
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, category, type, location, image } = req.body;

        const item = new Item({
            title,
            description,
            category,
            type,
            location,
            image,
            postedBy: req.user._id || req.user
        });

        await item.save();

        res.status(201).json({
            success: true,
            message: 'Item created successfully',
            item
        });

    } catch (error) {
        console.error('Create item error:', error.message);

        res.status(500).json({
            success: false,
            message: 'Error creating item',
            error: error.message
        });
    }
});

console.log('ITEMS ROUTER LOADED');

module.exports = router;