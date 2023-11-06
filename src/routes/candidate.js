const candidatesRouter = require('./_ROUTER');
// const db = require('../mysqlDB');
// const { nanoid } = require('nanoid');
const { candidateRankIdParams, candidateStoreRankId, candidateByRankId, candidateStoreByRankId, candidateCalculationResult } = require('../handlers/entireCallback');

candidatesRouter.route('/promethee/candidates/:rankId?')
    .get(candidateRankIdParams)
    .post(candidateStoreRankId);

candidatesRouter.route('/promethee/candidates/:rankId/calculation')
    .get(candidateByRankId)
    .post(candidateStoreByRankId);

candidatesRouter.route('/promethee/:resultId/results')
    .get(candidateCalculationResult);

module.exports = candidatesRouter;