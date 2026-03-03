# 🎨 LEGO Pixel Art Generator

A fullstack web application that converts images into LEGO-compatible pixel art, estimates real-world building cost based on market data, and generates step-by-step building instructions in PDF format.

This project was developed as an engineering thesis and demonstrates fullstack application architecture, image processing, authentication, REST API integration, and dynamic PDF generation.

---

# 🚀 Features

## 🖼 Image to LEGO Pixel Art Conversion

- Image upload and processing
- Adjustable grid dimensions (width & height)
- Pixelation using HTML5 Canvas
- Disabled image smoothing for block-style effect
- Color quantization mapped to real LEGO color palette
- Manual palette selection
- Live pixel preview

---

## 💰 Cost Estimation Based on Market Data

The backend analyzes the generated pixel art and:

- Counts occurrences of each color
- Maps RGB values to LEGO color IDs
- Fetches average market price for LEGO part **3024 (1x1 plate)** from BrickLink
- Calculates estimated total cost of the project

BrickLink API authentication is implemented using:
- OAuth 1.0a
- HMAC-SHA1 signature

The frontend displays:
- RGB color
- Required quantity
- Average price per piece
- Estimated total cost

---

## 📄 Automatic PDF Building Instructions

The application generates a downloadable PDF file containing:

- Grid-based building layout
- Multi-page support for large projects
- Visual LEGO-style stud rendering (colored circles)
- Proper A4 formatting
- Automatic file download in the browser

---

## 🔐 Authentication System

The REST API supports:

- User registration
- Login
- Logout
- Profile retrieval

Security mechanisms:

- Password hashing with bcrypt
- JWT-based authentication
- Token verification middleware
- Token stored in localStorage on the client side

---

# 🏗 System Architecture

## Frontend

Built with:

- React
- JavaScript (ES6+)
- HTML5 Canvas API
- Bootstrap
- CSS Modules

Architecture principles:

- Component-based structure
- Unidirectional data flow
- Separation of concerns
- MVC-inspired structure (View layer separation)

### Main Components

- **Workbench** – application coordinator
- **PixelCanvas**
- **ColorPalette**
- **PixelDimensions**
- **ImageUploader**
- **AnalysisTable**

Image processing logic is encapsulated inside a dedicated:
