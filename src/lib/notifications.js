import Notification from "@/models/Notification";

/**
 * Create an in-app notification for a user.
 */
export async function notify(userId, { type, title, body, link, data }) {
  try {
    return await Notification.create({ userId, type, title, body, link, data });
  } catch (err) {
    console.error("[NOTIFY ERROR]", err);
    return null;
  }
}
