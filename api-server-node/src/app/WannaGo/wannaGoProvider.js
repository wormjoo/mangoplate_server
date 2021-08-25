const baseResponseStatus = require("../../../config/baseResponseStatus");
const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const wannaGoDao = require("./wannaGoDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveStarList = async function (userId, detailArea) {
    if (!detailArea) {
        const connection = await pool.getConnection(async (conn) => conn);
        const starListResult = await wannaGoDao.selectAllWannaGo(connection, userId);
        connection.release();

        return starListResult;

    } else {
        const connection = await pool.getConnection(async (conn) => conn);
        const starListResult = await wannaGoDao.selectWannaGo(connection, userId, detailArea);
        connection.release();

        return starListResult;
    }
};