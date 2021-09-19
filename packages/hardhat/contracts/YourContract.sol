pragma solidity ^0.8.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol 
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
 
contract YourContract is ERC721Enumerable, Ownable {
 
  constructor() ERC721("NonFungibleNFT", "NFNFT") Ownable() {}

  function tokenURI(uint256 tokenId) override public view returns (string memory) {
        string[4] memory parts;
        parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">';

        parts[1] = 'function tokenURI(uint256 tokenId) override public view returns (string memory) {';

        parts[2] = '</text>';

        parts[3] = '</text></svg>';

        string memory output = string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3]));
        
        string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "Bag #', Strings.toString(tokenId), '", "description": "Loot", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '"}'))));
        output = string(abi.encodePacked('data:application/json;base64,', json));

        return output;
    }
}