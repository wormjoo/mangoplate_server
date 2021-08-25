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
        select R.id, R.name, A.detailArea as area, R.distance,
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
        select R.id, R.name, A.detailArea as area, R.distance,
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
      select R.name as name, R.address1 as address, R.callNumber as callNumber,
          (select group_concat(imageUrl) from RestaurantImage where restaurantId = R.id) as imageUrl, R.views as views,
          (select count(*) from Review where restaurantId = R.id) as reviews,
          (select count(*) from WannaGo where restaurantId = R.id) as starCount,
          round((select avg(evaluation) from Review where restaurantId = R.id), 1) as rating,
          R.businessHour as businessHour, R.holiday as holiday, R.lastOrder as lastOrder, R.priceInfo as priceInfo,
          date_format(R.updateAt, '%Y-%m-%d') as infoUpdate,
          (select group_concat(menu separator '/') from Menu where restaurantId = R.id) as menu,
          (select group_concat(FORMAT(price , 0) separator '/') from Menu where restaurantId = R.id) as price,
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

// 내가 등록한 식당 조회
async function selectMyRestaurant(connection, userId) {
  const selectMyRestaurantQuery = `
      select (select imageUrl from RestaurantImage RI where restaurantId = R.id order by RI.createAt desc limit 1) as imageUrl,
          R.name, R.address1,
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

module.exports = {
  insertRestaurant,
  insertRestaurantImage,
  selectRestaurant,
  selectRestaurantByName,
  selectRestaurantById,
  updateViews,
  selectMyRestaurant,
  selectRestaurantInfo,
  selectRestaurantMenu,
};