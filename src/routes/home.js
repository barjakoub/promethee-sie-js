const router = require('./_ROUTER');
const { getResults } = require('../handlers/entireCallback');

router.route('/promethee')
    .get(getResults);

module.exports = router;