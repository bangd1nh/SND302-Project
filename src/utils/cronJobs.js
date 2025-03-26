import cron from "node-cron";
import Borrow from "../models/borrow.js";
import { sendEmail } from "../utils/index.js";

cron.schedule("0 0 * * *", async () => {
  console.log("🔄 Running overdue and due date check...");

  try {
    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const dueSoonBorrows = await Borrow.find({
      dueDate: { $gt: now, $lt: threeDaysLater },
      status: "BORROWED",
      notificationStatus: "NOT_NOTIFIED",
    }).populate("userId");

    const saveOperations = [];

    for (let borrow of dueSoonBorrows) {
      if (!borrow.userId || !borrow.userId.email) continue;

      const daysLeft = Math.floor(
        (new Date(borrow.dueDate) - now) / (1000 * 60 * 60 * 24)
      );

      if (daysLeft === 3) {
        const content = `Dear ${
          borrow.userId.username
        },\n\nYour borrowed books are due for return on ${borrow.dueDate.toISOString()}. Please return them by the due date to avoid any penalties.\n\nBest regards,\nLibrary Management`;

        await sendEmail(
          borrow.userId.email,
          "Library Book Return Reminder",
          content
        );

        borrow.notificationStatus = "NOTIFIED";
        saveOperations.push(borrow.save());
      }
    }
    await Promise.all(saveOperations);

    const overdueBorrows = await Borrow.find({
      dueDate: { $lt: now },
      status: "BORROWED",
      notificationStatus: { $in: ["NOTIFIED", "NOT_NOTIFIED"] },
    }).populate("userId");

    const fineOperations = [];

    for (let borrow of overdueBorrows) {
      if (!borrow.userId || !borrow.userId.email) continue;

      const daysLate = Math.floor(
        (now - new Date(borrow.dueDate)) / (1000 * 60 * 60 * 24)
      );
      let fine = 0;

      if (daysLate >= 1 && daysLate <= 3) fine = 30000;
      else if (daysLate >= 4 && daysLate <= 15) fine = 100000;
      else if (daysLate >= 16) fine = 300000;

      if (borrow.status !== "OVERDUE") {
        borrow.status = "OVERDUE";
      }

      if (fine > 0) {
        const content = `Dear ${borrow.userId.username},\n\nYour borrowed books are overdue. A fine of ${fine} VND has been applied. Please return the books immediately to avoid further penalties.\n\nBest regards,\nLibrary Management`;

        await sendEmail(
          borrow.userId.email,
          "Library Book Overdue Notice",
          content
        );

        borrow.notificationStatus = "DONE";
      }

      fineOperations.push(borrow.save());
    }
    await Promise.all(fineOperations);
  } catch (error) {
    console.error("❌ Error during overdue and due date check:", error);
  }
});

console.log("✅ Due date and overdue cron job scheduled!");
