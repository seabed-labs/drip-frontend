import { NumberInput, NumberInputField } from '@chakra-ui/react';

interface TokenAmountInputProps {
  disabled?: boolean;
  onUpdate(amount: string): void;
}

export function TokenAmountInput({ disabled = false, onUpdate }: TokenAmountInputProps) {
  return (
    <NumberInput onChange={onUpdate} isDisabled={disabled} ml="20px" w="300px">
      <NumberInputField
        fontWeight="medium"
        fontSize="20px"
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
