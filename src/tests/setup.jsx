import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock react-chartjs-2
vi.mock('react-chartjs-2', () => ({
    Bar: () => <div data-testid="mock-bar-chart" />,
    Line: () => <div data-testid="mock-line-chart" />,
}));

// Mock chart.js
vi.mock('chart.js', () => ({
    Chart: {
        register: vi.fn(),
    },
    CategoryScale: vi.fn(),
    LinearScale: vi.fn(),
    PointElement: vi.fn(),
    LineElement: vi.fn(),
    BarElement: vi.fn(),
    Title: vi.fn(),
    Tooltip: vi.fn(),
    Legend: vi.fn(),
}));
