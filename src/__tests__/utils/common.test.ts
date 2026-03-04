import { describe, it, expect } from 'vitest'
import { parseTextResult } from '@/utils/common'

describe('parseTextResult', () => {
    it('parses valid JSON string', () => {
        const input = '{"score": 8, "your_feeling": "Happy", "your_quote": "Life is good", "advice": "Keep going"}'
        const result = parseTextResult(input)

        expect(result).toEqual({
            score: 8,
            your_feeling: 'Happy',
            your_quote: 'Life is good',
            advice: 'Keep going',
        })
    })

    it('parses JSON wrapped in markdown code fences', () => {
        const input = '```json\n{"score": 5, "your_feeling": "Neutral"}\n```'
        const result = parseTextResult(input)

        expect(result).toEqual({
            score: 5,
            your_feeling: 'Neutral',
        })
    })

    it('parses JSON with only closing code fence', () => {
        const input = '{"score": 3, "your_feeling": "Sad"}\n```'
        const result = parseTextResult(input)

        expect(result).toEqual({
            score: 3,
            your_feeling: 'Sad',
        })
    })

    it('handles whitespace around JSON', () => {
        const input = '  \n  {"score": 10}  \n  '
        const result = parseTextResult(input)

        expect(result).toEqual({ score: 10 })
    })

    it('returns null for invalid JSON', () => {
        const result = parseTextResult('not valid json')
        expect(result).toBeNull()
    })

    it('returns null for empty string', () => {
        const result = parseTextResult('')
        expect(result).toBeNull()
    })

    it('handles nested JSON objects', () => {
        const input = '{"score": 7, "meta": {"source": "dify", "model": "deepseek"}}'
        const result = parseTextResult(input)

        expect(result).toEqual({
            score: 7,
            meta: { source: 'dify', model: 'deepseek' },
        })
    })

    it('handles score as string number in JSON', () => {
        const input = '{"score": "9", "your_feeling": "Great"}'
        const result = parseTextResult(input)

        expect(result).toEqual({
            score: '9',
            your_feeling: 'Great',
        })
    })
})
