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
        const image = 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FWpAMM%2Fbtrc3qd9jmx%2FfrvRPUYQ1CLn5jrRlTsEJk%2Fimg.png';

        const connection = await pool.getConnection(async (conn) => conn);

        const restaurantIdResult = await restaurantDao.insertRestaurant(connection, insertRestaurantParams);
        console.log(`추가된 식당 : ${restaurantIdResult[0].insertId}`);
        const restaurantImage = await restaurantDao.insertRestaurantImage(connection, restaurantIdResult[0].insertId, image);
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createRestaurant Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};