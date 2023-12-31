import axiosBase, { baseURL } from "../utils/AxiosInstance";
import { useQuery } from "react-query";
import { Helper } from "../utils/Helper";
import { SelectOption, Races, RaceResult, FastestLaps, PitStopSummary, StartingGrid, Qualifying, Practice, Drivers, DriverDetail, Teams, TeamDetail, DHLFastestLapAward, Heading } from "../model/F1RacingModel";
import { EmptyObj } from "../utils/EmptyObj";
const getF1Result = async (filterData: any) => {
    const { year, apiType, meeting, driverRef, teamKey, resultType } = filterData;
    let yearFilter = year ?? '2023'
    let apiTypeFilter = apiType ?? 'races'
    let meetingFilter = meeting ? meeting != "all" ? `/${meeting}` : '' : "";
    let driverRefFilter = driverRef ? driverRef != "all" ? `/${driverRef}` : '' : '';
    let teamKeyFilter = teamKey ? teamKey != "all" ? `/${teamKey}` : '' : '';
    let resultTypeFilter = resultType ? `/${resultType}` : '';
    const response = await axiosBase.get(
        `${baseURL}/${yearFilter}/${apiTypeFilter}${meetingFilter}${driverRefFilter}${teamKeyFilter}${resultTypeFilter}.html`
    );
    return response.data;
};
const getDriverChartData = async (filterData: any) => {
    const { year, apiType, driverRef, teamKey } = filterData;
    let yearFilter = year ?? '2023'
    let apiTypeFilter = ""
    const parser = new DOMParser();
    if (driverRef !== "") {
        apiTypeFilter = "drivers";
        const driverLastName = Helper.getDriverName(driverRef)
        for (let i = 0; i < 5; i++) {
            const response = await axiosBase.get(
                `${baseURL}/${yearFilter}/${apiTypeFilter}.html`
            );
            const htmlDoc = parser.parseFromString(response.data, 'text/html');
            const tableElement = htmlDoc.getElementsByClassName('resultsarchive-table');
            if (tableElement.length > 0) {
                const tableListRowElement = tableElement[0].getElementsByTagName("tbody")[0].children
                const tableListDriversData: Drivers[] = [];
                Array.from(tableListRowElement).map((tr) => {
                    if (tr.children[2].children[0].children[1].innerHTML.toLocaleLowerCase() === driverLastName) {
                        let driver: Drivers = {
                            position: tr.children[1].innerHTML,
                            driver: {
                                url: tr.children[2].getElementsByTagName('a')[0].getAttribute("href"),
                                hideForTablet: tr.children[2].children[0].children[0].innerHTML,
                                hideForMobile: tr.children[2].children[0].children[1].innerHTML,
                                hideForDesktop: tr.children[2].children[0].children[2].innerHTML,
                            },
                            nationality: tr.children[3].innerHTML,
                            car: {
                                url: tr.children[4].children[0].getAttribute("href"),
                                text: tr.children[4].children[0].innerHTML,
                            },
                            points: tr.children[5].innerHTML,
                        }
                        tableListDriversData.push(driver)
                    }
                })
                let getDataFromStorage = sessionStorage.getItem("tableDataChart")
                if (getDataFromStorage) {
                    let tableDataChart = JSON.parse(sessionStorage.getItem("tableDataChart") ?? '')

                    let convertToChartArray = Helper.convertToChartDataFor(tableListDriversData, yearFilter)

                    tableDataChart = [...tableDataChart, ...convertToChartArray]
                    sessionStorage.setItem("tableDataChart", JSON.stringify(tableDataChart))
                }
                else {
                    let convertToChartArray = Helper.convertToChartDataFor(tableListDriversData, yearFilter)

                    sessionStorage.setItem("tableDataChart", JSON.stringify(convertToChartArray))
                }
                // Helper.setTableColumnFromEmptyModel(EmptyObj.driversEmpty)
            }
            yearFilter--;
        }
    }
    else if (teamKey != "") {
        apiTypeFilter = "team";
        for (let i = 0; i < 5; i++) {
            const response = await axiosBase.get(
                `${baseURL}/${yearFilter}/${apiTypeFilter}.html`
            );
            const htmlDoc = parser.parseFromString(response.data, 'text/html');
            const tableElement = htmlDoc.getElementsByClassName('resultsarchive-table');
            if (tableElement.length > 0) {
                const tableListRowElement = tableElement[0].getElementsByTagName("tbody")[0].children
                const tableListTeamsData: Teams[] = [];
                Array.from(tableListRowElement).map((tr) => {
                    if (Helper.compareTeamName(teamKey, Helper.getTeamName(tr.children[2].children[0].getAttribute('href') ?? ''))) {
                        let team: Teams = {
                            position: tr.children[1].innerHTML,
                            team: {
                                url: tr.children[2].children[0].getAttribute('href'),
                                text: tr.children[2].children[0].innerHTML
                            },
                            points: tr.children[3].innerHTML,
                        }
                        tableListTeamsData.push(team)
                    }
                })
                let getDataFromStorage = sessionStorage.getItem("tableDataChart")
                if (getDataFromStorage) {
                    let tableDataChart = JSON.parse(sessionStorage.getItem("tableDataChart") ?? '')
                    let convertToChartArray = Helper.convertToChartDataFor(tableListTeamsData, yearFilter)

                    tableDataChart = [...tableDataChart, ...convertToChartArray]
                    sessionStorage.setItem("tableDataChart", JSON.stringify(tableDataChart))
                }
                else {

                    let convertToChartArray = Helper.convertToChartDataFor(tableListTeamsData, yearFilter)
                    sessionStorage.setItem("tableDataChart", JSON.stringify(convertToChartArray))
                }
            }
            yearFilter--;
        }
    }

    //return response.data;
};
const useGetF1Result = (filterData: any) => {
    const { year, apiType, meeting, driverRef, teamKey, resultType } = filterData;
    return useQuery({
        queryKey: ["getF1Result"],
        queryFn: async () => {
            const data = await getF1Result(filterData);
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(data, 'text/html');
            //get filter data
            const selectionFiltersElement = htmlDoc.getElementsByClassName('resultsarchive-filter-form-select');
            sessionStorage.setItem(`filterresultType`, JSON.stringify([]))
            sessionStorage.setItem(`filterteamKey`, JSON.stringify([]))
            sessionStorage.setItem(`filterdriverRef`, JSON.stringify([]))
            sessionStorage.setItem(`filtermeetingKey`, JSON.stringify([]))
            sessionStorage.setItem(`heading`, JSON.stringify(""))
            sessionStorage.setItem(`description`, JSON.stringify(""))
            sessionStorage.setItem(`tableDataChart`, JSON.stringify([]))

            Array.from(selectionFiltersElement).map(item => {
                let selectItemListData: SelectOption[] = [];
                Array.from(item.children).map((option) => {
                    if (item.getAttribute("name") == "meetingKey") {
                        selectItemListData.push({ value: option.getAttribute("value"), label: Helper.extractCountryName(option.getAttribute("value") ?? '') })
                    }
                    else {
                        selectItemListData.push({ value: option.getAttribute("value"), label: option.innerHTML })
                    }
                });
                if (item.getAttribute("name") == "meetingKey") {
                    selectItemListData = selectItemListData.slice(1);
                    const updateSelectItemListData = [
                        { value: 'all', label: "All" }, ...selectItemListData
                    ]
                    sessionStorage.setItem(`filter${item.getAttribute("name")}`, JSON.stringify(updateSelectItemListData))
                }
                else {
                    sessionStorage.setItem(`filter${item.getAttribute("name")}`, JSON.stringify(selectItemListData))
                }
            })
            // get title data
            const titleHeadingElement = htmlDoc.getElementsByClassName("ResultsArchiveTitle")
            const sponserImageUrl = htmlDoc.getElementsByClassName("race-header-sponsor")[0]?.children[0]?.children[0]?.getAttribute('src')
            const heading: Heading = {
                heading: Helper.customHeadingTrim(titleHeadingElement[0].textContent ?? '', year),
                sponserImageUrl: Helper.convertToRealSponserImageUrl(sponserImageUrl ?? ''),
                startDate: htmlDoc.getElementsByClassName("start-date")[0]?.innerHTML,
                fullDate: htmlDoc.getElementsByClassName("full-date")[0]?.innerHTML,
                circuitInfo: htmlDoc.getElementsByClassName("circuit-info")[0]?.innerHTML,
            }
            const description = htmlDoc.getElementsByClassName("resultsarchive-content-header")[0].children[2];
            sessionStorage.setItem(`heading`, JSON.stringify(heading))
            if (description) {
                if (description.className != "sponser-wrapper")
                    sessionStorage.setItem(`description`, JSON.stringify(description.innerHTML))
            }
            //get table data
            const tableElement = htmlDoc.getElementsByClassName('resultsarchive-table');
            if (tableElement.length > 0) {
                const tableListRowElement = tableElement[0].getElementsByTagName("tbody")[0].children
                if (apiType == "races") {
                    //  All Races data
                    if (meeting == "" || meeting == "all") {
                        const tableListAllRacesData: Races[] = [];
                        Array.from(tableListRowElement).map((tr) => {
                            let race: Races = {
                                grandPrix: {
                                    text: Helper.removeNewlinesAndTrim(tr.children[1].getElementsByTagName('a')[0].innerHTML),
                                    url: tr.children[1].getElementsByTagName('a')[0].getAttribute("href")
                                },
                                date: tr.children[2].innerHTML,
                                winner: {
                                    hideForTablet: tr.children[3].children[0].innerHTML,
                                    hideForMobile: tr.children[3].children[1].innerHTML,
                                    hideForDesktop: tr.children[3].children[2].innerHTML,
                                },
                                car: tr.children[4].innerHTML,
                                laps: tr.children[5].innerHTML,
                                time: tr.children[6].innerHTML,
                            }
                            tableListAllRacesData.push(race)
                        })
                        sessionStorage.setItem("tableData", JSON.stringify(tableListAllRacesData))
                        Helper.setTableColumnFromEmptyModel(EmptyObj.racesEmpty)
                    }
                    //  Races Detail data
                    else {
                        if (resultType == "" || resultType == "race-result") {
                            const tableListDetailRaceData: RaceResult[] = [];
                            Array.from(tableListRowElement).map((tr) => {
                                let race: RaceResult = {
                                    position: tr.children[1].innerHTML,
                                    number: tr.children[2].innerHTML,
                                    driver: {
                                        hideForTablet: tr.children[3].children[0].innerHTML,
                                        hideForMobile: tr.children[3].children[1].innerHTML,
                                        hideForDesktop: tr.children[3].children[2].innerHTML,
                                    },
                                    car: tr.children[4].innerHTML,
                                    laps: tr.children[5].innerHTML,
                                    time: Helper.replaceSuffixSecond(
                                        tr.children[6].innerHTML
                                    ),
                                    points: tr.children[7].innerHTML,
                                }
                                tableListDetailRaceData.push(race)
                            })
                            sessionStorage.setItem("tableData", JSON.stringify(tableListDetailRaceData))
                            Helper.setTableColumnFromEmptyModel(EmptyObj.raceResultEmpty)

                        }
                        else if (resultType == "fastest-laps") {
                            const tableListFastestLapData: FastestLaps[] = [];
                            Array.from(tableListRowElement).map((tr) => {
                                let lap: FastestLaps = {
                                    position: tr.children[1].innerHTML,
                                    number: tr.children[2].innerHTML,
                                    driver: {
                                        hideForTablet: tr.children[3].children[0].innerHTML,
                                        hideForMobile: tr.children[3].children[1].innerHTML,
                                        hideForDesktop: tr.children[3].children[2].innerHTML,
                                    },
                                    car: tr.children[4].innerHTML,
                                    lap: tr.children[5].innerHTML,
                                    timeOfDay: tr.children[6].innerHTML,
                                    time: tr.children[7].innerHTML,
                                    avgSpeed: tr.children[8].innerHTML,
                                }
                                tableListFastestLapData.push(lap)
                            })
                            sessionStorage.setItem("tableData", JSON.stringify(tableListFastestLapData))
                            Helper.setTableColumnFromEmptyModel(EmptyObj.fastestLapsEmpty)

                        }
                        else if (resultType == "pit-stop-summary") {
                            const tableListPitStopSummaryData: PitStopSummary[] = [];
                            Array.from(tableListRowElement).map((tr) => {
                                let pitStop: PitStopSummary = {
                                    stops: tr.children[1].innerHTML,
                                    number: tr.children[2].innerHTML,
                                    driver: {
                                        hideForTablet: tr.children[3].children[0].innerHTML,
                                        hideForMobile: tr.children[3].children[1].innerHTML,
                                        hideForDesktop: tr.children[3].children[2].innerHTML,
                                    },
                                    car: tr.children[4].innerHTML,
                                    lap: tr.children[5].innerHTML,
                                    timeOfDay: tr.children[6].innerHTML,
                                    time: tr.children[7].innerHTML,
                                    total: tr.children[8].innerHTML,
                                }
                                tableListPitStopSummaryData.push(pitStop)
                            })
                            sessionStorage.setItem("tableData", JSON.stringify(tableListPitStopSummaryData))
                            Helper.setTableColumnFromEmptyModel(EmptyObj.pitStopSummaryEmpty)

                        }
                        else if (resultType == "starting-grid") {
                            const tableListStartingGridData: StartingGrid[] = [];
                            Array.from(tableListRowElement).map((tr) => {
                                let grid: StartingGrid = {
                                    position: tr.children[1].innerHTML,
                                    number: tr.children[2].innerHTML,
                                    driver: {
                                        hideForTablet: tr.children[3].children[0].innerHTML,
                                        hideForMobile: tr.children[3].children[1].innerHTML,
                                        hideForDesktop: tr.children[3].children[2].innerHTML,
                                    },
                                    car: tr.children[4].innerHTML,
                                    time: tr.children[5].innerHTML,
                                }
                                tableListStartingGridData.push(grid)
                            })
                            sessionStorage.setItem("tableData", JSON.stringify(tableListStartingGridData))
                            Helper.setTableColumnFromEmptyModel(EmptyObj.startingGridEmpty)

                        }
                        else if (resultType == "qualifying") {
                            const tableListQualifyingData: Qualifying[] = [];
                            Array.from(tableListRowElement).map((tr) => {
                                let qualify: Qualifying = {
                                    position: tr.children[1].innerHTML,
                                    number: tr.children[2].innerHTML,
                                    driver: {
                                        hideForTablet: tr.children[3].children[0].innerHTML,
                                        hideForMobile: tr.children[3].children[1].innerHTML,
                                        hideForDesktop: tr.children[3].children[2].innerHTML,
                                    },
                                    car: tr.children[4].innerHTML,
                                    q1: tr.children[5].innerHTML,
                                    q2: tr.children[6].innerHTML,
                                    q3: tr.children[7].innerHTML,
                                    laps: tr.children[8].innerHTML,
                                }
                                tableListQualifyingData.push(qualify)
                            })
                            sessionStorage.setItem("tableData", JSON.stringify(tableListQualifyingData))
                            Helper.setTableColumnFromEmptyModel(EmptyObj.qualifyingEmpty)

                        }
                        else if (resultType == "practice-1" || resultType == "practice-2" || resultType == "practice-3") {
                            const tableListPracticeData: Practice[] = [];
                            Array.from(tableListRowElement).map((tr) => {
                                let practice: Practice = {
                                    position: tr.children[1].innerHTML,
                                    number: tr.children[2].innerHTML,
                                    driver: {
                                        hideForTablet: tr.children[3].children[0].innerHTML,
                                        hideForMobile: tr.children[3].children[1].innerHTML,
                                        hideForDesktop: tr.children[3].children[2].innerHTML,
                                    },
                                    car: tr.children[4].innerHTML,
                                    time: tr.children[5].innerHTML,
                                    laps: Helper.replaceSuffixSecond(
                                        tr.children[6].innerHTML
                                    ),
                                    gap: tr.children[7].innerHTML,

                                }
                                tableListPracticeData.push(practice)
                            })
                            sessionStorage.setItem("tableData", JSON.stringify(tableListPracticeData))
                            Helper.setTableColumnFromEmptyModel(EmptyObj.practiceEmpty)

                        }
                    }
                }
                else if (apiType == "drivers") {
                    if (driverRef == "" || driverRef == "all") {
                        const tableListDriversData: Drivers[] = [];
                        Array.from(tableListRowElement).map((tr) => {
                            let driver: Drivers = {
                                position: tr.children[1].innerHTML,
                                driver: {
                                    url: tr.children[2].getElementsByTagName('a')[0].getAttribute("href"),
                                    hideForTablet: tr.children[2].children[0].children[0].innerHTML,
                                    hideForMobile: tr.children[2].children[0].children[1].innerHTML,
                                    hideForDesktop: tr.children[2].children[0].children[2].innerHTML,
                                },
                                nationality: tr.children[3].innerHTML,
                                car: {
                                    url: tr.children[4].children[0].getAttribute("href"),
                                    text: tr.children[4].children[0].innerHTML,
                                },
                                points: tr.children[5].innerHTML,
                            }
                            tableListDriversData.push(driver)
                        })
                        sessionStorage.setItem("tableData", JSON.stringify(tableListDriversData))
                        Helper.setTableColumnFromEmptyModel(EmptyObj.driversEmpty)

                    }
                    else {
                        const tableListDriverDetailData: DriverDetail[] = [];
                        Array.from(tableListRowElement).map((tr) => {
                            let driver: DriverDetail = {
                                grandPrix: {
                                    url: tr.children[1].children[0].getAttribute("href"),
                                    text: tr.children[1].children[0].innerHTML,
                                },
                                date: tr.children[2].innerHTML,
                                car: {
                                    url: tr.children[3].children[0].getAttribute("href"),
                                    text: tr.children[3].children[0].innerHTML,
                                },
                                racePosition: tr.children[4].innerHTML,
                                points: tr.children[5].innerHTML,
                            }
                            tableListDriverDetailData.push(driver)
                        })
                        sessionStorage.setItem("tableData", JSON.stringify(tableListDriverDetailData))
                        Helper.setTableColumnFromEmptyModel(EmptyObj.driverDetailEmpty)
                        await getDriverChartData(filterData);
                    }
                }
                else if (apiType == "team") {
                    if (teamKey == "" || teamKey == "all") {
                        const tableListTeamsData: Teams[] = [];
                        Array.from(tableListRowElement).map((tr) => {
                            let team: Teams = {
                                position: tr.children[1].innerHTML,
                                team: {
                                    url: tr.children[2].children[0].getAttribute('href'),
                                    text: tr.children[2].children[0].innerHTML
                                },
                                points: tr.children[3].innerHTML,
                            }
                            tableListTeamsData.push(team)
                        })
                        sessionStorage.setItem("tableData", JSON.stringify(tableListTeamsData))
                        Helper.setTableColumnFromEmptyModel(EmptyObj.teamsEmpty)
                    }
                    else {
                        const tableListTeamDetailData: TeamDetail[] = [];
                        Array.from(tableListRowElement).map((tr) => {
                            let team: TeamDetail = {
                                grandPrix: {
                                    url: tr.children[1].children[0].getAttribute('href'),
                                    text: tr.children[1].children[0].innerHTML,
                                },
                                date: tr.children[2].innerHTML,
                                points: tr.children[3].innerHTML,
                            }
                            tableListTeamDetailData.push(team)
                        })
                        sessionStorage.setItem("tableData", JSON.stringify(tableListTeamDetailData))
                        Helper.setTableColumnFromEmptyModel(EmptyObj.teamDetailEmpty)
                        await getDriverChartData(filterData);
                    }
                }
                else if (apiType == "fastest-laps") {
                    const tableListDHLFastestLapData: DHLFastestLapAward[] = [];
                    Array.from(tableListRowElement).map((tr) => {
                        let fastest: DHLFastestLapAward = {
                            grandPrix: tr.children[1].innerHTML,
                            driver: {
                                hideForTablet: tr.children[2].children[0].innerHTML,
                                hideForMobile: tr.children[2].children[1].innerHTML,
                                hideForDesktop: tr.children[2].children[2].innerHTML,
                            },
                            car: tr.children[3].innerHTML,
                            time: tr.children[4].innerHTML,
                        }
                        tableListDHLFastestLapData.push(fastest)
                    })
                    sessionStorage.setItem("tableData", JSON.stringify(tableListDHLFastestLapData))
                    Helper.setTableColumnFromEmptyModel(EmptyObj.DHLFastestLapAwardEmpty)
                }
            }
            else {
                sessionStorage.setItem("tableData", JSON.stringify([]))
            }
            return data;
        },
        refetchOnWindowFocus: false,
        retry: 1,
    });
};
export const f1resultService = {
    useGetF1Result,
    getF1Result
}