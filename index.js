"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");
const url = require("url");

const { google } = require("googleapis");

// get service account file here: https://developers.google.com/identity/protocols/oauth2/service-account#creatinganaccount
const keyPath = path.join(__dirname, "service-account-key.json");
if (!fs.existsSync(keyPath)) {
    console.log("Missing service-account-key.json!");
    console.log("You can follow this instruction to get the file: https://developers.google.com/identity/protocols/oauth2/service-account");
}
const scopes = ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/spreadsheets"];

const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: scopes,
});

async function main() {
    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: authClient });
    const drive = google.drive({
        version: "v2",
        auth: authClient,
    });
    let sheet_id = "1GM9SIEKgDXk1kPPpBYR6cQIFtsU-ls9o1SKzPNkqBW0";
    let sheet_file = await drive.files.get({ fileId: sheet_id });
    console.log(sheet_file);

    // create spreadsheet file
    // const sheet = await sheets.spreadsheets.create({
    //     requestBody: {
    //         dataSourceSchedules: [],
    //         dataSources: [],
    //         developerMetadata: [],
    //         namedRanges: [],
    //         properties: {
    //             title: "Password DB",
    //         },
    //         sheets: [],
    //         spreadsheetId: "",
    //         spreadsheetUrl: "",
    //     },
    // });

    // let file_id = sheet_file.spreadsheetId;
    // let drive_file = await drive.files.get({ fileId: sheet_id });

    // update file permission
    // use this for test purpose only, in production, user don't need to see spreadsheet file
    let permission_request = await drive.permissions.insert({
        fileId: sheet_id,
        resource: {
            type: "anyone",
            role: "writer",
        },
    });
}

main();
