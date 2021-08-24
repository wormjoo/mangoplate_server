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

// 리뷰 삭제
async function updateReviewStatus(connection, id) {
  const updateReviewStatusQuery = `
      UPDATE Review 
      SET status = 'N' 
      WHERE id = ?;
      `;
  const deleteReviewRow = await connection.query(updateReviewStatusQuery, id);
  return deleteReviewRow[0];
}

// 리뷰 수정
async function updateReviewContent(connection, id, content, evaluation) {
  const updateReviewContentQuery = `
      UPDATE Review
      SET content = ?, evaluation = ?
      WHERE id = ?
      `;
  const editReviewRow = await connection.query(updateReviewContentQuery, [content, evaluation, id]);
  return editReviewRow[0];
}

// 댓글 생성
async function insertReviewComment(connection, insertCommentParams) {
  const insertReviewCommentQuery = `
      insert ReviewComment(reviewId, userId, content) 
      values(?, ?, ?);
      `;
  const commentRow = await connection.query(
    insertReviewCommentQuery, 
    insertCommentParams
    );
  return commentRow[0];
}

// 특정 리뷰 댓글 조회
async function selectCommentByReview(connection, reviewId) {
  const selectCommentByReviewQuery = `
      select U.nickname, U.profileImage, U.holic, RC.content, date_format(RC.createAt, '%Y-%m-%d') as date
      from ReviewComment RC
      join User U on RC.userId = U.id
      where RC.status = 'Y'
      and RC.reviewId = ?;  
      `;
  const [commentRows] = await connection.query(selectCommentByReviewQuery, reviewId);
  return commentRows;
}

// 댓글 삭제
async function updateCommentStatus(connection, id) {
  const updateCommentStatusQuery = `
      UPDATE ReviewComment
      SET status = 'N' 
      WHERE id = ?;
      `;
  const deleteCommentRow = await connection.query(updateCommentStatusQuery, id);
  return deleteCommentRow[0];
}

// 댓글 수정
async function updateCommentContent(connection, id, content) {
  const updateCommentContentQuery = `
      UPDATE ReviewComment
      SET content = ?
      WHERE id = ?
      `;
  const editCommentRow = await connection.query(updateCommentContentQuery, [content, id]);
  return editCommentRow[0];
}

// 댓글 상태 확인
async function selectComment(connection, id) {
  const selectCommentQuery = `
      SELECT *
      FROM ReviewComment
      WHERE status = 'Y'
      AND id = ?
      `;
  const commentStatusRow = await connection.query(selectCommentQuery, id);
  return commentStatusRow[0];
}

module.exports = {
  insertImage,
  insertReview,
  selectReviewByRestaurant,
  selectReview,
  updateReviewStatus,
  updateReviewContent,
  insertReviewComment,
  selectCommentByReview,
  updateCommentStatus,
  updateCommentContent,
  selectComment,
};