// ============================================================
// NextGen CareerNav — Mock Data & Occupational Profiles
// Inspired by O*NET + Kaggle career datasets
// ============================================================

export const SKILL_CATEGORIES = {
  technical: {
    label: "Technical Skills",
    color: "#4f8ef7",
    skills: [
      { id: "programming", label: "Programming / Coding" },
      { id: "data_analysis", label: "Data Analysis" },
      { id: "machine_learning", label: "Machine Learning / AI" },
      { id: "cloud_computing", label: "Cloud Computing" },
      { id: "databases", label: "Databases / SQL" },
      { id: "web_development", label: "Web Development" },
      { id: "cybersecurity", label: "Cybersecurity" },
      { id: "devops", label: "DevOps / CI-CD" },
    ],
  },
  domain: {
    label: "Domain Knowledge",
    color: "#7c3aed",
    skills: [
      { id: "business_acumen", label: "Business Acumen" },
      { id: "finance", label: "Finance / Accounting" },
      { id: "marketing", label: "Marketing / Growth" },
      { id: "product_management", label: "Product Management" },
      { id: "research", label: "Research & Analysis" },
      { id: "design", label: "UI/UX Design" },
    ],
  },
  soft: {
    label: "Soft Skills",
    color: "#10b981",
    skills: [
      { id: "communication", label: "Communication" },
      { id: "leadership", label: "Leadership" },
      { id: "problem_solving", label: "Problem Solving" },
      { id: "teamwork", label: "Teamwork / Collaboration" },
      { id: "time_management", label: "Time Management" },
      { id: "adaptability", label: "Adaptability" },
    ],
  },
};

// Flat list of all skills
export const ALL_SKILLS = Object.values(SKILL_CATEGORIES).flatMap((cat) =>
  cat.skills.map((s) => ({ ...s, category: cat.label, color: cat.color }))
);

// ============================================================
// Occupational Profiles (20 roles)
// Each role has required skill levels (1–5) per skill ID
// ============================================================
export const OCCUPATIONAL_PROFILES = [
  {
    id: "data_scientist",
    title: "Data Scientist",
    department: "Analytics & AI",
    icon: "🧠",
    avgSalary: "₹12–25 LPA",
    demand: "Very High",
    demandColor: "#10b981",
    description:
      "Analyze complex data to extract insights, build predictive models, and drive strategic decisions using statistical and ML techniques.",
    skills: {
      programming: 5, data_analysis: 5, machine_learning: 5, cloud_computing: 3,
      databases: 4, web_development: 2, cybersecurity: 1, devops: 3,
      business_acumen: 3, finance: 2, marketing: 1, product_management: 2,
      research: 5, design: 1, communication: 4, leadership: 3,
      problem_solving: 5, teamwork: 4, time_management: 4, adaptability: 4,
    },
    keySkills: ["Python/R", "TensorFlow/PyTorch", "SQL", "Statistics", "Data Viz"],
  },
  {
    id: "software_engineer",
    title: "Software Engineer",
    department: "Engineering",
    icon: "💻",
    avgSalary: "₹8–22 LPA",
    demand: "Very High",
    demandColor: "#10b981",
    description:
      "Design, develop, test, and maintain scalable software systems and applications across the full development lifecycle.",
    skills: {
      programming: 5, data_analysis: 3, machine_learning: 2, cloud_computing: 4,
      databases: 4, web_development: 4, cybersecurity: 3, devops: 4,
      business_acumen: 2, finance: 1, marketing: 1, product_management: 2,
      research: 3, design: 2, communication: 4, leadership: 3,
      problem_solving: 5, teamwork: 5, time_management: 4, adaptability: 4,
    },
    keySkills: ["Java/Python/Go", "System Design", "APIs", "Git", "Agile"],
  },
  {
    id: "ml_engineer",
    title: "ML Engineer",
    department: "AI/ML",
    icon: "🤖",
    avgSalary: "₹14–30 LPA",
    demand: "High",
    demandColor: "#10b981",
    description:
      "Build and deploy production-grade machine learning systems, bridging research and engineering at scale.",
    skills: {
      programming: 5, data_analysis: 4, machine_learning: 5, cloud_computing: 5,
      databases: 4, web_development: 2, cybersecurity: 2, devops: 5,
      business_acumen: 2, finance: 1, marketing: 1, product_management: 2,
      research: 4, design: 1, communication: 3, leadership: 3,
      problem_solving: 5, teamwork: 4, time_management: 4, adaptability: 4,
    },
    keySkills: ["MLOps", "Kubernetes", "PyTorch", "Feature Engineering", "Monitoring"],
  },
  {
    id: "product_manager",
    title: "Product Manager",
    department: "Product",
    icon: "🎯",
    avgSalary: "₹15–35 LPA",
    demand: "High",
    demandColor: "#10b981",
    description:
      "Define product vision, prioritize features, and coordinate cross-functional teams to deliver exceptional user experiences.",
    skills: {
      programming: 2, data_analysis: 4, machine_learning: 2, cloud_computing: 2,
      databases: 3, web_development: 2, cybersecurity: 1, devops: 1,
      business_acumen: 5, finance: 4, marketing: 4, product_management: 5,
      research: 5, design: 4, communication: 5, leadership: 5,
      problem_solving: 5, teamwork: 5, time_management: 5, adaptability: 4,
    },
    keySkills: ["Roadmapping", "User Research", "OKRs", "A/B Testing", "Stakeholder Mgmt"],
  },
  {
    id: "ux_designer",
    title: "UX/UI Designer",
    department: "Design",
    icon: "🎨",
    avgSalary: "₹6–18 LPA",
    demand: "High",
    demandColor: "#10b981",
    description:
      "Research user needs and design intuitive, visually compelling digital experiences that drive engagement and satisfaction.",
    skills: {
      programming: 2, data_analysis: 3, machine_learning: 1, cloud_computing: 1,
      databases: 1, web_development: 3, cybersecurity: 1, devops: 1,
      business_acumen: 3, finance: 1, marketing: 3, product_management: 3,
      research: 5, design: 5, communication: 5, leadership: 3,
      problem_solving: 4, teamwork: 4, time_management: 4, adaptability: 4,
    },
    keySkills: ["Figma", "User Research", "Prototyping", "Design Systems", "Accessibility"],
  },
  {
    id: "cybersecurity_analyst",
    title: "Cybersecurity Analyst",
    department: "Security",
    icon: "🔐",
    avgSalary: "₹8–20 LPA",
    demand: "Very High",
    demandColor: "#10b981",
    description:
      "Protect organizational assets by monitoring threats, responding to incidents, and implementing security frameworks.",
    skills: {
      programming: 4, data_analysis: 3, machine_learning: 2, cloud_computing: 4,
      databases: 3, web_development: 2, cybersecurity: 5, devops: 3,
      business_acumen: 2, finance: 1, marketing: 1, product_management: 1,
      research: 4, design: 1, communication: 3, leadership: 3,
      problem_solving: 5, teamwork: 4, time_management: 4, adaptability: 4,
    },
    keySkills: ["SIEM", "Penetration Testing", "Network Security", "OWASP", "Incident Response"],
  },
  {
    id: "cloud_architect",
    title: "Cloud Architect",
    department: "Infrastructure",
    icon: "☁️",
    avgSalary: "₹18–40 LPA",
    demand: "Very High",
    demandColor: "#10b981",
    description:
      "Design and oversee cloud infrastructure strategies for scalability, security, and cost optimization on AWS/GCP/Azure.",
    skills: {
      programming: 4, data_analysis: 3, machine_learning: 2, cloud_computing: 5,
      databases: 4, web_development: 2, cybersecurity: 4, devops: 5,
      business_acumen: 4, finance: 3, marketing: 1, product_management: 2,
      research: 3, design: 1, communication: 4, leadership: 4,
      problem_solving: 5, teamwork: 4, time_management: 4, adaptability: 4,
    },
    keySkills: ["AWS/GCP/Azure", "Terraform", "Kubernetes", "Cost Optimization", "Security"],
  },
  {
    id: "business_analyst",
    title: "Business Analyst",
    department: "Strategy",
    icon: "📊",
    avgSalary: "₹6–16 LPA",
    demand: "Moderate",
    demandColor: "#f59e0b",
    description:
      "Bridge the gap between business needs and technical solutions by analyzing processes and recommending improvements.",
    skills: {
      programming: 2, data_analysis: 4, machine_learning: 1, cloud_computing: 1,
      databases: 4, web_development: 1, cybersecurity: 1, devops: 1,
      business_acumen: 5, finance: 4, marketing: 3, product_management: 4,
      research: 5, design: 2, communication: 5, leadership: 4,
      problem_solving: 5, teamwork: 5, time_management: 5, adaptability: 4,
    },
    keySkills: ["Requirements Gathering", "Process Mapping", "SQL", "Excel", "Stakeholder Mgmt"],
  },
  {
    id: "devops_engineer",
    title: "DevOps Engineer",
    department: "Engineering",
    icon: "⚙️",
    avgSalary: "₹10–25 LPA",
    demand: "High",
    demandColor: "#10b981",
    description:
      "Automate and streamline software delivery pipelines, ensuring high availability, reliability, and deployment speed.",
    skills: {
      programming: 4, data_analysis: 2, machine_learning: 1, cloud_computing: 5,
      databases: 3, web_development: 2, cybersecurity: 4, devops: 5,
      business_acumen: 2, finance: 1, marketing: 1, product_management: 2,
      research: 3, design: 1, communication: 3, leadership: 3,
      problem_solving: 5, teamwork: 4, time_management: 4, adaptability: 5,
    },
    keySkills: ["Docker", "Jenkins/GitHub Actions", "Monitoring", "Linux", "IaC"],
  },
  {
    id: "digital_marketer",
    title: "Digital Marketing Manager",
    department: "Marketing",
    icon: "📣",
    avgSalary: "₹5–14 LPA",
    demand: "Moderate",
    demandColor: "#f59e0b",
    description:
      "Drive brand growth through data-driven digital campaigns across SEO, social media, paid ads, and content strategy.",
    skills: {
      programming: 2, data_analysis: 4, machine_learning: 1, cloud_computing: 1,
      databases: 2, web_development: 2, cybersecurity: 1, devops: 1,
      business_acumen: 4, finance: 3, marketing: 5, product_management: 3,
      research: 4, design: 3, communication: 5, leadership: 4,
      problem_solving: 4, teamwork: 4, time_management: 5, adaptability: 5,
    },
    keySkills: ["SEO/SEM", "Google Analytics", "Meta Ads", "Content Strategy", "CRM"],
  },
];

// ============================================================
// Learning Resources per Skill
// ============================================================
export const LEARNING_RESOURCES = {
  programming: [
    { name: "CS50 (Harvard)", type: "Course", url: "#", free: true },
    { name: "LeetCode", type: "Practice", url: "#", free: true },
    { name: "The Odin Project", type: "Course", url: "#", free: true },
  ],
  data_analysis: [
    { name: "Google Data Analytics Certificate", type: "Certificate", url: "#", free: false },
    { name: "Kaggle Learn", type: "Course", url: "#", free: true },
    { name: "Tableau Public", type: "Tool", url: "#", free: true },
  ],
  machine_learning: [
    { name: "Fast.ai Deep Learning", type: "Course", url: "#", free: true },
    { name: "Coursera ML by Andrew Ng", type: "Course", url: "#", free: false },
    { name: "Hugging Face Tutorials", type: "Documentation", url: "#", free: true },
  ],
  cloud_computing: [
    { name: "AWS Cloud Practitioner", type: "Certificate", url: "#", free: false },
    { name: "Google Cloud Skills Boost", type: "Course", url: "#", free: false },
    { name: "A Cloud Guru", type: "Course", url: "#", free: false },
  ],
  databases: [
    { name: "SQLZoo", type: "Practice", url: "#", free: true },
    { name: "MongoDB University", type: "Course", url: "#", free: true },
    { name: "Mode Analytics SQL Tutorial", type: "Course", url: "#", free: true },
  ],
  web_development: [
    { name: "freeCodeCamp", type: "Course", url: "#", free: true },
    { name: "The Odin Project", type: "Course", url: "#", free: true },
    { name: "Frontend Masters", type: "Course", url: "#", free: false },
  ],
  cybersecurity: [
    { name: "TryHackMe", type: "Practice", url: "#", free: true },
    { name: "CompTIA Security+ Prep", type: "Certificate", url: "#", free: false },
    { name: "OWASP Top 10 Guide", type: "Documentation", url: "#", free: true },
  ],
  devops: [
    { name: "KodeKloud DevOps", type: "Course", url: "#", free: false },
    { name: "Docker Official Docs", type: "Documentation", url: "#", free: true },
    { name: "GitHub Actions Docs", type: "Documentation", url: "#", free: true },
  ],
  business_acumen: [
    { name: "Harvard Business Review", type: "Reading", url: "#", free: false },
    { name: "Coursera Business Foundations", type: "Course", url: "#", free: false },
    { name: "Y Combinator Startup School", type: "Course", url: "#", free: true },
  ],
  design: [
    { name: "Figma Learn", type: "Course", url: "#", free: true },
    { name: "Google UX Design Certificate", type: "Certificate", url: "#", free: false },
    { name: "Dribbble Community", type: "Community", url: "#", free: true },
  ],
  communication: [
    { name: "Toastmasters International", type: "Community", url: "#", free: false },
    { name: "Coursera Communication Skills", type: "Course", url: "#", free: false },
  ],
  leadership: [
    { name: "MIT Leadership Course", type: "Course", url: "#", free: false },
    { name: "Leaders Eat Last (Book)", type: "Book", url: "#", free: false },
  ],
  problem_solving: [
    { name: "HackerRank Problem Solving", type: "Practice", url: "#", free: true },
    { name: "Think Like a Programmer (Book)", type: "Book", url: "#", free: false },
  ],
  research: [
    { name: "Google Scholar", type: "Tool", url: "#", free: true },
    { name: "Research Methods Coursera", type: "Course", url: "#", free: false },
  ],
  marketing: [
    { name: "Google Digital Garage", type: "Course", url: "#", free: true },
    { name: "HubSpot Academy", type: "Course", url: "#", free: true },
  ],
  product_management: [
    { name: "Product School PM Certificate", type: "Certificate", url: "#", free: false },
    { name: "Reforge Growth Program", type: "Course", url: "#", free: false },
    { name: "Lenny's Newsletter", type: "Reading", url: "#", free: true },
  ],
  finance: [
    { name: "Corporate Finance Institute", type: "Course", url: "#", free: false },
    { name: "Khan Academy Finance", type: "Course", url: "#", free: true },
  ],
  teamwork: [{ name: "Agile/Scrum Fundamentals", type: "Course", url: "#", free: true }],
  time_management: [{ name: "Getting Things Done (Book)", type: "Book", url: "#", free: false }],
  adaptability: [{ name: "Growth Mindset (Coursera)", type: "Course", url: "#", free: false }],
};

// ============================================================
// Resume Sample Bullet Points (for demo)
// ============================================================
export const SAMPLE_RESUME_TEXT = `John Doe
Software Engineer | john.doe@email.com | LinkedIn: /in/johndoe

EXPERIENCE
Senior Developer, TechCorp (2021–Present)
• Worked on backend systems
• Did some optimization work
• Helped the team with various tasks
• Participated in code reviews

Junior Developer, StartupXYZ (2019–2021)  
• Wrote code for features
• Fixed bugs
• Worked with the database
• Attended meetings

EDUCATION
B.Tech Computer Science, State University (2019)
GPA: 7.8/10

SKILLS
Python, Java, SQL, Git, REST APIs

PROJECTS
E-commerce Platform
• Built a website for online shopping
• Used React and Node.js`;

export const SAMPLE_JD = `We are looking for a Senior Software Engineer with:
- 4+ years of Python/Java backend development experience
- Strong expertise in RESTful API design and microservices architecture
- Proficiency in cloud platforms (AWS/GCP) and containerization (Docker, Kubernetes)
- Experience with SQL/NoSQL databases and query optimization
- Demonstrated ability to lead technical initiatives and mentor junior developers
- Track record of improving system performance and scalability
- Experience with CI/CD pipelines and agile methodologies`;
