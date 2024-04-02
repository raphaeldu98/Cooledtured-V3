const express = require('express');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');

const app = express();
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Set your SendGrid API key

app.use(cors()); // Enable CORS
app.use(bodyParser.json());

app.post('/send-email', (req, res) => {
    const { name, email, phoneNumber, message } = req.body;

    const mailOptions = {
        to: 'your-receiving-email@example.com', // Your email where you want to receive messages
        from: 'your-sendgrid-verified-email@example.com', // Must be verified with SendGrid
        subject: subject,
        text: Message from: ${email}\n\n${message},
    };

    sgMail.send(mailOptions)
        .then(() => res.status(200).send('Email sent successfully'))
        .catch(error => {
            console.error(error);
            res.status(500).send('Error in sending email');
        });
}); 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Server running on port ${PORT}));