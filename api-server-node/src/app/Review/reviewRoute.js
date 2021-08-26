module.exports = function(app){
    const review = require('./reviewController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 16. 리뷰 작성 API
    app.post('/app/reviews', jwtMiddleware, review.postReview);

    // 17. 특정 식당 리뷰 조회 API
    app.get('/app/reviews/:restaurantId', review.getReviews);

    // 18. 특정 리뷰 조회 API
    app.get('/app/restaurants/reviews/:reviewId', review.getReview);

    // 19. 리뷰 수정 및 삭제 API
    app.patch('/app/restaurants/reviews/:reviewId', jwtMiddleware, review.patchReview);

    // 20. 댓글 작성 API
    app.post('/app/comments/:reviewId', jwtMiddleware, review.postComment);

    // 21. 특정 리뷰 댓글 조회 API
    app.get('/app/comments/:reviewId', review.getComments);

    // 22. 댓글 수정 및 삭제 API
    app.patch('/app/comments/:commentId', jwtMiddleware, review.patchComment);

    // 36. 리뷰 좋아요 API
    app.post('/app/likes/:reviewId', jwtMiddleware, review.postLike);

    // 37. 특정 리뷰 좋아요 누른 유저 조회 API
    app.get('/app/likes/:reviewId', review.getLikeUsers);

    // 50. 소식 리스트 조회 API
    app.get('/app/news', review.getNews);
    
};