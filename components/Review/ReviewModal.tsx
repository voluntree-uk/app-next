import React from "react";
import {
  Button,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  Textarea
} from "@chakra-ui/react";
import { BookingDetails } from "@schemas";
import { useRouter } from "next/router";

interface IProps {
  booking: BookingDetails
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (booking: BookingDetails, rating: number, comment: string) => void;
}

export function ReviewModal({ booking, isOpen, onSubmit, onClose }: IProps) {
  const router = useRouter();

  const onCloseWithRemoveParameter = (): void => {
    delete router.query["review"];
    router.replace(
      {
        pathname: router.pathname,
        query: router.query,
      },
      undefined,
      /**
       * Do not refresh the page
       */
      { shallow: true }
    );
    onClose();
  };

  var rating = 5;
  var comment = "";

  const labelStyles = {
    mt: "4",
    fontSize: "m",
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onCloseWithRemoveParameter()}>
      <ModalOverlay />
      <ModalContent backgroundColor={"lightgray"}>
        <ModalHeader>{booking.workshops.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing="3">
            <Text>How would you rate this workshop:</Text>
            <Slider
              defaultValue={rating}
              min={1}
              max={5}
              step={1}
              onChangeEnd={(val) => (rating = val)}
              marginBottom={12}
              width={"90%"}
            >
              <SliderMark value={1} {...labelStyles}>
                1
              </SliderMark>
              <SliderMark value={2} {...labelStyles}>
                2
              </SliderMark>
              <SliderMark value={3} {...labelStyles}>
                3
              </SliderMark>
              <SliderMark value={4} {...labelStyles}>
                4
              </SliderMark>
              <SliderMark value={5} {...labelStyles}>
                5
              </SliderMark>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={6} />
            </Slider>
            <Text>Additional information (optional):</Text>
            <Textarea
              backgroundColor={"white"}
              onChange={(e) => (comment = e.target.value)}
              placeholder="Provide as little or as much details as you like"
            />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => onSubmit(booking, rating, comment)}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
