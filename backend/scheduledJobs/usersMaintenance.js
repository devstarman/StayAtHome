const CroneJob = require("cron").CronJob;
const { User } = require("../models/user");

const jobTime = process.env.USER_MAINTENANCE_TIME || "1 59 23 * * *";

async function grantPermissions() {
  await User.updateMany(
    {},
    {
      allowedVotingUp: true,
      allowedVotingDown: true,
      allowedPost: true
    }
  );
}

async function deleteInactive() {
  await User.deleteMany({ active: false });
}

const serverTask = new CroneJob(jobTime, () => {
  grantPermissions();
  deleteInactive();
});

serverTask.start();
