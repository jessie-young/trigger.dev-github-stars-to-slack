import { Trigger } from "@trigger.dev/sdk";
import * as github from "@trigger.dev/github";
import * as slack from "@trigger.dev/slack";
import fs from 'fs';

//const repo = process.env.GITHUB_REPOSITORY ?? "triggerdotdev/github-stars-to-slack";
const repo = process.env.GITHUB_REPOSITORY

const folderName = '/data';

try {
  if (!fs.existsSync(folderName)) {
    console.log("folder " + folderName + " doesn't exist; creating")
    fs.mkdirSync(folderName);
    fs.mkdirSync(folderName + "/sub");
    fs.writeFile('/data/sub/hello.txt', 'I am cool!',  function(err) {
      if (err) {
          return console.error(err);
      }
      console.log("File created!");
    });
  } else {
    console.log("folder exists; creating /sub folder")
    fs.mkdirSync(folderName + "/sub");
    fs.writeFile('/data/sub/hello.txt', 'I am cool!',  function(err) {
      if (err) {
          return console.error(err);
      }
      console.log("File created!");
    });

  }
} catch (err) {
  console.error(err);
}


fs.readFile('/data/sub/hello.txt', function (err, data) {
    if (err) {
        return console.error(err);
    }
    console.log("Asynchronous read: " + data.toString());
});


new Trigger({
  id: "github-stars-to-slack",
  name: "GitHub Stars to Slack",
  on: github.events.newStarEvent({
    repo,
  }),
  run: async (event) => {
    console.log("got an event!")
    console.log(event)
    const repository = event.repository.full_name

    await slack.postMessage("⭐️", {
      channelName: "test",
      text: `yayayayayaya! :) I got a new GitHub star from \n<${event.sender.html_url}|${event.sender.login}>. You now have ${event.repository.stargazers_count} stars!`,
    });
  },
}).listen();

