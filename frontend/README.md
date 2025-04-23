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

dataviz-dashboard/
├── public/                     # Static HTML + favicons
├── src/
│   ├── assets/
│   │   ├── jobsData_v2.json    # Mock job data fallback
│   │   ├── sample_resumes/     # Bundled PDF samples
│   │   └── us-states.json      # GeoJSON for map
│   │
│   ├── components/
│   │   ├── Charts/             # chart + map React components
│   │   │   ├── JobComparisonChart.jsx
│   │   │   ├── LocationMap.jsx
│   │   │   ├── MatchScoreChart.jsx
│   │   │   ├── SkillFrequencyChart.jsx
│   │   │   ├── JobBenefitsRadarChart.jsx
│   │   │   └── SkillWordCloud.jsx
│   │   │
│   │   ├── Other/              # layout helpers
│   │   │   ├── AppBarTip.jsx
│   │   │   └── GraphContainer.jsx
│   │   │
│   │   └── Textual/            # textual/detail views
│   │       ├── JobDetailView.jsx
│   │       └── ResumeSummary.jsx
│   │
│   ├── pages/
│   │   ├── LandingPage.jsx     # upload hero + samples
│   │   └── MainPage.jsx        # dashboard with charts
│   │
│   ├── App.js                  # top‐level router & theme
│   ├── index.js                # React DOM entry
│   └── theme.js                # optional MUI custom theme
│
├── package.json
└── README.md                   # you are here
