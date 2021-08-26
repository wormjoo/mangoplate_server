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

exports.updateVisited = async function (visitedId, content, public) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
        let new_public;
                
        if (!content && !public) {
            // 리뷰 삭제
            const deleteVisited = await visitedDao.updateVisitedStatus(connection, visitedId);
        } else {
            // 리뷰 수정
            if (!public) {
                const visitedResult = await visitedDao.selectVisitedUser(connection, visitedId);
                new_public = visitedResult[0].public;
            } else {
                new_public = public;
            }
            const editVisited = await visitedDao.updateVisitedContent(connection, visitedId, content, new_public);;
        }

        // 커밋
        await connection.commit();   
        return response(baseResponse.SUCCESS);

    } catch (err) {
        // 롤백
        await connection.rollback();
        logger.error(`App - updateVisited Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};