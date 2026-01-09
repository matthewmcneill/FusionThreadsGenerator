import { describe, it, expect } from 'vitest';
import {
    calculateBA,
    calculateWhitworth,
    calculateME,
    calculateBSC,
    calculateBSB
} from '../src/utils/calculators/index';

describe('Exhaustive Calculator Tests', () => {

    describe('BA Calculator (BS 93)', () => {
        it('should calculate 0 BA accurately', () => {
            const res = calculateBA(0);
            expect(res.basic.major).toBe(6.0);
            expect(res.basic.p).toBe(1.0);
            // Normal Bolt 0-10 BA has 0.025 allowance
            expect(res.classes.Normal.external.major).toBe(5.975);
        });

        it('should calculate 10 BA accurately', () => {
            const res = calculateBA(10);
            expect(res.basic.major).toBe(1.7);
            expect(res.basic.p).toBe(0.35);
            expect(res.classes.Normal.external.major).toBe(1.675);
        });

        it('should calculate 12 BA accurately (no allowance)', () => {
            const res = calculateBA(12);
            expect(res.basic.major).toBe(1.3);
            // 12 BA > 10 BA, so no allowance
            expect(res.classes.Normal.external.major).toBe(1.3);
        });
    });

    describe('Whitworth Calculator (BS 84)', () => {
        it('should calculate 1/4 BSW accurately', () => {
            const res = calculateWhitworth(0.25, 20, ['Imperial']);
            expect(res.basic.major).toBe(0.25);
            expect(res.basic.p).toBe(0.05);
            expect(res.classes.Medium.external.major).toBe(0.25);
        });

        it('should calculate 1/2 BSF accurately', () => {
            const res = calculateWhitworth(0.5, 16, ['Imperial']);
            expect(res.basic.major).toBe(0.5);
            expect(res.basic.tpi).toBe(undefined); // tpi is not in basic result
            expect(res.basic.p).toBe(0.0625);
        });
    });

    describe('ME (Model Engineer) Calculator', () => {
        it('should calculate 1/4" 40 TPI ME accurately', () => {
            const res = calculateME(0.25, 40, ['Metric']);
            expect(res.basic.major).toBe(0.25);
            expect(res.basic.p).toBe(0.025);
            expect(res.classes.Medium).toBeDefined();
        });
    });

    describe('BSC (Cycle) Calculator', () => {
        it('should calculate 1/4" 26 TPI BSC accurately', () => {
            const res = calculateBSC(0.25, 26, ['Metric']);
            expect(res.basic.major).toBe(0.25);
            expect(res.basic.p).toBe(0.038462);
        });
    });

    describe('BSB (Brass) Calculator', () => {
        it('should calculate 1/4" BSB (26 TPI constant) accurately', () => {
            const res = calculateBSB(0.25, 26, ['Metric']);
            expect(res.basic.major).toBe(0.25);
            expect(res.basic.p).toBe(0.038462);
        });
    });

});
