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

exports.userCheck = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    let userResult = await visitedDao.selectUser(connection, userId);

    const userNickname = userResult[0].nickname;
    
    connection.release();
  
    return userNickname;
};

exports.restaurantCheck = async function (restaurantId) {
    const connection = await pool.getConnection(async (conn) => conn);
    let restaurantResult = await visitedDao.selectRestaurant(connection, restaurantId);

    const restaurantName = restaurantResult[0].name;
    
    connection.release();
  
    return restaurantName;
};

exports.retrieveVisitedList = async function (userId, detailArea) {
    if (!detailArea) {
        const connection = await pool.getConnection(async (conn) => conn);
        const visitedListResult = await visitedDao.selectAllVisitedList(connection, userId);
        connection.release();

        return visitedListResult;

    } else {
        const connection = await pool.getConnection(async (conn) => conn);
        const visitedListResult = await visitedDao.selectVisitedList(connection, userId, detailArea);
        connection.release();

        return visitedListResult;
    }
};