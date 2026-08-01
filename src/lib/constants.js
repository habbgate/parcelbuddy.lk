// Shared enums and constants used across client and server.

export const ROLES = {
  COURIER: "COURIER",
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
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
};

// Ordered pipeline used by the progress tracker UI. DELIVERED is terminal —
// it's only reached once the courier verifies the delivery PIN.
export const STATUS_FLOW = [
  REQUEST_STATUS.OPEN,
  REQUEST_STATUS.MATCHED,
  REQUEST_STATUS.COLLECTED,
  REQUEST_STATUS.IN_TRANSIT,
  REQUEST_STATUS.DELIVERED,
];

export const STATUS_LABELS = {
  OPEN: "Posted",
  MATCHED: "Matched",
  COLLECTED: "Collected",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  EXPIRED: "Expired",
};

// Tailwind-friendly color tokens per status (see globals.css badge styles).
export const STATUS_COLORS = {
  OPEN: "blue",
  MATCHED: "amber",
  COLLECTED: "purple",
  IN_TRANSIT: "orange",
  DELIVERED: "green",
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

export const NOTIFICATION_TYPES = {
  PARCEL_CREATED: "PARCEL_CREATED",
  PIN_GENERATED: "PIN_GENERATED",
  JOB_MATCH: "JOB_MATCH",
  COURIER_ACCEPTED: "COURIER_ACCEPTED",
  COURIER_STARTED: "COURIER_STARTED",
  DELIVERY_COMPLETED: "DELIVERY_COMPLETED",
  ROUTE_ALERT: "ROUTE_ALERT",
  ID_APPROVED: "ID_APPROVED",
  ID_REJECTED: "ID_REJECTED",
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
  requestExpiryDays: Number(process.env.REQUEST_EXPIRY_DAYS || 14),
  minRewardLKR: 100,
  maxWeightKg: 30,
};

