const fs = require('fs');
const path = require('path');

const languages = {
    en: require('../../languages/en.json'),
    fr: require('../../languages/fr.json'),
    pl: require('../../languages/pl.json')
};

function t(lang, key) {
    return languages[lang]?.[key] || languages['en'][key] || `missing: ${key}`;
}

module.exports = t;
