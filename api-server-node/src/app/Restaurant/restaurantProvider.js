const baseResponseStatus = require("../../../config/baseResponseStatus");
const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const restaurantDao = require("./restaurantDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveRestaurantList = async function (detailArea, name) {
    if (!name) {
        const connection = await pool.getConnection(async (conn) => conn);
        const restaurantListResult = await restaurantDao.selectRestaurant(connection, detailArea);
        connection.release();

        return restaurantListResult;

    } else {
        const connection = await pool.getConnection(async (conn) => conn);
        const restaurantListResult = await restaurantDao.selectRestaurantByName(connection, detailArea, name);
        connection.release();

        return restaurantListResult;
    }
};

exports.retrieveRestaurant = async function (id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const restaurantResult = await restaurantDao.selectRestaurantById(connection, id);
  const increaseViews = await restaurantDao.updateViews(connection, id); 
  
  connection.release();

  return restaurantResult;
};

exports.retrieveReview = async function (restaurantId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const reviewResult = await restaurantDao.selectReviewByRestaurant(connection, restaurantId);
  
  connection.release();

  return reviewResult;
};