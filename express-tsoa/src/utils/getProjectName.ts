class MissingProjectNameError extends Error {}

/**
 * Get GCP project name
 *
 * @returns
 */
const getProjectName = (): string => {
    const projectName = process.env.GCP_PROJECT;
    if (!projectName) {
        throw new MissingProjectNameError('Project name is missing, set GCP_PROJECT env var');
    }

    return projectName;
};

export default getProjectName;
