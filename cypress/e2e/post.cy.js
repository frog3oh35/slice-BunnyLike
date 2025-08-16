describe('🐰 초미니 API 테스트', () => {
    it('모달 열고 게시글 작성 후 토끼 조아요', () => {
        cy.visit('http://localhost:3001');

        cy.get('.like-btn').first().then($btn => {
            const id = $btn.attr('data-id');
            cy.log('타겟 postId:', id);
        });

        cy.get('.like-btn').first().click({ force: true });

        cy.wait(1000);

        cy.get('.like-btn').first().click({ force: true });

        cy.wait(1000);

        cy.get('#open-modal-btn').click();
        cy.get('#username').type('연하');
        cy.get('#password').type('1234');
        cy.get('#content').type('초미니 E2E...');
        cy.get('#submit-post').click();
    });
});