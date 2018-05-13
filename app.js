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
    client.user.setActivity(config.game); //Set the current game //updated to setActivity

    // Say hello
    client.channels.find('name', config.channels.botCommands).send({
        embed: {
            color: 0x2ecc71,
            author: {
                name: client.user.name,
                icon_url: client.user.avatarURL
            },
            description: 'Hello world!'
        }
    });
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
    if(msg.author.id =="212888890762067968"){

        msg.reply(":spy: WE ARE WATCHING YOU!") //NSA is watching ( ͡° ͜ʖ ͡°)
    }
    // Is it a command?
    if(msg.content.indexOf(config.prefix) !== 0) return;

    else logger.info("Message received!");
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
                        },
                        {
                            name: config.prefix + 'ping',
                            value: 'Shows you the latency and the api latency.'
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
        // Command: ping
        case 'ping':
            msg.channel.send('Ping?').then((m) => {
                m.edit({
                    embed: {
                        color: 0xe67e22,
                        author: {
                            name: client.user.name,
                            icon_url: client.user.avatarURL
                        },
                        description: 'Pong! Latency is ' + (m.createdTimestamp - msg.createdTimestamp) + 'ms. API Latency is ' + (Math.round(client.ping)) + 'ms.'
                    }
                })
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
                            },
                            {
                                name: config.prefix + 'ban {@Person} {Reason}',
                                value: 'Ban a person from the discord'
                            },
                            {
                                name: config.prefix + 'purge {Count}',
                                value: 'Deletes the last {Count} messages'
                            },
                            {
                                name: config.prefix + 'announce {Message}',
                                value: 'Announce {Message}'
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
        // ban command
        case 'ban':
            if(!isUserModerator(msg.member)) {
                nepReply(msg);
            } else {
                // Get the member and check if bannable
                let member = msg.mentions.members.first();
                if(!member) return errorReply('User is invalid!', msg);
                if(!member.bannable) return errorReply('User isnt bannable!', msg);

                // Get the reason
                let reason = args.slice(1).join(' ');
                if(!reason) return errorReply('Please submit a reason!', msg);

                member.ban(reason);
                msg.reply({
                    embed: {
                        color: 0x3498db,
                        author: {
                            name: client.user.name,
                            icon_url: client.user.avatarURL
                        },
                        description: 'Banned user ' + member.user.tag + ' because of ' + reason
                    }
                });
            }
            break;
        // purge command
        case 'purge':
            if(!isUserModerator(msg.member)) {
                nepReply(msg);
            } else {
                // Get the delete count
                const deleteCount = parseInt(args[0], 10);

                // Valid?
                if(!deleteCount || deleteCount < 2 || deleteCount > 100) return errorReply('Please provide a number between 2 and 100 for the number of messages to delete!', msg);

                msg.channel.bulkDelete(deleteCount).then(() => {
                    msg.reply({
                        embed: {
                            color: 0x3498db,
                            author: {
                                name: client.user.name,
                                icon_url: client.user.avatarURL
                            },
                            description: 'Successfully deleted last ' + deleteCount + ' messages!'
                        }
                    });
                });
            }
            break;
        // announce command
        case 'announce':
            if(!isUserModerator(msg.member)) {
                nepReply(msg);
            } else {
                // Get the message which should be announce
                let message = args.join(' ');
                if(!message) return errorReply('Please submit a message!', msg);

                // Send the announcement
                client.channels.find('name', config.channels.announcements).send('@everyone ' + message);
                msg.reply({
                    embed: {
                        color: 0x3498db,
                        author: {
                            name: client.user.name,
                            icon_url: client.user.avatarURL
                        },
                        description: 'Successfully announced ' + message
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

// On process exit
process.on('SIGINT', () => {
    logger.info('SIGINT received, disconnecting...');

    // Say good bye and disconnect
    client.channels.find('name', config.channels.botCommands).send({
        embed: {
            color: 0xe74c3c,
            author: {
                name: client.user.name,
                icon_url: client.user.avatarURL
            },
            description: 'Good bye!'
        }
    }).then(() => {
        // Destroy the client and exit
        client.destroy();
        process.exit(71903);
    });
});
process.on('exit', (code) => {
    // Check if exit is from SIGINT event
    if(code === 71903) process.exit(0);

    logger.info('Exit received, disconnecting...');

    // Say good bye and disconnect
    client.channels.find('name', config.channels.botCommands).send({
        embed: {
            color: 0xe74c3c,
            author: {
                name: client.user.name,
                icon_url: client.user.avatarURL
            },
            description: 'Good bye!'
        }
    }).then(() => {
        // Destroy the client and exit
        client.destroy();
        process.exit(code);
    });
});

// Log in
client.login(config.token);
