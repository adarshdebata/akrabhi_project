const express = require('express');
const router = express.Router();
const uuid = require('uuid');


const companies = [];

const validateCompanyInput = (data) => {
    const { company_id, company_name, description, contact_no, email_id, address_lane, city, state, country, pincode } = data;
    return (
        company_id && company_name && contact_no && email_id && address_lane && city && state && country && pincode &&
        typeof company_id === 'string' &&
        typeof company_name === 'string' &&
        typeof contact_no === 'string' &&
        typeof email_id === 'string' &&
        typeof address_lane === 'string' &&
        typeof city === 'string' &&
        typeof state === 'string' &&
        typeof country === 'string' &&
        typeof pincode === 'string'
    );
};

router.post('/register', (req, res) => {
    const companyData = req.body;

    if (!validateCompanyInput(companyData)) {
        return res.status(400).json({ error: 'Invalid company registration input' });
    }

    
    const company_uuid = uuid.v4();

   
    companies.push({ company_uuid, ...companyData });

    res.json({ company_uuid, ...companyData });
});

module.exports = router;
