class MissingEnvVarError extends Error {}

/**
 * Get env var
 *
 * If no default was set, will raise an error
 * If JSON Parse is set as true, will parse the env value as JSON
 *
 * @param name
 * @param defaultValue
 * @param jsonParse
 * @returns
 */
const getEnvVar = (name: string, defaultValue?: string, jsonParse?: boolean): string => {
    const value = process.env[name];

    if (value && jsonParse) {
        return JSON.parse(value);
    }
    if (value) {
        return value;
    }
    if (defaultValue !== undefined) {
        return defaultValue;
    }

    throw new MissingEnvVarError(`The following env var is missing: ${name}`);
};

export default getEnvVar;
