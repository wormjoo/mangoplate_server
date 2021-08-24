const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const reviewProvider = require("./reviewProvider");
const reviewDao = require("./reviewDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.writeReview = async function (userId, restaurantId, image, evaluation, content) {
    try {
        insertReviewParams = [userId, restaurantId, evaluation, content];
        
        const connection = await pool.getConnection(async (conn) => conn);

        if (image == null) {
            const reviewResult = await reviewDao.insertReview(connection, insertReviewParams);
            console.log(`추가된 리뷰 : ${reviewResult[0].insertId}`);
        } else {
            const reviewResult = await reviewDao.insertReview(connection, insertReviewParams);
            imageParams = [restaurantId, reviewResult[0].insertId, image];
            const imageResult = await reviewDao.insertImage(connection, imageParams);
            console.log(`추가된 리뷰 : ${reviewResult[0].insertId}`);
        }
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - writeReview Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.updateReview = async function (reviewId, content, evaluation) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
                
        if (!content && !evaluation) {
            // 리뷰 삭제
            const deleteReview = await reviewDao.updateReviewStatus(connection, reviewId);
        } else {
            // 리뷰 수정
            const editReview = await reviewDao.updateReviewContent(connection, reviewId, content, evaluation);;
        }
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - updateReview Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.writeComment = async function (reviewId, userId, content) {
    try {
        insertCommentParams = [reviewId, userId, content];
        
        const connection = await pool.getConnection(async (conn) => conn);

        const insertCommentResult = await reviewDao.insertReviewComment(connection, insertCommentParams);
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - writeComment Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.updateComment = async function (commentId, content) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const commentCheck = await reviewDao.selectComment(connection, commentId);
        if(commentCheck.length < 1) {
            return errResponse(baseResponse.COMMENT_NOT_EXIST);
        }
                
        if (!content) {
            // 댓글 삭제
            const deleteComment = await reviewDao.updateCommentStatus(connection, commentId);
        } else {
            // 댓글 수정
            const editComment = await reviewDao.updateCommentContent(connection, commentId, content);;
        }
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - updateComment Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.pressLike = async function (reviewId, userId) {
    try {        
        const connection = await pool.getConnection(async (conn) => conn);

        const likeCheck = await reviewDao.selectLike(connection, reviewId, userId);

        if(likeCheck.length < 1) {
            const addLike = await reviewDao.insertLike(connection, reviewId, userId);
        } else {
            if (likeCheck[0].status == 'Y') {
                status = 'N'
            } else {
                status = 'Y'
            }
            const addLike = await reviewDao.updateLike(connection, likeCheck[0].id, status);
        }
        
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - pressLike Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};