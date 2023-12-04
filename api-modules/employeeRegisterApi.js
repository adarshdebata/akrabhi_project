
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

const validateEmployeeInput = (data) => {
    const { employee_id, user_uuid, company_uuid, department_uuid, salary, date_of_joining, employee_type_id } = data;
    return (
        employee_id &&
        user_uuid &&
        company_uuid &&
        department_uuid &&
        typeof employee_id === 'string' &&
        typeof user_uuid === 'string' &&
        typeof company_uuid === 'string' &&
        typeof department_uuid === 'string' &&
        typeof salary === 'number' &&
        date_of_joining instanceof Date &&
        typeof employee_type_id === 'number'
    );
};


router.post('/register', async (req, res) => {
    try {
        const employeeData = req.body;
        if (!validateEmployeeInput(employeeData)) {
            return res.status(400).json({ error: 'Invalid employee registration input' });
        }
        const employee_uuid = uuid.v4();
        const employeeRegisterQuery = `
            INSERT INTO employee (employee_uuid, employee_id, user_uuid, company_uuid, department_uuid, salary, date_of_joining, employee_type_id, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
            RETURNING *
        `;

        const response = await pool.query(employeeRegisterQuery, [
            employee_uuid,
            employeeData.employee_id,
            employeeData.user_uuid,
            employeeData.company_uuid,
            employeeData.department_uuid,
            employeeData.salary,
            employeeData.date_of_joining,
            employeeData.employee_type_id,
        ]);

        const registeredEmployee = response.rows[0];
        res.json(registeredEmployee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;