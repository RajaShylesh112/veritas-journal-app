import { ethers } from "hardhat";

async function main() {
  const VeritasArticle = await ethers.getContractFactory("VeritasArticle");
  console.log("Deploying VeritasArticle...");
  const veritasArticle = await VeritasArticle.deploy();

  await veritasArticle.waitForDeployment();

  console.log("VeritasArticle deployed to:", await veritasArticle.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
