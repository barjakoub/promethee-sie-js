const db = require('../mysqlDB');
const { nanoid } = require('nanoid');

/* home-callback */
const getResults = (req, res) => {
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
}

/* candidate-callback */
const candidateRankIdParams = (req, res) => {
  const { rankId } = req.params;
  console.info(rankId);
  if (rankId === undefined) {
    db.getConnection((error, connection) => {
      if (error) throw error.message;

      connection.query(`SELECT * FROM promethee_rank`, (error, results, fields) => {
        connection.release();

        if (error) throw error.message;
        console.info(results[0].rankId);
        // console.info(fields);
        const rankGroupData = {
          ranks: results
        };

        return res.render('pages/createRank', rankGroupData);
      });
    });
    // return res.render('pages/createRank');
  } else {
    /* database */
    db.getConnection((error, connection) => {
      if (error) throw error.message;

      connection.query(`SELECT * FROM candidates WHERE rankId='${rankId}'`, (error, results, fields) => {
        connection.release();

        if (error) throw error.message;
        console.info(results);
        console.info(results.length);
        // console.info(fields);
        const rankGroupData = {
          rankId,
          countOfCandidates: results.length
        };

        return res.render('pages/candidates', rankGroupData);
      });
    });
    // return res.render('pages/candidates');
  }
};

const candidateStoreRankId = (req, res) => {
  const body = req.body;
  const { unfinishedRank } = req.body;
  const { rankId } = req.params;
  console.info(unfinishedRank);

  if (rankId !== undefined) {
    db.getConnection((error, connection) => {
      if (error) throw error.message;

      const candId = nanoid(9);

      connection.query(`INSERT INTO candidates 
                (candId, candName, candRole, candK1, candK2, candK3, candK4, candK5, candK6, candK7, rankId) 
                VALUES ('${candId}', '${body.fullName}', '${body.role}', '${body.kejujuran}', '${body.loyalitas}', '${body.kedisiplinan}', '${body.tanggungJawab}', '${body.kepribadian}', '${body.penampilan}', '${body.kehadiran}', '${body.rankId}')`, (error, results, fields) => {
        connection.release();

        if (error) throw error.message;
        console.info(results);
        console.info(fields);

        res.redirect('back');
      });
    });
  } else if (unfinishedRank !== undefined) {
    db.getConnection((error, connection) => {
      if (error) throw error.message;

      connection.query(`SELECT * FROM promethee_results WHERE rankId='${unfinishedRank}'`, (error, results, fields) => {
        if (error) throw error.message;

        console.info('results');
        console.info(results.length);

        if (results.length === 0) {
          res.redirect(`/promethee/candidates/${unfinishedRank}`);
        } else {
          res.redirect(`/promethee/${results[0].resultId}/results`);
        }
      })
    })
  } else {
    db.getConnection((error, connection) => {
      if (error) throw error.message;

      const rankId = nanoid(12);

      connection.query(`INSERT INTO promethee_rank (rankId, rankName) VALUES('${rankId}', '${body.rankName}')`, (error, results, fields) => {
        connection.release();

        if (error) throw error.message;
        console.info(results);
        console.info(fields);

        res.redirect(`/promethee/candidates/${rankId}`);
      });
    });
  }
}

const candidateByRankId = (req, res) => {
  const { rankId } = req.params;
  db.getConnection((error, connection) => {
    if (error) throw error.message;

    connection.query(`SELECT * FROM candidates WHERE rankId='${rankId}'`, (error, results, fields) => {
      connection.release();

      if (error) throw error.message;
      // console.info(results);
      // console.info(fields);
      const previewsData = {
        rankId,
        candidates: results
      };

      res.render('pages/previews', previewsData);
    });
  });
  // res.render('pages/previews');
}

const candidateStoreByRankId = (req, res) => {
  const resultId = nanoid(16);
  db.getConnection((error, connection) => {
    if (error) throw error.message;

    connection.query(`INSERT INTO promethee_results (resultId, rankId) VALUES('${resultId}', '${req.params.rankId}')`, (error, results, fields) => {
      connection.release();

      if (error) throw error.message;
      console.info(results);

      res.redirect(`/promethee/${resultId}/results`)
    });
  });
}

const candidateCalculationResult = (req, res) => {
  const { resultId } = req.params;
  /* database */
  db.getConnection((error, connection) => {
    if (error) throw error.message;

    connection.query(`SELECT rankId FROM promethee_results WHERE resultId='${resultId}'`, (error, results, fields) => {
      if (error) throw error.message;
      const { rankId } = results[0];
      console.info(rankId);

      connection.query(`SELECT * FROM candidates WHERE rankId='${rankId}'`, (error, results, fields) => {
        connection.release();
        if (error) throw error.message;
        /* STARTING PROMETHEE LOGICAL */
        /* VARIABLE PREPARATION */
        let _CANDIDATES_NAME = [];
        let _FINAL_PREFERENSIS = []; /* array of _FINAL_PREFERENSI-ARRAY */
        let _LEAVING_FLOWS = []; /* array of _LEAVING_FLOW */
        let _ENTERING_FLOWS = [];
        let preferensiK1 = [];
        let preferensiK2 = [];
        let preferensiK3 = [];
        let preferensiK4 = [];
        let preferensiK5 = [];
        let preferensiK6 = [];
        let preferensiK7 = [];
        /* NILAI PREFERENSI */
        for (let candidate of results) {
          /* Collect nama kandidat */
          _CANDIDATES_NAME.push(candidate.candName);
          /* konstanta preferensi */
          const _konsPREFERENSI = 1 / 7;
          /* Nilai K1 setiap kandidat */
          const cK1 = candidate.candK1;
          const cK2 = candidate.candK2;
          const cK3 = candidate.candK3;
          const cK4 = candidate.candK4;
          const cK5 = candidate.candK5;
          const cK6 = candidate.candK6;
          const cK7 = candidate.candK7;
          /* nama tiap kandidat */
          const eachName = candidate.candName;
          console.info(`nama: ${eachName}`)
          /* Kumpulan Nilai Preferensi K1 Seluruh Kandidat */
          let _preferensiK1 = [];
          /* Nilai preferensi K1 masing-masing kandidat terhadap kandidat lain */
          for (let { candName, candRole, candK1 } of results) {
            if (eachName === candName) {
              continue;
            }
            // console.info(candK1);
            if (cK1 - candK1 <= 0) {
              _preferensiK1.push(0);
            } else {
              _preferensiK1.push(1);
            }

          }
          preferensiK1.push(_preferensiK1);
          // console.info('THIS IS K1');
          // console.info(preferensiK1);
          /* Kumpulan Nilai Preferensi K2 Seluruh Kandidat */
          let _preferensiK2 = [];
          /* Nilai preferensi K1 masing-masing kandidat terhadap kandidat lain */
          for (let { candName, candRole, candK2 } of results) {
            if (eachName === candName) {
              continue;
            }
            // console.info(candK2);
            if (cK2 - candK2 <= 0) {
              _preferensiK2.push(0);
            } else {
              _preferensiK2.push(1);
            }

          }
          preferensiK2.push(_preferensiK2);
          // console.info('THIS IS K2');
          // console.info(preferensiK2);

          /* Kumpulan Nilai Preferensi K3 Seluruh Kandidat */
          let _preferensiK3 = [];
          /* Nilai preferensi K1 masing-masing kandidat terhadap kandidat lain */
          for (let { candName, candRole, candK3 } of results) {
            if (eachName === candName) {
              continue;
            }
            // console.info(candK3);
            if (cK3 - candK3 <= 0) {
              _preferensiK3.push(0);
            } else {
              _preferensiK3.push(1);
            }

          }
          preferensiK3.push(_preferensiK3);
          // console.info('THIS IS K3');
          // console.info(_preferensiK3);
          /* Kumpulan Nilai Preferensi K4 Seluruh Kandidat */
          let _preferensiK4 = [];
          /* Nilai preferensi K1 masing-masing kandidat terhadap kandidat lain */
          for (let { candName, candRole, candK4 } of results) {
            if (eachName === candName) {
              continue;
            }
            // console.info(candK4);
            if (cK4 - candK4 <= 0) {
              _preferensiK4.push(0);
            } else {
              _preferensiK4.push(1);
            }

          }
          preferensiK4.push(_preferensiK4);
          // console.info('THIS IS K4');
          // console.info(_preferensiK4);
          /* Kumpulan Nilai Preferensi K5 Seluruh Kandidat */
          let _preferensiK5 = [];
          /* Nilai preferensi K1 masing-masing kandidat terhadap kandidat lain */
          for (let { candName, candRole, candK5 } of results) {
            if (eachName === candName) {
              continue;
            }
            // console.info(candK5);
            if (cK5 - candK5 <= 0) {
              _preferensiK5.push(0);
            } else {
              _preferensiK5.push(1);
            }

          }
          preferensiK5.push(_preferensiK5);
          // console.info('THIS IS K5');
          // console.info(_preferensiK5);
          /* Kumpulan Nilai Preferensi K6 Seluruh Kandidat */
          let _preferensiK6 = [];
          /* Nilai preferensi K1 masing-masing kandidat terhadap kandidat lain */
          for (let { candName, candRole, candK6 } of results) {
            if (eachName === candName) {
              continue;
            }
            // console.info(candK6);
            if (cK6 - candK6 <= 0) {
              _preferensiK6.push(0);
            } else {
              _preferensiK6.push(1);
            }

          }
          preferensiK6.push(_preferensiK6);
          // console.info('THIS IS K6');
          // console.info(_preferensiK6);
          /* Kumpulan Nilai Preferensi K7 Seluruh Kandidat */
          let _preferensiK7 = [];
          /* Nilai preferensi K1 masing-masing kandidat terhadap kandidat lain */
          for (let { candName, candRole, candK7 } of results) {
            if (eachName === candName) {
              continue;
            }
            // console.info(candK7);
            if (cK7 - candK7 <= 0) {
              _preferensiK7.push(0);
            } else {
              _preferensiK7.push(1);
            }

          }
          preferensiK7.push(_preferensiK7);
          // console.info('THIS IS K7');
          // console.info(_preferensiK7);

          /* NILAI PREFERENSI AKHIR PADA TIAP KANDIDAT */
          let _FINAL_PREFERENSI = [];
          for (let index = 0; index < _preferensiK1.length; index++) {
            let totalNilaiKriteria = _konsPREFERENSI * (_preferensiK1[index] + _preferensiK2[index] + _preferensiK3[index] + _preferensiK4[index] + _preferensiK5[index] + _preferensiK6[index] + _preferensiK7[index]);

            _FINAL_PREFERENSI.push(totalNilaiKriteria);
          }
          /* ADD ARRAY TO PARENT ARRAY */
          _FINAL_PREFERENSIS.push(_FINAL_PREFERENSI);
          // console.info(_FINAL_PREFERENSI);

          /* NILAI LEAVINGFLOW PADA TIAP KANDIDAT */
          let _LEAVING_FLOW = 0;
          for (let FINAL of _FINAL_PREFERENSI) {
            _LEAVING_FLOW += FINAL;
          }
          /* ADD VALUE TO PARENT ARRAY */
          _LEAVING_FLOWS.push((1 / 4) * _LEAVING_FLOW);
          // console.info((1 / 6) * _LEAVING_FLOW);

        }
        console.info('FINAL PREFERENSIS')
        console.info(_FINAL_PREFERENSIS);
        console.info('LEAVING FLOW')
        // console.info(_LEAVING_FLOWS);

        for (let [index, _FINAL] of _FINAL_PREFERENSIS.entries()) {
          if (index == 0) {
            let K1 = (1 / 4) * (_FINAL_PREFERENSIS[index + 1][index] + _FINAL_PREFERENSIS[index + 2][index] + _FINAL_PREFERENSIS[index + 3][index] + _FINAL_PREFERENSIS[index + 4][index]);
            _ENTERING_FLOWS.push(K1);
          } else if (index == 1) {
            let K2 = (1 / 4) * (_FINAL_PREFERENSIS[index - 1][index - 1] + _FINAL_PREFERENSIS[index - 1][index] + _FINAL_PREFERENSIS[index + 2][index] + _FINAL_PREFERENSIS[index + 3][index]);
            _ENTERING_FLOWS.push(K2);
          } else if (index == 2) {
            let K3 = (1 / 4) * (_FINAL_PREFERENSIS[index - 2][index - 1] + _FINAL_PREFERENSIS[index - 1][index - 1] + _FINAL_PREFERENSIS[index + 1][index] + _FINAL_PREFERENSIS[index + 2][index]);
            _ENTERING_FLOWS.push(K3);
          } else if (index == 3) {
            let K4 = (1 / 4) * (_FINAL_PREFERENSIS[0][index - 1] + _FINAL_PREFERENSIS[1][index - 1] + _FINAL_PREFERENSIS[2][index - 1] + _FINAL_PREFERENSIS[4][index]);
            _ENTERING_FLOWS.push(K4);
          } else if (index == 4) {
            let K5 = (1 / 4) * (_FINAL_PREFERENSIS[0][index - 1] + _FINAL_PREFERENSIS[1][index - 1] + _FINAL_PREFERENSIS[2][index - 1] + _FINAL_PREFERENSIS[3][index - 1]);
            _ENTERING_FLOWS.push(K5);
          }
        }
        console.info('ENTERING FLOW')
        // console.info(_ENTERING_FLOWS);

        /* MENGHITUNG NETFLOW */
        let _NET_FLOWS = [];
        for (let index = 0; index < _LEAVING_FLOWS.length; index++) {
          let _NET_FLOW = _ENTERING_FLOWS[index] - _LEAVING_FLOWS[index];
          _NET_FLOWS.push(_NET_FLOW);
        }
        console.info('NET FLOWS')
        // console.info(_NET_FLOWS);
        // console.info(results);
        for (let idx = 0; idx < results.length; idx++) {
          results[idx] = {
            ...results[idx],
            leavingFlow: _LEAVING_FLOWS[idx],
            enteringFlow: _ENTERING_FLOWS[idx],
            netFlow: _NET_FLOWS[idx]
          }
        }

        results.sort((a, b) => b.netFlow - a.netFlow);
        console.log('LOOK AT THIS WAY');
        // console.info(results);

        const hasilPromethee = {
          datas: results,
          _CANDIDATES_NAME,
          _FINAL_PREFERENSIS,
          _LEAVING_FLOWS,
          _ENTERING_FLOWS,
          _NET_FLOWS,
          preferensiK1,
          preferensiK2,
          preferensiK3,
          preferensiK4,
          preferensiK5,
          preferensiK6,
          preferensiK7
        };

        res.render('pages/results', hasilPromethee);
      });
    });
  });

  // res.render('pages/results');
}
module.exports = { getResults, candidateRankIdParams, candidateStoreRankId, candidateByRankId, candidateStoreByRankId, candidateCalculationResult }