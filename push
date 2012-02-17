#!/bin/sh
# stop gap deployment, we'll do something fancy in the future
# and only deploy diffs from the repo (or something)

echo "Hang tight, super high tech deployment in process"
cd deploy && rsync -e ssh -av . shinydemos@shinydemos.com:/home/shinydemos/shinydemos.com
