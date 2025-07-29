window.addEventListener('DOMContentLoaded', async () => {
    const postList = document.getElementById('post-list');
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modal = document.getElementById('modal');
    const submitBtn = document.getElementById('submit-post');
    const deleteModal = document.getElementById('delete-modal');
    const deleteUsernameText = document.getElementById('delete-post-username');
    const deletePasswordInput = document.getElementById('delete-password');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

    let deleteTargetId = null;
    let deleteTargetUsername = null;

    // 게시글 렌더링
    try {
        const res = await fetch('http://localhost:3001/api/posts');
        const posts = await res.json();

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
                <div>❤️ 좋아요: ${post.like}</div>    
                <button class="delete-btn" data-id="${post.id}" data-username="${post.username}">삭제</button>
            `;
            postList.appendChild(div);
        });

        // 삭제 요청
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                deleteTargetId = btn.dataset.id;
                deleteTargetUsername = btn.dataset.username;
                deleteUsernameText.textContent = `작성자: ${deleteTargetUsername}`;
                deletePasswordInput.value = '';
                deleteModal.classList.remove('hidden');
            });
        });

    } catch (err) {
        postList.innerHTML = `<p>오류 발생: ${err.message}</p>`;
    }

    // 모달 열기
    openModalBtn.addEventListener('click', () => {
        console.log('👉 버튼 클릭됨!');
        modal.classList.remove('hidden');
    });

    // 모달 닫기
    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });


    // 게시글 등록
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

            if (!res.ok) {
                const error = await res.json();
                alert(error.message || '오류가 발생했어요!');
                return;
            }

            alert('게시글이 등록되었습니다!');
            modal.classList.add('hidden');
            location.reload(); // 새로고침으로 게시글 반영
        } catch (err) {
            alert('서버 오류 발생: ' + err.message);
        }
    });



    // 삭제 취소
    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.classList.add('hidden');
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
            location.reload();
        } catch (err) {
            alert('서버 오류: ' + err.message);
        }
    });
});

