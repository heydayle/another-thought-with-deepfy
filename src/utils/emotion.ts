/**
 * Get emotion color CSS variable based on score (1-10)
 */
export const getEmotionColor = (score: string | number): string => {
    const numScore = typeof score === 'string' ? parseInt(score) : score;

    if (numScore <= 2) return 'var(--color-emotion-very-low)';    // Red
    if (numScore <= 4) return 'var(--color-emotion-low)';         // Yellow/Orange
    if (numScore <= 6) return 'var(--color-emotion-neutral)';     // Green
    if (numScore <= 8) return 'var(--color-emotion-high)';        // Teal
    return 'var(--color-emotion-very-high)';                      // Dark Green/Teal
};

/**
 * Get Tailwind color class based on score (1-10)
 */
export const getEmotionColorClass = (score: string | number): string => {
    const numScore = typeof score === 'string' ? parseInt(score) : score;

    if (numScore <= 2) return '[color:var(--color-emotion-very-low)]';
    if (numScore <= 4) return '[color:var(--color-emotion-low)]';
    if (numScore <= 6) return '[color:var(--color-emotion-neutral)]';
    if (numScore <= 8) return '[color:var(--color-emotion-high)]';
    return '[color:var(--color-emotion-very-high)]';
};
