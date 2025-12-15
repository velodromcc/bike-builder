const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the Vue app build output
app.use(express.static(path.join(__dirname, '../dist')));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

app.post('/api/send-email', (req, res) => {
    const { name, email, phone, message, ...rest } = req.body;

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER,
        subject: `New Enquiry from BikeBuilder: ${name}`, // Ensure subject is set
        text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Message: ${message}
      
      -------------------------
      Configuration Details:
      ${JSON.stringify(rest, null, 2)}
    `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: true, message: error.toString() });
        }
        console.log('Email sent: ' + info.response);
        res.status(200).json({ error: false, message: 'Email sent successfully' });
    });
});

// Catch-all handler for any request that doesn't match the API above
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
