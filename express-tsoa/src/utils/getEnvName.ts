class MissingEnvNameError extends Error {}
class UnknownEnvNameError extends Error {}

const ALLOWED_ENVS = new Set(['dev', 'stage', 'prod']);

/**
 * Get run time env name
 * @returns
 */
const getEnvName = () => {
    const envName = process.env.ENV;

    if (!envName) {
        throw new MissingEnvNameError('Env name is missing, set ENV env var');
    }

    if (!ALLOWED_ENVS.has(envName)) {
        throw new UnknownEnvNameError(`The following env is not in the allow list: ${envName}`);
    }

    return envName;
};

export default getEnvName;
