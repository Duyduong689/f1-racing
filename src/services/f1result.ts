import axiosBase, { baseURL } from "../utils/AxiosInstance";
import { useQuery } from "react-query";
import { Helper } from "../utils/Helper";
import { SelectOption, Races, RaceResult, FastestLaps, PitStopSummary, StartingGrid, Qualifying, Practice, Drivers, DriverDetail, Teams, TeamDetail, DHLFastestLapAward } from "../model/F1RacingModel";
const getF1Result = async (filterData: any) => {
    const { year, apiType, meeting, driverRef, teamKey, resultType } = filterData;
    let yearFilter = year ?? '2023'
    let apiTypeFilter = apiType ?? 'races'
    let meetingFilter = meeting ? `/${meeting}` : '';
    let driverRefFilter = driverRef ? `/${driverRef}` : '';
    let teamKeyFilter = teamKey ? `/${teamKey}` : '';
    let resultTypeFilter = resultType ? `/${resultType}` : '';
    const response = await axiosBase.get(
        `${baseURL}/${yearFilter}/${apiTypeFilter}${meetingFilter}${driverRefFilter}${teamKeyFilter}${resultTypeFilter}.html`
    );
    return response.data;
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
            localStorage.setItem(`filterresultType`, JSON.stringify([]))
            localStorage.setItem(`filterteamKey`, JSON.stringify([]))
            localStorage.setItem(`filterdriverRef`, JSON.stringify([]))
            localStorage.setItem(`filtermeetingKey`, JSON.stringify([]))

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
                localStorage.setItem(`filter${item.getAttribute("name")}`, JSON.stringify(selectItemListData))

            })
            //get table data
            const tableElement = htmlDoc.getElementsByClassName('resultsarchive-table');
            if (tableElement.length > 0) {
                const tableListRowElement = tableElement[0].getElementsByTagName("tbody")[0].children
                if (apiType == "races") {
                    //  All Races data
                    if (meeting == "") {
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
                                laps: tr.children[4].innerHTML,
                                time: tr.children[5].innerHTML,
                            }
                            tableListAllRacesData.push(race)
                        })
                        localStorage.setItem("tableData", JSON.stringify(tableListAllRacesData))
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
                            localStorage.setItem("tableData", JSON.stringify(tableListDetailRaceData))
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
                            localStorage.setItem("tableData", JSON.stringify(tableListFastestLapData))
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
                            localStorage.setItem("tableData", JSON.stringify(tableListPitStopSummaryData))
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
                            localStorage.setItem("tableData", JSON.stringify(tableListStartingGridData))
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
                            localStorage.setItem("tableData", JSON.stringify(tableListQualifyingData))
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
                            localStorage.setItem("tableData", JSON.stringify(tableListPracticeData))
                        }
                    }
                }
                else if (apiType == "drivers") {
                    if (driverRef == "") {
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
                        localStorage.setItem("tableData", JSON.stringify(tableListDriversData))
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
                        localStorage.setItem("tableData", JSON.stringify(tableListDriverDetailData))
                    }
                }
                else if (apiType == "team") {
                    if (teamKey == "") {
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
                        localStorage.setItem("tableData", JSON.stringify(tableListTeamsData))
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
                        localStorage.setItem("tableData", JSON.stringify(tableListTeamDetailData))
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
                    localStorage.setItem("tableData", JSON.stringify(tableListDHLFastestLapData))
                }
            }
            else {
                localStorage.setItem("tableData", JSON.stringify([]))
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