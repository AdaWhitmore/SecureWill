import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";

type Signers = {
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

describe("SmartWill", function () {
  let signers: Signers;
  let contractAddress: string;
  let smartWill: any;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { alice: ethSigners[0], bob: ethSigners[1] };
  });

  beforeEach(async function () {
    if (!fhevm.isMock) {
      console.warn("This hardhat test suite cannot run on Sepolia Testnet");
      this.skip();
    }
    const f = await ethers.getContractFactory("SmartWill");
    smartWill = await f.deploy();
    contractAddress = await smartWill.getAddress();
  });

  it("submit and read back will data", async function () {
    await fhevm.initializeCLIApi();

    const C = "ciphertext:example";
    const a1 = signers.alice.address;
    const a2 = signers.bob.address;
    const a3 = ethers.ZeroAddress;

    const encryptedInput = await fhevm
      .createEncryptedInput(contractAddress, signers.alice.address)
      .addAddress(a1)
      .addAddress(a2)
      .addAddress(a3)
      .encrypt();

    const tx = await smartWill
      .connect(signers.alice)
      .submitWill(C, encryptedInput.handles[0], encryptedInput.handles[1], encryptedInput.handles[2], encryptedInput.inputProof);
    await tx.wait();

    expect(await smartWill.hasWill(signers.alice.address)).to.eq(true);
    const cBack = await smartWill.getEncryptedWill(signers.alice.address);
    expect(cBack).to.eq(C);

    const meta = await smartWill.getWillMeta(signers.alice.address);
    expect(meta[1]).to.eq(signers.alice.address);
  });
});

