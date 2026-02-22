// --- Emoji SVG assets ---
import beamingWithSmiling from '@/assets/svgs/beaming_with_smiling.svg';
import crying from '@/assets/svgs/crying.svg';
import emptyDaisy from '@/assets/svgs/empty_daisy.svg';
import flushed from '@/assets/svgs/flushed.svg';
import loudlyCrying from '@/assets/svgs/loudly_crying.svg';
import neutral from '@/assets/svgs/neutral.svg';
import pleading from '@/assets/svgs/pleading.svg';
import slightlySmiling from '@/assets/svgs/slightly_smiling.svg';
import smiling from '@/assets/svgs/smiling.svg';
import smilingWithHearts from '@/assets/svgs/smiling_with_hearts.svg';
import starStruck from '@/assets/svgs/star_struck.svg';

// --- Emoji constants ---

/** All available emoji SVG paths, keyed by their descriptive name. */
export const EMOJI_IMAGES = {
    beamingWithSmiling,
    crying,
    emptyDaisy,
    flushed,
    loudlyCrying,
    neutral,
    pleading,
    slightlySmiling,
    smiling,
    smilingWithHearts,
    starStruck,
} as const;

export type EmojiKey = keyof typeof EMOJI_IMAGES;

// --- Score → Emoji mapping (1–10) ---

/**
 * Maps an emotion score (1–10) to a descriptive label and its corresponding
 * emoji SVG path.
 *
 * Score scale:
 *  1  – Loudly crying  (very devastated)
 *  2  – Crying         (very sad)
 *  3  – Pleading       (sad / upset)
 *  4  – Flushed        (anxious / overwhelmed)
 *  5  – Neutral        (indifferent)
 *  6  – Empty daisy    (calm / okay)
 *  7  – Slightly smiling (mildly happy)
 *  8  – Smiling        (happy)
 *  9  – Beaming with smiling (very happy)
 *  10 – Star-struck    (ecstatic / amazing)
 */
export interface EmotionEmoji {
    label: string;
    image: string;
}

export const SCORE_TO_EMOTION: Record<number, EmotionEmoji> = {
    1: { label: 'Loudly Crying', image: loudlyCrying },
    2: { label: 'Crying', image: crying },
    3: { label: 'Pleading', image: pleading },
    4: { label: 'Flushed', image: flushed },
    5: { label: 'Neutral', image: neutral },
    6: { label: 'Empty Daisy', image: emptyDaisy },
    7: { label: 'Slightly Smiling', image: slightlySmiling },
    8: { label: 'Smiling', image: smiling },
    9: { label: 'Beaming', image: beamingWithSmiling },
    10: { label: 'Star Struck', image: starStruck },
};

/**
 * Returns the `EmotionEmoji` object for a given score.
 * Falls back to the `emptyDaisy` SVG when the score is out of range.
 */
export function getEmotionEmoji(score: string | number): EmotionEmoji {
    const numScore = typeof score === 'string' ? parseInt(score, 10) : score;
    return SCORE_TO_EMOTION[numScore] ?? { label: 'Unknown', image: emptyDaisy };
}
