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

module.exports = {
    insertVisited,
    selectTodayVisited,
    selectVisitedUser,
    updateVisitedStatus,
    updateVisitedContent
};