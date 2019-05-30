// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

//Set base URL from the environment variable that was set
Cypress.config("baseUrl", Cypress.env("baseUrl"));

const users = Cypress.env("users");
const admin_user = users['admin']['user'];
const admin_pass = users['admin']['pass'];

before(() => {
    //Clear out all cookies
    cy.clearCookies();

    //This will establish the base url for Cypress
    cy.visit('/');

    //Create the initial database structure
    cy.mysql_db('structure');
  
    //Set the Base URL in the REDCap Configuration Database
    const base_url = 'BASE_URL/' + Cypress.env('baseUrl').replace('http://', 'http\\:\\\\/\\\\/');

    //Seeds the database before each test
    cy.mysql_db('seeds', base_url)

    //Login to the system
    cy.login( { username: admin_user, password: admin_pass } )
});

beforeEach(() => {
    //Preserve the cookies before each test
    Cypress.Cookies.preserveOnce('PHPSESSID', 'ckppd7m1u5qgoh7k3mpankr8i1')
})

Cypress.on("uncaught:exception", (err, runnable) => {
  console.debug(">> uncaught:exception disabled in cypress/support/index.js");
  return false;  // prevents Cypress from failing the test
});