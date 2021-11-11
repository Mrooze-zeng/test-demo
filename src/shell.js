const { spawnSync } = require("child_process");

module.exports = {
  checkGit() {
    const { status } = spawnSync("git", ["version"]);
    return status === null;
  },
  getCurrentBranch() {
    const { stdout, stderr } = spawnSync("git", [
      "rev-parse",
      "--abbrev-ref",
      "HEAD",
    ]);
    if (stderr.length) {
      throw new Error(stderr.toString());
    }
    return stdout.toString().trim();
  },
  getBranches() {
    const { stdout, stderr } = spawnSync("git", [
      "for-each-ref",
      "--format=%(refname:short) %(upstream:short)",
      "refs/heads",
    ]);
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
    const { stdout, stderr } = spawnSync("git", [
      "rev-list",
      "--left-right",
      `${local}...${remote}`,
    ]);
    if (stderr.length) {
      throw new Error(stderr.toString());
    }
    return (stdout.toString().trim().match(/>/g) || []).length;
  },
  checkout(branch = "") {
    const { stdout, stderr } = spawnSync("git", ["checkout", branch]);
    console.log(stdout.toString(), stderr.toString());
    if (stderr.length) {
      throw new Error(stderr.toString());
    }
    return stdout.toString().trim();
  },
  pull() {
    const { stdout, stderr } = spawnSync("git", ["pull"]);
    if (stderr.length) {
      throw new Error(stderr.toString());
    }
    return stdout.toString().trim();
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
