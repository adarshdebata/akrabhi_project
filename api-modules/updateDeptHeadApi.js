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

const validateDeptHeadUpdateInput = (data) => {
    return (
        (data.dept_head_first_name && typeof data.dept_head_first_name === 'string') ||
        (data.dept_head_last_name && typeof data.dept_head_last_name === 'string') ||
        (data.dept_head_email && typeof data.dept_head_email === 'string')
    );
};


router.put('/update-head/:deptUuid', async (req, res) => {
    try {
        const { deptUuid } = req.params;
        const updatedHeadData = req.body;
        if (!validateDeptHeadUpdateInput(updatedHeadData)) {
            return res.status(400).json({ error: 'Invalid department head update input' });
        }
        const setClause = Object.keys(updatedHeadData)
            .map((field, index) => `${field} = $${index + 2}`)
            .join(', ');
        const updateHeadQuery = `
            UPDATE department
            SET ${setClause}
            WHERE dept_uuid = $1
            RETURNING *
        `;

        const values = [deptUuid, ...Object.values(updatedHeadData)];

        const response = await pool.query(updateHeadQuery, values);
        const updatedDeptHead = response.rows[0];

        if (!updatedDeptHead) {
            return res.status(404).json({ error: 'Department not found' });
        }

        res.json(updatedDeptHead);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
