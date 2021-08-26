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

exports.retrieveVisitedUser = async function (visitedId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const visitedResult = await visitedDao.selectVisitedUser(connection, visitedId);
  
    const visitedUser = visitedResult[0].userId;
    
    connection.release();
  
    return visitedUser;
  };