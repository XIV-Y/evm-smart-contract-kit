// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract UpgradeXIVYToken is Initializable, ERC20Upgradeable, ERC20PausableUpgradeable, OwnableUpgradeable {
  uint8 private constant DECIMALS = 18;

  // 初期供給量
  uint256 private _initialSupply;

  // 最大供給量
  uint256 private _maxSupply;

  function initialize(string memory name, string memory symbol, uint256 initialSupply, uint256 maxSupply) public initializer {
    __ERC20_init(name, symbol);
    __Ownable_init(msg.sender);
    _initialSupply = initialSupply;
    _maxSupply = maxSupply;
    _mint(msg.sender, initialSupply);
  }

  function mint(address to, uint256 amount) public onlyOwner {
    require(totalSupply() + amount <= _maxSupply, "ERC20: minting would exceed max supply");

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

  function _update(address from , address to, uint256 amount) internal override(ERC20Upgradeable, ERC20PausableUpgradeable) {
    super._update(from, to, amount);
  }

  
  function version() public pure returns (string memory) {
    return "v1.1.1";
  }
}
