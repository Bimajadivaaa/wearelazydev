# 🚀 Setup Backend

Follow these steps to set up and run the backend server.

## 📌 Prerequisites
Ensure you have the following installed:
- **Node.js** (Latest LTS version recommended)
- **npm** (Comes with Node.js)

## 📥 Install Dependencies
Run the following command:
```sh
npm install
```

## ⚙️ Configure Environment Variables
Duplicate the `.env.example` file and rename it to `.env`, then fill in your credentials:
```sh
cp .env.example .env
```

### Example `.env` file:
```ini
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

RECLAIM_ID=
RECLAIM_SECRET=

APP_PORT=
```

## ▶️ Run the Development Server
```sh
npm run dev
```

## 🚀 Run in Production Mode
```sh
npm run start
```

---

# 🔑 Get GitHub Access Token

## 📍 Endpoint:
```sh
GET http://localhost:<APP_PORT>/getAccessToken
```

## 📩 Query Parameters:
```json
{
  "code": "<session_code>"
}
```
`session_code` is obtained when the user successfully authorizes the app.

## ✅ Example Response:
```json
{
  "access_token": "gho_16C7e42F292c6912E7710c838347Ae178B4a",
  "scope": "repo,gist",
  "token_type": "bearer"
}
```

---

# 🔒 Generate Proof

## 📍 Endpoint:
```sh
GET http://localhost:<APP_PORT>/generate-proof
```

## 🔑 Headers:
```json
{
  "Authorization": "Bearer <accessToken>"
}
```

## 📩 Query Parameters:
```json
{
  "url": "<url-pull-request>"
}
```

## ✅ Example Response:
```json
{
  "prProofData": {
    "claimInfo": {
      "context": {
        "id": "<owner_pull_request_id>",
        "login": "<username>",
        "node_id": "<node_id>",
        "merged_status": true
      },
      "parameters": "<parameters>",
      "provider": "<provider>"
    },
    "signedClaim": {
      "claim": {
        "epoch": "<epoch>",
        "identifier": "<identifier>",
        "owner": "<owner>",
        "timestampS": "<timestampS>"
      },
      "signatures": ["<signatures>"]
    }
  },
  "userProofData": {
    "claimInfo": {
      "context": {
        "id": "<owner_pull_request_id>",
        "login": "<username>",
        "node_id": "<node_id>"
      },
      "parameters": "<parameters>",
      "provider": "<provider>"
    },
    "signedClaim": {
      "claim": {
        "epoch": "<epoch>",
        "identifier": "<identifier>",
        "owner": "<owner>",
        "timestampS": "<timestampS>"
      },
      "signatures": ["<signatures>"]
    }
  }
}
```

---

## 🎯 Conclusion
You have successfully set up the backend for **wearelazydev**. If you encounter any issues, check the `.env` file or refer to the documentation.

Happy coding! 🚀
