var config = require('./config.json');
const fs = require("fs");
const Banchojs = require("bancho.js");
const { Console, error } = require('console');
//const { Message } = require("discord.js");
const client = new Banchojs.BanchoClient({ username: config.something, password: config.fuckyou, apiKey: config.somekey });

let lobby;
let beatmapid;
let skip_map_users;
let skipmapid;

client.connect().then(async () => {
    console.log("Online.");

    initbeatmap();
    // random beatmap id

    const channel = await client.createLobby("2007-2009 Maps (Auto map select) " + "[.help]");
    lobby = channel.lobby;
    const password = "somethingverylongidontknow1234"
    await Promise.all([lobby.setPassword(password), lobby.setMap(beatmapid)]);
    console.log("Lobby created! Name: " + lobby.name + ", password: " + password);
    console.log("Multiplayer link: https://osu.ppy.sh/mp/" + lobby.id);
    lobby.freemod = true;
    lobby.updateSettings();
    channel.sendMessage("!mp invite _Railgun_");
    channel.sendMessage("!mp addref _Railgun_");
    channel.sendMessage("!mp mods freemod");
    channel.sendMessage("!mp password");
    
    function informaton() {
        console.log("timer");
        if (lobby.playing == false){
            channel.sendMessage("Bot Dev Discord: Railgun#5065 | If u have questions or feature requests");
            lobby.updateSettings();
        }
       
      
    }
    var notif = setInterval(informaton, 120000);

    lobby.on("matchFinished", () => {
        randomBeatmap();
        lobby.setMap(beatmapid);
    });
    lobby.on("matchAborted", () => {
        randomBeatmap();
        lobby.setMap(beatmapid);
    });
    
 

    lobby.on("allPlayersReady", () => {
        channel.sendMessage("Everyone is ready, starting in 5sec.");
        lobby.startMatch(5);
    });

    lobby.on("beatmapId", () => {
        try {
            channel.sendMessage("Changed beamtap: " + lobby.beatmap.id);

            if (lobby.beatmap.mode != 0) {
                channel.sendMessage("Gamemode not STD, changing beatmap...");
                randomBeatmap();
                lobby.setMap(beatmapid);
                channel.sendMessage("Changed Beatmap");
            }
        } catch (err) {
            // console.log("error catched");
        }
    });

    lobby.on("invalidBeatmapId", () => {
        channel.sendMessage("changing beatmap, invalid beatmapID....");
        randomBeatmap();
        lobby.setMap(beatmapid);
        channel.sendMessage("Changed Beatmap");
    });
  
    client.on("PM", (message) => {
        if (message.self) return;
        console.log(`${message.user.ircUsername}: ${message.message}`)

        /*   if (message.user.ircUsername === "aaaaa") {
               if (message.message === "727") {
                   message.user.sendMessage("You just send wysi number, fuck u.");
                   //   client.disconnect();
               } else {
                   message.user.sendMessage("Message content is not expected.");
               }
           } else {
                message.user.sendMessage("User not Allowed.");
           }*/
        if (message.message.startsWith(".")) {
            if (message.message === ".help") {
                message.user.sendMessage("All Commands >> [.help] [.info]");
            }
            if (message.message === ".info") {
                message.user.sendMessage("A random Bot, Discord: Railgun#5065 | Made with Node.js");
            }
        } else {
            message.user.sendMessage("An userbot is currently running on this account, use .help to see available commands.");
        }
    });

    client.on("CM", (message) => {
        if (message.self) return;
        console.log("This was sent in one of currently listening channels: " + `${message.user.ircUsername}: ${message.message}`)

        if (message.message.startsWith(".")) {
            if (message.message === ".help") {
                channel.sendMessage("All Commands >> [.help] [.start] [.wait] [.skip] [.info] [.about]");
            }
            if (message.message === ".info") {
                channel.sendMessage("A random Bot, Discord: Railgun#5065 | Made with Node.js");
            }
            if (message.message === ".about") {
                channel.sendMessage("Random (all ranked) 2007-2009 maps, do .info for more");
            }

            if (message.message === ".wait") {
                if (lobby.playing == false) {
                    channel.sendMessage("!mp abort");
                } else {
                    channel.sendMessage("Map is already playing, won't abort");
                }
            }

            if (message.message === ".skip") {
                if (lobby.playing == false) {

                    randomBeatmap();
                    lobby.setMap(beatmapid);
                    channel.sendMessage("Changed Beatmap");
                } else {
                    channel.sendMessage("Can't change map, currently playing...");
                }
            }

            if (message.message === ".start") {
                if (lobby.playing == true) {
                } else {
                    lobby.startMatch(30);
                }
            }

            /*  if (message.message === ".size") {
                  channel.sendMessage("Size: " + lobby.slots.length);
              }*/
        }
    });
}).catch(console.error);

process.on("SIGINT", async () => {
    console.log("Closing lobby and disconnecting...");
    await lobby.closeLobby();
    await client.disconnect();
});
function initbeatmap() {
    fs.readFile("maps.txt", "utf-8", function (err, data) {
        if (err) {
            throw err;
        }

        // note: this assumes `data` is a string - you may need
        //       to coerce it - see the comments for an approach
        var lines = data.split('\n');

        // choose one of the lines...
        var line = lines[Math.floor(Math.random() * lines.length)]
        console.log("" + line);
        var line = lines[Math.floor(Math.random() * lines.length)]
        console.log("" + line);
        var line = lines[Math.floor(Math.random() * lines.length)]
        console.log("" + line);
        var line = lines[Math.floor(Math.random() * lines.length)]
        console.log("" + line);
        var line = lines[Math.floor(Math.random() * lines.length)]
        console.log("" + line);

        beatmapid = line;
        console.log("Random beatmap id: " + line);
    })
}

function randomBeatmap() {
    fs.readFile("maps.txt", "utf-8", function (err, data) {
        if (err) {
            throw err;
        }

        // note: this assumes `data` is a string - you may need
        //       to coerce it - see the comments for an approach
        var lines = data.split('\n');

        // choose one of the lines...
        var line = lines[Math.floor(Math.random() * lines.length)]

        beatmapid = line;
        console.log("Skipped beatmap to id: " + line);

       // channel.sendMessage("Changed Beatmap");
    })
}