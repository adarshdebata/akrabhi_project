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


const validateUserRegistrationInput = (data) => {
    
    return (
        data.first_name && typeof data.first_name === 'string' &&
        data.last_name && typeof data.last_name === 'string' &&
        data.dob && data.dob instanceof Date &&
        data.bloodgroup && typeof data.bloodgroup === 'string' &&
        data.email && typeof data.email === 'string' &&
        data.phone_number && typeof data.phone_number === 'string'
    );
};


router.post('/register', async (req, res) => {
    try {
        const userData = req.body;

        if (!validateUserRegistrationInput(userData)) {
            return res.status(400).json({ error: 'Invalid user registration input' });
        }

        const registerUserQuery = `INSERT INTO usertable (
                user_uuid,
                first_name,
                middle_name,
                last_name,
                dob,
                bloodgroup,
                email,
                phone_number,
                created_at
            ) VALUES (
                uuid_generate_v4(),
                $1, $2, $3, $4, $5, $6, $7, NOW()
            ) RETURNING *`;

        const values = [
            userData.first_name,
            userData.middle_name,
            userData.last_name,
            userData.dob,
            userData.bloodgroup,
            userData.email,
            userData.phone_number,
        ];

        const response = await pool.query(registerUserQuery, values);
        const registeredUser = response.rows[0];

        res.json(registeredUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
