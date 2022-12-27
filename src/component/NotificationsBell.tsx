import {
  Popover,
  PopoverTrigger,
  IconButton,
  PopoverContent,
  PopoverArrow,
  FormControl,
  FormLabel,
  Input,
  Button,
  PopoverCloseButton
} from '@chakra-ui/react';
import { FC } from 'react';
import { BsFillBellFill } from 'react-icons/bs';

export const NotificationsBell: FC = () => {
  return (
    <Popover autoFocus={true} closeOnEsc={true}>
      <PopoverTrigger>
        <IconButton
          variant="ghost"
          colorScheme="blue"
          aria-label="Call Sage"
          fontSize="32.5px"
          mr={10}
          icon={<BsFillBellFill />}
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />

        <FormControl>
          <FormLabel display={'flex'} justifyContent="center">
            NOTIFICATIONS
          </FormLabel>
          <FormLabel>Email address</FormLabel>
          <Input type="email" />
          <Input mt={3} mb={3} as={Button}>
            Subscribe
          </Input>
        </FormControl>
        <PopoverCloseButton />
      </PopoverContent>
    </Popover>
  );
};
