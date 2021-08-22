const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regExpPassword = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,12}$/; // 비밀번호 조합 및 길이 체크 정규식(최소 6 ~ 12자, 영문, 숫자 포함)
const regexEmail = require("regex-email");
const {emit} = require("nodemon");

const passport = require('passport')
const KakaoStrategy = require('passport-kakao').Strategy
const axios = require('axios')

/**
 * API No. 1
 * API Name : 이메일 조회 API 
 * [GET] /app/users/emails
 */
 exports.getUserByEmail = async function (req, res) {

    /**
     * Query String: email
     */
    const email = req.query.email;

    const userEmailResult = await userProvider.emailCheck(email);
    if (!userEmailResult[0]) {
        return res.send(response(baseResponse.SUCCESS));
    } else {
        return res.send(response(baseResponse.SIGNUP_REDUNDANT_EMAIL));
    }
};

/**
 * API No. 2
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {

    /**
     * Body: email, password, phoneNumber, nickname, profileImage
     */
    let {email, password, phoneNumber, nickname, profileImage} = req.body;

    if (!profileImage)
        profileImage = 'https://cdn.pixabay.com/photo/2018/11/13/21/43/instagram-3814049_1280.png';

    /** 
    // 이메일 빈 값 체크
    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    // 이메일 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // 이메일 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // 비밀번호 빈 값 체크
    if (!password)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));

    // 비밀번호 길이 체크
    if (password.length > 30)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));

    // 비밀번호 형식 체크 (by 정규표현식)
    if (!regExpPassword.test(password))
        return res.send(response(baseResponse.SIGNUP_PASSWORD_ERROR_TYPE));

    **/

    const signUpResponse = await userService.createUser(
        email,
        password,
        phoneNumber,
        nickname,
        profileImage
    );

    return res.send(signUpResponse);
};

/**
 * API No. 3
 * API Name : 유저 조회 (친구찾기) API (+ 닉네임으로 검색) 
 * [GET] /app/users
 */
exports.getUserByNickname = async function (req, res) {

    /**
     * Query String: nickname
     */
    const nickname = req.query.nickname;

    if (!nickname) { // 닉네임 빈값
        return res.send(response(baseResponse.USER_NICKNAME_EMPTY));
    } else {
        // 유저 검색 조회
        const userListByNickname = await userProvider.retrieveUserListByNickname(nickname);
        if (userListByNickname[0] == undefined) {
            return res.send(response(baseResponse.USER_NICKNAME_NOT_EXIST));
          }
        return res.send(response(baseResponse.SUCCESS, userListByNickname));
    }
};

/**
 * API No. 4
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */
exports.getUserById = async function (req, res) {

    /**
     * Path Variable: id
     */
    const id = req.params.id;

    if (!id) return res.send(errResponse(baseResponse.USER_ID_EMPTY));

    const userByUserId = await userProvider.retrieveUser(id);
    return res.send(response(baseResponse.SUCCESS, userByUserId));
};


/**
 * API No. 5
 * API Name : 로그인 하기 API
 * [POST] /app/login
 * body : email, passsword
 */
exports.login = async function (req, res) {

    const {email, password} = req.body;

    // TODO: email, password 형식적 Validation

    const signInResponse = await userService.postSignIn(email, password);

    return res.send(signInResponse);
};

/**
 * API No. 6
 * API Name : 홀릭 배지 생성 API
 * [PATCH] /app/holic/:userId
 * path variable : userId
 * body : holic
 */
 exports.patchHolic = async function (req, res) {

    // jwt - userId, path variable :userId

    //const userIdFromJWT = req.verifiedToken.userId;

    const userId = req.params.userId;
    let holic = req.body.holic;

    if (!userId) return res.send(response(baseResponse.USER_ID_EMPTY));

    if (holic == "black") {
        holic = 3;
    } else if (holic == "red") {
        holic = 2;
    } else {
        return res.send(response(baseResponse.HOLIC_BADGE_ERROR_TYPE));
    }

    //if (userIdFromJWT != userId) {
    //    res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    //} 
    const userHolicResponse = await userService.holicBadge(userId, holic);
    return res.send(userHolicResponse);
};

/**
 * API No. 7
 * API Name : 카카오 소셜로그인2 (인증)API
 * [POST] /kakao/login
 * body : accessToken
 */
 exports.kakaoSignIn = async function (req, res) {

    const {accessToken} = req.body;
    let kakao_profile;

    // password 빈 값 체크
    if (!accessToken)
        return res.send(response(baseResponse.SIGNIN_TOKEN_EMPTY));

    kakao_profile = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        }
    })

    console.log(kakao_profile);
    console.log(kakao_profile.data.kakao_account.email);

    const email = kakao_profile.data.kakao_account.email;
    const nickname = kakao_profile.data.properties.nickname;
    const profileImage = kakao_profile.data.kakao_account.profile.profile_image_url;
    const password = 'kakaologin';
    const phoneNumber = '01000000000';

    const emailRows = await userProvider.emailCheck(email);

    if (emailRows.length == 0) {
        const kakaoSignUpResponse = await userService.createUser(
            email,
            password,
            phoneNumber,
            nickname,
            profileImage
        );
        const kakaoSignInResponse = await userService.postSignIn(email, password);
        return res.send(kakaoSignInResponse);
    }
    else if (userIdRows.length > 0) {
        const kakaoSignInResponse = await userService.postSignIn(email, password);
        return res.send(kakaoSignInResponse);
    }
};

/**
 * API No. 9
 * API Name : 회원 탈퇴 API
 * [PATCH] /app/withdraw/:userId
 * path variable : userId
 */
 exports.withdrawal = async function (req, res) {

    // jwt - userId, path variable :userId

    //const userIdFromJWT = req.verifiedToken.userId;

    const userId = req.params.userId;

    //if (userIdFromJWT != userId) {
    //    res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    //} 
    const userWithdraw = await userService.withdraw(userId);
    return res.send(userWithdraw);
};

/**
 * API No. 32
 * API Name : 팔로우 추가 API
 * [POST] /app/followers
 */
 exports.postFollower = async function (req, res) {

    /**
     * Body: userId, followerId
     */
    const {userId, followerId} = req.body;

    if (!userId) return res.send(errResponse(baseResponse.USER_ID_EMPTY));
    if (!followerId) return res.send(errResponse(baseResponse.FOLLOWER_ID_EMPTY));

    const addFollowerResponse = await userService.createFollower(userId, followerId);

    return res.send(addFollowerResponse);
};

/**
 * API No. 33
 * API Name : 팔로우 취소 API
 * [DELETE] /app/follower/:followerId
 */
 exports.deleteFollow = async function (req, res) {

    /**
     * Query String: userId
     */
    const followerId = req.params.followerId;
    const userId = req.query.userId;

    if (!userId) return res.send(response(baseResponse.USER_ID_EMPTY));
    if (!followerId) return res.send(response(baseResponse.FOLLOWER_ID_EMPTY));

    const deleteFollowing = await userService.cancleFollow(userId, followerId);
    return res.send(response(deleteFollowing));
};

/**
 * API No. 34
 * API Name : 팔로워 조회 API
 * [GET] /app/followers
 */
 exports.getFollowers = async function (req, res) {

    /**
     * Query String: userId
     */
    const userId = req.query.userId;

    if (!userId) return res.send(response(baseResponse.USER_ID_EMPTY));

    const userListByFollower = await userProvider.retrieveFollowerUserList(userId);
    return res.send(response(baseResponse.SUCCESS, userListByFollower));
};

/**
 * API No. 35
 * API Name : 팔로잉 조회 API
 * [GET] /app/following
 */
 exports.getFollowings = async function (req, res) {

    /**
     * Query String: userId
     */
    const userId = req.query.userId;

    if (!userId) return res.send(response(baseResponse.USER_ID_EMPTY));

    const userListByFollowing = await userProvider.retrieveFollowingUserList(userId);
    return res.send(response(baseResponse.SUCCESS, userListByFollowing));
};

/**
 * API No. 44
 * API Name : 유저 정보 수정 (닉네임) API
 * [PATCH] /app/:userId/name
 * path variable : userId
 */
 exports.patchName = async function (req, res) {

    // jwt - userId, path variable :userId
    // body : nickname

    //const userIdFromJWT = req.verifiedToken.userId;

    const userId = req.params.userId;
    const nickname = req.body.nickname;

    //if (userIdFromJWT != userId) {
    //    res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    //} 
    const editUserNameResult = await userService.editUserName(userId, nickname);
    return res.send(editUserNameResult);
};

/**
 * API No. 45
 * API Name : 유저 정보 수정 (전화번호) API
 * [PATCH] /app/:userId/phone-number
 * path variable : userId
 */
 exports.patchPhoneNumber = async function (req, res) {

    // jwt - userId, path variable :userId
    // body : nickname

    //const userIdFromJWT = req.verifiedToken.userId;

    const userId = req.params.userId;
    const phoneNumber = req.body.phoneNumber;

    //if (userIdFromJWT != userId) {
    //    res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    //} 
    const editUserPhoneNumberResult = await userService.editUserPhoneNumber(userId, phoneNumber);
    return res.send(editUserPhoneNumberResult);
};

/**
 * API No. 47
 * API Name : 유저 정보 수정 (프로필이미지) API
 * [PATCH] /app/:userId/profile-image
 * path variable : userId
 */
 exports.patchProfileImage = async function (req, res) {

    // jwt - userId, path variable :userId
    // body : nickname

    //const userIdFromJWT = req.verifiedToken.userId;

    const userId = req.params.userId;
    const profileImage = req.body.profileImage;

    //if (userIdFromJWT != userId) {
    //    res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    //} 
    const editUserProfileImageResult = await userService.editUserProfileImage(userId, profileImage);
    return res.send(editUserProfileImageResult);
};