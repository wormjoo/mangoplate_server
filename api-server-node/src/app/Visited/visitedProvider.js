const baseResponseStatus = require("../../../config/baseResponseStatus");
const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const visitedDao = require("./visitedDao");

// Provider: Read 비즈니스 로직 처리

exports.visitedCheck = async function (userId, restaurantId) {
    const connection = await pool.getConnection(async (conn) => conn);
    let todayVisitedResult = await visitedDao.selectTodayVisited(connection, userId, restaurantId);
    
    connection.release();
  
    return todayVisitedResult;
};