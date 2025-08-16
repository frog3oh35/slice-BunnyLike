// 더미 게시글 데이터 가져오기
const posts = require('../data/dummyPosts');
let postId = 1;

// 게시글 작성
const createPost = (req, res) => {
    const { username, password, content } = req.body;

    // 공백 제거한 버전
    const trimmedUsername = username?.trim();
    const trimmedPassword = password?.trim();
    const trimmedContent = content?.trim();

    // 유효성 검사용 정규식 (이모지 및 특수문자)
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    const htmlTagRegex = /<[^>]*>/g;
    const specialCharRegex = /[~!@#$%^&*()+={}[\]|\\:;"'<>,.?/_]/;

    // 공백만 입력 또는 필드 누락
    if (!trimmedUsername || !trimmedPassword || !trimmedContent) {
        return res.status(400).json({ message: '닉네임, 비밀번호, 내용은 공백 없이 입력해야 합니다.' });
    }


    // username 유효성 검사
    if (
        trimmedUsername.length < 2 || emojiRegex.test(trimmedUsername) || htmlTagRegex.test(trimmedUsername) || specialCharRegex.test(trimmedUsername)
    ) {
        return res.status(400).json({ message: 'username은 2자 이상, 공백/특수문자/이모지 없이 입력해야 합니다.' });
    }

    // password 유효성 검사
    if (
        trimmedPassword.length < 4 || /\s/.test(password) || emojiRegex.test(trimmedPassword) || htmlTagRegex.test(trimmedPassword)
    ) {
        return res.status(400).json({ message: '비밀번호는 4자 이상, 공백/이모지 없이 입력해야 합니다.' });
    }

    // content 유효성 검사
    if (trimmedContent.length > 300) {
        return res.status(400).json({ message: '내용은 300자 이하여야 합니다.' })
    }


    const newPost = {
        id: postId++,
        username: trimmedUsername,
        password: trimmedPassword,
        content: trimmedContent,
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
    const { postId, username, password } = req.body;

    if (!postId || !username || !password) {
        return res.status(400).json({ message: 'username과 password는 필수입니다.' });
    }

    const index = posts.findIndex(
        post =>
            post.id === postId &&
            post.username === username &&
            post.password === password
    );

    if (index === -1) {
        return res.status(404).json({ message: '해당 username/password 조합의 게시글을 찾을 수 없습니다.' });
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

    post.like += 1;
    res.status(200).json({
        postId: post.id,
        like: true,
        totalLike: post.like
    });
};

module.exports = {
    createPost,
    getPosts,
    deletePost,
    toggleLike
};