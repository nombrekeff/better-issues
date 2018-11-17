class Settings {
  static sync (github, repo, config) {
    return github.repos.getContent({
      owner: repo.owner,
      repo: repo.repo,
      path: Settings.FILE_NAME
    }).then(res => {
      return new Settings(github, repo, config).update()
    })
  }

  constructor (github, repo, config) {
    this.github = github
    this.repo = repo
    this.config = config
  }

  update () {
    return Promise.all(Object.entries(this.config).map(([section, config]) => {
      const debug = { repo: this.repo }
      debug[section] = config

      const Plugin = Settings.PLUGINS[section]
      return new Plugin(this.github, this.repo, config).sync()
    }))
  }
}

Settings.FILE_NAME = '.github/better-issues.yml'

Settings.PLUGINS = {
  labels: require('./plugins/labels'),
}

module.exports = Settings