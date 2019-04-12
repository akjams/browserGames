## Hopefully something like diep.io

### Technologies:
*   HTML5 Canvas
*   matter.js
*   TypeScript
*   socket.io

### Run
tsc client/index.ts && tsc server/server.ts && node server/server.js

### Notes
*   js files are ignored by .gitignore

### TODO
*   get a linter
*   put player/bullet objects in common directory shared between client and server. All objects impl a Sprite interface with tick() and render(). Figure out how to unmarshall them to typescript classes.
