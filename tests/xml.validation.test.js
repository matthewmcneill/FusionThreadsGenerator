import { describe, it, expect } from 'vitest';
import { generateFusionXML } from '../src/utils/xmlGenerator';
import { WhitworthStandard, calculateWhitworth } from '../src/utils/calculators/index';

describe('XML Generation Validation', () => {

    it('should generate valid XML structure with metadata', () => {
        const threads = [
            {
                ...calculateWhitworth(0.25, 20, ['Imperial']),
                size: 0.25,
                tpi: 20,
                designation: '1/4 BSW',
                series: 'BSW',
                ctd: '1/4 - 20 BSW'
            }
        ];
        const xml = generateFusionXML(WhitworthStandard, threads, ['Medium'], { version: '0.3.2', commitHash: 'abc1234' });

        expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
        expect(xml).toContain('<ThreadType>');
        expect(xml).toContain('Version: 0.3.2');
        expect(xml).toContain('Version: 0.3.2 (abc1234)');
    });

    it('should group multiple designations under the same ThreadSize', () => {
        // Mock two threads with the same size (0.25) but different designations
        const threads = [
            {
                designation: '1/4 BSW',
                series: 'BSW',
                size: 0.25,
                ctd: '1/4 BSW CTD',
                tpi: 20,
                basic: { major: 0.25, p: 0.05 },
                classes: { Medium: { external: { major: 0.25, pitch: 0.24, minor: 0.23 }, internal: { major: 0.25, pitch: 0.24, minor: 0.23 } } }
            },
            {
                designation: '1/4 BSF',
                series: 'BSF',
                size: 0.25,
                ctd: '1/4 BSF CTD',
                tpi: 26,
                basic: { major: 0.25, p: 0.038 },
                classes: { Medium: { external: { major: 0.25, pitch: 0.245, minor: 0.24 }, internal: { major: 0.25, pitch: 0.245, minor: 0.24 } } }
            }
        ];

        const xml = generateFusionXML(WhitworthStandard, threads, ['Medium']);

        const sizeOccurrences = (xml.match(/<Size>0.25<\/Size>/g) || []).length;
        expect(sizeOccurrences).toBe(1);

        // Correct tag names: <ThreadDesignation>
        expect(xml).toContain('<ThreadDesignation>1/4 BSW</ThreadDesignation>');
        expect(xml).toContain('<ThreadDesignation>1/4 BSF</ThreadDesignation>');
    });

});
