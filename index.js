"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");
const url = require("url");

const { google } = require("googleapis");
let drive_obj = null;
let docs_obj = null;

// get service account file here: https://developers.google.com/identity/protocols/oauth2/service-account#creatinganaccount
const keyPath = path.join(__dirname, "service-account-key.json");
if (!fs.existsSync(keyPath)) {
    console.log("Missing service-account-key.json!");
    console.log("You can follow this instruction to get the file: https://developers.google.com/identity/protocols/oauth2/service-account");
}
const scopes = ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/documents"];

const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: scopes,
});

async function read_data(file_id) {
    let data = await docs_obj.documents.get({
        documentId: file_id,
    });
    return data;
}

async function write_data(data) {}

async function delete_data(data) {}

async function update_permission(file_id, permission) {
    // update file permission
    // use this for test purpose only, in production, user don't need to see doc file
    let permission_request = await drive_obj.permissions.insert({
        fileId: file_id,
        resource: permission,
    });
    return permission_request;
}

async function main() {
    const authClient = await auth.getClient();
    docs_obj = google.docs({
        version: "v1",
        auth: authClient,
    });
    drive_obj = google.drive({
        version: "v2",
        auth: authClient,
    });
    let doc_id = "1HHVPTaw0yHF8WPRWfWD7eJ0R4d2_EbfOoUkjcDXLOiw";
    // let doc_file = await drive.files.get({ fileId: doc_id });

    // await update_permission(doc_id, {
    //     type: "anyone",
    //     role: "writer",
    // });

    let data = await read_data(doc_id);
    console.log(data.data.body.content);
    // create docs file
    // const new_document = await docs.documents.create({
    //     requestBody: {
    //         title: "Password DB",
    //     },
    // });

    // let file_id = sheet_file.spreadsheetId;
    // let drive_file = await drive.files.get({ fileId: sheet_id });

    // update file permission
    // use this for test purpose only, in production, user don't need to see spreadsheet file
    // let permission_request = await drive.permissions.insert({
    //     fileId: sheet_id,
    //     resource: {
    //         type: "anyone",
    //         role: "writer",
    //     },
    // });
}

main();
