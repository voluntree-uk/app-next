import { Container } from "@chakra-ui/react";
import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
}

export default function ResponsiveContainer({ children }: IProps) {
  return (
    <Container py={{ base: "20", sm: "24" }} maxWidth={"7xl"} margin="0 auto">
      {children}
    </Container>
  );
}
