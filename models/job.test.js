"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const Company = require("./company.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */
describe("create new job", function () {
  const newJob = {
    title: "new",
    salary: 107000,
    equity: "0.068",
    company_handle: "c1"
  };

  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual(newJob);

    const result = await db.query(
          `SELECT title, salary, equity, company_handle
           FROM jobs
           WHERE title = 'new'`);
    expect(result.rows[0]).toEqual(
      {
        title: "new",
        salary: 107000,
        equity: "0.068",
        company_handle: "c1"
      },
    );
  });
});

// title, salary, equity, companyHandle
/************************************** _whereClauseGen */
describe("_whereClauseGen", function()  {
  test("returns correct object with all params passed in",
  function () {
    let whereClause = Job._whereClauseGen('dev', 150000, .50, 'c1');
    expect(whereClause).toEqual(
      {
        where:
        'WHERE title ILIKE $1 AND salary = $2 AND equity = $3 AND company_handle ILIKE $4',
        values: [ "%dev%", 150000, .50, "%c1%" ]
      }
    )
  });

  test("returns empty object", function () {
      let whereClause = Job._whereClauseGen();
      expect(whereClause).toEqual(
        { where: '', values: [] }
      )
  });
});
