"use strict";

var process = require("process");
var exec = require("child_process")
    .exec;
var path = require("path");
var os = require("os");
var nconf = require("nconf");
var fs = require("fs");
var merge = require("merge");
nconf
    .argv()
    .file({
        file: path.join(os.homedir(), ".node-project-creator")
    });

var cmds = [
    "git clone git@github.com:petitchevalroux/node-project.git %directory%",
    "cd %directory%",
    "pwd",
    "git remote remove origin",
    "git remote add origin %git-origin%",
    "git remote add node-project git@github.com:petitchevalroux/node-project.git",
    "make install-git-hook"
];

nconf.get("_")
    .forEach(function(project) {
        var replacements = {
            "project": project
        };
        var config = nconf.get();
        if (!config.directory) {
            config.directory = path.join(config["base-directory"], project);
        }

        Object.getOwnPropertyNames(config)
            .forEach(function(index) {
                if (index !== "_" && index !== "$0" && typeof config[
                        index] === "string") {
                    replacements[index] = config[index];
                }
            });

        // Replace replacements recursively
        Object.getOwnPropertyNames(replacements)
            .forEach(function(key) {
                Object.getOwnPropertyNames(replacements)
                    .forEach(function(k) {
                        replacements[key] = replacements[key].replace(
                            new RegExp("%" + k + "%", "g"),
                            replacements[k]);
                    });
            });

        var cmd = cmds.join(" && ");
        Object.getOwnPropertyNames(replacements)
            .forEach(function(key) {
                cmd = cmd.replace(new RegExp("%" + key + "%", "g"),
                    replacements[key]);
            });

        exec(cmd, function(err, stdout, stderr) {
            process.stdout.write(stdout);
            process.stderr.write(stderr);
            var packageData = config.package || {};
            packageData.name = project;
            var pkg = JSON.parse(fs.readFileSync(path.join(
                config.directory, "package.json")));
            pkg = JSON.stringify(merge(pkg, packageData),
                null, 4);
            Object.getOwnPropertyNames(replacements)
                .forEach(function(key) {
                    pkg = pkg.replace(new RegExp(
                            "%" + key + "%", "g"),
                        replacements[key]);
                });
            fs.writeFileSync(path.join(
                config.directory, "package.json"), pkg);

        });
    });
