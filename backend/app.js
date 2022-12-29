const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-route'); /* Import places-route.js */
const usersRoutes = require('./routes/users-routes'); /* Import users-route.js */

const app = express();

app.use('/api/places', placesRoutes); /* Use places-route.js  just with /api/places/*/
app.use('/api/users', usersRoutes); /* Use users-route.js  just with /api/users/*/

// Error handling middleware
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
});S

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// require('./controllers/authController')(app);

app.listen(5000);