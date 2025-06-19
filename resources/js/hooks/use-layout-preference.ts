// @/hooks/use-layout-preference.ts
import { useState, useEffect } from 'react';

export type LayoutVariant = 'sidebar' | 'header';

const LAYOUT_PREFERENCE_KEY = 'layout-preference';
const DEFAULT_LAYOUT: LayoutVariant = 'sidebar';

export function useLayoutPreference() {
    const [layoutVariant, setLayoutVariantState] = useState<LayoutVariant>(DEFAULT_LAYOUT);
    const [isLoading, setIsLoading] = useState(true);

    // Load preference from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(LAYOUT_PREFERENCE_KEY);
            if (stored && (stored === 'sidebar' || stored === 'header')) {
                setLayoutVariantState(stored as LayoutVariant);
            }
        } catch (error) {
            console.warn('Failed to load layout preference:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Save preference and optionally sync with server
    const setLayoutVariant = (variant: LayoutVariant) => {
        setLayoutVariantState(variant);

        try {
            localStorage.setItem(LAYOUT_PREFERENCE_KEY, variant);
        } catch (error) {
            console.warn('Failed to save layout preference:', error);
        }

        // Optional: Sync with server for cross-device preferences
        // You can uncomment this if you want to store preferences server-side
        /*
        router.patch('/user/preferences',
            { layout_preference: variant },
            {
                preserveState: true,
                preserveScroll: true,
                only: [], // Don't reload any data
            }
        );
        */
    };

    // Toggle between layouts
    const toggleLayout = () => {
        const newVariant = layoutVariant === 'sidebar' ? 'header' : 'sidebar';
        setLayoutVariant(newVariant);
    };

    return {
        layoutVariant,
        setLayoutVariant,
        toggleLayout,
        isLoading,
    };
}
