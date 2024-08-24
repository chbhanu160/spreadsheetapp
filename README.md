# Spreadsheet App

A spreadsheet application built with Next.js, Tailwind CSS, and Zustand for state management. This project mimics the functionality of a traditional spreadsheet with advanced features such as cell editing, formatting, validation, search, pagination, and undo/redo capabilities.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Grid Rendering**: A grid of 1000 editable cells with efficient performance.
- **Cell Editing**: Edit cells dynamically with user input.
- **Data Storage**: Cell data is stored in memory using Zustand for state management.
- **Cell Formatting**: Basic formatting options such as text alignment and font size.
- **Data Validation**: Restrict cells to accept only numeric values or specific text formats.
- **Search and Filter**: Quickly locate and highlight specific data within the grid.
- **Pagination**: Navigate through large datasets with pagination controls.
- **Undo/Redo**: Revert changes made to cells with undo and redo functionality.
- **Responsive Design**: Fully responsive and functional across different devices and screen sizes.

## Installation

To run this application locally, follow these steps:

1. **Clone the repository**:

   git clone https://github.com/chbhanu160/spreadsheetapp.git
   cd spreadsheetapp
   
**Install dependencies:**
npm install
Run the development server:

npm run dev
Open your browser and navigate to http://localhost:3000 to see the app in action.

**Usage**
Grid Interaction: Click on any cell to edit its content.
Formatting Options: Use the toolbar to change text alignment and font size.
Data Validation: Ensure specific cells accept only numeric inputs.
Search Functionality: Use the search bar to find and highlight cells with matching content.
Pagination Controls: Navigate between different pages of the spreadsheet.
Undo/Redo: Use the undo and redo buttons to revert or reapply changes.

**Contributing**
Contributions are welcome! If you'd like to contribute to this project, please follow these steps:
Fork the repository.
Create a new branch (git checkout -b feature-branch).
Make your changes and commit them (git commit -m 'Add some feature').
Push to the branch (git push origin feature-branch).
Open a pull request.
