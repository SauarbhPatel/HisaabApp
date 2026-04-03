# 💸 Hisaab — Expense + Freelancer Manager

React Native Expo app built from the HTML prototype with a clean, small-component architecture.

## Tech Stack
| Package | Version |
|---|---|
| expo | ~54.0.0 |
| react-native | 0.81.5 |
| react-navigation | v7 |
| expo-linear-gradient | ~15.0.8 |
| react-native-reanimated | ~3.16.0 |
| Nunito + DM Sans fonts | @expo-google-fonts |

## Quickstart
```bash
npm install
npx expo start
# Scan QR with Expo Go, or press a/i for emulator
```

## Architecture
```
src/
├── theme/
│   ├── colors.js          # Brand + semantic colors
│   ├── typography.js      # Font variants (h1…caption)
│   ├── spacing.js         # Spacing, radius, shadows
│   └── index.js           # Barrel export
│
├── data/
│   └── mockData.js        # Projects, friends, groups, expenses, notifications
│
├── components/
│   ├── ui/                # Atoms — smallest reusable pieces
│   │   ├── AppText.js     # Typed text with 13 variants
│   │   ├── Card.js        # White rounded card container
│   │   ├── Avatar.js      # Initials avatar
│   │   ├── Badge.js       # Colored pill label
│   │   ├── Button.js      # 8 variants × 3 sizes
│   │   ├── ProgressBar.js # Configurable bar
│   │   └── FormInput.js   # Labeled text input
│   │
│   └── common/            # Composed widgets
│       ├── HeroGradient.js        # Gradient section header
│       ├── SearchBar.js           # Search input
│       ├── FilterBar.js           # Horizontal chip row
│       ├── SectionHeader.js       # Label + optional action
│       ├── StatusPill.js          # Project status pill
│       ├── BalanceBadge.js        # Owe/Lent/Settled badge
│       ├── PaymentMethodPicker.js # UPI/Cash/Bank selector
│       ├── ScreenHeader.js        # Gradient header + back
│       └── FullModal.js           # Page-sheet modal wrapper
│
├── features/              # Feature-specific components
│   ├── home/
│   │   ├── StatCard.js
│   │   ├── MiniChart.js
│   │   ├── QuickActionButton.js
│   │   └── ActivityItem.js
│   ├── projects/
│   │   ├── ProjectCard.js
│   │   ├── ProjectDetailModal.js
│   │   ├── PayDevModal.js
│   │   └── AddProjectModal.js
│   ├── friends/
│   │   ├── FriendCard.js
│   │   └── SettleModal.js
│   ├── groups/
│   │   └── GroupCard.js
│   ├── expenses/
│   │   └── ExpenseCategoryRow.js
│   ├── reports/
│   │   └── CategoryBar.js
│   └── notifications/
│       └── NotificationCard.js
│
├── screens/               # Thin screens — layout only
│   ├── HomeScreen.js
│   ├── ProjectsScreen.js
│   ├── ExpensesScreen.js
│   ├── FriendsScreen.js
│   ├── GroupsScreen.js
│   ├── ReportsScreen.js
│   ├── NotificationsScreen.js
│   └── ProfileScreen.js
│
└── navigation/
    └── AppNavigator.js    # Tab + Stack navigator
```

## Screens
| Screen | Route |
|---|---|
| Home | Tab — dashboard, stats, activity |
| Groups | Tab — group expenses |
| Friends | Tab — balances, settle up |
| Expenses | Tab — add expense, category list |
| Reports | Tab — charts, income breakdown |
| Projects | Stack (from Home nav) — project manager |
| Notifications | Stack (from topbar bell) |
| Profile | Stack (from topbar avatar) |
