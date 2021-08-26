module.exports = function(app){
    const visited = require('./visitedController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 25. 가봤어요 추가 API
    app.post("/app/visited/:restaurantId", jwtMiddleware, visited.postVisited);

    // 26. 가봤어요 수정 및 삭제 API
    app.patch("/app/visited/:visitedId", jwtMiddleware, visited.patchVisited);

    // 28. 가봤어요 리스트 조회 API
    app.get('/app/:userId/visited', visited.getVisited);
};