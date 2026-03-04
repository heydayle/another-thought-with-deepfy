import { describe, it, expect, beforeEach } from 'vitest'
import {
    goalsService,
    CATEGORY_CONFIG,
    STATUS_CONFIG,
    type GoalCategory,
    type GoalStatus,
} from '@/services/goals'

describe('goalsService', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear()
    })

    describe('getAll', () => {
        it('returns empty array when no goals exist', () => {
            expect(goalsService.getAll()).toEqual([])
        })

        it('returns saved goals', () => {
            goalsService.add({ title: 'Test', description: '', category: 'health', target: 10, current: 0, unit: 'days' })
            const goals = goalsService.getAll()
            expect(goals).toHaveLength(1)
            expect(goals[0].title).toBe('Test')
        })
    })

    describe('add', () => {
        it('creates a goal with correct properties', () => {
            const goal = goalsService.add({
                title: 'Meditate daily',
                description: 'Practice mindfulness',
                category: 'mindfulness',
                target: 30,
                current: 0,
                unit: 'days',
            })

            expect(goal.id).toBeDefined()
            expect(goal.title).toBe('Meditate daily')
            expect(goal.description).toBe('Practice mindfulness')
            expect(goal.category).toBe('mindfulness')
            expect(goal.target).toBe(30)
            expect(goal.current).toBe(0)
            expect(goal.unit).toBe('days')
            expect(goal.status).toBe('not_started')
            expect(goal.progress).toBe(0)
            expect(goal.createdAt).toBeDefined()
            expect(goal.updatedAt).toBeDefined()
        })

        it('sets status to in_progress when current > 0', () => {
            const goal = goalsService.add({
                title: 'Running',
                description: '',
                category: 'fitness',
                target: 20,
                current: 5,
                unit: 'km',
            })

            expect(goal.status).toBe('in_progress')
            expect(goal.progress).toBe(25) // 5/20 * 100
        })

        it('calculates progress correctly', () => {
            const goal = goalsService.add({
                title: 'Read',
                description: '',
                category: 'learning',
                target: 100,
                current: 33,
                unit: 'pages',
            })

            expect(goal.progress).toBe(33) // Math.round(33/100 * 100)
        })

        it('persists to localStorage', () => {
            goalsService.add({ title: 'Goal 1', description: '', category: 'health', target: 10, current: 0, unit: 'days' })
            goalsService.add({ title: 'Goal 2', description: '', category: 'fitness', target: 5, current: 0, unit: 'sessions' })

            const raw = localStorage.getItem('deepfy-goals')
            expect(raw).not.toBeNull()

            const parsed = JSON.parse(raw!)
            expect(parsed).toHaveLength(2)
        })

        it('generates unique IDs for each goal', () => {
            const goal1 = goalsService.add({ title: 'A', description: '', category: 'health', target: 1, current: 0, unit: 'days' })
            const goal2 = goalsService.add({ title: 'B', description: '', category: 'health', target: 1, current: 0, unit: 'days' })

            expect(goal1.id).not.toBe(goal2.id)
        })
    })

    describe('update', () => {
        it('updates goal properties', () => {
            const goal = goalsService.add({ title: 'Old Title', description: '', category: 'health', target: 10, current: 0, unit: 'days' })
            const updated = goalsService.update(goal.id, { title: 'New Title', description: 'New desc' })

            expect(updated).not.toBeNull()
            expect(updated!.title).toBe('New Title')
            expect(updated!.description).toBe('New desc')
        })

        it('recalculates progress on update', () => {
            const goal = goalsService.add({ title: 'Test', description: '', category: 'health', target: 10, current: 0, unit: 'days' })
            const updated = goalsService.update(goal.id, { current: 7 })

            expect(updated!.progress).toBe(70)
            expect(updated!.status).toBe('in_progress')
        })

        it('marks as completed when current reaches target', () => {
            const goal = goalsService.add({ title: 'Test', description: '', category: 'health', target: 10, current: 0, unit: 'days' })
            const updated = goalsService.update(goal.id, { current: 10 })

            expect(updated!.progress).toBe(100)
            expect(updated!.status).toBe('completed')
        })

        it('returns null for non-existent goal', () => {
            const result = goalsService.update('non-existent-id', { title: 'Test' })
            expect(result).toBeNull()
        })

        it('updates the updatedAt timestamp', () => {
            const goal = goalsService.add({ title: 'Test', description: '', category: 'health', target: 10, current: 0, unit: 'days' })

            // Small delay to ensure different timestamp
            const updated = goalsService.update(goal.id, { title: 'Updated' })
            expect(updated!.updatedAt).toBeDefined()
        })

        it('caps progress at 100%', () => {
            const goal = goalsService.add({ title: 'Test', description: '', category: 'health', target: 10, current: 0, unit: 'days' })
            const updated = goalsService.update(goal.id, { current: 15 })

            expect(updated!.progress).toBe(100)
        })
    })

    describe('incrementProgress', () => {
        it('increments current by 1 by default', () => {
            const goal = goalsService.add({ title: 'Test', description: '', category: 'health', target: 10, current: 3, unit: 'days' })
            const updated = goalsService.incrementProgress(goal.id)

            expect(updated!.current).toBe(4)
            expect(updated!.status).toBe('in_progress')
        })

        it('increments by custom amount', () => {
            const goal = goalsService.add({ title: 'Test', description: '', category: 'health', target: 100, current: 10, unit: 'pages' })
            const updated = goalsService.incrementProgress(goal.id, 20)

            expect(updated!.current).toBe(30)
            expect(updated!.progress).toBe(30)
        })

        it('does not exceed target', () => {
            const goal = goalsService.add({ title: 'Test', description: '', category: 'health', target: 5, current: 4, unit: 'days' })
            const updated = goalsService.incrementProgress(goal.id, 3)

            expect(updated!.current).toBe(5)
            expect(updated!.progress).toBe(100)
            expect(updated!.status).toBe('completed')
        })

        it('returns null for non-existent goal', () => {
            const result = goalsService.incrementProgress('non-existent-id')
            expect(result).toBeNull()
        })

        it('auto-completes when reaching target', () => {
            const goal = goalsService.add({ title: 'Test', description: '', category: 'health', target: 3, current: 2, unit: 'days' })
            const updated = goalsService.incrementProgress(goal.id)

            expect(updated!.current).toBe(3)
            expect(updated!.status).toBe('completed')
            expect(updated!.progress).toBe(100)
        })
    })

    describe('delete', () => {
        it('removes a goal', () => {
            const goal = goalsService.add({ title: 'To Delete', description: '', category: 'health', target: 10, current: 0, unit: 'days' })
            expect(goalsService.getAll()).toHaveLength(1)

            const result = goalsService.delete(goal.id)
            expect(result).toBe(true)
            expect(goalsService.getAll()).toHaveLength(0)
        })

        it('returns false for non-existent goal', () => {
            const result = goalsService.delete('non-existent-id')
            expect(result).toBe(false)
        })

        it('only removes the specified goal', () => {
            goalsService.add({ title: 'Keep', description: '', category: 'health', target: 10, current: 0, unit: 'days' })
            goalsService.add({ title: 'Delete', description: '', category: 'fitness', target: 5, current: 0, unit: 'sessions' })
            expect(goalsService.getAll()).toHaveLength(2)

            goalsService.delete(goalsService.getAll()[1].id)
            const remaining = goalsService.getAll()

            expect(remaining).toHaveLength(1)
            expect(remaining[0].title).toBe('Keep')
        })
    })

    describe('toggleComplete', () => {
        it('completes an in-progress goal', () => {
            const goal = goalsService.add({ title: 'Test', description: '', category: 'health', target: 10, current: 5, unit: 'days' })
            const toggled = goalsService.toggleComplete(goal.id)

            expect(toggled!.status).toBe('completed')
            expect(toggled!.current).toBe(10)
            expect(toggled!.progress).toBe(100)
        })

        it('uncompletes a completed goal', () => {
            const goal = goalsService.add({ title: 'Test', description: '', category: 'health', target: 10, current: 10, unit: 'days' })
            // First complete it
            goalsService.toggleComplete(goal.id)
            // Then uncomplete it
            const toggled = goalsService.toggleComplete(goal.id)

            expect(toggled!.status).toBe('in_progress')
            expect(toggled!.current).toBeLessThan(10)
        })

        it('returns null for non-existent goal', () => {
            const result = goalsService.toggleComplete('non-existent-id')
            expect(result).toBeNull()
        })
    })
})

describe('CATEGORY_CONFIG', () => {
    it('has all 6 categories', () => {
        const categories: GoalCategory[] = ['health', 'mindfulness', 'fitness', 'learning', 'social', 'other']
        categories.forEach((cat) => {
            expect(CATEGORY_CONFIG[cat]).toBeDefined()
            expect(CATEGORY_CONFIG[cat].label).toBeTruthy()
            expect(CATEGORY_CONFIG[cat].color).toBeTruthy()
            expect(CATEGORY_CONFIG[cat].emoji).toBeTruthy()
        })
    })
})

describe('STATUS_CONFIG', () => {
    it('has all 3 statuses', () => {
        const statuses: GoalStatus[] = ['not_started', 'in_progress', 'completed']
        statuses.forEach((status) => {
            expect(STATUS_CONFIG[status]).toBeDefined()
            expect(STATUS_CONFIG[status].label).toBeTruthy()
            expect(STATUS_CONFIG[status].color).toBeTruthy()
        })
    })
})
