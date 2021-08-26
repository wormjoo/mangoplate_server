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

module.exports = {
    insertVisited,
    selectTodayVisited
};