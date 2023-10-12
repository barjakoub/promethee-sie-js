const router = require('./_ROUTER');
const db = require('./../mysqlDB');

router.route('/promethee')
    .get((req, res) => {
        db.getConnection((error, connection) => {
            if (error) throw error.message;

            connection.query(`SELECT * FROM promethee_results ORDER BY resultId DESC`, (error, results, fields) => {
                if (error) throw error.message;

                connection.query(`SELECT * FROM candidates ORDER BY candId DESC LIMIT 5`, (err, candidates, detail) => {
                    if (err) throw err.message;

                    console.info(results);
                    console.info(candidates);
                    const homeInformation = {
                        results,
                        candidates,
                    };

                    res.render('index', homeInformation);
                });
            });
        });
        // res.render('index');
    });

module.exports = router;