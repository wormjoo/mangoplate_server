const jwtMiddleware = require("../../../config/jwtMiddleware");
const visitedProvider = require("../Visited/visitedProvider");
const visitedService = require("../Visited/visitedService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 25
 * API Name : 가봤어요 추가 API
 * [POST] /app/visited/:restaurantId
 */
 exports.postVisited = async function (req, res) {
    /**
     * path variable : restaurantId
     * Body : userId, content, public
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const restaurantId = req.params.restaurantId;
    const userId = req.body.userId;
    let content = req.body.content;
    let public = req.body.public;
  
    if (!restaurantId)
      return res.send(response(baseResponse.RESTAURANT_ID_EMPTY));
    if (!content) content = "";
    if (!public) public = 'O';

    if (content.length > 50) {
        return res.send(response(baseResponse.VISITED_CONTENT_LENGTH));
    }

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } 
  
    const postVisitedResponse = await visitedService.createVisited(userId, restaurantId, content, public);
    return res.send(postVisitedResponse);
  };