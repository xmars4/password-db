const mongoose = require("mongoose");

const { encrypt_content, decrypt_content } = require("./helper");

module.exports = {
    initialize_collection: async () => {
        const Schema = mongoose.Schema;
        try {
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
        } catch (err) {
            console.log(err);
            return false;
        }
    },
};
