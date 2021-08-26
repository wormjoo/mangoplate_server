// 가봤어요 추가
async function insertVisited(connection, insertVisitedParams) {
    const insertVisitedQuery = `
            insert into Visited(userId, restaurantId, content, public) 
            values (?, ?, ?, ?);
            `;
    const visitedRow = await connection.query(
        insertVisitedQuery, 
        insertVisitedParams
    );

    return visitedRow;
}

// 오늘의 가봤어요 조회
async function selectTodayVisited(connection, userId, restaurantId) {
    const selectTodayVisitedQuery = `
            select V.id
            from Visited V
            where userId = ?
            and restaurantId = ?
            and timestampdiff(hour, V.createAt,current_timestamp()) <= 24;
            `;
    const todayVisitedRow = await connection.query(
        selectTodayVisitedQuery, 
        [userId, restaurantId]
    );

    return todayVisitedRow;
}

// 가봤어요 작성자
async function selectVisitedUser(connection, visitedId) {
    const selectVisitedUserQuery = `
        select userId, public
        from Visited
        where id = ?;
        `;
    const visitedUserRow = await connection.query(selectVisitedUserQuery, visitedId);
    return visitedUserRow[0];
}

// 가봤어요 삭제
async function updateVisitedStatus(connection, id) {
    const updateVisitedStatusQuery = `
        UPDATE Visited 
        SET status = 'N' 
        WHERE id = ?;
        `;
    const deleteVisitedRow = await connection.query(updateVisitedStatusQuery, id);
    return deleteVisitedRow[0];
}
  
// 가봤어요 수정
async function updateVisitedContent(connection, id, content, public) {
    const updateVisitedContentQuery = `
        UPDATE Visited
        SET content = ?, public = ?
        WHERE id = ?
        `;
    const editVisitedRow = await connection.query(updateVisitedContentQuery, [content, public, id]);
    return editVisitedRow[0];
}

// 유저 닉네임 조회
async function selectUser(connection, id) {
    const selectUserQuery = `
        select nickname
        from User
        where id = ?;
        `;
    const userRow = await connection.query(selectUserQuery, id);
    return userRow[0];
}

// 식당 이름 조회
async function selectRestaurant(connection, id) {
    const selectRestaurantQuery = `
        select name
        from Restaurant
        where id = ?;
        `;
    const restaurantRow = await connection.query(selectRestaurantQuery, id);
    return restaurantRow[0];
}

// 전체 지역 가봤어요 리스트 조회
async function selectAllVisitedList(connection, id) {
    const selectAllVisitedListQuery = `
        select U.id, U.nickname, U.profileImage,
            (select count(id) from Review where userId = U.id) as reviews,
            (select count(followerId) from Follower where userId = U.id) as followers,
            R.name, A.detailArea, V.content, FT.type, R.views,
            (select count(id) from Review where restaurantId = R.id) as reviews
        from Visited V
        join User U on V.userId = U.id
        join Restaurant R on V.restaurantId = R.id
        join Area A on R.areaId = A.id
        join FoodType FT on R.cuisine = FT.id
        where U.id = ?;
        `;
    const [visitedListRows] = await connection.query(selectAllVisitedListQuery, id);
    return visitedListRows;
}

// 일부 지역 가봤어요 리스트 조회
async function selectVisitedList(connection, id, detailArea) {
    const selectVisitedListQuery = `
        select U.id, U.nickname, U.profileImage,
            (select count(id) from Review where userId = U.id) as reviews,
            (select count(followerId) from Follower where userId = U.id) as followers,
            R.name, A.detailArea, V.content, FT.type, R.views,
            (select count(id) from Review where restaurantId = R.id) as reviews
        from Visited V
        join User U on V.userId = U.id
        join Restaurant R on V.restaurantId = R.id
        join Area A on R.areaId = A.id
        join FoodType FT on R.cuisine = FT.id
        where U.id = ?
        and A.detailArea = ?;
        `;
    const [visitedListRows] = await connection.query(selectVisitedListQuery, [id, detailArea]);
    return visitedListRows;
}

module.exports = {
    insertVisited,
    selectTodayVisited,
    selectVisitedUser,
    updateVisitedStatus,
    updateVisitedContent,
    selectUser,
    selectRestaurant,
    selectAllVisitedList,
    selectVisitedList
};