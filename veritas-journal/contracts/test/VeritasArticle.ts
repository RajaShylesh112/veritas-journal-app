import { expect } from "chai";
import { ethers } from "hardhat";

describe("VeritasArticle", function () {
  it("Should mint a new article and set the URI", async function () {
    const [owner] = await ethers.getSigners();
    const VeritasArticle = await ethers.getContractFactory("VeritasArticle");
    const veritasArticle = await VeritasArticle.deploy();

    const tokenURI = "https://veritas.journal/article/1";
    const tx = await veritasArticle.mintArticle(tokenURI);
    await tx.wait();

    expect(await veritasArticle.tokenURI(0)).to.equal(tokenURI);
    expect(await veritasArticle.ownerOf(0)).to.equal(owner.address);
  });
});
