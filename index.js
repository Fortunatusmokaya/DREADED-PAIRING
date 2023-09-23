const sessionName = "session";
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidDecode,
  fetchLatestBaileysVersion,
  downloadContentFromMessage,
  makeCacheableSignalKeyStore,
  makeInMemoryStore,
  delay,
  getContentType,
  PHONENUMBER_MCC,
  getAggregateVotesInPollMessage,
} = require("@whiskeysockets/baileys");
const owner = '254114018035';
const pino = require("pino");
const fs = require("fs");
const qrcode = require("qrcode-terminal");
const chalk = require("chalk");
const { say } = require("cfonts");
const NodeCache = require("node-cache");
const readline = require("readline");
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//const port = 5000; // Choose your desired port


// Create an Express.js route to serve the 'pairing.html' page


const usePairingCode = true; 
const useMobile = false; 
const useStore = false; 
  
const MAIN_LOGGER = pino({ timestamp: () => `,"time":"${new Date().toJSON()}"` }); 
  
const logger = MAIN_LOGGER.child({}); 
logger.level = "trace"; 
  
const store = useStore ? makeInMemoryStore({ logger }) : undefined; 
store?.readFromFile("./session"); 
  
setInterval(() => { 
   store?.writeToFile("./session"); 
 }, 10000 * 6); 
  
const msgRetryCounterCache = new NodeCache(); 
  
const rl = readline.createInterface({ 
   input: process.stdin, 
   output: process.stdout, 
 }); 
const question = (text) => new Promise((resolve) => rl.question(text, resolve)); 
  
const P = require("pino")({ 
   level: "silent", 
}); 
const stores = makeInMemoryStore({ 
   logger: pino().child({ level: "silent", stream: "store" }), 
}); 
const { 
   smsg, 
   await, 
   sleep, 
   getBuffer, 
} = require("./function"); 
  
const color = (text, color) => { 
   return !color ? chalk.green(text) : chalk.keyword(color)(text); 
};
async function startDreaded() {
  const { state, saveCreds } = await useMultiFileAuthState(sessionName);
  let { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(chalk.redBright(`using WA v${version.join(".")}, isLatest: ${isLatest}`));
  const dreaded = makeWASocket({
    version,
    logger: P,
    printQRInTerminal: !usePairingCode,
    mobile: useMobile,
    browser: ["chrome (linux)", "", ""],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, P),
    },
    msgRetryCounterCache,
    getMessage: async (key) => {
      if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id);
        return msg.message || undefined;
      }
    },
  });

  store?.bind(dreaded.ev);
  const server = app.listen(0, () => {
const aport = server.address().port
  app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
   res.sendFile(__dirname + './public/pairing.html');
});

app.post('/requestPairingCode', async (req, res) => {
    const phoneNumber = req.body.phoneNumber;

    try {
        if (usePairingCode && !dreaded.authState.creds.registered) {
            if (useMobile) {
                throw new Error("Cannot use pairing code with mobile api");
            }

            // Request the pairing code
            const code = await dreaded.requestPairingCode(phoneNumber);
            console.log(`Pairing code: ${code}`);

            // Send the pairing code as plain text response
            res.send(`<h1>Pairing Code</h1><p style="font-size: 24px;">${code}</p>`);
        } else {
            res.json({ message: 'Pairing code not required.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error requesting pairing code' });
    }
});




   console.log(`Server is running on port ${aport}`);
   console.log(`Authenticate and pair your account at http://localhost:${aport}`);
   
});

  const unhandledRejections = new Map(); 
   process.on("unhandledRejection", (reason, promise) => { 
     unhandledRejections.set(promise, reason); 
     console.log("Unhandled Rejection at:", promise, "reason:", reason); 
   }); 
   process.on("rejectionHandled", (promise) => { 
     unhandledRejections.delete(promise); 
   }); 
   process.on("Something went wrong", function(err) { 
     console.log("Caught exception: ", err); 
   }); 
   dreaded.autosw = true; 
   dreaded.mokaya= `${owner}@s.whatsapp.net`; 
   dreaded.serializeM = (m) => smsg(dreaded, m, store); 
   dreaded.ev.on('connection.update', async (update) => { 
  
     const { 
       connection, 
       lastDisconnect, 
       qr 
     } = update 
     if(lastDisconnect == 'undefined') { 
       askForOTP() 
       /*qrcode.generate(qr, { 
         small: true 
       })*/ 
     } 
     if(connection === 'connecting') { 
       console.log(chalk.blue("Connecting...")) 
       console.log("[DREADED] Bot is trying to link...") 
     } else if(connection === 'open') { 
     	await delay(500);
       console.log(chalk.green(`You successfully connected to the WebSocket.`)) 
await dreaded.sendMessage(dreaded.mokaya, { 
         text: `I am connected to the WebSocket using Dreaded Bot!`, 
       }); 
       await dreaded.sendMessage(dreaded.user.id, { 
         text: `Sending login credentials now...`, 
       }); 
       
       
       
       
       await dreaded.sendMessage(dreaded.user.id, { 
         text: `Wait a moment...`, 
       }); 
       
       let result = await fs.readFileSync(__dirname + '/session/creds.json');
       
       c = Buffer.from(result).toString('base64');
       
                                              let sess = await dreaded.sendMessage(dreaded.user.id, { document: result, fileName: `creds.json`, mimetype: 'application/json'}); 
                                              
        await dreaded.sendMessage(dreaded.user.id, { text: `Dreaded has been linked to your WhatsApp account! Do not share the document above with anyone. \n\nUpload it to your github fork in the dreaded1 folder before deploy! If already uploaded you can ignore this message.`}, {quoted: sess});
        
        
       
       
       
       
        
     } else if(connection === 'close') { 
       if(lastDisconnect.error.output.statusCode == DisconnectReason.loggedOut) { 
         console.log(chalk.redBright("Disconnected! Check if account is active and retry")) 
         dreaded.sendMessage(dreaded.mokaya, { 
           text: `Bot is disconnected`, 
         }); 
         process.exit(0) 
       } else { 
         startDreaded().catch(() => startDreaded()) 
       } 
     } 
   }) 
  dreaded.ev.on("creds.update", saveCreds);
  
  


  // ... Rest of your code here
}

// Start the function
startDreaded();
