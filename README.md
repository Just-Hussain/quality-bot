# quality-bot

A health-check bot for the quality of services.
This bot was written in about 4 days for an internship application assessment. There is no actual service or product so the reviews/issues are of course not related to any certain thing, they are just some sort of a proof of concept. Though the all responses are actually stored locally.

This was also a first for me with both Typescript and Docker, has been nice experimenting with new stuff though.
_So I've decided to skip Docker, don't have the energy to configure it._

## Project Setup

The app requires a `BOT_TOKEN` to be provided in `.env`. The token can be taken from **@BotFather** on Telegram.

### Install

```
npm install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Compiles for production

```
npm run build
```

### Run the production build

```
npm run start
```

Note: I forgot to set the commands list from within the code instead of through Bot Father, so here is:

- start: لتشغيل البوت
- cancel: لإلغاء العملية الحالية
- change: لتغيير اللغة
- reports: لرؤية جمييع تقييماتك
- issues: لرؤية جميع مشاكلك
- location: لرؤية موقعك المحفوظ

**Please note that hosting the bot may cause some issues, I've solved some, but some persist**

## The Bot on Heroku

I've hosted the bot on heroku and tried to solve as many issues as i can, currently using the command `/issues` would probably break it, and it might not get up again automatically. So, if the bot is not working, It probably requires me to restart it.
But here it is if you want to try the hosted build:
[Quality Bot](https://t.me/HussQualityBot)

Install and run the bot locally, as instructed above, to avoid any hosting-related issues.

## Some Notes

The sessions are stored as a local JSON file using Lowdb, just to make things simple and not over complicate the assessment. the sessions file will be auto generated when the bot first starts, living at the root directory.
