const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

router.get('/department-details/:deptUuid', async (req, res) => {
    try {
        const { deptUuid } = req.params;

        const departmentDetailsQuery = `
            SELECT 
                department.dept_uuid,
                department.dept_id,
                department.dept_name,
                department.company_uuid,
                department.description,
                department.dept_head,
                department.created_at,
                company.company_name,
                usertable.first_name AS dept_head_first_name,
                usertable.last_name AS dept_head_last_name
            FROM department
            LEFT JOIN company ON department.company_uuid = company.company_uuid
            LEFT JOIN usertable ON department.dept_head = usertable.user_uuid
            WHERE department.dept_uuid = $1
        `;

        const response = await pool.query(departmentDetailsQuery, [deptUuid]);
        const departmentDetails = response.rows[0];

        if (!departmentDetails) {
            return res.status(404).json({ error: 'Department not found' });
        }

        res.json(departmentDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
