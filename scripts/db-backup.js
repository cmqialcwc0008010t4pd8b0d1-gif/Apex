/**
 * Database Backup Utility for SQLite
 * Copies dev.db into timestamped backup files under prisma/backups/
 */
const fs = require("fs");
const path = require("path");

const dbPath = path.resolve(__dirname, "../prisma/dev.db");
const backupDir = path.resolve(__dirname, "../prisma/backups");

if (!fs.existsSync(dbPath)) {
  console.error("Database file not found at:", dbPath);
  process.exit(1);
}

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupPath = path.join(backupDir, `backup-dev-${timestamp}.sqlite`);

try {
  fs.copyFileSync(dbPath, backupPath);
  console.log(`[Backup Success] SQLite database backed up to: ${backupPath}`);
} catch (err) {
  console.error("[Backup Error] Failed to create backup:", err);
  process.exit(1);
}
