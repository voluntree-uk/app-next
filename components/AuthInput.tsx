import { FormControl, Input, FormErrorMessage } from "@chakra-ui/react";
import React from "react";
import { FieldError, UseFormGetValues, UseFormRegister } from "react-hook-form";

type AuthenticationInputProps = {
  field: string;
  placeholder: string;
  type: string;
  register: UseFormRegister<any>;
  isVisible: boolean;
  error: FieldError | undefined;
  getValues: UseFormGetValues<any>;
  shouldMatchField?: string;
};

/**
 * Renders an input for the authentication form
 */
export default function AuthenticationInput(
  props: AuthenticationInputProps
): JSX.Element {
  const {
    error,
    register,
    placeholder,
    field,
    type,
    getValues,
    shouldMatchField,
  } = props;

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
            {...register(field, {
              validate: shouldMatchField
                ? {
                    confirmMatch: (value) =>
                      value === getValues()[shouldMatchField] ||
                      `Must match ${shouldMatchField}`,
                  }
                : {},
              required: `Field is required`,
            })}
          />
          <FormErrorMessage>{error && error.message}</FormErrorMessage>
        </FormControl>
      ) : null}
    </>
  );
}
