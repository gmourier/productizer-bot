const fetch = require('node-fetch');

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
  async function handleDiscussionCreated(context) {
    const addCommentQuery = `
      mutation ($discussionId: ID!, $body: String!) {
        addDiscussionComment(input: {discussionId: $discussionId, body: $body}) {
          comment {
            url
          }
        }
      }
    `;

    await context.octokit.graphql(addCommentQuery, {
      discussionId: context.payload.discussion.node_id,
      body: `Thanks for opening this discussion! Someone from the product team should get by very soon. In the meantime, you can look at our [other product discussions](https://github.com/${context.payload.repository.full_name}/discussions).`,
    });

    return await sendContentToProductBoardAPI(context, true)
      .then()
      .catch(error => {
        app.log.error(error.message);
      });
  }

  async function handleDiscussionCommentCreated(context) {
    if (context.payload.sender.type == "Bot") { //DO NOT SEND NOTES FROM BOTS
      return;
    }

    return await sendContentToProductBoardAPI(context, false)
      .then()
      .catch(error => {
        app.log.error(error.message);
      });
  }

  async function sendContentToProductBoardAPI(context, initiatedDiscussion) {
    const baseURL = "https://api.productboard.com";
    const reqPath = "/notes";
    const token = process.env.PRODUCTBOARD_TOKEN;

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    }

    let contentPlaceholder = "";

    let reqBody = JSON.stringify({
      title: context.payload.discussion.title,
      content: (initiatedDiscussion ? context.payload.discussion.body : context.payload.comment.body),
      display_url: (initiatedDiscussion ? context.payload.discussion.html_url : context.payload.comment.html_url),
      tags: ["origin:github", "waiting:triage"],
      source: {
        origin: "github",
        record_id: (initiatedDiscussion ? context.payload.discussion.html_url: context.payload.comment.html_url),
      },
      user: {
        external_id: context.payload.sender.url
      }
    });

    let reqOptions = {
      method: 'POST',
      headers: headers,
      body: reqBody
    };

    const response = await fetch(baseURL + reqPath, reqOptions);

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }

    return await response;
  }

  app.on("discussion.created", async (context) => {
    return await handleDiscussionCreated(context);
  });

  app.on("discussion_comment.created", async (context) => {
    return await handleDiscussionCommentCreated(context);
  });
};
