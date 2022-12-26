import { Textarea } from '@chakra-ui/react';
import {
  Button,
  Image,
  IconButton,
  Box,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter
} from '@chakra-ui/react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FC, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../assets/logo.svg';
import Drip from '../assets/drip.svg';
import { Device } from '../utils/ui/css';
import { FormControl, FormLabel, FormErrorMessage, FormHelperText, Input } from '@chakra-ui/react';

import { BsFillBellFill } from 'react-icons/bs';
import React from 'react';
import { red } from 'bn.js';

const StyledContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StyledLeftContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  visibility: hidden;
  width: 0;

  @media ${Device.Tablet} {
    visibility: visible;
    width: 100%;
  }
`;

const StyledMiddleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 100px;

  @media ${Device.Tablet} {
    width: 100%;
  }
`;

const StyledRightContainer = styled.div`
  width: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  visibility: hidden;

  @media ${Device.Tablet} {
    visibility: visible;
    width: 100%;
  }
`;

const StyledLogo = styled(Image)`
  height: 0;

  @media ${Device.Tablet} {
    height: 80px;
  }
`;

const StyledDrip = styled(Image)`
  transform: translateY(-10px);
  height: 0;

  @media ${Device.Tablet} {
    height: 80px;
  }
`;

const StyledNavButton = styled(Button)<{ selected: boolean }>`
  width: 100px;
  background: transparent !important;
  color: ${(props) => (props.selected ? '#62aaff' : 'rgba(255, 255, 255, 0.6)')};
  text-decoration: ${(props) => (props.selected ? 'underline' : 'none')};
  font-size: 22px !important;

  @media ${Device.MobileL} {
    font-size: 26px !important;
  }

  &:hover {
    color: #62aaff;
    text-decoration: underline;
  }
`;

export const Header: FC = () => {
  const { pathname } = useLocation();
  const [showModal, setShowModal] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  return (
    <StyledContainer>
      <StyledLeftContainer>
        <StyledLogo src={Logo} />
        <StyledDrip src={Drip} />
      </StyledLeftContainer>
      <StyledMiddleContainer>
        <Link to="/deposit">
          <StyledNavButton selected={pathname === '/deposit'}>Deposit</StyledNavButton>
        </Link>
        <Link to="/positions">
          <StyledNavButton selected={pathname === '/positions'}>Positions</StyledNavButton>
        </Link>
      </StyledMiddleContainer>
      <StyledRightContainer>
        <Box>
          <IconButton
            variant="ghost"
            colorScheme="blue"
            aria-label="Call Sage"
            fontSize="32.5px"
            mr={10}
            icon={<BsFillBellFill />}
            onClick={() => setShowModal(true)}
          />
        </Box>
        {showModal && (
          <Box bg={'#101010'} border="2px" borderRadius="3xl" boxShadow="lg">
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
          </Box>
        )}

        <WalletMultiButton />
      </StyledRightContainer>
    </StyledContainer>
  );
};
