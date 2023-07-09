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
  JOB_IDS,
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

// title, salary, equity, companyHandle
/************************************** findAll */
describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        title: "j1",
        salary: 150000,
        equity: "0.50",
        companyHandle: "c1"
      },
      {
        title: "j2",
        salary: 100000,
        equity: "0.10",
        companyHandle: "c2"
      },
      {
        title: "j3",
        salary: 50000,
        equity: "0.001",
        companyHandle: "c3"
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  console.log('job id => \n ', JOB_IDS);
  const c1Id = JOB_IDS[0];
  test("works", async function () {
    let job = await Job.get(c1Id);
    expect(job).toEqual({
        title: "j1",
        salary: 150000,
        equity: "0.50",
        companyHandle: "c1"
    });
  });

  test("not found if no such company", async function () {
    try {
      await Company.get("nope");
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});