const { use } = require("passport");

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
      select R.id, U.nickname, U.profileImage, (select count(*) from Follower where userId = U.id) as followerCount, 
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

// 식당 아이디로 리뷰 조회 (+평가도)
async function selectReviewByEvaluation(connection, id, evaluation) {
  const selectReviewByEvaluationQuery = `
      select R.id, U.nickname, U.profileImage, (select count(*) from Follower where userId = U.id) as followerCount, 
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
      and R.evaluation = ?
      group by R.id;              
      `;
  const [reviewsRows] = await connection.query(selectReviewByEvaluationQuery, [id, evaluation]);
  return reviewsRows;
}

// 리뷰 아이디로 특정 리뷰 조회
async function selectReview(connection, id) {
  const selectReviewQuery = `
    select R.id, U.nickname, U.profileImage, (select count(*) from Follower where userId = U.id) as followerCount,
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

// 좋아요 상태 확인
async function selectLike(connection, reviewId, userId) {
  const selectLikeQuery = `
      SELECT *
      FROM ReviewLike
      WHERE reviewId = ?
      AND userId = ?;
      `;
  const likeStatusRow = await connection.query(selectLikeQuery, [reviewId, userId]);
  return likeStatusRow[0];
}

// 좋아요 추가
async function insertLike(connection, reviewId, userId) {
  const insertLikeQuery = `
      INSERT INTO ReviewLike(reviewId, userId) 
      VALUES(?, ?);
      `;
  const addLikeRow = await connection.query(insertLikeQuery, [reviewId, userId]);
  return addLikeRow[0];
}

// 좋아요 상태 변경
async function updateLike(connection, id, status) {
  const updateLikeQuery = `
      UPDATE ReviewLike
      SET status = ?
      WHERE id = ?;
      `;
  const editLikeStatusRow = await connection.query(updateLikeQuery, [status, id]);
  return editLikeStatusRow[0];
}

// 좋아요 누른 유저 조회
async function selectLikeUser(connection, reviewId) {
  const selectLikeUserQuery = `
      select U.id, U.nickname, U.profileImage, U.holic,
        (select count(id) from Review where userId = U.id) as reviews,
        (select count(followerId) from Follower where userId = U.id) as followers
      from ReviewLike RL
      join User U on U.id = RL.userId
      where RL.status = 'Y'
      AND RL.reviewId = ?;
      `;
  const [likeUserRows] = await connection.query(selectLikeUserQuery, reviewId);
  return likeUserRows;
}

// 전체 지역 소식 조회
async function selectNews(connection, evaluationParams) {
  const selectNewsQuery = `
      select R.id, U.nickname, U.profileImage, (select count(*) from Follower where userId = U.id) as followerCount,
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
      where evaluation in (?, ?, ?)
      group by R.id;
      `;
  const [newsRows] = await connection.query(selectNewsQuery, evaluationParams);
  return newsRows;
}

// 선택 지역 소식 조회
async function selectNewsByArea(connection, selectNewsByAreaParams) {
  const selectNewsByAreaQuery = `
      select R.id, U.nickname, U.profileImage, (select count(*) from Follower where userId = U.id) as followerCount,
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
      join Restaurant R2 on R.restaurantId = R2.id
      join Area A on R2.areaId = A.id
      where evaluation in (?, ?, ?)
      and A.detailArea = ?
      group by R.id;
      `;
  const [newsByAreaRows] = await connection.query(
    selectNewsByAreaQuery, 
    selectNewsByAreaParams
  );
  return newsByAreaRows;
}

module.exports = {
  insertImage,
  insertReview,
  selectReviewByRestaurant,
  selectReviewByEvaluation,
  selectReview,
  updateReviewStatus,
  updateReviewContent,
  insertReviewComment,
  selectCommentByReview,
  updateCommentStatus,
  updateCommentContent,
  selectComment,
  selectLike,
  insertLike,
  updateLike,
  selectLikeUser,
  selectNews,
  selectNewsByArea
};