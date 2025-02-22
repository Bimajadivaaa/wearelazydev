# 🚀 How to Run the Frontend (wearelazydev)

Follow these steps to set up and run the frontend of **wearelazydev** locally.

## 📌 Prerequisites
Make sure you have the following installed on your system:
- **Node.js** (Latest LTS version recommended)
- **npm** (Comes with Node.js)
- **Git** (To clone the repository)

## 📥 Clone the Repository
First, clone the project from GitHub:
```sh
git clone https://github.com/wearelazydev/frontend.git
cd frontend
```

## 📦 Install Dependencies
Run the following command to install all necessary dependencies:
```sh
npm install
```

## ⚙️ Set Up Environment Variables
Create a `.env` file in the root directory and populate it with the required environment variables:
```sh
touch .env
```
Then, open the `.env` file and add the following variables:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_ISSUE_ADDRESS=
NEXT_PUBLIC_LAZYTOKEN_ADDRESS=
NEXT_PUBLIC_SWAPTOKEN_ADDRESS=
NEXT_PUBLIC_GITHUB_CLIENT_ID=
NEXT_PUBLIC_ZK_BACKEND_GENERATE_PROOF=
NEXT_PUBLIC_ZK_BACKEND_GET_ACCESS_TOKEN=
```
**Note:** Replace the values with the actual credentials you received.

## ▶️ Run the Development Server
Once everything is set up, start the development server:
```sh
npm run dev
```
This will launch the application, and you should see the frontend running on:
```
http://localhost:3000
```

## 🔥 Additional Commands
### Build the Application for Production
If you want to build the project for deployment:
```sh
npm run build
```

### Run in Production Mode
To start the application in production mode after building:
```sh
npm run start
```

### Linting & Formatting
Ensure your code follows best practices by running:
```sh
npm run lint
npm run format
```

## 🎯 Conclusion
Congratulations! 🎉 You have successfully set up and run the frontend locally. If you encounter any issues, check the `.env` values or refer to the project documentation.

Happy coding! 🚀
