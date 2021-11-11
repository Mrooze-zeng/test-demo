const { spawnSync } = require("child_process");

const Shell = {
  spawnSyncExecutor(...args) {
    return spawnSync("git", args, {
      cwd: Shell.getProjectRoot(),
    });
  },
  checkGit() {
    const { status } = Shell.spawnSyncExecutor("version");
    return status === null;
  },
  getProjectRoot() {
    const { stdout, stderr } = spawnSync("git", [
      "rev-parse",
      "--show-toplevel",
    ]);
    if (stderr.length) {
      throw new Error(stderr.toString());
    }
    return stdout.toString().trim();
  },
  getCurrentBranch() {
    const { stdout, stderr } = Shell.spawnSyncExecutor(
      "rev-parse",
      "--abbrev-ref",
      "HEAD",
    );
    if (stderr.length) {
      throw new Error(stderr.toString());
    }
    return stdout.toString().trim();
  },
  getBranches() {
    const { stdout, stderr } = Shell.spawnSyncExecutor(
      "for-each-ref",
      "--format=%(refname:short) %(upstream:short)",
      "refs/heads",
    );
    if (stderr.length) {
      throw new Error(stderr.toString());
    }
    return stdout
      .toString()
      .trim()
      .split("\n")
      .map((branch) => {
        return branch.split(" ");
      });
  },
  getRemoteCommitCount(local = "", remote = "") {
    const { stdout, stderr } = Shell.spawnSyncExecutor(
      "rev-list",
      "--left-right",
      `${local}...${remote}`,
    );
    if (stderr.length) {
      throw new Error(stderr.toString());
    }
    return (stdout.toString().trim().match(/>/g) || []).length;
  },
  checkout(branch = "") {
    return Shell.spawnSyncExecutor("checkout", branch);
  },
  pull() {
    return Shell.spawnSyncExecutor("pull");
  },
  displayDialog(text = "") {
    return spawnSync("osascript", [
      "-e",
      `
      on run argv
        display dialog argv with icon caution
      end run
      `,
      text,
    ]);
  },
};

module.exports = Shell;
