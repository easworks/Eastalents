# Eastalents Frontend

### Requirements

1. node 20+
2. pnpm package manager
3. nx cli

### Development

1. Clone the repo
2. `pnpm i` to install dependencies
3. `nx serve web-client` to serve the angular app


### Folder Structure

- apps - for applications
- libs - for libraries

- libs/models - critical types and interfaces for the app
- libs/shared/assets - assets that may be shared across apps
- libs/shared/styles - styles that may be shared across apps
- libs/app-shell - library containing angular components, directives, services or other frontend utils, that may be shared across apps

- apps/web-client - angular application

### General Instructions

>  when writing code, use indentation of 2 spaces

#### Component authoring

- always use standalone components
- always use `OnPush` change detection
- prefer using signals and other latest features of angular

#### Styles
- our main tailwind config lives at [libs/shared/styles/src/tailwind.config.js](libs/shared/styles/src/tailwind.config.js)
- applications also have their own tailwind configs which extend the main tailwind config
- we use 2 files to customize angular material
  - [libs/shared/styles/src/material.scss](libs/shared/styles/src/material.scss) contains the code that import material styles for components
  - [libs/shared/styles/src/material.overrides.less](libs/shared/styles/src/material.overrides.less) contains the code that customizes material,
  - we use the available css properties from angular material, and tailwind utilities to get a tailor-made appearance
- prefer using tailwind styles or utilities over custom css, unless unavoidable
- do not change global styles without consulting the team
