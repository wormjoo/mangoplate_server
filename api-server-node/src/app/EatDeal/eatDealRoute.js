module.exports = function(app){
    const eatDeal = require('./eatDealController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 29. 잇딜 리스트 조회 API
    app.get('/app/eat-deal', eatDeal.getEatDeals);

    // 30. 특정 잇딜 조회 API
    app.get('/app/eat-deal/:eatDealId', eatDeal.getEatDeal);

    // 51. 잇딜 구매하기 API
    app.post('/app/:eatDealId/purchase', jwtMiddleware, eatDeal.postPurchase);

    // 52. 잇딜 구매 취소하기 API
    app.patch('/app/purchase/:purchaseId', jwtMiddleware, eatDeal.updatePurchase);

    // 53. 주문 목록 조회 API
    app.get('/app/:eatDealId/purchase', jwtMiddleware, eatDeal.getOrderList);
};