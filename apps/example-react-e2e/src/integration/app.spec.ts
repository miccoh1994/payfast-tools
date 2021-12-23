import { getGreeting } from '../support/app.po';

describe('example-react', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    // Function helper example, see `../support/app.po.ts` file
    getGreeting().contains('yest this is a test');
    cy.get('form').submit();
    cy.get('#pay-with-wallet').contains('Complete Payment').click();
    cy.location('pathname', { timeout: 60000 })
      .should('include', '/success')
      .then(() => {
        cy.get('#success', {
          timeout: 20000,
        }).contains('Success');
      });
  });
});
