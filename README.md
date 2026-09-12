# 🎬 CineMatch — Movie Recommendation System

> **Discover. Match. Find Your Next Favorite Movie.**
> ## 🚀 Live Demo

👉 [Try CineMatch Live](https://cinematch-movie-reco-87yn.bolt.host)

CineMatch is a full-stack movie recommendation web application designed to help users discover movies based on their preferences, including genre, language, mood, and movie attributes.

## ✨ Features

- 🎬 **Discover Movies** — Browse and explore movies
- 🎯 **Personalized Recommendations** — Get movie recommendations based on your preferences
- 🧠 **Preference-Based Matching** — See a match percentage for recommended movies
- 😊 **Mood-Based Recommendations** — Discover movies based on your selected mood
- 🌐 **Language Preferences** — Get movies matching your preferred language
- ⭐ **Ratings & Genres** — View useful movie information
- ❤️ **Favorites** — Save and manage your favorite movies
- 🎬 **Movie Details** — View detailed information about movies
- 🔐 **User Authentication** — Register, login, and logout
- 🖼️ **Poster Fallback** — Displays a clean fallback when a movie poster cannot load
- 📱 **Responsive Design** — Works across different screen sizes

## 🧠 Recommendation System

CineMatch currently uses a **preference/content-based recommendation approach**.

The system considers user preferences such as:

- Preferred genre
- Preferred language
- Mood
- Movie attributes

These preferences are compared with available movie information to calculate a **match percentage** and generate relevant recommendations.

> **Note:** CineMatch currently uses a rule/content-based approach and does not use a trained machine-learning recommendation model.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend development |
| TypeScript | Type-safe application development |
| Vite | Development and build tooling |
| Tailwind CSS | Styling and responsive UI |
| Supabase | Backend services and authentication |
| PostgreSQL | Database |
| GitHub | Version control |

## 📌 Main Modules

### 🏠 Home

A cinematic landing page that introduces CineMatch and provides quick access to movie discovery and personalized recommendations.

### 🔎 Discover Movies

Browse and explore the available movie collection.

### 🎯 My Recommendations

View personalized movie recommendations with match percentages and explanations for why a movie matches your preferences.

### ⚙️ Preferences

Select preferences such as genre, language, and mood to personalize recommendations.

### ❤️ Favorites

Save movies to a personal favorites collection and manage saved movies.

### 🎬 Movie Details

View detailed information about individual movies.

### 🔐 Authentication

Users can create an account, log in, and log out to access personalized features.

## 🗄️ Database & Backend

CineMatch uses **Supabase with PostgreSQL** for application data and authentication.

The database manages information such as:

- User accounts
- Movie information
- User preferences
- Favorite movies
- Recommendation-related data

User-specific data is protected using database access controls and Row Level Security where configured.

## 🚀 Getting Started

### Prerequisites

Make sure you have:

- [Node.js](https://nodejs.org/) installed
- npm installed
- A Supabase project

### 1. Clone the Repository

```bash
git clone https://github.com/saisree7702/cinematch-movie-recommendation-system.git
