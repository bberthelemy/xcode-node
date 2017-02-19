import Xcode from 'xcode';
import Configuration from "./configuration";

const projectPath = 'project.pbxproj';
const myProj = Xcode.project(projectPath);

myProj.parseSync();

// process.stdout.write(myProj.writeSync());

// console.log(pbx_uid(myProj.hash));

//console.log(myProj.hash.project.objects.XCBuildConfiguration);
// console.log(myProj.hash.project.objects.XCConfigurationList);
// console.log(Object.keys(myProj.hash.project.objects.XCConfigurationList).length);

const Project = {
  Configuration: new Configuration(myProj.hash)
};

// Test
const projectConfiguration = Project.Configuration.getProjectConfigurations();
// console.log(projectConfiguration);

const projectConfigurationDebug = Project.Configuration.getProjectConfiguration("Debug");
console.log("Debug: ", projectConfigurationDebug);

const projectConfigurationRelease = Project.Configuration.getProjectConfiguration("Release");
console.log("Release: ", projectConfigurationRelease);
