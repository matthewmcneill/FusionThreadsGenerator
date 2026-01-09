import { describe, it, expect } from 'vitest';
import { getNearestDrill, validateTapDrill } from '../src/utils/drills';

describe('Complex Drill Selection & Validation', () => {

    describe('Inventory Filtering (getNearestDrill)', () => {
        it('should only select from Metric set when specifically requested', () => {
            // Target 0.257" (F drill)
            const target = 0.257;
            const res = getNearestDrill(target, 'in', ['Metric']);
            // Nearest metric is 6.5mm (0.2559") or 6.6mm (0.2598")
            expect(res.name).toMatch(/mm/);
            expect(res.name).not.toBe("F");
        });

        it('should strictly exclude disabled drills', () => {
            const target = 0.257; // F drill
            const res = getNearestDrill(target, 'in', ['Letter'], [], ["F"]);
            // Letter drills: E (0.250), G (0.261). G is closer to 0.257
            expect(res.name).toBe("G");
        });

        it('should prefer custom drills if they are a better fit', () => {
            const target = 0.2571; // Slightly off F (0.257)
            const custom = [{ name: "Perfect Fit", size: 0.2571, unit: "in" }];
            const res = getNearestDrill(target, 'in', ['Letter'], custom);
            expect(res.name).toBe("Perfect Fit");
        });
    });

    describe('Material-Specific Validation (validateTapDrill)', () => {
        const major = 0.25;
        const minor = 0.1856; // 1/4 BSW
        const nutMinorMax = 0.2046;

        it('should target 60% PTE for hard materials', () => {
            const res = validateTapDrill(0.21, major, minor, nutMinorMax, 'hard');
            expect(res.target).toBe(60);
        });

        it('should target 80% PTE for soft materials', () => {
            const res = validateTapDrill(0.21, major, minor, nutMinorMax, 'soft');
            expect(res.target).toBe(80);
        });

        it('should return catastrophic-large if drill >= major', () => {
            const res = validateTapDrill(0.26, major, minor, nutMinorMax);
            expect(res.status).toBe('catastrophic-large');
        });

        it('should return catastrophic-small if drill <= minor', () => {
            const res = validateTapDrill(0.18, major, minor, nutMinorMax);
            expect(res.status).toBe('catastrophic-small');
        });
    });

    describe('Historical Regression', () => {
        it('should correctly handle Whitworth when restricted to metric only (Regression)', () => {
            // 1/4 BSW target decimal is approx 0.1996 for 70% PTE
            const targetDecimal = 0.1996;
            const res = getNearestDrill(targetDecimal, 'in', ['Metric']);
            // 5.0mm = 0.1968, 5.1mm = 0.2007. 5.1mm is closer.
            expect(res.name).toBe("5.1mm");
        });
    });

});
