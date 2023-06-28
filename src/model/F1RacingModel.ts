export interface SelectOption {
    value: string | null;
    label: string;
}
export interface Races {
    grandPrix: {
        text: string;
        url: string | null;
    }
    date: string;
    winner: {
        hideForTablet: string;
        hideForMobile: string;
        hideForDesktop: string;
    };
    car:string;
    laps: string;
    time: string;
}
export interface RaceResultCommon {
    number: string;
    driver: {
        hideForTablet: string;
        hideForMobile: string;
        hideForDesktop: string;
    };
    car: string;
}
export interface RaceResult extends RaceResultCommon {
    position: string
    laps: string;
    time: string;
    points: string;
}
export interface FastestLaps extends RaceResultCommon {
    position: string
    lap: string;
    timeOfDay:string;
    time: string;
    avgSpeed:string;
}
export interface PitStopSummary extends RaceResultCommon {
    stops:string;
    lap: string;
    timeOfDay:string;
    time: string;
    total: string;
}
export interface StartingGrid extends RaceResultCommon {
    position: string
    time: string;
}
export interface Qualifying extends RaceResultCommon {
    position: string
    q1:string;
    q2:string;
    q3:string;
    laps:string;
}
export interface Practice extends RaceResultCommon {
    position: string
    time: string;
    laps:string;
    gap:string;
}
export interface Drivers {
    position:string;
    driver: {
        url:string | null;
        hideForTablet: string;
        hideForMobile: string;
        hideForDesktop: string;
    };
    nationality:string;
    car: {
        url:string | null;
        text: string;
    }
    points:string;
}
export interface DriverDetail {
    grandPrix:{
        url:string | null;
        text: string;
    };
    date:string;
    car: {
        url:string | null;
        text: string;
    };
    racePosition:string;
    points:string;
}
export interface Teams {
    position:string;
    team:{
        url:string | null;
        text: string;
    };
    points:string;
}
export interface TeamDetail {
    grandPrix:{
        url:string | null;
        text: string;
    };
    date:string;
    points:string;
}
export interface DHLFastestLapAward {
    grandPrix:string;
    driver: {
        hideForTablet: string;
        hideForMobile: string;
        hideForDesktop: string;
    };
    car: string;
    time:string;
}
export interface Heading {
    heading:string;
    sponserImageUrl:string,
    startDate: string;
    fullDate: string;
    circuitInfo : string;
}