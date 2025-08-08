// IMPORTANT: Run 'npm install cors' in backend directory if not already installed.
const express = require("express");
const app = express();
const cors = require('cors');
const path = require('path');
const db = require('./models'); // Import Sequelize models

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// PostOurWork routes
const postOurWorkRouter = require('./routes/postourwork');
app.use('/api/postourwork', postOurWorkRouter);

const postProductRouter = require('./routes/postproduct');
app.use('/api/postproduct', postProductRouter);

const userRouter = require('./routes/user');
app.use('/api', userRouter);

const userSubmitRouter = require('./routes/usersubmit');
app.use('/api/usersubmit', userSubmitRouter);

// Sync database and then start server
// This will create tables if they do not exist
// You can use { force: true } to drop and recreate tables (for dev only)
db.sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
});

app.get("/", (req, res) => {
    res.send("Hello World");
});

module.exports = app;