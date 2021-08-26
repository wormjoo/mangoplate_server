const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const visitedProvider = require("./visitedProvider");
const visitedDao = require("./visitedDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createVisited = async function (userId, restaurantId, content, public) {
    try {
        // 한 식당마다 하루 1개 가봤어요 추가 제한
        const visitedListRows = await visitedProvider.visitedCheck(userId, restaurantId);
        
        if (visitedListRows[0].length > 0) {
            return errResponse(baseResponse.TODAY_VISITED_EXIST);
        }

        insertVisitedParams = [userId, restaurantId, content, public];
        const connection = await pool.getConnection(async (conn) => conn);
        const visitedResult = await visitedDao.insertVisited(connection, insertVisitedParams);

        console.log(`추가된 가봤어요 : ${visitedResult[0].insertId}`);
  
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createVisited Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};