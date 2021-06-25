export default class ComponentUtils {
    /**
     * Get a list of all the components in the project working directory
     * @param { string[] } config Working directory config
     * @return { string[] }
     */
    static getAllComponents(config: string[]): string[];
    /**
     * Get a list of all the views in the project working directoryvar
     * @param { string[] } config Working directory config
     * @return { string[] }
     */
    static getAllViews(config: string[]): string[];
    /**
     * Load all key files
     * @param { string[] } config Working directory config
     * @return { Promise }
     */
    static loadAllKeys(config: string[]): Promise<unknown>;
}
