const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./server/routes/index');
const errorHandlers = require('./server/handlers/errorHandlers');

const cons = require('consolidate');
const app = express();

// view engine setup
app.set('views', __dirname + '/views');
app.engine('html', cons.mustache);
app.set('view engine', 'html');

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, 'public')));

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes);
app.use(errorHandlers.notFound);

if (app.get('env') === 'development') {
    /* Development Error Handler - Prints stack trace */
    app.use(errorHandlers.developmentErrors);
}

app.use(errorHandlers.productionErrors);

module.exports = app;