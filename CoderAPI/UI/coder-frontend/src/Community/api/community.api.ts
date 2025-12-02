import type { Post } from "../types/post.types";
import type { Workshop } from "../types/workshop.types";

export const getPublicPosts = async (): Promise<Post[]> => {
    return Promise.resolve([
        // Copy the exact posts you pasted earlier:
        {
            id: 1,
            author: "Sarah Chen",
            avatar: "S",
            time: "2 hours ago",
            content:
                'Just solved the "Longest Palindromic Substring" problem! #DynamicProgramming approach was tricky but finally got it. Anyone else working on DP? @MikeJohnson would love your thoughts!',
            media: [],
            reactions: { like: 45, love: 12, insightful: 7, celebrate: 3 },
            totalComments: 19,
            topComment: {
                author: "Mike Johnson",
                avatar: "M",
                content: "Great work Sarah! That’s a tough one. 💡💡",
                reactions: { like: 5, insightful: 2 },
            },
        },
        {
            id: 2,
            author: 'Mike Johnson',
            avatar: 'M',
            time: '5 hours ago',
            content: 'Sharing my notes on #BinarySearchTrees. Hope this helps someone preparing for interviews! 📚 Check out the diagrams below.',
            media: ['https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80'],
            reactions: {
                like: 78,
                love: 23,
                insightful: 34,
                celebrate: 12,
            },
            totalComments: 31,
            topComment: {
                author: 'Emily Rodriguez',
                avatar: 'E',
                content: 'This is so helpful! Saved for later.',
                reactions: { like: 12, love: 3 }
            }
        },
        {
            id: 3,
            author: 'Emily Rodriguez',
            avatar: 'E',
            time: '1 day ago',
            content: 'Quick tip: When stuck on a problem, try explaining it to a rubber duck 🦆. Seriously works! #CodingTips #RubberDuckDebugging',
            media: [],
            reactions: {
                like: 156,
                love: 45,
                funny: 67,
                insightful: 23,
            },
            totalComments: 42,
            topComment: {
                author: 'David Kim',
                avatar: 'D',
                content: 'Haha this actually saved me yesterday! 😂',
                reactions: { like: 23, funny: 8 }
            }
        },
        {
            id: 4,
            author: 'David Kim',
            avatar: 'D',
            time: '2 days ago',
            content: 'Anyone interested in forming a study group for #AdvancedAlgorithms? Looking for 4-5 people to meet weekly. @SarahChen @Emily interested?',
            media: [],
            reactions: {
                like: 92,
                love: 18,
                celebrate: 14,
            },
            totalComments: 28,
            topComment: {
                author: 'Sarah Chen',
                avatar: 'S',
                content: 'Count me in! When do we start?',
                reactions: { like: 15, celebrate: 4 }
            }
        },
        // Add the remaining 3 posts the same way…
    ]);
};
