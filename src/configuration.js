import Utils from "./utils";

export default class Configuration {
  constructor(xcode) {
    this.xcode = xcode;
  }

  /**
   * Get a specific target configuration list
   *
   * @param target The name of the target
   * @returns {*} The configuration list (ref) or null if error
   */
  getTargetConfigurations(target) {
    const targets = this.xcode.project.objects.PBXNativeTarget;

    for (const i in targets) {
      if (typeof i === "string" && i.indexOf("_comment") === -1) {
        if (targets[i].name === target) {
          const configuration = this.xcode.project.objects.XCConfigurationList;

          return configuration[targets[i].buildConfigurationList];
        }
      }
    }

    return null;
  }

  /**
   * Get a specific target configuration
   *
   * @param target The name of the target
   * @param name The name of the configuration
   * @returns {*} The configuration (ref) of null if error
   */
  getTargetConfiguration(target, name) {
    const configurations = this.getTargetConfigurations(target);

    if (configurations) {
      const values = configurations.buildConfigurations.map((item) => item.value);

      for (const i in values) {
        const configuration = this.xcode.project.objects.XCBuildConfiguration[values[i]];
        if (configuration.name === name) {
          return configuration;
        }
      }
    }

    return null;
  }

  /**
   * Get the project configuration list
   *
   * @returns {*} The configuration list (ref) or null if error
   */
  getProjectConfigurations() {
    const project = Object.keys(this.xcode.project.objects.PBXProject).filter((it) => typeof it === "string" && it.indexOf("_comment") === -1);
    if (project && project.length > 0) {
      const projectConfigurationListId = this.xcode.project.objects.PBXProject[project[0]].buildConfigurationList;

      return this.xcode.project.objects.XCConfigurationList[projectConfigurationListId];
    }
    return null;
  }

  /**
   * Get a configuration by name
   *
   * @param name The name of the configuration
   * @returns {*} The configuration (ref) or null if error
   */
  getProjectConfiguration(name) {
    const configurations = this.getProjectConfigurations();
    const values = configurations.buildConfigurations.map((item) => item.value);

    for (const i in values) {
      const configuration = this.xcode.project.objects.XCBuildConfiguration[values[i]];
      if (configuration.name === name) {
        return configuration;
      }
    }

    return null;
  }

  /**
   * Duplicate a configuration by name (project + all targets)
   *
   * @param oldConfig The name of the configuration to duplicate
   * @param newConfig The new name of duplicated configuraton
   */
  duplicateConfiguration(oldConfig, newConfig) {
    this.duplicateProjectConfiguration(oldConfig, newConfig);

    const targets = this.xcode.project.objects.PBXNativeTarget;

    const keys = Object.keys(targets).filter((it) => {
      return typeof it === "string" && it.indexOf("_comment") === -1;
    });

    keys.forEach((it) => {
      const target = targets[it].name;
      this.duplicateTargetConfiguration(target, oldConfig, newConfig);
    });
  }

  /**
   * Duplicate a specific target configuration by name
   *
   * @param target The name of the target
   * @param oldConfig The name of the configuration to duplicate
   * @param newConfig The new name of duplicated configuraton
   * @returns {*} The new duplicated configuration (ref) or null if error
   */
  duplicateTargetConfiguration(target, oldConfig, newConfig) {
    const key = Utils.pbx_uid(this.xcode);
    const keyComment = `${key}_comment`;

    const config = JSON.parse(JSON.stringify(this.getTargetConfiguration(target, oldConfig)));
    config.name = newConfig;

    const configurations = this.getTargetConfigurations(target);
    if (configurations) {
      configurations.buildConfigurations.push({value: key, comment: newConfig});

      this.xcode.project.objects.XCBuildConfiguration[key] = config;
      this.xcode.project.objects.XCBuildConfiguration[keyComment] = newConfig;

      return this.xcode.project.objects.XCBuildConfiguration[key];
    }

    return null;
  }

  /**
   * Duplicate a project configuration by name (it won't duplicate targets' configurations)
   *
   * @param oldConfig The name of the configuration to duplicate
   * @param newConfig The new name of duplicated configuraton
   * @returns {*} The new duplicated configuration (ref) or null if error
   */
  duplicateProjectConfiguration(oldConfig, newConfig) {
    const key = Utils.pbx_uid(this.xcode);
    const keyComment = `${key}_comment`;
    const config = JSON.parse(JSON.stringify(this.getProjectConfiguration(oldConfig)));
    config.name = newConfig;

    const configurations = this.getProjectConfigurations();
    configurations.buildConfigurations.push({value: key, comment: newConfig});

    this.xcode.project.objects.XCBuildConfiguration[key] = config;
    this.xcode.project.objects.XCBuildConfiguration[keyComment] = newConfig;

    return this.xcode.project.objects.XCBuildConfiguration[key];
  }
};
