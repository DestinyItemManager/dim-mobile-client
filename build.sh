#!/bin/bash
# Usage: build.sh 'platform'
gulp build
ionic emulate $*
