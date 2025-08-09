# Reusable React Table Component

A flexible and dynamic table component built with React, TypeScript, and Tailwind CSS that can handle various data types and configurations.

## Features

- **Dynamic Headers**: Configure table headers with custom labels, data types, and styling
- **Multiple Data Types**: Support for string, number, date, currency, and status data types
- **Responsive Design**: Mobile-friendly with horizontal scrolling for wide tables
- **Customizable Styling**: Built with Tailwind CSS for easy customization
- **TypeScript Support**: Full type safety with comprehensive interfaces
- **Status Badges**: Automatic styling for status fields with color-coded badges
- **Hover Effects**: Smooth hover transitions for better user experience

## Data Types Supported

- **string**: Plain text display
- **number**: Formatted with locale-specific number formatting
- **date**: Formatted as readable date/time strings
- **currency**: Automatically converts cents to currency format with proper formatting
- **status**: Displays as colored badges (PAID = green, UNPAID = red, etc.)

## Usage

### Basic Example

```tsx
import Table from "./components/Table";
import type { HeadersConfig } from "./types/table";

const headersConfig: HeadersConfig = {
  id: {
    key: "id",
    label: "ID",
    type: "number",
    width: "100px",
    align: "center",
  },
  amount_cents: {
    key: "amount_cents",
    label: "Amount",
    type: "currency",
    width: "150px",
    align: "right",
  },
  payment_status: {
    key: "payment_status",
    label: "Status",
    type: "status",
    width: "120px",
    align: "center",
  },
};

const data = [
  {
    id: 299894,
    amount_cents: 5000,
    payment_status: "UNPAID",
  },
];

function App() {
  return <Table headersConfig={headersConfig} data={data} className="w-full" />;
}
```

### Header Configuration Options

Each header configuration supports the following properties:

- **key**: The property name in your data object
- **label**: The display text for the column header
- **type**: Data type ('string', 'number', 'date', 'currency', 'status')
- **width**: Optional column width (e.g., '100px', '20%')
- **align**: Text alignment ('left', 'center', 'right')
- **sortable**: Optional flag for sorting functionality
- **filterable**: Optional flag for column filtering functionality

## Installation

1. Install dependencies:

```bash
npm install
```

2. The component is ready to use with the provided TypeScript interfaces.

## Design Choices

### UI/UX Design

- **Clean and Modern**: Uses a clean, professional design with subtle shadows and borders
- **Responsive**: Horizontal scrolling for mobile devices while maintaining readability
- **Visual Hierarchy**: Clear distinction between headers and data with different background colors
- **Interactive Elements**: Hover effects on rows for better user feedback
- **Status Indicators**: Color-coded badges for status fields to improve scanability

### Technical Design

- **Type Safety**: Comprehensive TypeScript interfaces ensure type safety
- **Reusability**: Component accepts configuration objects, making it highly reusable
- **Performance**: Efficient rendering with proper key props and minimal re-renders
- **Accessibility**: Semantic HTML structure with proper table elements
- **Maintainability**: Clean, well-documented code with helper functions for complex logic

### Data Formatting

- **Currency**: Automatically converts cents to currency format (5000 → 50.00 EGP)
- **Dates**: Formats ISO date strings to readable format
- **Numbers**: Uses locale-specific number formatting
- **Status**: Converts to uppercase and applies appropriate styling

## File Structure

```
src/
├── components/
│   ├── Table.tsx                 # Main table composer
│   └── table/
│       ├── Search.tsx            # Global search + filter toggle
│       ├── Filters.tsx           # Column filters (date range, number, status, text)
│       └── Pagination.tsx        # Page size select + nav
├── types/
│   └── table.ts                  # TypeScript interfaces
├── App.tsx                       # Demo implementation
└── index.css                     # Tailwind CSS imports
```

## Running the Demo

1. Start the development server:

```bash
npm run dev
```

2. Open your browser to see the table component in action with the sample payment data.

The demo showcases all supported data types and demonstrates the component's flexibility and visual appeal.
