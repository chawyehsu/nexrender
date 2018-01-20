'use strict'

const fs        = require('fs')

const license   = require('./tasks/license')
const setup     = require('./tasks/setup')
const download  = require('./tasks/download')
const rename    = require('./tasks/rename')
const filter    = require('./tasks/filter')
const patch     = require('./tasks/patch')
const render    = require('./tasks/render')
const verify    = require('./tasks/verify')
const actions   = require('./tasks/actions')
const cleanup   = require('./tasks/cleanup')

module.exports = (project, settings) => {
    if (!project.prepare) {
        return Promise.reject('you should provide an instance of @nexrender/project')
    }

    if (!settings.binary || fs.existsSync(settings.binary)) {
        return Promise.reject('you should provide a proper path to After Effects\' \"aerender\" binary')
    }

    settings.multiframes    = settings.multiframes  || '';
    settings.memory         = settings.memory       || '';
    settings.log            = settings.log          || '';
    settings.addlicense     = settings.addlicense   || false;
    settings.workdir        = settings.workdir      || process.env.TEMP_DIRECTORY || './temp';

    if (settings.addlicense) {
        license(settings)
    }

    return project.prepare()
        .then(project => setup(project, settings))
        .then(project => download(project, settings))
        .then(project => rename(project, settings))
        .then(project => filter(project, settings))
        .then(project => patch(project, settings))
        .then(project => render(project, settings))
        .then(project => verify(project, settings))
        .then(project => actions(project, settings))
        .then(project => cleanup(project, settings))
}
