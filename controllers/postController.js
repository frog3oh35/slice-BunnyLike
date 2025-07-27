// 더미 게시글 데이터 가져오기
const posts = require('../data/dummyPosts');
let postId = 1;

// 게시글 작성
const createPost = (req, res) => {
    const { username, password, content } = req.body;

    // 기본 유효성 검사
    if (!username || !password || !content) {
        return res.status(400).json({ message: '닉네임, 비밀번호, 내용은 필수입니다.' });
    }

    if (username.length < 2 || password.length < 4 || content.length > 300) {
        return res.status(400).json({ message: '입력 조건을 확인하세요' });
    }

    const newPost = {
        id: postId++,
        username,
        password,
        content,
        like: 0, // 기본값
    };

    posts.unshift(newPost); // 최신순 정렬을 위해 앞에 추가
    res.status(201).json(newPost);
};

// 게시글 전체 조회
const getPosts = (req, res) => {
    res.status(200).json(posts);
};

// 게시글 삭제
const deletePost = (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    const index = posts.findIndex(post => post.id == parseInt(id));

    if (index === -1) {
        return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    if (posts[index].password !== password) {
        return res.status(403).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    posts.splice(index, 1);
    res.status(200).json({ message: '게시글이 삭제되었습니다.' });
};

//좋아요 토글
const toggleLike = (req, res) => {
    const { id } = req.params;

    const post = posts.find(post => post.id === parseInt(id));

    if (!post) {
        return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    post.likes += 1;
    res.status(200).json({
        postId: post.id,
        like: true,
        totalLike: post.likes
    });
};

module.exports = {
    createPost,
    getPosts,
    deletePost,
    toggleLike
};