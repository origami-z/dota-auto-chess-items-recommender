const core = require('@actions/core')

core.warning('Some warning')
core.setOutput('Output', 'value of output')
core.setFailed('Oooops, something failed')