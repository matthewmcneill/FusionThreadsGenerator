import { describe, it, expect } from 'vitest';
import { calculateTurningData } from '../src/utils/externalThreadGeometry';
import { calculateWhitworth } from '../src/utils/calculators/whitworth';
import { calculateBA } from '../src/utils/calculators/ba';

describe('External Thread Geometry', () => {
    it('should calculate turning data for 55 degree Whitworth', () => {
        // Example: 1/4" BSW, 20 TPI, p=0.05, h=0.032016
        const angle = 55;
        const pitch = 0.05;
        const radialDepth = 0.032016;
        const majorDia = 0.25;

        const result = calculateTurningData(angle, pitch, radialDepth, majorDia);

        expect(result).toBeDefined();
        // Turn Dia = Major - 0.1 * Pitch = 0.25 - 0.005 = 0.245
        expect(result.turnDia).toBeCloseTo(0.245, 6);
        // Compound Angle = floor((55/2 - 0.5) * 2) / 2 = floor(27) = 27
        expect(result.compoundAngle).toBe(27);
        // Compound Depth = h / cos(27) = 0.032016 / 0.891006 = 0.035932
        expect(result.compoundDepth).toBeCloseTo(0.0359321, 6);
    });

    it('should calculate turning data for 47.5 degree BA', () => {
        // Example: 0 BA, p=1.0, h=0.6, D=6.0
        const angle = 47.5;
        const pitch = 1.0;
        const h = 0.6;
        const D = 6.0;

        const result = calculateTurningData(angle, pitch, h, D);

        expect(result).toBeDefined();
        // Turn Dia = 6.0 - 0.1 * 1.0 = 5.9
        expect(result.turnDia).toBeCloseTo(5.9, 6);
        // Compound Angle = floor((47.5/2 - 0.5) * 2) / 2 = floor(23.25 * 2) / 2 = 23
        expect(result.compoundAngle).toBe(23);
        // Compound Depth = 0.6 / cos(23) = 0.6 / 0.920504 = 0.651816
        expect(result.compoundDepth).toBeCloseTo(0.651816, 6);
    });

    it('should integrate turning data into Whitworth calculator', () => {
        const result = calculateWhitworth(0.25, 20); // 1/4 BSW
        expect(result.basic.turning).toBeDefined();
        expect(result.basic.turning.turnDia).toBeCloseTo(0.245, 4);
    });

    it('should integrate turning data into BA calculator', () => {
        const result = calculateBA(0); // 0 BA
        expect(result.basic.turning).toBeDefined();
        expect(result.basic.turning.turnDia).toBeCloseTo(5.9, 4);
    });
});
