import Xcode from "xcode";
import fs from "fs";
import Configuration from "./configuration";
import Buildphase from "./buildphase";

/**
 * Base class to handle pbxproj file and basic project informations
 */
class Project {
    constructor(path) {
        this.projectPath = path;
        this.myProj = Xcode.project(this.projectPath);

        this.myProj.parseSync();

        this.configuration = new Configuration(this, this.myProj.hash)
        this.buildphase = new Buildphase(this, this.myProj.hash)
    }


    /**
     * Get a specific project's target by name
     *
     * @example
     * const project = new Xcode('project.pbxproj');
     * const target = project.getTarget("TestProject");
     * console.log(target);
     *
     * project.getTargets().forEach((tg) => {
   *   console.log(project.getTarget(tg.name));
   * });
     *
     * @param {string} name The name of the target
     * @returns {*} The target (ref) or null if error
     */
    getTarget(name) {
        const targets = this.myProj.hash.project.objects.PBXNativeTarget;

        for (const i in targets) {
            if (typeof i === "string" && i.indexOf("_comment") === -1) {
                if (targets[i].name === name) {
                    return targets[i];
                }
            }
        }

        return null;
    }

    /**
     * Get all project's targets
     *
     * @example
     * const project = new Xcode('project.pbxproj');
     * const targets = project.getTargets();
     * console.log(targets);
     *
     * @returns {Array} The targets (copy)
     */
    getTargets() {
        const targets = this.myProj.hash.project.objects.PBXNativeTarget;

        const keys = Object.keys(targets).filter((it) => {
            return typeof it === "string" && it.indexOf("_comment") === -1;
        });

        return keys.map((it) => {
            return targets[it];
        });
    }

    /**
     * Save all modifications
     *
     * @example
     * const project = new Xcode('project.pbxproj');
     * project.save();
     * project.save("project_second.pbxproj");
     *
     * @param {string} path The new project path (not required)
     */
    save(path) {
        const newPath = (path) ? path : this.projectPath;

        fs.writeFileSync(newPath, this.myProj.writeSync());
    }

    /**
     * Return project as string (can be usefull to make bash redirections and other manipulations)
     *
     * @example
     * const project = new Xcode('project.pbxproj');
     * process.stdout.write(project.toString());
     *
     * @returns {string}
     */
    toString() {
        return this.myProj.writeSync().toString();
    }
}

export default Project;
