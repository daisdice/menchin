/**
 * Mahjong Logic for Chinitsu Quiz
 */

const Mahjong = {
    // Generate a random 13-tile Chinitsu hand (Manzu 1-9)
    // Returns an array of integers [1, 1, 2, ...] sorted
    generateChinitsuHand: function() {
        // Create a pool of tiles: 4 of each 1-9
        let pool = [];
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
        let hand = pool.slice(0, 13).sort((a, b) => a - b);
        
        // Ensure the hand is Tenpai (has at least one wait)
        // If not, regenerate (simple approach, usually fast enough)
        if (this.getWaits(hand).length === 0) {
            return this.generateChinitsuHand();
        }

        return hand;
    },

    // Calculate waiting tiles for a 13-tile hand
    // Returns array of valid winning tiles [1, 4, 7]
    getWaits: function(hand) {
        let waits = [];
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
    canWin: function(hand) {
        let counts = new Array(10).fill(0);
        for (let tile of hand) {
            counts[tile]++;
        }

        // Check Chiitoitsu (7 pairs)
        if (this.isChiitoitsu(counts)) return true;

        // Check Standard Win (4 sets + 1 pair)
        return this.isStandardWin(counts);
    },

    isChiitoitsu: function(counts) {
        let pairs = 0;
        for (let i = 1; i <= 9; i++) {
            if (counts[i] === 2) pairs++;
            else if (counts[i] !== 0) return false;
        }
        return pairs === 7;
    },

    isStandardWin: function(counts) {
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
    decomposeSets: function(counts, setsFound) {
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
        if (i <= 7 && counts[i] > 0 && counts[i+1] > 0 && counts[i+2] > 0) {
            counts[i]--;
            counts[i+1]--;
            counts[i+2]--;
            if (this.decomposeSets(counts, setsFound + 1)) return true;
            counts[i]++;
            counts[i+1]++;
            counts[i+2]++; // Backtrack
        }

        return false;
    }
};
