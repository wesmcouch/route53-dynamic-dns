const publicIp = require('public-ip');
const AWS = require('aws-sdk');
const route53 = new AWS.Route53({
    region: 'us-east-1'
});

const hostedZoneId = process.env.HOSTED_ZONE_ID;
const resourceName = process.env.RESOURCE_NAME;
const interval = process.env.INTERVAL | 60000;

if (!hostedZoneId) {
    throw new Error('Please set the environment variable HOSTED_ZONE_ID to the hosted zone id of the route53 zone');
}
if (!resourceName) {
    throw new Error('Please set the environment variable RESOURCE_NAME to the resource name in the hosted zone');
}

console.log(`Hosted Zone ID: ${hostedZoneId}`);
console.log(`Resource Name: ${resourceName}`);
console.log(`Interval set to refresh every ${interval} milliseconds. To modify this set INTERVAL environment variable`);;

const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
}

const updateIp = (recordSet) => {
    var params = {
        ChangeBatch: {
            Changes: [{
                Action: 'UPSERT',
                ResourceRecordSet: recordSet
            }]
        },
        HostedZoneId: hostedZoneId
    };
    route53.changeResourceRecordSets(params, (err, data) => {
        if (err) console.log(err, err.stack);
    });
};

let connectionEstablished = false;

const checkIfUpdateNeeded = () => {
    route53.listResourceRecordSets({
        HostedZoneId: hostedZoneId
    }, (err, data) => {
        if (err) {
            if (err.code === 'CredentialsError') {
                throw new Error(err.message);
            } else {
                console.log(err, err.stack);
            }
        } else {
            if (!connectionEstablished) {
                connectionEstablished = true;
                console.log('Connection established to AWS');
            }
            data.ResourceRecordSets.forEach(record => {
                if (record.Name === resourceName) {
                    record.ResourceRecords.forEach(value => {
                        publicIp.v4().then(ip => {
                            if (value.Value !== ip) {
                                console.log(`Updating IP address to ${ip}`);
                                value.Value = ip;
                                updateIp(record);
                            }
                        });
                    })
                }
            });
        }
    });
}

const run = () => {
    checkIfUpdateNeeded();
    sleep(interval).then(() => {
        run();
    })
}

run();