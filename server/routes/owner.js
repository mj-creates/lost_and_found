const router = require("express").Router();
const Item = require("../models/Item");
const auth = require("../middleware/auth");

// GET: Fetch my posted items
router.get("/mine", auth, async (req, res) => {
  try {
    const items = await Item.find({
      postedBy: req.user
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch your posted items"
    });
  }
});

// UPDATE ITEM - Only the owner can update
router.put("/:id", auth, async (req, res) => {
    console.log("PUT ROUTE HIT");
    try {
        const item = await Item.findOne({
            _id: req.params.id,
            postedBy: req.user._id || req.user
        });

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found or you are not the owner"
            });
        }

        const { title, description, category, type, location, image } = req.body;

        Object.assign(item, {
            title,
            description,
            category,
            type,
            location,
            image
        });

        await item.save();

        res.status(200).json({
            success: true,
            message: "Item updated successfully",
            item
        });

    } catch (error) {
        console.error("Update item error:", error.message);

        res.status(500).json({
            success: false,
            message: "Error updating item",
            error: error.message
        });
    }
});
// DELETE ITEM - Only the owner can delete
router.delete("/:id", auth, async (req, res) => {
    try {
        const item = await Item.findOneAndDelete({
            _id: req.params.id,
            postedBy: req.user._id || req.user
        });

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found or you are not the owner"
            });
        }

        res.status(200).json({
            success: true,
            message: "Item deleted successfully",
            item
        });

    } catch (error) {
        console.error("Delete item error:", error.message);

        res.status(500).json({
            success: false,
            message: "Error deleting item",
            error: error.message
        });
    }
});
// MARK ITEM AS RETURNED
router.patch("/:id/return", auth, async (req, res) => {
    try {
        const item = await Item.findOne({
            _id: req.params.id,
            postedBy: req.user
        });

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found or you are not the owner"
            });
        }

        item.status = "Returned";
        await item.save();

        res.status(200).json({
            success: true,
            message: "Item marked as returned",
            item
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating item status",
            error: error.message
        });
    }
});
module.exports = router;