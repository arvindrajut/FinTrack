# **Expense Tracker Application**

## **Overview**
The Expense Tracker Application is a beginner-friendly tool designed to help users manage their finances effectively. The application allows users to enter expenses, track their remaining balances, plan budgets, and visualize financial data. It features a user-friendly dashboard, integrated bank account connection via Plaid, and AI-driven insights to make financial planning more intuitive and interactive.

## **Features**

### **1. User Dashboard**
- **Expense Entry**: Users can add expenses by specifying details like description, amount, category, and payment method.
- **Balance Tracking**: The app displays current balance, income, and expenses in an easy-to-read format.
- **Financial Overview**: The homepage includes a summary of income, expenses, and available balance, with a clear and engaging design.

### **2. Bank Integration**
- **Plaid Integration**: Connect your bank accounts securely using Plaid to track balances and transactions in real-time.
- **Account Overview**: View bank account details and balance summaries, all integrated within the application.

### **3. AI-Driven Features**
- **Gemini AI Integration**: Users can enter expense ideas in a chat-like interface, where Gemini AI will provide personalized feedback.
  - **Spending Timeline**: Suggests when to spend and creates a spending timeline based on user inputs.
  - **Expense Analysis**: Provides explanations for why a suggested expense may not be a good idea and offers alternatives.

### **4. Admin Portal**
- **Admin Access**: An admin portal that allows management of all user accounts and expense records for better visibility and control.

### **5. Email Notifications**
- **Spending Alerts**: Email notifications to inform users of upcoming spending days.
- **AI Suggestions**: Gemini AI will offer suggestions if spending is determined to be a poor choice, with alternative options such as extending timelines.

## **Tech Stack**
- **Frontend**: React.js with mobile-first design inspired by Apple iOS app aesthetics.
- **Backend**: Node.js, Express.js for API endpoints.
- **Authentication**: JWT for user authentication.
- **Database**: MongoDB for storing user and expense data.
- **Streaming**: Kafka.js for streaming data (in progress).
- **AI Integration**: Gemini AI for expense insights and recommendations.

## **Installation**
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up environment variables** for Plaid API, Gemini AI, and JWT.
4. **Start the server**:
   ```bash
   npm run start
   ```

## **TODO / Coming Soon**
- **Gemini AI Chat Feature**: Implement a chat bar where users can input their expense ideas, and Gemini AI will generate a spending timeline or provide reasons why the expense might not be advisable.
- **Spending Timeline Section**: Add a section where users can view their spending timeline and automate spending based on AI suggestions.
- **Enhanced Email Notifications**: Improve notifications to suggest alternative paths when spending is deemed inadvisable by Gemini AI, with strong directives for better financial guidance.
- **Revamped Mobile Experience**: Continue enhancing the mobile-first design to make the app more engaging and user-friendly.

## **Contribution**
Feel free to open issues or submit pull requests. Contributions are always welcome!

## **License**
This project is licensed under the MIT License.

