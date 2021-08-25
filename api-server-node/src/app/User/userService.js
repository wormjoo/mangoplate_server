const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createUser = async function (email, password, phoneNumber, nickname, profileImage) {
    try {
        // 이메일 중복 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const insertUserInfoParams = [email, hashedPassword, phoneNumber, nickname, profileImage];

        const connection = await pool.getConnection(async (conn) => conn);

        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


// TODO: After 로그인 인증 방법 (JWT)
exports.postSignIn = async function (email, password) {
    try {
        // 이메일 여부 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_WRONG);

        const selectEmail = emailRows[0].email

        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const selectUserPasswordParams = [selectEmail, hashedPassword];
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);

        if (passwordRows[0].password !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_WRONG);
        }

        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(email);

        if (userInfoRows[0].status === "N") {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        console.log(userInfoRows[0].id) // DB의 userId

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userInfoRows[0].id,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );

        const connection = await pool.getConnection(async (conn) => conn);
        const loginUserRows = await userProvider.loginCheck(userInfoRows[0].id);
  
        if (loginUserRows.length < 1) {
            const loginResult = await userDao.insertLogin(connection, userInfoRows[0].id, token);
        } else {
            const loginResult = await userDao.updateJwtToken(connection, userInfoRows[0].id, token);
        }
        
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.createFollower = async function (userId, followerId) {
    try {
        // 팔로우 존재 확인
        const followRows = await userProvider.followCheck(userId, followerId);
        if (followRows.length > 0) return errResponse(baseResponse.ALREADY_EXIST_FOLLOW);

        const insertFollowerParams = [userId, followerId];

        const connection = await pool.getConnection(async (conn) => conn);

        const followResult = await userDao.insertFollower(connection, insertFollowerParams);
        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        logger.error(`App - createFollower Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.cancleFollow = async function (userId, followerId) {
    try {
        // 팔로우 존재 확인
        const followRows = await userProvider.followCheck(userId, followerId);
        if (followRows.length == 0) {
            return errResponse(baseResponse.FOLLOW_NOT_EXIST);
        }

        const deleteFollowingParams = [userId, followerId];

        const connection = await pool.getConnection(async (conn) => conn);

        const followResult = await userDao.deleteFollow(connection, deleteFollowingParams);
        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        logger.error(`App - cancleFollow Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.withdraw = async function (id) {
    try {
        console.log(id)
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserStatus(connection, id);
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - withdraw Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.editUserName = async function (id, nickname) {
    try {
        console.log(id)
        const connection = await pool.getConnection(async (conn) => conn);
        const editNameResult = await userDao.updateUserName(connection, nickname, id);
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUserName Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.editUserPhoneNumber = async function (id, phoneNumber) {
    try {
        console.log(id)
        const connection = await pool.getConnection(async (conn) => conn);
        const editPhoneNumberResult = await userDao.updateUserPhoneNumber(connection, phoneNumber, id);
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUserPhoneNumber Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.editUserProfileImage = async function (id, profileImage) {
    try {
        console.log(id)
        const connection = await pool.getConnection(async (conn) => conn);
        const editProfileImageResult = await userDao.updateUserProfileImage(connection, profileImage, id);
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUserProfileImage Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.holicBadge = async function (id, holic) {
    try {
        console.log(id)
        const connection = await pool.getConnection(async (conn) => conn);
        const editHolicResult = await userDao.updateUserHolic(connection, id, holic);
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - holicBadge Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.patchJwtStatus = async function (userId) {
    try {

      const loginUserRow = await userProvider.loginCheck(userId);
  
      if (loginUserRow.length < 1)
        return errResponse(baseResponse.LOGIN_NOT_EXIST);
      if (loginUserRow[0].status == 'O')
        return errResponse(baseResponse.LOGIN_NOT_EXIST);
  
      const connection = await pool.getConnection(async (conn) => conn);
      const userIdResult = await userDao.updateJwtStatus(connection, userId);
      connection.release();
  
      return response(baseResponse.SUCCESS);
    } catch (err) {
      logger.error(`App - Logout Service error\n: ${err.message}`);
      return errResponse(baseResponse.DB_ERROR);
    }
  };