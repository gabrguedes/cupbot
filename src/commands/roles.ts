import * as Discord from "discord.js";
import config from "../config";

const fail = async (message: Discord.Message, warning: string) => {
    await message.delete();
    await message.member.send(warning);
}

const findRole = (message: Discord.Message) => {
    const argument = message.content.split(" ").slice(1).join(" ");

    const role = message.guild.roles
        .find(i => i.name === argument);

    return { role, argument };
}

export const addRole = async (message: Discord.Message) => {
    try {
        const { role, argument } = findRole(message);
        
        if (!role) { 
            return await fail(message, `Token not recognized.`); 
        }
        
        if (!config.roles.includes(role.name)) { 
            return await fail(message, `Token not recognized.`); 
        }

        await message.member.roles.add(role);
        await message.delete();
        return await message.member.send(`Welcome!`);
    } catch (err) {
        if (err.code === 50013) { // Missing permissions
            return await message.reply("Token not recognized.");
        }
    }
};

export const removeRole = async (message: Discord.Message) => {
    try {
        const { role, argument } = findRole(message);

        if (!role) { return await fail(message, `Token not recognized.`); }
        if (!message.member.roles.array().includes(role)) { return await fail(message, `Token not recognized.`); }
        if (!config.roles.includes(role.name)) { return await fail(message, `VToken not recognized.`); }

        await message.member.roles.remove(role);
        await message.delete();
        return await message.member.send(`Token not recognized.`);
    } catch (err) {
        if (err.code === 50013) { // Missing permissions
            return await message.reply("Token not recognized.");
        }
    } 
};
