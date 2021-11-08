const mongoose = require("mongoose");

const { hash_password } = require("./helper");

module.exports = {
    initialize_collection: async () => {
        const Schema = mongoose.Schema;
        const UserSchema = new Schema(
            {
                user_name: {
                    type: String,
                    required: true,
                    unique: true,
                },
                password: {
                    type: String,
                    required: true,
                    set: hash_password,
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
        const UserModel = mongoose.model("Users", UserSchema);
        return UserModel;
    },
};
