import {Given} from "cypress-cucumber-preprocessor/steps";

/**
 * @module DevelopmentOnly
 * @example I want to pause
 * @description Pauses the Cypress session. NOTE: Should only be used during development of tests.
 */
Given("I want to pause", () => {
    cy.pause()
})