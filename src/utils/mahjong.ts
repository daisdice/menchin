/**
 * Mahjong Logic for Chinitsu Quiz
 */

export type Tile = number; // 1-9 representing Manzu
export type Hand = Tile[];

export interface HandGenerationOptions {
    minWaits?: number;
    maxWaits?: number;
    exactWaits?: number;
}

export const Mahjong = {
    // Generate a random 13-tile Chinitsu hand (Manzu 1-9)
    generateChinitsuHand: function (options: HandGenerationOptions = {}): Hand {
        let hand: Hand;
        let waits: Tile[];
        let attempts = 0;
        const MAX_ATTEMPTS = 500;

        do {
            attempts++;
            // Create a pool of tiles: 4 of each 1-9
            let pool: Tile[] = [];
            for (let i = 1; i <= 9; i++) {
                for (let j = 0; j < 4; j++) {
                    pool.push(i);
                }
            }

            // Shuffle pool
            for (let i = pool.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [pool[i], pool[j]] = [pool[j], pool[i]];
            }

            // Draw 13 tiles
            hand = pool.slice(0, 13).sort((a, b) => a - b);

            // Calculate waits
            waits = this.calculateWaits(hand);

            // Check constraints
            let valid = waits.length > 0; // Must be tenpai (have waits)

            if (valid && options.minWaits !== undefined) {
                valid = waits.length >= options.minWaits;
            }
            if (valid && options.maxWaits !== undefined) {
                valid = waits.length <= options.maxWaits;
            }
            if (valid && options.exactWaits !== undefined) {
                valid = waits.length === options.exactWaits;
            }

            if (valid) {
                return hand;
            }

        } while (attempts < MAX_ATTEMPTS);

        // Fallback if constraints not met (return a simple hand or the last generated one)
        // Ideally we should ensure we always return something valid-ish, 
        // but for now returning the last hand (even if not matching strict constraints) 
        // is better than crashing or infinite loop.
        // However, let's try to force at least one wait if possible.
        if (waits.length === 0) {
            // Fallback: return a known simple tenpai hand if everything failed
            return [1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9];
        }
        return hand;
    },

    // Calculate winning tiles for a 13-tile hand
    calculateWaits: function (hand: Hand): Tile[] {
        let waits: Tile[] = [];
        for (let i = 1; i <= 9; i++) {
            // Try adding tile i
            let tempHand = [...hand, i].sort((a, b) => a - b);
            if (this.canWin(tempHand)) {
                waits.push(i);
            }
        }
        return waits;
    },

    // Check if a 14-tile hand is a winning hand
    canWin: function (hand: Hand): boolean {
        if (hand.length !== 14) return false;

        let counts = new Array(10).fill(0);
        for (let tile of hand) {
            counts[tile]++;
            if (counts[tile] > 4) return false; // Impossible hand
        }

        // Check Chiitoitsu (7 pairs)
        if (this.isChiitoitsu(counts)) return true;

        // Check Standard Win (4 sets + 1 pair)
        return this.isStandardWin(counts);
    },

    isChiitoitsu: function (counts: number[]): boolean {
        let pairs = 0;
        for (let i = 1; i <= 9; i++) {
            if (counts[i] === 2) pairs++;
            else if (counts[i] !== 0) return false;
        }
        return pairs === 7;
    },

    isStandardWin: function (counts: number[]): boolean {
        // Iterate over all possible pairs
        for (let i = 1; i <= 9; i++) {
            if (counts[i] >= 2) {
                // Try to use this as the pair
                let tempCounts = [...counts];
                tempCounts[i] -= 2;

                if (this.decomposeSets(tempCounts, 0)) {
                    return true;
                }
            }
        }
        return false;
    },

    // Recursive function to remove sets (koutsu or shuntsu)
    // remainingSets needed: 4
    decomposeSets: function (counts: number[], setsFound: number): boolean {
        if (setsFound === 4) return true;

        // Find first available tile
        let i = 1;
        while (i <= 9 && counts[i] === 0) i++;

        if (i > 9) return true; // Should be caught by setsFound check, but safe guard

        // Try Koutsu (Triplet)
        if (counts[i] >= 3) {
            counts[i] -= 3;
            if (this.decomposeSets(counts, setsFound + 1)) return true;
            counts[i] += 3; // Backtrack
        }

        // Try Shuntsu (Sequence)
        if (i <= 7 && counts[i] > 0 && counts[i + 1] > 0 && counts[i + 2] > 0) {
            counts[i]--;
            counts[i + 1]--;
            counts[i + 2]--;
            if (this.decomposeSets(counts, setsFound + 1)) return true;
            counts[i]++;
            counts[i + 1]++;
            counts[i + 2]++; // Backtrack
        }

        return false;
    },

    // Calculate score based on difficulty and speed
    calculateScore: function (basePoints: number, timeSpentSeconds: number, combo: number): number {
        let score = basePoints;

        // Fast answer bonus (within 5 seconds)
        if (timeSpentSeconds <= 5) {
            score += 2; // Bonus points
        }

        // Combo bonus
        if (combo > 0) {
            score += Math.min(combo, 5); // Cap combo bonus
        }

        return score;
    }
};
