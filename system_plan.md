# System Plan: Educational Consulting & Course Matching Platform (Anisha)

This document provides a modular, end-to-end plan for designing and developing a course and university matching program tailored for educational consulting workflows.

---

## 1. Overview of the System Workflow

The application is structured into two main logical engines:
1. **Course Administration Module (Data Entry):** Allows the staff member (the user) to build, update, and manage a directory of courses, requirements, and institutions.
2. **Student Counseling & Matching Module (Search & Recommendation):** Allows the user to input a prospective student's academic profile and preferences, instantly filtering and ranking courses that match their qualifications and desires.

---

## 2. Core Data Models

To ensure the system can be deployed anywhere, we define abstract schemas. 

*Note: For all array-like structures in our definitions, we use explicit lists or space-padded arrays `[ ]` to ensure compatibility across representation layers.*

### A. Course Schema
Each entry in the database represents a specific course at a specific university.

```json
{
  "id": "string (unique identifier)",
  "university_name": "string",
  "country": "string",
  "course_name": "string",
  "course_level": "string (e.g., Bachelor, Master, PhD, PG Diploma, Foundation, Diploma)",
  "minimum_education_level": "string (e.g., +2, Bachelor, Master)",
  "minimum_gpa": "number (e.g., 2.5, 3.0)",
  "proficiency_tests": [
    {
      "test_name": "string (e.g., IELTS, PTE, TOEFL, DUOLINGO, MOI)",
      "minimum_score": "number or string (e.g., 6.5, 80, 'Required')"
    }
  ],
  "duration_months": "number (or string representing duration, e.g., '4 Years')",
  "course_fee": {
    "amount": "number",
    "currency": "string"
  },
  "intake_periods": [
    "string (e.g., 'Fall 2025', 'Spring 2026', 'September')"
  ]
}
```

### B. Student Profile (Search Input)
Representing the details of the student currently being counseled.

```json
{
  "student_name": "string (optional)",
  "completed_education_level": "string (e.g., +2, Bachelor's)",
  "gpa": "number",
  "proficiency_tests": [
    {
      "test_name": "string (e.g., IELTS)",
      "score": "number"
    }
  ],
  "interested_countries": [
    "string (ordered list, e.g., ['Denmark', 'Australia'])"
  ],
  "desired_apply_level": "string (e.g., Bachelor's Degree, Master's Degree)"
}
```

---

## 3. Matching & Ranking Algorithm

To find the optimal options for the student, the search engine processes all available courses through two distinct phases: **Elimination** and **Prioritization**.

### Phase 1: Hard Elimination (Filters)
If a course fails any of these criteria, it is excluded immediately.

1. **Desired Apply Level Match:**
   - If the student specifies they want to apply for a "Bachelor's Degree", all Master's, PhD, and PG Diploma courses are eliminated.
2. **GPA Cutoff:**
   - If `student.gpa` < `course.minimum_gpa`, the course is eliminated.
3. **Education Level Cutoff:**
   - The student's completed education must meet or exceed the minimum level required for the course. For example, if a course requires a "Bachelor's" minimum education level, a student who has completed only "+2" is eliminated. (We will implement a mapping table to determine levels: e.g., High School/Plus 2 < Diploma < Bachelor < Master < PhD).

### Phase 2: Soft Scoring & Prioritization (Ranking)
Courses that pass the elimination phase are scored and ranked. The baseline score starts at `0`.

1. **Country Preference Weights:**
   - The student provides an ordered list of preferred countries.
   - **First Choice Country:** +100 points.
   - **Second Choice Country:** +50 points.
   - **Third Choice Country:** +25 points.
   - Other matching countries: +0 points.
2. **Proficiency Test Score Match:**
   - If the course does not require any proficiency test (or accepts MOI - Medium of Instruction), it remains in the list.
   - If the course requires a proficiency test (e.g., IELTS minimum 6.0) and the student has taken that test:
     - If student's score >= course's minimum required score: +30 points.
     - Bonus for higher scores: +5 points for every 0.5 points (IELTS equivalent) above the minimum.
     - If the student has not taken the required test or scored below the minimum, we can either flag it with a "Warning: Test Score Not Met" label (reducing its rank by -50 points) or eliminate it, depending on the user's operational choice.
3. **Fee and Duration Alignment (Optional enhancements):**
   - We can sort within the same tier by lower tuition fees or preferred intake dates to help the user find the most budget-friendly or immediate intake.

---

## 4. Proposed Application Architecture

To keep the system modular and easy to deploy on any device, we will structure the program with clear separation of concerns:

```
anisha/
├── db/                    # Data Storage Layer
│   ├── connection.js      # Database configuration and connection setup
│   └── queries.js         # Abstract database operations (insert, search, list)
├── engine/                # Core Business Logic
│   ├── matching_engine.js # Logic for hard elimination and soft scoring
│   └── level_mapping.js   # Definition of education hierarchies for comparisons
├── ui/                    # User Interface Layer (CLI, Web page, or GUI)
│   ├── admin_portal.js    # Data Entry screen/menus
│   └── search_portal.js   # Student Counseling & Search screen/menus
└── index.js               # Application Entry Point
```

---

## 5. Database Options & Portability

Since you mentioned you will provide information about a database to make it accessible from any device, the system will be built with a **Database Abstraction Layer**. This means the search and input logic won't care about which specific database is used.

Here are the ideal database options we can integrate based on what you share:

1. **Option A: PostgreSQL / MySQL (Relational DB):**
   - *Best for:* Consistent relational data, structured queries, and strong hosting options (e.g., Supabase, Neon, AWS RDS).
2. **Option B: MongoDB / Firestore (NoSQL Document DB):**
   - *Best for:* Flexible schemas. Since courses can have varying numbers of proficiency tests, multiple intake dates, or varying detail levels, a document-based store fits the dynamic course model easily.
3. **Option C: SQLite / Local JSON (For initial offline testing):**
   - *Best for:* Running completely locally on a single machine before scaling to a cloud environment.

---

## 6. Development Roadmap

Once you provide the database credentials/configuration:
1. **Setup Database Connection:** Implement the data persistence layer using the provided database.
2. **Implement Admin Module:** Build the interactive interface to input courses and save them directly to the database.
3. **Implement Matching Engine:** Code the validation hierarchy (GPA, Education Level, Apply Level) and the weighted scoring rules (Country preferences, test scores).
4. **Implement Counseling Module:** Create the interface for entering student stats and viewing the ranked matching results.
5. **Testing & Refinement:** Test with real-world scenarios to adjust scoring weights based on your sister's daily counseling experience.
