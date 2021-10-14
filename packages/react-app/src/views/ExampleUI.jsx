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

  const [value, setValue] = useState("function tokenURI(uint256 tokenId) external view returns (string memory);");
  const [tokenURI, setTokenURI] = useState({});

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
    return [colours, lengths];
  };

  const chunkWords = wordsMap => {
    const chunks = [[], []];
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
        chunk += 1;
        if (words[i].props.children != " ") {
          chunks[0][chunk] = [words[i]];
          chunks[1][chunk] = lengths[i];
        }
      } else {
        if (chunks[0][chunk]) {
          chunks[0][chunk].push(words[i]);
          chunks[1][chunk] += lengths[i];
        } else if (words[i].props.children != " ") {
          chunks[0][chunk] = [words[i]];
          chunks[1][chunk] = lengths[i];
        }
      }
      sum += lengths[i];
    }
    console.log(chunks);
    return chunks;
  };

  let words = parseText(value + " ");
  let wordsMap = colourWords(words);
  let chunks = chunkWords(wordsMap);

  const onChange = event => setValue(event.target.value);

  const animationSteps = i => {
    let output = ["", ""];
    for (let j = 0; j < chunks[1][i]; j++) {
      output[0] = `${output[0]}${40 + 8.4 * j};${40 + 8.4 * j};`;
      output[1] =
        j == chunks[1][i] - 1
          ? `${output[1]}${(1 / chunks[1][i]) * j};1;`
          : `${output[1]}${(1 / chunks[1][i]) * j};${(1 / chunks[1][i]) * (j + 1) - 1 / (chunks[1][i] * 10)};`;
    }
    return output;
  };

  const beginTime = i => {
    let sum = 0;
    for (let j = 0; j < i; j++) {
      sum += chunks[1][j];
    }
    return sum;
  };

  const duration = "0.1";

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <Input type="text" onChange={onChange} value={value} />
        <img src={tokenURI.image} />

        <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">
          <style>{`.base {fill: #9DA3A3; font-family: monospace; font-size: 14px;} .blue {fill: #00B7A5;} .orange {fill: #D85D00;} .green {fill: #009568;} .yellow {fill: #E39300;} .red {fill: #CB003F;} .white {fill: #9DA3A3;} .grey {fill: #3C3F42;} .purple {fill: #A431F8;} .muted {fill: #282B30;} .bright {fill: #0087A3;} .italic {font-style: italic;}`}</style>
          <rect width="100%" height="100%" fill="#0E1013" />
          <line x1="35" y1="15" x2="35" y2="335" stroke="#282B30" />
          <text x="10" y="20" class="base">
            <tspan x="5" y="10" dy="22" class="muted">
              512
            </tspan>
            <tspan x="30" y="10">
              <tspan x="35" dx="10" dy="22">
                <tspan class="yellow">require</tspan>
                <tspan class="grey">(</tspan>
                <tspan class="red">payable</tspan>
                <tspan class="grey">(</tspan>
                <tspan class="red">msg</tspan>
                <tspan class="grey">.</tspan>
                <tspan class="red">sender</tspan>
                <tspan class="grey">)</tspan>
                <tspan class="white"></tspan>
                <tspan class="grey">.</tspan>
                <tspan class="white">send</tspan>
                <tspan class="grey">(</tspan>
              </tspan>
              <tspan x="35" dx="10" dy="22">
                <tspan class="purple">address</tspan>
                <tspan class="grey">(</tspan>
                <tspan class="orange">this</tspan>
                <tspan class="grey">)</tspan>
                <tspan class="white"></tspan>
                <tspan class="grey">.</tspan>
                <tspan class="red">balance</tspan>
                <tspan class="grey">)</tspan>
                <tspan class="white"></tspan>
                <tspan class="grey">)</tspan>
                <tspan class="white"></tspan>
                <tspan class="grey">;</tspan>
              </tspan>
              <tspan x="35" dx="10" dy="22"></tspan>
              <tspan x="35" dx="10" dy="22"></tspan>
              <tspan x="35" dx="10" dy="22"></tspan>
              <tspan x="35" dx="10" dy="22"></tspan>
              <tspan x="35" dx="10" dy="22"></tspan>
              <tspan x="35" dx="10" dy="22"></tspan>
              <tspan x="35" dx="10" dy="22"></tspan>
              <tspan x="35" dx="10" dy="22"></tspan>
            </tspan>
          </text>
          <rect x="40" y="20" width="300" height="15" fill="#0E1013">
            {/* <animate
              attributeName="x"
              values="0;8.4;8.4"
              keyTimes="0; 0.9; 1"
              dur="0.1s"
              repeatCount="35"
              additive="sum"
              accumulate="sum"
              fill="freeze"
              begin="0s"
            /> */}
            <animate
              attributeName="x"
              values="0;8.4;8.4"
              keyTimes="0; 0.9; 1"
              dur="0.1s"
              repeatCount="35"
              additive="sum"
              accumulate="sum"
              fill="freeze"
              begin="0s"
            />
          </rect>
          <rect x="40" y="42" width="300" height="15" fill="#0E1013">
            <animation
              attributeName="x"
              values="0;8.4;8.4;"
              keyTimes="0;0.9;1;"
              dur="0.1s"
              repeatCount="35"
              additive="sum"
              accumulate="sum"
              fill="freeze"
              begin="3.3000s"
            />
          </rect>

          <rect x="-20" y="20" width="10" height="15" fill="#E39300">
            <animate
              attributeName="x"
              values="40.0000;40.0000;48.4000;48.4000;56.8000;56.8000;65.2000;65.2000;73.6000;73.6000;82.0000;82.0000;90.4000;90.4000;98.8000;98.8000;107.2000;107.2000;115.6000;115.6000;124.0000;124.0000;132.4000;132.4000;140.8000;140.8000;149.2000;149.2000;157.6000;157.6000;166.0000;166.0000;174.4000;174.4000;182.8000;182.8000;191.2000;191.2000;199.6000;199.6000;208.0000;208.0000;216.4000;216.4000;224.8000;224.8000;233.2000;233.2000;241.6000;241.6000;250.0000;250.0000;258.4000;258.4000;266.8000;266.8000;275.2000;275.2000;283.6000;283.6000;292.0000;292.0000;300.4000;300.4000;308.8000;308.8000;"
              keyTimes="0.0000;0.0272;0.0303;0.0575;0.0606;0.0878;0.0909;0.1181;0.1212;0.1484;0.1515;0.1787;0.1818;0.2090;0.2121;0.2393;0.2424;0.2696;0.2727;0.3000;0.3030;0.3303;0.3333;0.3606;0.3636;0.3909;0.3939;0.4212;0.4242;0.4515;0.4545;0.4818;0.4848;0.5121;0.5151;0.5424;0.5454;0.5727;0.5757;0.6030;0.6060;0.6333;0.6363;0.6636;0.6666;0.6939;0.6969;0.7242;0.7272;0.7545;0.7575;0.7848;0.7878;0.8151;0.8181;0.8454;0.8484;0.8757;0.8787;0.9060;0.9090;0.9363;0.9393;0.9666;0.9696;1;"
              dur="3"
              begin="0.0000s"
            />
          </rect>
          <rect x="-20" y="42" width="10" height="15" fill="#E39300">
            <animate
              attributeName="x"
              values="40.0000;40.0000;48.4000;48.4000;56.8000;56.8000;65.2000;65.2000;73.6000;73.6000;82.0000;82.0000;90.4000;90.4000;98.8000;98.8000;107.2000;107.2000;115.6000;115.6000;124.0000;124.0000;132.4000;132.4000;140.8000;140.8000;149.2000;149.2000;157.6000;157.6000;166.0000;166.0000;174.4000;174.4000;182.8000;182.8000;191.2000;191.2000;199.6000;199.6000;208.0000;208.0000;216.4000;216.4000;224.8000;224.8000;233.2000;233.2000;"
              keyTimes="0.0000;0.0375;0.0416;0.0791;0.0833;0.1208;0.1250;0.1625;0.1666;0.2041;0.2083;0.2458;0.2500;0.2875;0.2916;0.3291;0.3333;0.3708;0.3750;0.4125;0.4166;0.4541;0.4583;0.4958;0.5000;0.5375;0.5416;0.5791;0.5833;0.6208;0.6250;0.6625;0.6666;0.7041;0.7083;0.7458;0.7500;0.7875;0.7916;0.8291;0.8333;0.8708;0.8750;0.9125;0.9166;0.9541;0.9583;1;"
              dur="2"
              begin="3.3000s"
            />
          </rect>
          <rect x="-20" y="218" width="10" height="15" fill="#E39300">
            <animate attributeName="x" values="" keyTimes="" dur="0" fill="freeze" begin="5.7000s" />
            <animate
              attributeName="fill"
              values="#E39300;#E39300;#0E1013;#0E1013"
              keyTimes="0;0.5; 0.501; 1"
              dur="1s"
              begin="5.7000s"
              repeatCount="indefinite"
            />
          </rect>
        </svg>

        {/* <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">
          <style>
            {`.base {
              fill: white;
              font-family: monospace;
              font-size: 14px;
              overflow-wrap: break-word;
              }
              .blue {fill: #00B7A5;}
              .orange {fill: #D85D00;}
              .green {fill: #009568;}
              .yellow {fill: #E39300;}
              .red {fill: #CB003F;}
              .white {fill: #9DA3A3;}
              .grey {fill: #3C3F42;}
              .purple {fill: #A431F8;}
              .muted {fill: #282B30;}
              .bright {fill: #0087A3;}
              .italic {font-style: italic;}
              `}
          </style>
          <rect width="100%" height="100%" fill="#0E1013" />
          <line x1="35" y1="15" x2="35" y2="335" style={{ stroke: "#282B30", strokeWidth: 1 }} />
          <text x="10" y="20" class="base">
            <tspan x="5" y="10" dy="22" class="muted">
              382
            </tspan>
            <tspan x="30" y="10">
              {chunks[0].map(chunk => (
                <tspan x="30" dx="10" dy="22">
                  {chunk}
                </tspan>
              ))}
            </tspan>
          </text>
          {chunks[0].map((chunk, i) => (
            <rect x="40" y={20 + 22 * i} width="300" height="15" fill="#0E1013">
              <animate
                attributeName="x"
                values="0;8.4;8.4"
                keyTimes="0; 0.9; 1"
                dur="0.1s"
                repeatCount="35"
                additive="sum"
                accumulate="sum"
                fill="freeze"
                begin={`${0.1 * beginTime(i)}s`}
              />
            </rect>
          ))}
          {chunks[0].map((chunk, i) => {
            if (i == chunks[0].length - 1) {
              return (
                <rect x="-20" y={20 + 22 * i} width="10" height="15" fill="#E39300">
                  <animate
                    attributeName="x"
                    values={animationSteps(i)[0]}
                    keyTimes={animationSteps(i)[1]}
                    dur={`${0.1 * chunks[1][i]}s`}
                    fill="freeze"
                    begin={`${0.1 * beginTime(i)}s`}
                  />
                  <animate
                    attributeName="fill"
                    values="#E39300;#E39300;#0E1013;#0E1013"
                    keyTimes="0;0.5; 0.501; 1"
                    dur="1s"
                    begin={`${0.1 * beginTime(i + 1)}s`}
                    repeatCount="indefinite"
                  />
                </rect>
              );
            } else {
              return (
                <rect x="-20" y={20 + 22 * i} width="10" height="15" fill="#E39300">
                  <animate
                    attributeName="x"
                    values={animationSteps(i)[0]}
                    keyTimes={animationSteps(i)[1]}
                    dur={`${0.1 * chunks[1][i]}s`}
                    begin={`${0.1 * beginTime(i)}s`}
                  />
                </rect>
              );
            }
          })}
        </svg> */}

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
                  let tokenURIJSON = JSON.parse(window.atob(buf.toString("base64")).replace(/\s/g, ""));
                  setTokenURI(tokenURIJSON);
                }
              }}
            >
              TokenURI
            </Button>
          </div>
          <Divider />
        </Card>

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
