require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');
const userRoutes = require('./routes/userRoutes');
const passport = require('passport');
const jwtStrategy = require('./strategies/jwt');
const cors = require('cors');



mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-wqruv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();
app.use(cors());
app.options('*', cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/posts', blogRoutes)
app.use('/users', userRoutes)

passport.use(jwtStrategy);


app.listen(5985, () => console.log('Server running on port 3000'))