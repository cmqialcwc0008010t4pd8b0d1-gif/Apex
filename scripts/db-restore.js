/**
 * Database Restore Utility for SQLite
 * Restores a specified backup file to dev.db
 * Usage: node scripts/db-restore.js <backup-file-path>
 */
const fs = require("fs");
const path = require("path");

const targetDbPath = path.resolve(__dirname, "../prisma/dev.db");
const backupDir = path.resolve(__dirname, "../prisma/backups");

const args = process.argv.slice(2);
let sourceFile = args[0];

if (!sourceFile) {
  // If no argument, find most recent backup
  if (!fs.existsSync(backupDir)) {
    console.error("No backups directory found.");
    process.exit(1);
  }
  const files = fs.readdirSync(backupDir).filter(f => f.endsWith(".sqlite")).sort().reverse();
  if (files.length === 0) {
    console.error("No backup files found in:", backupDir);
    process.exit(1);
  }
  sourceFile = path.join(backupDir, files[0]);
  console.log(`No file specified, using most recent backup: ${files[0]}`);
}

if (!fs.existsSync(sourceFile)) {
  console.error("Backup file not found at:", sourceFile);
  process.exit(1);
}

try {
  fs.copyFileSync(sourceFile, targetDbPath);
  console.log(`[Restore Success] Restored database from ${sourceFile} to ${targetDbPath}`);
} catch (err) {
  console.error("[Restore Error] Failed to restore database:", err);
  process.exit(1);
}
