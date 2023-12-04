
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

router.get('/company-details/:companyUuid', async (req, res) => {
    try {
        const { companyUuid } = req.params;
        const companyDetailsQuery = `
            SELECT 
                company.company_uuid,
                company.company_id,
                company.company_name,
                company.description,
                company.contact_no,
                company.email_id,
                company.address_lane,
                company.city,
                company.state,
                company.country,
                company.pincode,
                company.created_at,
                usertable.first_name AS admin_first_name,
                usertable.last_name AS admin_last_name
            FROM company
            LEFT JOIN usertable ON company.company_admin = usertable.user_uuid
            WHERE company.company_uuid = $1
        `;

        const response = await pool.query(companyDetailsQuery, [companyUuid]);
        const companyDetails = response.rows[0];

        if (!companyDetails) {
            return res.status(404).json({ error: 'Company not found' });
        }

        res.json(companyDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
