export const MOCK_STATS = [
  { title: "Pending Tasks", value: "12", icon: "ListTodo", trend: "+2 this week" },
  { title: "Upcoming Deadlines", value: "5", icon: "Clock", trend: "3 due today" },
  { title: "Attendance", value: "92%", icon: "CheckCircle", trend: "+1.2% this month" },
  { title: "Placement Progress", value: "75%", icon: "TrendingUp", trend: "On Track" },
];

export const MOCK_SCHEDULE = [
  { subject: "Advanced Algorithms", time: "09:00 - 10:30", room: "Room 302", status: "Upcoming" },
  { subject: "Data Science Lab", time: "11:00 - 13:00", room: "Lab A", status: "Ongoing" },
  { subject: "Web Development", time: "14:00 - 15:30", room: "Room 105", status: "Scheduled" },
];

export const MOCK_DEADLINES = [
  { subject: "Algorithms", assignment: "Project 2", due: "Today", priority: "High" },
  { subject: "Web Dev", assignment: "React Quiz", due: "Tomorrow", priority: "Medium" },
  { subject: "Data Science", assignment: "Report", due: "In 3 days", priority: "Low" },
];

export const MOCK_NOTIFICATIONS = [
  "New grade posted for Algorithms",
  "Attendance marked for Data Science",
  "Placement drive scheduled for Monday",
  "Reminder: Web Dev project due today",
  "Room changed for Advanced Algorithms",
];
