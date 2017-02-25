import Xcode from "./src/";
import assert from "assert";

const project = new Xcode('project.pbxproj');

// TARGETS

// Get target list
const targets = project.getTargets();
console.log(targets);

// Get specific target by name
const target = project.getTarget("TestProject");
console.log(target);

// END TARGETS

// CONFIGURATION
// Retrieve project configuration
const projectConfigurationDebug = project.configuration.getProjectConfiguration("Debug");
console.log("Debug: ", projectConfigurationDebug);

// Duplicate project configuration
const projectConfigurationStagingResult = project.configuration.duplicateProjectConfiguration("Release", "Staging");
const projectConfigurationStaging = project.configuration.getProjectConfiguration("Staging");

assert.equal(projectConfigurationStagingResult, projectConfigurationStaging);
console.log("Staging: ", projectConfigurationStaging);

const projectConfigurationRelease = project.configuration.getProjectConfiguration("Release");
console.log("Release: ", projectConfigurationRelease);

const projectConfiguration = project.configuration.getProjectConfigurations();
console.log(projectConfiguration);

const targetConfigurations = project.configuration.getTargetConfigurations("TestProject");
console.log(targetConfigurations);

const targetConfigurationRelease = project.configuration.getTargetConfiguration("TestProject", "Release");
console.log(targetConfigurationRelease);

// project.configuration.duplicateTargetConfiguration("TestProject", "Release", "Staging");

project.configuration.duplicateConfiguration("Release", "Staging");

const targetConfigurationStaging = project.configuration.getTargetConfiguration("TestProject", "Staging");
const targetTestsConfigurationStaging = project.configuration.getTargetConfiguration("TestProjectTests", "Staging");
console.log(targetConfigurationStaging);
console.log(targetTestsConfigurationStaging);

// Add user-defined variable to all configurations of all targets
project.getTargets().forEach((tg) => {
  project.configuration.setUserDefinedTarget(tg.name, "REACT_HEADERS_PATH", '$(BUILT_PRODUCTS_DIR)/../Release-$(PLATFORM_NAME)/include');
});

// Set search path to previously defined variable + inherited
project.getTargets().forEach((tg) => {
  project.configuration.setHeadersPathTarget(tg.name, ['$(inherited)', '$(REACT_HEADERS_PATH)']);
});

// END CONFIGURATION