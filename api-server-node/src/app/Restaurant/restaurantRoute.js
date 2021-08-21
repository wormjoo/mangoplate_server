module.exports = function(app){
    const restaurant = require('./restaurantController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 10. 식당 등록하기 API
    app.post('/app/restaurants/:userId', restaurant.postRestaurant);

    // 11. 식당 조회 API
    app.get('/app/restaurants', restaurant.getRestaurants);

    // 16. 리뷰 작성 API
    app.post('/app/reviews', restaurant.postReview);


};