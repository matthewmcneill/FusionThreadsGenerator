import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WorkshopManager from '../src/components/WorkshopManager';

describe('WorkshopManager Component', () => {
    const mockConfig = {
        workshop: {
            enabledStandards: ['WHITWORTH', 'BA'],
            enabledDrillSets: ['Metric'],
            customDrills: [
                { name: 'Test Drill', size: 0.25, sizeMm: 6.35, unit: 'in', type: 'custom' }
            ],
            disabledDesignations: {},
            customDesignations: {}
        }
    };

    const mockStd = { id: 'WHITWORTH', name: 'BSW', unit: 'in' };
    const mockOnUpdateConfig = vi.fn();
    const mockOnClose = vi.fn();

    it('should not render when isOpen is false', () => {
        const { container } = render(
            <WorkshopManager
                isOpen={false}
                onClose={mockOnClose}
                config={mockConfig}
                onUpdateConfig={mockOnUpdateConfig}
                currentStandard={mockStd}
            />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it('should render the standards tab by default', () => {
        render(
            <WorkshopManager
                isOpen={true}
                onClose={mockOnClose}
                config={mockConfig}
                onUpdateConfig={mockOnUpdateConfig}
                currentStandard={mockStd}
            />
        );
        expect(screen.getByRole('button', { name: /Standards/i })).toBeInTheDocument();
        expect(screen.getByText(/Enabled Thread Standards/i)).toBeInTheDocument();
    });

    it('should switch to standards tab and show standards', () => {
        render(
            <WorkshopManager
                isOpen={true}
                onClose={mockOnClose}
                config={mockConfig}
                onUpdateConfig={mockOnUpdateConfig}
                currentStandard={mockStd}
            />
        );

        const standardsTab = screen.getByRole('button', { name: /Standards/i });
        fireEvent.click(standardsTab);

        expect(screen.getByText(/British Standard Whitworth/i)).toBeInTheDocument();
        expect(screen.getByText(/British Association \(BA\)/i)).toBeInTheDocument();
    });

    it('should switch to tools tab and allow adding a custom drill', () => {
        render(
            <WorkshopManager
                isOpen={true}
                onClose={mockOnClose}
                config={mockConfig}
                onUpdateConfig={mockOnUpdateConfig}
                currentStandard={mockStd}
            />
        );

        const toolsTab = screen.getByRole('button', { name: /Drills/i });
        fireEvent.click(toolsTab);

        const nameInput = screen.getByPlaceholderText(/e.g. #7 Jobber/i);
        const sizeInput = screen.getByPlaceholderText(/5.0/i);
        const addButton = screen.getByText(/Add Custom/i);

        fireEvent.change(nameInput, { target: { value: 'New Custom' } });
        fireEvent.change(sizeInput, { target: { value: '5.0' } });
        fireEvent.click(addButton);

        expect(mockOnUpdateConfig).toHaveBeenCalledWith('workshop', expect.objectContaining({
            customDrills: expect.arrayContaining([
                expect.objectContaining({ name: 'New Custom', sizeMm: 5.0 })
            ])
        }));
    });

    it('should allow toggling a preset in curation tab', () => {
        render(
            <WorkshopManager
                isOpen={true}
                onClose={mockOnClose}
                config={mockConfig}
                onUpdateConfig={mockOnUpdateConfig}
                currentStandard={mockStd}
            />
        );

        // Switch to Curation tab first
        const curationTab = screen.getByRole('button', { name: /Curation/i });
        fireEvent.click(curationTab);

        // Standard is WHITWORTH by default in editingStandardId
        // Find a preset checkbox. There are many in the table.
        const checkboxes = screen.getAllByRole('checkbox');
        // Index 0 might be one of the enabled standards buttons if we aren't careful, 
        // but in Curation tab it should be the table checkboxes.
        fireEvent.click(checkboxes[0]);

        expect(mockOnUpdateConfig).toHaveBeenCalledWith('workshop', expect.objectContaining({
            disabledDesignations: expect.any(Object)
        }));
    });

    it('should allow bulk toggling drills in the tools tab', () => {
        render(
            <WorkshopManager
                isOpen={true}
                onClose={mockOnClose}
                config={mockConfig}
                onUpdateConfig={mockOnUpdateConfig}
                currentStandard={mockStd}
            />
        );

        const toolsTab = screen.getByRole('button', { name: /Drills/i });
        fireEvent.click(toolsTab);

        const editButton = screen.getByText(/Edit Individual Drills/i);
        fireEvent.click(editButton);

        const clearAllButton = screen.getByText(/Clear All Metric/i);
        fireEvent.click(clearAllButton);

        expect(mockOnUpdateConfig).toHaveBeenCalledWith('workshop', expect.objectContaining({
            disabledDrills: expect.any(Array)
        }));
    });

    it('should reset to standards tab when reopened', () => {
        const { rerender } = render(
            <WorkshopManager
                isOpen={true}
                onClose={mockOnClose}
                config={mockConfig}
                onUpdateConfig={mockOnUpdateConfig}
                currentStandard={mockStd}
            />
        );

        // Switch to Curation tab
        const curationTab = screen.getByRole('button', { name: /Curation/i });
        fireEvent.click(curationTab);
        expect(screen.getByText(/Active Standard to Edit/i)).toBeInTheDocument();

        // Close it
        rerender(
            <WorkshopManager
                isOpen={false}
                onClose={mockOnClose}
                config={mockConfig}
                onUpdateConfig={mockOnUpdateConfig}
                currentStandard={mockStd}
            />
        );

        // Open it again
        rerender(
            <WorkshopManager
                isOpen={true}
                onClose={mockOnClose}
                config={mockConfig}
                onUpdateConfig={mockOnUpdateConfig}
                currentStandard={mockStd}
            />
        );

        // Should be back on Standards tab
        expect(screen.getByText(/Enabled Thread Standards/i)).toBeInTheDocument();
        expect(screen.queryByText(/Active Standard to Edit/i)).not.toBeInTheDocument();
    });

});
