🎨 LEGO Pixel Art Generator

A fullstack web application that converts images into LEGO-compatible pixel art, estimates the real-world building cost based on market data, and generates step-by-step building instructions in PDF format.

This project was developed as an engineering thesis and combines image processing, REST API integration, authentication, and dynamic PDF generation.

🚀 Key Features
🖼 1. Image to LEGO Pixel Art Conversion

Image scaling and pixelation using HTML5 Canvas

Disabled image smoothing for block-style effect

Color quantization mapped to real LEGO color palette

Manual palette selection

Adjustable grid dimensions (width & height)

💰 2. Cost Estimation Based on Market Data

The backend analyzes the generated pixel art image and:

Counts occurrences of each color

Maps RGB values to LEGO color IDs

Fetches average market price for LEGO part 3024 (1x1 plate) from BrickLink

Calculates estimated total cost of the project

Authentication to the BrickLink API is implemented using OAuth 1.0a with HMAC-SHA1 signature.

The frontend displays:

RGB color

Number of required pieces

Average price per piece

📄 3. Automatic PDF Building Instructions

The application generates a downloadable PDF file containing:

Grid-based building layout

Multi-page support for large projects

Visual representation of LEGO studs as colored circles

A4 formatted document

Automatic file download in the browser

🔐 4. User Authentication System

REST API supports:

User registration

Login

Logout

Profile retrieval

Security mechanisms:

Password hashing with bcrypt

JWT-based authentication

Token verification middleware

Token stored in localStorage on the client side

🏗 System Architecture
Frontend

Built with:

React

Component-based architecture

Unidirectional data flow

MVC-inspired structure (View layer separation)

Main components:

Workbench (application coordinator)

PixelCanvas

ColorPalette

PixelDimensions

ImageUploader

AnalysisTable

Image processing logic is encapsulated inside a dedicated PixelArtProcessor class.

Backend

Built with:

Node.js

Express.js

MVC architectural pattern

RESTful API design

Backend structure:

controllers/ – business logic

models/ – database schemas

routes/ – API endpoints

database/ – database configuration

utils/ – BrickLink API integration

🗄 Database

The project uses:

MongoDB

Mongoose

Data model:

User

email (unique, validated)

hashed password

createdAt timestamp

Validation is implemented both at:

Schema level (Mongoose)

Application logic level (custom email validator)

🧠 Core Algorithms
Color Matching

Euclidean distance calculation in RGB color space

Selection of closest palette color

Image Analysis

RGBA buffer iteration

RGB → LEGO color ID mapping

Aggregation of piece counts

PDF Generation

Raw pixel buffer reading

Grid-based layout rendering

Centered drawing logic

Dynamic page generation

🛠 Tech Stack
Frontend

React

JavaScript (ES6+)

HTML5 Canvas API

Bootstrap

CSS Modules

Backend

Node.js

Express

MongoDB

Mongoose

bcryptjs

jsonwebtoken

sharp

pngjs

pdfkit

oauth-1.0a

⚙️ How to Run Locally
1️⃣ Clone the Repository
git clone https://github.com/your-username/lego-pixel-art-generator.git
cd lego-pixel-art-generator
2️⃣ Setup Backend

Navigate to backend directory:

cd backend
npm install

Create a .env file (or configure environment variables) with:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

BRICKLINK_CONSUMER_KEY=your_key
BRICKLINK_CONSUMER_SECRET=your_secret
BRICKLINK_TOKEN=your_token
BRICKLINK_TOKEN_SECRET=your_token_secret

Start backend server:

npm start

Server should run on:

http://localhost:5000
3️⃣ Setup Frontend

Open a new terminal and navigate to frontend directory:

cd frontend
npm install
npm start

Application should run on:

http://localhost:3000
4️⃣ MongoDB

Make sure:

You have a local MongoDB instance running
OR

You are using MongoDB Atlas and properly configured the MONGO_URI.
