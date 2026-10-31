import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency to USD standard display
 */
export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date in readable corporate format
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/**
 * Normalize mobile numbers with international country code convention.
 * Ensures consistent lookups and prevents duplicate accounts.
 */
export function normalizeMobileNumber(input: string): string {
  let cleaned = input.trim().replace(/[\s\-\(\)]/g, "");
  if (!cleaned.startsWith("+")) {
    // If entered without +, default prepend + if it starts with digits
    // e.g. 1234567890 -> +1234567890 or 919876543210 -> +919876543210
    cleaned = "+" + cleaned;
  }
  return cleaned;
}

/**
 * Validate phone number format
 */
export function isValidMobileNumber(phone: string): boolean {
  const normalized = normalizeMobileNumber(phone);
  // E.164 standard: + followed by 7 to 15 digits
  const regex = /^\+[1-9]\d{6,14}$/;
  return regex.test(normalized);
}

/**
 * Generate formatted unique ID e.g. EDU100001 based on sequential number
 */
export function formatUniqueUserId(sequenceNum: number): string {
  return `EDU${(100000 + sequenceNum).toString()}`;
}

/**
 * Generate random referral code e.g. REF83912
 */
export function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "REF";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
