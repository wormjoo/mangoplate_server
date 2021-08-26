const jwtMiddleware = require("../../../config/jwtMiddleware");
const eatDealProvider = require("../EatDeal/eatDealProvider");
const eatDealService = require("../EatDeal/eatDealService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const { O_DIRECTORY } = require("constants");

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

    if (!area) {
        // 전체 지역 조회
        const eatDealListResult = await eatDealProvider.retrieveEatDealList();
        return res.send(response(baseResponse.SUCCESS, eatDealListResult));
    } else {
        const eatDealListResult = await eatDealProvider.retrieveEatDealList(area);
        return res.send(response(baseResponse.SUCCESS, eatDealListResult));
    }
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

/**
 * API No. 51
 * API Name : 잇딜 구매하기 API 
 * [POST] /app/:eatDealId/purchase
 * path variable: eatDealId
 */
 exports.postPurchase = async function (req, res) {
    /**
     * jwt - userId
     * Body: userId, quantity, payMethod
     * paht variable: eatDealId
     */

    const userIdFromJWT = req.verifiedToken.userId;
    console.log(1);
    const userId = req.body.userId;
    const quantity = req.body.quantity;
    const payMethod = req.body.payMethod;
    const eatDealId = req.params.eatDealId;

    if(!userId) return res.send(response(baseResponse.USER_ID_EMPTY));
    if(!quantity) return res.send(response(baseResponse.QUANTITY_EMPTY));
    if(!payMethod) return res.send(response(baseResponse.PAYMENT_METHOD_EMPTY));
    if(!eatDealId) return res.send(response(baseResponse.EATDEAL_ID_EMPTY));

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } 
    
    const purchaseEatDeal = await eatDealService.createPurchase(
        eatDealId, 
        userId, 
        quantity, 
        payMethod
    );
    return res.send(purchaseEatDeal);
};

/**
 * API No. 52
 * API Name : 잇딜 구매 취소하기 API
 * [PATCH] /app/purchase/:purchaseId
 * path variable : purchaseId
 */
 exports.updatePurchase = async function (req, res) {

    /**
     * jwt - userId
     * path variable: purchaseId
     */
    const purchaseId = req.params.purchaseId;
    const userIdFromJWT = req.verifiedToken.userId;

    if (!purchaseId) return res.send(errResponse(baseResponse.PURCHASE_ID_EMPTY));

    // 잇딜 구매자만 취소할 수 있도록
    const userId = await eatDealProvider.retrievePurchaseUser(purchaseId);
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } 

    const editPurchase = await eatDealService.updatePurchase(purchaseId);
    return res.send(response(baseResponse.SUCCESS));
};

/**
 * API No. 53
 * API Name : 주문 목록 조회 API
 * [GET] /app/:eatDealId/purchase
 * path variable : eatDealId
 */
exports.getOrderList = async function (req, res) {

    /**
     * jwt - userId
     * path variable: eatDealId
     * body: userId
     */
    const eatDealId = req.params.eatDealId;
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.body.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_ID_EMPTY));
    if (!eatDealId) return res.send(errResponse(baseResponse.EATDEAL_ID_EMPTY));

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    const orderListResult = await eatDealProvider.getOrderList(eatDealId);
    return res.send(response(baseResponse.SUCCESS, orderListResult));
};