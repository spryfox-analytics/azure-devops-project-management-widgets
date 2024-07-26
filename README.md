# Project Management Widgets

## Build and publish for DEV (with hot deployment in Azure DevOps)
* Upgrade version numbers in azure-devops-extension-dev.json and package.json (but not in azure-devops-extension.json; happens automatically)
* In the *.json files within the Widgets folder, make sure that the URIs ARE NOT preceded by "dist/"
* `npm run build:dev`
* `npm run publish-extension:dev`
* `DEBUG='express:*' webpack-dev-server --mode development`

## Build and publish for PROD (with hot deployment in Azure DevOps)
* In the *.json files within the Widgets folder, make sure that the URIs ARE preceded by "dist/"
* Upgrade version numbers in azure-devops-extension-dev.json and package.json (but not in azure-devops-extension.json; happens automatically)
* `npm run build`
* `npm run publish-extension`
