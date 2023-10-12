const express = require('express');
const path = require('path');
const router = require('./src/routes/home');
const candidatesRoute = require('./src/routes/candidate');

const app = express();
const _PORT = 3005;

/* pug-templates-engines */
app.set('views', './src/views')
    .set('view engine', 'pug');

//* parsing json */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/* routes */
app.use(router);
app.use(candidatesRoute);

/* static files */
app.use('/public', express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));

app.listen(_PORT, () => console.info(`click to run: http://localhost:${_PORT}`));