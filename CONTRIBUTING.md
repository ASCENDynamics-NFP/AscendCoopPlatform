# Contributing to AscendCoopPlatform

Thank you for your interest in contributing to AscendCoopPlatform! We welcome contributions from the community and appreciate your help in making this project better. This guide will help you understand the contribution process and get started with your first contribution.

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Please take a moment to read it before continuing.

## Getting Started

1. **Fork the repository**: Navigate to the [AscendCoopPlatform repository](https://github.com/ASCENDynamics-NFP/AscendCoopPlatform) and click the "Fork" button in the upper right corner. This will create a copy of the repository under your own GitHub account.

2. **Clone your fork**: Clone your forked repository to your local machine using the following command:

   ```
   git clone https://github.com/your-username/AscendCoopPlatform.git
   ```

3. **Add the upstream remote**: Add the original repository as a remote named `upstream`:

   ```
   git remote add upstream https://github.com/ASCENDynamics-NFP/AscendCoopPlatform.git
   ```

   This will allow you to pull changes from the main repository and keep your fork up-to-date.

4. **Set up the development environment**: Follow the instructions in the [README.md](README.md) file to set up your local development environment. Installing dependencies (`npm install`) automatically sets up Git hooks. If you don't see them, run `npm run prepare`.

## Contributing Code

1. **Create a new branch**: Before making any changes, create a new branch for your feature or bugfix:

   ```
   git checkout -b my-feature-branch
   ```

2. **Make your changes**: Implement your feature or bugfix in the new branch, following the project's coding conventions and ensuring that your changes don't break any existing functionality or introduce new bugs.

3. **Commit your changes**: Commit your changes with a descriptive commit message:

   ```
   git commit -m "Add my new feature"
   ```

4. **Pull the latest changes from upstream**: Before pushing your changes, pull the latest changes from the main repository to avoid merge conflicts:

   ```
   git pull upstream main
   ```

   If you encounter any conflicts, resolve them and commit the merged changes.

5. **Push your branch to your fork**: Push your branch to your forked repository:

   ```
   git push origin my-feature-branch
   ```

6. **Open a pull request**: Navigate to the [AscendCoopPlatform repository](https://github.com/ASCENDynamics-NFP/AscendCoopPlatform) and click the "New pull request" button. Select your fork and branch in the "compare" dropdown, and make sure the base repository and branch are correct. Fill out the pull request template with a description of your changes and any relevant context.

7. **Address feedback**: The project maintainers may request changes or provide feedback on your pull request. Make any necessary changes in your local branch, commit them, and push the updates to your fork. The pull request will be automatically updated.

8. **Wait for your pull request to be merged**: Once your changes have been reviewed and approved, a project maintainer will merge your pull request. Congratulations, you've successfully contributed to AscendCoopPlatform!

## Reporting Issues

If you encounter a bug or have a feature request, please [open a new issue](https://github.com/ASCENDynamics-NFP/AscendCoopPlatform/issues/new) in the repository. Use the provided issue templates to ensure that you include all the necessary information. This will make it easier for the project maintainers to understand and address the issue.

## Updating Documentation

Documentation is a crucial aspect of any project. If you find any errors, outdated information, or areas that could use improvement, please submit a pull request following the steps outlined in the "Contributing Code" section above. When making changes to the documentation, make sure to use clear and concise language, and adhere to the project's documentation style guide if one is available.

## Asking Questions and Getting Help

If you have questions about the project or need help with a problem, you can [open a new discussion](https://github.com/ASCENDynamics-NFP/AscendCoopPlatform/discussions/new) in the repository or reach out to the project maintainers.

## Community

We encourage you to join our community and engage with other contributors and users. Share your ideas, ask for help, and collaborate on new features and improvements. By participating in our community, you will not only contribute to the project but also learn and grow as a developer.

Thank you for your interest in contributing to AscendCoopPlatform! We appreciate your support and look forward to building a better platform together.
