"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { FileText, FolderOpen, Eye, Plus } from "lucide-react";
import { formatDistance } from "date-fns";

export default function DashboardPage() {
  // Fetch statistics
  const { data: allPosts } = trpc.posts.getAll.useQuery({
    limit: 100,
    offset: 0,
  });

  const { data: categories } = trpc.categories.getAll.useQuery();

  const { data: publishedPosts } = trpc.posts.getAll.useQuery({
    limit: 100,
    offset: 0,
    status: "published",
  });

  const { data: draftPosts } = trpc.posts.getAll.useQuery({
    limit: 100,
    offset: 0,
    status: "draft",
  });

  const { data: recentPosts } = trpc.posts.getAll.useQuery({
    limit: 5,
    offset: 0,
  });

  const stats = [
    {
      title: "Total Posts",
      value: allPosts?.total || 0,
      description: `${publishedPosts?.total || 0} published, ${
        draftPosts?.total || 0
      } drafts`,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Categories",
      value: categories?.length || 0,
      description: "Content categories",
      icon: FolderOpen,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Published Posts",
      value: publishedPosts?.total || 0,
      description: "Live on your blog",
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Draft Posts",
      value: draftPosts?.total || 0,
      description: "Work in progress",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here&apos;s what&apos;s happening with your blog.
          </p>
        </div>

        <div className="flex space-x-3">
          <Button asChild>
            <Link href="/dashboard/posts/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/categories/new">
              <Plus className="mr-2 h-4 w-4" />
              New Category
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Recent Posts
            </CardTitle>
            <CardDescription>Your latest blog posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts?.posts?.length ? (
                recentPosts.posts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center space-x-4 p-3 rounded-lg border"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {post.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDistance(post.createdAt, new Date(), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          post.status === "published" ? "default" : "secondary"
                        }
                      >
                        {post.status}
                      </Badge>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/posts/${post.id}`}>Edit</Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-sm font-medium text-foreground">
                    No posts yet
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Get started by creating your first blog post.
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href="/dashboard/posts/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Post
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {recentPosts?.posts?.length ? (
              <div className="mt-6 text-center">
                <Button variant="outline" asChild>
                  <Link href="/dashboard/posts">View all posts</Link>
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Categories Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FolderOpen className="mr-2 h-5 w-5" />
              Categories
            </CardTitle>
            <CardDescription>Content organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories?.length ? (
                categories.slice(0, 5).map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {category.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {category.postCount} posts
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/categories/${category.id}`}>
                        Edit
                      </Link>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-sm font-medium text-foreground">
                    No categories yet
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Create categories to organize your posts.
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href="/dashboard/categories/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Category
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {categories?.length ? (
              <div className="mt-6 text-center">
                <Button variant="outline" asChild>
                  <Link href="/dashboard/categories">View all categories</Link>
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
