const bcrypt = require("bcrypt");
const CryptoJS = require("crypto-js");
const mongoose = require("mongoose");

const DB_CONNECTION_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_NAME}`;

const encrypt_content = (content) => {
    let ciphertext = CryptoJS.AES.encrypt(content, process.env.SECRET_KEY).toString();
    return ciphertext;
};

const decrypt_content = (content) => {
    let bytes = CryptoJS.AES.decrypt(content, process.env.SECRET_KEY);
    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};

const hash_password = async (password) => {
    const salt_rounds = 10;
    const hash = await bcrypt.hash(password, salt_rounds);
    return hash;
};

const compare_password = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

// DB cllection functions
// ______________________
const connect_to_db = async () => {
    let conn = await mongoose.connect(DB_CONNECTION_URL);
    return conn;
};

const insert_one = async (SecretInfoModel, data) => {
    try {
        let new_data = await SecretInfoModel.create(data);
        return new_data;
    } catch (err) {
        console.log(err);
        return [];
    }
};

const insert_many = async (SecretInfoModel, data_list) => {
    try {
        let new_data = await SecretInfoModel.insertMany(data_list);
        return new_data;
    } catch (err) {
        console.log(err);
        return [];
    }
};

const get_data = async (SecretInfoModel, query = {}) => {
    try {
        const data = await SecretInfoModel.find(query);
        return data;
    } catch (err) {
        console.log(err);
        return [];
    }
};

const delete_data = async (SecretInfoModel, query = {}) => {
    try {
        await SecretInfoModel.deleteMany(query);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

module.exports = {
    DB_CONNECTION_URL,
    encrypt_content,
    decrypt_content,
    hash_password,
    compare_password,
    connect_to_db,
    insert_one,
    insert_many,
    get_data,
    delete_data,
};
