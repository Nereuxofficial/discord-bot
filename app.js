// Logger
const logger = require('./logger.js');

// Set up env vars
require('dotenv').config();

// discord.js
const Discord = require('discord.js');
const client = new Discord.Client();

// Config
const config = require('./config.json');

// Error reply
var errorReply = function(error, msg) {
    msg.reply({
        embed: {
            color: 0xe74c3c,
            author: {
                name: client.user.name,
                icon_url: client.user.avatarURL
            },
            description: error
        }
    });
};

// Is the user a bot master/moderator
var isUserModerator = function(member) {
    if(member.roles.some(role => config.botMasterRoles.includes(role.name))) {
        return true;
    } else {
        return false;
    }
};
// Not enough permissions reply
var nepReply = function(msg) {
    errorReply('Not enough permissions!', msg);
};

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
    if(msg.author.id === client.user.id || msg.author.bot) return;
    // Is it a command?
    if(msg.content.indexOf(config.prefix) !== 0) return;

    // Command
    const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Command handler
    switch(command) {
        // Normal Commands
        // Command: Help
        case 'help':
            msg.reply({
                embed: {
                    color: 0xe67e22,
                    author: {
                        name: client.user.name,
                        icon_url: client.user.avatarURL
                    },
                    description: 'Heres a list of all commands.',
                    fields: [
                        {
                            name: config.prefix + 'info',
                            value: 'Shows you some informations about Mail-Forwarder and this bot.'
                        }
                    ]
                }
            });
            break;
        // Command: Info
        case 'info':
            msg.reply({
                embed: {
                    color: 0xe67e22,
                    author: {
                        name: client.user.name,
                        icon_url: client.user.avatarURL
                    },
                    description: '[Mail-Forwarder](https://mail-forwarder.space) is a service which forwards your mails securely to your real e-mail-address. All of our services are [open source](https://github.com/mail-forwarder). Feel free to submit a pull request!'
                }
            });
            break;

        // Moderator commands
        // mod_help command
        case 'mod_help': {
            if(!isUserModerator(msg.member)) {
                nepReply(msg);
            } else {
                msg.reply({
                    embed: {
                        color: 0x3498db,
                        author: {
                            name: client.user.name,
                            icon_url: client.user.avatarURL
                        },
                        description: 'Heres a list of all moderator commands.',
                        fields: [
                            {
                                name: config.prefix + 'kick {@Person} {Reason}',
                                value: 'Kick a person from the discord'
                            }
                        ]
                    }
                });
            }
            break;
        }
        // kick command
        case 'kick':
            if(!isUserModerator(msg.member)) {
                nepReply(msg);
            } else {
                // Get the member and check if kickable
                let member = msg.mentions.members.first();
                if(!member) return errorReply('User is invalid!', msg);
                if(!member.kickable) return errorReply('User isnt kickable!', msg);

                // Get the reason
                let reason = args.slice(1).join(' ');
                if(!reason) return errorReply('Please submit a reason!', msg);

                // Kick the person
                member.kick(reason);
                msg.reply({
                    embed: {
                        color: 0x3498db,
                        author: {
                            name: client.user.name,
                            icon_url: client.user.avatarURL
                        },
                        description: 'Kicked user ' + member.user.tag + ' because of ' + reason
                    }
                });
            }
            break;

        // Command not found
        default:
            errorReply('The command `' + command + '` doesnt exists!', msg);
            break;
    }
});

// Log in
client.login(process.env.BOT_TOKEN);
