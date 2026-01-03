import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

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

    it('renders the initial configuration tab by default', () => {
        render(<App />);
        // The Download XML button text changes based on thread count, e.g., "Download XML (32)"
        expect(screen.getByText(/Download XML/i)).toBeInTheDocument();
        expect(screen.getByText(/Refine Configuration/i)).toBeInTheDocument();
    });
});
