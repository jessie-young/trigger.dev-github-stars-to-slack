import { Trigger } from "@trigger.dev/sdk";
import * as github from "@trigger.dev/github";
import * as slack from "@trigger.dev/slack";

//const repo = process.env.GITHUB_REPOSITORY ?? "triggerdotdev/github-stars-to-slack";
const repo = process.env.GITHUB_REPOSITORY

console.log("repo")
console.log(repo)
new Trigger({
  id: "github-stars-to-slack",
  name: "GitHub Stars to Slack",
  endpoint: "ws://localhost:8889/ws",
  on: github.events.newStarEvent({
    repo,
  }),
  run: async (event) => {
    console.log("got an event!")
    console.log(event)
    const repository = event.repository.full_name

    await slack.postMessage("⭐️", {
      channelName: "test",
      text: `Yes! I got a new GitHub star from \n<${event.sender.html_url}|${event.sender.login}>. You now have ${event.repository.stargazers_count} stars!`,
    });
  },
}).listen();
