import React, { useEffect, useState } from "react";
import { Layout, Space, Button, Select } from "antd";
import "./App.css";
import { f1resultService } from "./services/f1result";
import { SelectOption } from "./model/F1RacingModel";
import CustomAntDSelection from "./components/CustomAntDSelection";
const { Header, Footer, Sider, Content } = Layout;
const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 50,
  lineHeight: "64px",
  backgroundColor: "#7dbcea",
};
const contentStyle: React.CSSProperties = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#108ee9",
};
const siderStyle: React.CSSProperties = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#3ba0e9",
};
const footerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#7dbcea",
};

function App() {
  const [filterYear, setFilterYear] = useState<SelectOption[]>([]);
  const [filterApiType, setFilterApiType] = useState<SelectOption[]>([]);
  const [filterMeeting, setFilterMeeting] = useState<SelectOption[]>([]);
  const [filterDriverRef, setFilterDriverRef] = useState<SelectOption[]>([]);
  const [filterTeamKey, setFilterTeamKey] = useState<SelectOption[]>([]);
  const [filterResultType, setFilterResultType] = useState<SelectOption[]>([]);
  const [filterData, setFilterData] = useState({
    year: "2023",
    apiType: "races",
    meeting: "",
    driverRef: "",
    teamKey: "",
    resultType: "",
  });
  const { data, isLoading, isError, refetch } =
    f1resultService.useGetF1Result(filterData);
  function getFilterDataFromStorage(key: string) {
    const storedData = localStorage.getItem(key);
    let parsedData = [];
    if (storedData) {
      parsedData = JSON.parse(storedData);
      return parsedData;
    }
  }
  const handleGetResult = (value: string, name: string) => {
    setFilterData((prev) => {
      if (name == "apiType") {
        prev["driverRef"] = "";
        prev["teamKey"] = "";
        prev["meeting"] = "";
        prev["resultType"] = "";
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  useEffect(() => {
    setFilterYear(getFilterDataFromStorage("filteryear"));
    setFilterApiType(getFilterDataFromStorage("filterapiType"));
    setFilterMeeting(getFilterDataFromStorage("filtermeetingKey"));
    setFilterDriverRef(getFilterDataFromStorage("filterdriverRef"));
    setFilterTeamKey(getFilterDataFromStorage("filterteamKey"));
    setFilterResultType(getFilterDataFromStorage("filterresultType"));
  }, [data]);
  useEffect(() => {
    refetch();
  }, [filterData]);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <Layout>
      <Header style={headerStyle}>
        <Space wrap>
          <CustomAntDSelection
            options={filterYear}
            name="year"
            handleOnChange={handleGetResult}
            defaultValue={filterData.year}
          />
          <CustomAntDSelection
            options={filterApiType}
            name="apiType"
            handleOnChange={handleGetResult}
            defaultValue={filterData.apiType}
          />
          {filterMeeting && filterMeeting.length > 0 && (
            <CustomAntDSelection
              options={filterMeeting}
              name="meeting"
              handleOnChange={handleGetResult}
              isSort={true}
              defaultValue={filterData.meeting}
            />
          )}
          {filterTeamKey && filterTeamKey.length > 0 && (
            <CustomAntDSelection
              options={filterTeamKey}
              name="teamKey"
              handleOnChange={handleGetResult}
              defaultValue={filterData.teamKey}
            />
          )}
          {filterDriverRef && filterDriverRef.length > 0 && (
            <CustomAntDSelection
              options={filterDriverRef}
              name="driverRef"
              handleOnChange={handleGetResult}
              defaultValue={filterData.driverRef}
            />
          )}
          {filterResultType && filterResultType?.length > 0 && (
            <CustomAntDSelection
              options={filterResultType}
              name="resultType"
              handleOnChange={handleGetResult}
              defaultValue={filterData.resultType}
            />
          )}
        </Space>
      </Header>
      <Content style={contentStyle}>Content</Content>
      <Footer style={footerStyle}>Footer</Footer>
    </Layout>
  );
}

export default App;
