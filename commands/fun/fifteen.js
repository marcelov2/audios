const { Command } = require("klasa");
const {
  Permissions: { FLAGS }
} = require("discord.js");
var FormData = require("form-data");

var request = require("request");
const needle = require("needle");
const axios = require("axios");
const fs = require("fs");
var mm = require("music-metadata");
const handleVideo = require("../../functions/handleVideo");
const findLengthOfm3u8 = require("../../functions/utils/findLengthOfm3u8");
const { sckey } = process.env;

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "fifteen",
      enabled: true,
      runIn: ["text"],
      cooldown: 2,
      bucket: 1,
      aliases: [],
      permLevel: 0,
      botPerms: [],
      requiredConfigs: [],
      aliases: ["f", "15"],
      description: "Does something on 15.ai",
      quotedStringSupport: true,
      usage: "[song:string]",
      usageDelim: ""
    });
  }

  async run(msg, [song]) {
    msg.channel.send("15");
    let url = song;
    const getLinks = require("../../functions/getLinks");
    const voiceChannel = msg.member.voice.channel;
    const serverQueue = global.queue.get(msg.guild.id);

    download("body", msg, function() {
      console.log("done");
      fileUpload(msg);
    });
  }
};
var options = {
  method: "POST",
  url: "https://api.fifteen.ai/app/getAudioFile",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:74.0) Gecko/20100101 Firefox/74.0",
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "en-GB,en;q=0.5",
    "Content-Type": "application/json;charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    Origin: "https://fifteen.ai",
    Connection: "keep-alive",
    Referer: "https://fifteen.ai/app",
    TE: "Trailers"
  },
  body: '{"text":"official lady just closed all schools for 2 weeks starting Monday.","character":"Fluttershy"}'
};

var download = function(uri, message, callback) {
  request(options, function(err, res, body) {
    console.log("content-type:", res.headers["content-type"]);
    console.log("content-length:", res.headers["content-length"]);
    if ((res.headers["content-length"] === 26)) {
      return message.channel.send(
        "Something went wrong, please try again or go to https://15.ai"
      );
    }
    request(options)
      .pipe(fs.createWriteStream("15.wav"))
      .on("close", callback);
  });
};

let fileUpload = async message => {
  let formData = new FormData();
  formData.append("files[]", fs.createReadStream("15.wav"));
  axios({
    url: "https://files.htp.sh/api/upload",
    method: "POST",
    data: formData,
    headers: formData.getHeaders()
  }).then(response => {
    message.channel.send(response.data.files[0].url);
  });
};

async function readFileMetadata(url) {
  const stream = needle.get(url);

  return mm.parseStream(stream, null, { duration: true }).then(metadata => {
    console.log(metadata);
    return metadata;
  });
}