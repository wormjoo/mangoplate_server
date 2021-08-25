// 잇딜 리스트 조회
async function selectEatDeal(connection, detailArea) {
  const selectEatDealQuery = `
      select E.id, E.name, E.menu, E.simpleInfo, format(E.costPrice, 0) as costPrice, format(E.salePrice, 0) as salePrice,
        round((100-(E.salePrice/E.costPrice)*100)) as discount,
        (select imageUrl from EatDealImage where eatDealId = E.id order by createAt limit 1) as image
      from EatDeal E
      join Restaurant R on E.restaurantId = R.id
      join Area A on R.areaId = A.id
      where A.detailArea = ?;
      `;
  const [eatDealRows] = await connection.query(selectEatDealQuery, detailArea);
  return eatDealRows;
}


module.exports = {
  selectEatDeal
};