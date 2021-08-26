const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const wannaGoProvider = require("./wannaGoProvider");
const wannaGoDao = require("./wannaGoDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.pressStar = async function (restaurantId, userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {        
      // 트랜잭션
      await connection.beginTransaction();

      const starCheck = await wannaGoDao.selectStar(connection, restaurantId, userId);

      if(starCheck.length < 1) {
          const addStar = await wannaGoDao.insertStar(connection, restaurantId, userId);
      } else {
          if (starCheck[0].status == 'Y') {
              status = 'N'
          } else {
              status = 'Y'
          }
          const addStar = await wannaGoDao.updateStar(connection, starCheck[0].id, status);
      }
      
      // 커밋
      await connection.commit();
      return response(baseResponse.SUCCESS);

  } catch (err) {
      // 롤백
      await connection.rollback();
      logger.error(`App - pressStar Service error\n: ${err.message}`);
      return errResponse(baseResponse.DB_ERROR);
  } finally {
    connection.release();
}
};