"use strict";

const e = require("cors");
const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Job {
    /** Create a jab (from data), update db, return new job data.
     *
     * data should be { id, title, salary, equity, company_handle }
     *
     * Returns { title, salary, equity, company_handle }
     *
     * Throws BadRequestError if job already in database.
     * */

    static async create({ title, salary, equity, company_handle }) {
      const result = await db.query(`
                  INSERT INTO jobs (title,
                                         salary,
                                         equity,
                                         company_handle)
                  VALUES ($1, $2, $3, $4)
                  RETURNING title,
                            salary,
                            equity,
                            company_handle`, [
            title,
            salary,
            equity,
            company_handle
          ],
      );
      const job = result.rows[0];

      return job;
    }

    /** Find all jobs.
     *
     * Returns [{ title, salary, equity, company_handle  }, ...]
     * */

    static async findAll(searchQuery = {}) {
      const { title, salary, equity, companyHandle } = searchQuery;

      const { where, values } =
      this._whereClauseGen(title, salary, equity, companyHandle);

      const jobsRes = await db.query(`
          SELECT title,
                 salary,
                 equity,
                 company_handle AS "companyHandle",
          FROM jobs
          ${where}
          ORDER BY title`,
          values
      );

      return jobsRes.rows;
    }

    /** Generate an object containing a SQL where clause and a values array.
     *
     * Accepts three search query parameters:
     *   minEmployees(int), maxEmployees(int), nameLike(string)
     *
     * returns:
     *    {
     *      where: '"minEmployees"=$1, "maxEmployees"=$2, "nameLike"=$3,'
     *      values: [5, 50, 'apple']
     *    }
    */
    static _whereClauseGen(title, salary, equity, companyHandle) {
      let where = []
      let values = [];

      if (title !== undefined) {
        values.push(`%${title}%`);
        where.push(`title ILIKE $${values.length}`);
      }
      if (salary !== undefined) {
        values.push(salary);
        where.push(`salary = $${values.length}`);
      }
      if (equity !== undefined) {
        values.push(equity);
        where.push(`equity = $${values.length}`);
      }
      if (companyHandle !== undefined) {
        values.push(`%${companyHandle}%`);
        where.push(`company_handle ILIKE $${values.length}`);
      }

      let whereClause = where.length > 0 ? "WHERE " + where.join(" AND ") : "";

      return {
        where: whereClause,
        values
      }
    }



    /** Given a job id, return data about job.
     *
     * Returns where job is [{ id, title, salary, equity, companyHandle }]
     *
     * Throws NotFoundError if not found.
     **/

    static async get(id) {
      const jobRes = await db.query(`
          SELECT id,
                 title,
                 salary,
                 equity
                 company_handle AS "companyHandle",
          FROM jobs
          WHERE id = $1`, [id]);

      const job = jobRes.rows[0];

      if (!job) throw new NotFoundError(`No job: ${id}`);

      return job;
    }

    /** Update job data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain all the
     * fields; this only changes provided ones.
     *
     * Data can include: {title, salary, equity, companyHandle}
     *
     * Returns {title, salary, equity, companyHandle}
     *
     * Throws NotFoundError if not found.
     */

    static async update(id, data) {
      const { setCols, values } = sqlForPartialUpdate(
          data,
          {
            title: "title",
            salary: "salary",
            equity: "equity",
          });
      const idVarIdx = "$" + (values.length + 1);

      const querySql = `
          UPDATE jobs
          SET ${setCols}
          WHERE id = ${idVarIdx}
          RETURNING
              title,
              salary,
              equity,
              company_handle AS "companyHandle"`;
      const result = await db.query(querySql, [...values, id]);
      const job = result.rows[0];

      if (!job) throw new NotFoundError(`No job: ${id}`);

      return job;
    }

    /** Delete given job from database; returns undefined.
     *
     * Throws NotFoundError if job not found.
     **/

    static async remove(id) {
      const result = await db.query(`
          DELETE
          FROM jobs
          WHERE id = $1
          RETURNING id, title`, [id]);
      const job = result.rows[0];

      if (!job) throw new NotFoundError(`No job: ${id}`);
    }
  }


  module.exports = Job;