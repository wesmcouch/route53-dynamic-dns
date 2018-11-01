# Route 53 Dynamic DNS

This repo serves to 'roll your own' dynamic dns service with a domain you already own that is up and running in route53. This allows you to update the IP address behind a DNS name when you are not on a static IP address. The service runs in a docker container for easy deployment wherever is best suited.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Install

```
Docker
```

### Installing

To install this service, build the docker container using the following command.

```
docker build -t wesmcouch/route53-dynamic-dns .
```

## Deployment

To run the service, you will need to pass certain environment variables into the docker container. The required environment variables include:

#### Hosted Zone ID

Hosted zone ID of the domain. This can be found at https://console.aws.amazon.com/route53/home#hosted-zones:

```
-e HOSTED_ZONE_ID='/hostedzone/<hostedZoneId>'
```

#### Resource Name

Resource name of the A record that will be updated in the event of an IP address change.

![Record Name](https://raw.githubusercontent.com/wesmcouch/route53-dynamic-dns/master/docs/recordset.png)

```
-e RECORD_NAME='<recordName>'
```

### Running

Example:
```
docker run --name route53-dynamic-dns -d -e HOSTED_ZONE_ID='/hostedzone/123123123123' -e RESOURCE_NAME='home.example.com.' -e AWS_ACCESS_KEY_ID='LSKDJF0191283102983' -e AWS_SECRET_ACCESS_KEY='lksdjfljoiwjefo29034820398420948' wesmcouch/route53-dynamic-dns
```

## Contributing

Please open a pull request!

## Authors

* **Wes Couch** - *Initial work* - [wesmcouch](https://github.com/wesmcouch)

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details
