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

exports.retrieveLikeUserList = async function (reviewId) {
  const connection = await pool.getConnection(async (conn) => conn);
  let likeUserListResult = await reviewDao.selectLikeUser(connection, reviewId);
  
  connection.release();

  return likeUserListResult;
};

exports.retrieveNews = async function (evaluationParams, area){
  if (!area) {
    const connection = await pool.getConnection(async (conn) => conn);
    let newsListResult = await reviewDao.selectNews(connection, evaluationParams);
  
    connection.release();

    return newsListResult;
  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectNewsByAreaParams = [];
    for (var i = 0; i < 3; i++) {
      selectNewsByAreaParams.push(evaluationParams[i]);
    }
    selectNewsByAreaParams.push(area);
    console.log(selectNewsByAreaParams);
    let newsListResult = await reviewDao.selectNewsByArea(connection, selectNewsByAreaParams);
  
    connection.release();

    return newsListResult;
  }
};