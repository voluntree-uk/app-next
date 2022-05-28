import React, { ReactNode } from "react";
import HeadingBar from "./HeadingBar";
import Menu from "./Menu";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout(props: LayoutProps) {
  return <Menu>{props.children}</Menu>;
}
