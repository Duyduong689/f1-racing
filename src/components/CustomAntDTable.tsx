import React from "react";
import { Table, Typography } from "antd";
import { Helper } from "../utils/Helper";
interface CustomAntDTableProps {
  columns: any[];
  data: any[];
  handleChangeFilter: (value: any) => void;
}
const { Text, Link } = Typography;
const CustomAntDTable: React.FC<CustomAntDTableProps> = ({
  columns,
  data,
  handleChangeFilter,
}) => {
  const updateColumns = columns.map((item) => {
    if (item.key == "grandPrix") {
      return {
        ...item,
        render: (value: any) => {
          if (typeof value === "object") {
            return (
              <Text
                strong
                style={{ cursor: "pointer" }}
                onClick={() =>
                  handleChangeFilter(Helper.subStringUrl(value?.url))
                }
              >
                {value?.text}
              </Text>
            );
          } else {
            return <span>{value}</span>;
          }
        },
      };
    } else if (item.key == "driver" || item.key == "winner") {
      return {
        ...item,
        render: (value: any) => {
          return (
            <Text
              strong={value.url ? true : false}
              style={{ cursor: "pointer" }}
              onClick={() =>
                value.url
                  ? handleChangeFilter(Helper.subStringUrl(value?.url))
                  : undefined
              }
            >{`${value.hideForTablet} ${value.hideForMobile} ${value.hideForDesktop}`}</Text>
          );
        },
      };
    } else if (item.key == "car" || item.key == "team") {
      return {
        ...item,
        render: (value: any) => {
          if (typeof value === "object") {
            return (
              <Text
                strong
                style={{ cursor: "pointer" }}
                onClick={() =>
                  handleChangeFilter(Helper.subStringUrl(value?.url))
                }
              >
                {value.text}
              </Text>
            );
          } else {
            return <span>{value}</span>;
          }
        },
      };
    }
    return item;
  });
  let finalColumn = [...updateColumns];
  const objectKeySpecial = "position";
  const foundObject = updateColumns.find((obj) => obj.key == objectKeySpecial);
  if (foundObject && Object.keys(foundObject).length > 0) {
    const filteredData = updateColumns.filter(
      (obj) => obj.key !== objectKeySpecial
    );
    finalColumn = [
      { title: "Position", key: "position", dataIndex: "position" },
      ...filteredData,
    ];
  }
  const updateData = data.map((item, index) => {
    return {
      ...item,
      key: index,
    };
  });
  return (
    <Table
      scroll={{ x: 500 }}
      size="large"
      columns={finalColumn}
      dataSource={updateData}
    />
  );
};

export default CustomAntDTable;
