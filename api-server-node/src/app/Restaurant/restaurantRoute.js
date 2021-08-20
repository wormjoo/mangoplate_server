module.exports = function(app){
    const restaurant = require('./restaurantController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 11. 식당 등록하기 API
    app.post('/app/restaurants/:userId', restaurant.postRestaurant);

};