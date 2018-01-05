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
});

// Log in
client.login(process.env.BOT_TOKEN);
