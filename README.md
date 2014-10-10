Rise Vision Common i18n
==============

**Copyright © 2014 - Rise Vision Incorporated.**

*Use of this software is governed by the GPLv3 license (available in the LICENSE file).*

## Introduction
Common i18n files to be shared across Rise Vision apps, widgets and components.

## Built With

- *NPM*
- *Gulp*
- *Bower*


## Development

### Local Development Environment Setup and Installation

1. Install node dependencies `$ npm install`

2. Install front-end dependencies `$ bower install`

## Development Notes
All translation files go under `/src/locales/{lang}`, where {lang} should be replaced with the language code the translation file applies to. The file extension must be .json.


### Run Local
Run `$ gulp` to see a list of available tasks.


## Build
To build run `$gulp build`. This will generate a `dist` folder with a `locales` folder, containing a combined and minified json file for each locale, named translation_{lang}.json.


## Usage
Install the common-i18n using bower `$ bower install git://github.com/Rise-Vision/common-i18n --save`

The `dist` folder contains the minified version of the `src/locales` folder.

An i18n.js file is provided, which contains an Angularjs module with the necessary dependencies on angular-translate and the static-files plugin. This module can be plugged-in as a dependency on the Angularjs application or component that needs translation of messages.

### Dependencies
- Angularjs
- Angular translate
- Angular translate loader static files


## Submitting Issues
If you encounter problems or find defects we really want to hear about them. If you could take the time to add them as issues to this Repository it would be most appreciated. When reporting issues please use the following format where applicable:

**Reproduction Steps**

1. did this
2. then that
3. followed by this (screenshots / video captures always help)

**Expected Results**

What you expected to happen.

**Actual Results**

What actually happened. (screenshots / video captures always help)

## Contributing
All contributions are greatly appreciated and welcome! If you would first like to sound out your contribution ideas please post your thoughts to our [community](http://community.risevision.com), otherwise submit a pull request and we will do our best to incorporate it

### Suggested Contributions
- *we need this*
- *and we need that*
- *we could really use this*

## Resources
If you have any questions or problems please don't hesitate to join our lively and responsive community at http://community.risevision.com.

If you are looking for user documentation on Rise Vision please see http://www.risevision.com/help/users/

If you would like more information on developing applications for Rise Vision please visit http://www.risevision.com/help/developers/.

**Facilitator**

[Francisco Vallarino](https://github.com/fjvallarino "Francisco Vallarino")
