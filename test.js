import Xcode from "./src/";
import assert from "assert";

const project = new Xcode('project.pbxproj');

// TARGETS
const targets = project.getTargets();
console.log(targets);

const target = project.getTarget("TestProject");
console.log(target);

// END TARGETS

// CONFIGURATION
const projectConfigurationDebug = project.configuration.getProjectConfiguration("Debug");
console.log("Debug: ", projectConfigurationDebug);

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


// END CONFIGURATION