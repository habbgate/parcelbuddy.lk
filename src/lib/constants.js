// Shared enums and constants used across client and server.

export const ROLES = {
  TRAVELER: "TRAVELER",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
};

export const USER_STATUS = {
  PENDING_VERIFICATION: "PENDING_VERIFICATION",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  BANNED: "BANNED",
};

export const ID_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

export const DOC_TYPES = ["NIC", "PASSPORT", "DRIVING_LICENSE"];

export const REQUEST_STATUS = {
  OPEN: "OPEN",
  MATCHED: "MATCHED",
  COLLECTED: "COLLECTED",
  IN_TRANSIT: "IN_TRANSIT",
  DELIVERED: "DELIVERED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
};

// Ordered pipeline used by the progress tracker UI.
export const STATUS_FLOW = [
  REQUEST_STATUS.OPEN,
  REQUEST_STATUS.MATCHED,
  REQUEST_STATUS.COLLECTED,
  REQUEST_STATUS.IN_TRANSIT,
  REQUEST_STATUS.DELIVERED,
  REQUEST_STATUS.COMPLETED,
];

export const STATUS_LABELS = {
  OPEN: "Posted",
  MATCHED: "Matched",
  COLLECTED: "Collected",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
  COMPLETED: "Confirmed",
  CANCELLED: "Cancelled",
  EXPIRED: "Expired",
};

// Tailwind-friendly color tokens per status (see globals.css badge styles).
export const STATUS_COLORS = {
  OPEN: "blue",
  MATCHED: "amber",
  COLLECTED: "purple",
  IN_TRANSIT: "orange",
  DELIVERED: "teal",
  COMPLETED: "green",
  CANCELLED: "red",
  EXPIRED: "gray",
};

export const PACKAGE_TYPES = [
  "ENVELOPE",
  "SMALL_BOX",
  "MEDIUM_BOX",
  "LARGE_BOX",
  "BAG",
  "FRAGILE",
  "OTHER",
];

export const PACKAGE_TYPE_LABELS = {
  ENVELOPE: "Envelope",
  SMALL_BOX: "Small Box",
  MEDIUM_BOX: "Medium Box",
  LARGE_BOX: "Large Box",
  BAG: "Bag",
  FRAGILE: "Fragile",
  OTHER: "Other",
};

export const WALLET_TX_TYPES = {
  CREDIT: "CREDIT",
  DEBIT: "DEBIT",
  WITHDRAWAL: "WITHDRAWAL",
};

export const NOTIFICATION_TYPES = {
  JOB_MATCH: "JOB_MATCH",
  ROUTE_ALERT: "ROUTE_ALERT",
  ID_APPROVED: "ID_APPROVED",
  ID_REJECTED: "ID_REJECTED",
  PAYMENT: "PAYMENT",
  MESSAGE: "MESSAGE",
  SYSTEM: "SYSTEM",
};

// Major Sri Lankan cities for the route dropdowns.
export const SRI_LANKAN_CITIES = [
  "Colombo",
  "Dehiwala-Mount Lavinia",
  "Moratuwa",
  "Sri Jayawardenepura Kotte",
  "Negombo",
  "Kandy",
  "Galle",
  "Jaffna",
  "Trincomalee",
  "Batticaloa",
  "Anuradhapura",
  "Polonnaruwa",
  "Kurunegala",
  "Ratnapura",
  "Badulla",
  "Matara",
  "Hambantota",
  "Kalmunai",
  "Vavuniya",
  "Kilinochchi",
  "Mannar",
  "Mullaitivu",
  "Nuwara Eliya",
  "Matale",
  "Kegalle",
  "Ampara",
  "Puttalam",
  "Chilaw",
  "Gampaha",
  "Kalutara",
  "Monaragala",
  "Hatton",
  "Dambulla",
  "Bandarawela",
  "Ella",
  "Tangalle",
  "Wennappuwa",
  "Embilipitiya",
  "Avissawella",
  "Beruwala",
];

export const DEFAULT_CONFIG = {
  commissionPercent: Number(process.env.PLATFORM_COMMISSION_PERCENT || 10),
  autoCompleteHours: Number(process.env.AUTO_COMPLETE_HOURS || 48),
  requestExpiryDays: Number(process.env.REQUEST_EXPIRY_DAYS || 14),
  minRewardLKR: 100,
  maxWeightKg: 30,
};

