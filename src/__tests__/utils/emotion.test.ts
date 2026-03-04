import { describe, it, expect } from 'vitest'
import { getEmotionColor, getEmotionColorClass } from '@/utils/emotion'

describe('getEmotionColor', () => {
    it('returns very-low color for scores 1-2', () => {
        expect(getEmotionColor(1)).toBe('var(--color-emotion-very-low)')
        expect(getEmotionColor(2)).toBe('var(--color-emotion-very-low)')
    })

    it('returns low color for scores 3-4', () => {
        expect(getEmotionColor(3)).toBe('var(--color-emotion-low)')
        expect(getEmotionColor(4)).toBe('var(--color-emotion-low)')
    })

    it('returns neutral color for scores 5-6', () => {
        expect(getEmotionColor(5)).toBe('var(--color-emotion-neutral)')
        expect(getEmotionColor(6)).toBe('var(--color-emotion-neutral)')
    })

    it('returns high color for scores 7-8', () => {
        expect(getEmotionColor(7)).toBe('var(--color-emotion-high)')
        expect(getEmotionColor(8)).toBe('var(--color-emotion-high)')
    })

    it('returns very-high color for scores 9-10', () => {
        expect(getEmotionColor(9)).toBe('var(--color-emotion-very-high)')
        expect(getEmotionColor(10)).toBe('var(--color-emotion-very-high)')
    })

    it('handles string scores', () => {
        expect(getEmotionColor('3')).toBe('var(--color-emotion-low)')
        expect(getEmotionColor('8')).toBe('var(--color-emotion-high)')
        expect(getEmotionColor('10')).toBe('var(--color-emotion-very-high)')
    })

    it('handles edge case: score 0 returns very-low', () => {
        expect(getEmotionColor(0)).toBe('var(--color-emotion-very-low)')
    })

    it('handles edge case: score > 10 returns very-high', () => {
        expect(getEmotionColor(11)).toBe('var(--color-emotion-very-high)')
    })
})

describe('getEmotionColorClass', () => {
    it('returns correct Tailwind class for each tier', () => {
        expect(getEmotionColorClass(1)).toBe('[color:var(--color-emotion-very-low)]')
        expect(getEmotionColorClass(3)).toBe('[color:var(--color-emotion-low)]')
        expect(getEmotionColorClass(5)).toBe('[color:var(--color-emotion-neutral)]')
        expect(getEmotionColorClass(7)).toBe('[color:var(--color-emotion-high)]')
        expect(getEmotionColorClass(9)).toBe('[color:var(--color-emotion-very-high)]')
    })

    it('handles string scores', () => {
        expect(getEmotionColorClass('4')).toBe('[color:var(--color-emotion-low)]')
        expect(getEmotionColorClass('9')).toBe('[color:var(--color-emotion-very-high)]')
    })

    it('returns same tier boundaries as getEmotionColor', () => {
        for (let score = 1; score <= 10; score++) {
            const colorVar = getEmotionColor(score).replace('var(', '').replace(')', '')
            const colorClass = getEmotionColorClass(score)
            expect(colorClass).toContain(colorVar)
        }
    })
})
