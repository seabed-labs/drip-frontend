import { NumberInput, NumberInputField } from '@chakra-ui/react';
import { Device } from '../utils/ui/css';

interface TokenAmountInputProps {
  amount?: string;
  disabled?: boolean;
  onUpdate(amount: string): void;
}

export function TokenAmountInput({ disabled = false, onUpdate, amount }: TokenAmountInputProps) {
  return (
    <NumberInput
      value={amount}
      onChange={onUpdate}
      isDisabled={disabled}
      ml="20px"
      w="150px"
      css={{
        [`@media ${Device.MobileL}`]: {
          width: '200px'
        },
        [`@media ${Device.Tablet}`]: {
          width: '240px'
        }
      }}
    >
      <NumberInputField
        fontWeight="medium"
        fontSize="14px"
        type="number"
        bgColor="whiteAlpha.100"
        placeholder="Enter Amount"
        border="none"
        h="40px"
        p="16px"
        borderRadius="50px"
        css={{
          [`@media ${Device.MobileL}`]: {
            fontSize: '16px'
          },
          [`@media ${Device.Tablet}`]: {
            fontSize: '20px',
            height: '50px'
          }
        }}
      />
    </NumberInput>
  );
}
