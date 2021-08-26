const jwtMiddleware = require("../../../config/jwtMiddleware");
const wannaGoProvider = require("../WannaGo/wannaGoProvider");
const wannaGoService = require("../WannaGo/wannaGoService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");



/**
 * API No. 23
 * API Name : 가고싶다 추가 및 삭제
 * [POST] /app/wanna-go/:restaurantId
 */
 exports.postStar = async function (req, res) {
    /**
     * jwt - userId
     * path variable : restaurantId
     * body: userId
     */
    const restaurantId = req.params.restaurantId;
    const userId = req.body.userId;
    const userIdFromJWT = req.verifiedToken.userId;
  
    if (!restaurantId)
      return res.send(response(baseResponse.RESTAURANT_ID_EMPTY));

    if (!userId)
      return res.send(response(baseResponse.USER_ID_EMPTY));

    if (userIdFromJWT != userId) {
      res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } 
  
    const postStarResponse = await wannaGoService.pressStar(restaurantId, userId);
    return res.send(postStarResponse);
  };

/**
 * API No. 24
 * API Name : 가고싶다 리스트 조회 API 
 * [GET] /app/:userId/wanna-go
 */
 exports.getWannaGoList = async function (req, res) {

  /**
   * path variable: userId
   * Query string: area
   */
   const userId = req.params.userId;
   const area = req.query.area;

   if (!userId)
      return res.send(response(baseResponse.USER_ID_EMPTY));

  if (!area) {
    const getStarListResponse = await wannaGoProvider.retrieveStarList(userId);
    return res.send(response(baseResponse.SUCCESS, getStarListResponse));
  } else {
    const getStarListResponse = await wannaGoProvider.retrieveStarList(userId, area);
    return res.send(response(baseResponse.SUCCESS, getStarListResponse));
  }
};