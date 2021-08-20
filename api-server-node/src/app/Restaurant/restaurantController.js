const jwtMiddleware = require("../../../config/jwtMiddleware");
const restaurantProvider = require("../Restaurant/restaurantProvider");
const restaurantService = require("../Restaurant/restaurantService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 11
 * API Name : 식당 등록하기 API 
 * [POST] /app/restaurants
 */
exports.postRestaurant = async function (req, res) {

    /**
     * Body: name, address, callNumber, cuisine
     */

    const userId = req.params.userId;
    const {name, address, callNumber, cuisine} = req.body;

    if(!userId) return res.send(response(baseResponse.USER_ID_EMPTY));
    
    const registrateRestaurant = await restaurantService.createRestaurant(
        userId,
        name,
        address,
        callNumber,
        cuisine
    );

    return res.send(registrateRestaurant);
};