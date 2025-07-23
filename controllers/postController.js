// 더미 게시글 데이터 가져오기
const posts = require('../data/dummyPosts');

// 게시글 목록 조회
const getPosts = (req, res) => {
    res.status(200).json(posts);
}

// 게시글 작성
const createPost = (req, res) => {
    const { title, content } = req.body;

    // 기본 유효성 검사
    if (!title || !content) {
        return res.status(400).json({ message: '제목과 내용은 필수입니다.' });
    }

    const newPost = {
        id: posts.length + 1,
        title,
        content,
        createdAt: new Date().toISOString()
    };

    posts.push(newPost);
    res.status(201).json(newPost);
};

// 다른 파일에서 이 함수들을 쓸 수 있게 내보내기
module.exports = {
    getPosts,
    createPost
};