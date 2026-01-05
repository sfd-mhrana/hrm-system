#!/usr/bin/env node

/**
 * This script constructs DATABASE_URL from individual DB environment variables
 * and creates/updates the .env file
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), '.env.example');

// Default values
const defaults = {
  DB_HOST: 'localhost',
  DB_PORT: '3306',
  DB_USER: 'root',
  DB_PASSWORD: 'root',
  DB_NAME: 'hrm_system',
};

// Read existing .env or use defaults
let envVars = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      envVars[key] = value;
    }
  });
}

// Use provided values or defaults
const dbHost = process.env.DB_HOST || envVars.DB_HOST || defaults.DB_HOST;
const dbPort = process.env.DB_PORT || envVars.DB_PORT || defaults.DB_PORT;
const dbUser = process.env.DB_USER || envVars.DB_USER || defaults.DB_USER;
const dbPassword = process.env.DB_PASSWORD || envVars.DB_PASSWORD || defaults.DB_PASSWORD;
const dbName = process.env.DB_NAME || envVars.DB_NAME || defaults.DB_NAME;

// Construct DATABASE_URL
const databaseUrl = `mysql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

// Update or create .env file
let envContent = '';

// Add individual DB variables
envContent += `# Database Configuration\n`;
envContent += `DB_HOST=${dbHost}\n`;
envContent += `DB_PORT=${dbPort}\n`;
envContent += `DB_USER=${dbUser}\n`;
envContent += `DB_PASSWORD=${dbPassword}\n`;
envContent += `DB_NAME=${dbName}\n\n`;

// Add constructed DATABASE_URL
envContent += `# Prisma Database URL (constructed from above variables)\n`;
envContent += `DATABASE_URL="${databaseUrl}"\n`;

// Preserve other existing env variables
Object.keys(envVars).forEach(key => {
  if (!['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DATABASE_URL'].includes(key)) {
    envContent += `${key}=${envVars[key]}\n`;
  }
});

fs.writeFileSync(envPath, envContent);
console.log('✅ .env file updated successfully!');
console.log(`📊 DATABASE_URL: ${databaseUrl.replace(dbPassword, '***')}`);

