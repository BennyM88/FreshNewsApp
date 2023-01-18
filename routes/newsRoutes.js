const Router = require('koa-router');
const newsController = require('../controllers/newsController');
const { ensureAuthenticated, checkUser } = require('../middleware/authMiddleware');

const router = Router();

router.get('/news', ensureAuthenticated, checkUser, newsController.all_news);
router.post('/news', newsController.create_news);

module.exports = router;