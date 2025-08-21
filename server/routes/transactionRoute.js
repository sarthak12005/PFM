const express = require('express');
const router = express.Router();

// Placeholder routes - will be implemented in transaction management task
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Get transactions endpoint not implemented yet' });
});

router.post('/', (req, res) => {
  res.status(501).json({ message: 'Create transaction endpoint not implemented yet' });
});

router.put('/:id', (req, res) => {
  res.status(501).json({ message: 'Update transaction endpoint not implemented yet' });
});

router.delete('/:id', (req, res) => {
  res.status(501).json({ message: 'Delete transaction endpoint not implemented yet' });
});

module.exports = router;
