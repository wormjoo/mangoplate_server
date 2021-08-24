const jwtMiddleware = require("../../../config/jwtMiddleware");
const reviewProvider = require("../Review/reviewProvider");
const reviewService = require("../Review/reviewService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 16
 * API Name : 리뷰 작성 API
 * [POST] /app/reviews
 * body : userId, restaurantId, reviewImage, evaluation, content
 */
 exports.postReview = async function (req, res) {

    /**
     * Body: userId, restaurantId, reviewImage, evaluation, content
     */

    let {userId, restaurantId, reviewImage, evaluation, content} = req.body;

    // 이미지 첨부 안 하면 null로
    if (!reviewImage) {
        reviewImage = null;
    }

    // 평가도 점수로 변환
    if (evaluation == '맛있다!') {
        evaluation = 5;
    } else if (evaluation == '괜찮다') {
        evaluation = 3;
    } else if (evaluation == '별로') {
        evaluation = 1;
    }

    // 리뷰 내용 길이 체크
    if (content.length > 10000) {
        return res.send(response(baseResponse.REVIEW_CONTENT_LENGTH));
    }

    const writeReviewResponse = await reviewService.writeReview(
        userId, 
        restaurantId, 
        reviewImage, 
        evaluation, 
        content
    );

    return res.send(writeReviewResponse);
};

/**
 * API No. 17
 * API Name : 특정 식당 리뷰 조회 API 
 * [GET] /app/reviews/:restaurantId
 * path variable : restaurantId
 */
 exports.getReviews = async function (req, res) {

    /**
     * path variable : restaurantId
     */
    const restaurantId = req.params.restaurantId;

    if (!restaurantId) return res.send(errResponse(baseResponse.RESTAURANT_ID_EMPTY));

    const reviewByRestaurant = await reviewProvider.retrieveReviewList(restaurantId);
    return res.send(response(baseResponse.SUCCESS, reviewByRestaurant));
};

/**
 * API No. 18
 * API Name : 특정 리뷰 조회 API 
 * [GET] /app/restaurants/reviews/:reviewId
 * path variable : reviewId
 */
 exports.getReview = async function (req, res) {

    /**
     * path variable: reviewId
     */
    const reviewId = req.params.reviewId;

    if (!reviewId) return res.send(errResponse(baseResponse.REVIEW_ID_EMPTY));

    const reviewResult = await reviewProvider.retrieveReview(reviewId);
    return res.send(response(baseResponse.SUCCESS, reviewResult));
};

/**
 * API No. 19
 * API Name : 리뷰 수정 및 삭제 API
 * [GET] /app/restaurants/reviews/:reviewId
 * path variable : reviewId
 * body: content, evaluation
 */
 exports.patchReview = async function (req, res) {

    /**
     * path variable: reviewId
     * body: content, evaluation
     */
    const reviewId = req.params.reviewId;
    const content = req.body.content;
    let evaluation = req.body.evaluation;

    // 평가도 점수로 변환
    if (evaluation == '맛있다!') {
        evaluation = 5;
    } else if (evaluation == '괜찮다') {
        evaluation = 3;
    } else if (evaluation == '별로') {
        evaluation = 1;
    }

    if (!reviewId) return res.send(errResponse(baseResponse.REVIEW_ID_EMPTY));

    const reviewResult = await reviewService.updateReview(reviewId, content, evaluation);
    return res.send(response(baseResponse.SUCCESS));
};

/**
 * API No. 20
 * API Name : 댓글 작성 API
 * [POST] /app/comments/:reviewId
 * path variable: reviewId
 * body: userId, content
 */
 exports.postComment = async function (req, res) {

    /**
     * path variable: reviewId
     * body: userId, content
     */

    const reviewId = req.params.reviewId;
    const userId = req.body.userId;
    const content = req.body.content;

    const reviewCommentResult = await reviewService.writeComment(reviewId, userId, content);
    return res.send(response(baseResponse.SUCCESS));
};

/**
 * API No. 21
 * API Name : 특정 리뷰 댓글 조회 API
 * [POST] /app/comments/:reviewId
 * path variable: reviewId
 */
 exports.getComments = async function (req, res) {

    /**
     * path variable: reviewId
     */

    const reviewId = req.params.reviewId;

    if (!reviewId) return res.send(errResponse(baseResponse.REVIEW_ID_EMPTY));

    const reviewCommentsResult = await reviewProvider.retrieveCommentList(reviewId);
    return res.send(response(baseResponse.SUCCESS, reviewCommentsResult));
};

/**
 * API No. 22
 * API Name : 댓글 수정 및 삭제 API
 * [PATCH] /app/comments/:commentId
 * path variable : commentId
 * body: content
 */
 exports.patchComment = async function (req, res) {

    /**
     * path variable: commentId
     * body: content
     */
    const commentId = req.params.commentId;
    const content = req.body.content;

    if (!commentId) return res.send(errResponse(baseResponse.COMMENT_ID_EMPTY));

    const commentResult = await reviewService.updateComment(commentId, content);
    return res.send(response(commentResult));
};