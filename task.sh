#!/bin/bash
FILE_NAME=$1
if [ ! -f $FILE_NAME ]; then
    echo "File ${FILE_NAME} not found"
    echo "Exit."
    exit 1
fi

# Read definition.json
DEFINITION=""
while IFS='' read -r line || [[ -n "$line" ]]
do 
    DEFINITION+="$line"
done < "$1"

# Configure
task="room"
bridge="bridge"
cluster="room-cluster"
service="room-service"

# Run aws ecs
# register task definition
echo "Register task definition"
aws ecs register-task-definition \
    --family "$task" \
    --network-mode "$bridge" \
    --container-definitions "$DEFINITION" >> temp.json 

revision="$( bash <<EOF
jq -r '.taskDefinition.revision' temp.json
EOF
)"

rm temp.json

# stop old task
echo "Stop old task"
aws ecs list-tasks \
    --cluster "$cluster" \
    --family "$task" >> temp.json

arn="$( bash << EOF
jq -r '.taskArns[0]' temp.json
EOF
)"

rm temp.json

aws ecs stop-task \
    --cluster "$cluster" \
    --task "$arn"

# run new task
echo "Run new task"
aws ecs run-task \
    --cluster "$cluster" \
    --task-definition "$task:$revision" \
    --count 1

# update service
echo "Update service"
aws ecs update-service \
    --cluster "$cluster" \
    --service "$service" \
    --task-definition "$task:$revision" \
    --desired-count 1 \
    --deployment-configuration maximumPercent=200,minimumHealthyPercent=50
