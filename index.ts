import {
    TunnelManagementHttpClient,
    TunnelRequestOptions,
} from '@microsoft/dev-tunnels-management';
import {
    Tunnel,
    TunnelConnectionMode,
    TunnelAccessControlEntryType,
    TunnelAccessControlEntry,
    TunnelAccessControl,
    TunnelPort,
} from '@microsoft/dev-tunnels-contracts';
import {
    TunnelRelayTunnelHost,
    TunnelRelayTunnelClient,
} from '@microsoft/dev-tunnels-connections';
import * as https from 'https';
import * as http from 'http';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { unescapeLeadingUnderscores } from 'typescript';
import { SshStream, TraceLevel } from '@microsoft/dev-tunnels-ssh';


connect();

async function connect(){
    const userAgent = { name: 'YourAppName', version: '0.0.1' };

    // Adding a proxy agent - comment out if you do not need one

   /* const agent = new HttpsProxyAgent('http://127.0.0.1:8080');

    var options = {
        port: 8080,
        rejectUnauthorized: false,
        headers: {
          Host: "www.example.com"
        }
      };
      http.get(options, function(res) {
        res.pipe(process.stdout);
      }); */

    let tunnelManagementClientImpl = new TunnelManagementHttpClient(
        userAgent,
        // get the token for the tunnel you are hosting and paste it here
        () => Promise.resolve('tunnel token'),
        undefined,
        // adding optional parameter for passing in the agent - if you have no proxy agent then comment out 
        //agent,
    );

    tunnelManagementClientImpl.trace = console.log;
    
    const tunnel: Tunnel = {
        tunnelId: '__', //add your unique tunnelID here
        clusterId: 'usw2',
    };

    let tunnelRequestOptions: TunnelRequestOptions = {
        tokenScopes: ['connect'],
    };

    let tunnelInstance = await tunnelManagementClientImpl.getTunnel(tunnel, tunnelRequestOptions);
    
    // creates the trace that we pass in to get the logs
    let tunnelRelayTrace = (level: TraceLevel, eventId: number, msg: string, err?: Error) => console.log(msg);
    
    let tunnelRelayTunnelClient = new TunnelRelayTunnelClient(tunnelRelayTrace, tunnelManagementClientImpl);
    
    tunnelRelayTunnelClient.trace = console.log;

    var result = await tunnelRelayTunnelClient.connectClient(tunnelInstance!, tunnelInstance!.endpoints!);
}


