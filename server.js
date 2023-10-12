// const express = require('express');
// const { homepageHandler } = require('./src/handler');
// const mysql = require('./mysqlCode');

// const app = express();
// const _PORT = 3005;

// /* application-settings */
// app.set('views', './views').set('view engine', 'pug');
// /* homepage */
// app.get('/', homepageHandler);
// /* candidates */
// app.route('/candidates/:cId?')
//     .get((req, res) => {
//         res.status(200).json({
//             status: 'OK',
//             page: 'display data of candidates'
//         });
//     })
//     .post((req, res) => {
//         res.status(201).json({
//             status: 'created',
//             page: 'creates or stores candidates information detail'
//         });
//     })
//     .put((req, res) => {
//         res.status(200).json({
//             status: 'did\'t update yet',
//             page: 'update available candidates information',
//             candidateId: req.params.cId,
//         });
//     });
// /* promethee process */
// app.route('/promethee')
//     .get((req, res) => {

//     })
//     .post((req, res) => {

//     });

// console.info(mysql);

// app.listen(_PORT, () => console.info(`click to run http://localhost:${_PORT}`));