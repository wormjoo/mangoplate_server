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

const Cache = require('memory-cache');
const CryptoJS = require('crypto-js');

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

    if (!email) {
        return res.send(response(baseResponse.EMAIL_EMPTY));
    }

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
        return res.send(response(baseResponse.NICKNAME_EMPTY));
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
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_ID_EMPTY));

    const userByUserId = await userProvider.retrieveUser(userId);
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

    // path variable :userId

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
    else if (emailRows.length > 0) {
        const kakaoSignInResponse = await userService.postSignIn(email, password);
        return res.send(kakaoSignInResponse);
    }
};

/**
 * API No. 8
 * API Name : 로그아웃 API
 * [PATCH] /app/logout
 */
 exports.logout = async function (req, res) {
    // jwt - userId

    const userIdFromJWT = req.verifiedToken.userId;
  
    const logoutResponse = await userService.patchJwtStatus(userIdFromJWT);
  
    return res.send(logoutResponse);
  };

/**
 * API No. 9
 * API Name : 회원 탈퇴 API
 * [PATCH] /app/withdraw/:userId
 * path variable : userId
 */
 exports.withdrawal = async function (req, res) {

    // jwt - userId, path variable :userId

    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_ID_EMPTY));

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } 
    const userWithdraw = await userService.withdraw(userId);
    return res.send(userWithdraw);
};

/**
 * API No. 32
 * API Name : 팔로우 추가 API
 * [POST] /app/followers
 */
 exports.postFollower = async function (req, res) {

    // jwt - userId

    /**
     * Body: userId, followerId
     */
    const {userId, followerId} = req.body;
    const userIdFromJWT = req.verifiedToken.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_ID_EMPTY));
    if (!followerId) return res.send(errResponse(baseResponse.FOLLOWER_ID_EMPTY));

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } 

    const addFollowerResponse = await userService.createFollower(userId, followerId);

    return res.send(addFollowerResponse);
};

/**
 * API No. 33
 * API Name : 팔로우 취소 API
 * [DELETE] /app/follower/:followerId
 */
 exports.deleteFollow = async function (req, res) {

    // jwt - userId

    /**
     * Query String: userId
     */
    const followerId = req.params.followerId;
    const userId = req.query.userId;
    const userIdFromJWT = req.verifiedToken.userId;

    if (!userId) return res.send(response(baseResponse.USER_ID_EMPTY));
    if (!followerId) return res.send(response(baseResponse.FOLLOWER_ID_EMPTY));

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } 

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

    const userId = req.params.userId;
    const nickname = req.body.nickname;
    const userIdFromJWT = req.verifiedToken.userId;

    if (!userId) {
        return res.send(response(baseResponse.USER_ID_EMPTY));
    }

    if (!nickname) {
        return res.send(response(baseResponse.NICKNAME_EMPTY));
    }

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } 
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

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const phoneNumber = req.body.phoneNumber;

    if (!userId) {
        return res.send(response(baseResponse.USER_ID_EMPTY));
    }

    if (!phoneNumber) {
        return res.send(response(baseResponse.PHONE_NUMBER_EMPTY));
    }

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } 
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

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const profileImage = req.body.profileImage;

    if (!userId) {
        return res.send(response(baseResponse.USER_ID_EMPTY));
    }

    if (!profileImage) {
        return res.send(response(baseResponse.PROFILE_IMAGE_EMPTY));
    }

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } 
    const editUserProfileImageResult = await userService.editUserProfileImage(userId, profileImage);
    return res.send(editUserProfileImageResult);
};

/**
 * API No. 49
 * API Name : 휴대폰 인증 번호 발송 API
 * Body : phoneNumber
 */
 const NCP_serviceID = 'ncp:sms:kr:271191359133:mangoplate_project';
 const NCP_accessKey = 'N4Bj3MzJL8wNwWqK4aVQ';
 const NCP_secretKey = '2gomYuV0n7wRpJcQqR66WNEpKaBzNEV9VCXQsOJj';
 const date = Date.now().toString();
const uri = NCP_serviceID;
const secretKey = NCP_secretKey;
const accessKey = NCP_accessKey;
const method = 'POST';
const space = " ";
const newLine = "\n";
const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
const url2 = `/sms/v2/services/${uri}/messages`;

const  hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);

hmac.update(method);
hmac.update(space);
hmac.update(url2);
hmac.update(newLine);
hmac.update(date);
hmac.update(newLine);
hmac.update(accessKey);

const hash = hmac.finalize();
const signature = hash.toString(CryptoJS.enc.Base64);

exports.send = async function (req, res) {
    const phoneNumber = req.body.phoneNumber;

    if (!phoneNumber) return res.send(response(baseResponse.PHONE_NUMBER_EMPTY));
  
    Cache.del(phoneNumber);
  
    //인증번호 생성
    const verifyCode = Math.floor(Math.random() * (999999 - 100000)) + 100000;
  
    Cache.put(phoneNumber, verifyCode.toString());
  
    axios({
      method: method,
      json: true,
      url: url,
      headers: {
        'Content-Type': 'application/json',
        'x-ncp-iam-access-key': accessKey,
        'x-ncp-apigw-timestamp': date,
        'x-ncp-apigw-signature-v2': signature,
      },
      data: {
        type: 'SMS',
        contentType: 'COMM',
        countryCode: '82',
        from: '01071701824',
        content: `[본인 확인] 망고플레이트 인증번호 [${verifyCode}]를 입력해주세요.`,
        messages: [
          {
            to: `${phoneNumber}`,
          },
        ],
      }, 
      // function(err, res, html) {
        // if(err) console.log(err);
        // else {
          // resultCode = 200;
          // console.log(html);
        // }
      })
    .then(function (res) {
      console.log('response',res.data, res['data']);
      return res.send(response(baseResponse.PHONE_SEND_SUCCESS))

      //res.json({isSuccess: true, code: 202, message: "본인인증 문자 발송 성공", result: res.data });
    })
    .catch((err) => {
      console.log(err.res);
      if(err.res == undefined){
        return res.send(response(baseResponse.PHONE_SEND_SUCCESS))
        //res.json({isSuccess: true, code: 200, message: "본인인증 문자 발송 성공", result: res.data });
      }
      else {
        return res.send(response(baseResponse.PHONE_SEND_FAIL))
        //res.json({isSuccess: true, code: 204, message: "본인인증 문자 발송에 문제가 있습니다.", result: err.res });
      }
    });
};

/**
 * API No. 49
 * API Name : 휴대폰 인증 확인 API
 * Body : phoneNumber, ver
 */
exports.verify = async function (req, res) {
    const phoneNumber = req.body.phoneNumber;
    const verifyCode = req.body.verifyCode;

    if (!phoneNumber) return res.send(response(baseResponse.PHONE_NUMBER_EMPTY));
    if (!verifyCode) return res.send(response(baseResponse.VERIFY_CODE_EMPTY));

    const CacheData = Cache.get(phoneNumber);

    if (!CacheData) {
      return res.send(response(baseResponse.PHONE_VERIFY_FAIL));
      //return res.send('fail');
    } else if (CacheData !== verifyCode) {
      return res.send(response(baseResponse.PHONE_VERIFY_FAIL));
      //return res.send('fail');
    } else {
      Cache.del(phoneNumber);
      return res.send(response(baseResponse.PHONE_VERIFY_SUCCESS));
      //return res.send('success');
    }
};
