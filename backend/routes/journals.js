const router = require('express').Router();
const Journal = require('../models/Journal');
const verifyToken = require('../middleware/authMiddleware');

// GET ALL JOURNALS FOR LOGGED-IN USER
router.get('/', verifyToken, async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(journals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE A NEW JOURNAL ENTRY
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, content, mood } = req.body;
    const newJournal = new Journal({
      user: req.user.id,
      title,
      content,
      mood
    });
    const savedJournal = await newJournal.save();
    res.status(201).json(savedJournal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE A JOURNAL ENTRY
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal) return res.status(404).json({ message: "Journal entry not found" });

    if (journal.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this entry" });
    }

    const updatedJournal = await Journal.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedJournal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE A JOURNAL ENTRY
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal) return res.status(404).json({ message: "Journal entry not found" });

    if (journal.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this entry" });
    }

    await Journal.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Journal entry deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;