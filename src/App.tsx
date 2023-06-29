import React, { useEffect, useState } from "react";
import { Layout, Space, Spin } from "antd";
import "./App.css";
import { f1resultService } from "./services/f1result";
import { Heading, SelectOption } from "./model/F1RacingModel";
import CustomAntDSelection from "./components/CustomAntDSelection";
import CustomAntDTable from "./components/CustomAntDTable";
import {
  headerStyle,
  contentStyle,
  footerStyle,
  layoutStyle,
} from "./AppStyle";
const { Header, Footer, Content } = Layout;

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
    meeting: "all",
    driverRef: "",
    teamKey: "",
    resultType: "",
  });
  const [heading, setHeading] = useState<Heading>();
  const [description, setDescription] = useState("");
  const [tableColumns, setTableColumns] = useState([]);
  const [tableData, setTableData] = useState([]);
  const { data, isLoading, isFetching, refetch } =
    f1resultService.useGetF1Result(filterData);
  function getDataFromStorage(key: string) {
    const storedData = sessionStorage.getItem(key);
    let parsedData = [];
    if (storedData) {
      parsedData = JSON.parse(storedData);
      return parsedData;
    }
  }
  const handleGetResult = (value: string, name: string) => {
    setFilterData((prev) => {
      if (name == "apiType") {
        prev["driverRef"] = value == "drivers" ? "all" : "";
        prev["teamKey"] = value == "team" ? "all" : "";
        prev["meeting"] = value == "races" ? "all" : "";
        prev["resultType"] = "";
      }
      if (name == "meeting") {
        prev["resultType"] = "race-result";
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleTableChangeFilter = (value: any) => {
    const { apiType, lastFilter } = value;
    if (apiType == "drivers") {
      setFilterData((prev) => {
        prev["apiType"] = apiType;
        prev["driverRef"] = lastFilter;
        prev["teamKey"] = "";
        prev["meeting"] = "";
        prev["resultType"] = "";
        return {
          ...prev,
        };
      });
    } else if (apiType == "team") {
      setFilterData((prev) => {
        prev["apiType"] = apiType;
        prev["driverRef"] = "";
        prev["teamKey"] = lastFilter;
        prev["meeting"] = "";
        prev["resultType"] = "";
        return {
          ...prev,
        };
      });
    } else if (apiType == "races") {
      setFilterData((prev) => {
        prev["apiType"] = apiType;
        prev["driverRef"] = "";
        prev["teamKey"] = "";
        prev["meeting"] = lastFilter;
        prev["resultType"] = "race-result";
        return {
          ...prev,
        };
      });
    }
  };
const descriptionFromStorage = () => {
    try {
      const storedElementHTML = JSON.parse(
        sessionStorage.getItem("description") ?? ""
      );
      setDescription(storedElementHTML);
    } catch (error) {
        return null;
    }
};
  useEffect(() => {
    setFilterYear(getDataFromStorage("filteryear"));
    setFilterApiType(getDataFromStorage("filterapiType"));
    setFilterMeeting(getDataFromStorage("filtermeetingKey"));
    setFilterDriverRef(getDataFromStorage("filterdriverRef"));
    setFilterTeamKey(getDataFromStorage("filterteamKey"));
    setFilterResultType(getDataFromStorage("filterresultType"));
    setTableColumns(getDataFromStorage("tableColumns"));
    setTableData(getDataFromStorage("tableData"));
    descriptionFromStorage();
    setHeading(getDataFromStorage("heading"));
  }, [data]);
  useEffect(() => {
    refetch();
  }, [filterData]);
  if (isLoading) {
    return (
      <div className="spinner">
        <Spin />
      </div>
    );
  }
  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>
        <div className="logo">
          <a href="/">
            <img
              height="35px"
              src="https://www.formula1.com/etc/designs/fom-website/images/f1_logo.svg"
            />
          </a>
        </div>
        <Space wrap className="filter-wrap">
          <CustomAntDSelection
            options={filterYear}
            name="year"
            handleOnChange={handleGetResult}
            defaultValue={filterData.year}
            value={filterData.year}
          />
          <CustomAntDSelection
            options={filterApiType}
            name="apiType"
            handleOnChange={handleGetResult}
            defaultValue={filterData.apiType}
            value={filterData.apiType}
          />
          {filterMeeting && filterMeeting.length > 0 && (
            <CustomAntDSelection
              options={filterMeeting}
              name="meeting"
              handleOnChange={handleGetResult}
              defaultValue={filterData.meeting}
              value={filterData.meeting}
            />
          )}
          {filterTeamKey && filterTeamKey.length > 0 && (
            <CustomAntDSelection
              options={filterTeamKey}
              name="teamKey"
              handleOnChange={handleGetResult}
              defaultValue={filterData.teamKey}
              value={filterData.teamKey}
            />
          )}
          {filterDriverRef && filterDriverRef.length > 0 && (
            <CustomAntDSelection
              options={filterDriverRef}
              name="driverRef"
              handleOnChange={handleGetResult}
              defaultValue={filterData.driverRef}
              value={filterData.driverRef}
            />
          )}
          {filterResultType && filterResultType?.length > 0 && (
            <CustomAntDSelection
              options={filterResultType}
              name="resultType"
              handleOnChange={handleGetResult}
              defaultValue={filterData.resultType}
              value={filterData.resultType}
            />
          )}
        </Space>
      </Header>
      <Content style={contentStyle}>
        <div className="title">
          {heading && heading.heading && (
            <h1 className="title-head">{heading.heading}</h1>
          )}
          {heading && heading.sponserImageUrl && (
            <img width="200px" src={heading.sponserImageUrl} />
          )}
        </div>
        <div className="date-info">
          {heading && heading.startDate && heading.fullDate && (
            <span>
              {heading.startDate}
              {"-"}
              {heading.fullDate}
            </span>
          )}
          {heading && heading.circuitInfo && (
            <span style={{ fontWeight: "lighter" }}>{heading.circuitInfo}</span>
          )}
        </div>
        {description && (
          <div
            className="description"
            style={{ lineHeight: "24px", color: "white", fontSize: "18px" }}
            dangerouslySetInnerHTML={{ __html: description }}
          ></div>
        )}
        <CustomAntDTable
          columns={tableColumns}
          data={tableData}
          handleChangeFilter={handleTableChangeFilter}
          loading={isFetching}
        />
      </Content>
      <Footer style={footerStyle}>
        © 2003-2023 Formula One World Championship Limited
      </Footer>
    </Layout>
  );
}

export default App;
