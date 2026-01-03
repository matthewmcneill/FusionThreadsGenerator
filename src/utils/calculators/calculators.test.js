import { describe, it, expect } from 'vitest';
import { calculateBA } from './ba';

describe('BA Calculator', () => {
    it('should calculate 0 BA correctly', () => {
        const result = calculateBA(0);
        expect(result).toBeDefined();
        expect(result.basic.major).toBe(6.00);
        expect(result.basic.p).toBe(1.00);
        expect(result.basic.h).toBe(0.60);

        // Check Normal class Bolt
        expect(result.classes.Normal.external.major).toBe(5.975); // 6.00 - 0.025 allowance

        // Check standard Nut
        expect(result.classes.Normal.internal.major).toBe(6.00);
        expect(result.classes.Normal.internal.minor).toBe(4.80);
    });

    it('should calculate 2 BA correctly', () => {
        const result = calculateBA(2);
        expect(result).toBeDefined();
        expect(result.basic.major).toBe(4.70);
        expect(result.basic.p).toBe(0.81);

        // 2 BA is <= 10, so it should have Close class
        expect(result.classes.Close).toBeDefined();
        expect(result.classes.Normal).toBeDefined();
    });

    it('should return null for invalid size', () => {
        expect(calculateBA(99)).toBeNull();
    });
});
