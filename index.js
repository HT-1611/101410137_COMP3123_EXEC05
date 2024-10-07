const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Middleware to parse JSON bodies
app.use(express.json());

/*
- Serve home.html with a welcome message
*/
router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

/*
- Return all details from user.json file to client in JSON format
*/
router.get('/profile', (req, res) => {
  fs.readFile('user.json', 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading user file' });
    }
    res.json(JSON.parse(data));
  });
});

/*
- Login route to check username and password from user.json
*/
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Read user.json file
  fs.readFile('user.json', 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading user file' });
    }

    // Parse the user data
    const user = JSON.parse(data);

    // Check if the username matches
    if (user.username !== username) {
      return res.json({
        status: false,
        message: "User Name is invalid"
      });
    }

    // Check if the password matches
    if (user.password !== password) {
      return res.json({
        status: false,
        message: "Password is invalid"
      });
    }

    // If username and password are valid
    res.json({
      status: true,
      message: "User is valid"
    });
  });
});

/*
- Logout route that accepts username as parameter and displays HTML message
*/
router.get('/logout/:username', (req, res) => {
  const { username } = req.params;
  res.send(`<b>${username} successfully logged out.</b>`);
});

/*
- Error handling middleware for 500 errors
*/
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

app.use('/', router);

const PORT = process.env.PORT || 8005;
app.listen(PORT, () => {
  console.log('Web Server is listening at port ' + PORT);
});