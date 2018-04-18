#!/usr/bin/env bash
output="$( bash <<EOF
aws ecr get-login --no-include-email --region ap-southeast-1
EOF
)"
$output