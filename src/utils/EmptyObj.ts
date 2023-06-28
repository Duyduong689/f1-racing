import { DHLFastestLapAward, DriverDetail, Drivers, FastestLaps, PitStopSummary, Practice, Qualifying, RaceResult, Races, StartingGrid, TeamDetail, Teams } from "../model/F1RacingModel"

const racesEmpty: Races = {
    grandPrix: {
        text: '',
        url: '',
    },
    date: '',
    winner: {
        hideForTablet: "",
        hideForMobile: "",
        hideForDesktop: "",
    },
    car:'',
    laps: "",
    time: "",
}
const raceResultEmpty: RaceResult = {
    number: "",
    driver: {
        hideForTablet: "",
        hideForMobile: "",
        hideForDesktop: "",
    },
    car: "",
    position: "",
    laps: "",
    time: "",
    points: "",
}
const fastestLapsEmpty: FastestLaps = {
    number: "",
    driver: {
        hideForTablet: "",
        hideForMobile: "",
        hideForDesktop: "",
    },
    car: "",
    position: "",
    lap: "",
    timeOfDay:"",
    time: "",
    avgSpeed:"",
}
const pitStopSummaryEmpty: PitStopSummary = {
    number: "",
    driver: {
        hideForTablet: "",
        hideForMobile: "",
        hideForDesktop: "",
    },
    car: "",
    stops:"",
    lap: "",
    timeOfDay:"",
    time: "",
    total: "",
}
const startingGridEmpty: StartingGrid = {
    number: "",
    driver: {
        hideForTablet: "",
        hideForMobile: "",
        hideForDesktop: "",
    },
    car: "",
    position: "",
    time: "",
}
const qualifyingEmpty : Qualifying = {
    number: "",
    driver: {
        hideForTablet: "",
        hideForMobile: "",
        hideForDesktop: "",
    },
    car: "",
    position: "",
    q1:"",
    q2:"",
    q3:"",
    laps:"",
}
const practiceEmpty: Practice = {
    number: "",
    driver: {
        hideForTablet: "",
        hideForMobile: "",
        hideForDesktop: "",
    },
    car: "",
    position: "",
    time: "",
    laps:"",
    gap:"",
}
const driversEmpty : Drivers = {
    position:"",
    driver: {
        url:"",
        hideForTablet: "",
        hideForMobile: "",
        hideForDesktop: "",
    },
    nationality:"",
    car: {
        url:"",
        text: "",
    },
    points:"",
}
const driverDetailEmpty: DriverDetail = {
    grandPrix:{
        url:"",
        text: "",
    },
    date:"",
    car: {
        url:"",
        text: "",
    },
    racePosition:"",
    points:"",
}
const teamsEmpty: Teams = {
    position:"",
    team:{
        url:"",
        text: "",
    },
    points:"",
}
const teamDetailEmpty: TeamDetail = {
    grandPrix:{
        url:"",
        text: "",
    },
    date:"",
    points:"",
}
const DHLFastestLapAwardEmpty : DHLFastestLapAward ={
    grandPrix:"",
    driver: {
        hideForTablet: "",
        hideForMobile: "",
        hideForDesktop: "",
    },
    car: "",
    time:"",
}
export const EmptyObj = {
    racesEmpty,
    raceResultEmpty,
    fastestLapsEmpty,
    pitStopSummaryEmpty,
    startingGridEmpty,
    qualifyingEmpty,
    practiceEmpty,
    driversEmpty,
    driverDetailEmpty,
    teamsEmpty,
    teamDetailEmpty,
    DHLFastestLapAwardEmpty
}