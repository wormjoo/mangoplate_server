module.exports = function(app){
    const restaurant = require('./restaurantController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 10. 식당 등록하기 API
    app.post('/app/restaurants/:userId', restaurant.postRestaurant);

    // 11. 식당 조회 API
    app.get('/app/restaurants', restaurant.getRestaurants);

    // 12. 특정 식당 조회 API
    app.get('/app/restaurants/:restaurantId', restaurant.getRestaurant);

    // 13. 내가 등록한 식당 조회 API
    app.get('/app/:userId/restaurants', restaurant.getMyRestaurants);

    // 14. 특정 식당 편의정보 조회 API
    app.get('/app/restaurants/:restaurantId/information', restaurant.getRestaurantInfo);

    // 15. 특정 식당 메뉴 조회 API
    app.get('/app/restaurants/:restaurantId/menu', restaurant.getRestaurantMenu);

    // 16. 리뷰 작성 API
    app.post('/app/reviews', restaurant.postReview);

    // 17. 특정 식당 리뷰 조회 API
    app.get('/app/reviews/:restaurantId', restaurant.getReviews);

    // 18. 특정 리뷰 조회 API
    app.get('/app/restaurants/reviews/:reviewId', restaurant.getReview);

};