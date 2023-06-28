import React from "react";
import { SelectOption } from "../model/F1RacingModel";
import { Select } from "antd";
interface CustomAntDSelectionProps {
  options: SelectOption[];
  isSort?: Boolean;
  handleOnChange: (value: string, name: string) => void;
  name: string;
  defaultValue: string;
  value: string;
}
const CustomAntDSelection: React.FC<CustomAntDSelectionProps> = ({
  isSort = false,
  options,
  name,
  defaultValue,
  handleOnChange,
  value,
}) => {
  return (
    <Select
      showSearch
      size="large"
      style={{ minWidth: "200px" }}
      placeholder="Search to Select"
      optionFilterProp="children"
      filterOption={(input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      filterSort={
        isSort
          ? (optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
          : undefined
      }
      options={options}
      onChange={(value) => {
        handleOnChange(value, name);
      }}
      value={value}
      defaultValue={defaultValue}
    />
  );
};

export default CustomAntDSelection;
