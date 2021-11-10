import { SyncOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import { Address, Balance } from "../components";
import { set } from "store";

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
  const [tokenID, settokenID] = useState(1);
  const [mintCount, setMintCount] = useState(1);
  // const [walletAddress, setAddress] = useState("0x");

  const [tokensState, setTokensState] = useState([]);
  const [tokenIds, setTokenIds] = useState([]);

  async () => {
    // let tokenIds = await readContracts.ItsCodeInHere.walletOfOwner(address);
  };

  async function updateTokenState(tokenId) {
    let rawTokenURI = await readContracts.YourContract.tokenURI(parseInt(tokenId._hex));
    setTokensState(state => [...state, rawTokenURI]);
  }

  const Svg = i => {
    const STARTS_WITH = "data:application/json;base64,";
    if (tokensState.length > i) {
      const buf = Buffer.from(tokensState[i].slice(STARTS_WITH.length), "base64");
      let tokenURIJSON = JSON.parse(window.atob(buf.toString("base64")).replace(/\s/g, ""));
      return <img src={tokenURIJSON.image} />;
    }
    return <img src="public/logo512.png" />;
  };

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ padding: 16, marginTop: 64 }}>
        {/* <img src={tokenURI.image} /> */}

        {/* <Card style={{ marginTop: 32 }}>
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
        </Card> */}
        <div style={{ width: 400, margin: "auto" }}>
          <h2>
            {mintCount || 1} NFT{mintCount > 1 ? "s" : ""} = {mintCount || 1} line{mintCount > 1 ? "s" : ""} of code
          </h2>
          <Divider />
          <div style={{ margin: 8 }}>
            <Input
              type="number"
              onChange={e => {
                setMintCount(e.target.value);
              }}
            />
            {writeContracts.YourContract && (
              <Button
                style={{ marginTop: 8 }}
                onClick={async () => {
                  /* look how you call setPurpose on your contract: */
                  /* notice how you pass a call back for tx updates too */
                  const result = tx(writeContracts.ItsCodeInHere.mint(mintCount), update => {
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
                Mint
              </Button>
            )}
          </div>
        </div>
        <h2>Gallery</h2>
        <Divider />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly", gap: "50px", margin: "25px" }}>
          {[...tokenIds.keys()].map((tokenId, i) => {
            // {tokensState.map(tokensState[i] => {
            console.log(tokensState.length);
            // let tokensState[i] = await readContracts.YourContract.tokenURI(parseInt(wallet._hex));
            // Make a new tokens state {id, uri}[]. In the refresh tokens calls, loop through all the returned walletNFTs immediately and grab the uri with await. Grabbing them one at a time and updating tokensState, gradually updating the UI.
            // if (tokensState[i]) {
            // }
            return <div style={{ flex: "1 0 auto", minWidth: "250px", maxWidth: "350px" }}>{Svg(i)}</div>;
          })}
        </div>
        <Divider />
        <div style={{ margin: 8 }}>
          {readContracts.ItsCodeInHere && (
            <Button
              style={{ marginTop: 8 }}
              onClick={async () => {
                let tokenIds = await readContracts.ItsCodeInHere.walletOfOwner(address);
                if (tokenIds) {
                  console.log("tokenids: ", tokenIds);
                  setTokenIds(tokenIds);
                  tokenIds.forEach(tokenId => {
                    updateTokenState(tokenId);
                  });
                }
              }}
            >
              Refresh
            </Button>
          )}
        </div>
        {/* <Card style={{ marginTop: 32 }}>
          <Divider />
        </Card> */}
      </div>
    </div>
  );
}
