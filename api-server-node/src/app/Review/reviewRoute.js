module.exports = function(app){
    const review = require('./reviewController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 16. 리뷰 작성 API
    app.post('/app/reviews', review.postReview);

    // 17. 특정 식당 리뷰 조회 API
    app.get('/app/reviews/:restaurantId', review.getReviews);

    // 18. 특정 리뷰 조회 API
    app.get('/app/restaurants/reviews/:reviewId', review.getReview);

    // 19. 리뷰 수정 및 삭제 API
    app.patch('/app/restaurants/reviews/:reviewId', review.patchReview);

    // 20. 댓글 작성 API
    app.post('/app/comments/:reviewId', review.postComment);

    // 21. 특정 리뷰 댓글 조회 API
    app.get('/app/comments/:reviewId', review.getComments);

    // 22. 댓글 수정 및 삭제 API
    app.patch('/app/comments/:commentId', review.patchComment);
    
};