module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 20, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" },
    PHONE_SEND_SUCCESS: { "isSuccess": true, "code": 1002, "message": "본인인증 문자 발송 성공" },
    PHONE_VERIFY_SUCCESS: { "isSuccess": true, "code": 1003, "message": "본인인증에 성공하였습니다." },
    PHONE_SEND_FAIL: { "isSuccess": false, "code": 2017, "message": "본인인증 문자 발송에 문제가 있습니다." },
    PHONE_VERIFY_FAIL: { "isSuccess": false, "code": 2018, "message": "본인인증에 실패하였습니다." },

    //Request error
    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2001, "message":"이메일을 입력해주세요" },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2002, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message":"이메일 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2005, "message":"비밀번호는 6~12자리로 입력해주세요." },
    SIGNUP_PASSWORD_ERROR_TYPE : { "isSuccess": false, "code": 2006, "message":"비밀번호에 영문, 숫자를 포함시켜주세요." },
    USER_ID_EMPTY : { "isSuccess": false, "code": 2007, "message": "유저 id가 입력되지 않았습니다." },
    SIGNIN_TOKEN_EMPTY : { "isSuccess": false, "code": 2008, "message": "로그인하고자 하는 토큰을 입력해주세요." },
    FOLLOWER_ID_EMPTY : { "isSuccess": false, "code": 2009, "message": "팔로워 id가 입력되지 않았습니다." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2010, "message": "유저 아이디 값을 확인해주세요" },
    REVIEW_CONTENT_LENGTH : { "isSuccess": false, "code": 2011, "message": "리뷰 내용은 10000자 이하로 입력해주세요." },
    HOLIC_BADGE_ERROR_TYPE : { "isSuccess": false, "code": 2012, "message": "홀릭 배지 값을 확인해주세요." },
    RESTAURANT_ID_EMPTY : { "isSuccess": false, "code": 2013, "message": "식당 id가 입력되지 않았습니다." },
    REVIEW_ID_EMPTY : { "isSuccess": false, "code": 2014, "message": "리뷰 id가 입력되지 않았습니다." },
    COMMENT_ID_EMPTY : { "isSuccess": false, "code": 2015, "message": "댓글 id가 입력되지 않았습니다." },
    EATDEAL_ID_EMPTY : { "isSuccess": false, "code": 2016, "message": "잇딜 id가 입력되지 않았습니다." },
    PROFILE_IMAGE_EMPTY : { "isSuccess": false, "code": 2019, "message": "프로필이미지가 입력되지 않았습니다." },
    PHONE_NUMBER_EMPTY : { "isSuccess": false, "code": 2020, "message": "전화번호가 입력되지 않았습니다." },
    NICKNAME_EMPTY : { "isSuccess": false, "code": 2021, "message": "닉네임이 입력되지 않았습니다." },
    EMAIL_EMPTY : { "isSuccess": false, "code": 2022, "message": "이메일이 입력되지 않았습니다." },
    
    // Response error
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    USER_NICKNAME_NOT_EXIST : { "isSuccess": false, "code": 3002, "message":"검색 결과가 없습니다. 다시 확인해 주세요." },
    SIGNIN_WRONG : { "isSuccess": false, "code": 3003, "message":"이메일 주소 또는 비밀번호를 다시 확인하세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3004, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },
    ALREADY_EXIST_FOLLOW : { "isSuccess": false, "code": 3005, "message":"이미 존재하는 팔로우입니다." },
    FOLLOW_NOT_EXIST : { "isSuccess": false, "code": 3006, "message":"존재하지 않는 팔로우입니다." },
    COMMENT_NOT_EXIST : { "isSuccess": false, "code": 3007, "message":"삭제된 댓글입니다." },
    USER_ID_NOT_EXIST : { "isSuccess": false, "code": 3008, "message":"존재하지 않는 유저 id입니다." },
    RESTAURANT_ID_NOT_EXIST : { "isSuccess": false, "code": 3009, "message":"존재하지 않는 식당 id입니다." },
    LOGIN_NOT_EXIST : { "isSuccess": false, "code": 3008, "message":"로그인 정보가 존재하지 않습니다." },

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
 
 
}
