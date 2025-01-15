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
// const c = require("./credentials.json")

// console.log(c)

// Set up Express app
const app = express();
app.get("/",(req, res) => res.send("Welcome to Bitrox Dental Backend!!") )

app.use(cors())
app.use(bodyParser.json());

const SCOPES = [process.env.SCOPES];
// console.log("SCOPE", SCOPES)
const credentialsString = base64.decode(process.env.CREDENTIALS)
const credentials = JSON.parse(credentialsString);
// console.log(jsonString)

const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: SCOPES,
});

console.log(auth)

const sheets = google.sheets({ version: 'v4', auth });
// console.log(sheets)
const SPREADSHEET_ID = process.env.SPREADSHEET_ID; // Replace with your spreadsheet ID

// console.log(SPREADSHEET_ID)

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
    // console.log(req.body)

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

    res.status(200).send('Data saved successfully.');
  } catch (error) { 
    console.error('Error saving data:', error);
    res.status(500).send('Server Error.');
  }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
