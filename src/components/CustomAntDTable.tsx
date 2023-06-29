import React from "react";
import { Table, Typography } from "antd";
import { Helper } from "../utils/Helper";
interface CustomAntDTableProps {
  columns: any[];
  data: any[];
  handleChangeFilter: (value: any) => void;
  loading: boolean;
}
const { Text, Link } = Typography;
const CustomAntDTable: React.FC<CustomAntDTableProps> = ({
  columns,
  data,
  handleChangeFilter,
  loading,
}) => {
  let updateColumns = columns?.map((item) => {
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
            <div
              style={{ cursor: value.url ? "pointer" : "undefine" }}
              onClick={() =>
                value.url
                  ? handleChangeFilter(Helper.subStringUrl(value?.url))
                  : undefined
              }
            >
              <Text className="hideForTablet" strong={value.url ? true : false}>
                {value.hideForTablet}
              </Text>
              <Text className="hideForMobile" strong={value.url ? true : false}>
                {value.hideForMobile}
              </Text>
              <Text
                className="hideForDesktop"
                strong={value.url ? true : false}
              >
                {value.hideForDesktop}
              </Text>
            </div>
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

  if (!Helper.isIterable(updateColumns)) {
    updateColumns = [];
  }
  let finalColumn = [...updateColumns];
  const objectKeySpecial1 = "position";
  const objectKeySpecial2 = "stops";
  const foundObject1 = updateColumns.find(
    (obj) => obj.key == objectKeySpecial1
  );
  const foundObject2 = updateColumns.find(
    (obj) => obj.key == objectKeySpecial2
  );

  if (foundObject1 && Object.keys(foundObject1).length > 0) {
    const filteredData = updateColumns.filter(
      (obj) => obj.key !== objectKeySpecial1
    );
    finalColumn = [
      { title: "Pos", key: "position", dataIndex: "position" },
      ...filteredData,
    ];
  }
  if (foundObject2 && Object.keys(foundObject2).length > 0) {
    const filteredData = updateColumns.filter(
      (obj) => obj.key !== objectKeySpecial2
    );
    finalColumn = [
      { title: "Stops", key: "stops", dataIndex: "stops" },
      ...filteredData,
    ];
  }

  const updateData = data?.map((item, index) => {
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
      loading={loading}
    />
  );
};

export default CustomAntDTable;
