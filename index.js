"use strict";

require("dotenv").config();

module.exports = {
    info_coll: require("./lib/secret-info-collection"),
    user_coll: require("./lib/users-collection"),
    helper: require("./lib/helper"),
};
