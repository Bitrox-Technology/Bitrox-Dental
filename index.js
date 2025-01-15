// Import required libraries
require("dotenv").config()
const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const multer = require('multer');
const fs = require('fs');
const mail = require("./mail.js")
const cors = require("cors")
const base64= require("base-64")


// Set up Express app
const app = express();
app.use(cors())
app.use(bodyParser.json());

// Multer setup for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Google Sheets setup
// const credentials = require('./credentials.json'); 
// console.log(credentials)// Replace with your credentials file
const SCOPES = [process.env.SCOPES];
const credentials = base64.decode(process.env.CREDENTIALS)
let jsonCredential = JSON.parse(credentials)
// console.log("Credentials--", jsonCredential)

const auth = new google.auth.GoogleAuth({
  jsonCredential,
  scopes: SCOPES,
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = '11d8M_Ug9ak5lseaeQlFXsgD6VJHHJXaOXu3f4kxY06c'; // Replace with your spreadsheet ID

app.get("/", "Welcome to Bitrox Dental Backend!!")

// API endpoint to handle form submission
app.post('/submit', async (req, res) => {
  try {
    const {
      callData,
      serviceDesired,
      dateAndTime,
      fullName,
      email,
      phone,
      birthday,
      reasonForAppointment,
      dentalInsurance,
      callSummary,
      transcript,
      recording
    } = req.body
    console.log(req.body)

    // Append data to Google Sheets
    const values = [[
      callData,
      serviceDesired,
      dateAndTime,
      fullName,
      email,
      phone,
      birthday,
      reasonForAppointment,
      dentalInsurance,
      callSummary,
      transcript,
      recording
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:L', // Adjust range as per your sheet
      valueInputOption: 'RAW',
      resource: { values },
    });

    await mail(fullName, dateAndTime , email)

    res.status(200).json('Data saved successfully.');
  } catch (error) { 
    console.error('Error saving data:', error);
    res.status(500).json('Internal Server Error.', error);
  }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
