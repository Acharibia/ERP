import { format, formatDistance, isValid, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';

type InputDate = Date | string | null | undefined;

export function useDateFormatter() {
    // Safely parse a date string or object to a valid Date
    const parseDate = (date: InputDate): Date | null => {
        if (!date) return null;
        if (date instanceof Date) return isValid(date) ? date : null;

        const parsed = parseISO(date);
        return isValid(parsed) ? parsed : null;
    };

    const formatDate = (date: InputDate, pattern: string = 'MMM dd, yyyy'): string => {
        const parsed = parseDate(date);
        return parsed ? format(parsed, pattern, { locale: enUS }) : '';
    };

    const formatTime = (date: InputDate, is24Hour: boolean = false): string => {
        const parsed = parseDate(date);
        if (!parsed) return '';

        const pattern = is24Hour ? 'HH:mm' : 'hh:mm aa';
        return format(parsed, pattern, { locale: enUS });
    };

    const formatDateTime = (date: InputDate, is24Hour: boolean = false): string => {
        const parsed = parseDate(date);
        if (!parsed) return '';

        const pattern = is24Hour ? 'MMM dd, yyyy HH:mm' : 'MMMM dd, yyyy hh:mm aa';
        return format(parsed, pattern, { locale: enUS });
    };

    const formatRelative = (date: InputDate): string => {
        const parsed = parseDate(date);
        return parsed ? formatDistance(parsed, new Date(), { addSuffix: true, locale: enUS }) : '';
    };

    const formatForDatabase = (date: InputDate): string => {
        const parsed = parseDate(date);
        return parsed ? format(parsed, 'yyyy-MM-dd') : '';
    };

    const formatFullDate = (date: InputDate): string => {
        const parsed = parseDate(date);
        return parsed ? format(parsed, 'EEEE, MMMM dd, yyyy', { locale: enUS }) : '';
    };

    const formatShortDate = (date: InputDate): string => {
        const parsed = parseDate(date);
        return parsed ? format(parsed, 'MM/dd/yyyy') : '';
    };

    const formatMonthYear = (date: InputDate): string => {
        const parsed = parseDate(date);
        return parsed ? format(parsed, 'MMMM yyyy') : '';
    };

    const formatDayMonth = (date: InputDate): string => {
        const parsed = parseDate(date);
        return parsed ? format(parsed, 'dd MMM') : '';
    };

    const formatCustom = (date: InputDate, pattern: string): string => {
        const parsed = parseDate(date);
        if (!parsed) return '';

        try {
            return format(parsed, pattern, { locale: enUS });
        } catch (error) {
            console.error(`Invalid date format pattern: ${error}${pattern}`);
            return '';
        }
    };

    const getDateStatus = (date: InputDate): 'past' | 'present' | 'future' | 'invalid' => {
        const parsed = parseDate(date);
        if (!parsed) return 'invalid';

        const now = new Date();
        if (parsed.toDateString() === now.toDateString()) return 'present';
        return parsed < now ? 'past' : 'future';
    };

    return {
        parseDate,
        formatDate,
        formatTime,
        formatDateTime,
        formatRelative,
        formatForDatabase,
        formatFullDate,
        formatShortDate,
        formatMonthYear,
        formatDayMonth,
        formatCustom,
        getDateStatus,
    };
}
