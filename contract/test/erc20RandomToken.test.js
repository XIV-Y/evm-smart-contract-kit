const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("XIVYRandomToken", function () {
  let owner, user, other;
  let XIVYRandomToken, xivyRandomToken;
  let SimpleRandomOracle, simpleRandomOracle;

  beforeEach(async function () {
    [owner, user, other] = await ethers.getSigners();

    // オラクルをデプロイ
    SimpleRandomOracle = await ethers.getContractFactory("SimpleRandomOracle");
    simpleRandomOracle = await SimpleRandomOracle.deploy();
    await simpleRandomOracle.waitForDeployment();

    // トークンをデプロイ
    XIVYRandomToken = await ethers.getContractFactory("XIVYRandomToken");
    xivyRandomToken = await XIVYRandomToken.deploy();
    await xivyRandomToken.waitForDeployment();

    // オラクルアドレスを設定
    await xivyRandomToken.setRandomOracle(simpleRandomOracle.target);
  });

  describe("dailyLuckyDraw", function () {
    it("should allow user to claim once per day and emit event", async function () {
      // 初回クレーム
      await expect(xivyRandomToken.connect(user).dailyLuckyDraw())
        .to.emit(xivyRandomToken, "RandomReward");

      // 2回目は失敗
      await expect(
        xivyRandomToken.connect(user).dailyLuckyDraw()
      ).to.be.revertedWith("ERR: Already claimed today");
    });

    it("should not allow claim if oracle is not set", async function () {
      // 新しいコントラクトでoracle未設定
      const token2 = await XIVYRandomToken.deploy();
      await token2.waitForDeployment();

      await expect(
        token2.connect(user).dailyLuckyDraw()
      ).to.be.revertedWith("ERR: Random oracle not set");
    });
  });

  describe("getNextClaimTime", function () {
    it("should return current time for first claim", async function () {
      const now = (await ethers.provider.getBlock("latest")).timestamp;
      const next = await xivyRandomToken.getNextClaimTime(user.address);
      // 多少の誤差を許容
      expect(Number(next)).to.be.closeTo(Number(now), 3);
    });

    it("should return last claim time + 1 days after claim", async function () {
      await xivyRandomToken.connect(user).dailyLuckyDraw();
      const block = await ethers.provider.getBlock("latest");
      const expected = block.timestamp + 24 * 60 * 60;
      const next = await xivyRandomToken.getNextClaimTime(user.address);
      expect(Number(next)).to.be.closeTo(Number(expected), 3);
    });
  });

  describe("canClaim", function () {
    it("should return true if never claimed", async function () {
      expect(await xivyRandomToken.canClaim(user.address)).to.equal(true);
    });

    it("should return false right after claim", async function () {
      await xivyRandomToken.connect(user).dailyLuckyDraw();
      expect(await xivyRandomToken.canClaim(user.address)).to.equal(false);
    });

    it("should return true after 1 day", async function () {
      await xivyRandomToken.connect(user).dailyLuckyDraw();
      // 1日進める
      await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]);
      await ethers.provider.send("evm_mine");
      expect(await xivyRandomToken.canClaim(user.address)).to.equal(true);
    });
  });
});
