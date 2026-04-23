# React Component Functions and Declared Variables (Plain English)

This file lists function declarations that are React components and the declared variables found in `.tsx` files, with plain-English explanations.

## 1) Function declarations (React components)

- `views/LandingPage.tsx` → `LandingPage`: placeholder landing page.
- `views/SettingsPage.tsx` → `SettingsPage`: manages app/user settings and archive actions.
- `views/DashboardPage.tsx` → `DashboardPage`: shows reminder stats, map, and category summaries.
- `views/AccountPage.tsx` → `AccountPage`: lets user edit/save account details.
- `views/RemindersPage.tsx` → `RemindersPage`: lists, filters, and formats reminders.
- `views/_app.tsx` → `App`: Next.js app wrapper for all pages.
- `views/MapPage.tsx` → `MapPage`: renders map pins from reminders.
- `views/CategoriesPage.tsx` → `CategoriesPage`: displays category data and seeding actions.
- `views/LoginPage.tsx` → `LoginPage`: placeholder login page.
- `app/dashboard/page.tsx` → `Dashboard`: app-router dashboard with auth check.
- `app/login/page.tsx` → `LoginPage`: app-router login form page.
- `app/layout.tsx` → `RootLayout`: global app layout/fonts/providers.
- `app/page.tsx` → `LandingPage`: main marketing/home landing page.
- `components/CreateReminderModal.tsx` → `CreateReminderModal`: placeholder modal component.
- `components/Topbar.tsx` → `Topbar`: top navigation/search/alarm controls.
- `components/Sidebar.tsx` → `Sidebar`: side navigation with reminder counts.
- `components/DashboardClient.tsx` → `DashboardContent`, `DashboardClient`: dashboard client content wrapper.
- `components/Breadcrumbs.tsx` → `Breadcrumbs`: path-based breadcrumb navigation.
- `components/providers/ThemeProvider.tsx` → `ThemeProvider`: theme handling per user/page.
- `components/providers/QueryProvider.tsx` → `QueryProvider`: React Query provider setup.
- `components/reminders/CreateReminderModal.tsx` → `CreateReminderModal`: actual reminder-creation modal.
- `components/reminders/ReminderForm.tsx` → `ReminderForm`: form for reminder input/submit.
- `components/reminders/ReminderList.tsx` → `ReminderList`: reminder list + realtime subscription.
- `components/reminders/ReadOnlyMap.tsx` → `MapCentrator`, `ReadOnlyMap`: map centering + read-only map display.
- `components/reminders/MapSelector.tsx` → `MapEvents`, `SearchControl`, `MapSelector`: pick/search map location.
- `components/reminders/ActiveReminderModal.tsx` → `ActiveReminderModal`: active alarm modal with snooze/dismiss/done.
- `components/map/MapComponent.tsx` → `MapUpdater`, `MapComponent`: interactive map rendering/updating.
- `components/PwaInstallButton.tsx` → `PwaInstallButton`: install prompt for PWA.
- `components/MapView.tsx` → `MapView`: placeholder map component.
- `components/ToastNotification.tsx` → `ToastNotification`: placeholder toast component.
- `components/ui/textarea.tsx` → `Textarea`: styled textarea primitive.
- `components/ui/slider.tsx` → `Slider`: styled slider primitive.
- `components/ui/scroll-area.tsx` → `ScrollArea`, `ScrollBar`: styled scroll container/bar.
- `components/ui/badge.tsx` → `Badge`: styled badge primitive.
- `components/ui/card.tsx` → `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`: card UI primitives.
- `components/ui/tabs.tsx` → `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`: tabs UI primitives.
- `components/ui/button.tsx` → `Button`: styled button primitive.
- `components/ui/input.tsx` → `Input`: styled input primitive.
- `components/ui/label.tsx` → `Label`: styled label primitive.
- `context/AppContext.tsx` → `AppProvider`: context provider component.
- `RemindersPage.backup.tsx` → `RemindersPage`: backup page component.

> Note: `useAppContext` in `context/AppContext.tsx` is a hook, not a component.

## 2) Declared variables (grouped by file) + plain-English purpose

- `app/dashboard/page.tsx`  
  `router, isMounted, checkAuth, user` — navigation + safe async auth check.

- `app/login/page.tsx`  
  `router, handleLogin, handleSignUp` — navigation and auth form handlers.

- `app/layout.tsx`  
  `robotoHeading, inter, geistSans, geistMono` — font configurations for layout.

- `app/page.tsx`  
  `FEATURES, TESTIMONIALS, STEPS, PLANS, HERO_PINS, router, heroY, heroOpacity, t, goToLogin` — landing-page static content, animation values, timer, and login navigation.

- `views/SettingsPage.tsx`  
  `Toggle, settingsKey, CATEGORY_COLOR_MAP, getCategoryColorClasses, toggleFilter, handleBulkDeleteArchive, failed, queryClient, saved, parsed, handleToggle, newDarkMode, handleSave, handleDeleteAll, supabase, getInitials, isSecure, archivedReminders, filteredArchive` — settings helper component, keys, filtering, and save/delete actions.

- `components/Topbar.tsx`  
  `router, queryClient, searchResults, handleSignOut, loc` — topbar navigation/search/logout and alarm location extraction.

- `components/Sidebar.tsx`  
  `NAV_ITEMS_BASE, activeRemindersCount, NAV_ITEMS, isActive` — sidebar menu config and active-count logic.

- `views/DashboardPage.tsx`  
  `allReminders, completed, pending, active, total, allCategories, mapMarkers, mapCenter, mapZoom, cat, catReminders, progress` — dashboard metrics, map data, and category progress.

- `views/AccountPage.tsx`  
  `handleChange, handleSave, updates, updatedUser` — account form/update handling.

- `components/ui/slider.tsx`  
  `_values` — normalized slider values.

- `views/RemindersPage.tsx`  
  `CATEGORY_COLOR_MAP, getCategoryColorClasses, VISIBLE_REMINDERS, filteredReminders, titleMatch, descMatch, locMatch, getRelativeDateText, d, today, yesterday, tomorrow, timeStr, statuses` — reminder filtering, coloring, and date display helpers.

- `components/ui/badge.tsx`  
  `badgeVariants, Comp` — badge style variants and rendered element type.

- `views/MapPage.tsx`  
  `colorToHex, mapReminders, markers, theme` — map pin colors and marker transformation.

- `components/ui/tabs.tsx`  
  `tabsListVariants` — tabs list styling variants.

- `components/ui/button.tsx`  
  `buttonVariants, Comp` — button style variants and rendered element type.

- `views/CategoriesPage.tsx`  
  `getColorClasses, map, queryClient, handleSeed, supabase, user, seedData, chosenCat, title, selectedCategory, colors, reminders, total, doneCount, pendingCount, progress` — category color logic, seed operation, and category stats.

- `RemindersPage.backup.tsx`  
  `VISIBLE_REMINDERS` — filtered non-deleted reminders (backup file).

- `context/AppContext.tsx`  
  `AppContext, savedTab, setActiveTab, context` — context object, persisted tab state, setter, and hook context value.

- `components/map/LocationMap.tsx`  
  `MapComponent` — dynamically imported map component.

- `components/reminders/CreateReminderModal.tsx`  
  `MapSelector, handleSubmit` — dynamic map selector and form submit handler.

- `components/map/MapComponent.tsx`  
  `customIcon, LocationPicker, map, divIcon` — marker icon setup, click picker, map instance, custom marker HTML icon.

- `components/reminders/ReminderList.tsx`  
  `supabase, fetchReminders, channel` — DB client, data fetcher, realtime channel.

- `components/PwaInstallButton.tsx`  
  `handleBeforeInstallPrompt, handleAppInstalled, handleInstall, choice, isIos, isStandalone` — install prompt events, install action, and device/mode checks.

- `components/reminders/ReadOnlyMap.tsx`  
  `customMarkerIcon, map` — read-only map marker and map instance.

- `components/reminders/MapSelector.tsx`  
  `customMarkerIcon, lat, lng, res, data, name, map, handleSearch, item, lon, query` (plus repeated scoped instances) — marker setup, coordinates, geocoding data, and search flow.

- `components/reminders/ReminderForm.tsx`  
  `handleSubmit, formData` — form submit logic and collected form values.

- `components/providers/ThemeProvider.tsx`  
  `DEFAULT_THEME_STORAGE_KEY, CURRENT_USER_KEY, pathname, userId, isPublicPage` — theme/user storage keys and route-based theme behavior.

- `components/reminders/ActiveReminderModal.tsx`  
  `ReadOnlyMap, categoryColors, audioCtx, osc, gain, handleMarkAsDone, handleSnooze, handleDismiss, expandedAlarm, suggestedIdeas, cat, colorName, colors, loc, currentDate, currentTime, suggestionColors` — modal behavior, alarm actions, sound alert, color mapping, and suggestion generation.

- `components/Breadcrumbs.tsx`  
  `getBreadcrumbPath, path, isLast` — breadcrumb path construction and current-item detection.
