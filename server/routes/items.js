const router = require('express').Router();
const Item = require('../models/Item');
const { upload } = require('../config/cloudinary');
const auth = require('../middleware/auth');

// GET /api/items: Fetch items with optional filter (type, category, search)
router.get('/', async (req, res) => {
  try {
    const { type, category, search } = req.query;
    const filter = {};

    if (type) filter.type = type.toLowerCase();
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await Item.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({
      message: 'Error fetching items',
      error: error.message,
    });
  }
});

// GET /api/items/:id: Fetch single item by ID with poster information
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('postedBy', 'name email phone');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching item by id:', error);
    res.status(500).json({
      message: 'Error fetching item details',
      error: error.message,
    });
  }
});

// POST /api/items: Create a new lost/found item with optional photo upload
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, type, location, contact, date } = req.body || {};

    if (!title || !description || !category || !type) {
      return res.status(400).json({
        message: 'Missing required fields: title, description, category, and type are required.',
      });
    }

    const newItem = new Item({
      title: title.trim(),
      description: description.trim(),
      category,
      type: type.toLowerCase(),
      location: location || '',
      contact: contact || '',
      date: date ? new Date(date) : Date.now(),
      imageUrl: req.file ? req.file.path : '',
      postedBy: req.user,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Database Error in POST /api/items:', error);
    res.status(500).json({
      message: error.message || 'Failed to post item',
      error: error.toString(),
    });
  }
});

module.exports = router;