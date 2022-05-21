import { NumberInput, NumberInputField } from '@chakra-ui/react';

interface TokenAmountInputProps {
  amount?: string;
  disabled?: boolean;
  onUpdate(amount: string): void;
}

export function TokenAmountInput({ disabled = false, onUpdate, amount }: TokenAmountInputProps) {
  return (
    <NumberInput onChange={onUpdate} isDisabled={disabled} ml="20px" w="300px">
      <NumberInputField
        value={amount}
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
