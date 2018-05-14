const Countries = (() => { // eslint-disable-line no-unused-vars
  const me = {};

  const queryTypes = {
    allExcept: 'all except',
    only: 'only'
  };

  const modes = {
    blacklist: 'blacklist',
    whitelist: 'whitelist'
  };

  me.modes = modes;

  // parses a given input string
  me.parse = function(input) {
    const parsed = {
      countries: [],
      comments: {},
      mode: ''
    };

    if (!input) {
      return parsed;
    }
    const lines = input.split('\n');
    if (!lines) {
      return parsed;
    }

    for (let i = 0; i < lines.length; i++) {
      // Filter out lines that start with comments
      if (lines[i].startsWith('//') || lines[i] === '' || lines[i] === '\n') {
        continue;
      }

      // Set the mode if it is not set yet
      if (!parsed.mode) {
        if (lines[i].startsWith(queryTypes.allExcept)) {
          parsed.mode = modes.blacklist;
        } else if (lines[i].startsWith(queryTypes.only)) {
          parsed.mode = modes.whitelist;
        }
        continue;
      }

      const data = lines[i].split(/\/\/ (.+)?/, 2);
      const countries = this.normalizeArray(data[0].split(','));
      const comments = data[1];

      for (let i = 0; i < countries.length; i++) {
        parsed.countries.push(this.normalize(countries[i]).replace(/"/g, ''));
      }

      if (comments) {
        parsed.comments[countries[countries.length - 1]] = comments.replace(' ', '');
      }
    }

    return parsed;
  };

  // parses a java file (used by StreetComplete)
  me.parseJava = function(input) {
    let mode;

    if (input.includes('Countries.noneExcept')) {
      mode = 'Countries.noneExcept';
    } else if (input.includes('Countries.allExcept')) {
      mode = 'Countries.allExcept';
    } else {
      throw new TypeError('This file is not valid and contains no black- or whitelist!');
    }

    const allAfterMethod = input.split(mode)[1];
    const allInsideMethod = allAfterMethod.split('}')[0];
    const countries = this.normalizeJavaCountries(allInsideMethod.split('{')[1].split('\n'));

    let finalString = '';

    if (mode.includes('noneExcept')) {
      finalString += queryTypes.only;
    } else {
      finalString += queryTypes.allExcept;
    }
    finalString += '\n';

    for (let i = 0; i < countries.length; i++) {
      if (countries[i] === '') {
        continue;
      }
      finalString += countries[i];
      finalString += '\n';
    }
    return finalString;
  };

  // stringify a given input object
  me.stringify = function(input) {
    let finalString = '';

    if (input.mode === modes.blacklist) {
      finalString += `${queryTypes.allExcept}\n`;
    } else if (input.mode === modes.whitelist) {
      finalString += `${queryTypes.only}\n`;
    }

    for (let i = 0; i < input.countries.length; i++) {
      finalString += `${input.countries[i]},`;
      if (input.comments[`${input.countries[i]}`]) {
        finalString += ` // ${input.comments[`${input.countries[i]}`]}\n`;
      }
    }

    return finalString;
  };

  me.normalize = function(value) {
    return value.replace(/ /g, '').replace(/\t/g, '');
  };

  me.normalizeArray = function(array) {
    const tempArray = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i] === '' || array[i].length < 2 || !array[i].match('[a-zA-Z]+')) {
        continue;
      }
      tempArray.push(this.normalize(array[i]));
    }
    return tempArray;
  };

  me.normalizeJavaCountries = function(array) {
    const tempArray = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i] === '') {
        continue;
      }
      tempArray.push(array[i].replace(/\/\//, '//').replace(/\t/g, ''));
    }
    return tempArray;
  };

  return me;
})();
