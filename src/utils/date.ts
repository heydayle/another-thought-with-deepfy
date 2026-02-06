import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

// Extend dayjs with plugins
dayjs.extend(isBetween);

export class Day {
    static get instance() {
        return dayjs;
    }

    static unixToDayjs(unix: number) {
        return dayjs.unix(unix);
    }

    static isToday(date: dayjs.Dayjs) {
        return date.isSame(dayjs(), "day");
    }

    static isYesterday(date: dayjs.Dayjs) {
        return date.isSame(dayjs().subtract(1, "day"), "day");
    }

    static isThisWeek(date: dayjs.Dayjs) {
        return date.isBetween(dayjs().startOf("week"), dayjs().endOf("week"), null, '[]');
    }

    static dateToDayOfWeek(date: string) {
        return dayjs(date).format('ddd');
    }
}

// Export backward-compatible named exports
export const day = dayjs;
export const unixToDayjs = Day.unixToDayjs;
export const isToday = Day.isToday;
export const isYesterday = Day.isYesterday;
export const isThisWeek = Day.isThisWeek;
export const dateToDayOfWeek = Day.dateToDayOfWeek;