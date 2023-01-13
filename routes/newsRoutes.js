const Router = require('koa-router');
const newsController = require('../controllers/newsController');

const router = Router();

router.get('/news', newsController.all_news);
router.post('/news', newsController.create_news);

module.exports = router;