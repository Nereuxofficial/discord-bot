// Logger
const logger = require('./logger.js');

// Set up env vars
require('dotenv').config();

// discord.js
const Discord = require('discord.js');
const client = new Discord.Client();

// Config
const config = require('./config.json');

// On: Ready
client.on('ready', () => {
    logger.success('Bot is ready.');

    // Change the game
    client.user.setGame(config.game);
});

// Say hello to new users
client.on('guildMemberAdd', (member) => {
    // Send a super nice welcome message to the user
    member.send({
        embed: {
            color: 0xe67e22,
            author: {
                name: client.user.name,
                icon_url: client.user.avatarURL
            },
            title: 'Mail-Forwarder',
            url: 'https://mail-forwarder.space',
            description: 'Welcome on the official Mail-Forwarder discord! My prefix is `' + config.prefix + '`.'
        }
    });
});

// On: Message
client.on('message', (msg) => {
    // Author = bot?
    if(msg.author.id === client.user.id || message.author.bot) return;
    // Is it a command?
    if(message.content.indexOf(config.prefix) !== 0) return;
});

// Log in
client.login(process.env.BOT_TOKEN);
