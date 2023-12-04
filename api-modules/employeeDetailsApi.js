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

router.get('/employee-details/:employeeUuid', async (req, res) => {
    try {
        const { employeeUuid } = req.params;
        const employeeDetailsQuery = `SELECT 
                employee.employee_uuid,
                employee.employee_id,
                employee.user_uuid,
                employee.company_uuid,
                employee.department_uuid,
                employee.salary,
                employee.date_of_joining,
                employee.employee_type_id,
                employee.created_at AS emp_created_at,
                usertable.first_name AS emp_first_name,
                usertable.middle_name AS emp_middle_name,
                usertable.last_name AS emp_last_name,
                usertable.dob AS emp_dob,
                usertable.bloodgroup AS emp_bloodgroup,
                usertable.email AS emp_email,
                usertable.phone_number AS emp_phone_number,
                company.company_name,
                company.company_id,
                company.description AS company_description,
                company.contact_no AS company_contact_no,
                company.email_id AS company_email_id,
                company.address_lane AS company_address_lane,
                company.city AS company_city,
                company.state AS company_state,
                company.country AS company_country,
                company.pincode AS company_pincode,
                department.dept_id,
                department.dept_name,
                department.description AS dept_description,
                department.dept_head AS dept_head_uuid,
                department.created_at AS dept_created_at,
                usertable_dept_head.first_name AS dept_head_first_name,
                usertable_dept_head.last_name AS dept_head_last_name
            FROM employee
            LEFT JOIN usertable ON employee.user_uuid = usertable.user_uuid
            LEFT JOIN company ON employee.company_uuid = company.company_uuid
            LEFT JOIN department ON employee.department_uuid = department.dept_uuid
            LEFT JOIN usertable AS usertable_dept_head ON department.dept_head = usertable_dept_head.user_uuid
            WHERE employee.employee_uuid = $1
        `;

        const response = await pool.query(employeeDetailsQuery, [employeeUuid]);
        const employeeDetails = response.rows[0];

        if (!employeeDetails) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json(employeeDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
