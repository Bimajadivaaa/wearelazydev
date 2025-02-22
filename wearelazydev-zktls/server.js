import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { ReclaimClient } from "@reclaimprotocol/zk-fetch";
import { transformForOnchain, verifyProof } from "@reclaimprotocol/js-sdk";

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
import bodyParser from "body-parser";
import { extractGitHubPRInfo } from "./utils/extractGitHubPRInfo.js";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const RECLAIM_ID = process.env.RECLAIM_ID;
const RECLAIM_SECRET = process.env.RECLAIM_SECRET;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  console.error("Missing GitHub credentials");
  process.exit(1);
}

if (!RECLAIM_ID || !RECLAIM_SECRET) {
  console.error("Missing Reclaim credentials");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.get("/getAccessToken", async (req, res) => {
  console.log(req.query.code);
  const params = `?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${req.query.code}`;
  await fetch("https://github.com/login/oauth/access_token" + params, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("/getAccessToken", data);
      res.status(200).json(data);
    });
});

app.get("/generate-proof", async (req, res) => {
  try {
    const client = new ReclaimClient(
      process.env.RECLAIM_ID,
      process.env.RECLAIM_SECRET,
      true
    );

    const urlPullRequest = req.query.url;
    const { owner, repo, pull_number } = extractGitHubPRInfo(urlPullRequest);

    const publicOptions = {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
    };

    const privateOptions = {
      headers: {
        Authorization: req.get("Authorization"),
      },
    };

    const userUrl = "https://api.github.com/user";
    const prUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}`;

    const prProof = await client
      .zkFetch(
        prUrl,
        {
          ...publicOptions,
        },
        {
          ...privateOptions,
          responseMatches: [
            {
              type: "regex",
              value: 'merged":(?<merged>true|false)',
            },
            {
              type: "regex",
              value:
                '"user":\\s*{\\s*"login":\\s*"(?<login>[^"]+)",\\s*"id":\\s*(?<id>\\d+),\\s*"node_id":\\s*"(?<node_id>[^"]+)"',
            },
          ],
        }
      )
      .catch((error) => {
        console.log(prUrl);
        console.log("Error fetching PR data", error.message);
        return;
      });

    const userProof = await client
      .zkFetch(
        userUrl,
        {
          ...publicOptions,
        },
        {
          ...privateOptions,
          responseMatches: [
            {
              type: "regex",
              value:
                '"login":\\s*"(?<login>[^"]+)",\\s*"id":\\s*(?<id>\\d+),\\s*"node_id":\\s*"(?<node_id>[^"]+)"',
            },
          ],
        }
      )
      .catch((error) => {
        console.log(userUrl);
        console.log("Error fetching User data", error.message);
        return;
      });

    // prProof
    if (!prProof || !userProof) {
      return res.status(500).json({ message: "Failed to generate proof" });
    }

    const isPrProofVerified = await verifyProof(prProof);
    const isUserProofVerified = await verifyProof(userProof);
    if (!isPrProofVerified || !isUserProofVerified) {
      return res
        .status(500)
        .json({ message: "Failed to verify pull request or user proof" });
    }

    const prProofData = transformForOnchain(prProof);
    const userProofData = transformForOnchain(userProof);

    res.status(200).json({ prProofData, userProofData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
