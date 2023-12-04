
const express = require('express');
const router = express.Router();
const uuid = require('uuid');

const users = [];


const validateUserInput = (data) => {
    const { first_name, last_name, dob, bloodgroup, email, phone_number } = data;
    const isValidDate = !isNaN(Date.parse(dob));

    return (
        first_name && last_name && isValidDate && bloodgroup && email && phone_number &&
        typeof first_name === 'string' &&
        typeof last_name === 'string' &&
        typeof bloodgroup === 'string' &&
        typeof email === 'string' &&
        typeof phone_number === 'string'
    );
}

router.post('/register', (req, res) => {
    const userData = req.body;
    if (!validateUserInput(userData)) {
        return res.status(400).json({ error: 'Invalid user input' });
    }


    const user_uuid = uuid.v4();
    users.push({ user_uuid, ...userData });

    res.json({ user_uuid, ...userData });
});

module.exports = router;
