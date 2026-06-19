import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { ROLES, USER_STATUS } from "@/lib/constants";

/**
 * Returns the authenticated DB user or null.
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  await connectDB();
  return User.findById(session.user.id);
}

/**
 * Require a logged-in user. Throws AuthError-shaped errors that the
 * api handler wrapper translates into proper HTTP responses.
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    const e = new Error("Authentication required");
    e.status = 401;
    throw e;
  }
  if (user.status === USER_STATUS.BANNED || user.status === USER_STATUS.SUSPENDED) {
    const e = new Error("Your account is not active");
    e.status = 403;
    throw e;
  }
  return user;
}

/**
 * Require an ACTIVE (identity-verified) traveler — needed to accept jobs.
 */
export async function requireActiveTraveler() {
  const user = await requireUser();
  if (user.status !== USER_STATUS.ACTIVE) {
    const e = new Error("Complete your identity verification to accept jobs");
    e.status = 403;
    e.code = "VERIFICATION_REQUIRED";
    throw e;
  }
  return user;
}

/**
 * Require an admin or super admin.
 */
export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== ROLES.ADMIN && user.role !== ROLES.SUPER_ADMIN) {
    const e = new Error("Admin access required");
    e.status = 403;
    throw e;
  }
  return user;
}
