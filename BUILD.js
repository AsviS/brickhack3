/**
 * This file contains compilation and build rules for the project. This file
 * is imported by the gulpfile during compilation and build.
 * For build system: 3.1.0
 */

module.exports = {
  GULPFILE_VERSION: "3.1.0",
  DEFAULT_TASKS: ['js-lint'],
  JS_LINT_RULES: [
    {
      name: 'server side javascript',
      sourceFiles: [
        './lib/**/*.js',
        './server.js'
      ]
    },
    {
      name: 'client side game javascript',
      sourceFiles: [
        './public/js/**/*.js'
      ]
    },
    {
      name: 'shared javascript files',
      sourceFiles: [
        './shared/*.js'
      ]
    }
  ]
};
