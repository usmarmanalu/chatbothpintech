import { google } from "googleapis";

export async function getSheetsData() {

  const auth = new google.auth.GoogleAuth({

    credentials: JSON.parse(process.env.GOOGLE_SERVICE_KEY),

    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]

  });

  const sheets = google.sheets({
    version: "v4",
    auth
  });

  const spreadsheetId = process.env.SHEET_ID;

  // ambil metadata sheet
  const meta = await sheets.spreadsheets.get({
    spreadsheetId
  });

  const sheetTitles = meta.data.sheets.map(s => s.properties.title);

  const results = [];

  for (const title of sheetTitles) {

    const response = await sheets.spreadsheets.values.get({

      spreadsheetId,

      range: title

    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) continue;

    const headers = rows[0];

    const data = rows.slice(1).map(row => {

      const obj = {};

      headers.forEach((h, i) => {
        obj[h] = row[i] || "";
      });

      return obj;

    });

    results.push({

      name: title,

      rows: data

    });

  }

  return results;

}