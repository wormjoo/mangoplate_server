const jwtMiddleware = require("../../../config/jwtMiddleware");
const restaurantProvider = require("../Restaurant/restaurantProvider");
const restaurantService = require("../Restaurant/restaurantService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 10
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

/**
 * API No. 11
 * API Name : 식당 조회 API 
 * [GET] /app/restaurants
 */
exports.getRestaurants = async function (req, res) {

    /**
     * Query String: restaurantId
     */
    const restaurantId = req.query.restaurantId;

    if (!restaurantId) {
        // 식당 전체 조회
        const restaurantListResult = await restaurantProvider.retrieveRestaurantList();
        return res.send(response(baseResponse.SUCCESS, restaurantListResult));
    } else {
        // 식당 검색 조회
        const restaurantListByName = await restaurantProvider.retrieveRestaurantList(restaurantId);
        return res.send(response(baseResponse.SUCCESS, restaurantListByName));
    }
};

/**
 * API No. 16
 * API Name : 리뷰 작성 API
 * [POST] /app/reviews
 * body : userId, restaurantId, reviewImage, evaluation, content
 */
 exports.postReview = async function (req, res) {

    /**
     * Body: userId, restaurantId, reviewImage, evaluation, content
     */

    let {userId, restaurantId, reviewImage, evaluation, content} = req.body;

    // 이미지 첨부 안 하면 null로
    if (!reviewImage) {
        reviewImage = null;
    }

    // 평가도 점수로 변환
    if (evaluation == '맛있다!') {
        evaluation = 5;
    } else if (evaluation == '괜찮다') {
        evaluation = 3;
    } else if (evaluation == '별로') {
        evaluation = 1;
    }

    // 리뷰 내용 길이 체크
    if (content.length > 10000) {
        return res.send(response(baseResponse.REVIEW_CONTENT_LENGTH));
    }

    const writeReviewResponse = await restaurantService.writeReview(
        userId, 
        restaurantId, 
        reviewImage, 
        evaluation, 
        content
    );

    return res.send(writeReviewResponse);
};

/**
 * API No. 17
 * API Name : 특정 식당 리뷰 조회 API 
 * [GET] /app/reviews/:restaurantId
 * path variable : restaurantId
 */
 exports.getReview = async function (req, res) {

    /**
     * path variable : restaurantId
     */
    const restaurantId = req.params.restaurantId;

    if (!restaurantId) return res.send(errResponse(baseResponse.RESTAURANT_ID_EMPTY));

    const reviewByRestaurant = await restaurantProvider.retrieveReview(restaurantId);
    return res.send(response(baseResponse.SUCCESS, reviewByRestaurant));
};