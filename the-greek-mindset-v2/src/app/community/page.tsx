// src/app/community/page.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageCircle, 
  TrendingUp, 
  Calendar, 
  Award,
  BookOpen,
  Dumbbell,
  ChefHat,
  Heart,
  Star,
  Clock,
  Eye,
  ThumbsUp,
  MessageSquare,
  Search,
  Filter,
  Plus,
  Crown,
  Flame,
  Target,
  Globe,
  Camera,
  Video,
  Mic,
  Share2,
  Flag,
  MoreHorizontal,
  ArrowUp,
  Send,
  Smile,
  Image,
  Link as LinkIcon,
  Pin,
  Lock,
  Zap,
  Coffee,
  Mountain,
  Lightbulb,
  Shield,
  Trophy
} from 'lucide-react';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: Member;
  category: string;
  tags: string[];
  replies: number;
  views: number;
  likes: number;
  createdAt: string;
  lastActivity: string;
  isPinned?: boolean;
  isLocked?: boolean;
  hasImage?: boolean;
  hasVideo?: boolean;
}

interface Member {
  id: string;
  name: string;
  username: string;
  avatar: string;
  level: number;
  title: string;
  badge: string;
  joinDate: string;
  posts: number;
  reputation: number;
  location: string;
  isOnline: boolean;
  specialties: string[];
}

interface CommunityStats {
  totalMembers: number;
  onlineNow: number;
  totalPosts: number;
  totalDiscussions: number;
}

const communityStats: CommunityStats = {
  totalMembers: 47832,
  onlineNow: 1247,
  totalPosts: 285041,
  totalDiscussions: 12893
};

const topMembers: Member[] = [
  {
    id: '1',
    name: 'Marcus Aurelius',
    username: 'stoic_emperor',
    avatar: '/avatars/marcus.jpg',
    level: 42,
    title: 'Philosophy Sage',
    badge: 'golden-crown',
    joinDate: '2022-01-15',
    posts: 2847,
    reputation: 9850,
    location: 'Rome, Italy',
    isOnline: true,
    specialties: ['Stoicism', 'Leadership', 'Meditation']
  },
  {
    id: '2',
    name: 'Helena Spartan',
    username: 'warrior_helen',
    avatar: '/avatars/helena.jpg',
    level: 38,
    title: 'Fitness Mentor',
    badge: 'spartan-shield',
    joinDate: '2022-03-22',
    posts: 1923,
    reputation: 7650,
    location: 'Sparta, Greece',
    isOnline: true,
    specialties: ['Spartan Training', 'Nutrition', 'Mental Toughness']
  },
  {
    id: '3',
    name: 'Chef Dionysus',
    username: 'divine_cook',
    avatar: '/avatars/dionysus.jpg',
    level: 35,
    title: 'Culinary Master',
    badge: 'golden-chef',
    joinDate: '2022-02-08',
    posts: 1456,
    reputation: 6420,
    location: 'Athens, Greece',
    isOnline: false,
    specialties: ['Greek Cuisine', 'Mediterranean Diet', 'Food History']
  },
  {
    id: '4',
    name: 'Aristotle Mind',
    username: 'logic_master',
    avatar: '/avatars/aristotle.jpg',
    level: 40,
    title: 'Logic Sage',
    badge: 'wisdom-owl',
    joinDate: '2022-01-30',
    posts: 2156,
    reputation: 8900,
    location: 'Macedonia, Greece',
    isOnline: true,
    specialties: ['Ethics', 'Logic', 'Philosophy of Mind']
  },
  {
    id: '5',
    name: 'Athena Wise',
    username: 'wisdom_goddess',
    avatar: '/avatars/athena.jpg',
    level: 44,
    title: 'Community Elder',
    badge: 'golden-owl',
    joinDate: '2021-12-10',
    posts: 3241,
    reputation: 11200,
    location: 'Athens, Greece',
    isOnline: true,
    specialties: ['Strategy', 'Wisdom', 'Community Leadership']
  }
];

const forumCategories = [
  { 
    id: 'philosophy', 
    name: 'Philosophy & Wisdom', 
    icon: BookOpen, 
    color: 'bg-purple-100 text-purple-800',
    description: 'Discuss Stoicism, ancient wisdom, and life philosophy',
    posts: 15420,
    topics: 2341
  },
  { 
    id: 'fitness', 
    name: 'Spartan Fitness', 
    icon: Dumbbell, 
    color: 'bg-red-100 text-red-800',
    description: 'Share workouts, training tips, and fitness journeys',
    posts: 12680,
    topics: 1876
  },
  { 
    id: 'cooking', 
    name: 'Greek Cuisine', 
    icon: ChefHat, 
    color: 'bg-green-100 text-green-800',
    description: 'Recipes, cooking tips, and culinary traditions',
    posts: 8940,
    topics: 1234
  },
  { 
    id: 'wellness', 
    name: 'Holistic Wellness', 
    icon: Heart, 
    color: 'bg-pink-100 text-pink-800',
    description: 'Mental health, meditation, and overall well-being',
    posts: 7830,
    topics: 987
  },
  { 
    id: 'general', 
    name: 'General Discussion', 
    icon: MessageCircle, 
    color: 'bg-blue-100 text-blue-800',
    description: 'Open conversations and community chat',
    posts: 18540,
    topics: 2876
  },
  { 
    id: 'success', 
    name: 'Success Stories', 
    icon: Trophy, 
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Share your achievements and inspire others',
    posts: 3420,
    topics: 542
  }
];

const recentPosts: ForumPost[] = [
  {
    id: '1',
    title: 'How Stoicism Changed My Approach to Daily Challenges',
    content: 'After 6 months of practicing Stoic principles, I wanted to share how this ancient philosophy has transformed my daily life. The concept of focusing only on what I can control has been...',
    author: topMembers[0],
    category: 'philosophy',
    tags: ['stoicism', 'daily-practice', 'transformation'],
    replies: 47,
    views: 892,
    likes: 156,
    createdAt: '2024-01-20T10:30:00Z',
    lastActivity: '2024-01-20T15:45:00Z',
    isPinned: true
  },
  {
    id: '2',
    title: 'New 30-Day Spartan Challenge - Who\'s In?',
    content: 'Starting February 1st, I\'m organizing a community-wide Spartan fitness challenge! 30 days of progressive workouts based on ancient Spartan training methods. Here\'s the plan...',
    author: topMembers[1],
    category: 'fitness',
    tags: ['challenge', 'spartan', 'community', '30-day'],
    replies: 89,
    views: 1547,
    likes: 203,
    createdAt: '2024-01-19T14:20:00Z',
    lastActivity: '2024-01-20T16:12:00Z',
    hasImage: true
  },
  {
    id: '3',
    title: 'Traditional Moussaka Recipe - Family Secret Revealed!',
    content: 'My grandmother\'s authentic moussaka recipe that\'s been in our family for generations. After many requests, I\'m finally sharing all the secrets that make this dish extraordinary...',
    author: topMembers[2],
    category: 'cooking',
    tags: ['moussaka', 'family-recipe', 'traditional', 'authentic'],
    replies: 34,
    views: 678,
    likes: 98,
    createdAt: '2024-01-19T09:15:00Z',
    lastActivity: '2024-01-20T12:30:00Z',
    hasVideo: true
  },
  {
    id: '4',
    title: 'Meditation Techniques: Ancient Greek vs Modern Mindfulness',
    content: 'Interesting comparison between ancient Greek contemplative practices and modern mindfulness techniques. Both have their merits, but I\'ve found combining them creates...',
    author: topMembers[3],
    category: 'wellness',
    tags: ['meditation', 'mindfulness', 'ancient-practices', 'comparison'],
    replies: 23,
    views: 445,
    likes: 67,
    createdAt: '2024-01-18T16:45:00Z',
    lastActivity: '2024-01-20T11:20:00Z'
  },
  {
    id: '5',
    title: 'Lost 30 Pounds Using Greek Mindset Approach - My Journey',
    content: 'Six months ago, I was struggling with my weight and motivation. Discovering The Greek Mindset approach changed everything. Here\'s my complete transformation story...',
    author: {
      id: '6',
      name: 'Transform_Tom',
      username: 'transform_tom',
      avatar: '/avatars/tom.jpg',
      level: 12,
      title: 'Transformation Warrior',
      badge: 'progress-star',
      joinDate: '2023-08-15',
      posts: 145,
      reputation: 890,
      location: 'New York, USA',
      isOnline: false,
      specialties: ['Weight Loss', 'Motivation']
    },
    category: 'success',
    tags: ['weight-loss', 'transformation', 'motivation', 'success'],
    replies: 67,
    views: 1234,
    likes: 189,
    createdAt: '2024-01-18T12:00:00Z',
    lastActivity: '2024-01-20T14:30:00Z',
    hasImage: true
  }
];

const upcomingEvents = [
  {
    id: '1',
    title: 'Weekly Philosophy Circle',
    date: '2024-01-22T19:00:00Z',
    type: 'Virtual Discussion',
    participants: 45,
    maxParticipants: 50
  },
  {
    id: '2',
    title: 'Spartan Workout Live Session',
    date: '2024-01-24T18:00:00Z',
    type: 'Live Fitness',
    participants: 89,
    maxParticipants: 100
  },
  {
    id: '3',
    title: 'Greek Cooking Masterclass',
    date: '2024-01-26T15:00:00Z',
    type: 'Virtual Cooking',
    participants: 67,
    maxParticipants: 75
  }
];

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showNewPost, setShowNewPost] = useState(false);

  const filteredPosts = recentPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'golden-crown': return Crown;
      case 'spartan-shield': return Shield;
      case 'golden-chef': return ChefHat;
      case 'wisdom-owl': return BookOpen;
      case 'golden-owl': return Star;
      default: return Award;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <main className="md:ml-64 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-blue-800 mb-6">
              Community
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-6">
              Join thousands of wisdom seekers on a journey toward ancient knowledge and modern wellness.
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Connect with like-minded individuals, share your experiences, learn from others, 
              and build meaningful relationships in our supportive Greek Mindset community.
            </p>
          </motion.div>

          {/* Community Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            <div className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-blue-200">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-800">{communityStats.totalMembers.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Members</div>
            </div>
            <div className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-green-200">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{communityStats.onlineNow.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Online Now</div>
            </div>
            <div className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-purple-200">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">{communityStats.totalPosts.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Posts</div>
            </div>
            <div className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Flame className="h-6 w-6 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-amber-600">{communityStats.totalDiscussions.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Active Topics</div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Forum Area */}
            <div className="lg:col-span-3 space-y-8">
              {/* Search and Filter Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-blue-200"
              >
                <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search discussions, topics, or members..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="popular">Most Popular</option>
                      <option value="replies">Most Replies</option>
                      <option value="views">Most Views</option>
                    </select>
                    <Button
                      onClick={() => setShowNewPost(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Post
                    </Button>
                  </div>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === 'all' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                    className={selectedCategory === 'all' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    All Categories
                  </Button>
                  {forumCategories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-2 ${
                        selectedCategory === category.id ? 'bg-blue-600 hover:bg-blue-700' : ''
                      }`}
                    >
                      <category.icon className="h-3 w-3" />
                      {category.name}
                    </Button>
                  ))}
                </div>
              </motion.div>

              {/* Forum Categories Overview */}
              {selectedCategory === 'all' && !searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-blue-200 overflow-hidden"
                >
                  <div className="p-6 border-b border-blue-100">
                    <h2 className="text-xl font-bold text-blue-800">Forum Categories</h2>
                    <p className="text-gray-600">Explore different areas of discussion</p>
                  </div>
                  <div className="divide-y divide-blue-100">
                    {forumCategories.map((category) => (
                      <div
                        key={category.id}
                        className="p-6 hover:bg-blue-50/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center`}>
                            <category.icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-blue-800 mb-1">{category.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                            <div className="flex gap-4 text-xs text-gray-500">
                              <span>{category.topics.toLocaleString()} topics</span>
                              <span>{category.posts.toLocaleString()} posts</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-blue-700">Latest Activity</div>
                            <div className="text-xs text-gray-500">2 minutes ago</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Recent Posts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-blue-800">
                    {selectedCategory === 'all' ? 'Recent Discussions' : `${forumCategories.find(c => c.id === selectedCategory)?.name} Discussions`}
                  </h2>
                  <Badge variant="outline">
                    {filteredPosts.length} posts
                  </Badge>
                </div>

                {filteredPosts.map((post, index) => {
                  const BadgeIcon = getBadgeIcon(post.author.badge);
                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-blue-200 overflow-hidden hover:shadow-xl transition-all"
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Author Avatar */}
                          <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {post.author.name.charAt(0)}
                              </span>
                            </div>
                            {post.author.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>

                          {/* Post Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                {post.isPinned && (
                                  <Pin className="h-4 w-4 text-blue-600" />
                                )}
                                {post.isLocked && (
                                  <Lock className="h-4 w-4 text-gray-500" />
                                )}
                                <h3 className="font-semibold text-blue-800 hover:text-blue-600 cursor-pointer">
                                  {post.title}
                                </h3>
                              </div>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>

                            <p className="text-gray-700 mb-3 line-clamp-2">
                              {post.content}
                            </p>

                            {/* Author Info */}
                            <div className="flex items-center gap-2 mb-3">
                              <span className="font-medium text-blue-700">{post.author.name}</span>
                              <BadgeIcon className="h-3 w-3 text-amber-500" />
                              <span className="text-xs text-gray-500">{post.author.title}</span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</span>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {post.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            {/* Media Indicators */}
                            <div className="flex items-center gap-4 mb-3">
                              {post.hasImage && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Image className="h-3 w-3" />
                                  Image
                                </div>
                              )}
                              {post.hasVideo && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Video className="h-3 w-3" />
                                  Video
                                </div>
                              )}
                            </div>

                            {/* Post Stats */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <ThumbsUp className="h-4 w-4" />
                                  {post.likes}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="h-4 w-4" />
                                  {post.replies}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  {post.views}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <ThumbsUp className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Top Contributors */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-blue-200 overflow-hidden"
              >
                <div className="p-4 border-b border-blue-100">
                  <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                    <Crown className="h-4 w-4 text-amber-500" />
                    Top Contributors
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {topMembers.slice(0, 5).map((member, index) => {
                    const BadgeIcon = getBadgeIcon(member.badge);
                    return (
                      <div key={member.id} className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                        <div className="relative">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                          {member.isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium text-gray-800 truncate">
                              {member.name}
                            </span>
                            <BadgeIcon className="h-3 w-3 text-amber-500 flex-shrink-0" />
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>Level {member.level}</span>
                            <span>•</span>
                            <span>{member.reputation.toLocaleString()} rep</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          #{index + 1}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Upcoming Events */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-blue-200 overflow-hidden"
              >
                <div className="p-4 border-b border-blue-100">
                  <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Upcoming Events
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 text-sm mb-1">
                        {event.title}
                      </h4>
                      <div className="text-xs text-gray-600 mb-2">
                        {new Date(event.date).toLocaleDateString()} at{' '}
                        {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {event.type}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {event.participants}/{event.maxParticipants} joined
                        </span>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full">
                    View All Events
                  </Button>
                </div>
              </motion.div>

              {/* Community Guidelines */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-lg border border-purple-200 p-6"
              >
                <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Community Guidelines
                </h3>
                <div className="space-y-2 text-sm text-purple-700">
                  <div className="flex items-start gap-2">
                    <Heart className="h-3 w-3 mt-1 flex-shrink-0" />
                    <span>Be respectful and supportive</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-3 w-3 mt-1 flex-shrink-0" />
                    <span>Share knowledge freely</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Target className="h-3 w-3 mt-1 flex-shrink-0" />
                    <span>Stay on topic and constructive</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe className="h-3 w-3 mt-1 flex-shrink-0" />
                    <span>Embrace diverse perspectives</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4 border-purple-300 text-purple-700 hover:bg-purple-50">
                  Read Full Guidelines
                </Button>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.6 }}
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-blue-200 p-4"
              >
                <h3 className="font-semibold text-blue-800 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Start New Discussion
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Find Study Partners
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Join Events
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </motion.div>

              {/* Community Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.8 }}
                className="bg-gradient-to-br from-green-100 to-blue-100 rounded-xl shadow-lg border border-green-200 p-4"
              >
                <h3 className="font-semibold text-green-800 mb-3">This Week</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">New Members</span>
                    <span className="font-bold text-green-800">+1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">New Posts</span>
                    <span className="font-bold text-green-800">+3,892</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Active Discussions</span>
                    <span className="font-bold text-green-800">1,456</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Events Hosted</span>
                    <span className="font-bold text-green-800">23</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.0 }}
            className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-8 text-white text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Ready to Join Our Community?</h2>
            <p className="text-blue-100 max-w-2xl mx-auto mb-6">
              Connect with thousands of wisdom seekers, share your journey, and learn from others 
              who are committed to personal growth and ancient wisdom.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="border-white bg-transparent text-white hover:bg-white hover:text-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Post
              </Button>
              <Button variant="outline" className="border-white bg-transparent text-white hover:bg-white hover:text-blue-600">
                <Users className="h-4 w-4 mr-2" />
                Join a Discussion
              </Button>
              <Button variant="outline" className="border-white bg-transparent text-white hover:bg-white hover:text-blue-600">
                <Calendar className="h-4 w-4 mr-2" />
                Attend an Event
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}