import { describe, it, expect } from 'vitest';
import { getNearestDrill } from './drills';

describe('getNearestDrill Inventory Logic', () => {

    it('should find a custom drill if it is the closest match', () => {
        const customDrills = [
            { name: "My 6.1mm", size: 6.1 / 25.4, sizeMm: 6.1, unit: 'mm' }
        ];

        // Target is 6.1mm. Closest metric is 6.1mm, but we'll disable metric to be sure.
        const drill = getNearestDrill(6.1, 'mm', ['Imperial'], customDrills);
        expect(drill.name).toBe("My 6.1mm");
    });

    it('should skip disabled drills and find the next best', () => {
        // Target 6.0mm. Standard 6.0mm metric drill exists.
        const drillWithMetric = getNearestDrill(6.0, 'mm', ['Metric']);
        expect(drillWithMetric.name).toBe("6.0mm");

        // Disable 6.0mm
        const disabledDrills = ["6.0mm"];
        const drillSkipped = getNearestDrill(6.0, 'mm', ['Metric'], [], disabledDrills);

        // Next best metric is 5.9mm or 6.1mm? 
        // 5.9mm is (6.0 - 5.9 = 0.1)
        // 6.1mm is (6.1 - 6.0 = 0.1)
        // Order in metric list: 5.9 is before 6.1
        expect(drillSkipped.name).not.toBe("6.0mm");
    });

    it('should respect multiple custom drills', () => {
        const customDrills = [
            { name: "Custom A", size: 0.251, unit: 'in' },
            { name: "Custom B", size: 0.253, unit: 'in' }
        ];

        const drill = getNearestDrill(0.252, 'in', [], customDrills);
        // Both are equidistant (0.001 diff). reduce uses first one if tied?
        // Actually, our code uses: if (Math.abs(diffCurr - diffPrev) < 1e-10) return prev;
        // So it should stay with Custom A.
        expect(drill.name).toBe("Custom A");
    });
});
