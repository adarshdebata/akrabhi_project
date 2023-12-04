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

const validateCompanyAdminUpdateInput = (data) => {
    return (
        (data.company_admin_first_name && typeof data.company_admin_first_name === 'string') ||
        (data.company_admin_last_name && typeof data.company_admin_last_name === 'string') ||
        (data.company_admin_email && typeof data.company_admin_email === 'string')
    );
};

router.put('/update-admin/:companyUuid', async (req, res) => {
    try {
        const { companyUuid } = req.params;
        const updatedAdminData = req.body;
        if (!validateCompanyAdminUpdateInput(updatedAdminData)) {
            return res.status(400).json({ error: 'Invalid company admin update input' });
        }

        const setClause = Object.keys(updatedAdminData)
            .map((field, index) => `${field} = $${index + 2}`)
            .join(', ');

        const updateAdminQuery = `
            UPDATE company
            SET ${setClause}
            WHERE company_uuid = $1
            RETURNING *
        `;

        const values = [companyUuid, ...Object.values(updatedAdminData)];

        const response = await pool.query(updateAdminQuery, values);
        const updatedCompanyAdmin = response.rows[0];

        if (!updatedCompanyAdmin) {
            return res.status(404).json({ error: 'Company not found' });
        }

        res.json(updatedCompanyAdmin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
