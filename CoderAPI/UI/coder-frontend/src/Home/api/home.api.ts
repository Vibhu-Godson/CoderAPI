// src/Home/api/home.api.ts

export async function fetchCategories() {
    return Promise.resolve([
        { name: 'Basics & Patterns', icon: '🎯', problems: 45, solved: 23, difficulty: 'Easy' },
        { name: 'Arrays', icon: '📊', problems: 89, solved: 34, difficulty: 'Mixed' },
        { name: 'Strings', icon: '📝', problems: 67, solved: 28, difficulty: 'Mixed' },
        { name: 'Recursion', icon: '🔄', problems: 54, solved: 19, difficulty: 'Medium' },
        { name: 'Trees', icon: '🌳', problems: 72, solved: 31, difficulty: 'Hard' },
        { name: 'Graphs', icon: '🕸️', problems: 58, solved: 15, difficulty: 'Hard' },
        { name: 'Dynamic Programming', icon: '⚡', problems: 91, solved: 22, difficulty: 'Hard' },
        { name: 'System Design', icon: '🏗️', problems: 34, solved: 8, difficulty: 'Expert' }
    ]);
}

export async function fetchProblemCategories() {
    return fetchCategories();
}

export async function fetchLearningPath() {
    return Promise.resolve([
        { id: 1, title: 'Learn Basics', description: 'Master fundamental concepts', color: 'from-indigo-500 to-purple-500' },
        { id: 2, title: 'Master Patterns', description: 'Recognize problem patterns', color: 'from-purple-500 to-pink-500' },
        { id: 3, title: 'Ace DSA', description: 'Data structures & algorithms', color: 'from-indigo-600 to-indigo-800' },
        { id: 4, title: 'Build Projects', description: 'Apply your knowledge', color: 'from-purple-600 to-indigo-600' },
        { id: 5, title: 'System Design', description: 'Scale your thinking', color: 'from-indigo-700 to-purple-700' },
        { id: 6, title: 'Explore AI/ML', description: 'Future technologies', color: 'from-purple-600 to-indigo-500' },
        { id: 7, title: 'Win Interviews', description: 'Land your dream job', color: 'from-purple-700 to-purple-900' },
    ]);
}

export async function fetchLiveActivity() {
    return Promise.resolve([
        { user: 'Vikram', action: 'solved "Binary Tree Traversal"', time: 'just now', streak: 45 },
        { user: 'Meera', action: 'completed Arrays category', time: '2 min ago', streak: 23 },
        { user: 'Arjun', action: 'started learning journey', time: '5 min ago', streak: 1 },
    ]);
}

export async function fetchTestimonials() {
    return Promise.resolve([
        {
            name: "Sumedha Arya",
            achievement: "Cracked her dream role",
            quote: "AmCoder simplified concepts I struggled with for years. Everything finally clicked.",
            avatar: "S",
            company: "Software Engineer at Eversana"
        },
        {
            name: "Shubham Singh",
            achievement: "Levelled up DSA",
            quote: "Vibhu's teaching style made complex DSA feel like storytelling. Life-changing.",
            avatar: "S",
            company: "Now at Amazon"
        },
        {
            name: "Aditya Raj",
            achievement: "Mastered core CS fundamentals",
            quote: "The kind of clarity I got here is something I never found anywhere else.",
            avatar: "A",
            company: "Software Engineer at Edifecs"
        },
        {
            name: "Rahul Utkar",
            achievement: "Secured his first big IT offer",
            quote: "The roadmap, the guidance, the doubt support — everything works like magic.",
            avatar: "R",
            company: "Working at Deloitte"
        },
        {
            name: "Ratnesh Yadav",
            achievement: "Improved problem solving drastically",
            quote: "Consistent learning with the AmCoder approach helped me break my plateaus.",
            avatar: "R",
            company: "Software Engineer at Eversana"
        },

        // College students
        {
            name: "Piyush Agrahari",
            achievement: "Solved his first 50 DSA problems",
            quote: "Being from HBTU MCA, I always feared DSA. AmCoder removed that fear completely.",
            avatar: "P",
            company: "MCA Student at HBTU Kanpur"
        },
        {
            name: "Himanshi Lodhi",
            achievement: "Grasped OOP & DSA fundamentals",
            quote: "The structured explanations and support helped me build real confidence.",
            avatar: "H",
            company: "MCA Student at NIT Bhopal"
        }
    ]);
}


export async function fetchPlans() {
    return Promise.resolve([
        {
            id: 1,
            name: "Free Forever",
            price: 0,
            features: [
                "100+ practice problems",
                "Community discussions",
                "Basic progress tracking"
            ],
            highlight: false
        },
        {
            id: 2,
            name: "Pro",
            price: 499,
            features: [
                "1000+ problems",
                "Premium editorials",
                "Workshop access",
                "Advanced analytics",
                "No advertisements"
            ],
            highlight: true
        },
        {
            id: 3,
            name: "Mentor+",
            price: 1999,
            features: [
                "Everything in Pro",
                "1-on-1 mentorship",
                "Interview preparation",
                "Resume review"
            ],
            highlight: false
        }
    ]);
}

export async function fetchSuccessStories() {
    return fetchTestimonials();
}

export async function fetchWorkshops() {
    return Promise.resolve([
        {
            id: 1,
            title: "Advanced DSA Masterclass",
            time: "Live Now",
            type: "live",
            description: "Live session on complex algorithms"
        },
        {
            id: 2,
            title: "System Design Fundamentals",
            time: "Tomorrow, 4:00 PM",
            type: "upcoming",
            description: "Learn to design scalable systems"
        },
        {
            id: 3,
            title: "Workshop Library",
            time: "Past Recordings",
            type: "library",
            description: "Access 50+ recorded sessions"
        }
    ]);
}
