
# Home Automation System
HAS management

## Technologies used
 - NodeJS
	 - Handle concurrent requests
 - MongoDB
	 - Has Horizontal scaling and sharding support. We can shard based on user id ranges.
- Express
	- minimal and flexible Node.js web application framework.

## Installation
 - Copy sample.env to .env file.
 - Add DB_URL (i.e mongodb URI), JWT_KEY, SALT (for password )
 - `npm install`
 - `npm run start`
 - All APIs will be served on port 5000 by default 

## Usage
- You can view all APIs+Examples in Postman by importing `docs/postman_collection.json`
- APIs supported:
	-  List all smart devices
	-  Add new smart device
	-  Perform an operation on a device
	-  Remove an installed device
- [Screenshots](https://docs.google.com/document/d/19bFnLSld1oi0LOSzmMtpMptX8LrNzMTjDd4-dc3igkU/edit?usp=sharing) 


