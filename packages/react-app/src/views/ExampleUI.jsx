import { SyncOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import { Address, Balance } from "../components";

export default function ExampleUI({
  purpose,
  setPurposeEvents,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [mintCount, setMintCount] = useState(1);
  const [tokenID, settokenID] = useState(1);

  const [value, setValue] = useState("");
  const [tokenURI, setTokenURI] = useState({});
  const text = "string memory output = string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3]));";

  const parseText = text => {
    const words = [];
    let lastIndex = 0;
    for (let i = 0; i < text.length; i++) {
      if (
        text[i] === " " ||
        text[i] === "(" ||
        text[i] === ")" ||
        text[i] === "[" ||
        text[i] === "]" ||
        text[i] === "{" ||
        text[i] === "}" ||
        text[i] === '"' ||
        text[i] === "+" ||
        text[i] === "-" ||
        text[i] === "*" ||
        text[i] === "/" ||
        text[i] === ">" ||
        text[i] === "<" ||
        text[i] === "=" ||
        text[i] === "&" ||
        text[i] === "|" ||
        (text[i] === "." && text[i + 1] !== "0" && text[i + 1] !== "8") ||
        text[i] === ";" ||
        text[i] === ","
      ) {
        words[words.length] = "";
        for (let j = lastIndex; j < i; j++) {
          words[words.length - 1] += text[j];
        }
        words[words.length] = text[i];
        lastIndex = i + 1;
      }
    }
    return words;
  };

  const colour = word => {
    switch (word) {
      case "solidity":
      case "encodePacked":
      case "encode":
      case "ownerOf":
      case "toString":
      case "supportsInterface":
      case "balanceOf":
      case "name":
      case "symbol":
      case "_exists":
      case "_baseURI":
      case "approve":
      case "_msgSender":
      case "_approve":
      case "Approve":
      case "getApproved":
      case "isApprovedForAll":
      case "setApprovalForAll":
      case "ApprovalForAll":
      case "Approval":
      case "transferFrom":
      case "_isApprovedOrOwner":
      case "safeTransferFrom":
      case "safeTransferFrom":
      case "_safeTransfer":
      case "_transfer":
      case "_checkOnERC721Received":
      case "IERC721Receiver":
      case "onERC721Received":
      case "_safeMint":
      case "_mint":
      case "_beforeTokenTransfer":
      case "Transfer":
      case "_burn":
      case "_transfer":
      case "isContract":
      case "add":
      case "mload":
      case "tokenURI":
      case "extcodesize":
      case "sendValue":
      case "functionCall":
      case "functionCallWithValue":
      case "call":
      case "_verifyCallResult":
      case "functionStaticCall":
      case "staticcall":
      case "functionDelegateCall":
      case "delegatecall":
      case "_msgData":
      case "toHexString":
        return <tspan class="blue">{word}</tspan>;
      case "function":
      case "interface":
      case '"':
        return <tspan class="green">{word}</tspan>;
      case "view":
      case "public":
      case "private":
      case "pure":
      case "override":
      case "memory":
      case "abstract":
      case "virtual":
      case "external":
      case "internal":
      case "event":
      case "indexed":
      case "external":
      case "calldata":
      case "library":
      case "let":
      case "contract":
      case "constant":
      case "constructor":
        return (
          <tspan class="purple" font-style="italic">
            {word}
          </tspan>
        );
      case "Strings":
      case "Context":
      case "IERC165":
      case "IERC721":
      case "ERC165":
      case "ERC721":
      case "bytes":
      case "bytes1":
      case "bytes4":
      case "bytes16":
      case "uint":
      case "uint8":
      case "uint256":
      case "bool":
      case "string":
      case "address":
      case "IERC721Metadata":
      case "Address":
      case "mapping":
        return <tspan class="purple">{word}</tspan>;
      case "is":
        return (
          <tspan class="yellow" font-style="italic">
            {word}
          </tspan>
        );
      case "returns":
      case "return":
      case "pragma":
      case "assembly":
      case "require":
      case "if":
      case "else":
      case "revert":
      case "while":
      case "new":
      case "for":
      case "using":
        return <tspan class="yellow">{word}</tspan>;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "10":
      case "32":
      case "48":
      case "^0.8.0":
      case "this":
      case "0xf":
        return <tspan class="orange">{word}</tspan>;
      case "abi":
      case "tokenId":
      case "interfaceId":
      case "from":
      case "to":
      case "owner":
      case "approved":
      case "operator":
      case "balance":
      case "_approved":
      case "data":
      case "account":
      case "payable":
      case "recipient":
      case "amount":
      case "success":
      case "target":
      case "errorMessage":
      case "value":
      case "returndata":
      case "msg":
      case "sender":
      case "temp":
      case "digits":
      case "length":
      case "i":
      case "type":
      case "super":
        return <tspan class="red">{word}</tspan>;
      case "[":
      case "]":
      case "{":
      case "}":
      case "(":
      case ")":
      case ".":
      case ";":
      case "/":
      case "/":
      case "SPDX-License-Identifier:":
      case "MIT":
      case "Nice":
      case "+":
      case "-":
      case "*":
      case "=":
      case ">":
      case "<":
      case "&":
      case "|":
      case "!":
        return <tspan class="grey">{word}</tspan>;
      default:
        return <tspan class="white">{word}</tspan>;
    }
  };

  const colourWords = words => {
    let colours = [];
    let lengths = [];
    for (let i = 0; i < words.length; i++) {
      colours[i] = colour(words[i]);
      lengths[i] = words[i].length;
    }
    console.log(
      "WORDS: ",
      colours.map(word => word.props?.children),
    );
    return [colours, lengths];
  };

  const chunkWords = wordsMap => {
    const chunks = [];
    const words = wordsMap[0];
    const lengths = wordsMap[1];
    const max_length = 35;
    let sum = 0;
    let chunk = 0;
    // console.log(
    //   "WORDS: ",
    //   words.map(word => word.props.children),
    // );
    for (let i = 0; i < lengths.length; i++) {
      if (sum + lengths[i] >= max_length) {
        // const remainder = lengths[i] % (max_length - sum);
        // const halfWord = "";
        // const tspan2Length = 7;
        // const tspan1Length = words[i].length - length[i] - tspan2Length;
        // for (let j = 0; j < remainder; i++) {
        //   halfWord += words[i + tspan1Length];
        // }
        // chunks[chunk].push(halfWord);
        sum = 0;
        console.log(
          "CHUNKS: ",
          chunks[chunk].map(word => word.props?.children),
        );
        chunk += 1;
        if (words[i].props.children != " ") {
          chunks[chunk] = [words[i]];
        }
      } else {
        if (chunks[chunk]) {
          chunks[chunk].push(words[i]);
        } else if (words[i].props.children != " ") {
          chunks[chunk] = [words[i]];
        }
      }
      sum += lengths[i];
    }
    return chunks;
  };

  let words = parseText(value + " ");
  let wordsMap = colourWords(words);
  let chunks = chunkWords(wordsMap);

  const onChange = event => setValue(event.target.value);

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <Input type="text" onChange={onChange} value={value} />
        <img source={tokenURI.image} />

        <Card style={{ marginTop: 32 }}>
          <h2>Mint</h2>
          <Divider />
          <div style={{ margin: 8 }}>
            <Input
              type="number"
              onChange={e => {
                setMintCount(e.target.value);
              }}
            />
            <Button
              style={{ marginTop: 8 }}
              onClick={async () => {
                /* look how you call setPurpose on your contract: */
                /* notice how you pass a call back for tx updates too */
                const result = tx(writeContracts.YourContract.mint(mintCount), update => {
                  console.log("📡 Transaction Update:", update);
                  if (update && (update.status === "confirmed" || update.status === 1)) {
                    console.log(" 🍾 Transaction " + update.hash + " finished!");
                    console.log(
                      " ⛽️ " +
                        update.gasUsed +
                        "/" +
                        (update.gasLimit || update.gas) +
                        " @ " +
                        parseFloat(update.gasPrice) / 1000000000 +
                        " gwei",
                    );
                  }
                });
                console.log("awaiting metamask/web3 confirm result...", result);
                console.log(await result);
              }}
            >
              Claim {mintCount} Non-Fungible NFT Token{mintCount > 1 ? "s" : ""}
            </Button>
          </div>
          <Divider />
        </Card>

        <Card style={{ marginTop: 32 }}>
          <h2>TokenURI</h2>
          <Divider />
          <div style={{ margin: 8 }}>
            <Input
              type="number"
              onChange={e => {
                settokenID(e.target.value);
              }}
            />
            <Button
              style={{ marginTop: 8 }}
              onClick={async () => {
                let rawTokenURI = await readContracts.YourContract.tokenURI(tokenID);

                if (rawTokenURI) {
                  const STARTS_WITH = "data:application/json;base64,";
                  const buf = Buffer.from(rawTokenURI.slice(STARTS_WITH.length), "base64");
                  const b64 = rawTokenURI.slice(STARTS_WITH.length);
                  console.log("GO");
                  console.log(b64);
                  console.log(buf.toString("base64"));
                  console.log(window.atob(buf.toString("base64")).replace(/\s/g, ""));
                  let tokenURIJSON = JSON.parse(window.atob(buf.toString("base64")).replace(/\s/g, ""));
                  setTokenURI(tokenURIJSON);
                  console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB", tokenURIJSON);
                }
                // console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
                // const result = readContracts.YourContract.tokenURI(tokenID);
                // // setResult(Json.parse(result));
                // // console.log("!!!!!!sdfsdf!!!!!!!!!!!!!!!!!!!!!!!!:", Json.parse(result));
                // // });
                // result.then(update => {
                //   console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!:", update);
                //   console.log("!-!-!-!-!-!-!-!-!-!-!-!!-!-!-!-!-!-!-!-!!-!-!-!-!-!-!-!-!:", JSON.parse(result));
                //   setResult(JSON.parse(result));
                // });
              }}
            >
              TokenURI
            </Button>
          </div>
          <Divider />
        </Card>
      </div>
      <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
        {/* <h2>Events:</h2>
        <List
          bordered
          dataSource={setPurposeEvents}
          renderItem={item => {
            return (
              <List.Item key={item.blockNumber + "_" + item.sender + "_" + item.purpose}>
                <Address address={item[0]} ensProvider={mainnetProvider} fontSize={16} />
                {item[1]}
              </List.Item>
            );
          }}
        />
      </div> */}

        <Card style={{ marginTop: 32 }}>
          <div>
            There are tons of generic components included from{" "}
            <a href="https://ant.design/components/overview/" target="_blank" rel="noopener noreferrer">
              🐜 ant.design
            </a>{" "}
            too!
          </div>

          <div style={{ marginTop: 8 }}>
            <Button type="primary">Buttons</Button>
          </div>

          <div style={{ marginTop: 8 }}>
            <SyncOutlined spin /> Icons
          </div>

          <div style={{ marginTop: 8 }}>
            Date Pickers?
            <div style={{ marginTop: 2 }}>
              <DatePicker onChange={() => {}} />
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <Slider range defaultValue={[20, 50]} onChange={() => {}} />
          </div>

          <div style={{ marginTop: 32 }}>
            <Switch defaultChecked onChange={() => {}} />
          </div>

          <div style={{ marginTop: 32 }}>
            <Progress percent={50} status="active" />
          </div>

          <div style={{ marginTop: 32 }}>
            <Spin />
          </div>
        </Card>
      </div>
    </div>
  );
}
