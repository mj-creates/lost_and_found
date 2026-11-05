const router = require('express').Router();
const Item = require('../models/Item');
const { upload } = require('../config/cloudinary');
const auth = require('../middleware/auth'); // You will need this from Person 1

// GET: Fetch items with filters and search
router.get('/', async (req, res) => {
  try {
    const { type, category, search } = req.query;
    const filter = {};
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    const items = await Item.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET: Fetch a single item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('postedBy', 'name');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST: Add a new item with a photo
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const newItem = new Item({
      ...req.body,
      imageUrl: req.file ? req.file.path : '',
      postedBy: req.user
    });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error("Database Error:", err); // <--- Add this line
    res.status(500).json({ error: 'Failed to post item' });
  }
});

module.exports = router;