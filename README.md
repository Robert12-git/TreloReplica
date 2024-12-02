
# TrelloReplica

### **Author**: Ciurea Robert - Mihai
### **Link**: https://trelo-replica.vercel.app/

---

## **Features**

### **Core Functionalities**
1. **Boards Management**:
   - Create, edit, and delete boards.
   - Navigate to individual board pages.

2. **Lists Management**:
   - Add lists to boards.
   - Rename and delete lists.
   - View lists in a vertical column layout.

3. **Cards Management**:
   - Add cards to lists.
   - Edit card details (title and description).
   - Delete cards.
   - Modal-based interface for editing card details.

4. **Navigation**:
   - A landing page that redirects users to the board dashboard.
   - Persistent navigation between boards and their contents.

---

### **Metrics Collection**
1. **Active Users**:
   - Tracks user activity when interacting with the app, e.g., login and page navigation.
   - Collected using `posthog.capture('user_active')`.

2. **Feature Usage**:
   - Tracks usage of core features like creating boards, lists, and cards.
   - Examples:
     - `posthog.capture('board_created')`
     - `posthog.capture('list_created')`
     - `posthog.capture('card_created')`

3. **Time Spent on Boards**:
   - Captures how much time users spend on each board.
   - Implemented using `useEffect` to track component mount and unmount times.

4. **Retention Metrics**:
   - Tracks how often users interact with features to gauge engagement.
   - Useful for analyzing retention and feature popularity.

---

## **Technology Choices**

1. **React/Next.js**:
   - mandatory

2. **MongoDB**:
   - Chosen for its flexibility in managing hierarchical data structures like boards, lists, and cards.
   - Schema-less design allows for rapid prototyping and changes.

3. **PostHog**:
   - Selected for its ability to track detailed user metrics without requiring self-hosting or additional infrastructure.
   - Provides powerful analytics to understand user behavior and feature usage.
   - Ease of integration with Next.js

4. **TailwindCSS**:
   - Simplifies styling with utility-first classes.
   - Speeds up development by avoiding custom CSS.

5. **Vercel**:
   - Ideal for deploying Next.js applications.
   - Offers serverless functions for API routes with scalability and performance.
   - Ease of integration, friendly with Next.js applications

---

## **Implementation**

### **1. Frontend**
- Built using **Next.js App Router**.
- Key components:
  - **BoardCard**: Displays individual boards with edit options.
  - **ListColumn**: Displays lists in vertical columns.
  - **CardModal**: Modal for editing or deleting cards.
- **State Management**:
  - Managed using `useState` and `useEffect`.
  - Board, list, and card states are dynamically updated after API calls.

---

### **2. Backend**
- API routes are defined under `pages/api` for handling CRUD operations.
- **Routes Implemented**:
  - `/api/boards`: Fetch, create, and delete boards.
  - `/api/boards/:id`: Update a specific board.
  - `/api/boards/:id/lists`: Manage lists for a board.
  - `/api/boards/:id/lists/:listId/cards`: Manage cards for a list.
- **Database**:
  - MongoDB collections for boards, lists, and cards.
  - Boards contain embedded lists, and lists contain embedded cards.

---

### **3. Metrics Tracking**
- Integrated **PostHog** for user behavior tracking.
- Tracked events:
  - **Board Metrics**:
    - Creation, update, and deletion.
    - Time spent on a board.
  - **List Metrics**:
    - Creation, update, and deletion.
  - **Card Metrics**:
    - Creation, update, and deletion.

---

### **4. Error Handling**
- Proper error messages for both frontend and backend.
- Used `try-catch` blocks for API calls with descriptive console logs.
- Fallbacks for missing or undefined data.

---

### **5. Deployment**
- Deployed on **Vercel**.
- Environment variables (e.g., `MONGODB_URI`, `NEXT_PUBLIC_POSTHOG_KEY`) securely stored in Vercel settings.

---

## **Setup Instructions**

1. Clone the repository:
   ```bash
   git clone https://github.com/YourUsername/TrelloReplica.git
   cd TrelloReplica
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env.local` file:
     ```env
     MONGODB_URI=<Your MongoDB Connection String>
     NEXT_PUBLIC_POSTHOG_KEY=<Your PostHog Project Key>
     NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
     ```

4. Run the app locally:
   ```bash
   npm run dev
   ```

5. Build and deploy on Vercel:
   ```bash
   npm run build
   vercel deploy
   ```

---

## **Why These Choices?**

1. **MongoDB**:
   - Flexible and schema-less, ideal for nested data like boards, lists, and cards.
3. **PostHog**:
   - Powerful analytics to understand user behavior and improve retention.

---

## **Analytics Decisions**

### **Why These Metrics Were Chosen**
1. **Active Users**:
   - **Why**: To monitor the overall engagement with the app and understand how frequently users interact with it.
   - **How This Helps**: High active user counts indicate good adoption and retention. A decline in this metric signals a need to investigate potential usability or feature issues.

2. **Feature Usage**:
   - **Why**: To determine which features are most popular among users (e.g., adding cards, editing lists). This helps in prioritizing future development efforts.
   - **How This Helps**: Insights into feature usage guide decisions about which functionalities to enhance or remove based on their value to users.

3. **Time Spent on Boards**:
   - **Why**: To understand user interaction with specific boards and identify which boards are most actively used.
   - **How This Helps**: If certain boards are heavily interacted with, additional features or optimizations for those use cases can be prioritized.

4. **Retention Metrics**:
   - **Why**: To evaluate how often users return to the app and engage with core functionalities.
   - **How This Helps**: Retention metrics provide insights into user satisfaction and long-term adoption of the app.

### **How These Metrics Were Tracked**
1. **PostHog Integration**:
   - Integrated **PostHog** to handle analytics events seamlessly.
   - Example: `posthog.capture('feature_used', { feature: 'add_card' })` tracks whenever a user adds a card.
   
2. **Event-Based Tracking**:
   - Events like `board_created`, `list_created`, `card_created`, and `time_spent_on_board` capture user interactions with granular detail.
   - Each event is accompanied by relevant metadata (e.g., `board_id`, `list_id`, `card_id`, etc.) for deeper analysis.

3. **Implementation Across Components**:
   - **Global Tracking**: Active user metrics are tracked in `_app.tsx` for app-wide monitoring.
   - **Page-Specific Tracking**: Time spent on boards is tracked in `BoardPage` using lifecycle hooks.
   - **Component-Level Tracking**: Feature usage metrics are tracked directly in interactive components like `ListColumn` and `CardModal`.

### **Planned Usage of Metrics**
- Use active user counts to measure the app's growth over time.
- Identify bottlenecks by analyzing time spent on boards or lists and optimizing slow-performing features.
- Evaluate retention by monitoring repeat interactions with core features and identifying drop-offs.
- Guide the roadmap based on feature popularity, improving the app in ways that matter most to users.
