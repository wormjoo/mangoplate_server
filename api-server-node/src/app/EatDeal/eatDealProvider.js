const baseResponseStatus = require("../../../config/baseResponseStatus");
const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const eatDealDao = require("./eatDealDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveEatDealList = async function(area) {
    const connection = await pool.getConnection(async (conn) => conn);
    const eatDealList = await eatDealDao.selectEatDeal(connection, area);

    connection.release();

    return eatDealList;
}
