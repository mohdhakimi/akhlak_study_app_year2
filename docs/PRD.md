# Product Requirements Document (PRD)

## Akhlak Tahun Dua KSRI Interactive Learning App

**Version:** 1.0
**Date:** 18 October 2025
**Author:** Hakimi

---

### 1. Introduction & Vision

This document outlines the requirements for the "Akhlak Tahun Dua KSRI Interactive Learning App," a web-based educational tool designed for primary school students in Malaysia. The vision is to create a highly engaging, fun, and effective learning platform that supplements the KSRI syllabus for Akhlak (Morals). The app will transform traditional learning into an interactive experience with gamified elements, including a leaderboard, to motivate and captivate young learners.

### 2. Target Audience

- **Primary Users:** Students in "Tahun Dua" (Standard 2), typically 8 years old, who are studying the KSRI syllabus.
- **Secondary Users:** Parents and teachers looking for supplementary learning tools for their children/students.

### 3. Goals & Objectives

- **Primary Goal:** To increase student engagement and understanding of the Akhlak Tahun Dua syllabus.
- **Objectives:**
  - To provide a simple, intuitive, and child-friendly user interface in **Bahasa Melayu**.
  - To reinforce learning through interactive quizzes and tests with immediate feedback.
  - To foster friendly competition and track achievement through a local leaderboard.
  - To ensure the app is accessible on various devices (desktop, tablet, mobile) through a **responsive design**.
  - To make learning Akhlak a positive and enjoyable experience.

---

### 4. Key Features & Functionality

#### 4.1. Core Experience and Design

- **Responsive Design:** The app layout must adapt seamlessly to all screen sizes (mobile, tablet, desktop).
- **Engaging UI/UX:**
  - **Visuals:** Bright, friendly colours, large fonts, clear iconography, and a friendly **animal mascot** to guide the student.
  - **Sound Effects:** Audio feedback for user actions: button clicks, correct/wrong answers, and celebratory sounds with encouragement messages (**"Syabas!", "Hebat!"**) upon completing a Quiz or Test.
  - **Animations:** Smooth page transitions and subtle animations on interactive elements.

#### 4.2. User Personalization & Management

- On first launch, the app will prompt the user to enter a name.
- The app will use the browser's local storage to remember a list of users who have played on the device.
- On subsequent visits, the user can select their name from a list or enter a new one.
- The current user's name will be displayed on the main menu and results pages.

#### 4.3. Mode 1: Study Mode (Mod Belajar)

- **Purpose:** To allow students to read and review learning materials.
- **Functionality:**
  - A menu to select topics.
  - Presents notes in small, digestible chunks with simple "Seterusnya" (Next) and "Sebelum" (Previous) navigation.

#### 4.4. Mode 2: Quiz Mode (Mod Kuiz)

- **Purpose:** To test understanding of specific topics with instant feedback.
- **Flow:**
  1.  **Category Selection:** User selects a quiz category.
  2.  **Quiz Start:** A 10-question MCQ quiz begins. Each question has 4 options.
  3.  **Answer Randomization:** For each question, the display position of the four answer options must be **randomized**.
  4.  **Answering & Real-Time Feedback:** User selects one option. The app provides instant visual and audio feedback (correct/incorrect). If incorrect, the correct option is highlighted.
  5.  **Tracking:** Real-time score and progress ("Soalan X dari 10") are displayed.
  6.  **Results Page:** Shows final score (in %) and a full review of all 10 questions (showing question, user answer, and correct answer). Score is saved to the leaderboard.

#### 4.5. Mode 3: Test Mode (Mod Ujian)

- **Purpose:** A comprehensive test assessing knowledge across all topics.
- **Flow:**
  1.  **Test Start:** Immediately starts a **30-question** test with MCQs randomly selected from all categories.
  2.  **Answer Randomization:** For each question, the display position of the four answer options must be **randomized**.
  3.  **Real-Time Feedback:** The question interface and feedback mechanism are **identical to the Quiz Mode**.
  4.  **Test Completion:** After 30 questions, a final results screen shows the total score (e.g., "Skor Anda: 25/30"). Score is saved to the leaderboard.

#### 4.6. Mode 4: Leaderboard (Papan Markah)

- **Purpose:** To display the achievements of all users who have played on the device.
- **Functionality:**
  1.  **Access:** Accessible from the main menu.
  2.  **Filtering:** Allows viewing high scores for the main "Ujian" or filtering by individual "Kuiz" topics.
  3.  **Display:** Shows a ranked list (e.g., Top 10) displaying:
      - Rank (1, 2, 3...)
      - Player Name (Nama)
      - Score (Markah)
      - Date of achievement (Tarikh)
  4.  The list will be sorted from the highest score to the lowest.

---

### 5. Language and Content

- **Language:** All user-facing text in the application interface must be in **Bahasa Melayu**.
- **Content Source:** Notes and questions are sourced from the provided text file.

### 6. Technical Requirements

- **Platform:** Web Application (React + TypeScript + Vite).
- **Data Structure:** A JSON format will be used to structure the syllabus content.
- **State Management:** The app will use browser `localStorage` to persist:
  - A list of user profiles (names).
  - A list of all scores, with each entry containing `{userName, quizId, score, timestamp}`.
- **Responsiveness:** Use of media queries and flexible layout techniques is mandatory.
- **Modular Architecture:** The application uses a comprehensive modular component system with:
  - Reusable UI components (Button, Card, Input, Select, Checkbox, Alert)
  - Layout components (Page, Section, Container)
  - Navigation components (NavButton, Breadcrumb)
  - Content components (Question, Answer, Progress)
  - Feedback components (Toast, Modal)
  - Custom hooks for state management and utilities
  - Type-safe interfaces and comprehensive documentation

### 7. Out of Scope for Version 1.3

- User accounts with passwords or online login functionality.
- Real-time, cloud-synced leaderboards (all data is stored locally on the device).
- Saving detailed quiz/test answer history across sessions (only the final score is saved).
- Different difficulty levels.
- Content for other subjects or grade levels.
