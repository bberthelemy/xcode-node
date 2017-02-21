import Xcode from 'xcode';
import fs from "fs";
import Configuration from "./configuration";

// process.stdout.write(myProj.writeSync());

// console.log(pbx_uid(myProj.hash));

//console.log(myProj.hash.project.objects.XCBuildConfiguration);
// console.log(myProj.hash.project.objects.XCConfigurationList);
// console.log(Object.keys(myProj.hash.project.objects.XCConfigurationList).length);

export default class Project {
  constructor(path) {
    this.projectPath = path;
    this.myProj = Xcode.project(this.projectPath);

    this.myProj.parseSync();

    this.configuration = new Configuration(this.myProj.hash)
  }


  /**
   * Get a specific project's target by name
   *
   * @param name The name of the target
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
   * @param path The new project path (not required)
   */
  save(path) {
    const newPath = (path) ? path : this.projectPath;

    fs.writeFileSync(newPath, this.myProj.writeSync());
  }

  /**
   * Return project as string (can be usefull to make bash redirections and other manipulations)
   *
   * @returns {string}
   */
  toString() {
    return this.myProj.writeSync().toString();
  }
}

const project = new Project('project.pbxproj');
// project.save('project.new.pbxproj');

console.log("Project: " + project);