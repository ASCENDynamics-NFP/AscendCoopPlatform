# Ascend Co-op Platform

Ascend Co-op Platform is an open-source platform built using Ionic and Firebase, aimed at fostering collaboration and growth for worker-owned cooperatives, nonprofit organizations, and private organizations. It offers features like user profiles, group management, real-time data, and collaboration tools to address various challenges and facilitate communication between organizations.

For a deeper look at the application layout and how the frontend communicates with Firebase, see [docs/architecture.md](docs/architecture.md).


## Development

This project uses a continuous development process. As changes are made, they are immediately deployed to a development environment.

### Running Tests

To execute the unit tests for both the Angular application and Firebase functions run:

```bash
npm run test
```

This command will build the project and run all Jasmine and Mocha tests.

## Latest Development Environment

You can view the latest version of the application in the development environment at the following link:

[Latest Development Environment Version](https://ascendcoopplatform-dev.web.app/)

We welcome QA contributions, bug reports, and discussions. Please feel free to create issues and discussions in this GitHub repository if you find any problems or have suggestions for improvements.

## Connect With Us

Join our community and participate in discussions about the Ascend Co-op Platform. We have active communities on the following platforms:

- [Facebook Group](https://www.facebook.com/groups/ascendynamics)
- [LinkedIn Page](https://www.linkedin.com/company/ascendynamics-nfp)
- [Join our Slack workspace](https://join.slack.com/t/ascendynamicsnfp/shared_invite/zt-1vkqh53sw-BchYV8NmOhOOkRIp8~L~xw)

We look forward to your contributions and engaging discussions!

## Features

- Worker-Owned Cooperative Incubator

  - Identify skill sets needed for worker-owned businesses
  - Connect skilled individuals with worker-owned businesses
  - Provide various services such as technical assistance and advice

- Collaboration Platform

  - User and organization profiles
  - Group creation and management
  - Real-time data to address issues
  - Collaboration features, such as event proposals, voting, and commenting

- Utopian Think Tank
  - Collaborate with organizations and research
  - Address basic human needs
  - Develop community-based solutions

## Getting Started

### Prerequisites

- Node.js and npm
- Ionic CLI
- Firebase CLI (for deployment)

1. Install Node.js, npm, Ionic CLI, and Angular CLI on your development machine.
2. Clone this repository: `git clone https://github.com/ASCENDynamics-NFP/AscendCoopPlatform.git`
3. Change to the project directory: `cd AscendCoopPlatform`
4. Install dependencies: `npm install` (Git hooks are installed automatically). If you don't see them, run `npm run prepare`.
5. Create `.env.development` (and optionally `.env.production`) with your Firebase credentials. The file should define variables such as `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_DATABASE_URL`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID`, `FIREBASE_MEASUREMENT_ID`, and `FIREBASE_API_URL`.
6. Run `npm run generate-env:dev` (or `NODE_ENV=development node generate-env.js`) to generate `src/environments/environment.ts`. Use `npm run generate-env:prod` for production.
7. Run the development server: `ionic serve`
8. Open your browser and navigate to `http://localhost:8100/` to view the app.

### Local environment variables

The `generate-env.js` script reads values from `.env.development` when generating `src/environments/environment.ts`. Make sure your `.env.development` file exists locally and contains your Firebase keys. These `.env` files are ignored by Git so your credentials remain private. If `src/environments/environment.ts` is missing, re-run `npm run generate-env:dev` before starting the app.

## [Contributing](CONTRIBUTING.md)

We welcome contributions from the community. To get started, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix: `git checkout -b my-feature-branch`
3. Make your changes and commit them with a descriptive commit message.
4. Push your branch to your fork: `git push origin my-feature-branch`
5. Open a pull request against the main repository.

Please follow the project's coding conventions and ensure that your changes don't break any existing functionality or introduce new bugs. For more information on the contribution process, please see our [CONTRIBUTING.md](CONTRIBUTING.md) file.

License
This project is licensed under the AGPL License. For more details, see the [LICENSE](https://opensource.org/license/agpl-v3) file.

Support
If you have any questions or need help with the project, please open an issue on the GitHub repository or reach out to the project maintainers.
