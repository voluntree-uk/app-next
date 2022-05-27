import React, { ReactNode } from "react";
import Menu from "./Menu";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout(props: LayoutProps) {
  return (
    <div>
      <Menu>{props.children}</Menu>
    </div>
  );
}
