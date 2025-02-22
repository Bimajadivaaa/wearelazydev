# Setup backend

```shell
npm install
```

Duplikat file .env.example kemudian rename menjadi .env dan isi dengan credentials anda

```shell
cp .env.example .env
```

```javascript
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

RECLAIM_ID=
RECLAIM_SECRET=

APP_PORT=
```

# Untuk run server development

```shell
npm run dev
```

# Untuk run server production

```shell
npm run start
```

# Get Access Token Github

## Endpoint :

```
GET http://localhost:<app port>/getAccessToken
```
## Query :
```
{
  code: <session code>
}
```

session code di dapat dari ketika user berhasil mengauthorize apps

## Response :

```json
{
  "access_token": "gho_16C7e42F292c6912E7710c838347Ae178B4a",
  "scope": "repo,gist",
  "token_type": "bearer"
}
```

# Generate proof

## Endpoint :

```
GET http://localhost:<app port>/generate-proof
```

## Headers :
```json
{
  "Authorization": "Bearer <accessToken>"
}
```

## Query :

```json
{
  "url": <url-pull-request>
}
```

## Response :

```json
{
  "prProofData": {
    "claimInfo": {
      "context": (id owner pull request, login(username yg melakukan pull request), node_id, merged status(true|false)),
      "parameters": <parameters>,
      "provider": <provider>
    },
    "signedClaim": {
      "claim": {
        "epoch": <epoch>,
        "identifier": <identifier>,
        "owner": <owner>,
        "timestampS": <timestampS>
      },
      "signatures": [<signatures>]
    }
  },
  "userProofData": {
    "claimInfo": {
      "context": (id owner pull request, login(username yg melakukan pull request), node_id),
      "parameters": <parameters>,
      "provider": <provider>
    },
    "signedClaim": {
      "claim": {
        "epoch": <epoch>,
        "identifier": <identifier>,
        "owner": <owner>,
        "timestampS": <timestampS>
      },
      "signatures": [<signatures>]
    }
  }
}

```
