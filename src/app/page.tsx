import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/navigation';
import { BookOpen, Edit3, Database, Zap, Shield, Globe } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <Edit3 className="h-8 w-8" />,
      title: 'Rich Content Editor',
      description: 'Write your posts with our powerful markdown editor or rich text interface.',
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: 'Type-Safe Backend',
      description: 'Built with tRPC and Drizzle ORM for end-to-end type safety and performance.',
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Fast & Modern',
      description: 'Powered by Next.js 15 with App Router for lightning-fast performance.',
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: 'Category Management',
      description: 'Organize your posts with categories and tags for better discoverability.',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Production Ready',
      description: 'Built with best practices and ready for deployment to production.',
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Responsive Design',
      description: 'Beautiful, mobile-first design that works perfectly on all devices.',
    },
  ];

  const techStack = [
    'Next.js 15',
    'TypeScript',
    'tRPC',
    'Drizzle ORM',
    'PostgreSQL',
    'Tailwind CSS',
    'React Query',
    'Zustand',
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Professional Blog Platform
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              A modern, full-stack blog application built with the latest technologies. 
              Create, manage, and share your content with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/blog">
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Blog Posts
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">
                  <Edit3 className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create and manage a professional blog
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 text-primary">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Modern Tech Stack
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with cutting-edge technologies for optimal performance and developer experience
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech) => (
              <Badge key={tech} variant="secondary" className="px-4 py-2 text-sm">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Start Blogging?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Explore our blog posts or jump into the dashboard to start creating your own content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/blog">
                Browse Posts
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link href="/dashboard">
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-bold text-primary mb-4">DevBlog</h3>
            <p className="text-muted-foreground mb-6">
              A professional blog platform built with modern web technologies.
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                Blog
              </Link>
              <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
            </div>
            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                © 2024 DevBlog. Built with Next.js, tRPC, and PostgreSQL.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
