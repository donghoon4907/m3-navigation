import type { ChangeEvent, Dispatch, FC, SetStateAction } from "react";

import { CountingInput } from "../CountingInput";
import { CountNumberType } from "../../types/count";
import * as Option from "./Option";
import { RequireLabel } from "../RequireLabel";
import { CustomSelect } from "../CustomSelect";
import { DefaultInput } from "../Input";
import type { SelectOption } from "../../interfaces/select";
import { iconAlignOptions } from "../options/IconAlign";
import type { GridColumnOption } from "../../interfaces/grid";

interface Props extends GridColumnOption {
  id: string | number;
  iconAlign: SelectOption;
  setIconAlign: Dispatch<SetStateAction<SelectOption>>;
  iconSize: number;
  setIconSize: Dispatch<SetStateAction<number>>;
  iconColor: string;
  setIconColor: Dispatch<SetStateAction<string>>;
}

export const IconOption: FC<Props> = ({
  id,
  iconAlign,
  setIconAlign,
  iconSize,
  setIconSize,
  iconColor,
  setIconColor,
  span
}) => {
  const handleChangeIconColor = (evt: ChangeEvent<HTMLInputElement>) => {
    setIconColor(evt.target.value);
  };

  return (
    <>
      <Option.GridColumn span={span}>
        <RequireLabel htmlFor={`setIconSize${id}`}>크기</RequireLabel>
        <CountingInput
          id={`setIconSize${id}`}
          ariaLabel="아이콘 크기"
          count={iconSize}
          setCount={setIconSize}
          limit={20}
          showIcon={true}
          showFeedback={true}
          numberType={CountNumberType.INTEGER}
          unit="px"
        />
      </Option.GridColumn>
      <Option.GridColumn span={span}>
        <RequireLabel>정렬</RequireLabel>
        <CustomSelect
          activeOption={iconAlign}
          setOption={setIconAlign}
          options={iconAlignOptions}
        />
      </Option.GridColumn>

      <Option.GridColumn span={span}>
        <RequireLabel htmlFor={`setIconColor${id}`}>색</RequireLabel>
        <DefaultInput
          type="color"
          id={`setIconColor${id}`}
          value={iconColor}
          onChange={handleChangeIconColor}
        />
      </Option.GridColumn>
    </>
  );
};
