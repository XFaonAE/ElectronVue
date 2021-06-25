import fileSystem from "fs";
import path from 'path';

export default class ComponentUtils {
    /**
     * Get a list of all the components in the project working directory
     * @param { string[] } config Working directory config
     * @return { string[] }
     */
    public static getAllComponents(config: string[]): string[] {
        // Return all file names
        return fileSystem.readdirSync(config.componentsDir);
    }

    /**
     * Get a list of all the views in the project working directoryvar
     * @param { string[] } config Working directory config
     * @return { string[] }
     */
    public static getAllViews(config: string[]): string[] {
        // Return all file names
        return fileSystem.readdirSync(config.viewsDir);
    }

    /**
     * Load all key files
     * @param { string[] } config Working directory config
     * @return { Promise }
     */
    public static loadAllKeys(config: string[]) {
        return new Promise((resolve: any, reject: any) => {
            // Get app files
            const components = this.getAllComponents(config);
            const views = this.getAllViews(config);
            var mainVueSfc = fileSystem.readFileSync(config.vueMainSfcPath);

            // Fill content to real source vue dir
            components.forEach((value: any) => {
                fileSystem.writeFile(path.join(__dirname, "../vue/components/", value), 
                fileSystem.readFileSync(path.join(config.componentsDir, value)), (error: any) => {
                    if (error) {
                        console.log(error);
                    }
                });
            });

            views.forEach((value: any) => {
                fileSystem.writeFile(path.join(__dirname, "../vue/views", value), 
                fileSystem.readFileSync(path.join(config.viewsDir, value)), (error: any) => {
                    if (error) {
                        console.log(error);
                    }
                })
            });

            fileSystem.writeFile(path.join(__dirname, "../vue/Main.vue"), mainVueSfc, (error: any) => {
                if (error) {
                    console.log(error);
                }
            });

            console.log("Filed copied");
            resolve();
        });
    }
}