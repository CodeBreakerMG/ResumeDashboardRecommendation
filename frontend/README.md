# Frontend

This is the folder containing the frontend for the project

# Dataset (Temporary)

The Job Dataset has been taken from 

# Installation/Setup for REACT

1. Install Node.js https://nodejs.org/, and then run `node -v` and `npm -v` in your terminal to verify.
2. [Already done so for this project] Create a React project with `npx create-react-app dataviz-dashboard`
3. Install the required dependencies:
    - `npm install @mui/material @emotion/react @emotion/styled`
    - `npm install @mui/icons-material`
    - `npm install papaparse`
    - `npm install recharts`
	- `npm install react-router-dom`
	- `npm install @mui/x-charts`



4. Commands that we can use inside that directory:

  `npm start`
    Starts the development server.

  `npm run build`
    Bundles the app into static files for production.

  `npm test`
    Starts the test runner.

  `npm run eject`
    Removes this tool and copies build dependencies, configuration files
    and scripts into the app directory. If you do this, you can’t go back!

We suggest that you begin by typing:

  `cd dataviz-dashboard`
  `npm start`


### Folder Structure:

src/
│
├── assets/              # Static assets like logo, images
│
├── components/          # Reusable UI components
│   ├── DataTable/
│   │   └── DataTable.jsx
│   ├── Charts/
│   │   ├── BarChartComponent.jsx
│   │   ├── LineChartComponent.jsx
│   │   ├── PieChartComponent.jsx
│   │   └── ScatterPlotComponent.jsx
│   └── Upload/
│       └── FileUpload.jsx
│
├── pages/               # Page-level views
│   ├── LandingPage.jsx
│   └── MainPage.jsx
│
├── utils/               # Utility functions (e.g., CSV parsing)
│   └── csvParser.js
│
├── App.js               # Main App wrapper
├── index.js             # Entry point
└── theme.js             # (Optional) Material UI custom theme setup
