import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  await deploy("SmartWill", {
    from: deployer,
    args: [],
    log: true,
  });
};
export default func;
func.id = "deploy_smartwill"; // id required to prevent reexecution
func.tags = ["SmartWill"];
