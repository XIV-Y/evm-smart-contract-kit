// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CustomERC20 is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
  uint8 private constant _decimals = 18;

  // 初期供給量（固定値）
  uint256 private immutable _initialSupply = 1_000_000 * (10 ** _decimals);

  // 最大供給量（固定値）
  uint256 private immutable _maxSupply = 10_000_000 * (10 ** _decimals);

  constructor(
    string memory _name,
    string memory _symbol,
    address _owner
  ) ERC20(_name, _symbol) Ownable(_owner) {
    _mint(_owner, _initialSupply);
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
      return _decimals;
  }

  function maxSupply() public view returns (uint256) {
      return _maxSupply;
  }

  function _update(address from, address to, uint256 amount) internal override(ERC20, ERC20Pausable) {
      super._update(from, to, amount);
  }
}
