const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-route'); /* Import places-route.js */
const usersRoutes = require('./routes/users-routes'); /* Import users-route.js */

const app = express();

app.use('/api/places', placesRoutes); /* Use places-route.js  just with /api/places/*/
app.use('/api/users', usersRoutes); /* Use users-route.js  just with /api/users/*/

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// require('./controllers/authController')(app);

app.listen(5000);