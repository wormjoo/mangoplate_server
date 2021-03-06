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

  /**
 * API No. 26
 * API Name :가봤어요 수정 및 삭제 API
 * [PATCH] /app/visited/:visitedId
 * path variable : visitedId
 * body: content, public
 */
 exports.patchVisited = async function (req, res) {

  /**
   * jwt - userId
   * path variable: visitedId
   * body: content, public
   */
  const visitedId = req.params.visitedId;
  const content = req.body.content;
  let public = req.body.public;
  const userIdFromJWT = req.verifiedToken.userId;

  if (!visitedId) return res.send(errResponse(baseResponse.VISITED_ID_EMPTY));

  // 가고싶다 작성자만 수정할 수 있도록
  const userId = await visitedProvider.retrieveVisitedUser(visitedId);
  if (userIdFromJWT != userId) {
      res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
  } 

  const visitedResult = await visitedService.updateVisited(visitedId, content, public);
  return res.send(response(baseResponse.SUCCESS));
};

/**
 * API No. 28
 * API Name : 가봤어요 리스트 조회 API
 * [GET] /app/:userId/visited
 */
 exports.getVisited = async function (req, res) {

  /**
   * path variable: userId
   * Query string: area
   */
   const userId = req.params.userId;
   const area = req.query.area;

   if (!userId)
      return res.send(response(baseResponse.USER_ID_EMPTY));

  if (!area) {
    const getVisitedListResponse = await visitedProvider.retrieveVisitedList(userId);
    return res.send(response(baseResponse.SUCCESS, getVisitedListResponse));
  } else {
    const getVisitedListResponse = await visitedProvider.retrieveVisitedList(userId, area);
    return res.send(response(baseResponse.SUCCESS, getVisitedListResponse));
  }
};