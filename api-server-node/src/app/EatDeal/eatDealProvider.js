const baseResponseStatus = require("../../../config/baseResponseStatus");
const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const eatDealDao = require("./eatDealDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveEatDealList = async function(area) {
    if (!area) {
        const connection = await pool.getConnection(async (conn) => conn);
        const eatDealList = await eatDealDao.selectAllEatDeal(connection);

        connection.release();

        return eatDealList;
    } else {
        const connection = await pool.getConnection(async (conn) => conn);
        const eatDealList = await eatDealDao.selectEatDeal(connection, area);

        connection.release();

        return eatDealList;
    }
    
}

exports.retrieveEatDeal = async function(eatDealId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const detailEatDeal = await eatDealDao.selectEatDealById(connection, eatDealId);

    connection.release();

    return detailEatDeal;
}

exports.retrievePurchaseUser = async function(purchaseId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const purchaseResult = await eatDealDao.selectPurchaseUser(connection, purchaseId);

    const purchaseUser = purchaseResult[0].userId;

    connection.release();

    return purchaseUser;
}

exports.getOrderList = async function(eatDealId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const orderListRow = await eatDealDao.selectOrderList(connection, eatDealId);

    connection.release();

    return orderListRow;
}