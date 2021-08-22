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

// 식당 아이디로 리뷰 조회
async function selectReviewByRestaurant(connection, id) {
  const selectRestaurantByNameQuery = `
      select U.nickname, U.profileImage, (select count(*) from Follower where userId = U.id) as followerCount, (select count(*) from Review where userId = U.id) as reviewCount, U.holic,
        case evaluation
          when 5 then '맛있다!'
          when 3 then '괜찮다'
          when 1 then '별로'
        end as evaluation, R.content,
        (select count(*) from ReviewLike where reviewId = R.id) as likeCount, (select count(*) from ReviewComment where reviewId = R.id) as commentCount,
        case
          when timestampdiff(minute, R.createAt,current_timestamp()) < 60
          then concat(timestampdiff(minute, R.createAt,current_timestamp()),' 분 전')
          when timestampdiff(hour, R.createAt,current_timestamp()) < 24
          then concat(timestampdiff(hour, R.createAt,current_timestamp()),' 시간 전')
          when timestampdiff(day, R.createAt, current_timestamp()) < 8
          then concat(timestampdiff(day, R.createAt, current_timestamp()),'일 전')
          else date_format(R.createAt, '%Y-%m-%d')
        end as date
      from User U
      left join Review R on R.userId = U.id
      where R.restaurantId = ?
      group by R.id;              
      `;
  const [restaurantByNameRows] = await connection.query(selectRestaurantByNameQuery, id);
  return restaurantByNameRows;
}

module.exports = {
  insertRestaurant,
  selectRestaurant,
  selectRestaurantByName,
  insertImage,
  insertReview,
  selectReviewByRestaurant
};