const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const restaurantProvider = require("./restaurantProvider");
const restaurantDao = require("./restaurantDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createRestaurant = async function (userId, name, address, callNumber, cuisine) {
    try {
        const insertRestaurantParams = [userId, name, address, callNumber, cuisine];

        const connection = await pool.getConnection(async (conn) => conn);

        const RestaurantIdResult = await restaurantDao.insertRestaurant(connection, insertRestaurantParams);
        console.log(`추가된 식당 : ${RestaurantIdResult[0].insertId}`);
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createRestaurant Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.writeReview = async function (userId, restaurantId, image, evaluation, content) {
    try {
        insertReviewParams = [userId, restaurantId, evaluation, content];
        
        const connection = await pool.getConnection(async (conn) => conn);

        if (image == null) {
            const reviewResult = await restaurantDao.insertReview(connection, insertReviewParams);
            console.log(`추가된 리뷰 : ${reviewResult[0].insertId}`);
        } else {
            const reviewResult = await restaurantDao.insertReview(connection, insertReviewParams);
            imageParams = [restaurantId, reviewResult[0].insertId, image];
            const imageResult = await restaurantDao.insertImage(connection, imageParams);
            console.log(`추가된 리뷰 : ${reviewResult[0].insertId}`);
        }
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - writeReview Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};