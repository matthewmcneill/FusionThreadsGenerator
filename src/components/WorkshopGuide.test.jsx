import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import WorkshopGuide from './WorkshopGuide';

describe('WorkshopGuide Component', () => {

    it('renders the introduction and scenario selector', () => {
        render(<WorkshopGuide />);
        expect(screen.getByText(/The Standardization Revolution/i)).toBeInTheDocument();
        expect(screen.getByText(/Scenario Selector/i)).toBeInTheDocument();
        expect(screen.getByText(/Heavy Iron/i)).toBeInTheDocument();
    });

    it('updates detail view when a scenario is selected', () => {
        render(<WorkshopGuide />);
        const scenario = screen.getByText(/Heavy Iron/i);
        fireEvent.click(scenario);

        // BSW is the result for Heavy Iron
        expect(screen.getAllByText(/BSW/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/British Standard Whitworth/i).length).toBeGreaterThan(0);
    });

    it('updates detail view when a standard is selected from navigation', () => {
        render(<WorkshopGuide />);
        const baNav = screen.getByRole('button', { name: /BA 47.5°/i });
        fireEvent.click(baNav);

        expect(screen.getByRole('heading', { level: 2, name: /^BA$/ })).toBeInTheDocument();
        expect(screen.getAllByText(/British Association/i).length).toBeGreaterThan(0);
    });

    it('renders mock charts', () => {
        render(<WorkshopGuide />);
        // Wait for potential render of charts
        const charts = screen.getAllByTestId('mock-bar-chart');
        expect(charts.length).toBeGreaterThan(0);
    });

});
