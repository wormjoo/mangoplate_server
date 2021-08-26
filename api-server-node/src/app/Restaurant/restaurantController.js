const jwtMiddleware = require("../../../config/jwtMiddleware");
const restaurantProvider = require("../Restaurant/restaurantProvider");
const restaurantService = require("../Restaurant/restaurantService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 10
 * API Name : 식당 등록하기 API 
 * [POST] /app/restaurants/:userId
 * path variable: userId
 */
exports.postRestaurant = async function (req, res) {
    /**
     * jwt - userId pathvariable: userId
     * Body: name, address, callNumber, cuisine
     */

     const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {name, address, callNumber, cuisine} = req.body;

    if(!userId) return res.send(response(baseResponse.USER_ID_EMPTY));

    if (!name) return res.send(response(baseResponse.RESTAURANT_NAME_EMPTY));
    if (!address) return res.send(response(baseResponse.RESTAURANT_ADDRESS_EMPTY));

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } 
    
    const registrateRestaurant = await restaurantService.createRestaurant(
        userId,
        name,
        address,
        callNumber,
        cuisine
    );

    return res.send(registrateRestaurant);
};

/**
 * API No. 11
 * API Name : 식당 조회 API (메인 화면)
 * [GET] /app/restaurants
 */
exports.getRestaurants = async function (req, res) {

    /**
     * Query String: name, area
     */
    let name = req.query.name;
    const area = req.query.area;

    if (!name) {
        // 식당 전체 조회
        const restaurantListResult = await restaurantProvider.retrieveRestaurantList(area);
        return res.send(response(baseResponse.SUCCESS, restaurantListResult));
    } else {
        // 식당 검색 조회
        name = `%${name}%`;
        const restaurantListByName = await restaurantProvider.retrieveRestaurantList(area, name);
        return res.send(response(baseResponse.SUCCESS, restaurantListByName));
    }
};

/**
 * API No. 12
 * API Name : 특정 식당 조회 API (맛집 상세)
 * [GET] /app/restaurants/:restaurantId
 * path vairable: restaurantId
 */
 exports.getRestaurant = async function (req, res) {

    /**
     * Path varibale: restaurantId
     */

    const restaurantId = req.params.restaurantId;

    if (!restaurantId) return res.send(errResponse(baseResponse.RESTAURANT_ID_EMPTY));

    const restaurantResult = await restaurantProvider.retrieveRestaurant(restaurantId);
    return res.send(response(baseResponse.SUCCESS, restaurantResult));
};

/**
 * API No. 13
 * API Name : 내가 등록한 식당 조회 API
 * [GET] /app/:userId/restaurants
 * path vairable: userId
 */
 exports.getMyRestaurants = async function (req, res) {

    /**
     * jwt - userId
     * Path varibale: userId
     */

    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId;

    if(!userId) return res.send(response(baseResponse.USER_ID_EMPTY));

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } 

    const myRestaurantResult = await restaurantProvider.retrieveMyRestaurantList(userId);
    return res.send(response(baseResponse.SUCCESS, myRestaurantResult));
};

/**
 * API No. 14
 * API Name : 특정 식당 편의정보 조회 API
 * [GET] /app/restaurants/:restaurantId/information
 * path vairable: restaurantId
 */
 exports.getRestaurantInfo = async function (req, res) {

    /**
     * Path varibale: restaurantId
     */

    const restaurantId = req.params.restaurantId;

    if (!restaurantId) return res.send(errResponse(baseResponse.RESTAURANT_ID_EMPTY));

    const restaurantInfoResult = await restaurantProvider.retrieveRestaurantInfo(restaurantId);
    return res.send(response(baseResponse.SUCCESS, restaurantInfoResult));
};

/**
 * API No. 15
 * API Name : 특정 식당 메뉴 조회 API
 * [GET] /app/restaurants/:restaurantId/menu
 * path vairable: restaurantId
 */
 exports.getRestaurantMenu = async function (req, res) {

    /**
     * Path varibale: restaurantId
     */

    const restaurantId = req.params.restaurantId;

    if (!restaurantId) return res.send(errResponse(baseResponse.RESTAURANT_ID_EMPTY));

    const restaurantMenuResult = await restaurantProvider.retrieveRestaurantMenu(restaurantId);
    return res.send(response(baseResponse.SUCCESS, restaurantMenuResult));
};
