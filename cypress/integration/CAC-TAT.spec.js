
/// <reference types="Cypress" />


describe('Central de Atendimento ao Cliente TAT', function() {
  const CTS12 = 3000
  beforeEach(function() {
    cy.visit('./src/index.html')
  })

  it('verifica o título da aplicação', function() {
      cy.title().should('be.equal','Central de Atendimento ao Cliente TAT')
    })

    const textao = 'Cara, vou te falar que os Correios são uma desgraça. Pessoal com má vontade, fazem o trabalho de qualquer jeito e se acham os donos da razão'
    it('Preencha os campos obrigatórios e envia o formulárioo EX1', function() {
      cy.clock()
      
      cy.get('#firstName').type('Rafael Augusto')
      cy.get('#lastName').should('be.visible').type('Martins Fernandes')
      cy.get('#email').should('be.visible').type('rafaelmfernandes7@gmail.com')
      cy.get('#open-text-area').should('be.visible').type('oieeee, wololo', {delay: 3})
      cy.get('button[type="submit"]').click().should('be.visible', 'Mensagem enviada com sucesso')
      cy.get('.success').should('be.visible')

      cy.tick(CTS12)
      cy.get('.success').should('not.be.visible')

    })

    it('Exibir mensagem de erro com email inválido EX2', function() {
      cy.clock()
  
      cy.get('#firstName').type('Rafael Augusto')
      cy.get('#lastName').should('be.visible').type('Martins Fernandes')
      cy.get('#email').should('be.visible').type('rafaelmfernandes7@gmail,,,,com')
      cy.get('#open-text-area').should('be.visible').type(textao, {delay: 3})
      cy.get('button[type="submit"]').click()
      cy.get('.error').should('be.visible')

      cy.tick(CTS12)
      cy.get('.error').should('not.be.visible')
    })

    it('Campo de número deve continuar vazio EX3', function()  {
      cy.get('#phone').should('be.visible')
        .type('wololo')
        .should('have.value','') // valor vai ter que estar vazio, por isso setar o vazio como valor
    })

    it('Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário EX4', function()  {
      cy.get('#firstName').type('Rafael Augusto')
      cy.get('#lastName').type('Martins Fernandes')
      cy.get('#email').type('rafaelmfernandes7@gmail.com')
      cy.get('#phone-checkbox').check()
      cy.get('#open-text-area').type('Wololo')
      cy.get('button[type="submit"]').click()
      cy.get('.error').should('be.visible')
    })

    it('Preenche e limpa os campos nome, sobrenome, email e telefone EX5', function() {
      cy.get('#firstName').type('Rafael Augusto').should('have.value', 'Rafael Augusto').clear().should('have.value', '')
      cy.get('#lastName').type('Martins Fernandes').should('have.value', 'Martins Fernandes').clear().should('have.value', '')
      cy.get('#email').type('rafaelmfernandes7@gmail.com').should('have.value', 'rafaelmfernandes7@gmail.com').clear().should('have.value', '')
      cy.get('#phone').type('1234567890').should('have.value', '1234567890').clear().should('have.value', '')
    })

    it('Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios EX6', function()  {
      cy.clock()
      cy.get('button[type="submit"]').click()
      cy.get('.error').should('be.visible')

      cy.tick(CTS12)
      cy.get('.success').should('not.be.visible')
    })

    it('Envia o formuário com sucesso usando um comando customizado EX7', function()  {
      cy.fillMandatoryFieldsAndSubmit()
      cy.get('.success').should('be.visible')
    })

    it('Envia o formuário com sucesso usando um comando customizado EX8', function()  {
      cy.get('#firstName').type('Rafael Augusto')
      cy.get('#lastName').should('be.visible').type('Martins Fernandes')
      cy.get('#email').should('be.visible').type('rafaelmfernandes7@gmail.com')
      cy.get('#open-text-area').should('be.visible').type('oieeee, wololo', {delay: 3})
      cy.contains('button', 'Enviar').click().should('be.visible', 'Mensagem enviada com sucesso')
    })

    it('Seleciona o produto Youtube no select', function() { 
      cy.get('#product')
      .select('YouTube')
      .should('have.value', 'youtube')
    })

    it('Seleciona um produto (Mentoria) por seu valor (value)', function() { 
      cy.get('#product')
      .select('Mentoria')
      .should('have.value', 'mentoria')
    })

    it('Seleciona um produto (Blog) por seu índice', function() { 
      cy.get('#product')
      .select(1)
      .should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', function() { 
      cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should('have.value', 'feedback')
    })

    it('marca cada tipo de atendimento', function() { 
      cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should('have.value', 'feedback')
    })

    it('marca cada tipo de atendimento', function() { 
      cy.get('input[type="radio"]')
      .should('have.length', 3)
      .each(function($radio) {
        cy.wrap($radio).check()
        cy.wrap($radio).should('have.checked', 'feedback')
      })
    })
    it('marca ambos checkboxes, depois desmarca o último', function() { 
      cy.get('input[type="checkbox"]')
      .check()
      .should('be.checked')
      .last()
      .uncheck()
      .should('not.be.checked')
    })
    
    it('marca cada tipo de atendimento', function() { 
      cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should('have.value', 'feedback')
    })

    it('seleciona o arquivo da pasta fixtures', function() {
      cy.get('input[type="file"]')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json')
      .should(function($input)  {
        expect($input[0].files[0].name).to.equal('example.json')
      })
    })

    it('seleciona um arquivo simulando um drag-and-drop', function() {
      cy.get('input[type="file"]')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop'})
      .should(function($input)  {
        expect($input[0].files[0].name).to.equal('example.json')
      })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function() {
      cy.fixture('example.json').as('ExampleFile')
      cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('@ExampleFile')
        .should(function($input)  {
        expect($input[0].files[0].name).to.equal('example.json')
      })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique S8EX', function() {
      cy.get('#privacy a')
      .should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link S8EXTRA1', function() {
      cy.get('#privacy a')
      .invoke('removeAttr', 'target')
      .click()
      cy.contains('Talking About Testing').should('be.visible')
    })

    
    it('testa a página da política de privacidade de forma independente S8EXTRA2', function() {
      cy.visit('./src/privacy.html')
      cy.contains('Talking About Testing').should('be.visible')
    })

    Cypress._.times(3, function() {
      it('Preenche e limpa os campos nome, sobrenome, email e telefone 3 vezes', function() {
        cy.get('#firstName').type('Rafael Augusto').should('have.value', 'Rafael Augusto').clear().should('have.value', '')
        cy.get('#lastName').type('Martins Fernandes').should('have.value', 'Martins Fernandes').clear().should('have.value', '')
        cy.get('#email').type('rafaelmfernandes7@gmail.com').should('have.value', 'rafaelmfernandes7@gmail.com').clear().should('have.value', '')
        cy.get('#phone').type('1234567890').should('have.value', '1234567890').clear().should('have.value', '')
      })
    })

    it('Exibe e esconde as mensagens de sucesso e erro usando o .invoke INVOKES12', function() {
      cy.get('.success')
        .should('not.be.visible')
        .invoke('show')
        .should('be.visible')
        .and('contain', 'Mensagem enviada com sucesso.')
        .invoke('hide')
        .should('not.be.visible')
      cy.get('.error')
        .should('not.be.visible')
        .invoke('show')
        .should('be.visible')
        .and('contain', 'Valide os campos obrigatórios!')
        .invoke('hide')
        .should('not.be.visible')
    })

    it('Preenche a area de texto usando o comando invoke INVOKE2S12',  function () {
      cy.get('#open-text-area')
        .invoke('val', textao)
        .should('have.value', textao)
      cy.get('button[type="submit"]').click()
      cy.get('.error').should('be.visible')
    })

      it('Faz uma requisição HTTP', function() {
        cy.request({
          method: 'GET',
          url: 'https://cac-tat.s3.eu-central-1.amazonaws.com/index.html'
        })
          .should(function(response) {
            const{status, statusText, body} = response
            expect(status).to.equal(200)
            expect(statusText).to.equal('OK')
            expect(body).to.include('CAC TAT')
        })
        // .its('statusText').should('equal', 'OK')
        // .its('body').should('contain', 'CAC TAT')
      })
        it.only('Encontra o gatinho DESAFIO FINAL', function() {
          cy.fillMandatoryFieldsAndSubmit()
          cy.get('#cat')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
          cy.get('#title')
            .invoke('text', 'é o UUUUU DO URUBUUU')
          cy.get('#open-text-area').should('be.visible').type('Preenchi e ainda coloquei o gatinho na tela', {delay: 3})
            .should('be.visible')

        })
    })


  