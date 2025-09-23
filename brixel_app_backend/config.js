require('dotenv').config();

module.exports = {
    port: process.env.PORT || 9999,
    database: process.env.DATABASE || 'mongodb://localhost:27017/brixel_app_v2',
}