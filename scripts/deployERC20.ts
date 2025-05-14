import { HardhatRuntimeEnvironment } from "hardhat/types";

export async function deployERC20(name: string, symbol: string, supply: string) {
  const hre = require("hardhat");
  const ERC20 = await hre.ethers.getContractFactory("MyToken");
  const contract = await ERC20.deploy(name, symbol, hre.ethers.parseUnits(supply, 18));
  await contract.waitForDeployment();
  console.log(`✅ ${name} (${symbol}) deployed at: ${await contract.getAddress()}`);
}
