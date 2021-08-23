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

// 식당 이미지 생성
async function insertRestaurantImage(connection, id, image) {
  const insertRestaurantImageQuery = `
      INSERT INTO RestaurantImage(restaurantId, imageUrl)
      VALUES(?, ?);
  `;
  const insertRestaurantImageRow = await connection.query(insertRestaurantImageQuery, [id, image]);
  return insertRestaurantImageRow;
}

// 지역 내 모든 식당 조회
async function selectRestaurant(connection, detailArea) {
  const selectRestaurantListQuery = `
      select @rownum:=@rownum+1 as number, A.*
      from (
        select R.id, R.name, A.detailArea as area,
             (select imageUrl from RestaurantImage RI where restaurantId = R.id order by RI.createAt desc limit 1) as imageUrl, R.views,
             (select count(*) from Review where restaurantId = R.id) as reviews,
             round((select avg(evaluation) from Review where restaurantId = R.id), 1) as rating
        from Restaurant R, (select @rownum := 0) RN, Area A
        where A.id = R.areaId
        and A.detailArea = ?
        order by rating desc
      ) as A;
      `;
  const [restaurantRows] = await connection.query(selectRestaurantListQuery, detailArea);
  return restaurantRows;
}

// 식당 이름으로 식당 조회
async function selectRestaurantByName(connection, detailArea, name) {
  const selectRestaurantByNameQuery = `
      select @rownum:=@rownum+1 as number, A.*
      from (
        select R.id, R.name, A.detailArea as area,
             (select imageUrl from RestaurantImage RI where restaurantId = R.id order by RI.createAt desc limit 1) as imageUrl, R.views,
             (select count(*) from Review where restaurantId = R.id) as reviews,
             round((select avg(evaluation) from Review where restaurantId = R.id), 1) as rating
        from Restaurant R, (select @rownum := 0) RN, Area A
        where A.id = R.areaId
        and A.detailArea = ?
        and R.name like ?
        order by rating desc
      ) as A;
      `;
  const [restaurantByNameRows] = await connection.query(selectRestaurantByNameQuery, [detailArea, name]);
  return restaurantByNameRows;
}

// 특정 식당 아이디로 조회
async function selectRestaurantById(connection, id) {
  const selectRestaurantByIdQuery = `
      select R.name as name, R.address as address, R.callNumber as callNumber,
          (select group_concat(imageUrl) from RestaurantImage where restaurantId = R.id) as imageUrl, R.views as views,
          (select count(*) from Review where restaurantId = R.id) as reviews,
          (select count(*) from WannaGo where restaurantId = R.id) as starCount,
          round((select avg(evaluation) from Review where restaurantId = R.id), 1) as rating,
          R.businessHour as businessHour, R.holiday as holiday, R.lastOrder as lastOrder, R.priceInfo as priceInfo,
          date_format(R.updateAt, '%Y-%m-%d') as infoUpdate,
          (select group_concat(menu) from Menu where restaurantId = R.id) as menu,
          (select group_concat(FORMAT(price , 0)) from Menu where restaurantId = R.id) as price,
          date_format((select updateAt from Menu where restaurantId = R.id order by updateAt desc limit 1), '%Y-%m-%d') as menuUpdate
      from Restaurant R
      where R.id = ?;
      `;
  const restaurantByIdRow = await connection.query(selectRestaurantByIdQuery, id);
  return restaurantByIdRow[0];
}

// 조회수 증가
async function updateViews(connection, id) {
  const updateViewsQuery = `
      update Restaurant set views = ifnull(views, 0) + 1 where id = ?;
      `;
  const viewsRow = await connection.query(updateViewsQuery, id);
  return viewsRow;
}

// 리뷰 + 이미지 생성
async function insertImage(connection, imageParams) {
  const insertImageQuery = `
      INSERT INTO RestaurantImage(restaurantId, reviewId, imageUrl)
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
  const selectReviewByRestaurantQuery = `
      select U.nickname, U.profileImage, (select count(*) from Follower where userId = U.id) as followerCount, 
        (select count(*) from Review where userId = U.id) as reviewCount, U.holic,
        case evaluation
          when 5 then '맛있다!'
          when 3 then '괜찮다'
          when 1 then '별로'
        end as evaluation, R.content, group_concat(RI.imageUrl) as reviewImage,
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
      left join RestaurantImage RI on R.id = RI.reviewId
      where R.restaurantId = ?
      group by R.id;              
      `;
  const [reviewsRows] = await connection.query(selectReviewByRestaurantQuery, id);
  return reviewsRows;
}

// 내가 등록한 식당 조회
async function selectMyRestaurant(connection, userId) {
  const selectMyRestaurantQuery = `
      select (select imageUrl from RestaurantImage RI where restaurantId = R.id order by RI.createAt desc limit 1) as imageUrl,
          R.name, R.address,
          (select type from FoodType F where F.id = R.cuisine) as cuisine,
          case
            when timestampdiff(minute, R.createAt,current_timestamp()) < 60
            then concat(timestampdiff(minute, R.createAt,current_timestamp()),' 분 전')
            when timestampdiff(hour, R.createAt,current_timestamp()) < 24
            then concat(timestampdiff(hour, R.createAt,current_timestamp()),' 시간 전')
            when timestampdiff(day, R.createAt, current_timestamp()) < 8
            then concat(timestampdiff(day, R.createAt, current_timestamp()),'일 전')
            else date_format(R.createAt, '%Y-%m-%d')
          end as date
      from Restaurant R
      join FoodType F on R.cuisine = F.id
      where R.userId = ?
      group by R.id;
  `;
  const [myRestaurantRows] = await connection.query(selectMyRestaurantQuery, userId);
  return myRestaurantRows;
}

// 식당 편의정보 조회
async function selectRestaurantInfo(connection, restaurantId) {
  const selectRestaurantInfoQuery = `
      select businessHour, holiday, lastOrder, (select type from FoodType F where F.id = R.cuisine) as cuisine, corkage, webSite, parkingInfo 
      from Restaurant R
      where R.id = ?;
      `;
  const infoRow = await connection.query(selectRestaurantInfoQuery, restaurantId);
  return infoRow[0];
}

// 식당 메뉴 조회
async function selectRestaurantMenu(connection, restaurantId) {
  const selectRestaurantMenuQuery = `
      select menu, FORMAT(price , 0) as price from Menu M
      join Restaurant R on M.restaurantId = R.id
      where R.id = ?;
      `;
  const [menuRows] = await connection.query(selectRestaurantMenuQuery, restaurantId);
  return menuRows;
}

// 리뷰 아이디로 특정 리뷰 조회
async function selectReview(connection, id) {
  const selectReviewQuery = `
    select U.nickname, U.profileImage, (select count(*) from Follower where userId = U.id) as followerCount,
      (select count(*) from Review where userId = U.id) as reviewCount, U.holic,
      case evaluation
      when 5 then '맛있다!'
        when 3 then '괜찮다'
        when 1 then '별로'
      end as evaluation, R.content, group_concat(RI.imageUrl) as reviewImage,
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
    left join RestaurantImage RI on R.id = RI.reviewId
    where R.id = ?
    group by R.id;           
    `;
  const reviewRow = await connection.query(selectReviewQuery, id);
  return reviewRow[0];
}

module.exports = {
  insertRestaurant,
  insertRestaurantImage,
  selectRestaurant,
  selectRestaurantByName,
  insertImage,
  insertReview,
  selectReviewByRestaurant,
  selectRestaurantById,
  updateViews,
  selectMyRestaurant,
  selectRestaurantInfo,
  selectRestaurantMenu,
  selectReview
};