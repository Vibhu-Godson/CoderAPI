import { Award, Calendar, Code, Trophy } from 'lucide-react';

interface ProfileProps {
    user: { name: string; avatar: string };
}

export default function Profile({ user }: ProfileProps) {
    const stats = [
        { label: 'Problems Solved', value: '147', icon: Code, color: 'text-blue-600' },
        { label: 'Contest Rating', value: '1842', icon: Trophy, color: 'text-yellow-600' },
        { label: 'Days Active', value: '89', icon: Calendar, color: 'text-green-600' },
        { label: 'Badges Earned', value: '12', icon: Award, color: 'text-purple-600' },
    ];

    const recentSubmissions = [
        { problem: 'Two Sum', difficulty: 'Easy', status: 'Accepted', time: '2 hours ago' },
        { problem: 'Valid Parentheses', difficulty: 'Easy', status: 'Accepted', time: '5 hours ago' },
        { problem: 'Longest Substring', difficulty: 'Medium', status: 'Wrong Answer', time: '1 day ago' },
        { problem: 'Binary Tree Traversal', difficulty: 'Medium', status: 'Accepted', time: '2 days ago' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Profile Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl">
                        {user.avatar}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-gray-900 mb-2">{user.name}</h1>
                        <p className="text-gray-600 mb-4">Software Engineer | Coding Enthusiast</p>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Edit Profile
                            </button>
                            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                Share Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <stat.icon className={`w-8 h-8 ${stat.color}`} />
                            <div className="text-gray-900">{stat.value}</div>
                        </div>
                        <div className="text-gray-600">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Calendar */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-gray-900 mb-4">Activity</h2>
                    <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 91 }, (_, i) => (
                            <div
                                key={i}
                                className={`aspect-square rounded ${i % 7 === 0 || i % 7 === 6
                                        ? 'bg-gray-100'
                                        : i % 3 === 0
                                            ? 'bg-green-500'
                                            : i % 2 === 0
                                                ? 'bg-green-300'
                                                : 'bg-green-100'
                                    }`}
                            ></div>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                        <span>Less</span>
                        <div className="flex gap-1">
                            <div className="w-4 h-4 bg-gray-100 rounded"></div>
                            <div className="w-4 h-4 bg-green-100 rounded"></div>
                            <div className="w-4 h-4 bg-green-300 rounded"></div>
                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                        </div>
                        <span>More</span>
                    </div>
                </div>

                {/* Skills */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-gray-900 mb-4">Skills</h2>
                    <div className="space-y-4">
                        {[
                            { name: 'Arrays', solved: 45, total: 100 },
                            { name: 'Strings', solved: 32, total: 80 },
                            { name: 'Dynamic Programming', solved: 18, total: 50 },
                            { name: 'Trees', solved: 28, total: 70 },
                            { name: 'Graphs', solved: 15, total: 60 },
                        ].map((skill) => (
                            <div key={skill.name}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-700">{skill.name}</span>
                                    <span className="text-gray-500">
                                        {skill.solved}/{skill.total}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${(skill.solved / skill.total) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Submissions */}
            <div className="bg-white rounded-lg border border-gray-200 mt-6">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-gray-900">Recent Submissions</h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {recentSubmissions.map((submission, index) => (
                        <div key={index} className="p-6 flex items-center justify-between">
                            <div className="flex-1">
                                <h3 className="text-gray-900 mb-1">{submission.problem}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span className={`px-2 py-1 rounded ${submission.difficulty === 'Easy' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                                        }`}>
                                        {submission.difficulty}
                                    </span>
                                    <span>{submission.time}</span>
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded ${submission.status === 'Accepted' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                }`}>
                                {submission.status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
