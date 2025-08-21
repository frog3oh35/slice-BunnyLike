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
    const { postId, username, password } = req.body || {};
    const paramId = req.params?.id;

    const trimmedUsername = username?.trim();
    const trimmedPassword = password?.trim();

    // id는 body.postId 또는 params.id 둘 다 허용
    const numericId = postId !== undefined ? Number(postId) : (paramId !== undefined ? Number(paramId) : NaN);

    if (!Number.isInteger(numericId) || !trimmedUsername || !trimmedPassword) {
        return res.status(400).json({ message: 'postId(또는 URL id), username, password는 필수입니다.' });
    }

    const index = posts.findIndex(
        post =>
            post.id === numericId &&
            post.username === trimmedUsername &&
            post.password === trimmedPassword
    );

    if (index === -1) {
        return res.status(404).json({ message: '해당 username/password 조합의 게시글을 찾을 수 없습니다.' });
    }

    posts.splice(index, 1);
    res.status(200).json({ message: '게시글이 삭제되었습니다.' });
};

const updatePost = (req, res) => {
    const { id } = req.params;
    const { password, content } = req.body;

    // 기본 검증
    if (!id || !password || typeof content !== 'string') {
        return res.status(400).json({ message: 'postId, password, content는 필수입니다.' });
    }

    const numbericId = Number(id);
    if (!Number.isInteger(numbericId)) {
        return res.status(400).json({ message: 'id는 정수여야 합니다.' });
    }

    const trimmed = content.trim();
    if (trimmed.length === 0) {
        return res.status(400).json({ message: '내용은 공백만 입력할 수 없습니다.' });
    }
    if (trimmed.length > 300) {
        return res.status(400).json({ message: '내용은 300자 이하여야 합니다.' });
    }

    // 대상 글 찾기
    const target = posts.find(p => p.id === numbericId);
    if (!target) {
        return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    // 비밀번호만으로 확인 (닉네임 불필요)
    if (target.password !== password) {
        return res.status(403).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // 업데이트
    target.content = trimmed;
    // 표시용 플래그가 필요하면 target.updated = true;

    return res.status(200).json({
        message: '게시글이 수정되었습니다.',
        post: { id: target.id, username: target.username, content: target.content, like: target.like }
    });
};


//좋아요 토글
const toggleLike = (req, res) => {
    const { id } = req.params;

    const numbericId = Number(id);
    if (!Number.isInteger(numbericId)) {
        return res.status(400).json({ message: 'id는 정수여야 합니다.' });
    }

    const post = posts.find(post => post.id === numbericId);

    if (!post) {
        return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    post.like += 1;
    res.status(200).json({
        id: post.id,
        like: true,
        totalLike: post.like
    });
};

module.exports = {
    createPost,
    getPosts,
    deletePost,
    toggleLike,
    updatePost
};