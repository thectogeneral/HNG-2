
CREATE TABLE IF NOT EXISTS users (
    "userId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- Ensures unique userId
    "firstName" VARCHAR(255) NOT NULL,  -- Ensures firstName is not null
    "lastName" VARCHAR(255) NOT NULL,   -- Ensures lastName is not null
    "email" VARCHAR(255) NOT NULL UNIQUE,  -- Ensures email is unique and not null
    "password" VARCHAR(255) NOT NULL,  -- Ensures password is not null
    "phone" VARCHAR(20)
);

-- Create an index on the email column to enforce uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS unique_email ON users(email);

CREATE EXTENSION IF NOT EXISTS "pgcrypto";


create table
  organisations (
    "orgId" uuid primary key default gen_random_uuid (), 
    name text not null, -- Organization name, required and cannot be null
    description text, -- Optional description of the organization
    created_by uuid -- User ID of the creator
  );

  CREATE TABLE organisation_users (
    "orgId" UUID REFERENCES organisations("orgId"),
    "userId" UUID REFERENCES users("userId"),
    PRIMARY KEY ("orgId", "userId")
);
