const baseResponseStatus = require("../../../config/baseResponseStatus");
const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveUserListByNickname = async function (nickname) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userListResult = await userDao.selectUserByNickname(connection, nickname);  
  
  connection.release();

  return userListResult;
};

exports.retrieveFollowerUserList = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userListResult = await userDao.selectFollowerUser(connection, userId);  
  
  connection.release();

  return userListResult;
};

exports.retrieveFollowingUserList = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userListResult = await userDao.selectFollowingUser(connection, userId);
  
  connection.release();

  return userListResult;
};

exports.retrieveUser = async function (id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserId(connection, id);

  connection.release();

  return userResult[0];
};

exports.emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectUserEmail(connection, email);
  connection.release();

  return emailCheckResult;
};

exports.passwordCheck = async function (selectUserPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await userDao.selectUserPassword(
      connection,
      selectUserPasswordParams
  );
  connection.release();
  return passwordCheckResult[0];
};

exports.loginCheck = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const loginResult = await userDao.selectLoginUser(connection, userId);
  connection.release();

  return loginResult;
};

exports.accountCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, email);
  connection.release();

  return userAccountResult;
};

exports.followCheck = async function (userId, followerId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const followCheckResult = await userDao.selectFollow(
      connection, userId, followerId
  );
  connection.release();
  return followCheckResult[0];
};

exports.cancleFollow = async function (userId, followerId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const cancleFollowResult = await userDao.deleteFollow(connection, userId, followerId);
  connection.release();

  return cancleFollowResult;
};