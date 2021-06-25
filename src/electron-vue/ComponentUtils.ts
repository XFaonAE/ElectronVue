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
     * Load asset
     * @param { string } outDir Output directory name
     * @param { string } inPath Exact file path for asset
     */
    public static loadAsset(outPath: string, inPath: string) {
        const assetRaw = fileSystem.readFileSync(inPath);
        fileSystem.writeFile(path.join(__dirname, "../vue/", outPath), assetRaw, (error: any) => {
            error?.console.log(error);
        });
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
                this.loadAsset(path.join("components", value), path.join(config.componentsDir, value));
            });

            views.forEach((value: any) => {
                this.loadAsset(path.join("views", value), path.join(config.viewsDir, value));
            });

            fileSystem.writeFile(path.join(__dirname, "../vue/Main.vue"), mainVueSfc, (error: any) => {
                error?.console.log(error);
            });

            this.startLookOut(config);
            resolve();
        });
    }

    /**
     * Start lookout file system
     */
    public static startLookOut(config: any) {
        // Listen to each file category
        fileSystem.watch(config.componentsDir, (type: any, filename: any) => {
            this.loadAsset(path.join("components", filename), path.join(config.componentsDir, filename));
        });

        fileSystem.watch(config.viewsDir, (type: any, filename: any) => {
            this.loadAsset(path.join("views", filename), path.join(config.viewsDir, filename));
        });

        fileSystem.watch(config.vueMainSfcPath, (type: any, filename: any) => {
            this.loadAsset(path.join("./", "Main.vue"), filename);
        });
    }
}