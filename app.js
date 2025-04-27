// imports
const express = require('express');
const createErrors = require('http-errors');

const userRoute = require('./routes/user.route');
const categoryRoute = require('./routes/category.route');
const blogRoute = require('./routes/blog.route');
const cors = require('cors');

// constants
const app = express();

app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({
    origin: '*', // Allow frontend URL
    // https://blog-app-sattvik.vercel.app/signup
    credentials: true,  // Allow cookies and other credentials
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
// routes
app.get('/', (req, res) => {
    res.send('Hello heroku');
});

app.use('/user', userRoute);
app.use('/category', categoryRoute);
app.use('/blog', blogRoute);
const adminRoutes = require('./routes/admin.route');
app.use('/admin', adminRoutes);
// handle wildcard route
app.use(async(req, res, next) => {
    next(createErrors.NotFound('This route does not exists!'));
});

// handle errors
app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        err.status = 400;
    }
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message || 'Internal server error'
        }
    });
});

// exports
module.exports = app;