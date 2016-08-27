# node-project-creator
Simple cli to create node project using [node-project's template](https://github.com/petitchevalroux/node-project/)

# Usage
```
node-project-creator <project name>
```

# Configuration file
Located in ~/.node-project-creator
```json
{

    "base-directory":"/Users/patrick/code",
    "git-origin":"git@github.com:petitchevalroux/%project%.git",
    "commands": ["rm src/*.js", "rm tests/*.js"],
    "package":{
        "description":"",
        "repository":{
            "type":"git",
            "url":"git+ssh://github.com/petitchevalroux/%project%.git"
        },
        "bugs":{
            "url":"https://github.com/petitchevalroux/%project%/issues"
        },
        "homepage":"https://github.com/petitchevalroux/%project%#readme"
    }

}
```
