const { google } = require("googleapis");

let sheetsClient = null;

function getSheets() {
  if (sheetsClient) return sheetsClient;
  const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  sheetsClient = google.sheets({ version: "v4", auth });
  return sheetsClient;
}

async function appendWorkshopApplication({ name, phone, email, why }) {
  const sheets = getSheets();
  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
  });
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.WORKSHOP_SHEET_ID,
    range: "Sheet1!A:E",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[timestamp, name, phone, email, why]],
    },
  });
}

module.exports = { appendWorkshopApplication };
