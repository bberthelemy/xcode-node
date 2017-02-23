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
  getTargetConfigurations(target:string) {
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
  getTargetConfiguration(target:string, name:string) {
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
  getProjectConfiguration(name:string) {
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
  duplicateConfiguration(oldConfig:string, newConfig:string) {
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
  duplicateTargetConfiguration(target:string, oldConfig:string, newConfig:string) {
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
  duplicateProjectConfiguration(oldConfig:string, newConfig:string) {
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

  /**
   * Set a user-defined configuration variable for a specific target configuration
   *
   * @param target The name of the target
   * @param config The name of the configuration
   * @param key The usef defined variable name
   * @param value The user defined variable value
   */
  setUserDefinedTargetConfiguration(target:string, config:string, key:string, value:string) {
    const conf = this.getTargetConfiguration(target, config);
    const val = `"${value}"`;

    conf.buildSettings[key] = val;
  }

  /**
   * Set a user-defined configuration variable for a specific target (including all configurations)
   *
   * @param target The name of the target
   * @param config The name of the configuration
   * @param key The usef defined variable name
   * @param value The user defined variable value
   */
  setUserDefinedTarget(target:string, key:string, value:string) {
    const configs = this.getTargetConfigurations(target);
    const val = `"${value}"`;

    configs && configs.buildConfigurations.forEach((it) => {
      const conf = this.xcode.project.objects.XCBuildConfiguration[it.value];
      conf.buildSettings[key] = val;
    });
  }

  /**
   * Set the headers' search paths for a specific target configuration
   *
   * @param target The name of the target
   * @param config The name of the configuration
   * @param values The headers' search path array
   */
  setHeadersPathTargetConfiguration(target:string, config:string, values:Array) {
    const conf = this.getTargetConfiguration(target, config);
    const val = values.map((it) => {
      return `"${it}"`;
    });

    conf.buildSettings['HEADER_SEARCH_PATHS'] = val;
  }

  /**
   * Set the headers' search paths for a specific target (including all configurations)
   *
   * @param target The name of the target
   * @param values The headers' search path array
   */
  setHeadersPathTarget(target:string, values:Array) {
    const configs = this.getTargetConfigurations(target);
    const val = values.map((it) => {
      return `"${it}"`;
    });

    configs && configs.buildConfigurations.forEach((it) => {
      const conf = this.xcode.project.objects.XCBuildConfiguration[it.value];
      conf.buildSettings['HEADER_SEARCH_PATHS'] = val;
    });
  }
};
