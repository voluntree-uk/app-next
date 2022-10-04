import { InputGroup, Input, InputRightElement, Button } from "@chakra-ui/react";
import { BiTrash } from "react-icons/bi";
import { dateToReadable, timeToReadable } from "../../utils/dates";

interface IProps {
  slot: any;
  onRemoveSlot(id: string): void;
}

export default function WorkshopFormSlot({ slot, onRemoveSlot }: IProps) {
  return (
    <InputGroup>
      <Input
        disabled
        value={`${dateToReadable(slot.date)} (${timeToReadable(
          slot.startTime,
          slot.endTime
        )}) | ${slot.capacity} capacity`}
        _disabled={{ color: "black" }}
      />
      <InputRightElement width="4.5rem">
        <Button
          h="1.75rem"
          colorScheme="red"
          onClick={() => onRemoveSlot(slot.id)}
        >
          <BiTrash />
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}
