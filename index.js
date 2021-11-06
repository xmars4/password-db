"use strict";

const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");

require("dotenv").config();
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_NAME}`;

async function main() {
    function encrypt_content(content) {
        let ciphertext = CryptoJS.AES.encrypt(content, process.env.SECRET_KEY).toString();
        return ciphertext;
    }

    function decrypt_content(content) {
        let bytes = CryptoJS.AES.decrypt(content, process.env.SECRET_KEY);
        let originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText;
    }

    function intialize_collection() {
        const Schema = mongoose.Schema;
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
            console.log(error);
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

    await insert_multi_data([{ user_id: "11111", title: "computer pass", content: "abcxxx" }]);
    // await insert_multi_data([{ user_id: "1234", title: "computer pass", content: "abcxxx" }]);
    console.log(await get_data());
    // await delete_data({ user_id: "1234" });
}

main()
    .then()
    .catch((e) => {
        console.log("Can't connect to MongoDB", e);
    })
    .finally();
