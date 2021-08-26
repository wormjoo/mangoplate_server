const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const eatDealProvider = require("./eatDealProvider");
const eatDealDao = require("./eatDealDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createPurchase = async function (eatDealId, userId, quantity, payMethod) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
        // 트랜잭션
        await connection.beginTransaction();

        const insertPurchaseParams = [eatDealId, userId, quantity, payMethod];
        const purchaseResult = await eatDealDao.insertPurchase(connection, insertPurchaseParams);

        console.log(`추가된 구매내역 : ${purchaseResult[0].insertId}`);

        // 커밋
        await connection.commit();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        // 롤백
        await connection.rollback();
        logger.error(`App - createPurchase Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};

exports.updatePurchase = async function (purchaseId) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
        // 트랜잭션
        await connection.beginTransaction();

        const canclePurchaseResult = await eatDealDao.updatePurchaseStatus(connection, purchaseId);
        
        // 커밋
        await connection.commit();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        // 롤백
        await connection.rollback();
        logger.error(`App - updatePurchase Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};