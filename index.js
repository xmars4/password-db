"use strict";

const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");

const db_url = "cluster0.c7k47.mongodb.net";
const db_name = "password-db";
// FIXME: store three values below to safe place
const db_user = "admin";
const db_password = "Intelligent";
const secret_key = "";
//
const url = `mongodb+srv://${db_user}:${db_password}@${db_url}/${db_name}`;

async function main() {
    function encrypt_content(content) {
        let ciphertext = CryptoJS.AES.encrypt(content, secret_key).toString();
        return ciphertext;
    }

    function decrypt_content(content) {
        let bytes = CryptoJS.AES.decrypt(content, secret_key);
        let originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText;
    }

    function intialize_collection() {
        const Schema = mongoose.Schema;
        // define schema
        const SecretInfoSchema = new Schema(
            {
                user_id: {
                    type: String,
                    required: true,
                },
                title: {
                    type: String,
                    required: true,
                },
                content: {
                    type: String,
                    required: true,
                    get: decrypt_content,
                    set: encrypt_content,
                },
            },
            {
                toObject: {
                    getters: true,
                    setters: true,
                },
                toJSON: {
                    getters: true,
                    setters: true,
                },
            }
        );
        const SecretInfoModel = mongoose.model("Secret_Info", SecretInfoSchema);
        return SecretInfoModel;
    }

    await mongoose.connect(url);
    const SecretInfoModel = intialize_collection();

    async function insert_data(data) {
        const new_info = new SecretInfoModel(data);
        await new_info.save();
    }

    async function insert_multi_data(data_list) {
        try {
            let new_data = await SecretInfoModel.insertMany(data_list);
            console.log(new_data);
            return new_data;
        } catch (error) {
            console.log("can't ssave manyti");
            // console.log(error);
            return [];
        }
    }

    async function get_data(query = {}) {
        const data = await SecretInfoModel.find(query);
        return data;
    }

    async function delete_data(query) {
        await SecretInfoModel.deleteMany(query);
    }

    // await insert_multi_data([{ title: "computer pass", content: "abcxxx" }]);
    // await insert_multi_data([{ user_id: "1234", title: "computer pass", content: "abcxxx" }]);
    // console.log(await get_data());
    // await delete_data({ user_id: "1234" });
}

main()
    .then()
    .catch((e) => {
        console.log("Can't connect to MongoDB", e);
    })
    .finally();
