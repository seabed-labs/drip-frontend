import { GrMail } from 'react-icons/gr';
import { FaTelegramPlane, FaMobileAlt } from 'react-icons/fa';

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
  PopoverCloseButton,
  Box,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react';
import { FC } from 'react';
import { BsFillBellFill } from 'react-icons/bs';

export const NotificationsBell: FC = () => {
  return (
    <Popover closeOnEsc={true} autoFocus={true} size="3xl">
      <PopoverTrigger>
        <IconButton
          variant="ghost"
          colorScheme="blue"
          aria-label="Notification Bell Button"
          fontSize="32.5px"
          mr={10}
          icon={<BsFillBellFill />}
        />
      </PopoverTrigger>
      <PopoverContent
        bgColor="#101010"
        boxShadow="0 0 128px 1px rgba(98, 170, 255, 0.07)"
        h="350"
        p="5"
        alignItems="center"
        borderRadius="10%"
        border="none"
        mt="5"
      >
        <FormControl>
          <FormLabel>NOTIFICATIONS</FormLabel>
          <InputGroup mt="5">
            <InputLeftElement pointerEvents="none" children={<GrMail color="grey" />} />
            <Input
              variant="none"
              placeholder={`Email Address`}
              borderRadius="3xl"
              bgColor="#181818"
            />
          </InputGroup>
          <InputGroup mt="5">
            <InputLeftElement pointerEvents="none" children={<FaMobileAlt color="grey" />} />
            <Input variant="none" placeholder={`Mobile`} borderRadius="3xl" bgColor="#181818" />
          </InputGroup>
          <InputGroup mt="5">
            <InputLeftElement pointerEvents="none" children={<FaTelegramPlane color="grey" />} />
            <Input variant="none" placeholder={`Telegram`} borderRadius="3xl" bgColor="#181818" />
          </InputGroup>
          <Input
            variant="none"
            mt={7}
            as={Button}
            borderRadius="3xl"
            bgColor="#374E6D"
            _hover={{ bg: '#71AAF8' }}
          >
            Register
          </Input>
        </FormControl>

        <PopoverCloseButton mt="4" />
      </PopoverContent>
    </Popover>
  );
};
