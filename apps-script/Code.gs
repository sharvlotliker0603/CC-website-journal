/**
 * NOIR blog story submission receiver.
 * In Google Sheets, create a spreadsheet and add a sheet tab named "Submissions".
 * Then paste this entire file into Extensions > Apps Script.
 */
const SHEET_NAME = "Submissions";
const HEADERS = [
  "Timestamp",
  "Full Name",
  "Email",
  "Story Title",
  "Category",
  "Description",
  "Portfolio / Reference Link"
];

function doGet() {
  return ContentService
    .createTextOutput("NOIR submission endpoint is running.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }

    const params = (e && e.parameter) ? e.parameter : {};
    const timestamp = params.submittedAt ? new Date(params.submittedAt) : new Date();

    // Prefix user-entered strings that could otherwise be interpreted as formulas.
    const safe = value => {
      const str = String(value || "").trim();
      return /^[=+\-@]/.test(str) ? "'" + str : str;
    };

    sheet.appendRow([
      timestamp,
      safe(params.name),
      safe(params.email),
      safe(params.title),
      safe(params.category),
      safe(params.description),
      safe(params.link)
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: "Submission saved." }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}