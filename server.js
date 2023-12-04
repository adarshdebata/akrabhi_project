const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv');
const { Pool } = require('pg');

const userRegistrationApiRouter = require('./api-modules/userRegistrationApi');
const companyRegistrationApiRouter = require('./api-modules/companyRegistrationApi');
const companyDetailsApiRouter = require('./api-modules/companyDetailsApi');
const departmentRegisterApiRouter = require('./api-modules/departmentRegisterApi');
const departmentDetailsApiRouter = require('./api-modules/departmentDetailsApi');
const employeeRegisterApiRouter = require('./api-modules/employeeRegisterApi');
const employeeDetailsApiRouter = require('./api-modules/employeeDetailsApi');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.use(bodyParser.json());
app.get('/api/users', async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM usertable');
        res.json(response.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/api/employee-types', async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM employeetype');
        res.json(response.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/api/companies', async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM company');
        res.json(response.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/api/departments', async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM department');
        res.json(response.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/api/employees', async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM employee');
        res.json(response.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.use('/api/register-user', userRegistrationApiRouter);
app.use('/api/register-company', companyRegistrationApiRouter);
app.use('/api/company-details', companyDetailsApiRouter);
app.use('/api/register-department', departmentRegisterApiRouter);
app.use('/api/department-details', departmentDetailsApiRouter);
app.use('/api/register-employee', employeeRegisterApiRouter);
app.use('/api/employee-details', employeeDetailsApiRouter);
app.post('/register-user', async (req, res) => {
    try {
        const response = await pool.query('INSERT INTO usertable (first_name, last_name, dob, bloodgroup, email, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [
            req.body.first_name,
            req.body.last_name,
            req.body.dob,
            req.body.bloodgroup,
            req.body.email,
            req.body.phone_number,
        ]);

        res.json(response.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
