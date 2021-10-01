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
  string private _text = "string memory output = string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3]));";

  constructor() ERC721("NonFungibleNFT", "NFNFT") Ownable() {}

  struct svgWord {
    string svg;
    string word;
  }

  function stringEquals(string memory a, string memory b) internal returns (bool) {
    if(bytes(a).length != bytes(b).length) {
        return false;
    } else {
        return keccak256(abi.encode(a)) == keccak256(abi.encode(b));
    }
}

  function wordifier(string memory _text) private pure returns (string[] memory) {
    string[] memory _words = new string[](34);
    _words[0] = "string";
    _words[1] = "output";
    _words[2] = "string";
    _words[3] = "memory";
    _words[4] = "output";
    _words[5] = "=";
    _words[6] = "string";
    _words[7] = "(";
    _words[8] = "abi";
    _words[9] = ".";
    _words[10] = "encodePacked";
    _words[11] = "(";
    _words[12] = "parts";
    _words[13] = "[";
    _words[14] = "0";
    _words[15] = "]";
    _words[16] = ",";
    _words[17] = "parts";
    _words[18] = "[";
    _words[19] = "1";
    _words[20] = "]";
    _words[21] = ",";
    _words[22] = "parts";
    _words[23] = "[";
    _words[24] = "2";
    _words[25] = "]";
    _words[26] = ",";
    _words[27] = "parts";
    _words[28] = "[";
    _words[29] = "3";
    _words[30] = "]";
    _words[31] = ")";
    _words[32] = ")";
    _words[33] = ";";
    return _words;
  }

  function colourifier(string[] memory _words) private pure returns (svgWord[] memory) {
    string[51] memory _blue = ["solidity","encodePacked","encode","ownerOf","toString","supportsInterface","balanceOf","name","symbol","_exists","_baseURI","approve","_msgSender","_approve","Approve","getApproved","isApprovedForAll","setApprovalForAll","ApprovalForAll","Approval","transferFrom","_isApprovedOrOwner","safeTransferFrom","safeTransferFrom","_safeTransfer","_transfer","_checkOnERC721Received","IERC721Receiver","onERC721Received","_safeMint","_mint","_beforeTokenTransfer","Transfer","_burn","_transfer","isContract","add","mload","tokenURI","extcodesize","sendValue","functionCall","functionCallWithValue","call","_verifyCallResult","functionStaticCall","staticcall","functionDelegateCall","delegatecall","_msgData","toHexString"];
    string[3] memory _green = ["function", "interface", '"'];
    string[19] memory _italicPurple = ["view","public","private","pure","override","memory","abstract","virtual","external","internal","event","indexed","external","calldata","library","let","contract","constant","constructor"];
    string[19] memory _purple = ["Strings","Context","IERC165","IERC721","ERC165","ERC721","bytes","bytes1","bytes4","bytes16","uint","uint8","uint256","bool","string","address","IERC721Metadata","Address","mapping"];
    string[1] memory _italicYellow = ["is"];
    string[12] memory _yellow = ["returns","return","pragma","assembly","require","if","else","revert","while","new","for","using"];
    string[11] memory _orange = ["0","1","2","3","4","10","32","48","^0.8.0","this","0xf"];
    string[28] memory _red = ["abi","tokenId","interfaceId","from","to","owner","approved","operator","balance","_approved","data","account","payable","recipient","amount","success","target","errorMessage","value","returndata","msg","sender","temp","digits","length","i","type","super"];
    string[22] memory _grey = ["[","]","{","}","(",")",".",";","/","/","SPDX-License-Identifier:","MIT","Nice","+","-","*","=",">","<","&","|","!"];
    svgWord[] memory colouredWords = new svgWord[](9);

    for(uint i; i < _words.length; i++) {
      for(uint j; j < _blue.length; j++) {
        if (keccak256(bytes(_words[i])) == keccak256(bytes(_blue[j]))) {
          colouredWords[i] = svgWord(string(abi.encodePacked('<tspan class="blue">', _words[i], '</tspan>')), _words[i]);
        }
      }
      for(uint j; j < _green.length; j++) {
        if (keccak256(bytes(_words[i])) == keccak256(bytes(_green[j]))) {
          colouredWords[i] = svgWord(string(abi.encodePacked('<tspan class="green">',_words[i], '</tspan>')), _words[i]);
        }
      }
      for(uint j; j < _italicPurple.length; j++) {
        if (keccak256(bytes(_words[i])) == keccak256(bytes(_italicPurple[j]))) {
          colouredWords[i] = svgWord(string(abi.encodePacked('<tspan class="purple" font-style="italic">',_words[i], '</tspan>')), _words[i]);
        }
      }
      for(uint j; j < _purple.length; j++) {
        if (keccak256(bytes(_words[i])) == keccak256(bytes(_purple[j]))) {
          colouredWords[i] = svgWord(string(abi.encodePacked('<tspan class="purple">',_words[i], '</tspan>')), _words[i]);
        }
      }
      for(uint j; j < _italicYellow.length; j++) {
        if (keccak256(bytes(_words[i])) == keccak256(bytes(_italicYellow[j]))) {
          colouredWords[i] = svgWord(string(abi.encodePacked('<tspan class="yellow" font-style="italic">',_words[i], '</tspan>')), _words[i]);
        }
      }
      for(uint j; j < _yellow.length; j++) {
        if (keccak256(bytes(_words[i])) == keccak256(bytes(_yellow[j]))) {
          colouredWords[i] = svgWord(string(abi.encodePacked('<tspan class="yellow">',_words[i], '</tspan>')), _words[i]);
        }
      }
      for(uint j; j < _orange.length; j++) {
        if (keccak256(bytes(_words[i])) == keccak256(bytes(_orange[j]))) {
          colouredWords[i] = svgWord(string(abi.encodePacked('<tspan class="orange">',_words[i], '</tspan>')), _words[i]);
        }
      }
      for(uint j; j < _red.length; j++) {
        if (keccak256(bytes(_words[i])) == keccak256(bytes(_red[j]))) {
          colouredWords[i] = svgWord(string(abi.encodePacked('<tspan class="red">',_words[i], '</tspan>')), _words[i]);
        }
      }
      for(uint j; j < _grey.length; j++) {
        if (keccak256(bytes(_words[i])) == keccak256(bytes(_grey[j]))) {
          colouredWords[i] = svgWord(string(abi.encodePacked('<tspan class="grey">',_words[i], '</tspan>')), _words[i]);
        }
      }

    }
    return colouredWords;
  }

  function chunker(svgWord[] memory _words) private pure returns (string[] memory) {
    string[][] memory _chunks;
    // const _words = _wordsMap[0];
    // const lengths = _wordsMap[1];
    uint _max_length = 35;
    uint _sum = 0;
    uint _chunk = 0;
    for (uint i = 0; i < _words.length; i++) {
      if (_sum + bytes(_words[i].word).length >= _max_length) {
        _sum = 0;
        _chunk += 1;
        if (keccak256(bytes(_words[i].word)) != keccak256(bytes(" "))) {
          string[] memory svg = new string[](1);
          svg[0] = _words[i].svg;
          _chunks[_chunk] = svg;
        }
      } else {
        if (_chunks[_chunk].length > 1) {
          _chunks[_chunk][_chunks[_chunk].length] = (_words[i].svg);
        } else if (keccak256(bytes(_words[i].word)) != keccak256(bytes(" "))) {
          string[] memory svg = new string[](1);
          svg[0] = _words[i].svg;
          _chunks[_chunk] = svg;
        }
      }
      _sum += bytes(_words[i].word).length;
    }
    string[] memory _output;
    for (uint256 i; i < _chunks.length; i++) {
      for (uint256 j; j < _chunks[i].length - 1; j++) {
        _output[i] = string(abi.encodePacked(_output[i], _chunks[i][j], _chunks[i][j + 1]));
      }
    }
    return _output;
  }

  function tokenURI(uint256 tokenId) override public view returns (string memory) {
        string memory _svgStart = string('<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base {fill: #9DA3A3; font-family: monospace; font-size: 14px;} .blue {fill: #00B7A5;} .orange {fill: #D85D00;} .green {fill: #009568;} .yellow {fill: #E39300;} .red {fill: #CB003F;} .white {fill: #9DA3A3;} .grey {fill: #3C3F42;} .purple {fill: #A431F8;} .muted {fill: #282B30;} .bright {fill: #0087A3;} .italic {font-style: italic;}</style><rect width="100%" height="100%" fill="#0E1013" /><line x1="30" y1="15" x2="30" y2="335" stroke="#282B30" /><text x="10" y="20" class="base"><tspan x="5" y="10" dy="22" class="muted">38</tspan><tspan x="30" y="10">');
        string memory _svgEnd = string('</tspan></text></svg>');
        string[] memory _chunks = chunker(colourifier(wordifier(_text)));
        string memory _svgMiddle = "";
        for (uint256 i; i < _chunks.length; i++) {
          _svgMiddle = string(abi.encodePacked(_svgMiddle, '<tspan x="30" dx="10" dy="22">', _chunks[i], '</tspan>'));
        }
        // string memory json = string(abi.encodePacked('{"image": "', svg, '"}'));
        string memory _json = Base64.encode(
          bytes(
            string(
              abi.encodePacked(
                '{"image": "data:image/svg+xml;base64,', 
                Base64.encode(bytes(abi.encodePacked(_svgStart, _svgMiddle, _svgEnd))), 
                '"}'
              )
            )
          )
        );
        
        string memory _output = string(
          abi.encodePacked('data:application/json;base64,', _json)
        );

        return _output;
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