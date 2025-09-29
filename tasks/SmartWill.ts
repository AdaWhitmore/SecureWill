import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("will:address", "Prints the SmartWill address").setAction(async function (_taskArguments: TaskArguments, hre) {
  const { deployments } = hre;
  const d = await deployments.get("SmartWill");
  console.log("SmartWill address is " + d.address);
});

task("will:get", "Reads a user's encrypted will")
  .addParam("user", "user address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;
    const d = await deployments.get("SmartWill");
    const smartWill = await ethers.getContractAt("SmartWill", d.address);
    const c = await smartWill.getEncryptedWill(taskArguments.user);
    console.log(`Encrypted will (C): ${c}`);
  });

task("will:submit", "Submits an encrypted will")
  .addParam("c", "encrypted will string C")
  .addParam("a1", "address #1")
  .addParam("a2", "address #2")
  .addParam("a3", "address #3")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;
    await fhevm.initializeCLIApi();

    const d = await deployments.get("SmartWill");
    const smartWill = await ethers.getContractAt("SmartWill", d.address);
    const signers = await ethers.getSigners();

    // Encrypt three addresses using Zama CLI API
    const enc = await fhevm
      .createEncryptedInput(d.address, signers[0].address)
      .addAddress(taskArguments.a1)
      .addAddress(taskArguments.a2)
      .addAddress(taskArguments.a3)
      .encrypt();

    const tx = await smartWill
      .connect(signers[0])
      .submitWill(taskArguments.c, enc.handles[0], enc.handles[1], enc.handles[2], enc.inputProof);
    console.log(`Submitting... tx: ${tx.hash}`);
    const r = await tx.wait();
    console.log(`Status: ${r?.status}`);
  });

