# Run and Deploy Your AI Studio App

This repository contains everything you need to run and deploy your AI Studio app locally.

## Prerequisites

- **Node.js**: Ensure you have Node.js installed on your system.

## Running the App Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set Environment Variables**:
   Create a `.env.local` file in the root directory and set the following:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```

## Project Overview

This project is designed to manage mobile packages efficiently. It includes the following key components:

- **EditableCell**: A reusable component for inline editing.
- **Header**: Displays the application header.
- **PackageTable**: Renders a table of mobile packages with editing capabilities.

## File Structure

```
├── App.tsx
├── constants.ts
├── index.html
├── index.tsx
├── metadata.json
├── package.json
├── README.md
├── tsconfig.json
├── types.ts
├── vite.config.ts
└── components/
    ├── EditableCell.tsx
    ├── Header.tsx
    └── PackageTable.tsx
```

## Deployment

To deploy the app, follow these steps:

1. Build the app:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your preferred hosting service.