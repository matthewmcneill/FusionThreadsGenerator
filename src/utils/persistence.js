/**
 * @module utils/persistence
 * @description Manages application state persistence using LocalStorage.
 * Handles schema migration and deep merging with defaults.
 * 
 * @exports
 * - loadConfig: Retrieves and sanitizes the stored configuration.
 * - saveConfig: Persists the configuration object to LocalStorage.
 * - updateConfigSlice: Helper for granular state updates.
 */

/**
 * LocalStorage key used for all application data.
 * @type {string}
 */
const STORAGE_KEY = 'fusion_threads_config';

/**
 * Default application configuration used for initialization and missing keys.
 * Defines the initial enabled standards, drill sets, and user preferences.
 * @type {Object}
 */
const DEFAULTS = {
    workshop: {
        enabledStandards: ['WHITWORTH', 'BA', 'ME', 'BSB', 'BSC'],
        enabledDrillSets: ['Metric', 'Number', 'Letter', 'Imperial'],
        customDrills: [],
        disabledDesignations: {}, // Keyed by Standard ID
        customDesignations: {},    // Keyed by Standard ID
        disabledDrills: []         // Names of individual drills to exclude
    },
    preferences: {
        currentStandardId: 'WHITWORTH',
        material: 'ferrous',
        standardSettings: {}
    }
};

/**
 * Loads the stored configuration from LocalStorage, merging with defaults.
 * @returns {Object} The complete configuration object.
 */
export const loadConfig = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return DEFAULTS;

        const parsed = JSON.parse(stored);

        // SCHEMA MIGRATION: 
        // Handles the transition from a flat customThreads array to one keyed by Standard ID.
        if (parsed.workshop?.customThreads && !parsed.workshop.customDesignations) {
            const currentStd = parsed.preferences?.currentStandardId || 'WHITWORTH';
            parsed.workshop.customDesignations = {
                [currentStd]: parsed.workshop.customThreads
            };
            delete parsed.workshop.customThreads;
        }

        // DEEP MERGE: 
        // Ensures that even if the user has an old config, new default top-level keys 
        // added in later versions are still available.
        return {
            workshop: { ...DEFAULTS.workshop, ...parsed.workshop },
            preferences: { ...DEFAULTS.preferences, ...parsed.preferences }
        };
    } catch (e) {
        console.error('Failed to load config from storage:', e);
        return DEFAULTS;
    }
};

/**
 * Saves the configuration to LocalStorage.
 * @param {Object} config - The configuration object to save.
 */
export const saveConfig = (config) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
        console.error('Failed to save config to storage:', e);
    }
};

/**
 * Convenience helper to update a slice of the config.
 * @param {string} key - 'workshop' or 'preferences'
 * @param {Object} updates - New properties to merge
 */
export const updateConfigSlice = (key, updates) => {
    const current = loadConfig();
    const updated = {
        ...current,
        [key]: { ...current[key], ...updates }
    };
    saveConfig(updated);
};
