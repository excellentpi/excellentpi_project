pragma solidity ^0.8.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol 
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
 
interface IContractString {
  function text(uint) external view returns (string memory);
}

contract YourContract is ERC721Enumerable, Ownable {
 
  uint public constant MAX_TOKENS = 1000;
  uint256 private _maxPerTx = 5; // Set to one higher than actual, to save gas on lte/gte checks.

  IContractString contractString;

  string[51] _blue = ["solidity","encodePacked","encode","ownerOf","toString","supportsInterface","balanceOf","name","symbol","_exists","_baseURI","approve","_msgSender","_approve","Approve","getApproved","isApprovedForAll","setApprovalForAll","ApprovalForAll","Approval","transferFrom","_isApprovedOrOwner","safeTransferFrom","safeTransferFrom","_safeTransfer","_transfer","_checkOnERC721Received","IERC721Receiver","onERC721Received","_safeMint","_mint","_beforeTokenTransfer","Transfer","_burn","_transfer","isContract","add","mload","tokenURI","extcodesize","sendValue","functionCall","functionCallWithValue","call","_verifyCallResult","functionStaticCall","staticcall","functionDelegateCall","delegatecall","_msgData","toHexString"];
  string[3] _green = ["function", "interface", '"'];
  string[19] _italicPurple = ["view","public","private","pure","override","memory","abstract","virtual","external","internal","event","indexed","external","calldata","library","let","contract","constant","constructor"];
  string[19] _purple = ["Strings","Context","IERC165","IERC721","ERC165","ERC721","bytes","bytes1","bytes4","bytes16","uint","uint8","uint256","bool","string","address","IERC721Metadata","Address","mapping"];
  string[1] _italicYellow = ["is"];
  string[12] _yellow = ["returns","return","pragma","assembly","require","if","else","revert","while","new","for","using"];
  string[11] _orange = ["0","1","2","3","4","10","32","48","^0.8.0","this","0xf"];
  string[28] _red = ["abi","tokenId","interfaceId","from","to","owner","approved","operator","balance","_approved","data","account","payable","recipient","amount","success","target","errorMessage","value","returndata","msg","sender","temp","digits","length","i","type","super"];
  string[22] _grey = ["[","]","{","}","(",")",".",";","/","/","SPDX-License-Identifier:","MIT","Nice","+","-","*","=",">","<","&","|","!"];

  struct svgWord {
    string svg;
    string word;
  }

  constructor() ERC721("NonFungibleNFT", "NFNFT") Ownable() {
    contractString = IContractString(address(0xffa7CA1AEEEbBc30C874d32C7e22F052BbEa0429));
  }


  function getSlice(uint256 begin, uint256 end, string memory text) public view returns (string memory) {
      bytes memory a = new bytes(end-begin);
      for(uint i=0;i<end-begin;i++){
          a[i] = bytes(text)[i+begin];
      }
      return string(a);    
  }

  function bytesToString(bytes1 byteCode) public pure returns(string memory stringData) {
    uint256 blank = 0; //blank 32 byte value
    uint256 length = byteCode.length;

    uint cycles = byteCode.length / 0x20;
    uint requiredAlloc = length;

    if (length % 0x20 > 0) //optimise copying the final part of the bytes - to avoid looping with single byte writes
    {
        cycles++;
        requiredAlloc += 0x20; //expand memory to allow end blank, so we don't smack the next stack entry
    }

    stringData = new string(requiredAlloc);

    //copy data in 32 byte blocks
    assembly {
        let cycle := 0

        for
        {
            let mc := add(stringData, 0x20) //pointer into bytes we're writing to
            let cc := add(byteCode, 0x20)   //pointer to where we're reading from
        } lt(cycle, cycles) {
            mc := add(mc, 0x20)
            cc := add(cc, 0x20)
            cycle := add(cycle, 0x01)
        } {
            mstore(mc, mload(cc))
        }
    }

    //finally blank final bytes and shrink size (part of the optimisation to avoid looping adding blank bytes1)
    if (length % 0x20 > 0)
    {
        uint offsetStart = 0x20 + length;
        assembly
        {
            let mc := add(stringData, offsetStart)
            mstore(mc, mload(add(blank, 0x20)))
            //now shrink the memory back so the returned object is the correct size
            mstore(stringData, length)
        }
    }
  }

  // function lineifier(uint tokenId) private view returns (string memory) {
  //   string[] memory lines = new string[](528);
  //   uint lastIndex = 0;
  //   uint lineCount = 0;
  //   for (uint i; i < bytes(contractString.text()).length; i++) {
  //     if (bytes(contractString.text())[i] == "$") {
  //       lineCount += 1;
  //       if (lineCount == tokenId) {
  //         console.log("line: %s", getSlice(lastIndex, i, contractString.text()));
  //         return getSlice(lastIndex, i, contractString.text());
  //       }
  //       lastIndex = i + 1;
  //     }
  //   }
  //   return lines[tokenId];
  // }

  function wordifier(string memory _text) private view returns (string[] memory) {
    string[] memory _tempWords = new string[](150);
    uint lastIndex = 0;
    uint wordCount = 0;
    bool removeWhiteSpace = true;
    for (uint i = 0; i < bytes(_text).length; i++) {
      if (
        bytes(_text)[i] == " " ||
        bytes(_text)[i] == "(" ||
        bytes(_text)[i] == ")" ||
        bytes(_text)[i] == "[" ||
        bytes(_text)[i] == "]" ||
        bytes(_text)[i] == "{" ||
        bytes(_text)[i] == "}" ||
        bytes(_text)[i] == "<" ||
        bytes(_text)[i] == ">" ||
        bytes(_text)[i] == '"' ||
        bytes(_text)[i] == "+" ||
        bytes(_text)[i] == "-" ||
        bytes(_text)[i] == "*" ||
        bytes(_text)[i] == "/" ||
        bytes(_text)[i] == "=" ||
        bytes(_text)[i] == "&" ||
        bytes(_text)[i] == "|" ||
        (bytes(_text)[i] == "." && bytes(_text)[i + 1] != "0" && bytes(_text)[i + 1] != "8") ||
        bytes(_text)[i] == ";" ||
        bytes(_text)[i] == ","
      ) {
        if (bytes(_text)[i] == " " && removeWhiteSpace) {
          lastIndex = i+1;
          continue;
        }
        removeWhiteSpace = false;
        _tempWords[wordCount] = getSlice(lastIndex, i, _text);
        console.log("word: %s", _tempWords[wordCount]);
        bytes memory a = new bytes(1);
        if (bytes(_text)[i] == ">") {
          _tempWords[wordCount + 1] = "&gt;";
        }
        else if (bytes(_text)[i] == "<" ) {
          _tempWords[wordCount + 1] = "&lt;";
        }
        else {
          a[0] = bytes(_text)[i];
          _tempWords[wordCount + 1] = string(a);
        }
        console.log("word: %s", _tempWords[wordCount+1]);
        wordCount += 2;
        lastIndex = i + 1;
      }
      else {
        removeWhiteSpace = false;
      }
    }
    if (lastIndex < bytes(_text).length - 1) {
      _tempWords[wordCount] = getSlice(lastIndex, bytes(_text).length-1, _text);
      console.log("word: %s", _tempWords[wordCount]);
      wordCount += 1;
    }
    string[] memory _words = new string[](wordCount);
    for (uint i; i < _words.length; i++) {
      _words[i] = _tempWords[i];
    }
    return _words; 
  }

  function getKeywords() private view returns (string[][] memory){
    string[][] memory keywordsArray = new string[][](9);
    keywordsArray[0] = new string[](51);
    for (uint i; i<keywordsArray[0].length; i++) {
      keywordsArray[0][i] = _blue[i];
    }
    keywordsArray[1] = new string[](3);
    for (uint i; i<keywordsArray[1].length; i++) {
      keywordsArray[1][i] = _green[i];
    }
    keywordsArray[2] = new string[](19);
    for (uint i; i<keywordsArray[2].length; i++) {
      keywordsArray[2][i] = _italicPurple[i];
    }
    keywordsArray[3] = new string[](19);
    for (uint i; i<keywordsArray[3].length; i++) {
      keywordsArray[3][i] = _purple[i];
    }
    keywordsArray[4] = new string[](1);
    for (uint i; i<keywordsArray[4].length; i++) {
      keywordsArray[4][i] = _italicYellow[i];
    }
    keywordsArray[5] = new string[](12);
    for (uint i; i<keywordsArray[5].length; i++) {
      keywordsArray[5][i] = _yellow[i];
    }
    keywordsArray[6] = new string[](11);
    for (uint i; i<keywordsArray[6].length; i++) {
      keywordsArray[6][i] = _orange[i];
    }
    keywordsArray[7] = new string[](28);
    for (uint i; i<keywordsArray[7].length; i++) {
      keywordsArray[7][i] = _red[i];
    }
    keywordsArray[8] = new string[](22);
    for (uint i; i<keywordsArray[8].length; i++) {
      keywordsArray[8][i] = _grey[i];
    }
    return keywordsArray;
  }

  function painter(string memory word, string[] memory keywords, string memory paintColour) private pure returns(svgWord memory) {
    for(uint j; j < keywords.length; j++) {
      if (keccak256(bytes(word)) == keccak256(bytes(keywords[j]))) {
        return svgWord(string(abi.encodePacked('<tspan ', paintColour, '>', word, '</tspan>')), word);
      }
    }
    return svgWord("","");
  }

  function colourifier(string[] memory _words) private view returns (svgWord[] memory) {
    string[][] memory keywords = getKeywords();
    svgWord[] memory colouredWords = new svgWord[](_words.length);
    svgWord memory painted;
    for(uint i; i < _words.length; i++) {
      painted = painter(_words[i], string[](keywords[0]), 'class="blue"');
      if (keccak256(bytes(painted.word)) != keccak256(bytes(""))) {
        colouredWords[i] = painted;
        continue;
      }
      painted = painter(_words[i], string[](keywords[1]), 'class="green"');
      if (keccak256(bytes(painted.word)) != keccak256(bytes(""))) {
        colouredWords[i] = painted;
        continue;
      }
      painted = painter(_words[i], string[](keywords[2]), 'class="purple" font-style="italic"');
      if (keccak256(bytes(painted.word)) != keccak256(bytes(""))) {
        colouredWords[i] = painted;
        continue;
      }
      painted = painter(_words[i], string[](keywords[3]), 'class="purple"');
      if (keccak256(bytes(painted.word)) != keccak256(bytes(""))) {
        colouredWords[i] = painted;
        continue;
      }
      painted = painter(_words[i], string[](keywords[4]), 'class="yellow" font-style="italic"');
      if (keccak256(bytes(painted.word)) != keccak256(bytes(""))) {
        colouredWords[i] = painted;
        continue;
      }
      painted = painter(_words[i], string[](keywords[5]), 'class="yellow"');
      if (keccak256(bytes(painted.word)) != keccak256(bytes(""))) {
        colouredWords[i] = painted;
        continue;
      }
      painted = painter(_words[i], string[](keywords[6]), 'class="orange"');
      if (keccak256(bytes(painted.word)) != keccak256(bytes(""))) {
        colouredWords[i] = painted;
        continue;
      }
      painted = painter(_words[i], string[](keywords[7]), 'class="red"');
      if (keccak256(bytes(painted.word)) != keccak256(bytes(""))) {
        colouredWords[i] = painted;
        continue;
      }
      painted = painter(_words[i], string[](keywords[8]), 'class="grey"');
      if (keccak256(bytes(painted.word)) != keccak256(bytes(""))) {
        colouredWords[i] = painted;
        continue;
      }
      colouredWords[i] = svgWord(string(abi.encodePacked('<tspan class="white">',_words[i], '</tspan>')), _words[i]);
      continue;
    }
    return colouredWords;
  }

  function chunker(svgWord[] memory _words) private view returns (string[] memory) {
    uint _maxWordsPerLine = 100;
    uint _maxlines = 10;
    string[][] memory _chunks = new string[][](_maxlines);
    // thing.push(true);
    // const _words = _wordsMap[0];
    // const lengths = _wordsMap[1];
    uint _max_length = 35;
    uint _sum = 0;
    uint _chunk = 0;
    uint _wordsInChunk = 0;
    for (uint i = 0; i < _words.length; i++) {
      // console.log(_words[i].svg);
      if (_sum + bytes(_words[i].word).length >= _max_length) {
        _sum = 0;
        _wordsInChunk = 0;
        _chunk += 1;
        if (keccak256(bytes(_words[i].word)) != keccak256(bytes(" "))) {
          string[] memory svg = new string[](_maxWordsPerLine);
          svg[0] = _words[i].svg;
          _chunks[_chunk] = svg;
          _wordsInChunk += 1;
        }
      } else {
        if (_chunks[_chunk].length > 0) {
          // console.log(_wordsInChunk);
          _chunks[_chunk][_wordsInChunk] = _words[i].svg;
          // console.log(_words[i].svg);
          // console.log(_chunks[_chunk][_wordsInChunk]);
          _wordsInChunk += 1;
        } else if (keccak256(bytes(_words[i].word)) != keccak256(bytes(" "))) {
          string[] memory svg = new string[](_maxWordsPerLine);
          svg[0] = _words[i].svg;
          _chunks[_chunk] = svg;
          _wordsInChunk += 1;
        }
      }
      _sum += bytes(_words[i].word).length;
    }
    string[] memory _output = new string[](_maxlines);
    for (uint256 i; i < _chunks.length; i++) {
      if (_chunks[i].length > 0) {
        for (uint256 j; j < _chunks[i].length; j++) {
          _output[i] = string(abi.encodePacked(_output[i], _chunks[i][j]));
        }
      }
    }
    return _output;
  }

  function tokenURI(uint256 tokenId) override public view returns (string memory) {
        string memory _text = "_svgMiddle = string(abi.encodePacked(_svgMiddle, '<tspan x='30' dx='10' dy='22'>', _chunks[i], '</tspan>'));"; 
        string memory _svgStart = string('<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base {fill: #9DA3A3; font-family: monospace; font-size: 14px;} .blue {fill: #00B7A5;} .orange {fill: #D85D00;} .green {fill: #009568;} .yellow {fill: #E39300;} .red {fill: #CB003F;} .white {fill: #9DA3A3;} .grey {fill: #3C3F42;} .purple {fill: #A431F8;} .muted {fill: #282B30;} .bright {fill: #0087A3;} .italic {font-style: italic;}</style><rect width="100%" height="100%" fill="#0E1013" /><line x1="35" y1="15" x2="35" y2="335" stroke="#282B30" /><text x="10" y="20" class="base"><tspan x="5" y="10" dy="22" class="muted">');
        string memory _lineNumber = Strings.toString(tokenId);
        string memory _LineNumEnd = string('</tspan><tspan x="30" y="10">');
        string memory _svgEnd = string('</tspan></text></svg>');
        string[] memory _chunks = chunker(colourifier(wordifier(contractString.text(tokenId-1))));
        string memory _svgMiddle = "";
        for (uint256 i; i < _chunks.length; i++) {
          _svgMiddle = string(abi.encodePacked(_svgMiddle, '<tspan x="35" dx="10" dy="22">', _chunks[i], '</tspan>'));
        }
        // string memory json = string(abi.encodePacked('{"image": "', svg, '"}'));

        string memory _json = Base64.encode(
          bytes(
            string(
              abi.encodePacked(
                '{"image": "data:image/svg+xml;base64,', 
                Base64.encode(bytes(abi.encodePacked(_svgStart, _lineNumber, _LineNumEnd,_svgMiddle, _svgEnd))), 
                '"}'
              )
            )
          )
        );
        
        console.log(string(abi.encodePacked(_svgStart, _lineNumber, _LineNumEnd,_svgMiddle, _svgEnd)));

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