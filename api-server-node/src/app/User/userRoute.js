module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const passport = require('passport');

    // 1. 이메일 조회 API 
    app.get('/app/users/emails',user.getUserByEmail);

    // 2. 유저 생성 (회원가입) API
    app.post('/app/users', user.postUsers);

    // 3. 유저 조회 (친구찾기) API (+ 닉네임으로 검색) 
    app.get('/app/users',user.getUserByNickname);

    // 4. 특정 유저 조회 API
    app.get('/app/users/:id', user.getUserById);

    // 5. 로그인 하기 API (JWT 생성)
    app.post('/app/login', user.login);

    // 6. 홀릭 배지 생성 API
    app.patch('/app/holic/:userId', user.patchHolic);

    // 7.카카오 소셜로그인2 (인증)API
    app.post('/kakao/login', user.kakaoSignIn);

    // 8. 로그아웃 하기 API
    //app.post('/app/logout', user.logout);

    // 9. 회원 탈퇴 API
    app.patch('/app/withdraw/:userId', user.withdrawal);

    // 10. 유저 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    // app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers);

    // 32. 팔로우 추가 API
    app.post('/app/follower', user.postFollower);

    // 33. 팔로우 취소 API
    app.delete('/app/follower/:followerId', user.deleteFollow);

    // 34. 팔로워 조회 API
    app.get('/app/followers', user.getFollowers);

    // 35. 팔로잉 조회 API
    app.get('/app/followings', user.getFollowings);

    // 44. 유저 정보 수정 (닉네임) API
    app.patch('/app/:userId/nickname', user.patchName);

    // 45. 유저 정보 수정 (전화번호) API
    app.patch('/app/:userId/phone-number', user.patchPhoneNumber);

    // 46. 유저 정보 수정 (이메일) API
    // app.patch('/app/:userId/email', user.patchEmail);

    // 47. 유저 정보 수정 (프로필이미지) API
    app.patch('/app/:userId/profile-image', user.patchProfileImage);

};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API