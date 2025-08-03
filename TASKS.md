# AscendCoopPlatform Tasks

## WhatsApp-Style Messaging Feature Implementation

### Frontend Tasks - UI Components

#### Chat List Component
- [x] Create `ChatListComponent` in `src/app/modules/messaging/components/chat-list/`
  - Display all conversations for current user with profile pictures, last message snippet, and timestamp
  - Implement Firestore query filtering chats where `participants` array contains current user's UID
  - Subscribe to real-time updates using AngularFirestore observables
  - Add navigation to chat window on list item click
  - Style with WhatsApp-like design using Ionic components

#### Chat Window Component  
- [x] Create `ChatWindowComponent` in `src/app/modules/messaging/components/chat-window/`
  - Display conversation title (friend's name for 1-on-1, group name for groups)
  - Add header with back button, info, and block actions
  - Implement scrollable message history with auto-scroll to latest
  - Create message bubble sub-components with sender/receiver styling
  - Show timestamps and sender names (for group chats)
  - Implement lazy-loading for message history pagination

#### New Chat / Group Creation Flow
- [x] Create `NewChatComponent` in `src/app/modules/messaging/components/new-chat/`
  - Add "new chat" button to chat list with contact selection dialog
  - List accepted contacts from `relatedAccounts` sub-collection (status == "accepted")
  - Support single contact selection for 1-on-1 or multiple for group chat
  - Add group name input and optional group image for group chats
  - Prevent duplicate 1-on-1 conversations, reuse existing ones
  - Navigate to new chat window after creation

#### Block List Management UI
- [ ] Create `BlockListComponent` in `src/app/modules/messaging/components/block-list/`
  - Display list of blocked users in settings/contacts management
  - Add unblock functionality for each blocked contact
  - Integrate with main settings navigation

### Frontend Tasks - Message Input, Display, and Attachments

#### Message Input Box
- [x] Implement sticky input area in `ChatWindowComponent`
  - Use `IonTextarea` for multiline message composition
  - Add Send button that activates on non-empty input
  - Handle Enter key press for sending (with Shift+Enter for new line)
  - Disable input when user is blocked or not an accepted contact

#### Attachment Button & Media Sending
- [x] Add attachment functionality to message input
  - Create attachment icon button next to text input
  - Implement file picker for images and documents
  - Add support for drag-and-drop file uploads
  - Upload files to Firebase Storage at `/chatMedia/<conversationId>/<filename>`
  - Show upload progress indicator in chat
  - Send Firestore message with file URL, name, size, and type metadata

#### Display Messages (Text & Media)
- [x] Implement message rendering in `ChatWindowComponent`
  - Style text messages with different colors for sent/received
  - Display image thumbnails with click-to-view full size
  - Show file icons with download links for non-image attachments
  - Add timestamp display for each message
  - Show sender names in group chats

#### Message Sending Logic
- [x] Create `ChatService` in `src/app/modules/messaging/services/`
  - Implement `sendMessage(conversationId, text)` method
  - Write new documents to Firestore `messages` subcollection
  - Include `senderId`, `text`, `timestamp`, and `type` fields
  - Handle errors with toast notifications
  - Clear input on successful send

#### Persistent History & Pagination
- [x] Implement message history management  ✅ **COMPLETED**
  - Load last 50 messages when opening chat
  - Add infinite scroll for older messages using Firestore query cursors
  - Maintain scroll position when prepending older messages
  - Cache messages locally for offline viewing

### Frontend Tasks - Real-Time Updates

#### Firestore Listeners for Chats
- [x] Set up real-time chat list synchronization
  - Subscribe to Firestore `chats` collection with `participants` array-contains filter
  - Update chat list automatically on new conversations or metadata changes
  - Unsubscribe properly on component destruction to prevent memory leaks

#### Firestore Listeners for Messages
- [x] Implement real-time message synchronization
  - Attach listener to `messages` subcollection ordered by timestamp
  - Push new messages to UI immediately via Angular change detection
  - Handle proper subscription cleanup on navigation away

#### Optimistic UI Updates
- [x] Enhance UX with immediate message display  ✅ **COMPLETED**
  - Show messages with "sending" indicator before Firestore confirmation
  - Update message status to "sent" or "failed" based on Promise result
  - Handle retry logic for failed messages

#### Notifications for New Messages (Foreground)
- [ ] Implement in-app notification system
  - Update chat list with unread badges for new messages
  - Show toast notifications for messages in background chats
  - Highlight active conversations with new activity

### Frontend Tasks - Message Blocking and Permissions Enforcement

## Phase 3: Friend System Integration

### Friend Acceptance Check (Frontend)
- [x] Create relationship validation service
- [x] Check relatedAccounts status before allowing chat creation
- [x] Prevent navigation to chats with non-accepted contacts
- [x] Show appropriate error messages for unauthorized access attempts

#### Block User Option
- [x] Add blocking functionality to chat interface  ✅ **COMPLETED**
  - Create "Block Contact" action in chat header menu
  - Update `relatedAccounts` status to "blocked"
  - Disable message input and show blocked status message
  - Add "Unblock" option in same menu

#### Enforce Blocking in UI
- [x] Implement blocking behavior throughout interface  ✅ **COMPLETED**
  - Hide/disable send functionality for blocked contacts
  - Filter out messages from blocked users (local UI filtering)
  - Handle group chat blocking scenarios appropriately

#### Guard Routes/Components
- [ ] Create Angular route guards for chat access
  - Implement `ChatAccessGuard` to verify participant permissions
  - Check mutual acceptance before allowing chat access
  - Redirect to appropriate error page for unauthorized access

### Frontend Tasks - UI Layout and Styling (WhatsApp-like)

#### Responsive Layout
- [ ] Implement responsive chat interface design
  - Use `IonSplitPane` for desktop two-column layout (list + chat)
  - Single view navigation for mobile (list OR chat)
  - Test and optimize for various screen sizes

#### WhatsApp-Style Design
- [x] Style components to match WhatsApp aesthetics
  - Green/blue bubbles for outgoing, gray for incoming messages
  - Rounded corners and subtle shadows on message bubbles
  - Chat list with avatar, bold title, message snippet, and timestamp
  - Unread message badges and bold text indicators

#### Input and Attachment UI
- [x] Polish input area and attachment interface
  - Clear attachment menu with icons for different media types
  - Visible send, attach, back, and block icons using Ionicons
  - Ensure accessibility and mobile-friendly touch targets

#### Scrolling and Keyboard Behavior
- [x] Optimize mobile keyboard interaction
  - Ensure proper view scrolling when keyboard opens
  - Auto-scroll to bottom on new messages (when user is at bottom)
  - Implement "new messages" indicator when user is scrolled up

#### Separation of Concerns (Frontend Architecture)
- [x] Organize code for maintainability
  - Create separate Angular module `MessagingModule`
  - Implement state management with NgRx for chat state
  - Add comprehensive documentation and TODO comments
  - Lazy-load messaging module to improve initial app load time

### Backend Tasks - Firestore Schema Design

#### Design Conversation Collection
- [x] Create Firestore `chats` collection schema
  - `participants`: array of user UIDs
  - `isGroup`: boolean to distinguish group vs direct chats
  - `name`/`groupName`: group chat titles
  - `createdAt`: timestamp of conversation creation
  - `lastMessage`, `lastMessageTimestamp`, `lastMessageSender`: metadata
  - `unreadCount`: per-user unread message tracking

#### Design Messages Subcollection
- [x] Create `messages` subcollection schema under each chat
  - `senderId`: UID of message sender
  - `text`: message content for text messages
  - `fileUrl`: download URL for media/file messages
  - `fileName`, `fileType`, `fileSize`: file metadata
  - `timestamp`: server timestamp
  - `type`: message type ("text", "image", "file", etc.)

#### Firestore Security Rules for Chats
- [x] Update `firestore.rules` for chat access control
  - Restrict chat read/write to participants only
  - Enforce friend relationship validation on chat creation
  - Prevent unauthorized participant modifications
  - Implement per-user unread count update permissions

#### Friend Relationship Enforcement
- [ ] Implement relationship validation logic
  - Check mutual `relatedAccounts` acceptance before chat creation
  - Auto-create chats when friend requests are accepted (optional)
  - Document friendship-messaging coupling for maintainers

### Backend Tasks - Cloud Functions (Notifications & Access Control)

#### Notification on New Message
- [x] Create Cloud Function triggered by new message creation
  - Extract recipients from chat participants (excluding sender)
  - Retrieve FCM device tokens for each recipient
  - Send push notifications using Firebase Admin SDK messaging
  - Handle invalid tokens and cleanup gracefully

#### Update Chat Metadata
- [x] Implement chat metadata updates on new messages
  - Update `lastMessage`, `lastMessageTimestamp`, `lastMessageSender`
  - Increment unread counts for all recipients
  - Use atomic updates to prevent race conditions

#### Enforce Communication Rules (Cloud Function Validation)
- [ ] Create validation triggers for chats and messages
  - Verify participant relationships on chat creation
  - Double-check sender permissions on message creation
  - Remove or mark invalid communications
  - Log violations for audit trail

#### Group Chat Management Functions
- [ ] Implement callable functions for group management
  - `addUserToChat(chatId, newUserId)` with permission checks
  - `removeUserFromChat(chatId, userId)` functionality
  - `createGroupChat(name, participantIds[])` with validation
  - Add system messages for group changes

#### Metadata and Cleanup Functions
- [ ] Create maintenance and cleanup functions
  - Schedule cleanup of old messages/attachments (optional)
  - Handle user account deletion impact on chats
  - Implement audit logging for message activity

### Backend Tasks - File Storage (Firebase Storage)

#### Configure Firebase Storage Rules
- [x] Update Storage security rules for chat media
  - Restrict uploads to authenticated users only
  - Implement read permissions for chat participants
  - Set file size and type restrictions

#### Implement File Upload in Backend
- [ ] Set up file processing Cloud Functions
  - Add image thumbnail generation for performance (optional)
  - Implement virus scanning or file validation
  - Set storage cost alerts and limits

#### Link Storage with Firestore
- [ ] Ensure file-message consistency
  - Validate file existence on message creation
  - Implement automatic cleanup of orphaned files
  - Organize storage paths by chat for management

### Backend Tasks - Real-Time Sync (Listeners and Triggers)

#### Firestore Listeners (Backend)
- [ ] Optimize Firestore for real-time queries
  - Create composite indexes for efficient queries
  - Define indexes in `firestore.indexes.json`
  - Test array-contains queries with orderBy combinations

#### Firestore Triggers
- [ ] Deploy and test all Cloud Function triggers
  - New message trigger for notifications and metadata
  - New chat trigger for relationship validation
  - Storage trigger for file processing
  - Implement error handling and retry logic

#### Testing Real-time Behavior
- [ ] Comprehensive real-time testing
  - Test multi-user messaging scenarios
  - Verify notification delivery
  - Validate security rule enforcement
  - Performance test with multiple concurrent chats

### Backend Tasks - Scalability & Performance Considerations

#### Firestore Indexes and Query Performance
- [x] Optimize database performance
  - Create all necessary composite indexes
  - Monitor Firestore usage and read/write patterns
  - Implement query limits and pagination

#### Pagination and Limits
- [ ] Implement efficient data loading
  - Limit chat list queries (e.g., first 50 chats)
  - Implement message pagination with Firestore cursors
  - Configure offline cache settings appropriately

#### Load Testing & Batch Operations
- [ ] Prepare for scale and optimize batch operations
  - Use `sendMulticast` for efficient notification delivery
  - Implement rate limiting for high-activity chats
  - Design functions to handle concurrent updates gracefully

#### Scalability of Storage
- [ ] Plan for storage growth
  - Implement file retention policies
  - Generate thumbnails for bandwidth optimization
  - Monitor and alert on storage costs

#### Code Maintainability
- [ ] Ensure long-term maintainability
  - Separate Cloud Functions into logical files
  - Add comprehensive code documentation
  - Plan for future scaling with TODO comments
  - Set up monitoring and performance alerts

#### Testing and Iteration
- [ ] Comprehensive testing strategy
  - Test all messaging scenarios (1-on-1, group, blocking)
  - Use Firebase emulator suite for local testing
  - Profile app performance under load
  - Implement automated testing for security rules

---

## Worker-Owned Cooperative Incubator (Need To Redefine These Tasks)

1. Identify skill sets needed for worker-owned businesses
2. Connect skilled individuals with worker-owned businesses
3. Provide various services such as technical assistance and advice

## Collaboration Platform (Need To Clearly Define These And Other Features)

1. User and organization profiles
2. Group creation and management
3. Real-time data to address issues
4. Collaboration features, such as event proposals, voting, and commenting

## Utopian Think Tank (Need To Convert These Into Technical Items)

1. Collaborate with organizations and research
2. Address basic human needs
3. Develop community-based solutions
