import Utils from "./utils";

/**
 * Configuration handler to manipulate build configurations for project and targets
 */
class Configuration {
  constructor(project, xcode) {
    this.project = project;
    this.xcode = xcode;
  }

  /**
   * Get a specific target configuration list
   *
   * @example
   * const project = new Xcode('project.pbxproj');
   *
   * project.getTargets().forEach((tg) => {
   *   const targetConfiguration = project.configuration.getTargetConfigurations(tg.name);
   *
   *   console.log(targetConfiguration);
   * });
   *
   * @param {string} target The name of the target
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
   * @example
   * const project = new Xcode('project.pbxproj');
   *
   * project.getTargets().forEach((tg) => {
   *   const targetConfigurationDebug = project.configuration.getTargetConfigurations(tg.name, "Debug");
   *   const targetConfigurationRelease = project.configuration.getTargetConfigurations(tg.name, "Release");
   *
   *   console.log(targetConfigurationDebug);
   *   console.log(targetConfigurationRelease);
   * });
   *
   * @param {string} target The name of the target
   * @param {string} name The name of the configuration
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
   * @example
   * const project = new Xcode('project.pbxproj');
   * const projectConfigurations = project.configuration.getProjectConfigurations();
   *
   * console.log(projectConfigurations);
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
   * @example
   * const project = new Xcode('project.pbxproj');
   * const projectConfigurationRelease = project.configuration.getProjectConfiguration("Release");
   *
   * console.log(projectConfigurationRelease);
   *
   * @param {string} name The name of the configuration
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
   * @example
   * const project = new Xcode('project.pbxproj');
   *
   * project.configuration.duplicateConfiguration("Release", "Staging");
   *
   * const projectConfigurationStaging = project.configuration.getProjectConfiguration("Staging");
   *
   * @param {string} oldConfig The name of the configuration to duplicate
   * @param {string} newConfig The new name of duplicated configuraton
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
   * @example
   * const project = new Xcode('project.pbxproj');
   * const diplicated = project.configuration.duplicateTargetConfiguration("TestProject", "Release", "Staging");
   *
   * console.log(diplicated);
   *
   * @param {string} target The name of the target
   * @param {string} oldConfig The name of the configuration to duplicate
   * @param {string} newConfig The new name of duplicated configuraton
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
   * @example
   * const project = new Xcode('project.pbxproj');
   * const projectConfigurationStagingResult = project.configuration.duplicateProjectConfiguration("Release", "Staging");
   *
   * console.log(projectConfigurationStagingResult);
   *
   * @param {string} oldConfig The name of the configuration to duplicate
   * @param {string} newConfig The new name of duplicated configuraton
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

  /**
   * Set a user-defined configuration variable for a specific target configuration
   *
   * @example
   * const project = new Xcode('project.pbxproj');
   *
   * project.getTargets().forEach((tg) => {
   *   project.configuration.setUserDefinedTargetConfiguration(tg.name, "Staging" "REACT_HEADERS_PATH", '$(BUILT_PRODUCTS_DIR)/../Release-$(PLATFORM_NAME)/include');
   * });
   *
   * @param {string} target The name of the target
   * @param {string} config The name of the configuration
   * @param {string} key The usef defined variable name
   * @param {string} value The user defined variable value
   */
  setUserDefinedTargetConfiguration(target, config, key, value) {
    const conf = this.getTargetConfiguration(target, config);
    const val = `"${value}"`;

    conf.buildSettings[key] = val;
  }

  /**
   * Set a user-defined configuration variable for a specific target (including all configurations)
   *
   * @example
   * const project = new Xcode('project.pbxproj');
   *
   * project.getTargets().forEach((tg) => {
   *   project.configuration.setUserDefinedTarget(tg.name, "REACT_HEADERS_PATH", '$(BUILT_PRODUCTS_DIR)/../Release-$(PLATFORM_NAME)/include');
   * });
   *
   * @param {string} target The name of the target
   * @param {string} config The name of the configuration
   * @param {string} key The usef defined variable name
   * @param {string} value The user defined variable value
   */
  setUserDefinedTarget(target, key, value) {
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
   * @example
   * const project = new Xcode('project.pbxproj');
   *
   * project.getTargets().forEach((tg) => {
   *   project.configuration.setHeadersPathTargetConfiguration(tg.name, "Release", ['$(inherited)', '$(REACT_HEADERS_PATH)']);
   * });
   *
   * @param {string} target The name of the target
   * @param {string} config The name of the configuration
   * @param values The headers' search path array
   */
  setHeadersPathTargetConfiguration(target, config, values) {
    const conf = this.getTargetConfiguration(target, config);
    const val = values.map((it) => {
      return `"${it}"`;
    });

    conf.buildSettings['HEADER_SEARCH_PATHS'] = val;
  }

  /**
   * Set the headers' search paths for a specific target (including all configurations)
   *
   * @example
   * const project = new Xcode('project.pbxproj');
   *
   * project.getTargets().forEach((tg) => {
   *   project.configuration.setHeadersPathTarget(tg.name, ['$(inherited)', '$(REACT_HEADERS_PATH)']);
   * });
   *
   * @param {string} target The name of the target
   * @param values The headers' search path array
   */
  setHeadersPathTarget(target, values) {
    const configs = this.getTargetConfigurations(target);
    const val = values.map((it) => {
      return `"${it}"`;
    });

    configs && configs.buildConfigurations.forEach((it) => {
      const conf = this.xcode.project.objects.XCBuildConfiguration[it.value];
      conf.buildSettings['HEADER_SEARCH_PATHS'] = val;
    });
  }
}

export default Configuration;