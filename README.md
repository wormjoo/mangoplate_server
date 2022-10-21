# mangoPlate_test_Server_Hazel

📘 기획서
https://docs.google.com/document/d/1siqmJ-5PSK3T33Vw1r0XGNfd6ZQNpe-ozakbGpCh5N0/edit?usp=sharing

📗 API 명세서
https://docs.google.com/spreadsheets/d/1TX5khPRCDRomRDSfDivcpqRPUOHNghhHuakxcwvoTg8/edit?usp=sharing


### __2021-08-14 진행상황__
+ 기획서 작성
+ ERD 생성
+ EC2 서버 구축

### __2021-08-15 진행상황__
+ 서브 도메인 생성(dev, prod)
+ dev에 템플릿 적용
+ rds 구축
+ ERD 30% 완료

### __2021-08-16 진행상황__
+ 서브 도메인 SSL 인증
+ ERD 90% 완료
+ 기획서 수정
+ API 리스트 작성

### __2021-08-17 진행상황__
+ RDS에 데이터베이스 및 테이블 생성
+ 이메일 조회 API 생성
+ 회원가입 API 생성
+ 특정 유저 조회 API 생성
+ 로그인 하기 API
+ 유저 조회 API 생성
+ 카카오 소셜로그인 API 생성
+ 추가된 API 명세서 작성
+ ERD 수정

### __2021-08-18 진행상황__
+ 팔로워 추가 API 생성
+ 팔로워 조회 API 생성
+ 특정 유저 조회 API 수정
+ 팔로잉 조회 API 생성
+ 유저 조회 API 수정

### __2021-08-19 진행상황__
+ 팔로워 추가 API 수정
+ 팔로워 조회 API 수정
+ 팔로우 삭제 API 생성
+ 팔로잉 조회 API 수정
+ 추가된 API 명세서 작성

### __2021-08-20 진행상황__
+ 회원 탈퇴 API 생성
+ 식당 등록하기 API 생성
+ 추가된 API 명세서 작성

### __2021-08-21 진행상황__
+ 회원 작성하기 API 생성
+ 유저 정보 수정 (닉네임, 전화번호, 프로필이미지) 각각의 API 생성
+ 추가된 API 명세서 작성
+ 회의록
  + 주말동안 카카오톡 소셜로그인 클라이언트와 함께 작업
  + 평가도는 클라이언트에서 string으로 전달, 이후 서버에서 int로 데이터 넣도록 함
  + 소셜로그인으로 가입할 경우에는 이메일 수정 가능

### __2021-08-22 진행상황__
+ 특정 식당 리뷰 조회 API 생성
+ 카카오톡 소셜 로그인 API 완료
+ 추가된 API 명세서 작성

### __2021-08-23 진행상황__
+ 식당 조회 API 생성
+ 특정 식당 조회 API 생성
+ 내가 등록한 식당 조회 API 생성
+ 특정 식당 편의정보 조회 API 생성
+ 특정 식당 메뉴 조회 API 생성
+ 특정 리뷰 조회 API 생성
+ 추가된 API 명세서 작성

### __2021-08-24 진행상황__
+ 특정 리뷰 수정 및 삭제 API 생성
+ 댓글 작성 API 생성
+ 특정 리뷰 댓글 조회 API 생성
+ 댓글 수정 및 삭제 API 생성
+ 리뷰 좋아요 API 생성
+ 특정 리뷰 좋아요 누른 유저 조회 API 생성
+ 추가된 API 명세서 작성
+ 식당 조회 API response에 id 추가

### __2021-08-25 진행상황__
+ 잇딜 리스트 조회 API 생성
+ 특정 잇딜 조회 API 생성
+ 소식 리스트 조회 API 생성
+ 가고싶다 API 생성
+ 더미데이터 10% 추가
+ Restaurant 테이블에 지번주소 추가
+ 특정 식당 조회 API 일부 수정
+ 추가된 API 명세서 작성

### __2021-08-26 진행상황__
+ 가고싶다 API 생성
+ 가고싶다 리스트 조회 API 생성
+ 휴대폰 인증 API 생성
+ 로그아웃 API 생성
+ 잇딜 구매, 취소, 조회 API 생성
+ 팔로우, 팔로워 조회 쿼리 수정
+ 가봤어요 추가, 수정, 삭제 API 생성
+ 필요한 더미데이터 모두 추가
+ jwt 필요한 API에 모두 적용
+ 트랜잭션 적용
+ 추가된 API 명세서 작성
