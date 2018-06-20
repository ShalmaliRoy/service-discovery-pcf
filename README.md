Service-discovery-pcf is  a middleware, which helps to discover other available services in cloud foundry at runtime. The library checks for  all services heaertbeat in cloud foundry with environment node and cache in services for 30 minutes. 

NOTE
 
 Although the library scans for all services, but will only show those services matching the patterns and cache in . This is done to enhance performance by not caching  unrelated services.
 
 The package is not reliant on seneca but is a substitute for seneca-mesh which does not work with cloud foundry and can scan for services at run time.

 
 Installation

 npm install service-discovery-pcf
 
 
 API
 
 Service(opts)
 
 Service-discovery-cf accepts options which can  contain objects domain user and password. However, this is optional as it can also read from manifest file  properties process.env.DOMAIN,process.env.NAME,process.env.PASSWORD

 .find(pins)
 
 Accepts  seneca standard patterns/pins in an array format [{pin:'cmd:test'}]
 
 
 Usage
 
 A complete example can be found in the example folder.
 
 
const Service = require('service-discovery-pcf');

const service = new Service({ domain: 'https://api.run.pivotal.io', name: '*', password: '*' });



app.use(service.find([{ pin: 'role:test' }]));


    seneca.client = seneca.client(args.request$.clientUrl.get('role:test'));
    seneca.act('role:test,cmd:test', callback);






 
 
 