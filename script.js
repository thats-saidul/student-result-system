/* ---------- 1. Constants ---------- */
const PASS_MARK = 33;
const SUBJECTS = ["math", "english", "science"];
 
const GRADE_RULES = [
  { minAverage: 80, grade: "A+" },
  { minAverage: 70, grade: "A" },
  { minAverage: 60, grade: "A-" },
  { minAverage: 50, grade: "B" },
  { minAverage: 40, grade: "C" },
  { minAverage: 33, grade: "D" }
];
const FAIL_GRADE = "F";
 
/* ---------- 2. Initial data ---------- */
 
const students = [
  {
    id: 1,
    name: "Rahim Ahmed",
    roll: "101",
    department: "Science",
    marks: { math: 85, english: 78, science: 92 }//Nested Object
  },
  {
    id: 2,
    name: "Karim Hasan",
    roll: "102",
    department: "Commerce",
    marks: { math: 65, english: 72, science: 68 }
  },
  {
    id: 3,
    name: "Nusrat Jahan",
    roll: "103",
    department: "Science",
    marks: { math: 35, english: 45, science: 28 }
  },
  {
    id: 4,
    name: "Sadia Islam",
    roll: "104",
    department: "Arts",
    marks: { math: 88, english: 91, science: 84 }
  },
  {
    id: 5,
    name: "Tanvir Hossain",
    roll: "105",
    department: "Commerce",
    marks: { math: 50, english: 55, science: 60 }
  }
];
 
/* ---------- 3. Calculation functions ---------- */
 
function calculateTotal(marks) {
  return SUBJECTS.reduce((sum, subject) => sum + marks[subject], 0);//reduce()- single result banay
}
 
 
function calculateAverage(total) {
  return total / SUBJECTS.length;
}
 
 
function getGrade(average) {
  const matchedRule = GRADE_RULES.find((rule) => average >= rule.minAverage);//find()- first match return kore, na paile undefined return kore
  return matchedRule ? matchedRule.grade : FAIL_GRADE;//Ternary Operator use koreche. rule pauya na gele F dekhabe
}
 
 
function getResult(marks) {
  const passedAllSubjects = SUBJECTS.every((subject) => marks[subject] >= PASS_MARK);//every()- sob subject pass mark er shoman ba beshi (>= 33) kina check kore. 
  return passedAllSubjects ? "Pass" : "Fail";
}
 
 
function withResult(student) {//ekta student er shob calculation ekbar-e kore, notun object return kore
  const total = calculateTotal(student.marks);
  const average = calculateAverage(total);
 
  return {
    ...student,//Spread Operator (...student) student er ager data copy kore new object banay.
    total,
    average,
    grade: getGrade(average),
    result: getResult(student.marks)
  };
}
 
/* ---------- 4. DOM references ---------- */
// Page-er element-gulo ekbar-i dhore rakhi, bar bar getElementById korte hoy na.
const tableBody = document.getElementById("student-table-body");
const emptyState = document.getElementById("empty-state");
 
// Dashboard-er 4 ta stat card (Step 5-er renderStats() ei gulo use kore)
const statTotal = document.getElementById("stat-total");
const statPassed = document.getElementById("stat-passed");
const statFailed = document.getElementById("stat-failed");
const statAverage = document.getElementById("stat-average");
 
// Add student form (Step 6)
const studentForm = document.getElementById("student-form");
 
// Search box (Step 7)
const searchInput = document.getElementById("search-input");
 
// Filter, sort ar reset (Step 8)
const filterDepartment = document.getElementById("filter-department");
const filterResult = document.getElementById("filter-result");
const filterGrade = document.getElementById("filter-grade");
const sortSelect = document.getElementById("sort-select");
const resetButton = document.getElementById("reset-btn");
 
// Edit mode-er jonno form-er onno element (Step 9)
const studentIdInput = document.getElementById("student-id");//hidden input, edit korar somoy student-er id ekhane thake
const formTitle = document.getElementById("form-title");
const submitButton = document.getElementById("submit-btn");
const cancelEditButton = document.getElementById("cancel-edit-btn");
 
// Pagination-er element (Step 11)
const paginationNav = document.getElementById("pagination");
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");
const pageNumbers = document.getElementById("page-numbers");
 
// Export CSV button (Step 12)
const exportButton = document.getElementById("export-btn");
 
// Loading / error state ar page-er baki ongsho (Step 13)
const loadingState = document.getElementById("loading-state");
const errorState = document.getElementById("error-state");
const errorStateMessage = document.getElementById("error-state-message");
const retryButton = document.getElementById("retry-btn");
const statsSection = document.querySelector(".stats");
const formSection = document.querySelector(".form-section");
const controlsSection = document.querySelector(".controls");
const tableSection = document.getElementById("table-section");
 
// Form-er prottek field-er input ar tar error message element ek jaygay.
// Key-gulo (math, english, science) SUBJECTS ar marks object-er key-er sathe mile.
const formFields = {
  name: {
    input: document.getElementById("student-name"),
    error: document.getElementById("error-name")
  },
  roll: {
    input: document.getElementById("student-roll"),
    error: document.getElementById("error-roll")
  },
  department: {
    input: document.getElementById("student-department"),
    error: document.getElementById("error-department")
  },
  math: {
    input: document.getElementById("mark-math"),
    error: document.getElementById("error-math")
  },
  english: {
    input: document.getElementById("mark-english"),
    error: document.getElementById("error-english")
  },
  science: {
    input: document.getElementById("mark-science"),
    error: document.getElementById("error-science")
  }
};
 
/* ---------- 5. Rendering functions ---------- */
// SECURITY: User-er data (name, roll...) shobsomoy textContent diye boshai.
// innerHTML use kori na, tai keu <script> likhleo seta shudhu text hishebe dekhabe.
 
// Grade theke CSS class name ber kore (style.css-er .grade-a-plus ... er sathe match)
const GRADE_CLASS_NAMES = {
  "A+": "grade-a-plus",
  "A": "grade-a",
  "A-": "grade-a-minus",
  "B": "grade-b",
  "C": "grade-c",
  "D": "grade-d",
  "F": "grade-f"
};
 
 
function createTextCell(text, className = "") {
  const cell = document.createElement("td");
  cell.textContent = text;
  if (className) {
    cell.className = className;
  }
  return cell;
}
 
 
function createGradeCell(grade) {//grade-er cell toiri kore, grade onujayi CSS class boshay (color CSS diye hoy) 
  return createTextCell(grade, `grade ${GRADE_CLASS_NAMES[grade]}`);
}
 
 
function createResultCell(result) {
  const cell = document.createElement("td");
  const badge = document.createElement("span");
  badge.textContent = result;
  badge.className = result === "Pass" ? "badge badge-pass" : "badge badge-fail";
  cell.appendChild(badge);
  return cell;
}
 
 
function createActionButton(label, action, studentId, extraClass) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.className = `btn btn-small ${extraClass}`;
  button.dataset.action = action;
  button.dataset.id = studentId;
  return button;
}
 
function createActionsCell(studentId) {
  const cell = document.createElement("td");
  const wrapper = document.createElement("div");
  wrapper.className = "cell-actions";
  wrapper.appendChild(createActionButton("Edit", "edit", studentId, "btn-edit"));
  wrapper.appendChild(createActionButton("Delete", "delete", studentId, "btn-delete"));
  cell.appendChild(wrapper);//edit and delete button baniye wrapper div er moddhe rakha hoyeche, tarpor cell er moddhe rakha hoyeche
  return cell;
}
 
 
function createStudentRow(student) {
  const row = document.createElement("tr");
 
  row.appendChild(createTextCell(student.name));
  row.appendChild(createTextCell(student.roll));
  row.appendChild(createTextCell(student.department));
  row.appendChild(createTextCell(student.marks.math, "num"));
  row.appendChild(createTextCell(student.marks.english, "num"));
  row.appendChild(createTextCell(student.marks.science, "num"));
  row.appendChild(createTextCell(student.total, "num"));
  row.appendChild(createTextCell(student.average.toFixed(2), "num"));
  row.appendChild(createGradeCell(student.grade));
  row.appendChild(createResultCell(student.result));
  row.appendChild(createActionsCell(student.id));
 
  return row;
}
 
// Student list nie table-ta notun kore banay. List faka hole "No students" message dekhay.
function renderTable(studentList) {
  tableBody.replaceChildren(); // purono shob row muche felbe and new add korbe 
 
  emptyState.classList.toggle("hidden", studentList.length > 0);// studentList empty hole hidden class remove hobe, na hole add hobe
 
  const fragment = document.createDocumentFragment();//এটি DOM-এ বারবার পরিবর্তন না করে একসঙ্গে অনেকগুলো Element যুক্ত করতে সাহায্য করে। এতে DOM update-এর কাজ কমে এবং Rendering আরও Efficient হতে পারে।
  studentList.forEach((student) => {//Array-এর প্রতিটি Element-এর ওপর কাজ করে
    fragment.appendChild(createStudentRow(student));
  });
  tableBody.appendChild(fragment);
}
 
/* ---------- 6. Dashboard statistics ---------- */
// DECISION: Statistics shobsomoy "ekhon je student-gulo table-e dekha jachche" tader upor hobe
// (search + filter-er por-er list). Tai Class Average = current view-er average.
// Kono filter na dile shob student-er stats dekhabe.
 
// Pure function: student list nie stats hishab kore object return kore
function calculateStats(studentList) {
  const total = studentList.length;
  const passed = studentList.filter((student) => student.result === "Pass").length;
  const failed = total - passed;
 
  // List faka hole 0 / 0 (NaN) na hoy, tai age check kori
  const classAverage =
    total === 0
      ? 0
      : studentList.reduce((sum, student) => sum + student.average, 0) / total;
 
  return { total, passed, failed, classAverage };
}
 
// Stats card-gulo-te value boshay
function renderStats(studentList) {
  const stats = calculateStats(studentList);
 
  statTotal.textContent = stats.total;
  statPassed.textContent = stats.passed;
  statFailed.textContent = stats.failed;
  statAverage.textContent = stats.classAverage.toFixed(2);
}
 
/* ---------- 7. Pagination ---------- */
// Ekta page-e 5 jon student. Search/filter/sort-er por-er puro list theke 5 jon kore kete dekhai.
// Stats card puro filtered list-er upor thake, shudhu ei page-er 5 jon-er na (Step 5-er decision).
const STUDENTS_PER_PAGE = 5;
const ELLIPSIS = "...";
 
// Mot koyta page lagbe. List faka hole-o kom-pokkhe 1, tai "page 1 of 0" hoy na.
function getTotalPages(totalItems) {
  return Math.max(1, Math.ceil(totalItems / STUDENTS_PER_PAGE));//Math.ceil()- doshomik hole upore round kore, 12 jon / 5 = 2.4 -> 3 page
}
 
// Pure function: list theke shudhu oi page-er student-gulo ber kore
function paginateStudents(studentList, page) {
  const startIndex = (page - 1) * STUDENTS_PER_PAGE;
  return studentList.slice(startIndex, startIndex + STUDENTS_PER_PAGE);//slice()- array-er ekta ongsho copy kore, original bodlay na
}
 
// Pure function: kon kon page number dekhabe ber kore. Jemon 7 page, current 1 hole: 1 2 ... 7
// Shobsomoy prothom page, shesh page ar current page-er pashe-r duto dekhay, majhe "..." boshay.
function getPageItems(currentPage, totalPages) {
  const items = [];
 
  for (let page = 1; page <= totalPages; page++) {
    const isEdgePage = page === 1 || page === totalPages;
    const isNearCurrent = Math.abs(page - currentPage) <= 1;//Math.abs()- minus thakle plus kore dey
 
    if (isEdgePage || isNearCurrent) {
      items.push(page);
    } else if (items[items.length - 1] !== ELLIPSIS) {
      items.push(ELLIPSIS);//ek jaygay ekbar-i "..." boshbe
    }
  }
 
  return items;
}
 
// Prev/Next button ar page number-gulo notun kore ankhe
function renderPagination(currentPage, totalPages) {
  paginationNav.classList.toggle("hidden", totalPages <= 1);//1 page hole pagination lukiye rakhi
 
  prevButton.disabled = currentPage === 1;//prothom page-e Prev kaj korbe na
  nextButton.disabled = currentPage === totalPages;//shesh page-e Next kaj korbe na
 
  pageNumbers.replaceChildren();
 
  getPageItems(currentPage, totalPages).forEach((item) => {
    if (item === ELLIPSIS) {
      const dots = document.createElement("span");
      dots.textContent = ELLIPSIS;
      dots.className = "page-ellipsis";
      pageNumbers.appendChild(dots);
      return;
    }
 
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = item;
    button.dataset.page = item;//event delegation-e kon page click hoyeche bujhte
    button.className = item === currentPage ? "page-btn active" : "page-btn";
    if (item === currentPage) {
      button.setAttribute("aria-current", "page");//screen reader-er jonno
    }
    pageNumbers.appendChild(button);
  });
}
 
/* ---------- 8. Render the whole view ---------- */
// Table ar stats ek shathe update kore, jate dutor list shobsomoy ek thake.
// Pore add/edit/delete/search/filter shob jaygay ei function-i call hobe.
function renderView(studentList) {
  const totalPages = getTotalPages(studentList.length);
 
  // Delete/filter-er por current page jodi shesh page-er pore chole jay (ba 1-er niche), thik range-e ane
  viewState.currentPage = Math.min(Math.max(viewState.currentPage, 1), totalPages);
 
  renderTable(paginateStudents(studentList, viewState.currentPage));//table-e shudhu ei page-er 5 jon
  renderStats(studentList);//stats-e puro filtered list
  renderPagination(viewState.currentPage, totalPages);
}
 
// User ekhon ki search/filter/sort korse seta ek jaygay rakhi (alada alada global variable na).
// "All" mane oi filter off, kichu bad dibe na.
const DEFAULT_VIEW_STATE = {
  searchQuery: "",
  department: "All",
  result: "All",
  grade: "All",
  sortBy: "name-asc",
  currentPage: 1
};
 
const viewState = { ...DEFAULT_VIEW_STATE };//spread diye copy, tai DEFAULT_VIEW_STATE bodlay na
 
// students theke shob student-er result calculate kore, tarpor search, filter ar sort lagay.
// Ei list-i table ar stats dutoi-te jay, tai dutor data shobsomoy ek thake.
// Search, filter, sort shob ek shathe kaj kore, karon ekta-r output arekta-r input.
function getVisibleStudents() {
  const studentsWithResults = students.map(withResult);//map()- prottek student e withResult() chalay, notun array banay
  const searchedStudents = searchStudents(studentsWithResults, viewState.searchQuery);
  const filteredStudents = filterStudents(searchedStudents, viewState);
  return sortStudents(filteredStudents, viewState.sortBy);
}
 
// viewState onujayi list ber kore table + stats update kore.
function refreshView() {
  renderView(getVisibleStudents());
}
 
/* ---------- 9. Validation ---------- */
const DEPARTMENTS = ["Science", "Commerce", "Arts"];
const MIN_MARK = 0;
const MAX_MARK = 100;
 
// Ekta mark check kore. Error thakle message string, na thakle faka string ("") return kore.
function validateMark(value) {
  if (value === "") {
    return "Marks are required.";//faka thakle Number("") = 0 hoye jay, tai age string-e check
  }
 
  const mark = Number(value);//Number()- string ke number e convert kore
 
  if (Number.isNaN(mark)) {//Number.isNaN()- value NaN (not a number) kina check kore
    return "Marks must be a number.";
  }
  if (!Number.isInteger(mark)) {//Number.isInteger()- purno shongkha (85) hole true, doshomik (85.5) hole false
    return "Marks must be a whole number.";
  }
  if (mark < MIN_MARK || mark > MAX_MARK) {
    return `Marks must be between ${MIN_MARK} and ${MAX_MARK}.`;
  }
  return "";
}
 
// Roll onno kono student-er sathe mile ki na. editingId dile oi student-ke bad dey
// (Step 9-e edit korar somoy nijer roll-er sathe nijer conflict jate na hoy).
function isRollTaken(roll, existingStudents, editingId = null) {
  return existingStudents.some(//some()- ekta o match korle true return kore
    (student) =>
      student.id !== editingId && student.roll.toLowerCase() === roll.toLowerCase()
  );
}
 
// Pura form validate kore. Return kore errors object, jemon { roll: "...", math: "..." }.
// Kono error na thakle object faka ({}) thake.
function validateStudentForm(formData, existingStudents, editingId = null) {
  const errors = {};
 
  if (!formData.name) {
    errors.name = "Student name is required.";
  }
 
  if (!formData.roll) {
    errors.roll = "Roll number is required.";
  } else if (isRollTaken(formData.roll, existingStudents, editingId)) {
    errors.roll = "This roll number already exists.";
  }
 
  if (!formData.department) {
    errors.department = "Please select a department.";
  } else if (!DEPARTMENTS.includes(formData.department)) {//includes()- array te value ache kina check kore
    errors.department = "Invalid department.";
  }
 
  SUBJECTS.forEach((subject) => {
    const message = validateMark(formData.marks[subject]);
    if (message) {
      errors[subject] = message;
    }
  });
 
  return errors;
}
 
/* ---------- 10. Form helpers ---------- */
// Form theke raw value pore. Text trim kore (age-pichher faka space bad).
// Marks ekhono string, validation-er por number-e convert hobe.
function getFormData() {
  const marks = {};
  SUBJECTS.forEach((subject) => {
    marks[subject] = formFields[subject].input.value;
  });
 
  return {
    name: formFields.name.input.value.trim(),//trim()- age-pichher faka space bad dey
    roll: formFields.roll.input.value.trim(),
    department: formFields.department.input.value,
    marks
  };
}
 
function clearFieldError(fieldKey) {
  formFields[fieldKey].error.textContent = "";
  formFields[fieldKey].input.classList.remove("input-invalid");
}
 
function clearAllErrors() {
  Object.keys(formFields).forEach(clearFieldError);//Object.keys()- object er shob key array hishebe dey
}
 
// Error gulo field-er niche dekhay, ar prothom error-wala field-e focus dey
function showErrors(errors) {
  clearAllErrors();
 
  Object.entries(errors).forEach(([fieldKey, message]) => {//Object.entries()- object ke [key, value] er array te convert kore
    formFields[fieldKey].error.textContent = message;
    formFields[fieldKey].input.classList.add("input-invalid");
  });
 
  const firstInvalidKey = Object.keys(errors)[0];
  formFields[firstInvalidKey].input.focus();//focus()- oi field e cursor niye jay
}
 
// Unique ID: ekhon porjonto shobcheye boro id + 1.
// (students.length + 1 use kori na, karon delete korle id duplicate hote pare)
function generateStudentId() {
  const highestId = students.reduce(
    (highest, student) => Math.max(highest, student.id),
    0
  );

  let nextId = highestId + 1;

  try {
    const savedNextId = Number(
      localStorage.getItem(NEXT_STUDENT_ID_KEY)
    );

    if (
      Number.isSafeInteger(savedNextId) &&
      savedNextId > highestId
    ) {
      nextId = savedNextId;
    }

    localStorage.setItem(
      NEXT_STUDENT_ID_KEY,
      String(nextId + 1)
    );
  } catch (error) {
    console.error("Could not save next student ID:", error);
  }

  return nextId;
}
 
// Validated form data theke student-er field-gulo banay (id chhara). Ekhane marks string theke number hoy.
// Add ar edit dutoi ekhan theke nei, tai ekta code duibar likhte hoy na.
function getStudentFields(formData) {
  const marks = {};
  SUBJECTS.forEach((subject) => {
    marks[subject] = Number(formData.marks[subject]);
  });
 
  return {
    name: formData.name,
    roll: formData.roll,
    department: formData.department,
    marks
  };
}
 
// Notun student: notun id + form-er field
function createStudent(formData) {
  return {
    id: generateStudentId(),
    ...getStudentFields(formData)
  };
}
 
/* ---------- 11. Search ---------- */
// Pure function: list ar search text nie match kora student-der notun list dey.
// Name ba roll er moddhe search text thakle match. Case-insensitive (boro/choto hater farak nai).
function searchStudents(studentList, query) {
  const searchText = query.trim().toLowerCase();//toLowerCase()- shob lowercase kore, tai "RAHIM" ar "rahim" ek
 
  if (searchText === "") {
    return studentList;//kichu na likhle shob student dekhabe
  }
 
  return studentList.filter(//filter()- shartey match kora item niye notun array banay
    (student) =>
      student.name.toLowerCase().includes(searchText) ||//includes()- string er moddhe ei text ache kina
      student.roll.toLowerCase().includes(searchText)
  );
}
 
/* ---------- 12. Filter ---------- */
// Pure function: department, result, grade er shob shorto mille tader list dey.
// Prottek filter-er value "All" hole oi filter skip hoy.
function filterStudents(studentList, filters) {
  return studentList.filter((student) => {
    const matchesDepartment =
      filters.department === "All" || student.department === filters.department;
    const matchesResult =
      filters.result === "All" || student.result === filters.result;
    const matchesGrade =
      filters.grade === "All" || student.grade === filters.grade;
 
    return matchesDepartment && matchesResult && matchesGrade;//tinta-i true hole tobei student thakbe
  });
}
 
/* ---------- 13. Sort ---------- */
// Prottek sort option-er jonno ekta compare function.
// compare function negative dile a age, positive dile b age, 0 dile jemon chilo temon.
const SORT_COMPARATORS = {
  "name-asc": (a, b) => a.name.localeCompare(b.name),//localeCompare()- string A-Z hishebe tulona kore
  "name-desc": (a, b) => b.name.localeCompare(a.name),
  "total-desc": (a, b) => b.total - a.total,
  "total-asc": (a, b) => a.total - b.total,
  "average-desc": (a, b) => b.average - a.average,
  "average-asc": (a, b) => a.average - b.average
};
 
// Pure function: sorted notun list dey, original list bodlay na.
function sortStudents(studentList, sortBy) {
  const compare = SORT_COMPARATORS[sortBy];
 
  if (!compare) {
    return studentList;//chena na option hole jemon ache temon
  }
 
  return [...studentList].sort(compare);//sort() original array bodlay, tai age spread diye copy kore nei
}
 
/* ---------- 14. Local Storage ---------- */
// Browser-er localStorage-e shudhu string rakha jay, tai array ke JSON string kore rakhi.
// Page refresh korleo data thake.
const STORAGE_KEY = "studentResultSystem.students";
const NEXT_STUDENT_ID_KEY = "studentResultSystem.nextStudentId";
 
// Ekhon-kar students array localStorage-e save kore.
// Add, edit, delete-er por ei function call hoy.
function saveStudents() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));//JSON.stringify()- array/object ke string e convert kore
  } catch (error) {
    console.error("Could not save students:", error);//storage full ba block thakle app jate na bhange
  }
}
 
// Storage theke ashha ekta item thik student-er moto kina check kore.
// Keu storage e vul data rakhle ba data nosto hole app jate crash na kore.
function isValidStudentRecord(record) {
  return (
    typeof record === "object" &&
    record !== null &&
    typeof record.id === "number" &&
    typeof record.name === "string" &&
    typeof record.roll === "string" &&
    DEPARTMENTS.includes(record.department) &&
    typeof record.marks === "object" &&
    record.marks !== null &&
    SUBJECTS.every((subject) => typeof record.marks[subject] === "number")
  );
}
 
// Saved students ferot dey. Kichu na thakle ba data nosto hole null dey.
// Faka array ([]) valid, karon teacher shobai-ke delete korte pare.
function loadStudents() {
  try {
    const savedText = localStorage.getItem(STORAGE_KEY);
 
    if (savedText === null) {
      return null;//ekhono kichu save kora hoyni
    }
 
    const savedStudents = JSON.parse(savedText);//JSON.parse()- string ke abar array/object e convert kore
 
    if (!Array.isArray(savedStudents) || !savedStudents.every(isValidStudentRecord)) {
      return null;
    }
 
    return savedStudents;
  } catch (error) {
    console.error("Could not load students:", error);//JSON nosto hole parse error dey
    return null;
  }
}
 
/* ---------- 15. Export CSV ---------- */
// Ekhon table-e je filter/search/sort lagano ache, oi puro list CSV hobe (shob page, shudhu ei page-er na).
const CSV_HEADERS = [
  "Name", "Roll", "Department", "Math", "English", "Science",
  "Total", "Average", "Grade", "Result"
];
 
// CSV banano PapaParse library (index.html-e CDN diye ashe) kore. Comma/quote escape o oi kore dey.
// Pure function: student list theke puro CSV text banay (DOM chhoy na)
function buildCsv(studentList) {
  const rows = studentList.map((student) => [
    student.name,
    student.roll,
    student.department,
    student.marks.math,
    student.marks.english,
    student.marks.science,
    student.total,
    student.average.toFixed(2),//table-er moto 2 decimal
    student.grade,
    student.result
  ]);
 
  return Papa.unparse(//Papa.unparse()- array ke CSV text e convert kore
    { fields: CSV_HEADERS, data: rows },
    {
      // Security: =, +, -, @ diye shuru hole Excel oi text-ke formula bhabe (CSV injection).
      // escapeFormulae true dile shurute ' boshiye dey.
      escapeFormulae: true,
      newline: "\r\n"
    }
  );
}
 
// Text ke file hishebe browser diye download koray
function downloadCsvFile(csvText, fileName) {
    // "\uFEFF" (BOM) dile Excel-e Bangla/Unicode name thik dekhay
  const blob = new Blob(["\uFEFF" + csvText], { type: "text/csv;charset=utf-8;" });//Blob- memory-te file-er moto data
  const url = URL.createObjectURL(blob);//createObjectURL()- Blob-er jonno ekta temporary link banay
 
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;//download attribute dile click-e file save hoy, page khule na
  document.body.appendChild(link);
  link.click();
  link.remove();
 
  URL.revokeObjectURL(url);//temporary link muche memory khali kore
}
 
/* ---------- 16. Debounce ---------- */
// Reusable function: kono function-ke nie ekta notun function dey.
// Notun function ta bar bar call hole-o, shesh call-er por `delay` ms (300) kichu na hole tobei asol function chole.
// Jemon user "rahim" type korle 5 bar na chole shudhu ekbar search hobe.
function debounce(callback, delay = 300) {
  let timerId;//closure- ei variable ta returned function mone rakhe
 
  return function (...args) {//...args (rest)- jei argument ashbe shob ekta array te jore
    clearTimeout(timerId);//clearTimeout()- ager timer cancel kore
    timerId = setTimeout(() => callback.apply(this, args), delay);//setTimeout()- delay er por function chalay
  };
}
 
function handleSearchInput() {
  viewState.searchQuery = searchInput.value;
  viewState.currentPage = 1;//notun search-e shobsomoy prothom page theke
  refreshView();
}
 
// 300ms thamle tobei search chalabe
const debouncedSearch = debounce(handleSearchInput, 300);
 
/* ---------- 17. Edit and Delete ---------- */
// Edit mode kina seta hidden input dekhe bujhi: faka hole notun add, id thakle oi student edit hocche.
function getEditingId() {
  return studentIdInput.value === "" ? null : Number(studentIdInput.value);
}
 
// Student-er data form-e boshay, ar form-ke "Edit mode" e niye jay
function startEdit(studentId) {
  const student = students.find((item) => item.id === studentId);//find()- id mille oi student ke dey
 
  if (!student) {
    return;
  }
 
  studentIdInput.value = student.id;
  formFields.name.input.value = student.name;//input.value te boshale text hishebe boshe, HTML hishebe na, tai safe
  formFields.roll.input.value = student.roll;
  formFields.department.input.value = student.department;
  SUBJECTS.forEach((subject) => {
    formFields[subject].input.value = student.marks[subject];
  });
 
  formTitle.textContent = "Edit Student";
  submitButton.textContent = "Update Student";
  cancelEditButton.classList.remove("hidden");
 
  clearAllErrors();
  studentForm.scrollIntoView({ behavior: "smooth" });//scrollIntoView()- page scroll kore form dekhay
  formFields.name.input.focus();
}
 
// Form-ke abar "Add mode" e ferot ane
function exitEditMode() {
  studentForm.reset();//reset()- form er shob input faka kore dey
  studentIdInput.value = "";//hidden input o faka, tai ebar notun add hobe
  formTitle.textContent = "Add Student";
  submitButton.textContent = "Add Student";
  cancelEditButton.classList.add("hidden");
  clearAllErrors();
}
 
// Purono student-er jaygay notun data boshay. Notun student toiri kore na, tai duplicate hoy na.
function updateStudent(studentId, formData) {
  const index = students.findIndex((student) => student.id === studentId);//findIndex()- array te oi item-er position dey, na pele -1
 
  if (index === -1) {
    return;
  }
 
  students[index] = { id: studentId, ...getStudentFields(formData) };
}
 
// Confirm kore student muche dey
function deleteStudent(studentId) {
  const index = students.findIndex((student) => student.id === studentId);
 
  if (index === -1) {
    return;
  }
 
  const isConfirmed = confirm(`Delete ${students[index].name}?`);//confirm()- OK/Cancel box dekhay, OK dile true
 
  if (!isConfirmed) {
    return;
  }
 
  students.splice(index, 1);//splice(index, 1)- oi position theke 1 ta item array theke bad dey
  saveStudents();
 
  // Je student edit hochilo take-i delete korle form-o reset hobe
  if (getEditingId() === studentId) {
    exitEditMode();
  }
 
  refreshView();
}
 
/* ---------- 18. Event handlers ---------- */
// Event delegation: table-e ekta-i listener. Row/button joto-i thak, shob click ekhane ashe.
// Notun row render holeo notun kore listener lagate hoy na.
function handleTableClick(event) {
  const button = event.target.closest("button[data-action]");//closest()- click kora element ba tar upor-er parent theke match khuje
 
  if (!button) {
    return;//button chhara onno jaygay click hole kichu na
  }
 
  const studentId = Number(button.dataset.id);//dataset.id string ashe, tai Number() diye number kori
  const action = button.dataset.action;
 
  if (action === "edit") {
    startEdit(studentId);
  } else if (action === "delete") {
    deleteStudent(studentId);
  }
}
 
function handleFormSubmit(event) {
  event.preventDefault(); //preventDefault()- form submit-e page reload hote dey na
 
  const formData = getFormData();
  const editingId = getEditingId();//null hole notun add, number hole edit
  const errors = validateStudentForm(formData, students, editingId);//editingId dile nijer roll nijer shathe conflict dhorbe na
 
  if (Object.keys(errors).length > 0) {
    showErrors(errors);
    return; // invalid hole ekhanei thame, student add hoy na
  }
 
  if (editingId === null) {
    students.push(createStudent(formData));//push()- array r shesh e notun item jog kore
  } else {
    updateStudent(editingId, formData);
  }
  saveStudents();//add ba update hoye gele browser e save kore rakhi
  refreshView();
 
  exitEditMode();//form reset kore Add mode e ferot ane
  formFields.name.input.focus();
}
 
// 3 ta filter ar sort, jekono ekta bodlale ei function chole.
// Search box-er value alada, karon oita debounce diye chole.
function handleControlsChange() {
  viewState.department = filterDepartment.value;
  viewState.result = filterResult.value;
  viewState.grade = filterGrade.value;
  viewState.sortBy = sortSelect.value;
  viewState.currentPage = 1;//filter/sort bodlale prothom page theke
  refreshView();
}
 
// Search, filter, sort shob default-e ferot ane
function handleReset() {
  Object.assign(viewState, DEFAULT_VIEW_STATE);//Object.assign()- ek object er value arek object e copy kore
 
  searchInput.value = "";
  filterDepartment.value = DEFAULT_VIEW_STATE.department;
  filterResult.value = DEFAULT_VIEW_STATE.result;
  filterGrade.value = DEFAULT_VIEW_STATE.grade;
  sortSelect.value = DEFAULT_VIEW_STATE.sortBy;
 
  refreshView();
}
 
function handleExportClick() {
  // CDN load na hole (internet nai ba block) Papa define thakbe na, tai age check kori
  if (typeof Papa === "undefined") {
    alert("CSV library could not be loaded. Please check your internet connection and refresh the page.");
    return;
  }
 
  const visibleStudents = getVisibleStudents();//table-e jei list, hubohu oi list-i export hobe
 
  if (visibleStudents.length === 0) {
    alert("No students to export.");
    return;
  }
 
  const today = new Date().toISOString().slice(0, 10);//toISOString()- "2026-11-09T..." theke prothom 10 okkhor, mane tarikh
  downloadCsvFile(buildCsv(visibleStudents), `student-results-${today}.csv`);
}
 
// Notun page-e jay. Range-er baire hole renderView() nijei thik kore dey.
function goToPage(page) {
  viewState.currentPage = page;
  refreshView();
}
 
// Event delegation: page number-er jonno ekta-i listener, prottek button-e alada na
function handlePageNumbersClick(event) {
  const button = event.target.closest("button[data-page]");
 
  if (!button) {
    return;
  }
 
  goToPage(Number(button.dataset.page));
}
 
function setupEventListeners() {
  studentForm.addEventListener("submit", handleFormSubmit);
  searchInput.addEventListener("input", debouncedSearch);//type korar por 300ms thamle search hobe
 
  // <select> er value bodlale "change" event ase
  [filterDepartment, filterResult, filterGrade, sortSelect].forEach((control) => {
    control.addEventListener("change", handleControlsChange);
  });
  resetButton.addEventListener("click", handleReset);
 
  tableBody.addEventListener("click", handleTableClick);//Edit/Delete shob button-er jonno ei ekta-i listener
  cancelEditButton.addEventListener("click", exitEditMode);
 
  prevButton.addEventListener("click", () => goToPage(viewState.currentPage - 1));
  nextButton.addEventListener("click", () => goToPage(viewState.currentPage + 1));
  pageNumbers.addEventListener("click", handlePageNumbersClick);
 
  exportButton.addEventListener("click", handleExportClick);
 
  // User type korar shathe shathe oi field-er error muche dey
  Object.keys(formFields).forEach((fieldKey) => {
    const { input } = formFields[fieldKey];
    input.addEventListener("input", () => clearFieldError(fieldKey));
    input.addEventListener("change", () => clearFieldError(fieldKey)); // <select>-er jonno
  });
}
 
/* ---------- 19. Async loading ---------- */
// Asol server nai, tai Promise + setTimeout diye server theke data ana-r moto kore dekhai.
// Load howar somoy loading spinner, fail hole error + Retry button dekhabe.
const LOAD_DELAY_MS = 1000;
 
// Error state dekhanor jonno: URL-er sheshe ?simulateError=true dile load ei bar fail korbe
// (jemon index.html?simulateError=true). Review-te error state dekhate kaje lagbe.
function shouldSimulateError() {
  return new URLSearchParams(window.location.search).get("simulateError") === "true";//URLSearchParams- URL-er ? er por-er value pore
}
 
// Promise return kore: LOAD_DELAY_MS por resolve (shofol) ba reject (byartho) hoy.
function fetchStudents() {
  return new Promise((resolve, reject) => {//Promise- ekhon na, pore ashbe emon result-er proti-shruti
    setTimeout(() => {//setTimeout()- delay er por function chalay
      if (shouldSimulateError()) {
        reject(new Error("Failed to load student data. Please try again."));
        return;
      }
 
      const savedStudents = loadStudents();//Step 10-er function, ekhon Promise-er bhitore chole
      resolve(savedStudents !== null ? savedStudents : [...students]);//save kora na thakle upor-er initial 5 jon-er copy
    }, LOAD_DELAY_MS);
  });
}
 
// Load howar somoy ba error-er somoy baki page lukiye rakhi, jate user data ashar age kichu add/edit na kore felte pare.
function setContentVisible(isVisible) {
  [statsSection, formSection, controlsSection, tableSection].forEach((section) => {
    section.classList.toggle("hidden", !isVisible);
  });
}
 
function showLoadingState() {
  loadingState.classList.remove("hidden");
  errorState.classList.add("hidden");
  setContentVisible(false);
}
 
function showErrorState(message) {
  loadingState.classList.add("hidden");
  errorStateMessage.textContent = message;//textContent, tai message text hishebe-i boshe
  errorState.classList.remove("hidden");
  setContentVisible(false);
}
 
function showContent() {
  loadingState.classList.add("hidden");
  errorState.classList.add("hidden");
  setContentVisible(true);
}
 
// Data load kore. Prothom bar ar Retry button, duto-i ei function chalay.
async function loadInitialData() {
  showLoadingState();
 
  try {
    const loadedStudents = await fetchStudents();//await- Promise shesh na hoa porjonto opekkha kore, tarpor result dey
    students.splice(0, students.length, ...loadedStudents);//students ke faka kore notun data diye bhore (const array tai notun array assign na)
    showContent();
    refreshView();
  } catch (error) {//Promise reject hole (fail) ekhane ashe
    showErrorState(error.message);
  }
}
 
/* ---------- 20. App start ---------- */
function initializeApp() {
  setupEventListeners();
  retryButton.addEventListener("click", loadInitialData);//Retry click korle abar load
  loadInitialData();//ager moto sathe sathe na, ekhon loading-er por data ashe
}
 
initializeApp();
 