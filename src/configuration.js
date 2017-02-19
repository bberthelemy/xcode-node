export default class Configuration {
  constructor(xcode) {
    this.xcode = xcode;
  }

  all() {

  }

  getTargetConfiguration(name) {
  }

  getProjectConfigurations() {
    const project = Object.keys(this.xcode.project.objects.PBXProject).filter((it) => typeof it === "string" && it.indexOf("_comment") === -1);
    if (project && project.length > 0) {
      const projectConfigurationListId = this.xcode.project.objects.PBXProject[project[0]].buildConfigurationList;
      return this.xcode.project.objects.XCConfigurationList[projectConfigurationListId];
    }
    return null;
  }

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

  duplicate(oldConfig, newConfig) {

  }
};
