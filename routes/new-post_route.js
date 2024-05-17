const express = require('express');
const router = express.Router();
const { TrackingNewPostControllerGet } = require('../controllers/new-post_controller');

router.get('/city', async (req, res) => {
     try {
        const controller = new TrackingNewPostControllerGet(req, res);
        const result = await controller.do(req.query);

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    };
});

router.get('/departament', async (req, res) => {
    try {
        const controller = new TrackingNewPostControllerGet(req, res);
        const result = await controller.de(req.query);

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    };
})

module.exports = router;