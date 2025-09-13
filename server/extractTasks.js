// Script to extract tasks from Internship_Tasks.xlsx and output as JSON
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// Path to the Excel file
const excelPath = path.join(__dirname, '../client/src/Internship_Tasks.xlsx');
// Output JSON file
const outputPath = path.join(__dirname, '../client/src/internship_tasks.json');

// Read the workbook
const workbook = xlsx.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convert sheet to JSON
const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });

// Group tasks by domain
const tasksByDomain = {};
rows.forEach(row => {
  const domain = row['Domain'] || row['domain'] || row['DOMAIN'];
  const task = row['Task'] || row['task'] || row['TASK'];
  const description = row['Description'] || row['description'] || row['DESCRIPTION'];
  if (!domain || !task) return;
  if (!tasksByDomain[domain]) tasksByDomain[domain] = [];
  tasksByDomain[domain].push({ task, description });
});

// Write to JSON file
fs.writeFileSync(outputPath, JSON.stringify(tasksByDomain, null, 2), 'utf-8');

console.log('Tasks extracted to', outputPath); 