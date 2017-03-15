import Utils from "./utils";

/**
 * Build Phases handler to manipulate build phase items for project and targets
 */
class Buildphase {
    constructor(project, xcode) {
        this.project = project;
        this.xcode = xcode;
    }

    /**
     * Add a script build phase to a specific target
     *
     * @example
     * const p = new Project("project.pbxproj");
     * p.buildphase.addScript("TestProject", 'echo hello world', "Basic test");
     *
     * @param target The name of the target
     * @param script The script
     * @param name Used to rename the phase with your own name
     */
    addScript(target, script, name) {
        const tg = this.project.getTarget(target);
        const key = Utils.pbx_uid(this.xcode);
        const keyComment = `${key}_comment`;

        const phase = {
            isa: "PBXShellScriptBuildPhase",
            buildActionMask: 2147483647,
            files: [],
            inputPaths: [],
            outputPaths: [],
            runOnlyForDeploymentPostprocessing: 0,
            shellPath: "/bin/sh",
            shellScript: `"${script}"`
        };
        if (name) {phase.name = `"${name}"`}

        this.xcode.project.objects.PBXShellScriptBuildPhase[key] = phase;
        this.xcode.project.objects.PBXShellScriptBuildPhase[keyComment] = (name) ? name : "ShellScript";

        tg.buildPhases.push({
            value: key,
            comment: (name) ? name : "ShellScript"
        });
    }
}

export default Buildphase;