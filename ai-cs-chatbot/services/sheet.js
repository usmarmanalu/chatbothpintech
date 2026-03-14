import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export async function getSheetsData() {

  try {

    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const doc = new GoogleSpreadsheet(
      process.env.GOOGLE_SHEET_ID,
      serviceAccountAuth
    );

    await doc.loadInfo();

    const sheetsData = [];

    for (const sheet of doc.sheetsByIndex) {

      const rows = await sheet.getRows();

      const formattedRows = rows.map(r => r.toObject());

      sheetsData.push({
        name: sheet.title,
        rows: formattedRows
      });

    }

    return sheetsData;

  } catch (error) {

    console.error("SHEET ERROR:", error);

    return [];

  }

}