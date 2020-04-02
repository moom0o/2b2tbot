const config = require("./config.json");
const Discord = require('discord.js');
const dbot = new Discord.Client({disableEveryone: true});
let cooldown = new Set();
let cdseconds = 3;
let joinseconds = 10;



var mineflayer = require('mineflayer');
var bot = mineflayer.createBot({
  host: config.ip, // Server IP for bot to connect to
  port: config.port,       // server port for bot to connect to
  username: config.username, // email for bot
  password: config.password,          // password for bot
  version: config.version, // version of server bot is trying to connect to
});
dbot.on("ready", async () => {
    console.log(`Discord bot ${dbot.user.username} is ready!`);

    dbot.user.setActivity("for chat messages", {type: "WATCHING"}); // Bot info
    dbot.user.setStatus('dnd') // Bot status dnd / online / idle
    bot.setControlState('forward', true) //bot goes forward for anti-afk PLEASE improve this in a pull request.

});
bot.on('login', () => {
    bot.chat(config.loginmessage) // message on login
    console.log(`Minecraft bot is ready!`);
});
// bot.on('message', msg => { 
//  dbot.guilds.get(config.guildid).channels.get(config.chatchannelid).send({embed: {
//    color: 3447003,
//    description: (msg.toString()) // embed for the chat in discord
//  }});
//    });
bot.on('chat', function(username, message) {
  if(!message.startsWith(config.prefix)) return;
  if(cooldown.has("active")){
	return console.log("active")
  }
  if (message.startsWith(config.prefix + 'coords')){
	console.log(username, message)
    if (username === bot.username) {
      return;
  }
    bot.chat(`My current coords are ${bot.entity.position.toString()}`)
  cooldown.add("active")
  setTimeout(() => {
    cooldown.delete("active")
  }, cdseconds * 1000)
}
  if (message.startsWith(config.prefix + 'sleep')){
    console.log(username, message)

  if (username === bot.username) {
      return;
  }
  if (bot.time.day >= 12541 && bot.time.day <= 23458) {
    bot.chat(`You can sleep right now.`)
    cooldown.add("active")
    setTimeout(() => {
      cooldown.delete("active")
    }, cdseconds * 1000)
  } else {
  bot.chat(`You can't sleep right now.`)
  cooldown.add("active")
  setTimeout(() => {
    cooldown.delete("active")
  }, cdseconds * 1000)
};
  }

  if (message.startsWith(config.prefix + 'time')){
    console.log(username, message)

  if (username === bot.username) {
      return;
  }
  if (bot.time.day >= 12541 && bot.time.day <= 23458) {
    bot.chat(`The world time in ticks is ${bot.time.day} and you can sleep right now.`)
    cooldown.add("active")
    setTimeout(() => {
      cooldown.delete("active")
    }, cdseconds * 1000)
  } else {
  bot.chat(`The world time in ticks is ${bot.time.day}, but you can't sleep right now.`)
  cooldown.add("active")
  setTimeout(() => {
    cooldown.delete("active")
  }, cdseconds * 1000)
};
  }
});
// bot.on('playerJoined', (player) => {
//   if (player.username !== bot.username) {
//     bot.chat(`Hello, ${player.username}! Welcome to the server.`)
//   }
// })
// bot.on('playerLeft', (player) => {
//   if (player.username === bot.username) return
//   bot.chat(`Bye ${player.username}`)
// })
dbot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;
  if(!message.channel.id == config.chatchannelid) return; // set to your discord channel id for the chat

  let prefix = config.prefix; //prefix for the bot commands like !send etc
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0]
  let args = messageArray.slice(1);
  let botmessage = args.join(" ");
  if(message.author.id == config.userid) { // Set to your user id on discord, or the commands wont work
  if(cmd === `${prefix}send`){
    bot.chat(botmessage)
    message.channel.send("sent")
  };
  if(cmd === `${prefix}look`){
    bot.look(botmessage,0,false);
  };
} else {
  message.channel.send("No permission, this command requires (BOT OWNER).")
} //
});
bot.chatAddPattern(/^([^ ]*) joined the game$/, 'join', 'join message')
bot.on('join', (username, message, type, rawMessage, matches) => {
  if(cooldown.has("joins")){
    return console.log("joins")
    }
  if (username === bot.username) return
  bot.chat(`> Welcome ${username} to a peaceful christian server, make sure to read the rules.`)
  cooldown.add("joins")
  setTimeout(() => {
    cooldown.delete("joins")
  }, joinseconds * 1000)
})
function bindEvents(bot) {

  bot.on('error', function(err) {
      console.log('Error attempting to reconnect: ' + err.errno + '.');
      process.exit(1)
      if (err.code == undefined) {
          console.log('Invalid credentials OR bot needs to wait because it relogged too quickly.');
      }
  });
}
bot.on('kicked', function(reason) {
  console.log("I got kicked for ", reason, " lol");
  });

  bot.on('end', function() {
    console.log("Bot has ended");
    process.exit(1)
});
bot.on('error', err => console.log(err));

dbot.login(config.token);
