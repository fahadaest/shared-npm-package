# Points React - Shared Components

**`Points React`** is a collection of reusable React components by Pointis team.

## Installation

```bash
npm install @pntis/pointis-react
```

## Pointing to GitHub NPM repo

Either create .npmrc file, specify repo via npm install command line parameter, or configure package.json accordingly.

.npmrc contents:
```bash
@pntis:registry=https://npm.pkg.github.com
```

via command line:

```bash
npm install @pntis/shared-react --registry=https://npm.pkg.github.com
```

## GitHub Login

To use this package, make sure you logged in with a GitHub account that has access to the private repository:

```bash
npm login --scope=@pntis --auth-type=legacy --registry=https://npm.pkg.github.com

# user name: your github name
# password: your github PAT 
```

Note: PAT is NOT user password. You can create it in your Settings. Make sure access is given to read packages.


