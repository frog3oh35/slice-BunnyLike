window.addEventListener('DOMContentLoaded', () => {
    const postList = document.getElementById('post-list');
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const submitBtn = document.getElementById('submit-post');
    const modal = document.getElementById('modal');

    // 게시글 전체 조회 및 렌더링
    const loadPosts = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/posts');
            const posts = await res.json();

            postList.innerHTML = ''; // 기존 목록 초기화

            if (posts.length === 0) {
                postList.innerHTML = '<p>게시글이 없습니다.</p>';
                return;
            }

            posts.forEach(post => {
                const div = document.createElement('div');
                div.className = 'post';
                div.innerHTML = `
                    <div><strong>${post.username}</strong></div>
                    <div>${post.content}</div>
                    <div>❤️ 좋아요 ${post.like}</div>
                `;
                postList.appendChild(div);
            });
        } catch (err) {
            postList.innerHTML = `<p>오류 발생: ${err.message}</p>`;
        }
    };

    // 모달 열기
    openModalBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    // 모달 닫기
    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // 게시글 업로드
    submitBtn.addEventListener('click', async () => {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const content = document.getElementById('content').value.trim();

        if (!username || !password || !content) {
            alert('모든 필드를 채워주세요!');
            return;
        }

        try {
            const res = await fetch('http://localhost:3001/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, content })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || '게시글 등록 실패');
                return;
            }

            alert('게시글이 등록되었습니다!');
            modal.classList.add('hidden');
            await loadPosts(); // 게시글 다시 불러오기
        } catch (err) {
            alert('서버 오류: ' + err.message);
        }
    });

    //최초 실행
    loadPosts();

});