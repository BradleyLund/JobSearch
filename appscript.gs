function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");

    var row = [
      data.company || "",
      data.companyWebsite || "",
      data.companyDescription || "",
      data.recruitmentAgency || "",
      data.location || "",
      data.hybrid || "",
      data.jobRole || "",
      data.jobPosting || "",
      data.salary || "",
      data.networkConnection || "",
      data.cvUsed || "",
      data.qualificationsMissing || "",
      data.dateFound || "",
      data.applicationSent || "No",
      data.dateApplied || "",
      data.response || "",
      "", "", "", "",
      "", "", "", ""
    ];

    sheet.appendRow(row);

    // Force salary column to plain text so "$75,000" doesn't get mangled
    if (data.salary) {
      var lastRow = sheet.getLastRow();
      var salaryCol = 9; // Column I = salary
      var cell = sheet.getRange(lastRow, salaryCol);
      cell.setNumberFormat("@");
      cell.setValue(data.salary);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok", row: sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", message: "Job tracker endpoint is active" }))
    .setMimeType(ContentService.MimeType.JSON);
}
