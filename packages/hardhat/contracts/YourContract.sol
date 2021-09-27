pragma solidity ^0.8.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol 
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
 

 
contract YourContract is ERC721Enumerable, Ownable {
 
  uint public constant MAX_TOKENS = 1000;
  uint256 private _maxPerTx = 5; // Set to one higher than actual, to save gas on lte/gte checks.

  constructor() ERC721("NonFungibleNFT", "NFNFT") Ownable() {}

  function tokenURI(uint256 tokenId) override public view returns (string memory) {
        string[1] memory parts;
        parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"></svg>';

        string memory image = string(abi.encodePacked(parts[0]));
        
        // string memory json = string(abi.encodePacked('{"image": "', image, '"}'));
        string memory json = Base64.encode(
          bytes(
            string(
              abi.encodePacked(
                '{"image": "data:image/svg+xml;base64,', 
                Base64.encode(bytes(image)), 
                '"}'
              )
            )
          )
        );

        output = string(
          abi.encodePacked('data:application/json;base64,', json)
          );

        return output;
    }

  function mint(uint _count) public { // Does this need Nonreentrant??
      uint totalSupply = totalSupply();
      require(_count < _maxPerTx, "Exceeds max mint count per transaction");
      require(totalSupply < MAX_TOKENS, "Sold out");
      require(totalSupply + _count < MAX_TOKENS, "This amount will exceed max supply");

      for (uint i; i < _count; i++) {
        _safeMint(msg.sender, totalSupply + i);
      }
  }
}