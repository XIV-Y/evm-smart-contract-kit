
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IRandomOracle {
  function getRandomNumber(uint256 min, uint256 max) external returns (uint256);
}

contract XIVYRandomToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
  // 報酬設定
  uint256 public constant JACKPOT_REWARD = 30 * (10 ** 18);    // 30 XIVY
  uint256 public constant NORMAL_REWARD = 20 * (10 ** 18);     // 20 XIVY
  uint256 public constant CONSOLATION_REWARD = 1 * (10 ** 18); // 1 XIVY

  // 確率設定（パーセンテージ）
  uint256 public constant JACKPOT_CHANCE = 10;     // 10%
  uint256 public constant NORMAL_CHANCE = 20;      // 20%
  uint256 public constant CONSOLATION_CHANCE = 70; // 70%
  
  uint8 private constant DECIMALS = 18;

  // 初期供給量
  uint256 private immutable _initialSupply = 1_000_000 * (10 ** DECIMALS);

  // 最大供給量
  uint256 private immutable _maxSupply = 10_000_000 * (10 ** DECIMALS);

  // ランダムオラクルアドレス
  IRandomOracle public randomOracle;

  // ユーザーの最後のクレーム時間（日次制限）
  mapping(address => uint256) public lastRandomClaim;

  // イベント
  event RandomReward(address indexed user, uint256 amount, uint256 randomNumber, string rewardType);
  event OracleUpdated(address indexed newOracle);

  constructor() ERC20("XIVYRandomToken", "XIVYR") Ownable(msg.sender) {
    _mint(msg.sender, _initialSupply);
  }

  function dailyLuckyDraw() external whenNotPaused {
    require(randomOracle != IRandomOracle(address(0)), "ERR: Random oracle not set");
    
    require(block.timestamp >= lastRandomClaim[msg.sender] + 1 days, "ERR: Already claimed today");
    
    require(totalSupply() + JACKPOT_REWARD <= _maxSupply, "ERR: Insufficient supply for max reward");

    // 1-100の乱数を取得
    uint256 randomNumber = randomOracle.getRandomNumber(1, 100);

    uint256 rewardAmount;
    string memory rewardType;

    if (randomNumber <= JACKPOT_CHANCE) {
      rewardAmount = JACKPOT_REWARD;
      rewardType = "JACKPOT";
    } else if (randomNumber <= JACKPOT_CHANCE + NORMAL_CHANCE) {
      rewardAmount = NORMAL_REWARD;
      rewardType = "NORMAL";
    } else {
      rewardAmount = CONSOLATION_REWARD;
      rewardType = "CONSOLATION";
    }

    _mint(msg.sender, rewardAmount);
        
    // 最後のクレーム時間を更新
    lastRandomClaim[msg.sender] = block.timestamp;

    emit RandomReward(msg.sender, rewardAmount, randomNumber, rewardType);
  }

  
  /**
  * 次回クレーム可能時間を取得
  */
  function getNextClaimTime(address user) external view returns (uint256) {
    if (lastRandomClaim[user] == 0) {
      return block.timestamp; // 初回は即座にクレーム可能
    }

    return lastRandomClaim[user] + 1 days;
  }

  /**
  * クレーム可能かどうかを確認
  */
  function canClaim(address user) external view returns (bool) {
    return block.timestamp >= lastRandomClaim[user] + 1 days;
  }

  /**
  * ランダムオラクルアドレスを設定（オーナーのみ）
  */
  function setRandomOracle(address _randomOracle) external onlyOwner {
    require(_randomOracle != address(0), "ERR: Invalid oracle address");
    
    randomOracle = IRandomOracle(_randomOracle);
    
    emit OracleUpdated(_randomOracle);
  }

  function mint(address to, uint256 amount) public onlyOwner {
    require(totalSupply() + amount <= _maxSupply, "ERR: minting would exceed max supply");
    _mint(to, amount);
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  function decimals() public view virtual override returns (uint8) {
    return DECIMALS;
  }

  function maxSupply() public view returns (uint256) {
    return _maxSupply;
  }

  function _update(address from, address to, uint256 amount) internal override(ERC20, ERC20Pausable) {
    super._update(from, to, amount);
  }
}

contract SimpleRandomOracle is IRandomOracle {
  uint256 private nonce;
  
  function getRandomNumber(uint256 min, uint256 max) external returns (uint256) {
    nonce++;

    uint256 randomHash = uint256(keccak256(abi.encodePacked(
      block.timestamp,
      block.prevrandao,
      msg.sender,
      nonce
    )));

    return (randomHash % (max - min + 1)) + min;
  }
}