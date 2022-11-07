import type { Dispatch, FC, SetStateAction } from "react";
import { ChangeEvent, useState, useRef } from "react";
import styled from "styled-components";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

import { mixinInputDefault, mixinInputValidation } from "../theme/mixins/input";
import { IconWrapper } from "./IconWrapper";
import { Feedback } from "./Feedback";
import { CountNumberType } from "../types/count";
import { minusDecimal, plusDecimal } from "../lib/calc/decimal";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Body = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
`;

const InputWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const StyledInput = styled.input<{ valid: boolean; invalid: boolean }>`
  text-align: right;
  padding-right: 2rem !important;

  ${mixinInputDefault}
  ${mixinInputValidation}
`;

const Unit = styled.div`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translate3d(0, -50%, 0);

  user-select: none;
`;

const Tool = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

interface Props {
  id: string;
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
  ariaLabel: string;
  limit: number;
  showIcon: boolean;
  showFeedback: boolean;
  numberType: CountNumberType;
  unit: string;
}

export const CountingInput: FC<Props> = ({
  id,
  ariaLabel,
  count,
  setCount,
  limit,
  showIcon,
  showFeedback,
  numberType,
  unit
}) => {
  const intervalRef = useRef<number | null>(null);

  const [valid, setValid] = useState(false);

  const [invalid, setInvalid] = useState(false);

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;

    let num = Number(value);
    // 0을 설정할 수 없도록 최소값설정
    if (num === 0) {
      if (numberType === CountNumberType.DECIMAL) {
        num = 0.1;
      } else if (numberType === CountNumberType.INTEGER) {
        num = 1;
      }
    }
    // 글자 입력 방지
    if (!num) {
      return;
    }
    // 소숫점 두자리가 되지 않도록 처리
    if (numberType === CountNumberType.DECIMAL) {
      const strNum = String(num);
      if (strNum.length === 4) {
        num = +strNum[strNum.length - 1] / 10;
      }
    }

    changeCount(Math.abs(num));
  };

  const Startholding = (operator: string) => {
    if (intervalRef.current !== null) {
      return;
    }

    let nextVal = count;
    intervalRef.current = window.setInterval(() => {
      if (operator === "+") {
        if (numberType === CountNumberType.DECIMAL) {
          nextVal = plusDecimal(nextVal, 0.1);
        } else if (numberType === CountNumberType.INTEGER) {
          nextVal += 1;
        }
      } else if (operator === "-") {
        if (numberType === CountNumberType.DECIMAL) {
          nextVal = minusDecimal(nextVal, 0.1);
        } else if (numberType === CountNumberType.INTEGER) {
          nextVal -= 1;
        }
      }

      changeCount(nextVal);
    }, 50);
  };

  const stopHolding = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);

      intervalRef.current = null;
    }
  };

  const changeCount = (count: number) => {
    if (count > limit) {
      setInvalid(true);
      setValid(false);
    } else {
      setInvalid(false);
      setValid(true);
    }
    // 음수 혹은 limit + 2의 수는 허용하지 않음.
    if (count > 0 && count < limit + 2) {
      setCount(count);
    } else {
      stopHolding();
    }
  };

  return (
    <Container>
      <Body>
        <InputWrapper>
          <StyledInput
            type="text"
            id={id}
            onChange={handleChange}
            value={count}
            valid={valid}
            invalid={invalid}
          />
          {unit && <Unit>{unit}</Unit>}
        </InputWrapper>
        {showIcon && (
          <Tool>
            <IconWrapper
              ariaLabel={`${ariaLabel} 감소`}
              onMouseDown={() => Startholding("-")}
              onMouseUp={() => stopHolding()}
            >
              <AiOutlineMinus />
            </IconWrapper>
            <IconWrapper
              ariaLabel={`${ariaLabel} 증가`}
              onMouseDown={() => Startholding("+")}
              onMouseUp={() => stopHolding()}
            >
              <AiOutlinePlus />
            </IconWrapper>
          </Tool>
        )}
      </Body>
      {showFeedback && (
        <Feedback valid={valid} invalid={invalid}>
          {`${limit} 미만으로 설정해주세요.`}
        </Feedback>
      )}
    </Container>
  );
};
