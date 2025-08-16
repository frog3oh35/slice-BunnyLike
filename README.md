# 🐰 BunnyLike


간단한 CRUD + 좋아요 기능이 포함된 초미니 게시판 프로젝트

* **Jira** : 태스크/이슈 관리 (기능 구현 및 버그 트래킹 기록) https://slice-projects.atlassian.net/jira/software/projects/BNL/boards/2

* **Confluence** : API 명세, 테스트 케이스, 프로젝트 회고 기록 https://slice-projects.atlassian.net/wiki/x/owEB

* **GitHub** : 코드 저장소 및 버전 관리




---




## 📌 프로젝트 소개


- username/password 기반 게시글 등록

- 게시글 삭제 (password 검증)

- 좋아요(Like) 기능

- Swagger를 통한 API 문서 제공




---




## 🚀 실행 방법

```

# 1. 레포지토리 클론

git clone https://github.com/frog3oh35/slice-project2025.git

cd slice-project2025/BunnyLike

# 2. 패키지 설치

npm install

# 3. 서버 실행

npm start

```


* 서버 주소 : `http://localhost:3001`

* Swagger UI : `http://localhost:3001/api-docs`




---




## 📖 API 엔드 포인트


* `GET /api/posts` : 게시글 전체 조회

* `POST /api/posts` : 게시글 작성

* `DELETE /api/posts` : 게시글 삭제

* `PATCH /api/posts/{id}/like` : 좋아요




---




## 🧪 테스트


* Postman으로 수기 API 테스트

* Cypress로 UI E2E 테스트 (`cypress/e2e/post.cy.js` 참고)
