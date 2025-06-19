// app-layout-provider.tsx
import { type BreadcrumbItem } from '@/types';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Define the layout type
export type AppLayoutType = 'sidebar' | 'header';

// Create a key for localStorage
export const LAYOUT_STORAGE_KEY = 'appLayoutPreference';

// Create context for layout
interface AppLayoutContextType {
    layout: AppLayoutType;
    setLayout: (layout: AppLayoutType) => void;
}

const AppLayoutContext = createContext<AppLayoutContextType>({
    layout: 'sidebar',
    setLayout: () => {},
});

// Hook to use layout
export const useAppLayout = () => useContext(AppLayoutContext);

// Props for the provider
interface AppLayoutProviderProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

// Provider that determines which layout to use
export function AppLayoutProvider({ children }: AppLayoutProviderProps) {
    const [layout, setLayout] = useState<AppLayoutType>('sidebar');

    useEffect(() => {
        const savedLayout = localStorage.getItem(LAYOUT_STORAGE_KEY);
        if (savedLayout === 'sidebar' || savedLayout === 'header') {
            setLayout(savedLayout as AppLayoutType);
        }
    }, []);

    const updateLayout = (newLayout: AppLayoutType) => {
        setLayout(newLayout);
        localStorage.setItem(LAYOUT_STORAGE_KEY, newLayout);
    };

    return <AppLayoutContext.Provider value={{ layout, setLayout: updateLayout }}>{children}</AppLayoutContext.Provider>;
}
