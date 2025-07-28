const express = require('express');
const router = express.Router();
const {
    createPost,
    getPosts,
    deletePost,
    toggleLike
} = require('../controllers/postController')

// 게시글 등록
router.post('/', createPost);

// 게시글 전체 조회
router.get('/', getPosts);

// 게시글 삭제
router.delete('/', deletePost);

// 좋아요 토글
router.patch('/:id/like', toggleLike);

module.exports = router;

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: 게시글 전체 조회
 *     description: 저장된 모든 게시글을 최신순으로 반환합니다.
 *     responses:
 *       200:
 *         description: 게시글 목록 반환 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: 게시글 작성
 *     description: username, password, content를 받아 새 게시글을 저장합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - content
 *             properties:
 *               username:
 *                 type: string
 *                 description: 작성자 닉네임 (2자 이상)
 *               password:
 *                 type: string
 *                 description: 게시글 삭제를 위한 비밀번호 (4자 이상)
 *               content:
 *                 type: string
 *                 description: 게시글 내용 (300자 이하)
 *     responses:
 *       201:
 *         description: 게시글 작성 성공
 *       400:
 *         description: 필드 누락 또는 유효성 검증 실패
 */

/**
 * @swagger
 * /api/posts:
 *   delete:
 *     summary: 게시글 삭제
 *     description: username과 password를 입력받아 특정 ID의 게시글을 삭제합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: 게시글이 삭제되었습니다.
 *       '400':
 *         description: username과 password는 필수입니다.
 *       '404':
 *         description: 해당 ID의 게시글을 찾을 수 없습니다.
 */

/**
 * @swagger
 * /api/posts/{id}/like:
 *   patch:
 *     summary: 게시글 좋아요 증가
 *     description: 특정 게시글에 좋아요를 1 증가시킵니다.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 좋아요를 누를 게시글 ID
 *     responses:
 *       200:
 *         description: 좋아요 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 postId:
 *                   type: integer
 *                 like:
 *                   type: boolean
 *                 totalLike:
 *                   type: integer
 *       404:
 *         description: 게시글을 찾을 수 없음
 */
