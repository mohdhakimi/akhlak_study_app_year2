# TODO.md - Akhlak Tahun Dua KSRI Interactive Learning App

## Project Overview

Phased development plan with testing gates. Each phase must pass all tests before proceeding to the next phase. Project uses React + Vite, Tailwind CSS, Jest + Testing Library + Playwright, deployed to Vercel.

## 📊 Current Progress

**Overall Status: 5 out of 13 phases completed (38.5%)**

### ✅ Completed Phases
- **Phase 0**: Project Setup & Configuration ✅
- **Phase 1**: Data Structure & Local Storage Utilities ✅  
- **Phase 2**: Core UI Components & Layout ✅
- **Phase 3**: User Management System ✅
- **Phase 4**: Main Menu & Navigation ✅
- **Phase 5**: Study Mode (Mod Belajar) ✅

### 🚧 Next Phase
- **Phase 6**: Quiz Mode Core Logic (Ready to start)

### 📋 Phase Status Legend
- ✅ **Completed**: All tasks and acceptance criteria met
- 🚧 **In Progress**: Currently being worked on
- ⏳ **Pending**: Not yet started
- ❌ **Blocked**: Cannot proceed due to dependencies

---

## Phase 0: Project Setup & Configuration

**Goal**: Initialize project with proper tooling and folder structure

### Tasks

- [x] Initialize Vite + React project with TypeScript
- [x] Install and configure Tailwind CSS
- [x] Set up ESLint + Prettier with recommended rules
- [x] Configure Jest + Testing Library for unit tests
- [x] Install and configure Playwright for E2E tests
- [x] Create initial folder structure (`src/components`, `src/pages`, `src/utils`, `src/data`, `src/hooks`, `src/types`)
- [x] Set up GitHub repository with proper .gitignore
- [x] Create `package.json` scripts for dev, build, test, test:e2e, test:coverage, lint, format
- [x] Add vitest config for coverage thresholds (minimum 80%)
- [x] Create initial README.md with setup instructions

### Acceptance Criteria

- [x] `npm install` runs successfully
- [x] `npm run dev` starts development server
- [x] `npm run lint` passes with no errors
- [x] `npm run format` formats code correctly
- [x] `npm test` runs (even with no tests yet)
- [x] Project structure follows React best practices

### Version Control

- [ ] Commit: "Phase 0: Project initialization and tooling setup"
- [ ] Tag: `v0.1.0`
- [ ] Push to GitHub

---

## Phase 1: Data Structure & Local Storage Utilities

**Goal**: Create data models, JSON structure, and localStorage management

### Tasks

- [x] Define TypeScript interfaces/types (`User`, `Question`, `QuizCategory`, `StudyNote`, `LeaderboardEntry`, `ScoreRecord`)
- [x] Create `data/content-structure.json` with placeholder content (at least 2 topics, 15 questions each)
- [x] Implement `utils/localStorage.ts` with functions: `getUsers()`, `saveUser()`, `getCurrentUser()`, `setCurrentUser()`, `getScores()`, `saveScore()`
- [x] Create custom hooks: `useLocalStorage.ts`, `useUsers.ts`, `useScores.ts`
- [x] Write unit tests for all localStorage utilities (100% coverage)
- [x] Write unit tests for custom hooks using Testing Library

### Acceptance Criteria

- [x] All TypeScript types properly defined with no `any` types
- [x] localStorage utilities handle edge cases (empty storage, corrupted data)
- [x] Unit tests pass with 100% coverage for utils
- [x] Data structure JSON validates against types
- [x] Mock localStorage works in tests

### Version Control

- [ ] Commit: "Phase 1: Data structures and localStorage implementation"
- [ ] Tag: `v0.2.0`
- [ ] Push to GitHub

---

## Phase 2: Core UI Components & Layout

**Goal**: Build reusable components and responsive layout foundation

### Tasks

- [x] Create `Layout.tsx` component with responsive navigation
- [x] Create `Button.tsx` component with Tailwind variants (primary, secondary, success, danger)
- [x] Create `Card.tsx` component for consistent content containers
- [x] Create `Modal.tsx` component for user selection/prompts
- [x] Create `Header.tsx` with app title and current user display
- [x] Create `ProgressBar.tsx` for quiz/test progress
- [x] Create `ScoreDisplay.tsx` component
- [x] Implement responsive design with Tailwind breakpoints (mobile-first)
- [x] Add Bahasa Melayu text constants in `constants/text.ts`
- [x] Write unit tests for each component (test rendering, props, interactions)
- [x] Test responsive behavior with different viewport sizes

### Acceptance Criteria

- [x] All components render without errors
- [x] Components are accessible (semantic HTML, ARIA labels)
- [x] Responsive design works on mobile (375px), tablet (768px), desktop (1024px+)
- [x] Unit tests achieve 90%+ coverage for components
- [ ] Storybook or component preview works (optional but recommended)
- [x] All UI text is in Bahasa Melayu

### Version Control

- [x] Commit: "Phase 2: Core UI components and responsive layout"
- [x] Tag: `v0.3.0`
- [x] Push to GitHub

---

## Phase 3: User Management System

**Goal**: Implement user selection, creation, and persistence

### Tasks

- [x] Create `UserSelectionModal.tsx` component (shows on first visit or user switch)
- [x] Implement user list display with existing users from localStorage
- [x] Add "Create New User" input field and validation
- [x] Create `UserContext` for global user state management
- [x] Implement user selection logic and state persistence
- [x] Add user display in header/main menu
- [x] Create "Switch User" functionality accessible from menu
- [x] Write unit tests for UserSelectionModal interactions
- [x] Write integration tests for user flow (create → select → persist → reload)

### Acceptance Criteria

- [x] New users can be created with name validation (no empty names)
- [x] Existing users can be selected from list
- [x] Selected user persists across page reloads
- [x] User can switch to different user from menu
- [x] Unit tests pass with 85%+ coverage
- [x] Integration tests cover complete user management flow

### Version Control

- [x] Commit: "Phase 3: User management system implementation"
- [x] Tag: `v0.4.0`
- [x] Push to GitHub

---

## Phase 4: Main Menu & Navigation

**Goal**: Create main menu with mode selection

### Tasks

- [x] Create `MainMenu.tsx` page component
- [x] Add 4 navigation cards: Mod Belajar, Mod Kuiz, Mod Ujian, Papan Markah
- [x] Implement routing (use React Router or similar)
- [x] Add friendly animal mascot illustration/image
- [x] Add welcome message with user's name
- [x] Style menu with engaging colors and layout
- [x] Implement navigation to each mode (placeholder pages)
- [ ] Add basic sound effect toggle in menu (prepare for Phase 8)
- [x] Write unit tests for MainMenu component
- [x] Write E2E test for navigation from menu to each mode

### Acceptance Criteria

- [x] Main menu displays with all 4 mode options
- [x] Current user name is displayed
- [x] Navigation to each mode works
- [x] Menu is responsive and attractive on all devices
- [x] Unit tests pass with 90%+ coverage
- [x] E2E test navigates through all menu options successfully

### E2E Test Checkpoint

- [ ] Run full E2E suite: User creation → Main menu → Navigate to all modes
- [ ] All E2E tests pass

### Version Control

- [x] Commit: "Phase 4: Main menu and navigation system"
- [x] Tag: `v0.5.0`
- [x] Push to GitHub

---

## Phase 5: Study Mode (Mod Belajar)

**Goal**: Implement reading/review functionality

### Tasks

- [x] Create `StudyMode.tsx` page component
- [x] Create `TopicSelector.tsx` for choosing study topics
- [x] Create `StudyCard.tsx` for displaying content chunks
- [x] Implement "Seterusnya" (Next) and "Sebelum" (Previous) navigation
- [x] Add progress indicator (e.g., "2 dari 5")
- [x] Implement content loading from JSON
- [x] Add "Kembali ke Menu" (Back to Menu) button
- [x] Style with readable fonts and comfortable spacing
- [x] Write unit tests for StudyMode components
- [x] Write integration tests for navigation through study content
- [x] Write E2E test for complete study flow

### Acceptance Criteria

- [x] Users can select a study topic
- [x] Content displays in digestible chunks
- [x] Next/Previous navigation works correctly
- [x] Progress indicator updates accurately
- [x] Can return to main menu
- [x] Unit tests pass with 85%+ coverage
- [x] Integration tests cover complete study navigation
- [x] E2E test completes full study session

### Version Control

- [ ] Commit: "Phase 5: Study Mode implementation"
- [ ] Tag: `v0.6.0`
- [ ] Push to GitHub

---

## Phase 6: Quiz Mode Core Logic

**Goal**: Implement quiz functionality without audio/animations

### Tasks

- [ ] Create `QuizMode.tsx` page component
- [ ] Create `CategorySelector.tsx` for quiz topic selection
- [ ] Create `QuestionCard.tsx` for displaying MCQ questions
- [ ] Implement answer option randomization logic (`utils/shuffleOptions.ts`)
- [ ] Create `AnswerOption.tsx` component with selection states
- [ ] Implement answer validation and immediate feedback (correct/incorrect highlighting)
- [ ] Create quiz state management (current question, score, answers history)
- [ ] Display real-time progress ("Soalan X dari 10")
- [ ] Create `QuizResults.tsx` page showing score and full review
- [ ] Implement score saving to localStorage
- [ ] Write comprehensive unit tests for quiz logic (randomization, scoring, validation)
- [ ] Write integration tests for complete quiz flow
- [ ] Write E2E test for taking full quiz

### Acceptance Criteria

- [ ] Users can select quiz category
- [ ] 10 questions load correctly
- [ ] Answer options are randomized each time
- [ ] Immediate feedback shows correct/incorrect answers
- [ ] Score calculates correctly
- [ ] Results page shows all questions with user answers vs correct answers
- [ ] Score persists in localStorage with correct format
- [ ] Unit tests pass with 90%+ coverage
- [ ] Integration tests cover quiz flow from start to results
- [ ] E2E test completes quiz and verifies score

### Version Control

- [ ] Commit: "Phase 6: Quiz Mode core implementation"
- [ ] Tag: `v0.7.0`
- [ ] Push to GitHub

---

## Phase 7: Test Mode (Mod Ujian)

**Goal**: Implement comprehensive test with 30 questions

### Tasks

- [ ] Create `TestMode.tsx` page component
- [ ] Implement random question selection from all categories (30 questions)
- [ ] Reuse `QuestionCard.tsx` and quiz logic from Phase 6
- [ ] Ensure no duplicate questions in single test
- [ ] Create `TestResults.tsx` showing final score (X/30 format)
- [ ] Implement test score saving with special `testId` identifier
- [ ] Add visual distinction between Test Mode and Quiz Mode
- [ ] Write unit tests for question selection algorithm
- [ ] Write integration tests for complete test flow
- [ ] Write E2E test for taking full 30-question test

### Acceptance Criteria

- [ ] Test loads 30 random questions from all topics
- [ ] No duplicate questions appear in single test
- [ ] Question randomization and feedback work identically to Quiz Mode
- [ ] Results page shows score and full review of all 30 questions
- [ ] Test score saves correctly to localStorage
- [ ] Unit tests pass with 90%+ coverage
- [ ] E2E test completes full test and verifies results

### Version Control

- [ ] Commit: "Phase 7: Test Mode implementation"
- [ ] Tag: `v0.8.0`
- [ ] Push to GitHub

---

## Phase 8: Leaderboard (Papan Markah)

**Goal**: Display rankings and achievements

### Tasks

- [ ] Create `Leaderboard.tsx` page component
- [ ] Create `LeaderboardTable.tsx` component for score display
- [ ] Implement filter/toggle for Test vs Quiz categories
- [ ] Add sorting logic (highest to lowest score)
- [ ] Display: Rank, Player Name, Score, Date
- [ ] Format dates in readable Bahasa Melayu format
- [ ] Show Top 10 entries for each category
- [ ] Handle empty leaderboard state with encouraging message
- [ ] Add visual highlights for current user's scores
- [ ] Write unit tests for sorting and filtering logic
- [ ] Write integration tests for leaderboard data display
- [ ] Write E2E test: Complete quiz → Check leaderboard → Verify score appears

### Acceptance Criteria

- [ ] Leaderboard displays all scores correctly sorted
- [ ] Filter by Test/Quiz works properly
- [ ] Date formatting is correct and in Bahasa Melayu
- [ ] Current user's scores are highlighted
- [ ] Empty state displays appropriately
- [ ] Unit tests pass with 85%+ coverage
- [ ] E2E test verifies score persistence and display

### E2E Test Checkpoint

- [ ] Run full E2E suite covering all modes: Study → Quiz → Test → Leaderboard
- [ ] All E2E tests pass

### Version Control

- [ ] Commit: "Phase 8: Leaderboard implementation"
- [ ] Tag: `v0.9.0`
- [ ] Push to GitHub

---

## Phase 9: Audio & Visual Enhancements

**Goal**: Add sound effects, animations, and mascot interactions

### Tasks

- [ ] Source or create sound effect files (click, correct, incorrect, celebration)
- [ ] Create `utils/audio.ts` utility for sound management
- [ ] Implement sound toggle functionality (on/off preference in localStorage)
- [ ] Add sound effects to: button clicks, answer feedback, quiz/test completion
- [ ] Add celebratory messages ("Syabas!", "Hebat!") on quiz/test completion
- [ ] Implement smooth page transitions with Tailwind animations
- [ ] Add subtle animations to interactive elements (hover, click states)
- [ ] Integrate friendly animal mascot with contextual expressions
- [ ] Add loading states and skeletons for better UX
- [ ] Write unit tests for audio utility functions
- [ ] Test audio functionality manually across devices
- [ ] Write E2E test verifying animations don't break functionality

### Acceptance Criteria

- [ ] Sound effects play appropriately (with user preference respected)
- [ ] Audio toggle persists across sessions
- [ ] Animations are smooth and don't impact performance
- [ ] Mascot appears in appropriate contexts
- [ ] Celebratory messages display on completion
- [ ] Loading states provide good UX feedback
- [ ] App remains accessible (animations respect prefers-reduced-motion)
- [ ] Unit tests pass for audio utilities

### Version Control

- [ ] Commit: "Phase 9: Audio and visual enhancements"
- [ ] Tag: `v0.10.0`
- [ ] Push to GitHub

---

## Phase 10: Content Integration & Polish

**Goal**: Replace placeholder content with actual syllabus data

### Tasks

- [ ] Replace placeholder content in JSON with actual KSRI Akhlak Tahun Dua content
- [ ] Validate all questions have exactly 4 options
- [ ] Ensure correct answers are properly marked
- [ ] Verify study notes are age-appropriate and digestible
- [ ] Proofread all Bahasa Melayu text for accuracy
- [ ] Test with actual content to ensure proper display
- [ ] Add content validation tests
- [ ] Perform manual QA across all modes with real content
- [ ] Fix any UI issues discovered during content integration
- [ ] Optimize images and assets for web performance

### Acceptance Criteria

- [ ] All placeholder content replaced with actual syllabus material
- [ ] Content displays correctly in all modes
- [ ] No formatting issues with real content
- [ ] Content validation tests pass
- [ ] Manual QA completed across all features
- [ ] Performance metrics acceptable (Lighthouse score 90+)

### Version Control

- [ ] Commit: "Phase 10: Real content integration and polish"
- [ ] Tag: `v0.11.0`
- [ ] Push to GitHub

---

## Phase 11: Testing & Quality Assurance

**Goal**: Comprehensive testing and bug fixes

### Tasks

- [ ] Run full test coverage report (target: 85%+ overall)
- [ ] Fix any failing tests
- [ ] Perform cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Test on actual mobile devices (iOS Safari, Chrome Android)
- [ ] Test localStorage limits and error handling
- [ ] Perform accessibility audit (Lighthouse, axe DevTools)
- [ ] Fix accessibility issues (WCAG 2.1 AA compliance)
- [ ] Test with screen readers (basic functionality)
- [ ] Load testing with large amounts of localStorage data
- [ ] Security review (no XSS vulnerabilities, input sanitization)
- [ ] Performance optimization (code splitting, lazy loading)
- [ ] Create bug fixes for any issues found
- [ ] Update documentation with known limitations

### Acceptance Criteria

- [ ] Test coverage ≥85% overall
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] Lighthouse scores: Performance ≥90, Accessibility ≥90, Best Practices ≥90, SEO ≥90
- [ ] Works on all major browsers (Chrome, Firefox, Safari, Edge)
- [ ] Responsive on mobile devices (tested on actual devices)
- [ ] No critical accessibility issues
- [ ] No console errors or warnings
- [ ] App handles localStorage quota gracefully

### E2E Test Checkpoint (Final)

- [ ] Run complete E2E test suite covering all user journeys
- [ ] Performance tests pass
- [ ] Accessibility tests pass
- [ ] All tests pass successfully

### Version Control

- [ ] Commit: "Phase 11: Comprehensive testing and QA fixes"
- [ ] Tag: `v0.12.0`
- [ ] Push to GitHub

---

## Phase 12: Deployment Preparation

**Goal**: Prepare for production deployment to Vercel

### Tasks

- [ ] Create `vercel.json` configuration file
- [ ] Set up environment variables (if any)
- [ ] Configure build settings for Vercel
- [ ] Optimize production build (minification, tree-shaking)
- [ ] Add meta tags for SEO (title, description in Bahasa Melayu)
- [ ] Create favicon and app icons
- [ ] Add Open Graph tags for social sharing
- [ ] Test production build locally (`npm run build && npm run preview`)
- [ ] Create deployment documentation
- [ ] Update README with deployment instructions
- [ ] Set up Vercel project and connect GitHub repository

### Acceptance Criteria

- [ ] Production build completes successfully
- [ ] Build size is optimized (< 500KB initial bundle)
- [ ] Local preview of production build works correctly
- [ ] All meta tags and SEO elements in place
- [ ] Documentation complete and accurate
- [ ] Vercel project configured

### Version Control

- [ ] Commit: "Phase 12: Deployment preparation"
- [ ] Tag: `v1.0.0-rc1`
- [ ] Push to GitHub

---

## Phase 13: Production Deployment

**Goal**: Deploy to Vercel and verify production environment

### Tasks

- [ ] Deploy to Vercel production
- [ ] Verify deployment URL is accessible
- [ ] Test all functionality on production URL
- [ ] Verify localStorage works on deployed version
- [ ] Test on multiple devices accessing production URL
- [ ] Set up custom domain (if applicable)
- [ ] Configure SSL certificate (automatic with Vercel)
- [ ] Set up monitoring/analytics (optional: Vercel Analytics)
- [ ] Create user documentation/guide (optional)
- [ ] Announce launch and gather initial feedback

### Acceptance Criteria

- [ ] App is live and accessible at production URL
- [ ] All features work correctly in production
- [ ] localStorage persists correctly
- [ ] No console errors in production
- [ ] Mobile devices can access and use app
- [ ] SSL certificate is active (HTTPS)
- [ ] Performance metrics meet targets in production

### Version Control

- [ ] Tag: `v1.0.0` (Production Release)
- [ ] Create GitHub Release with changelog
- [ ] Document production URL in README

---

## Post-Launch Maintenance

**Goal**: Monitor and maintain production application

### Ongoing Tasks

- [ ] Monitor for bug reports and user feedback
- [ ] Plan for future enhancements (v1.1, v1.2)
- [ ] Keep dependencies updated (security patches)
- [ ] Backup localStorage data strategy (export/import feature)
- [ ] Consider PWA features for offline access
- [ ] Gather usage analytics and improve UX

---

## Testing Strategy Summary

### Unit Tests

- **Tools**: Jest + Testing Library
- **Target Coverage**: 85%+ overall
- **Scope**: All utilities, hooks, components in isolation
- **Run**: After each phase, must pass before proceeding

### Integration Tests

- **Tools**: Testing Library with realistic scenarios
- **Scope**: Feature workflows (user creation flow, quiz completion flow)
- **Run**: After Phases 3, 6, 7, 8

### E2E Tests

- **Tools**: Playwright
- **Scope**: Complete user journeys across the app
- **Checkpoints**: After Phases 4, 8, 11 (final)
- **Critical Flows**: 
- New user creation → Complete quiz → View leaderboard
- Study mode → Test mode → Results
- Multi-user scenarios

### Coverage Tests

- **Tool**: Jest with coverage reporting
- **Thresholds**: 85% lines, 80% branches, 85% functions, 85% statements
- **Run**: Phase 11 comprehensive check

### Accessibility Tests

- **Tools**: axe DevTools, Lighthouse, manual screen reader testing
- **Target**: WCAG 2.1 AA compliance
- **Run**: Phase 11

### Performance Tests

- **Tools**: Lighthouse, WebPageTest
- **Targets**: 
- Performance score ≥90
- First Contentful Paint < 1.8s
- Time to Interactive < 3.8s
- Cumulative Layout Shift < 0.1
- **Run**: Phases 10 and 11

---

## Version Control Strategy

- Commit after completing each phase with descriptive message
- Tag each phase completion with semantic versioning (v0.x.0)
- Push to GitHub after each phase
- Create branches for experimental features
- v1.0.0 marks production deployment
- Follow conventional commits for clear history

---

## Success Metrics

- [ ] All phases completed
- [ ] All tests passing (unit, integration, E2E)
- [ ] 85%+ code coverage
- [ ] Lighthouse scores ≥90 in all categories
- [ ] Deployed to production on Vercel
- [ ] App is responsive and accessible
- [ ] User feedback is positive (post-launch)