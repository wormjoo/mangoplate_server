// 잇딜 리스트 조회
async function selectEatDeal(connection, detailArea) {
  const selectEatDealQuery = `
      select E.id, E.name, E.menu, E.simpleInfo, format(E.costPrice, 0) as costPrice, format(E.salePrice, 0) as salePrice,
        round((100-(E.salePrice/E.costPrice)*100)) as discount,
        (select imageUrl from EatDealImage where eatDealId = E.id order by createAt limit 1) as image
      from EatDeal E
      join Restaurant R on E.restaurantId = R.id
      join Area A on R.areaId = A.id
      where E.status = 'Y'
      and A.detailArea = ?;
      `;
  const [eatDealRows] = await connection.query(selectEatDealQuery, detailArea);
  return eatDealRows;
}

// 잇딜 리스트 전체 조회
async function selectAllEatDeal(connection) {
  const selectAllEatDealQuery = `
      select E.id, E.name, E.menu, E.simpleInfo, format(E.costPrice, 0) as costPrice, format(E.salePrice, 0) as salePrice,
        round((100-(E.salePrice/E.costPrice)*100)) as discount,
        (select imageUrl from EatDealImage where eatDealId = E.id order by createAt limit 1) as image
      from EatDeal E
      join Restaurant R on E.restaurantId = R.id
      join Area A on R.areaId = A.id
      where E.status = 'Y';
      `;
  const [eatDealRows] = await connection.query(selectAllEatDealQuery);
  return eatDealRows;
}

// 특정 잇딜 조회
async function selectEatDealById(connection, eatDealId) {
  const selectEatDealByIdQuery = `
      select E.id, E.name, E.menu, date_format(CURDATE(), '%Y-%m-%d') as startDate, 
        date_format(E.endDate, '%Y-%m-%d') as endDate,
        timestampdiff(DAY, CURDATE(), E.endDate)+1 as duration,
        format(E.costPrice, 0) as costPrice, format(E.salePrice, 0) as salePrice,
        round((100-(E.salePrice/E.costPrice)*100)) as discount,
        (select group_concat(imageUrl) from EatDealImage where eatDealId = E.id) as image,
        E.simpleInfo, E.restaurantInfo, E.menuInfo
      from EatDeal E
      where E.id = ?
      and E.status = 'Y';
      `;
  const eatDealRow = await connection.query(selectEatDealByIdQuery, eatDealId);
  return eatDealRow[0];
}

// 잇딜 구매내역 생성
async function insertPurchase(connection, insertPurchaseParams) {
  const insertPurchaseQuery = `
      insert into Purchase(eatdealId, userId, quantity, payMethod) 
      values (?, ?, ?, ?);
      `;
  const insertPurchaseRow = await connection.query(
    insertPurchaseQuery,
    insertPurchaseParams
  );

  return insertPurchaseRow;
}

// 잇딜 구매자
async function selectPurchaseUser(connection, purchaseId) {
  const selectPurchaseUserQuery = `
      select userId, status
      from Purchase
      where id = ?;
      `;
  const purchaseUserRow = await connection.query(selectPurchaseUserQuery, purchaseId);
  return purchaseUserRow[0];
}

// 잇딜 구매 취소
async function updatePurchaseStatus(connection, purchaseId) {
  const updatePurchaseStatusQuery = `
      UPDATE Purchase 
      set status = 'N' 
      where id = ?;
      `;
  const canclePurchaseRow = await connection.query(updatePurchaseStatusQuery, purchaseId);
  return canclePurchaseRow;
}

// 주문 목록 조회
async function selectOrderList(connection, eatDealId) {
  const selectOrderListQuery = `
      select id, name, menu, salePrice
      from EatDeal 
      where id = ?;
      `;
  const [orderRows] = await connection.query(selectOrderListQuery, eatDealId);
  return orderRows;
}


module.exports = {
  selectEatDeal,
  selectAllEatDeal,
  selectEatDealById,
  insertPurchase,
  selectPurchaseUser,
  updatePurchaseStatus,
  selectOrderList
};