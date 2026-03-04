import { describe, it, expect } from 'vitest'
import { Day } from '@/utils/date'
import dayjs from 'dayjs'

describe('Day class', () => {
    describe('instance', () => {
        it('returns a dayjs constructor', () => {
            const d = Day.instance()
            expect(d.isValid()).toBe(true)
        })

        it('creates a dayjs object from a string', () => {
            const d = Day.instance('2026-01-15')
            expect(d.year()).toBe(2026)
            expect(d.month()).toBe(0) // January = 0
            expect(d.date()).toBe(15)
        })
    })

    describe('unixToDayjs', () => {
        it('converts unix timestamp to dayjs', () => {
            const timestamp = 1770443425 // Some unix timestamp
            const d = Day.unixToDayjs(timestamp)
            expect(d.isValid()).toBe(true)
            expect(d.unix()).toBe(timestamp)
        })
    })

    describe('isToday', () => {
        it('returns true for today', () => {
            const today = dayjs()
            expect(Day.isToday(today)).toBe(true)
        })

        it('returns false for yesterday', () => {
            const yesterday = dayjs().subtract(1, 'day')
            expect(Day.isToday(yesterday)).toBe(false)
        })

        it('returns false for tomorrow', () => {
            const tomorrow = dayjs().add(1, 'day')
            expect(Day.isToday(tomorrow)).toBe(false)
        })
    })

    describe('isYesterday', () => {
        it('returns true for yesterday', () => {
            const yesterday = dayjs().subtract(1, 'day')
            expect(Day.isYesterday(yesterday)).toBe(true)
        })

        it('returns false for today', () => {
            const today = dayjs()
            expect(Day.isYesterday(today)).toBe(false)
        })
    })

    describe('isThisWeek', () => {
        it('returns true for today', () => {
            const today = dayjs()
            expect(Day.isThisWeek(today)).toBe(true)
        })

        it('returns false for date 2 weeks ago', () => {
            const twoWeeksAgo = dayjs().subtract(14, 'day')
            expect(Day.isThisWeek(twoWeeksAgo)).toBe(false)
        })
    })

    describe('dateToDayOfWeek', () => {
        it('returns abbreviated day name', () => {
            // 2026-01-05 is a Monday
            const result = Day.dateToDayOfWeek('2026-01-05')
            expect(result).toBe('Mon')
        })

        it('returns correct day for various dates', () => {
            // Verify days of week are 3-letter abbreviations
            const result = Day.dateToDayOfWeek('2026-01-01')
            expect(result).toMatch(/^(Sun|Mon|Tue|Wed|Thu|Fri|Sat)$/)
        })
    })
})
