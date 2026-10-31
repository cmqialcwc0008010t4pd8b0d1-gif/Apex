# ApexEdge Trading Academy &bull; Complete Production Platform

ApexEdge Trading Academy is a full-stack, production-oriented financial education web application with a comprehensive student dashboard, article-based learning management system (LMS), interactive educational simulator challenges, manual blockchain payment auditing, 10-level referral hierarchy tracking, double-entry financial ledgers, and a Super Admin control panel.

---

## Key Highlights & Architectural Principles

1. **Self-Contained Local Database (SQLite + Prisma ORM)**
   - Zero external cloud database dependencies (No Supabase, Firebase, Neon, or PlanetScale required for local operation).
   - Modular repository access layer designed for seamless 1-command migration to PostgreSQL when deploying to multi-instance environments.
   - Atomic database transactions with rollback protection on all financial operations.

2. **Secure Custom Password Authentication**
   - High-iteration one-way password hashing via `bcryptjs`. Plaintext passwords are never stored.
   - HttpOnly signed JWT session cookies powered by `jose` (HS256).
   - Automatic generation of permanent, immutable student identifiers (`EDU100001`, `EDU100002`...) and unique referral keys (`REF88101`).
   - Phone numbers normalized with country codes (E.164 standard) to eliminate duplicate accounts.
   - Admin-assisted account recovery desk without dependence on paid SMS/OTP aggregators.

3. **Article-Based Learning Management System (LMS)**
   - Core philosophy: Structured written articles over video for maximum cognitive retention.
   - Rich typography with callout boxes, important risk notes, and reference formulas.
   - Dynamic scroll-based reading progress bar, completion toggling, and article bookmarking.

4. **Extensible Interactive Learning Engines**
   - 8 interactive educational challenge formats:
     1. Trading Terminology Matching Challenge
     2. Candlestick Pattern Identification
     3. Risk Management Challenge (Drawdown & Position Sizing Math)
     4. Multiple Choice Trader Quiz
     5. Trading Scenario Decisions
     6. Market Knowledge Challenge
     7. Drag & Drop Educational Simulation
     8. True or False Challenge
   - Instant post-answer institutional explanations and passing grade verification (70%).

5. **Daily Learning & Habit Formation System**
   - Curated daily assignments linking theory articles with active quizzes.
   - Continuous streak counter and historical archive without financial penalties for missed days.

6. **Manual Membership Payment Verification ($20 Lifetime)**
   - Configurable receiving addresses for BNB Smart Chain (BEP20) and Tron (TRC20).
   - Multi-step manual audit workflow: Student enters TXID and uploads receipt &rarr; Status becomes `UNDER_REVIEW` &rarr; Treasury officer independently verifies hash on-chain &rarr; Membership activated upon verified receipt.
   - Duplicate TXID prevention and 2–3 hour review window notice.

7. **Direct-Selling & Anti-Pyramid Compliance Safeguards**
   - 10-tier referral hierarchy tracking with interactive network visualizer.
   - Commission and bonus calculation engine maintained in **Compliance Hold Mode (Disabled)** until local direct-selling authorizations are obtained.
   - Membership fees are not represented as investment capital; zero guaranteed returns.

8. **Super Admin Console (14 Comprehensive Sections)**
   - A. Executive Dashboard (14 primary KPIs)
   - B. User Directory & Role Management
   - C. Course & Article CMS
   - D. Daily Learning Scheduler
   - E. Payment Verification & Treasury Wallet Desk
   - F. Referral Hierarchy & Tier Configurator
   - G. Bonus Slabs & Threshold Rules
   - H. Financial Ledger & Withdrawal Disbursements
   - I. Operational Reports & Instant CSV Exporter
   - J. Broadcast Notifications Desk
   - K. Website CMS (Homepage, About, Terms, Risk Disclosures)
   - L. Support Tickets Queue
   - M. Security Roles & Immutable Audit Logs
   - N. Global Platform Settings
   - Section 16: Investment Module Placeholder (Permanently Disabled)

---

## Default Testing Credentials

| Role | Mobile Identifier / ID | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `+10000000000` (or `EDU100000`) | `Admin@Trading2026!` | Super Admin Console & Student Portal |
| **Active Student** | `+12025550101` (or `EDU100001`) | `Student@123` | Full Curriculum & Interactive Games |
| **Pending Student** | `+12025550103` (or `EDU100003`) | `Student@123` | Pending $20 Activation Workflow |

---

## Quick Start & Local Setup

### 1. Prerequisites
- Node.js version 18.x, 20.x, or 23.x
- npm version 9.x or higher

### 2. Installation
```bash
# Clone the repository
git clone <repository-url>
cd <repository-directory>

# Install dependencies
npm install
```

### 3. Environment Configuration
Create or verify `.env` in the root folder:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="trading-edu-platform-super-secure-key-2026-financial-academy"
NODE_ENV="development"
NEXT_PUBLIC_APP_NAME="ApexEdge Trading Academy"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Initialization & Seeding
```bash
# Push schema to local SQLite database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed sample courses, articles, interactive games, demo users, and CMS entries
npm run db:seed
```

### 5. Running the Application
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your web browser.

---

## Utility Scripts

- **Database Backup:**
  ```bash
  node scripts/db-backup.js
  ```
  Creates a timestamped snapshot of `dev.db` under `prisma/backups/`.

- **Database Restore:**
  ```bash
  node scripts/db-restore.js [optional-backup-file-path]
  ```
  Restores the specified (or most recent) snapshot to `dev.db`.

- **Health Check Endpoint:**
  ```bash
  curl http://localhost:3000/api/health
  ```
  Returns real-time database connectivity, registered user counts, and platform status.

---

## Production Deployment Notes (PostgreSQL Migration)

1. **Why SQLite for Local vs. PostgreSQL for Cloud:**
   - SQLite is self-contained and ideal for single-instance development and integration testing.
   - Serverless platforms like Vercel have ephemeral local storage. For distributed, multi-instance production deployments, swap SQLite for a persistent managed PostgreSQL database (e.g. Supabase PostgreSQL, AWS RDS, or DigitalOcean Managed Database).

2. **How to migrate to PostgreSQL:**
   In `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
   Set `DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"` in your production environment variables and run `npx prisma db push`. The application code requires zero modifications.

---

## Security Best Practices Enforced

- **Zero Client Credential Leakage:** Prisma queries and secret keys are executed exclusively in Server Actions and App Router server components.
- **CSRF & Cookie Protection:** Session cookies are `HttpOnly`, `SameSite=Lax`, and `Secure` in production.
- **Immutable Balance Integrity:** Direct SQL balance editing is prohibited; all wallet adjustments record an audited `FinancialTransaction`.
- **Duplicate Hash Defense:** Transaction hashes are unique-indexed in the database to prevent replay submissions.
