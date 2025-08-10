# Profile Page Rework and FAQ System

## Overview

This implementation reworks the profile page to use Ionic segments for better navigation and adds a comprehensive FAQ system for groups.

## Key Changes

### 1. Profile Page with Segments

**File**: `src/app/modules/account/pages/details/details.page.html`

The profile page now uses `ion-segment` instead of the old tab-based navigation:

- **Segments Include**:
  - Profile/About
  - Contact Information
  - Professional Information (users only)
  - Friends/Members (Connections)
  - Organizations
  - Volunteer Preferences (users only)
  - Mutual Aid (users only, if applicable)
  - FAQ (groups only)
  - Listings

**Benefits**:

- Better mobile UX with swipeable segments
- Cleaner visual design
- Sticky navigation that stays visible while scrolling
- Animated content transitions

### 2. FAQ System for Groups

#### FAQ Display Component

**Location**: `src/app/modules/account/pages/details/components/faq-section/`

**Features**:

- Accordion-style FAQ display
- Edit/delete controls for group admins
- Empty state with call-to-action
- Responsive design
- Track by functionality for performance

#### FAQ Management Component

**Location**: `src/app/modules/account/pages/edit/components/faq-form/`

**Features**:

- Add/remove FAQs
- Reorder FAQs (move up/down)
- Form validation (500 char limit for questions, 2000 for answers)
- Real-time character counters
- Auto-save functionality

### 3. Data Model Updates

**File**: `shared/models/account.model.ts`

Added `FAQ` interface and updated `GroupSpecific`:

```typescript
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface GroupSpecific {
  // ... existing fields
  faqs?: FAQ[];
}
```

### 4. Navigation Integration

**Files**:

- `src/app/modules/account/pages/edit/components/edit-menu/edit-menu.component.html`
- `src/app/modules/account/pages/edit/edit.page.html`

Added FAQ management option in the edit menu for group accounts.

## Usage

### For Group Administrators

1. **View FAQs**: Navigate to any group profile and select the "FAQ" segment
2. **Edit FAQs**: Go to Account → Edit → FAQ Management
3. **Add FAQ**: Click "Add FAQ" and fill in question/answer
4. **Reorder**: Use up/down arrows to change FAQ order
5. **Delete**: Use trash icon to remove FAQs

### For Group Members/Visitors

1. Navigate to group profile
2. Select "FAQ" segment to view all questions and answers
3. Click on questions to expand answers

## Technical Implementation

### Segment Navigation

```typescript
// Component property
selectedSegment: string = 'profile';

// Event handler
onSegmentChange(event: any): void {
  this.selectedSegment = event.detail.value;
}
```

### FAQ Form Management

```typescript
// Add new FAQ
addFAQ() {
  this.faqsFormArray.push(this.createFAQFormGroup());
}

// Create form group with validation
createFAQFormGroup(faq?: FAQ): FormGroup {
  return this.fb.group({
    id: [faq?.id || this.generateId()],
    question: [faq?.question || "", [Validators.required, Validators.maxLength(500)]],
    answer: [faq?.answer || "", [Validators.required, Validators.maxLength(2000)]],
    createdAt: [faq?.createdAt || new Date()],
    updatedAt: [new Date()],
  });
}
```

## Styling

### Segment Styles

- Sticky positioning for easy navigation
- Smooth animations between content
- Mobile-responsive design
- Dark mode support

### FAQ Styles

- Card-based layout for better visual hierarchy
- Hover effects for interactive elements
- Consistent spacing and typography
- Loading states and empty states

## Accessibility

- Proper ARIA labels for screen readers
- Keyboard navigation support
- High contrast support
- Semantic HTML structure

## Performance Considerations

- **TrackBy Functions**: Efficient list rendering for FAQs
- **OnPush Change Detection**: Optimized re-rendering
- **Lazy Loading**: Segments load content only when needed
- **Form Validation**: Client-side validation reduces server requests

## Future Enhancements

1. **Drag & Drop Reordering**: Visual drag-and-drop for FAQ ordering
2. **Rich Text Editor**: WYSIWYG editor for FAQ answers
3. **FAQ Categories**: Group FAQs by topics
4. **Search Functionality**: Search within FAQs
5. **Analytics**: Track most viewed FAQs
6. **Import/Export**: Bulk FAQ management
7. **FAQ Templates**: Pre-made FAQ sets for different organization types

## Browser Support

- Modern browsers with ES2020+ support
- iOS Safari 14+
- Android Chrome 80+
- Desktop Chrome/Firefox/Safari latest versions

## Testing

Both components include comprehensive unit tests:

- Component creation and initialization
- Form validation and interactions
- Event handling
- Edge cases and error conditions

Run tests with:

```bash
npm run test
```

## Dependencies

- **@ionic/angular**: Segment and UI components
- **@angular/forms**: Reactive forms for FAQ management
- **@ngrx/store**: State management for data persistence
- **@angular/common**: Common directives and pipes
