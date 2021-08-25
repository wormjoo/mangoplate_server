const jwtMiddleware = require("../../../config/jwtMiddleware");
const eatDealProvider = require("../EatDeal/eatDealProvider");
const eatDealService = require("../EatDeal/eatDealService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 29
 * API Name : 잇딜 리스트 조회 API
 * [GET] app/eat-deal
 */
 exports.getEatDeals = async function (req, res) {

    /**
    * Query String: area
    */

    const area = req.query.area;

    const eatDealListResult = await eatDealProvider.retrieveEatDealList(area);
    return res.send(response(baseResponse.SUCCESS, eatDealListResult));
};
