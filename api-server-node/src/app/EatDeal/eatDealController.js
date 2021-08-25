const jwtMiddleware = require("../../../config/jwtMiddleware");
const eatDealProvider = require("../EatDeal/eatDealProvider");
const eatDealService = require("../EatDeal/eatDealService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 29
 * API Name : 잇딜 리스트 조회 API
 * [GET] /app/eat-deal
 */
 exports.getEatDeals = async function (req, res) {

    /**
    * Query String: area
    */

    const area = req.query.area;

    const eatDealListResult = await eatDealProvider.retrieveEatDealList(area);
    
    return res.send(response(baseResponse.SUCCESS, eatDealListResult));
};

/**
 * API No. 30
 * API Name : 특정 잇딜 조회 API
 * [GET] /app/eat-deal/:ealDealId
 * Path variable: eatDealId
 */
 exports.getEatDeal = async function (req, res) {

    /**
    * Path variable: eatDealId
    */

    const eatDealId = req.params.eatDealId;

    if (!eatDealId) return res.send(response(baseResponse.EATDEAL_ID_EMPTY));

    const detailEatDealResult = await eatDealProvider.retrieveEatDeal(eatDealId);
    
    return res.send(response(baseResponse.SUCCESS, detailEatDealResult));
};
