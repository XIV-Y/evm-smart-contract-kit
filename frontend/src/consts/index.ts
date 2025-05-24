export const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

export const ERC20_ADDRESS = "0x85368B4dFd4a13a5d20ba7183204C854bC05Ea9E";

export const XIVY_RANDOM_TOKEN_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address,uint256) returns (bool)",
  "function dailyLuckyDraw()",
  "function getNextClaimTime(address) view returns (uint256)",
  "function canClaim(address) view returns (bool)",
  "function setRandomOracle(address)",
  "event RandomReward(address indexed user, uint256 amount, uint256 randomNumber, string rewardType)"
];

export const XIVY_RANDOM_TOKEN_ADDRESS = "0xEdb56Ed7f0Fd9f0be5c684aAAB3Aa984741CC430";
