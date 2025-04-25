# Resume Dashboard Recommendation — Frontend

This folder contains the React frontend for the Resume Dashboard Recommendation app. Users upload a resume (PDF/DOC/TXT), our AI matches it against a job dataset, and you get an interactive dashboard of:

- Top job matches with detailed views  
- Skill‐match scores and word‑clouds  
- Salary‑vs‑experience line charts  
- Benefits radar charts  
- US‑map visualizations of salary distribution  

---

## Quick Start

1. **Install Node.js & npm**  
   • Download/install from https://nodejs.org/  
   • Verify:  
     ```bash
     node -v
     npm -v
     ```

2. **Install Dependencies**  
   ```bash
   cd frontend/dataviz-dashboard
   npm install
   ```

3. **Install the required dependencies:**
    - `npm install @mui/material @emotion/react @emotion/styled`
    - `npm install @mui/icons-material`  
    - `npm install recharts`
	- `npm install react-router-dom`
	- `npm install @mui/x-charts`

4. **Commands that we can use inside that directory:**

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
```

dataviz-dashboard/               # Root folder of the React + Data Visualization Dashboard project
│
├── .idea/                        # IDE settings (for JetBrains IDEs, safe to ignore in most cases)
├── .vscode/                      # VSCode workspace settings (extensions, launch configs)
├── node_modules/                 # Auto-generated dependencies folder (managed by npm/yarn)
├── public/                       # Static public assets (index.html, favicon, etc.)
│
├── src/                          # Main source code for the React application
│   ├── assets/                   # Static assets like fonts, JSON data, and sample resumes
│   │   ├── fonts/                # Custom font files (e.g., Flexo font)
│   │   ├── json/                 # Local JSON data used for fallback or testing
│   │   └── sample_resumes/       # Example resumes for testing the upload & parsing features
│   │
│   ├── components/               # Reusable UI components grouped by function
│   │   ├── Charts/               # All data visualization components (Radar, Line, Circular, Heatmaps)
│   │   │   ├── JobBenefitsRadarChart.jsx   # Radar chart for visualizing job benefit coverage
│   │   │   ├── JobComparisonChart.jsx      # Line chart for salary vs experience progression
│   │   │   ├── LocationMap.jsx             # Map visualization for job locations
│   │   │   ├── MatchScoreChart.jsx         # Circular progress charts for match scores
│   │   │   └── SkillFrequencyChart.jsx     # Heatmap/grid for skill frequency visualization
│   │   │
│   │   ├── Grouper/              # Components for grouping textual data & summaries
│   │   │   ├── JobDetailView.jsx         # Detailed view of a selected job
│   │   │   └── ResumeSummary.jsx         # Overview panel showing parsed resume stats
│   │   │
│   │   ├── Layout/               # Layout and helper UI components
│   │   │   ├── AppBarTip.jsx              # Custom AppBar with file info and toggle buttons
│   │   │   ├── EducationCard.jsx          # Card component for displaying education entries
│   │   │   ├── ExperienceTimeline.jsx     # (Assumed) Timeline component for experience visualization
│   │   │   ├── GraphContainer.jsx         # Wrapper providing expand/collapse for charts
│   │   │   ├── JobCard.jsx                # Card for listing job experiences
│   │   │   └── NumberBadge.jsx            # Badge component for numeric stats (e.g., job count)
│   │
│   ├── pages/                   # Main pages of the app (Routing targets)
│   │   ├── landing.css                   # Styling for LandingPage
│   │   ├── LandingPage.jsx               # Landing page with file upload and intro UI
│   │   └── MainPage.jsx                  # Core dashboard page with visualizations and job data
│   │
│   ├── utils/                   # Utility functions/helpers
│   │   └── formatDateToMonthYear.jsx     # Date formatting utility
│   │
│   ├── theme.css                # Global CSS variables and theme definitions
│   ├── App.js                   # Main React component handling routing
│   ├── App.css                  # Global styles for the App component
│   ├── index.js                 # React entry point (renders App to DOM)
│   ├── index.css                # Base CSS resets and global styles
│   ├── theme.js                 # MUI theme customization
│
├── .dockerignore               # Files/folders to ignore when building Docker images
├── Dockerfile                  # Docker configuration for containerizing the app
├── .gitignore                  # Specifies files to exclude from Git tracking
├── package.json                # Project metadata, scripts, and dependencies list
├── package-lock.json           # Exact dependency tree (auto-generated by npm)
└── README.md                   # Project overview and setup instructions

```
