# Firejail profile for Node.js (adapted for pptr-gpt)
# Minimum restrykcji, bazuje na nodejs-common.profile

# Persistent local customizations
#include nodejs-common.local
# Persistent global definitions
# added by caller profile
# include globals.local

blacklist ${RUNUSER}

ignore read-only ${HOME}/.npm-packages
ignore read-only ${HOME}/.npmrc
ignore read-only ${HOME}/.nvm
ignore read-only ${HOME}/.yarnrc

noblacklist ${HOME}/.node-gyp
noblacklist ${HOME}/.npm
noblacklist ${HOME}/.npmrc
noblacklist ${HOME}/.nvm
noblacklist ${HOME}/.yarn
noblacklist ${HOME}/.yarn-config
noblacklist ${HOME}/.yarncache
noblacklist ${HOME}/.yarnrc

ignore noexec ${HOME}
include allow-bin-sh.inc

include disable-common.inc
include disable-exec.inc
include disable-programs.inc
include disable-shell.inc
include disable-X11.inc
include disable-xdg.inc

# custom: allow pptr-gpt
#whitelist ${HOME}/.nvm/versions/node/v22.14.0/bin/pptr-gpt
whitelist ${HOME}/.nvm/versions/node/v22.14.0/bin/node
whitelist ${HOME}/.nvm/versions/node/v22.14.0/lib/node_modules
whitelist ${HOME}/.npm
whitelist ${HOME}/.cache/puppeteer

# whitelist lokalny katalog projektu i node
whitelist ${HOME}/mega/work/mapet
whitelist /usr/bin/node
whitelist ${HOME}/mega/work/mapet/index.js
whitelist ${HOME}/mega/work/mapet/node_modules
whitelist ${HOME}/mega/work/mapet/src
whitelist /usr/share/doc/node
whitelist /usr/share/nvm
whitelist /usr/share/systemtap/tapset/node.stp
include whitelist-runuser-common.inc
