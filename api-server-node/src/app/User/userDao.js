// 닉네임으로 유저 조회
async function selectUserByNickname(connection, nickname) {
  const selectUserListQuery = `
      select U.nickname, U.profileImage,
        (select count(*) from Review where U.id = userId) as reviews,
        (select count(*) from Follower where userId = U.id) as followers
      from User U
      where U.nickname like ?
      group by U.id;
      `;
  const [userRows] = await connection.query(selectUserListQuery, nickname);
  return userRows;
}

// 유저 이메일 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT email
                FROM User
                WHERE email = ?;
                `;
  const [userEmailRows] = await connection.query(selectUserEmailQuery, email);
  return userEmailRows;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
      INSERT INTO User(email, password, phoneNumber, nickname, profileImage)
      VALUES (?, ?, ?, ?, ?);
  `;
  const insertUserInfoRow = await connection.query(
      insertUserInfoQuery,
      insertUserInfoParams
  );

  return insertUserInfoRow;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
      SELECT email, password
      FROM User 
      WHERE email = ? and password = ?;
      `;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, email) {
  const selectUserAccountQuery = `
      SELECT status, id
      FROM User
      WHERE email = ?;
      `;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      email
  );
  return selectUserAccountRow[0];
}

// id로 회원 조회
async function selectUserId(connection, id) {
  const selectUserIdQuery = `
      select nickname, profileImage,
        (select count(followerId) from Follower where userId = U.id) as followers,
        (select count(userId) from Follower where followerId = U.id) as followings
      from User U
      where U.id = ?;
      `;
  const [userIdRows] = await connection.query(selectUserIdQuery, id);
  return userIdRows;
}

// 팔로워 생성
async function insertFollower(connection, insertFollowerParams) {
  const insertUserInfoQuery = `
      INSERT INTO Follower(userId, followerId)
      VALUES (?, ?);
  `;
  const insertUserInfoRow = await connection.query(
      insertUserInfoQuery,
      insertFollowerParams
  );

  return insertUserInfoRow;
}

// 팔로워 조회
async function selectFollowerUser(connection, userId) {
  const selectFollowerUserQuery = `
      select U.id, U.nickname, U.profileImage,
        (select count(id) from Review where userId = U.id) as reviews,
        (select count(followerId) from Follower where userId = U.id) as followers
      from User U
      join Follower F on U.id = F.followerId
      where F.userId = ?
      group by U.id;
      `;
  const [followerRows] = await connection.query(selectFollowerUserQuery, userId);
  return followerRows;
}

// 팔로우 조회
async function selectFollowingUser(connection, userId) {
  const selectFollowingUserQuery = `
      select U.id, U.nickname, U.profileImage,
        (select count(id) from Review where userId = U.id) as reviews,
        (select count(followerId) from Follower where userId = U.id) as followers
      from User U
      join Follower F on U.id = F.userId
      where F.followerId = ?
      group by U.id;
      `;
  const [followingRows] = await connection.query(selectFollowingUserQuery, userId);
  return followingRows;
}

// 팔로우 취소
async function deleteFollow(connection, deleteFollowingParams) {
  const deleteFollowQuery = `
      DELETE from Follower
      WHERE userId = ?
      AND followerId = ?;
      `;
  const deleteFollowRow = await connection.query(
    deleteFollowQuery,
    deleteFollowingParams
  );

  return deleteFollowRow;
}

// 팔로우 조회
async function selectFollow(connection, userId, followerId) {
  const selectFollowQuery = `
      SELECT * 
      FROM Follower
      WHERE userId = ?
      AND followerId = ?;
      `;
  const selectFollowRow = await connection.query(
    selectFollowQuery,
    [userId, followerId]
  );

  return selectFollowRow;
}

// 유저 계정 상태
async function updateUserStatus(connection, id) {
  const updateUserQuery = `
      UPDATE User
      SET status = 'N'
      WHERE id = ?;
      `;
  const updateUserRow = await connection.query(updateUserQuery, id);
  return updateUserRow[0];
}

// 닉네임 업데이트
async function updateUserName(connection, nickname, id) {
  const updateUserNicknameQuery = `
      UPDATE User
      SET nickname = ?
      WHERE id = ?;
      `;
  const updateUserNicknameRow = await connection.query(updateUserNicknameQuery, [nickname, id]);
  return updateUserNicknameRow[0];
}

// 휴대폰 번호 업데이트
async function updateUserPhoneNumber(connection, phoneNumber, id) {
  const updateUserPhoneNumberQuery = `
      UPDATE User
      SET phoneNumber = ?
      WHERE id = ?;
      `;
  const updateUserPhoneNumberRow = await connection.query(updateUserPhoneNumberQuery, [phoneNumber, id]);
  return updateUserPhoneNumberRow[0];
}

// 프로필이미지 업데이트
async function updateUserProfileImage(connection, profileImage, id) {
  const updateUserProfileImageQuery = `
      UPDATE User
      SET profileImage = ?
      WHERE id = ?;
      `;
  const updateUserProfileImageRow = await connection.query(updateUserProfileImageQuery, [profileImage, id]);
  return updateUserProfileImageRow[0];
}

// 홀릭배지 업데이트
async function updateUserHolic(connection, id, holic) {
  const updateUserHolicQuery = `
      UPDATE User
      SET holic = ?
      WHERE id = ?;
      `;
  const updateUserHolicRow = await connection.query(updateUserHolicQuery, [holic, id]);
  return updateUserHolicRow[0];
}

// 로그인된 유저 생성
async function insertLogin(connection, userId, token) {
  const insertJwtQuery = `
      INSERT INTO Login(userId, token) VALUES(?,?);
      `;
  const insertJwtRow = await connection.query(insertJwtQuery, [userId, token]);
  return insertJwtRow;
}

// 로그인 상태 업데이트
async function updateJwtStatus(connection, userId) {
  const updateJwtStatusQuery = `
      UPDATE Login SET status='O' where userId = ?;
      `;
  const updateJwtStatusRow = await connection.query(updateJwtStatusQuery, userId);
  return updateJwtStatusRow[0];
}

// 로그인된 유저 조회
async function selectLoginUser(connection, userId) {
  const selectJwtQuery = `
      SELECT userId, status FROM Login WHERE userId = ?;
      `;
  const selectJwtRow = await connection.query(selectJwtQuery, userId);
  return selectJwtRow[0];
}

//jwt token 업데이트
async function updateJwtToken(connection, userId, token) {
  const updateJwtTokenQuery = `
  UPDATE Login SET token=?, status='I' where userId = ?;
  `;
  const updateJwtTokenRow = await connection.query(updateJwtTokenQuery, [token, userId]);
  return updateJwtTokenRow;
}

module.exports = {
  selectUserByNickname,
  selectUserEmail,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  selectUserId,
  insertFollower,
  selectFollowerUser,
  selectFollowingUser,
  deleteFollow,
  selectFollow,
  updateUserStatus,
  updateUserName,
  updateUserPhoneNumber,
  updateUserProfileImage,
  updateUserHolic,
  insertLogin,
  updateJwtStatus,
  selectLoginUser,
  updateJwtToken
};