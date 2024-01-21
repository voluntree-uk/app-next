import { ReactNode, PropsWithChildren } from "react";
interface IProps {
  showIf: boolean;
}

export default function Show({ showIf, children }: PropsWithChildren<IProps>) {
  return <>{showIf ? children : null}</>;
}
