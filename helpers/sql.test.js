"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("./sql.js")

/** Sql Partial Update */



describe("sqlPartialUpdate function", function () {
    let dataToUpdate = {
        name: 'new name', 
        numEmployees: 50, 
        logoUrl: 'newlogo'
    }

    let jsToSql = {
        name: "name", 
        numEmployees: "num_employees", 
        logoUrl: "logo_url"
    }


    test("test correct return object", function () {
        const result = sqlForPartialUpdate(dataToUpdate, jsToSql)

        expect(result).toEqual({
            setCols: '"name"=$1, "num_employees"=$2, "logo_url"=$3',
            values: ['new name', 50, 'newlogo']
        });
    });

    test("test failed return object, with incorrect jsToSql", function () {
        jsToSql = {
            randomKey1: "name", 
            randomKey2: "num_employees", 
            randomKey3: "logo_url"
        }
        const result = sqlForPartialUpdate(dataToUpdate, jsToSql)

        expect(result).toEqual({
            setCols: '"name"=$1, "numEmployees"=$2, "logoUrl"=$3',
            values: ['new name', 50, 'newlogo']
        });
    });

    test("test failed return object, with empty data", function () {
        dataToUpdate = {};
        jsToSql = {};
        
        expect(() => sqlForPartialUpdate(dataToUpdate, jsToSql))
        .toThrow(BadRequestError, 'No data');
    });
});