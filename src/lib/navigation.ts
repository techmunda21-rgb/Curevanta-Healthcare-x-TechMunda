export type NavItem = {
  title: string;
  href?: string;
  icon?: string;
  children?: NavItem[];
  permission?: string;
};

export const NAVIGATION: NavItem[] = [
  { title: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  {
    title: "Projects",
    icon: "FolderKanban",
    children: [
      { title: "All Projects", href: "/projects" },
      { title: "Curevanta", href: "/projects/curevanta" },
      { title: "Milestones", href: "/projects/milestones" },
      { title: "Roadmap", href: "/projects/roadmap" },
    ],
  },
  {
    title: "Execution",
    icon: "ListTodo",
    children: [
      { title: "Daily Tasks", href: "/tasks" },
      { title: "My Tasks", href: "/tasks/mine" },
      { title: "Team Tasks", href: "/tasks/team" },
      { title: "Sprint Board", href: "/sprints" },
      { title: "Kanban", href: "/kanban" },
      { title: "Blockers", href: "/blockers" },
      { title: "Daily Standup", href: "/standups" },
    ],
  },
  {
    title: "Team",
    icon: "Users",
    children: [
      { title: "Employees", href: "/employees" },
      { title: "Teams", href: "/teams" },
      { title: "Workload", href: "/team/workload" },
      { title: "Performance", href: "/team/performance" },
      { title: "Attendance / Worklogs", href: "/team/worklogs" },
    ],
  },
  {
    title: "Engineering",
    icon: "Code2",
    children: [
      { title: "Development", href: "/engineering" },
      { title: "Bugs", href: "/qa/bugs" },
      { title: "QA", href: "/qa" },
      { title: "Releases", href: "/releases" },
      { title: "Deployments", href: "/releases/deployments" },
    ],
  },
  {
    title: "Finance",
    icon: "Wallet",
    children: [
      { title: "Development Budget", href: "/finance/budget" },
      { title: "Payroll", href: "/finance/payroll" },
      { title: "Expenses", href: "/finance/expenses" },
      { title: "Cloud/API Cost", href: "/finance/cloud" },
      { title: "Budget vs Actual", href: "/finance/variance" },
      { title: "Runway", href: "/finance/runway" },
    ],
  },
  {
    title: "Founder",
    icon: "Crown",
    children: [
      { title: "Founder Control", href: "/founder" },
      { title: "Approvals", href: "/founder/approvals" },
      { title: "Decision Log", href: "/founder/decisions" },
      { title: "Equity", href: "/founder/equity" },
      { title: "Investors", href: "/founder/investors" },
    ],
  },
  {
    title: "Growth",
    icon: "Globe",
    children: [
      { title: "Travel", href: "/growth/travel" },
      { title: "Expos", href: "/growth/expos" },
      { title: "Global Expansion", href: "/growth/expansion" },
    ],
  },
  {
    title: "Clients",
    icon: "Building2",
    children: [
      { title: "Client Portal", href: "/clients/portal" },
      { title: "Feedback", href: "/clients/feedback" },
      { title: "UAT", href: "/clients/uat" },
      { title: "Change Requests", href: "/clients/change-requests" },
    ],
  },
  { title: "Documents", href: "/documents", icon: "FileText" },
  { title: "AI Command Center", href: "/ai", icon: "Sparkles" },
  { title: "Reports", href: "/reports", icon: "BarChart3" },
  { title: "Settings", href: "/settings", icon: "Settings" },
];

export const COMMAND_ITEMS = [
  { id: "create-task", label: "Create Task", href: "/tasks?new=1", shortcut: "T" },
  { id: "create-sprint", label: "Create Sprint", href: "/sprints?new=1", shortcut: "S" },
  { id: "add-employee", label: "Add Employee", href: "/employees?new=1", shortcut: "E" },
  { id: "add-expense", label: "Add Expense", href: "/finance/expenses?new=1", shortcut: "X" },
  { id: "report-blocker", label: "Report Blocker", href: "/blockers?new=1", shortcut: "B" },
  { id: "create-release", label: "Create Release", href: "/releases?new=1", shortcut: "R" },
  { id: "founder-dashboard", label: "Open Founder Dashboard", href: "/founder", shortcut: "F" },
  { id: "open-project", label: "Open Project — Curevanta", href: "/projects/curevanta", shortcut: "P" },
  { id: "search-employee", label: "Search Employee", href: "/employees", shortcut: "U" },
  { id: "ask-ai", label: "Ask AI CTO", href: "/ai", shortcut: "A" },
] as const;
