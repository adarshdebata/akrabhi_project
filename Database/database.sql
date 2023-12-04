CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE UserTable (
    user_uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    bloodgroup VARCHAR(10) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL
);


CREATE TABLE EmployeeType (
    emp_type_id SERIAL PRIMARY KEY NOT NULL,
    employee_type VARCHAR(10) NOT NULL
);

CREATE TABLE Company (
    company_uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    company_id VARCHAR(8) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_admin UUID,
    description TEXT,
    contact_no VARCHAR(15) NOT NULL,
    email_id VARCHAR(255) NOT NULL,
    address_lane VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Department (
    dept_uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    dept_id VARCHAR(8) NOT NULL,
    dept_name VARCHAR(255) NOT NULL,
    description TEXT,
    company_uuid UUID NOT NULL,
    dept_head UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (company_uuid) REFERENCES Company(company_uuid),
    FOREIGN KEY (dept_head) REFERENCES UserTable(user_uuid)
);

CREATE TABLE Employee (
    employee_uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    employee_id VARCHAR(8) NOT NULL,
    user_uuid UUID NOT NULL,
    company_uuid UUID NOT NULL,
    department_uuid UUID NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    date_of_joining DATE NOT NULL,
    employee_type_id SERIAL NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_uuid) REFERENCES UserTable(user_uuid),
    FOREIGN KEY (company_uuid) REFERENCES Company(company_uuid),
    FOREIGN KEY (department_uuid) REFERENCES Department(dept_uuid),
    FOREIGN KEY (employee_type_id) REFERENCES EmployeeType(emp_type_id)
);
