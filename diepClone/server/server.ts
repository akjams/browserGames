import * as express from 'express';
import { AddressInfo } from 'net';

import { Sprite } from '../shared/Sprite';
import { GameServer } from './GameServer';

let app: express.Application = express();
let expressServer = app.listen(80, () => {
  let addressInfo: AddressInfo = <AddressInfo> expressServer.address();
  console.log(`listening at ${addressInfo.address}:${addressInfo.port}`)
});

app.use(express.static('public'));

new GameServer(expressServer);
