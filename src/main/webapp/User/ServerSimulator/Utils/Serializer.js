'use strict';

export class Serializer {
    static serialize(data, maxDepth = 10) {
        try {
            const seen = new WeakSet();

            const replacer = (key, value) => {
                // Depth check
                if (Serializer.getObjectDepth(value) > maxDepth) {
                    return '[Max Depth Reached]';
                }

                // Date handling
                if (value instanceof Date) {
                    return value.toISOString();
                }

                // Circular reference check
                if (typeof value === 'object' && value !== null) {
                    if (seen.has(value)) {
                        return '[Circular]';
                    }
                    seen.add(value);
                }

                return value;
            };

            return JSON.stringify(data, replacer, 2);
        } catch (error) {
            throw new Error(`Serialization failed: ${error.message}`);
        }
    }

    // Utility method to calculate object depth
    static getObjectDepth(obj, currentDepth = 0) {
        if (typeof obj !== 'object' || obj === null) return currentDepth;

        return Math.max(
            currentDepth,
            ...Object.values(obj)
                .filter(value => typeof value === 'object' && value !== null)
                .map(value => Serializer.getObjectDepth(value, currentDepth + 1))
        );
    }
    
    static safeParse(jsonString) {
        try {
            return JSON.parse(jsonString);
        } catch {
            return null;
        }
    }
}