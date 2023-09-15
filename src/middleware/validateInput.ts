export const validResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];

export const validateInputPost = (input: any): { isValid: boolean, errors: Array<{ message: string, field: string }> } => {
    const errors = [];

    // Validate title
    if (!input.title) {
        errors.push({ message: 'Title is required', field: 'title' });
    } else if (typeof input.title !== 'string') {
        errors.push({message: 'Title should be of type string',  field: 'title' });
    } else if (!input.title.trim()) {
        errors.push({message: 'Title should not be just whitespace', field: 'title' });
    } else if (input.title.length > 40) {
        errors.push({message: 'Title length should not exceed 40 characters', field: 'title' });
    }

    // Validate author
    if (!input.author) {
        errors.push({message: 'Author is required', field: 'author'});
    } else if (typeof input.author !== 'string') {
        errors.push({message: 'Author should be of type string', field: 'author' });
    } else if (!input.author.trim()) {
        errors.push({message: 'Author should not be just whitespace', field: 'author'  });
    } else if (input.author.length > 20) {
        errors.push({message: 'Author length should not exceed 20 characters', field: 'author' });
    }

    // Validate availableResolutions
    if (!input.availableResolutions || !Array.isArray(input.availableResolutions) || input.availableResolutions.length === 0) {
        errors.push({message: 'At least one resolution should be added', field: 'availableResolutions' });
    } else {
        const uniqueValues = [...new Set(input.availableResolutions)];
        if (uniqueValues.length !== input.availableResolutions.length) {
            errors.push({message: 'Duplicate resolutions', field: 'availableResolutions' });
        }
        for (const resolution of input.availableResolutions) {
            if (!validResolutions.includes(resolution)) {
                errors.push({message: `Invalid resolution value: ${resolution}`, field: 'availableResolutions', });
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const validateInputPut = (input: any): { isValid: boolean, errors: Array<{ message: string, field: string }> } => {
    const firstValidation = validateInputPost(input);
    const checkPublicationDateRegex: RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

    // Validate canBeDownloaded
    if (input.canBeDownloaded === undefined) {
        firstValidation.errors.push({ field: 'canBeDownloaded', message: 'canBeDownloaded is required' });
    } else if (typeof input.canBeDownloaded !== 'boolean') {
        firstValidation.errors.push({ field: 'canBeDownloaded', message: 'canBeDownloaded format is wrong' });
    }

    // Validate minAgeRestriction
    if (input.minAgeRestriction === undefined) {
        firstValidation.errors.push({field: 'minAgeRestriction', message: 'minAgeRestriction is required'});
    } else if ( input.minAgeRestriction !== null && typeof input.minAgeRestriction !== 'number') {
        firstValidation.errors.push({ field: 'minAgeRestriction', message: 'minAgeRestriction format is wrong' });
    } else if (input.minAgeRestriction !== null && (input.minAgeRestriction < 1 || input.minAgeRestriction > 18)) {
        firstValidation.errors.push({ field: 'minAgeRestriction', message: 'minAgeRestriction should be between 1 and 18' });
    }

    // Validate publicationDate
    if (input.publicationDate === undefined) {
        firstValidation.errors.push({field: 'publicationDate', message: 'publicationDate is required'});
    } else if (typeof input.publicationDate !== 'string') {
        firstValidation.errors.push({ field: 'publicationDate', message: 'publicationDate format should be string' });
    } else if (!checkPublicationDateRegex.test(input.publicationDate)) {
        firstValidation.errors.push({ field: 'publicationDate', message: 'publicationDate should be in ISO format' });
    }

    firstValidation.isValid = firstValidation.errors.length === 0;
    return firstValidation;
};