import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="" target="_blank" rel="noopener noreferrer">
      <PageHeader title="It's Code in Here" subTitle="Own the source code" style={{ cursor: "pointer" }} />
    </a>
  );
}
