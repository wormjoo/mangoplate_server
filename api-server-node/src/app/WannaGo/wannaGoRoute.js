module.exports = function(app){
    const wannaGo = require('./wannaGoController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 23. 가고싶다 추가 및 삭제
    app.post('/app/wanna-go/:restaurantId', jwtMiddleware, wannaGo.postStar);

    // 24. 가고싶다 리스트 조회 API
    app.get('/app/:userId/wanna-go', wannaGo.getWannaGoList);

};