import { Box } from '@chakra-ui/react';
import DateTimePicker from 'react-datetime-picker';
import styled from 'styled-components';
import sx from 'classnames';
import { Device } from '../utils/ui/css';

interface DripEndTimePickerProps {
  disabled?: boolean;
  granularity?: number;
  value?: Date;
  onUpdate(newValue?: Date): void;
}

const StyledContainer = styled(Box)`
  .date-time-picker {
    border-radius: 50px;
    padding: 10px 12px;
    background-color: rgba(255, 255, 255, 0.06);
    width: 260px;
    height: 40px;

    @media ${Device.Tablet} {
      width: 380px;
      height: 50px;
    }

    .react-datetime-picker__inputGroup {
      font-size: 10px;
      @media ${Device.Tablet} {
        font-size: 18px;
      }
    }

    .react-datetime-picker__wrapper {
      border: none;
    }

    .react-datetime-picker__clear-button__icon {
      stroke: rgba(255, 255, 255, 0.5);
      height: 12px;
      @media ${Device.Tablet} {
        height: unset;
      }
    }

    .react-datetime-picker__calendar-button__icon {
      stroke: rgba(255, 255, 255, 0.5);
      height: 12px;
      @media ${Device.Tablet} {
        height: unset;
      }
    }

    .react-calendar__month-view__days__day--weekend {
      color: white;
    }

    .react-calendar__month-view__days__day--neighboringMonth {
      color: rgba(255, 255, 255, 0.6);
    }

    .react-datetime-picker__inputGroup__hour,
    .react-datetime-picker__inputGroup__minute,
    .react-datetime-picker__inputGroup__divider:nth-child(9),
    .react-datetime-picker__inputGroup__amPm {
      ${({ hideTime }: { hideTime: boolean }) => (hideTime ? `visibility: hidden;` : ``)}
    }
  }

  .disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .react-calendar {
    background-color: #101010;
    border: none;
    border-radius: 30px;
    width: 280px;

    @media ${Device.Tablet} {
      width: unset;
    }

    button {
      background-color: #101010 !important;
      &:hover {
        background-color: #1f1f1f !important;
      }
      &:disabled,
      &[disabled] {
        opacity: 0.2;
      }
    }
  }
`;

export function DripEndTimePicker({
  disabled = false,
  value,
  granularity,
  onUpdate
}: DripEndTimePickerProps) {
  granularity = granularity ?? 0;
  return (
    <StyledContainer hideTime={granularity >= 86400}>
      <DateTimePicker
        maxDetail={granularity >= 3600 ? 'hour' : granularity >= 60 ? 'minute' : undefined}
        disabled={disabled}
        className={sx({
          'date-time-picker': true,
          disabled: disabled
        })}
        minDate={new Date()}
        disableClock
        onChange={(date) => {
          if (!date) {
            onUpdate(undefined);
            return;
          }
          onUpdate(date);
        }}
        value={value}
      />
    </StyledContainer>
  );
}
