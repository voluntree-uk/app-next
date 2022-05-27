import { FormControl, Input, FormErrorMessage } from "@chakra-ui/react";
import React from "react";
import { FieldError, UseFormGetValues, UseFormRegister } from "react-hook-form";

type FormInputProps = {
  field: string;
  placeholder: string;
  type: string;
  isVisible: boolean;
  error: FieldError | undefined;
  register: UseFormRegister<any>;
  disabled?: boolean;
};

/**
 * Renders an input for the authentication form
 */
export default function FormInput(props: FormInputProps): JSX.Element {
  const { error, register, placeholder, field, type, disabled } = props;

  return (
    <>
      {props.isVisible ? (
        <FormControl isInvalid={!!error}>
          <Input
            id={field}
            placeholder={placeholder}
            type={type}
            bg={"white"}
            focusBorderColor="'transparent"
            boxShadow={"sm"}
            borderRadius="xl"
            size="lg"
            p={7}
            disabled={disabled}
            {...register(field)}
          />
          <FormErrorMessage>{error && error.message}</FormErrorMessage>
        </FormControl>
      ) : null}
    </>
  );
}
