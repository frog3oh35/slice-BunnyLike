describe('🐰 BunnyLike 기본 플로우', () => {
    beforeEach(() => {
        cy.visit('/') //baseUrl 사용
    })

    it('모달 열고 게시글 작성 성공', () => {
        cy.get('[data-cy="open-modal"]').click()
        cy.get('[data-cy="username"]').type('연하토끼')
        cy.get('[data-cy="password"]').type('1234')
        cy.get('[data-cy="content"]').type('Cypress 입문 테스트!')
        cy.get('[data-cy="submit-post"]').click()

        // 새 글이 리스트에 존재하는지
        cy.contains('연하토끼').should('be.visible')
        cy.contains('Cypress 입문 테스트!').should('be.visible')
    })

    it('유효성 검사 실패(공백 입력) 경고 처리', () => {
        cy.get('[data-cy="open-modal"]').click()
        cy.get('[data-cy="submit-post"]').click()
        // alert 감지
        cy.on('window:alert', (txt) => {
            expect(txt).to.include('모든 필드를')
        })
    })

    it('좋아요 버튼 클릭 시 카운트 증가', () => {
        // 테스트용 게시글 먼저 생성
        cy.get('[data-cy="open-modal"]').click()
        cy.get('[data-cy="username"]').type('토끼')
        cy.get('[data-cy="password"]').type('1234')
        cy.get('[data-cy="content"]').type('좋아요 테스트용 글')
        cy.get('[data-cy="submit-post"]').click()

        // 모달이 닫힐 때까지 대기
        cy.get('[data-cy="modal"]').should('have.class', 'hidden')
        
        // DOM 업데이트 완료 대기
        cy.contains('좋아요 테스트용 글').should('be.visible')

        // 이벤트 바인딩 완료 대기 (중요!)
        cy.get('[data-cy="like-btn"]').should('exist').and('be.visible')

        // 클릭 전/후 카운트 비교
        cy.get('[data-cy="like-btn"]').first().find('.like-count').invoke('text').then((before) => {
            const prev = Number(before)
            cy.get('[data-cy="like-btn"]').first().click()

            // 좋아요 수 변경 확인
            cy.get('[data-cy="like-btn"]').first().find('.like-count').should(($span) => {
                const now = Number($span.text())
                expect(now).to.be.greaterThan(prev)
            })
        })
    })

    it('삭제 시 비밀번호 불일치 처리', () => {
        // 테스트용 게시글 생성
        cy.get('[data-cy="open-modal"]').click()
        cy.get('[data-cy="username"]').type('삭제토끼')
        cy.get('[data-cy="password"]').type('1234')
        cy.get('[data-cy="content"]').type('삭제 테스트 글')
        cy.get('[data-cy="submit-post"]').click()

        // 모달이 닫힐 때까지 대기
        cy.get('[data-cy="modal"]').should('have.class', 'hidden')
        
        // DOM 업데이트 완료 대기
        cy.contains('삭제 테스트 글').should('be.visible')
        cy.get('[data-cy="delete-btn"]').should('exist')

        // 글 삭제 시도 (틀린 비번)
        cy.get('[data-cy="delete-btn"]').first().click()
        cy.get('[data-cy="delete-password"]').type('틀린비번')
        cy.get('[data-cy="confirm-delete"]').click()
        cy.on('window:alert', (txt) => {
            expect(txt).to.match(/삭제 실패|찾을 수 없습니다/)
        })
    })

    it('삭제 성공 플로우', () => {
        // 테스트용 게시글 생성
        cy.get('[data-cy="open-modal"]').click()
        cy.get('[data-cy="username"]').type('성공토끼')
        cy.get('[data-cy="password"]').type('1234')
        cy.get('[data-cy="content"]').type('성공 삭제 테스트 글')
        cy.get('[data-cy="submit-post"]').click()

        // 모달이 닫힐 때까지 대기
        cy.get('[data-cy="modal"]').should('have.class', 'hidden')
        
        // DOM 업데이트 완료 대기
        cy.contains('성공 삭제 테스트 글').should('be.visible')
        cy.get('[data-cy="delete-btn"]').should('exist')

        // 정상 삭제
        cy.get('[data-cy="delete-btn"]').first().click()
        cy.get('[data-cy="delete-password"]').type('1234')
        cy.get('[data-cy="confirm-delete"]').click()
        cy.on('window:alert', (txt) => {
            expect(txt).to.include('삭제 성공')
        })
    })
})