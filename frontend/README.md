# 📊 Smart Resume Parser — Frontend

This is the React frontend for the Resume Dashboard Recommendation system. Users can upload their resume and receive a visual, interactive dashboard with:

- ✅ Top job matches with detailed insights
- ✅ Skill match breakdowns
- ✅ Salary trends by experience and location
- ✅ Benefits radar charts
- ✅ US map visualizations for job distribution

---

## ⚙️ Tech Stack

- React
- Material UI (MUI)
- React Router
- D3.js
- Docker support

---

## 🚀 Getting Started (Local Dev)

### 1. Install Node.js & npm

- Download from: https://nodejs.org/
- Verify with:

```bash
node -v
npm -v
```

### 2. Install Dependencies

```bash
cd dataviz-dashboard
npm install
```

### 3. Run the App

```bash
npm start
```

The app will be available at http://localhost:3000

---

## 🐳 Docker Deployment

### 1. Build Docker Image

```bash
docker build -t resume-frontend .
```

### 2. Run the App in Docker

```bash
docker run -it --rm -p 3000:3000 resume-frontend
```

> If your backend is hosted locally, ensure the backend URL in your `.env` or API config points to it correctly (e.g., http://localhost:8000).

---

## 📁 Folder Structure

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

---

## 🧪 Commands

```bash
npm start        # Start dev server
npm run build    # Build production bundle
npm test         # Run tests
npm run eject    # Eject CRA config (not recommended)
```

---

## 📚 License

MIT License
