const router = require('express').Router();
const Item = require('../models/Item');
const auth = require('../middleware/auth');

// Owner verification helper per Team Roles Guide
const getOwnedItem = async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    res.status(404).json({ success: false, message: 'Item not found' });
    return null;
  }
  const itemOwnerId = item.postedBy?._id ? item.postedBy._id.toString() : item.postedBy.toString();
  const currentUserId = req.user?._id ? req.user._id.toString() : req.user.toString();

  if (itemOwnerId !== currentUserId) {
    res.status(403).json({ success: false, message: 'Not your post - only the owner can modify this item' });
    return null;
  }
  return item;
};

// GET /api/items/mine - Fetch items posted by the logged-in user
router.get('/mine', auth, async (req, res) => {
  try {
    const userId = req.user?._id || req.user;
    const items = await Item.find({ postedBy: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    console.error('Fetch my items error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to fetch your posted items',
      error: error.message,
    });
  }
});

// PUT /api/items/:id - Update item (owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await getOwnedItem(req, res);
    if (!item) return;

    const { title, description, category, type, location, contact, date, imageUrl, image } = req.body;

    if (title) item.title = title.trim();
    if (description) item.description = description.trim();
    if (category) item.category = category;
    if (type) item.type = type.toLowerCase();
    if (location !== undefined) item.location = location;
    if (contact !== undefined) item.contact = contact;
    if (date) item.date = new Date(date);
    if (imageUrl !== undefined) item.imageUrl = imageUrl;
    else if (image !== undefined) item.imageUrl = image;

    await item.save();

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      item,
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating item',
      error: error.message,
    });
  }
});

// DELETE /api/items/:id - Delete item (owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await getOwnedItem(req, res);
    if (!item) return;

    await Item.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
      item,
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting item',
      error: error.message,
    });
  }
});

// PATCH /api/items/:id/returned (and alias /return) - Mark item as returned (owner only)
const handleMarkReturned = async (req, res) => {
  try {
    const item = await getOwnedItem(req, res);
    if (!item) return;

    item.status = 'returned';
    await item.save();

    res.status(200).json({
      success: true,
      message: 'Item marked as returned successfully',
      item,
    });
  } catch (error) {
    console.error('Mark returned error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating item status',
      error: error.message,
    });
  }
};

router.patch('/:id/returned', auth, handleMarkReturned);
router.patch('/:id/return', auth, handleMarkReturned);

module.exports = router;
