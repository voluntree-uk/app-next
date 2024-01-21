import React, { CSSProperties, ReactElement } from "react";
import { Button } from "@chakra-ui/react";

type ActionButtonProps = {
  text: string;
  loading: boolean;
  icon: ReactElement;
  type: "button" | "submit" | "reset" | undefined;
  style?: CSSProperties;
};

export default function ActionButton(props: ActionButtonProps) {
  return (
    <Button
      disabled={props.loading}
      color="white"
      size="md"
      type="submit"
      isLoading={props.loading}
      boxShadow={"2xl"}
      py={7}
      borderRadius="2xl"
      bg="brand.700"
      rightIcon={props.icon}
      _hover={{ backgroundColor: "#4A43EC" }}
      style={props.style}
    >
      <span>{props.text}</span>
    </Button>
  );
}
