export const PROCESS_NUMBER_PATTERN = /^\d{7}-\d{2}\.\d{4}\.\d{1,2}\.\d{2}\.\d{4}$/;
export const PROCESS_NUMBER_LENGTH = 25;

const removeNonNumeric = (value: string): string => {
    return value.replace(/\D/g, '');
};

export const applyProcessNumberMask = (value: string): string => {
    const numbers = removeNonNumeric(value);
    const maxLength = 20;
    const limitedNumbers = numbers.slice(0, maxLength);

    if (limitedNumbers.length === 0) return '';

    let masked = limitedNumbers.slice(0, 7);

    if (limitedNumbers.length > 7) {
        masked += '-' + limitedNumbers.slice(7, 9);
    }

    if (limitedNumbers.length > 9) {
        masked += '.' + limitedNumbers.slice(9, 13);
    }

    if (limitedNumbers.length > 13) {
        masked += '.' + limitedNumbers.slice(13, 14);
    }

    if (limitedNumbers.length > 14) {
        masked += '.' + limitedNumbers.slice(14, 16);
    }

    if (limitedNumbers.length > 16) {
        masked += '.' + limitedNumbers.slice(16, 20);
    }

    return masked;
};

export const isCompleteProcessNumber = (value: string): boolean => {
    if (!value.trim()) return false;
    return PROCESS_NUMBER_PATTERN.test(value.trim());
};

export const isValidProcessNumber = (value: string): boolean => {
    if (!value.trim()) return true;
    return PROCESS_NUMBER_PATTERN.test(value.trim());
};
