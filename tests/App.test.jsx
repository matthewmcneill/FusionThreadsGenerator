import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../src/App';

describe('App Component', () => {
    it('renders the application title', () => {
        render(<App />);
        expect(screen.getByRole('heading', { level: 1, name: /Fusion 360 Thread Generator/i })).toBeInTheDocument();
    });

    it('renders the standard selection dropdown', () => {
        render(<App />);
        // Find the select element specifically
        const standardSelect = screen.getByRole('combobox', { name: /Select Standard/i });
        expect(standardSelect).toBeInTheDocument();
        expect(standardSelect).toHaveValue('WHITWORTH');
    });

    it('renders the project preview tab by default', () => {
        render(<App />);
        // The Download XML button text changes based on thread count
        expect(screen.getByText(/Download XML/i)).toBeInTheDocument();
        expect(screen.getByText(/Project Preview/i)).toBeInTheDocument();
        // Stage 2 (Refine Configuration) is visible in preview tab now
        expect(screen.getByText(/Refine Configuration/i)).toBeInTheDocument();
    });
});
