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
        const MAX_ATTEMPTS = 200; // Increased attempts for harder constraints

        do {
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

            // Take 13 tiles
            hand = pool.slice(0, 13).sort((a, b) => a - b);
            waits = this.getWaits(hand);
            attempts++;

            // Check constraints
            let isValid = true;

            // Must be tenpai (ready to win)
            if (waits.length === 0) isValid = false;

            // Check wait count constraints
            if (isValid) {
                if (options.exactWaits !== undefined && waits.length !== options.exactWaits) isValid = false;
                if (options.minWaits !== undefined && waits.length < options.minWaits) isValid = false;
                if (options.maxWaits !== undefined && waits.length > options.maxWaits) isValid = false;
            }

            if (isValid) return hand;

        } while (attempts < MAX_ATTEMPTS);

        // Fallback if constraints are too hard (return any tenpai hand)
        console.warn("Could not generate hand meeting constraints, returning random tenpai");
        // Recursive call without options as fallback, but prevent infinite recursion by checking options
        if (Object.keys(options).length > 0) {
            return this.generateChinitsuHand({});
        }
        return hand!; // Should theoretically be unreachable if fallback works, but for TS safety
    },

    // Calculate waiting tiles for a 13-tile hand
    // Returns array of valid winning tiles [1, 4, 7]
    getWaits: function (hand: Hand): Tile[] {
        let waits: Tile[] = [];
        // Check every possible tile 1-9
        for (let tile = 1; tile <= 9; tile++) {
            // Check if adding this tile makes a winning hand
            // First, check if we have more than 4 of this tile (impossible)
            let count = hand.filter(t => t === tile).length;
            if (count >= 4) continue;

            let newHand = [...hand, tile].sort((a, b) => a - b);
            if (this.canWin(newHand)) {
                waits.push(tile);
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
