"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");
const url = require("url");

const { google } = require("googleapis");
const people = google.people("v1");

const keyPath = path.join(__dirname, "service-account-key.json");
console.log(keyPath);

if (!fs.existsSync(keyPath)) {
    console.log("Missing service-account-key.json!");
    console.log("You can follow this instruction to get the file: https://developers.google.com/identity/protocols/oauth2/service-account");
}
const scopes = ["https://www.googleapis.com/auth/contacts.readonly", "https://www.googleapis.com/auth/user.emails.read", "https://www.googleapis.com/auth/userinfo.profile"];

const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: scopes,
});

async function main() {
    const authClient = await auth.getClient();

    // obtain the current project Id
    const project = await auth.getProjectId();

    console.log(project);
}

main();
