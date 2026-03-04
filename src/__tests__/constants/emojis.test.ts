import { describe, it, expect } from 'vitest'
import { getEmotionEmoji, SCORE_TO_EMOTION } from '@/constants/emojis'

describe('SCORE_TO_EMOTION', () => {
    it('has entries for scores 1 through 10', () => {
        for (let i = 1; i <= 10; i++) {
            expect(SCORE_TO_EMOTION[i]).toBeDefined()
            expect(SCORE_TO_EMOTION[i].label).toBeTruthy()
            expect(SCORE_TO_EMOTION[i].image).toBeTruthy()
        }
    })

    it('has no entry for score 0', () => {
        expect(SCORE_TO_EMOTION[0]).toBeUndefined()
    })

    it('has no entry for score 11', () => {
        expect(SCORE_TO_EMOTION[11]).toBeUndefined()
    })

    it('has unique labels for each score', () => {
        const labels = Object.values(SCORE_TO_EMOTION).map((e) => e.label)
        const uniqueLabels = new Set(labels)
        expect(uniqueLabels.size).toBe(labels.length)
    })
})

describe('getEmotionEmoji', () => {
    it('returns correct emoji for valid scores', () => {
        for (let i = 1; i <= 10; i++) {
            const result = getEmotionEmoji(i)
            expect(result.label).toBe(SCORE_TO_EMOTION[i].label)
            expect(result.image).toBe(SCORE_TO_EMOTION[i].image)
        }
    })

    it('handles string scores', () => {
        const result = getEmotionEmoji('7')
        expect(result.label).toBe(SCORE_TO_EMOTION[7].label)
    })

    it('returns Unknown fallback for score 0', () => {
        const result = getEmotionEmoji(0)
        expect(result.label).toBe('Unknown')
    })

    it('returns Unknown fallback for negative scores', () => {
        const result = getEmotionEmoji(-1)
        expect(result.label).toBe('Unknown')
    })

    it('returns Unknown fallback for scores > 10', () => {
        const result = getEmotionEmoji(11)
        expect(result.label).toBe('Unknown')
    })

    it('returns Unknown fallback for NaN string', () => {
        const result = getEmotionEmoji('not-a-number')
        expect(result.label).toBe('Unknown')
    })

    it('returns an image path for every valid score', () => {
        for (let i = 1; i <= 10; i++) {
            const result = getEmotionEmoji(i)
            expect(result.image).toBeTruthy()
            expect(typeof result.image).toBe('string')
        }
    })
})
