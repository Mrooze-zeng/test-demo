#!/usr/bin/env node

const {
  getRemoteCommitCount,
  getBranches,
  displayDialog,
  checkout,
  getCurrentBranch
} = require('./shell');

const branches = getBranches();
const currentBranch = getCurrentBranch();

branches.forEach((branch) => {
  const [local, remote] = branch;
  console.log(getRemoteCommitCount(...branch));
  currentBranch !== local && console.log(checkout(local));
});

displayDialog();
