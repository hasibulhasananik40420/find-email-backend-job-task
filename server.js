const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');  // Import the cors package
const path = require('path');
require('dotenv').config();


const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors());

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMPT_USERNAME, // Your Gmail email address
    pass: process.env.SMPT_PASSWORD, // Your Gmail password
  },
});

// Express middleware to handle file uploads
app.post('/send-email', upload.single('file'), async (req, res) => {
  try {
    const { text, email } = req.body;

    const mailOptions = {
      from: process.env.SMPT_USERNAME,
      to: email,
      subject: 'Email Sender',
      text: text,
      attachments: [
        {
          filename: 'attachment.txt',
          content: req.file.buffer,
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/', (req, res) => {
  res.send('Email founder');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
