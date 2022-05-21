import { Button, ButtonProps } from '@chakra-ui/react';

interface DepositButtonProps {
  text?: string;
  disabled?: boolean;
}

export function DepositButton({
  disabled,
  text,
  ...buttonProps
}: DepositButtonProps & ButtonProps) {
  return (
    <Button
      variant="unstyled"
      bgColor="#62aaff"
      _hover={{
        bgColor: '#60a0ff',
        transition: '0.2s ease'
      }}
      color="white"
      h="50px"
      borderRadius="50px"
      w="100%"
      disabled={disabled}
      transition="0.2s ease"
      {...buttonProps}
    >
      {text ?? 'Deposit'}
    </Button>
  );
}
