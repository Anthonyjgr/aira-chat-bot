# Technical Assessment: AI Chat Application

## **Overview**
Build a modern, responsive chat application that simulates an AI assistant interface. This assessment evaluates your skills in React/TypeScript, API integration, authentication, UI/UX design, and clean code practices.

## **⚡ Time Limit**
**4-6 hours maximum** (can be completed across multiple sessions)

---

## **🎯 Requirements**

### **Core Features**
1. **User Authentication**
   - Login/Register forms with validation
   - JWT token management (using provided mock API)
   - Protected routes
   - Session persistence

2. **Chat Interface**
   - Interactive messaging with simulated AI responses
   - AI response simulation with typing indicators
   - Message history using mock API
   - Multiple conversation support

3. **Responsive Design**
   - Mobile-first approach
   - Clean, modern UI/UX
   - Dark/light theme (bonus)
   - Smooth animations and transitions

4. **API Integration**
   - Mock API calls for authentication and data management
   - Simulated AI responses with realistic delays
   - Error handling with user feedback
   - Loading states throughout the app

### **Technical Stack Requirements**
- **Frontend:** React with TypeScript or Next
- **Styling:** Tailwind CSS, Styled Components, etc
- **State Management:** Context API, Redux Toolkit, etc
- **Build Tool:** Vite, etc
- **HTTP Client:** Use provided mock API functions

---

## **🏗️ Application Structure**

### **Pages/Views Required:**
1. **Authentication Page** (`/login`, `/register`)
2. **Dashboard** (`/dashboard`) - Conversation list
3. **Chat Interface** (`/chat/:conversationId`)
4. **User Profile** (`/profile`) - Basic user info

### **Key Components:**
- `AuthForm` - Reusable login/register form
- `ChatMessage` - Individual message component
- `MessageInput` - Message composition area
- `ConversationList` - Sidebar with chat history
- `TypingIndicator` - Shows when AI is "thinking"
- `ProtectedRoute` - Route guard for authentication

---

## **🔧 Provided Resources**

### **Mock API (Provided)**
You'll receive a complete mock API file (`mockApi.js`) with these functions:

```typescript
// Authentication
mockApi.login(email, password)
mockApi.register(email, password, name)
mockApi.getCurrentUser(token)

// Conversations
mockApi.getConversations(token)
mockApi.createConversation(token, title?)
mockApi.getMessages(token, conversationId)
mockApi.sendMessage(token, conversationId, content)
mockApi.simulateAIResponse(conversationId, userMessage)

// Profile
mockApi.updateProfile(token, updates)
```

**Mock API Features:**
- Realistic network delays (400-1200ms)
- 10% random failure simulation for error handling testing
- Pre-populated conversations and messages
- JWT-like token simulation
- Input validation and error messages
- AI response simulation with contextual replies

### **Demo Credentials:**
- **Email:** `demo@example.com`
- **Password:** Any password with 6+ characters

---

## **💡 Implementation Guidelines**

### **AI Response Simulation:**
```typescript
// Expected AI response flow
const handleSendMessage = async (message: string) => {
  // 1. Send user message
  const userMsg = await mockApi.sendMessage(token, conversationId, message);
  
  // 2. Show typing indicator
  setIsTyping(true);
  
  // 3. Simulate AI response (built into mock API)
  const aiResponse = await mockApi.simulateAIResponse(conversationId, message);
  
  // 4. Hide typing indicator and show response
  setIsTyping(false);
  setMessages(prev => [...prev, userMsg.message, aiResponse.message]);
};
```

### **Clean Code Practices:**
- Use TypeScript interfaces for all data types
- Implement custom hooks for API logic and state management
- Separate concerns (UI, business logic, API calls)
- Follow consistent naming conventions
- Add meaningful comments for complex logic

### **Performance Considerations:**
- Implement proper memoization (`React.memo`, `useMemo`)
- Optimize re-renders with `useCallback`
- Lazy load components where appropriate
- Debounce user inputs

### **Error Handling:**
- Network error boundaries
- Form validation with user-friendly messages
- Graceful API failure handling
- Toast notifications for user feedback
- Retry mechanisms for failed requests

### **UX/UI Excellence:**
- Intuitive navigation flow
- Consistent spacing and typography
- Proper loading states (skeletons, spinners)
- Accessible design (keyboard navigation, ARIA labels)
- Smooth micro-interactions

---

## **🎨 Design Requirements**

### **Layout (suggested):**
- **Desktop:** Sidebar with conversations + main chat area
- **Mobile:** Full-screen chat with collapsible conversation list
- **Tablet:** Adaptive layout between desktop and mobile

### **Visual Elements (suggested):**
- Message bubbles with clear sender distinction
- Timestamps and read status indicators
- Empty states with helpful messaging
- WebSocket connection status indicator
- Professional, modern aesthetic

### **Required UI States:**
- Loading conversations
- Empty conversation list
- Typing indicator when AI is responding
- Message sending/failed states
- Network error states

---

## **📦 Deliverables**

1. **Source Code**
   - GitHub repository with clear commit history
   - Proper `.gitignore` and environment file examples
   - No node_modules or build artifacts

2. **Documentation**
   - Comprehensive README with setup instructions
   - Architecture decisions and trade-offs explanation
   - Screenshots or GIFs of key features
   - Known issues or limitations

3. **Demo** (Optional but recommended)
   - Deployed version (Vercel, Netlify, etc.)
   - Screen recording showing key features

---

## **🚀 Getting Started**

### **Setup Instructions:**

1. **Download the starter pack:**
   - `mockApi.js` - Complete mock API implementation with AI simulation
   - `.env.example` - Environment variables template

2. **Create your frontend application:**
   ```bash
   npm create vite@latest chat-app -- --template react-ts
   cd chat-app
   npm install
   ```

3. **Integrate the mock API:**
   - Copy `mockApi.js` to your `src/` directory
   - Import and use the mock functions instead of fetch/axios
   - Use the built-in AI response simulation

4. **Test the functionality:**
   - Login with `demo@example.com` + any 6+ char password
   - Create or select a conversation
   - Send a message and verify AI responses are simulated correctly

### **Environment Variables:**
```bash
# .env
VITE_API_BASE_URL=mock://api  # For consistency, not actually used
```

---

## **💡 Pro Tips**

- **Start with authentication flow** - Get login/register working first
- **Build incrementally** - Auth → Conversations → Chat → Polish
- **Use React DevTools** - Debug state management and component renders
- **Test error scenarios** - The mock API includes 10% failure rate for testing
- **Focus on user experience** - Smooth transitions and clear feedback are key
- **AI Response Testing** - Try different message types to see varied AI responses

---

## **⏰ Submission**
- GitHub repository link
- Brief explanation (2-3 paragraphs) of your approach and any trade-offs made

---

## **🎯 Success Criteria**
A successful submission will demonstrate:
- Working authentication flow with mock API
- Interactive chat functionality with AI response simulation
- Responsive design that works on mobile and desktop
- Clean, well-structured TypeScript code
- Proper error handling and loading states
- Professional UI/UX with smooth interactions

**Good luck! We're excited to see your solution. Focus on writing clean, maintainable code and creating a great user experience.**