"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");


/** Sql Partial Update */

describe("createToken", function () {