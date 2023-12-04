const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const uuid = require('uuid');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const validateDepartmentInput = (data) => {
    const { dept_id, dept_name, company_uuid, description, dept_head } = data;
    return (
        dept_id && dept_name && company_uuid &&
        typeof dept_id === 'string' &&
        typeof dept_name === 'string' &&
        typeof company_uuid === 'string' &&
        (description === undefined || typeof description === 'string') &&
        (dept_head === undefined || typeof dept_head === 'string')
    );
};

router.post('/register', async (req, res) => {
    try {
        const departmentData = req.body;
        if (!validateDepartmentInput(departmentData)) {
            return res.status(400).json({ error: 'Invalid department registration input' });
        }


        const dept_uuid = uuid.v4();

        const departmentRegisterQuery = `
            INSERT INTO department (dept_uuid, dept_id, dept_name, company_uuid, description, dept_head, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
            RETURNING *
        `;

        const response = await pool.query(departmentRegisterQuery, [
            dept_uuid,
            departmentData.dept_id,
            departmentData.dept_name,
            departmentData.company_uuid,
            departmentData.description || null,
            departmentData.dept_head || null,
        ]);

        const registeredDepartment = response.rows[0];
        res.json(registeredDepartment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
