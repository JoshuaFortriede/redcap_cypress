import {Given} from "cypress-cucumber-preprocessor/steps";
require('./parameter_types.js')
require('./mappings.js')

/**
 * @module Visibility
 * @author Adam De Fouw <aldefouw@medicine.wisc.edu>
 * @example I (should) see {string}
 * @param {string} text the text visually seen on screen
 * @description Visually verifies that text exists within the HTML object. NOTE: "should" is optional for readability.
 */
Given("I {see} {string}{iframeVisibility}", (see, text, iframe) => {
    const base = (iframe === " in the iframe") ? cy.frameLoaded().then(() => { cy.iframe() }) : cy.get(`body:contains(${JSON.stringify(text)}):visible`)
    base.within(($elm) => { cy.wrap($elm).should('contain', text) })
})

/**
 * @module Visibility
 * @author Adam De Fouw <aldefouw@medicine.wisc.edu>
 * @example I should NOT see {string}
 * @param {string} text the text visually seen on screen
 * @description Visually verifies that text does NOT exist within the HTML object.
 */
Given("I should NOT see {string}", (text) => {
    cy.get('html').then(($html) => { expect($html).to.not.contain(text) })
})

/**
 * @module Visibility
 * @author Adam De Fouw <aldefouw@medicine.wisc.edu>
 * @example I should see {string} in the title
 * @param {string} title the HTML page title
 * @description Visually verifies that text does exist in the HTML page title.
 */
Given("I should see {string} in the title", (title) => {
    cy.title().should('include', title)
})

/**
 * @module Visibility
 * @author Adam De Fouw <aldefouw@medicine.wisc.edu>
 * @example I should see the < dropdown | multiselect > field labeled {string} with the option {string} selected
 * @param {string} label - the label of the field
 * @param {string} option - the option selected
 * @description Selects a specific item from a dropdown
 */
Given('I should see the {dropdown_type} field labeled {string} with the option {string} selected', (type, label, option) => {
    let label_selector = `:contains("${label}"):visible`
    let element_selector = `select:has(option:contains("${option}")):visible`
    cy.top_layer(label_selector).within(() => {
        cy.get_labeled_element(element_selector, label).find(':selected').should('have.text', option)
    })
})

/**
 * @module Reporting
 * @author Tintin Nguyen <tin-tin.nguyen@nih.gov>
 * @example I should see the {dropdown_type} field labeled {string} with the options below
 * @param {string} selector the selector that identifies a dropbox
 * @param {string} label the label of the row the selector belongs to
 * @param {DataTable} options the Data Table of selectable options
 * @description Visibility - Visually verifies that the element selector labeled label has the options listed
 */
Given("I should see the {dropdown_type} field labeled {string} with the options below", (type, label, options) => {
    let label_selector = `:contains("${label}"):visible`

    cy.top_layer(label_selector).within(() => {
        for(let i = 0; i < options.rawTable[0].length; i++){
            let element_selector = `select:has(option:contains("${options.rawTable[0][i]}")):visible`
            let dropdown = cy.get_labeled_element(element_selector, label)
            dropdown.should('contain', options.rawTable[0][i])
            cy.wait(500)
        }
    })
})

/**
 * @module Visibility
 * @author Adam De Fouw <aldefouw@medicine.wisc.edu>
 * @example I should see a checkbox labeled {string} that is {check}
 * @param {string} label - the label associated with the checkbox field
 * @param {check} check - state of checkbox (check/unchecked)
 * @description Selects a checkbox field by its label
 */
Given("I should see a checkbox labeled {string} that is {check}", (field_type, label, check) => {
    let label_selector = `:contains("${label}"):visible`
    let element_selector = `input[type=checkbox]:visible`
    cy.top_layer(label_selector).within(() => {
        cy.get_labeled_element(element_selector, label).should(check === "checked" ? "be.checked" : "not.be.checked")
    })
})

/**
 * @module Visibility
 * @author Tintin Nguyen <tin-tin.nguyen@nih.gov>
 * @example I should see {string} in an alert box
 * @param {string} text - the text that should be displayed in an alert box
 * @description Visually verifies that the alert box contains text
 */
Given("I should see {string} in an alert box", (text) => {
    cy.on('window:alert',(txt)=>{
        //Mocha assertions
        expect(txt).to.contains(text);
    })
    cy.on('window:confirm', () => true)
})

/**
 * @module Visibility
 * @author Adam De Fouw <aldefouw@medicine.wisc.edu>
 * @example I should see the radio labeled {string} <checked|unchecked>
 * @param {string} label - the text that should be displayed in an alert box
 * @param {string} text - the text that should be displayed in an alert box
 * @description Visually verifies that the alert box contains text
 */
Given("I should see the radio labeled {string} with option {string} {select}", (label, option, selected) => {
    cy.select_radio_by_label(label, option, false, selected === 'selected')
})

/**
 * @module Visibility
 * @author Adam De Fouw <aldefouw@medicine.wisc.edu>
 * @example I should see a dialog containing the following text: {string}
 * @param {string} text - the text that should be displayed in a dialog box
 * @description Visually verifies that the dialog box contains text
 */
Given("I (should )see a dialog containing the following text: {string}", (text) => {
    cy.verify_text_on_dialog(text)
})

/**
 * @module Visibility
 * @author Corey DeBacker <debacker@wisc.edu>
 * @example I should see a < button | link > labeled {string}
 * @param {string} text - the label of the link that should be seen on screen (matches partially)
 * @description Verifies that a visible element of the specified type containing `text` exists
 */
Given("I should see a {LabeledElement} labeled {string}", (el, text) => {
    // double quotes need to be re-escaped before inserting into :contains() selector
    text = text.replaceAll('\"', '\\\"')
    let subsel = {'link':'a', 'button':'button'}[el]
    let sel = `${subsel}:contains("${text}"):visible` + (el === 'button' ? `,input[value="${text}"]:visible` : '')
    cy.get_top_layer(($e) => {expect($e.find(sel).length).to.be.above(0)})
})

/**
 * @module Visibility
 * @author Corey DeBacker <debacker@wisc.edu>
 * @example I should NOT see a < button | link > labeled {string}
 * @param {string} text - the label of the link that should not be seen on screen (matches partially)
 * @description Verifies that there are no visible elements of the specified type with the label `text`
 */
Given("I should NOT see a {LabeledElement} labeled {string}", (el, text) => {
    // double quotes need to be re-escaped before inserting into :contains() selector
    text = text.replaceAll('\"', '\\\"')
    let subsel = {'link':'a', 'button':'button'}[el]
    let sel = `${subsel}:contains("${text}"):visible` + (el === 'button' ? `,button[value="${text}"]:visible` : '')
    cy.get_top_layer(($e) => {console.log(sel);expect($e.find(sel)).to.have.lengthOf(0)})
})

/**
 * @module Visibility
 * @author Adam De Fouw <aldefouw@medicine.wisc.edu>
 * @example I should see {string} in the data entry form field labeled {string}
 * @param {string} text - the text that should be in the field
 * @param {string} label - the label of the field
 * @description Identifies specific text string in a field identified by a label.
 */
Given('I should see {string} in the data entry form field labeled {string}', (text, label) => {
    cy.contains('label', label)
        .invoke('attr', 'id')
        .then(($id) => {
            cy.get('[name="' + $id.split('label-')[1] + '"]').should('have.value', text)
        })
})

/**
 * @module Visibility
 * @author Adam De Fouw <aldefouw@medicine.wisc.edu>
 * @example I (should) see (a(n)) {string} within the {string} row of the column labeled {string}(table_name)
 * @param {string} table_item - the item that you are searching for - includes "checkmark", "x", or any {string}
 * @param {string} row_label - the label of the table row
 * @param {string} column_label - the label of the table column
 * @param {string} table_name - optional table item - " of the User Rights table"
 * @description Identifies specific text or special item within a cell on a table based upon row and column labels
 */
Given("I (should )see (a )(an ){string} within the {string} row of the column labeled {string}{tableName}", (item, row_label, column_label, table) => {
    if(Cypress.$('div#working').length) cy.get('div#working').should('not.be.visible')
    if(Cypress.$('div#report_load_progress').length) cy.get('div#report_load_progress').should('not.be.visible')

    const user_rights = { "checkmark" : `img[src*="tick"]`, "x" : `img[src*="cross"]` }

    cy.table_cell_by_column_and_row_label(column_label, row_label).then(($td) => {
        if(table === " of the User Rights table" && item.toLowerCase() in user_rights){
            expect($td.find(user_rights[item.toLowerCase()]).length).to.be.eq(1)
        } else {
            expect($td).to.contain(item)
        }
    })
})

/**
 * @module Visibility
 * @author Rushi Patel <rushi.patel@uhnresearch.ca>
 * @example I should see {string} in the < optional type > table
 * @param {string} text - text to look for
 * @param {string} type - options: < logging | browse users | file repository >
 * @description Identify specific text within a table
 */
Given('I should see {string} in the {tableTypes} table', (text, table_type = 'a') => {
    let selector = window.tableMappings[table_type]
    cy.get(`${selector}:visible`).contains('td', text, { matchCase: false });
})

/**
 * @module Visibility
 * @author Adam De Fouw <aldefouw@medicine.wisc.edu>
 * @example I should see project status of {projectStatus}
 * @param {string} status - the project status to look for
 * @description Identify project status
 */
Given('I (should )see Project status: "{projectStatus}"', (status) => {
    cy.get('div.menubox:contains("Project status:")').contains(status);
})

/**
 * @module Visibility
 * @author Adam De Fouw <aldefouw@medicine.wisc.edu>
 * @example I (should) see a table row containing the following text in the {tableType} table:
 * @param {string} dataTable - table row we are expecting to see where cells are delimited by pipe characters e.g. | text to search for in cell |
 * @description Allows us to check tabular data rows within REDCap
 */
Given('I (should )see (a )table {headerOrNot}row(s) containing the following values in (the ){tableTypes} table:', (header, table_type = 'a', dataTable) => {
    let selector = window.tableMappings[table_type]
    let tabular_data = dataTable['rawTable']
    let row_selector = ''

    //If we are including the table header, we are also going to match specific columns
    if(header === "header and "){
        let columns = []
        let header = tabular_data[0]

        //Establish what column indexes are relevant
        cy.get(`${selector}:visible tr:visible:first td,th`).then((elements) => {
            elements.each((index, element) => {
                header.forEach((cell) => {
                    if (element.textContent.includes(cell)) {
                        columns.push(index)
                    }
                })
            })
        })

        //Find the rows that contain the data we are looking for
        tabular_data.forEach((row, index) => {
            if(index > 0){
                row_selector = `${selector}:visible tr:visible`
                row.forEach((element) => {
                    //If we find a match for a date or time formatting string
                    if(!window.dateFormats.hasOwnProperty(element)){
                        row_selector += `:has(td:contains(${JSON.stringify(element)}))`
                    }
                })

                cy.get(row_selector).should('have.length.greaterThan', 0)

                cy.get(row_selector).then((row) => {
                    cy.wrap(row).find('td').then(($td) => {
                        $td.each((tdi, td) => {
                            columns.forEach((col_num) => {
                                if(col_num === tdi){

                                    if(window.dateFormats.hasOwnProperty(dataTable['rawTable'][index][tdi])){

                                        cy.wrap(td).should(($element) => {
                                            const textContent = $element.text()
                                            const current = dataTable['rawTable'][index][tdi]
                                            const regex = window.dateFormats[current]
                                            expect(textContent).to.match(regex)
                                        })

                                    } else {
                                        //Verify the specific column exists where we expect
                                        expect(td).to.contain(dataTable['rawTable'][index][tdi])
                                    }
                                }
                            })
                        })
                    })
                })
            }
        })

    //Only matching on whether this row exists in the table.  Cells are in no particular order because we have no header to match on.
    } else {
        cy.get(`${selector}:visible`).within(() => {
            tabular_data.forEach((row) => {
                row_selector = 'tr:visible'
                row.forEach((element) => { row_selector += `:has(td:contains(${JSON.stringify(element)}))` })
                cy.get(row_selector).should('have.length.greaterThan', 0)
            })
        })

    }
})