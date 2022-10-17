# AV Code-Test

## Code Test

Please see coding exercise here:

**Front End in React:**

- Create a form to upload a csv to the backend service.
- CSV could be anywhere between **5MB** to **500GB**.
- Format of CSV(create your own for testing):

**`First_Name, Last_Name, ID`**

`Mark, Twain, 1`

`Stephen, King, 2`

`Charles, Dickens, 3`

- Show validation errors coming from the backend.

**Backend Service in Node.js:**

- Write a backend service that receives a POST call with the CSV payload.
- Validate the file for correctness(existence of `First_Name`, `Last_Name`, `ID` in the header, **a non-empty string** for first name and last name, and **Integers** for ID)
- Create a schema in the database to accommodate storing the CSV data.
- Transact the file upload as one transaction to the database.
- The service should support multiple file uploads simultaneously and multiple uploads of the same file.

*Share any particular design choices you made for writing the frontend and backend.*

*Please include tests with your code.*

## Project Design

- Package Choices
  - Framework - Remix JS
  - DB - Postgres DB
  - ORM - Prisma
  - Utils
    - Upload - React-dropzone
  - Language - TypeScript
  - Stylesheet - TailwindCSS
  - Testing - Jest
    - [https://sergiodxa.com/articles/test-remix-loaders-and-actions](https://sergiodxa.com/articles/test-remix-loaders-and-actions)
- Steps
  - **Part 1**
    - [x]  Setup project with framework and TS
    - [x]  Install all needed packages
    - [x]  Setup tailwindcss
    - [x]  Setup DB connection and schema for uploads
    - [x]  save unique device-id in localstorage
    - [x]  Create frontend page form and components
    - [x]  Create BE upload route
    - [x]  Setup action to upload files to the BE
  - **Part 2**
    - [ ]  Validate uploaded files.
    - [ ]  Return error if any of the files are invalid.
    - [x]  Insert valid records into db.
  - Schema
    - import
      - id
      - user-device-id
      - filename
      - upload-id
      - created_on
      - updated_on
    - Import_data
      - id
      - first-name
      - last-name
      - record-id
      - created_on
      - updated_on
