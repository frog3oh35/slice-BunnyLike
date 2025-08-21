describe('🐰 BunnyLike 기본 플로우', () => {
    beforeEach(() => {
        cy.intercept('GET', '**/api/posts').as('getPosts')
        cy.intercept('POST', '**/api/posts').as('createPost')
        cy.intercept('DELETE', '**/api/posts').as('deletePost')
        cy.intercept('PATCH', '**/api/posts/*/like').as('likePost')
        cy.visit('/')
        cy.wait('@getPosts')
    })

    const createPost = (username, password, content) => {
        cy.get('[data-cy="open-modal"]').click()
        cy.get('[data-cy="username"]').clear().type(username)
        cy.get('[data-cy="password"]').clear().type(password)
        cy.get('[data-cy="content"]').clear().type(content)
        cy.window().then((win) => cy.stub(win, 'alert').as('alert'))
        cy.get('[data-cy="submit-post"]').click()
        cy.wait('@createPost')
        cy.wait('@getPosts')
        cy.get('@alert').should('have.been.calledWithMatch', /등록되었습니다/)
        cy.get('[data-cy="modal"]').should('have.class', 'hidden')
        cy.contains(content).should('be.visible')
    }

    it('모달 열고 게시글 작성 성공', () => {
        createPost('연하토끼', '1234', 'Cypress 입문 테스트!')
        cy.contains('연하토끼').should('be.visible')
        cy.contains('Cypress 입문 테스트!').should('be.visible')
    })

    it('유효성 검사 실패(공백 입력) 경고 처리', () => {
        cy.get('[data-cy="open-modal"]').click()
        cy.window().then((win) => cy.stub(win, 'alert').as('alert'))
        cy.get('[data-cy="submit-post"]').click()
        cy.get('@alert').should('have.been.calledWithMatch', /모든 필드를/)
        cy.get('[data-cy="modal"]').should('not.have.class', 'hidden')
    })

    it('좋아요 버튼 클릭 시 카운트 증가', () => {
        const content = '좋아요 테스트용 글'
        createPost('토끼', '1234', content)

        cy.contains('[data-cy="post"]', content)
            .find('[data-cy="like-btn"] .like-count')
            .invoke('text')
            .then((before) => {
                const prev = Number(before)
                cy.contains('[data-cy="post"]', content)
                    .find('[data-cy="like-btn"]')
                    .click()
                cy.wait('@likePost')
                cy.contains('[data-cy="post"]', content)
                    .find('[data-cy="like-btn"] .like-count')
                    .should(($span) => {
                        const now = Number($span.text())
                        expect(now).to.be.greaterThan(prev)
                    })
            })
    })

    it('삭제 시 비밀번호 불일치 처리', () => {
        const content = '삭제 테스트 글'
        createPost('삭제토끼', '1234', content)

        cy.contains('[data-cy="post"]', content).within(() => {
            cy.get('[data-cy="delete-btn"]').click()
        })
        cy.get('[data-cy="delete-modal"]').should('be.visible')
        cy.get('[data-cy="delete-password"]').type('틀린비번')
        cy.window().then((win) => cy.stub(win, 'alert').as('alert'))
        cy.get('[data-cy="confirm-delete"]').click()
        cy.wait('@deletePost')
        cy.get('@alert').should('have.been.calledWithMatch', /삭제 실패|찾을 수 없습니다/)
        cy.get('[data-cy="delete-modal"]').should('have.class', 'hidden')
        cy.contains(content).should('exist')
    })

    it('삭제 성공 플로우', () => {
        const content = '성공 삭제 테스트 글'
        createPost('성공토끼', '1234', content)

        cy.contains('[data-cy="post"]', content).within(() => {
            cy.get('[data-cy="delete-btn"]').click()
        })
        cy.get('[data-cy="delete-modal"]').should('be.visible')
        cy.get('[data-cy="delete-password"]').type('1234')
        cy.window().then((win) => cy.stub(win, 'alert').as('alert'))
        cy.get('[data-cy="confirm-delete"]').click()
        cy.wait('@deletePost')
        cy.wait('@getPosts')
        cy.get('@alert').should('have.been.calledWithMatch', /삭제 성공/)
        cy.contains(content).should('not.exist')
    })
})