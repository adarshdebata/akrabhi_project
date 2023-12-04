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

const validateCompanyRegistrationInput = (data) => {
    return (
        data.company_name && typeof data.company_name === 'string' &&
        data.company_id && typeof data.company_id === 'string' &&
        data.contact_no && typeof data.contact_no === 'string' &&
        data.email_id && typeof data.email_id === 'string' &&
        data.address_lane && typeof data.address_lane === 'string' &&
        data.city && typeof data.city === 'string' &&
        data.state && typeof data.state === 'string' &&
        data.country && typeof data.country === 'string' &&
        data.pincode && typeof data.pincode === 'string'
    );
};


router.post('/register', async (req, res) => {
    try {
        const companyData = req.body;
        if (!validateCompanyRegistrationInput(companyData)) {
            return res.status(400).json({ error: 'Invalid company registration input' });
        }

        const registerCompanyQuery = `
            INSERT INTO company (
                company_uuid,
                company_id,
                company_name,
                company_admin,
                description,
                contact_no,
                email_id,
                address_lane,
                city,
                state,
                country,
                pincode,
                created_at
            ) VALUES (
                uuid_generate_v4(),
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW()
            ) RETURNING *
        `;

        const values = [
            companyData.company_id,
            companyData.company_name,
            companyData.company_admin,
            companyData.description,
            companyData.contact_no,
            companyData.email_id,
            companyData.address_lane,
            companyData.city,
            companyData.state,
            companyData.country,
            companyData.pincode,
        ];

        const response = await pool.query(registerCompanyQuery, values);
        const registeredCompany = response.rows[0];

        res.json(registeredCompany);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;