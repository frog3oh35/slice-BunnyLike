window.addEventListener('DOMContentLoaded', () => {
    const postList = document.getElementById('post-list');
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const submitBtn = document.getElementById('submit-post');
    const modal = document.getElementById('modal');

    const deleteModal = document.getElementById('delete-modal');
    const deleteUsernameText = document.getElementById('delete-post-username');
    const deletePasswordInput = document.getElementById('delete-password');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

    let deleteTargetId = null;
    let deleteTargetUsername = null;

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
                    <div class="username_css"><strong>${post.username}</strong></div>
                    <div class="content_css">${post.content}</div>
                    <div class="post-footer">
                        <button class="like-btn" data-id="${post.id}">
                            <img src="bunny-outline.svg" alt="like" class="bunny-icon" />
                            <span class="like-count">${post.like}</span>
                        </button>
                        <button class="delete-btn" data-id="${post.id}" data-username="${post.username}">삭제</button>
                    </div>
                `;
                postList.appendChild(div);
            });
        } catch (err) {
            postList.innerHTML = `<p>오류 발생: ${err.message}</p>`;
        }
    };

    // 삭제 버튼 이벤트 바인딩
    const attachDeleteEvents = () => {
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                deleteTargetId = btn.dataset.id;
                deleteTargetUsername = btn.dataset.username;
                deleteUsernameText.textContent = `작성자: ${deleteTargetUsername}`;
                deletePasswordInput.value = '';
                deleteModal.classList.remove('hidden');
            });
        });
    };

    // 좋아요 이벤트 바인딩 함수
    const attachLikeEvents = () => {
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const postId = btn.dataset.id;
                const img = btn.querySelector('img');
                const likeCountSpan = btn.querySelector('.like-count');

                try {
                    const res = await fetch(`http://localhost:3001/api/posts/${postId}/like`, {
                        method: 'PATCH'
                    });

                    const result = await res.json();

                    if (!res.ok) {
                        alert(result.message || '좋아요 실패');
                        return;
                    }

                    // UI에 좋아요 수 업데이트
                    likeCountSpan.textContent = result.totalLike;

                    // 애니메이션 효과 추가
                    btn.classList.add('liked');
                    img.src = 'bunny-fill.svg';

                    setTimeout(() => {
                        btn.classList.remove('liked');
                        img.src = 'bunny-outline.svg';
                    }, 350);
                } catch (err) {
                    alert('서버 오류: ' + err.message);
                }
            });
        });
    };

    // 모달 열기
    openModalBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });
    // 모달 닫기
    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.classList.add('hidden');
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
            attachDeleteEvents();
        } catch (err) {
            alert('서버 오류: ' + err.message);
        }
    });

    // 삭제 요청
    confirmDeleteBtn.addEventListener('click', async () => {
        const password = deletePasswordInput.value.trim();
        if (!password) {
            alert('비밀번호를 입력해주세요.');
            return;
        }

        try {
            const res = await fetch('http://localhost:3001/api/posts', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postId: Number(deleteTargetId),
                    username: deleteTargetUsername,
                    password: password
                })
            });

            const result = await res.json();

            if (!res.ok) {
                alert(result.message || '삭제 실패');
                return;
            }

            alert('삭제 성공!');
            deleteModal.classList.add('hidden');
            await loadPosts();
            attachDeleteEvents();
        } catch (err) {
            alert('서버 오류: ' + err.message);
        }
    });

    // 최초 실행
    loadPosts().then(() => {
        attachDeleteEvents();
        attachLikeEvents();
    });

});