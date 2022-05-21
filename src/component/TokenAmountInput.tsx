import { Input, NumberInput, NumberInputField } from '@chakra-ui/react';

interface TokenAmountInputProps {
  disabled?: boolean;
}

export function TokenAmountInput({ disabled = false }: TokenAmountInputProps) {
  return (
    <NumberInput isDisabled={disabled} ml="20px" w="300px">
      <NumberInputField
        fontWeight="medium"
        type="number"
        bgColor="whiteAlpha.100"
        placeholder="Enter Amount"
        border="none"
        h="50px"
        borderRadius="50px"
      />
    </NumberInput>
  );
}
