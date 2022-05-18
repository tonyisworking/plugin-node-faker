## Faker for Pattern Lab-Node

This is a plugin that adds Faker data to your `data.json` file at build time.

## Compatibility
This version (v2.\*) of the plugin is tested to be compatible with [@pattern-lab/patternlab-node v5.9.2](https://github.com/pattern-lab/patternlab-node/tree/v5.9.2). It will likely be compatible with future v5.* version.

For [@pattern-lab/patternlab-node v2.12](https://github.com/pattern-lab/patternlab-node/tree/v2.12.0) please refer to version 1.* of this plugin.

## Install

```bash
npm install --save @tonyisworking/plugin-node-faker
npm run pl:install @tonyisworking/plugin-node-faker
```

If `patternlab-config.json` isn't updated add this to enable the plugin:

```
 "plugins": {
    "@tonyisworking/plugin-node-faker": {
      "enabled": true,
      "initialized": false,
      "options": {
        "tabsToAdd": []
      }
    }
  }
```


## Usage

In `data.json`, add Faker API methods as strings. Call the vars as you normally would inside Mustache (untested with other PL engines).

```
{
  "company" : {
    "name" : "@faker.name.findName@",
    "url" : "@faker.internet.url@"
  }
}
```

## Some common Faker API methods

```
@faker.[SECTION].[PROPERTY]([OPTIONS])@ // `options` and parenthesis are optional
@faker.name.findName@ // returns 'Neal Considine'
@faker.name.firstName@ // returns 'Jaron'
@faker.name.lastName@ // returns 'Will'
@faker.internet.url@ // returns 'https://heath.org'
@faker.lorem.paragraph@ // returns paragraph
@faker.lorem.words(5)@ // returns 5 words
@faker.lorem.text(500)@ // returns random number of characters less than 500. Could be 20 chars. Could be 200.
```

Check out Faker on NPM for all the different API methods (https://www.npmjs.com/package/faker). I've found Marak's Github wiki to be a little more detailed though (https://github.com/Marak/Faker.js/wiki).

## Work in process

A tale of two listeners. For some reason, I can't update the listitems object and the pattern-specific data object with one listener. `data.json` doesn't care where it's changed, but these other two get operated on in different places.
