import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="Non Fungible NFT Token"
        subTitle="Own a piece of source, straight from the source."
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
