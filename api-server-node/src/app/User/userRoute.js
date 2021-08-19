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

    // 6. 카카오 소셜로그인1 (토큰받기) API
    app.get('/kakao', passport.authenticate('kakao-login'));
    app.get('/oauth/kakao/callback', passport.authenticate('kakao-login', {
        successRedirect: '/',
        failureRedirect : '/',
    }), (req, res) => {res.redirect('/');});

    // 7.카카오 소셜로그인2 (인증)API
    app.post('/kakao/login', user.kakaoSignIn);

    // 8. 로그아웃 하기 API
    //app.post('/app/logout', user.logout);

    // 9. 회원 탈퇴 API
    //app.patch('/app/withdraw/:userId', user.withdrawal);

    // 10. 유저 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    //app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers);

    // 32. 팔로우 추가 API
    app.post('/app/follower', user.postFollower);

    // 33. 팔로우 취소 API
    app.delete('/app/follower/:followerId', user.deleteFollow);

    // 34. 팔로워 조회 API
    app.get('/app/followers', user.getFollowers);

    // 35. 팔로잉 조회 API
    app.get('/app/followings', user.getFollowings);

};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API