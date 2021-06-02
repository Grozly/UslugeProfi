const path = require("path");

const DEV_SERVER_PORT = 3001;
const IS_PRODUCTION = (process.env.NODE_ENV || "").trim() === "production";
const SRC_FOLDER = path.resolve(__dirname, "src");
const ASSETS_FOLDER = path.resolve(__dirname, "assets");
const OUTPUT_FOLDER = path.resolve(__dirname, "../static");

const BROWSERS_LIST = [">1%", "last 4 versions", "Firefox ESR", "not ie < 9"];

module.exports = {
    DEV_SERVER_PORT,
    IS_PRODUCTION,
    SRC_FOLDER,
    OUTPUT_FOLDER,
    BROWSERS_LIST,
    ASSETS_FOLDER,
};
