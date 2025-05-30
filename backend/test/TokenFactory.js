const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = require("hardhat");

describe("Token Factory", function () {
  it("Should create the memetoken successfully", async function () {
    const tokenFactoryct = await hre.ethers.deployContract("TokenFactory");

    const tx = await tokenFactoryct.createMemeToken(
      "Dogecoin",
      "DOGE",
      "This is a Doge Token",
      "image.png",
      {
        value: hre.ethers.parseEther("0.0001")
      }
    );
  });
});
