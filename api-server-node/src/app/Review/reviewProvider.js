const baseResponseStatus = require("../../../config/baseResponseStatus");
const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const reviewDao = require("./reviewDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveReviewList = async function (restaurantId) {
  const connection = await pool.getConnection(async (conn) => conn);
  let reviewListResult = await reviewDao.selectReviewByRestaurant(connection, restaurantId);
  
  connection.release();

  return reviewListResult;
};

exports.retrieveReview = async function (reviewId) {
    const connection = await pool.getConnection(async (conn) => conn);
    let reviewResult = await reviewDao.selectReview(connection, reviewId);
    
    connection.release();
  
    return reviewResult;
};

exports.retrieveCommentList = async function (reviewId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const commentListResult = await reviewDao.selectCommentByReview(connection, reviewId);
    
    connection.release();
  
    return commentListResult;
};