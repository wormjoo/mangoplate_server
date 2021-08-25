module.exports = function(app){
    const eatDeal = require('./eatDealController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 29. 잇딜 리스트 조회 API
    app.get('/app/eat-deal', eatDeal.getEatDeals);

    // 30. 특정 잇딜 조회 API
    app.get('/app/eat-deal/:eatDealId', eatDeal.getEatDeal);

};