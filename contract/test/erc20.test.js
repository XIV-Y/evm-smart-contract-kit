const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('XIVYToken', function () {
  let XIVYToken, xivyToken, owner, addr1, addr2;

  beforeEach(async function () {
    // コントラクトのデプロイ
    XIVYToken = await ethers.getContractFactory("XIVYToken");

    [owner, addr1, addr2, _] = await ethers.getSigners();

    xivyToken = await XIVYToken.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await xivyToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await xivyToken.balanceOf(owner.address);

      expect(await xivyToken.totalSupply()).to.equal(ownerBalance);
    });
    
    it("Should have correct name and symbol", async function () {
      expect(await xivyToken.name()).to.equal("XIVYToken");
      expect(await xivyToken.symbol()).to.equal("XIVY");
    });
    
    it("Should have 18 decimals", async function () {
      expect(await xivyToken.decimals()).to.equal(18);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      await xivyToken.transfer(addr1.address, 50);

      const addr1Balance = await xivyToken.balanceOf(addr1.address);

      expect(addr1Balance).to.equal(50);

      await xivyToken.connect(addr1).transfer(addr2.address, 20);

      const addr2Balance = await xivyToken.balanceOf(addr2.address);

      expect(addr2Balance).to.equal(20);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await xivyToken.balanceOf(owner.address);
      
      await expect(
        xivyToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWithCustomError(xivyToken, "ERC20InsufficientBalance");

      expect(await xivyToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const initialSupply = await xivyToken.totalSupply();
      const mintAmount = ethers.parseEther("1000");
      
      await xivyToken.mint(addr1.address, mintAmount);
      
      expect(await xivyToken.balanceOf(addr1.address)).to.equal(mintAmount);
      expect(await xivyToken.totalSupply()).to.equal(initialSupply + mintAmount);
    });
    
    it("Should not allow non-owner to mint tokens", async function () {
      await expect(
        xivyToken.connect(addr1).mint(addr1.address, 1000)
      ).to.be.revertedWithCustomError(xivyToken, "OwnableUnauthorizedAccount");
    });
    
    it("Should not allow minting more than max supply", async function () {
      const maxSupply = await xivyToken.maxSupply();
      const currentSupply = await xivyToken.totalSupply();
      const excessAmount = maxSupply - currentSupply + 1n;
      
      await expect(
        xivyToken.mint(owner.address, excessAmount)
      ).to.be.revertedWith("ERC20: minting would exceed max supply");
    });
  });

  describe("Pausable", function () {
    it("Should allow owner to pause and unpause transfers", async function () {
      await xivyToken.pause();
      
      await expect(
        xivyToken.transfer(addr1.address, 100)
      ).to.be.revertedWithCustomError(xivyToken, "EnforcedPause");
      
      await xivyToken.unpause();
      
      await xivyToken.transfer(addr1.address, 100);

      expect(await xivyToken.balanceOf(addr1.address)).to.equal(100);
    });
    
    it("Should not allow non-owner to pause", async function () {
      await expect(
        xivyToken.connect(addr1).pause()
      ).to.be.revertedWithCustomError(xivyToken, "OwnableUnauthorizedAccount");
    });
  });
})
