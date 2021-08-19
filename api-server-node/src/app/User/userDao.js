// 닉네임으로 유저 조회
async function selectUserByNickname(connection, nickname) {
  const selectUserListQuery = `
      select U.nickname, U.profileImage, count(R.id) as reviews, count(F.id) as followers
      from User U
      left join Review R on U.id = R.userId
      left join Follower F on U.id = F.followerId
      where U.nickname = ?
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
      SELECT nickname, profileImage, 
      count(if(F.userId = U.id, F.userId, null)) as followers, 
      count(if(F.followerId = U.id, F.followerId, null)) as followings
      FROM User U
      JOIN Follower F on U.id = F.followerId or U.id = F.userId
      WHERE U.id = ?;
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
      select U.id, U.nickname, U.profileImage, count(R.id) as reviews, count(F2.userId) as followers
      from Follower F
      join User U on U.id = F.followerId
      join Follower F2 on F2.userId = U.id
      left join Review R on U.id = R.userId
      where F.userId = ?
      group by U.id;
      `;
  const [followerRows] = await connection.query(selectFollowerUserQuery, userId);
  return followerRows;
}

// 팔로우 조회
async function selectFollowingUser(connection, userId) {
  const selectFollowingUserQuery = `
      select U.nickname, U.profileImage, count(R.id), count(F2.userId)
      from Follower F
      join User U on U.id = F.userId
      join Follower F2 on F2.userId = U.id
      left join Review R on U.id = R.userId
      where F.followerId = ?
      group by U.id;
      `;
  const [followingRows] = await connection.query(selectFollowingUserQuery, userId);
  return followingRows;
}

// 팔로우 취소
async function deleteFollow(connection, userId, followerId) {
  const deleteFollowQuery = `
      DELETE from Follower
      WHERE userId = ?
      AND followerId = ?;
      `;
  const deleteFollowRow = await connection.query(
    deleteFollowQuery,
    [userId, followerId]
  );

  return deleteFollowRow;
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
  deleteFollow
};