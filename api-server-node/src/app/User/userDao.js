// 닉네임으로 유저 조회
async function selectUserByNickname(connection, nickname) {
  const selectUserListQuery = `
                SELECT email, nickname, phoneNumber, profileImage
                FROM User
                WHERE nickname = ?;
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
              SELECT email, nickname, phoneNumber, profileImage
              FROM User 
              WHERE id = ?;
              `;
  const [userIdRows] = await connection.query(selectUserIdQuery, id);
  return userIdRows;
}


module.exports = {
  selectUserByNickname,
  selectUserEmail,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  selectUserId
};