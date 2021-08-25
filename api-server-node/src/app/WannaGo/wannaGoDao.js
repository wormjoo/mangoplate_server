// 좋아요 상태 확인
async function selectStar(connection, restaurantId, userId) {
    const selectStarQuery = `
        SELECT *
        FROM WannaGo
        WHERE restaurantId = ?
        AND userId = ?;
        `;
    const starStatusRow = await connection.query(selectStarQuery, [restaurantId, userId]);
    return starStatusRow[0];
}
  
// 좋아요 추가
async function insertStar(connection, restaurantId, userId) {
    const insertStarQuery = `
        INSERT INTO WannaGo(restaurantId, userId) 
        VALUES(?, ?);
        `;
    const addStarRow = await connection.query(insertStarQuery, [restaurantId, userId]);
    return addStarRow[0];
}
  
// 좋아요 상태 변경
async function updateStar(connection, id, status) {
    const updateStarQuery = `
        UPDATE WannaGo
        SET status = ?
        WHERE id = ?;
        `;
    const editStarStatusRow = await connection.query(updateStarQuery, [status, id]);
    return editStarStatusRow[0];
}

// 특정 유저 모든 가고싶다 조회
async function selectAllWannaGo(connection, userId) {
    const selectAllWannaGoQuery = `
        select R.id, R.name, A.detailArea as area, round((select avg(evaluation) from Review where restaurantId = R.id), 1) as rating,
            (select imageUrl from RestaurantImage RI where restaurantId = R.id order by RI.createAt desc limit 1) as imageUrl,
            (select count(*) from Review where restaurantId = R.id) as reviews,
            (select count(*) from WannaGo where restaurantId = R.id) as starCount
        from Restaurant R
        join Area A on R.areaId = A.id
        join WannaGo WG on R.id = WG.restaurantId
        where WG.userId = ?
        order by R.createAt;
        `;
    const [starListRows] = await connection.query(selectAllWannaGoQuery, userId);
    return starListRows;
}

// 특정 유저 모든 가고싶다 조회
async function selectWannaGo(connection, userId, detailArea) {
    const selectWannaGoQuery = `
        select R.id, R.name, A.detailArea as area, round((select avg(evaluation) from Review where restaurantId = R.id), 1) as rating,
            (select imageUrl from RestaurantImage RI where restaurantId = R.id order by RI.createAt desc limit 1) as imageUrl,
            (select count(*) from Review where restaurantId = R.id) as reviews,
            (select count(*) from WannaGo where restaurantId = R.id) as starCount
        from Restaurant R
        join Area A on R.areaId = A.id
        join WannaGo WG on R.id = WG.restaurantId
        where WG.userId = ?
        and A.detailArea = ?
        order by R.createAt;
        `;
    const [starListByAreaRows] = await connection.query(selectWannaGoQuery, [userId, detailArea]);
    return starListByAreaRows;
}

module.exports = {
    selectStar,
    insertStar,
    updateStar,
    selectAllWannaGo,
    selectWannaGo
};