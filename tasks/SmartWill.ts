import { FhevmType } from "@fhevm/hardhat-plugin";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

/**
 * Tutorial: Deploy and Interact Locally (--network localhost)
 * ===========================================================
 *
 * 1. From a separate terminal window:
 *
 *   npx hardhat node
 *
 * 2. Deploy the SmartWill contract
 *
 *   npx hardhat --network localhost deploy
 *
 * 3. Interact with the SmartWill contract
 *
 *   npx hardhat --network localhost task:will-address
 *   npx hardhat --network localhost task:create-will --content "My encrypted will content" --addr1 "0x123..." --addr2 "0x456..." --addr3 "0x789..."
 *   npx hardhat --network localhost task:get-will-content
 *   npx hardhat --network localhost task:get-will-metadata
 *
 *
 * Tutorial: Deploy and Interact on Sepolia (--network sepolia)
 * ===========================================================
 *
 * 1. Deploy the SmartWill contract
 *
 *   npx hardhat --network sepolia deploy
 *
 * 2. Interact with the SmartWill contract
 *
 *   npx hardhat --network sepolia task:will-address
 *   npx hardhat --network sepolia task:create-will --content "My encrypted will content" --addr1 "0x123..." --addr2 "0x456..." --addr3 "0x789..."
 *   npx hardhat --network sepolia task:get-will-content
 *
 */

/**
 * Example:
 *   - npx hardhat --network localhost task:will-address
 *   - npx hardhat --network sepolia task:will-address
 */
task("task:will-address", "Prints the SmartWill address").setAction(async function (_taskArguments: TaskArguments, hre) {
  const { deployments } = hre;

  const smartWill = await deployments.get("SmartWill");

  console.log("SmartWill address is " + smartWill.address);
});

/**
 * Example:
 *   - npx hardhat --network localhost task:create-will --content "My will content" --addr1 "0x123..." --addr2 "0x456..." --addr3 "0x789..."
 *   - npx hardhat --network sepolia task:create-will --content "My will content" --addr1 "0x123..." --addr2 "0x456..." --addr3 "0x789..."
 */
task("task:create-will", "Creates a new will with encrypted addresses")
  .addOptionalParam("address", "Optionally specify the SmartWill contract address")
  .addParam("content", "The encrypted will content")
  .addParam("addr1", "First encryption address")
  .addParam("addr2", "Second encryption address")
  .addParam("addr3", "Third encryption address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    const content = taskArguments.content;
    const addr1 = taskArguments.addr1;
    const addr2 = taskArguments.addr2;
    const addr3 = taskArguments.addr3;

    if (!ethers.isAddress(addr1) || !ethers.isAddress(addr2) || !ethers.isAddress(addr3)) {
      throw new Error("All addresses must be valid Ethereum addresses");
    }

    await fhevm.initializeCLIApi();

    const SmartWillDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("SmartWill");
    console.log(`SmartWill: ${SmartWillDeployment.address}`);

    const signers = await ethers.getSigners();

    const smartWillContract = await ethers.getContractAt("SmartWill", SmartWillDeployment.address);

    // Encrypt the addresses
    const encryptedInput = await fhevm
      .createEncryptedInput(SmartWillDeployment.address, signers[0].address);

    encryptedInput.addAddress(addr1);
    encryptedInput.addAddress(addr2);
    encryptedInput.addAddress(addr3);

    const encrypted = await encryptedInput.encrypt();

    const tx = await smartWillContract
      .connect(signers[0])
      .createWill(
        content,
        encrypted.handles[0], encrypted.inputProof,
        encrypted.handles[1], encrypted.inputProof,
        encrypted.handles[2], encrypted.inputProof
      );
    console.log(`Wait for tx:${tx.hash}...`);

    const receipt = await tx.wait();
    console.log(`tx:${tx.hash} status=${receipt?.status}`);

    console.log(`SmartWill createWill succeeded!`);
  });

/**
 * Example:
 *   - npx hardhat --network localhost task:get-will-content
 *   - npx hardhat --network sepolia task:get-will-content
 */
task("task:get-will-content", "Gets the encrypted will content for the caller")
  .addOptionalParam("address", "Optionally specify the SmartWill contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;

    const SmartWillDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("SmartWill");
    console.log(`SmartWill: ${SmartWillDeployment.address}`);

    const signers = await ethers.getSigners();

    const smartWillContract = await ethers.getContractAt("SmartWill", SmartWillDeployment.address);

    try {
      const content = await smartWillContract.connect(signers[0]).getWillContent();
      console.log("Encrypted will content:", content);
    } catch (error) {
      console.log("Error:", error.message);
    }
  });

/**
 * Example:
 *   - npx hardhat --network localhost task:get-will-metadata
 *   - npx hardhat --network sepolia task:get-will-metadata
 */
task("task:get-will-metadata", "Gets will metadata for the caller")
  .addOptionalParam("address", "Optionally specify the SmartWill contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;

    const SmartWillDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("SmartWill");
    console.log(`SmartWill: ${SmartWillDeployment.address}`);

    const signers = await ethers.getSigners();

    const smartWillContract = await ethers.getContractAt("SmartWill", SmartWillDeployment.address);

    try {
      const [owner, timestamp, exists] = await smartWillContract.connect(signers[0]).getWillMetadata();
      console.log("Will metadata:");
      console.log("Owner:", owner);
      console.log("Timestamp:", new Date(Number(timestamp) * 1000).toISOString());
      console.log("Exists:", exists);
    } catch (error) {
      console.log("Error:", error.message);
    }
  });

/**
 * Example:
 *   - npx hardhat --network localhost task:decrypt-addresses
 *   - npx hardhat --network sepolia task:decrypt-addresses
 */
task("task:decrypt-addresses", "Decrypts the three addresses for the caller")
  .addOptionalParam("address", "Optionally specify the SmartWill contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    await fhevm.initializeCLIApi();

    const SmartWillDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("SmartWill");
    console.log(`SmartWill: ${SmartWillDeployment.address}`);

    const signers = await ethers.getSigners();

    const smartWillContract = await ethers.getContractAt("SmartWill", SmartWillDeployment.address);

    try {
      const encAddr1 = await smartWillContract.connect(signers[0]).getAddress1();
      const encAddr2 = await smartWillContract.connect(signers[0]).getAddress2();
      const encAddr3 = await smartWillContract.connect(signers[0]).getAddress3();

      if (encAddr1 === ethers.ZeroHash || encAddr2 === ethers.ZeroHash || encAddr3 === ethers.ZeroHash) {
        console.log("One or more encrypted addresses are empty");
        return;
      }

      const clearAddr1 = await fhevm.userDecryptAddress(
        encAddr1,
        SmartWillDeployment.address,
        signers[0]
      );

      const clearAddr2 = await fhevm.userDecryptAddress(
        encAddr2,
        SmartWillDeployment.address,
        signers[0]
      );

      const clearAddr3 = await fhevm.userDecryptAddress(
        encAddr3,
        SmartWillDeployment.address,
        signers[0]
      );

      console.log("Decrypted addresses:");
      console.log("Address 1:", clearAddr1);
      console.log("Address 2:", clearAddr2);
      console.log("Address 3:", clearAddr3);
    } catch (error) {
      console.log("Error:", error.message);
    }
  });

/**
 * Example:
 *   - npx hardhat --network localhost task:get-total-wills
 *   - npx hardhat --network sepolia task:get-total-wills
 */
task("task:get-total-wills", "Gets the total number of wills created")
  .addOptionalParam("address", "Optionally specify the SmartWill contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;

    const SmartWillDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("SmartWill");
    console.log(`SmartWill: ${SmartWillDeployment.address}`);

    const smartWillContract = await ethers.getContractAt("SmartWill", SmartWillDeployment.address);

    const totalWills = await smartWillContract.getTotalWills();
    console.log("Total wills created:", totalWills.toString());
  });