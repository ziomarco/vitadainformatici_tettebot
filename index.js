// Deps import
require('dotenv').config();
const { default: axios } = require('axios');
const { Telegraf } = require('telegraf');

// Env check
if (!process.env.TELEGRAM_BOT_NAME || !process.env.TELEGRAM_BOT_TOKEN) {
    throw new Error('Missing required env vars!');
}

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(botToken, { username: `${process.env.TELEGRAM_BOT_NAME}` });

bot.on('message', ctx => handleMessage(ctx));

console.log(new Date().toISOString(), 'Starting bot...');
bot.catch((e, ctx) => {
    if (e) {
        console.error(e);
    }
    ctx.reply('Oh oh... something wrong happened! :(');
})
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

const handleMessage = async (context) => {
    if (!context || !context?.update?.message?.text?.includes(`@${process.env.TELEGRAM_BOT_NAME}`)) {
        return;
    }

    const parsedText = context?.update?.message?.text
        ?.replace(`@${process.env.TELEGRAM_BOT_NAME}`, '')
        ?.replace('/', '')
        ?.trim()
        ?.toLowerCase();

    switch (parsedText) {
        case 'help':
            context.reply('Capisco solo due comandi: tette e culo. \n Taggami e scrivi il comando (con slash o senza)');
        case 'tette':
        case 'culo':
            console.log('Received command:', parsedText);
            const imageType = parsedText.includes('tette') ? 'boobs' : 'butts';
            const { mediaUrl, modelName } = await getUrl(1, imageType);
            if (!mediaUrl) {
                console.error('Oh no :( something wrong happened when retreiving mediaUrl!');
                context.reply('Oh oh... something wrong happened! :(');
                return;
            };
            return context.replyWithPhoto(`https://media.o${imageType}.ru/${imageType}/${mediaUrl}`, {
                caption: modelName
            });
        default:
            return;
    }
}

const getUrl = async (count, imgType) => {
    try {
        const httpCall = await axios.get(`http://api.o${imgType}.ru/${imgType}/${count}/1/random`);
        if (!httpCall?.data?.[0]?.preview) {
            console.error(`Oh no! No ${imgType} here :(`, httpCall.status, httpCall?.data);
        }
        return {
            modelName: httpCall?.data?.[0]?.model,
            mediaUrl: httpCall?.data?.[0]?.preview?.replace(`${imgType}_preview/`, '')
        };
    } catch (e) {
        console.error(e);
        return null;
    }
}