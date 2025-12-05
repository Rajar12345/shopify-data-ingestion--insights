"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Database, Shield, TrendingUp, Zap, Globe } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Shopify Analytics Dashboard
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Multi-tenant analytics platform for Shopify stores with real-time insights, 
                revenue tracking, and customer analytics.
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="text-lg px-8">
                  Get Started
                </Button>
              </Link>
              <Link href="/documentation">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  View Docs
                </Button>
              </Link>
            </div>

            {/* Demo Video Placeholder */}
            <div className="mt-12 max-w-4xl mx-auto">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-2xl border-4 border-white dark:border-gray-900 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <BarChart3 className="h-20 w-20 mx-auto text-blue-600" />
                  <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                    Dashboard Demo Video
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Live demo showcasing real-time analytics and insights
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Everything you need to analyze your Shopify store performance
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-blue-500 transition-colors">
            <CardHeader>
              <Database className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Multi-Tenant Architecture</CardTitle>
              <CardDescription>
                Complete data isolation per tenant with secure, scalable infrastructure
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-500 transition-colors">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Real-Time Analytics</CardTitle>
              <CardDescription>
                Track revenue, orders, and customer metrics with interactive charts
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-500 transition-colors">
            <CardHeader>
              <Shield className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Secure Authentication</CardTitle>
              <CardDescription>
                Enterprise-grade security with Better Auth and encrypted data storage
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-500 transition-colors">
            <CardHeader>
              <Zap className="h-12 w-12 text-yellow-600 mb-4" />
              <CardTitle>High Performance</CardTitle>
              <CardDescription>
                Optimized queries with pagination, filtering, and efficient data loading
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-500 transition-colors">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-red-600 mb-4" />
              <CardTitle>Rich Visualizations</CardTitle>
              <CardDescription>
                Beautiful charts and graphs powered by Recharts for data insights
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-500 transition-colors">
            <CardHeader>
              <Globe className="h-12 w-12 text-indigo-600 mb-4" />
              <CardTitle>RESTful API</CardTitle>
              <CardDescription>
                Complete API with filtering, pagination, and comprehensive documentation
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="bg-white dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built With Modern Technologies</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Leveraging the best tools for performance and developer experience
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "Next.js 15", desc: "React Framework" },
              { name: "Turso", desc: "SQLite Database" },
              { name: "Drizzle ORM", desc: "Type-safe queries" },
              { name: "Better Auth", desc: "Authentication" },
              { name: "Recharts", desc: "Data visualization" },
              { name: "TailwindCSS", desc: "Styling" },
              { name: "shadcn/ui", desc: "UI Components" },
              { name: "TypeScript", desc: "Type safety" },
            ].map((tech) => (
              <div key={tech.name} className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <p className="font-bold text-lg mb-1">{tech.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
          <CardHeader className="text-center space-y-4 py-12">
            <CardTitle className="text-4xl font-bold">Ready to Get Started?</CardTitle>
            <CardDescription className="text-xl text-blue-100">
              Create an account and start analyzing your Shopify store data today
            </CardDescription>
            <div className="pt-4">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>© 2024 Shopify Analytics Dashboard. Built with Next.js and Turso.</p>
          </div>
        </div>
      </div>
    </div>
  );
}