# Package.json Scripts Reference

Complete reference guide for all available npm scripts in the HRM System.

---

## 🚀 Development Scripts

### `npm run dev`
Start the Next.js development server.
- **Port:** http://localhost:3000
- **Hot Reload:** Enabled
- **Usage:** Primary command for development

### `npm run build`
Build the application for production.
- **Output:** `.next` directory
- **Usage:** Run before deployment

### `npm run start`
Start the production server (requires build first).
- **Usage:** `npm run build && npm run start`

### `npm run lint`
Run ESLint to check code quality.
- **Usage:** Check for code issues before committing

### `npm run type-check`
Check TypeScript types without emitting files.
- **Usage:** Verify type safety without building

---

## 🗄️ Database Scripts

### `npm run db:generate`
Generate Prisma Client from schema.
- **When to use:** After schema changes
- **Auto-runs:** On `npm install` (via postinstall)

### `npm run db:push`
Push schema changes to database (development).
- **When to use:** Quick schema updates during development
- **Note:** Use migrations for production

### `npm run db:migrate`
Create and apply database migrations (production).
- **When to use:** Production deployments
- **Creates:** Migration files in `prisma/migrations/`

### `npm run db:migrate:deploy`
Deploy migrations to production database.
- **When to use:** Production deployments
- **Note:** Does not create migrations, only applies existing ones

### `npm run db:migrate:reset`
Reset database and apply all migrations.
- **Warning:** ⚠️ Deletes all data
- **When to use:** Development reset

### `npm run db:seed`
Seed database with initial data.
- **Creates:** Admin user and sample employees
- **When to use:** After database setup or reset

### `npm run db:studio`
Open Prisma Studio (database GUI).
- **URL:** http://localhost:5555
- **Usage:** Visual database browser and editor

### `npm run db:reset`
Reset database and reseed (convenience script).
- **Warning:** ⚠️ Deletes all data
- **When to use:** Quick development reset

### `npm run db:setup`
Complete database setup (all-in-one).
- **Runs:** setup-env → generate → push → seed
- **When to use:** Initial setup or fresh start

### `npm run db:setup-env`
Generate DATABASE_URL from individual DB variables.
- **Updates:** `.env` file
- **When to use:** After changing DB credentials

---

## 🛠️ Setup Scripts

### `npm run setup`
Complete project setup (install + database).
- **Runs:** `npm install` + `npm run db:setup`
- **When to use:** First-time setup or fresh clone

### `postinstall` (automatic)
Auto-generates Prisma Client after npm install.
- **Runs:** Automatically after `npm install`
- **Purpose:** Ensure Prisma Client is always up-to-date

---

## 📋 Common Workflows

### Initial Setup
```bash
# Complete setup from scratch
npm run setup
```

### Development Workflow
```bash
# Start development
npm run dev

# Check types
npm run type-check

# Lint code
npm run lint
```

### Database Workflow
```bash
# After schema changes (development)
npm run db:push

# After schema changes (production)
npm run db:migrate

# Reset and reseed (development)
npm run db:reset

# View database
npm run db:studio
```

### Production Deployment
```bash
# Build application
npm run build

# Deploy migrations
npm run db:migrate:deploy

# Start server
npm run start
```

---

## 🔄 Script Categories

### Development
- `dev` - Development server
- `build` - Production build
- `start` - Production server
- `lint` - Code linting
- `type-check` - Type checking

### Database - Generation
- `db:generate` - Generate Prisma Client
- `postinstall` - Auto-generate on install

### Database - Schema
- `db:push` - Push schema (dev)
- `db:migrate` - Create migration (prod)
- `db:migrate:deploy` - Deploy migrations
- `db:migrate:reset` - Reset migrations

### Database - Data
- `db:seed` - Seed initial data
- `db:reset` - Reset and reseed

### Database - Tools
- `db:studio` - Prisma Studio GUI

### Database - Setup
- `db:setup` - Complete database setup
- `db:setup-env` - Environment setup

### Project Setup
- `setup` - Complete project setup

---

## ⚠️ Important Notes

### Development vs Production

**Development:**
- Use `db:push` for quick schema updates
- Use `db:reset` to reset database
- Use `db:studio` to view/edit data

**Production:**
- Always use `db:migrate` for schema changes
- Use `db:migrate:deploy` to apply migrations
- Never use `db:push` or `db:reset` in production

### Data Safety

⚠️ **Warning Scripts (Delete Data):**
- `db:migrate:reset` - Deletes all data
- `db:reset` - Deletes all data

✅ **Safe Scripts:**
- `db:generate` - Only generates client
- `db:push` - Updates schema (keeps data)
- `db:migrate` - Creates migration files
- `db:seed` - Adds data (doesn't delete)

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Start development | `npm run dev` |
| Build for production | `npm run build` |
| Setup database | `npm run db:setup` |
| Reset database | `npm run db:reset` |
| View database | `npm run db:studio` |
| Check types | `npm run type-check` |
| Lint code | `npm run lint` |
| Complete setup | `npm run setup` |

---

**Last Updated:** January 2025

