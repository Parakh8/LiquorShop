# Sri Sai Liquor Shop

A full-stack premium liquor shop web application.

## Prerequisites
- Node.js installed
- MongoDB installed and running locally on default port 27017 (or update `.env` with your `MONGO_URI`)

## Setup Instructions

1. **Install Dependencies**
   Navigate to the root directory and run:
   ```bash
   npm install
   ```

2. **Seed the Database**
   Populate the database with sample products:
   ```bash
   node backend/seed.js
   ```

3. **Run the Server**
   Start the backend server:
   ```bash
   node backend/server.js
   ```

4. **Access the Application**
   Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Folder Structure
- `frontend/`: Contains HTML, CSS, JS, and Images.
- `backend/`: Contains Express server, Mongoose models, controllers, routes, and seed script.

## Features
- **Age Verification:** Blocks access until user confirms they are 21+.
- **Premium Design:** Dark, gold, and red theme with high-quality AI generated images.
- **Shop:** Browse categorized products.
- **Cart:** Add/remove items with dynamic total price calculation.
- **Checkout:** Takeaway order form (no online payment). Orders saved to MongoDB.
