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