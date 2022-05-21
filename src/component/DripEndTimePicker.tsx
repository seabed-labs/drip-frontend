import { Box } from '@chakra-ui/react';
import DateTimePicker from 'react-datetime-picker';
import styled from 'styled-components';
import sx from 'classnames';

interface DripEndTimePickerProps {
  disabled?: boolean;
  enableTimeSelect: boolean;
  value?: Date;
  onUpdate(newValue: Date): void;
}

const StyledContainer = styled(Box)`
  .date-time-picker {
    border-radius: 50px;
    padding: 12px;
    background-color: rgba(255, 255, 255, 0.06);
    width: 440px;

    .react-datetime-picker__wrapper {
      border: none;
    }

    .react-datetime-picker__clear-button__icon {
      stroke: rgba(255, 255, 255, 0.5);
    }

    .react-datetime-picker__calendar-button__icon {
      stroke: rgba(255, 255, 255, 0.5);
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
  onUpdate,
  enableTimeSelect
}: DripEndTimePickerProps) {
  return (
    <StyledContainer hideTime={!enableTimeSelect}>
      <DateTimePicker
        disabled={disabled}
        className={sx({
          'date-time-picker': true,
          disabled: disabled
        })}
        minDate={new Date()}
        disableClock
        onChange={(date) => {
          const now = new Date().getTime();
          if (date.getTime() < now) {
            onUpdate(new Date(now + 10 * 60 * 1000));
            return;
          }

          onUpdate(date);
        }}
        value={value}
      />
    </StyledContainer>
  );
}
