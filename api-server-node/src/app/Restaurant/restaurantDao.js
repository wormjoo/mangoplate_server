// 식당 생성
async function insertRestaurant(connection, insertRestaurantParams) {
  const insertRestaurantQuery = `
      INSERT INTO Restaurant(userId, name, address, callNumber, cuisine)
      VALUES (?, ?, ?, ?, ?);
  `;
  const insertRestaurantRow = await connection.query(
    insertRestaurantQuery,
    insertRestaurantParams
  );

  return insertRestaurantRow;
}

// 모든 식당 조회
async function selectRestaurant(connection) {
  const selectRestaurantListQuery = `
              
              `;
  const [userRows] = await connection.query(selectRestaurantListQuery);
  return userRows;
}

// 식당 이름으로 식당 조회
async function selectRestaurantByName(connection, id) {
  const selectRestaurantByNameQuery = `
              
              `;
  const [restaurantByNameRows] = await connection.query(selectRestaurantByNameQuery, id);
  return restaurantByNameRows;
}

// 리뷰 + 이미지 생성
async function insertImage(connection, imageParams) {
  const insertImageQuery = `
      INSERT INTO RestaurantImage(restaurantId, reviewId, image)
      VALUES(?, ?, ?);
      `;
  const insertImageRow = await connection.query(
    insertImageQuery, 
    imageParams
  );

  return insertImageRow;
}

// 리뷰만 생성
async function insertReview(connection, insertReviewParams) {
  const insertReviewQuery = `
      INSERT INTO Review(userId, restaurantId, evaluation, content)
      VALUES(?, ?, ?, ?);
      `;
  const insertReviewRow = await connection.query(
    insertReviewQuery,
    insertReviewParams
  );

  return insertReviewRow;
}

module.exports = {
  insertRestaurant,
  selectRestaurant,
  selectRestaurantByName,
  insertImage,
  insertReview
};