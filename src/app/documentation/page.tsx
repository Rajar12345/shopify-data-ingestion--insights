"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Code, Database, Zap, Shield, Globe, TrendingUp } from "lucide-react";

export default function DocumentationPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Documentation</h2>
          <p className="text-muted-foreground">
            Complete guide to the Shopify Analytics Dashboard
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="api">API Endpoints</TabsTrigger>
            <TabsTrigger value="data-models">Data Models</TabsTrigger>
            <TabsTrigger value="production">Production Roadmap</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
                <CardDescription>
                  A comprehensive multi-tenant analytics dashboard for Shopify stores
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">
                        <Shield className="h-3 w-3 mr-1" />
                        Auth
                      </Badge>
                      <span>Secure email/password authentication with Better Auth</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">
                        <Database className="h-3 w-3 mr-1" />
                        Multi-tenant
                      </Badge>
                      <span>Complete data isolation per tenant with tenant-scoped queries</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Analytics
                      </Badge>
                      <span>Real-time metrics, revenue trends, and customer insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">
                        <Zap className="h-3 w-3 mr-1" />
                        Performance
                      </Badge>
                      <span>Optimized queries with pagination and filtering</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Tech Stack</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium">Frontend</p>
                      <p className="text-sm text-muted-foreground">Next.js 15, React, TailwindCSS</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium">Backend</p>
                      <p className="text-sm text-muted-foreground">Next.js API Routes</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium">Database</p>
                      <p className="text-sm text-muted-foreground">Turso (SQLite), Drizzle ORM</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium">Auth</p>
                      <p className="text-sm text-muted-foreground">Better Auth</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium">Charts</p>
                      <p className="text-sm text-muted-foreground">Recharts</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium">UI Components</p>
                      <p className="text-sm text-muted-foreground">shadcn/ui</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="architecture" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Architecture</CardTitle>
                <CardDescription>Multi-tenant architecture with data isolation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Architecture Diagram</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border-2 border-dashed">
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-4">
                        <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg text-center">
                          <Globe className="h-8 w-8 mx-auto mb-2" />
                          <p className="font-semibold">Client</p>
                          <p className="text-xs">Next.js Frontend</p>
                        </div>
                        <div className="text-2xl">→</div>
                        <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg text-center">
                          <Code className="h-8 w-8 mx-auto mb-2" />
                          <p className="font-semibold">API Layer</p>
                          <p className="text-xs">Next.js Routes</p>
                        </div>
                        <div className="text-2xl">→</div>
                        <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-lg text-center">
                          <Database className="h-8 w-8 mx-auto mb-2" />
                          <p className="font-semibold">Database</p>
                          <p className="text-xs">Turso SQLite</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Multi-Tenant Design</h3>
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Tenant Isolation</h4>
                      <p className="text-sm text-muted-foreground">
                        All data access requires a tenantId parameter, ensuring complete data isolation between stores.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Data Structure</h4>
                      <p className="text-sm text-muted-foreground">
                        Tenants → Customers, Products, Orders (each linked via foreign key)
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Security</h4>
                      <p className="text-sm text-muted-foreground">
                        All API endpoints validate tenant access and enforce row-level security through query filters.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Key Assumptions</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">•</span>
                      <span>Each tenant represents a separate Shopify store</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">•</span>
                      <span>Data syncs are handled via API ingestion (webhook support planned)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">•</span>
                      <span>SQLite (Turso) provides sufficient scalability for demo/MVP</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400">•</span>
                      <span>Authentication is per-platform, not per-tenant (admin access)</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
                <CardDescription>Complete REST API documentation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Tenants API</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border font-mono text-sm">
                      <Badge variant="default" className="mr-2">GET</Badge>
                      /api/tenants
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border font-mono text-sm">
                      <Badge variant="default" className="mr-2">GET</Badge>
                      /api/tenants?id=[id]
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border font-mono text-sm">
                      <Badge variant="secondary" className="mr-2">POST</Badge>
                      /api/tenants
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border font-mono text-sm">
                      <Badge variant="outline" className="mr-2">PUT</Badge>
                      /api/tenants?id=[id]
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border font-mono text-sm">
                      <Badge variant="destructive" className="mr-2">DELETE</Badge>
                      /api/tenants?id=[id]
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Customers API</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border">
                      <div className="font-mono text-sm mb-2">
                        <Badge variant="default" className="mr-2">GET</Badge>
                        /api/customers?tenantId=[id]
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Required: tenantId | Optional: limit, offset, search
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border">
                      <div className="font-mono text-sm mb-2">
                        <Badge variant="secondary" className="mr-2">POST</Badge>
                        /api/customers
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Body: tenantId, shopifyCustomerId, email, firstName, lastName
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Orders API</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border">
                      <div className="font-mono text-sm mb-2">
                        <Badge variant="default" className="mr-2">GET</Badge>
                        /api/orders?tenantId=[id]
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Required: tenantId | Optional: customerId, status, startDate, endDate, limit, offset
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border">
                      <div className="font-mono text-sm mb-2">
                        <Badge variant="secondary" className="mr-2">POST</Badge>
                        /api/orders
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Body: tenantId, shopifyOrderId, customerId, totalPrice, status, orderDate
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Products API</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border">
                      <div className="font-mono text-sm mb-2">
                        <Badge variant="default" className="mr-2">GET</Badge>
                        /api/products?tenantId=[id]
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Required: tenantId | Optional: search, minPrice, maxPrice, limit, offset
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border">
                      <div className="font-mono text-sm mb-2">
                        <Badge variant="secondary" className="mr-2">POST</Badge>
                        /api/products
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Body: tenantId, shopifyProductId, title, price, inventory
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data-models" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Database Schema</CardTitle>
                <CardDescription>Complete data model structure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Tenants</h3>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded border font-mono text-sm space-y-1">
                    <div>id: integer (PK, auto-increment)</div>
                    <div>name: text</div>
                    <div>shopifyDomain: text (unique)</div>
                    <div>shopifyAccessToken: text</div>
                    <div>createdAt: timestamp</div>
                    <div>updatedAt: timestamp</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Customers</h3>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded border font-mono text-sm space-y-1">
                    <div>id: integer (PK, auto-increment)</div>
                    <div>tenantId: integer (FK → tenants.id)</div>
                    <div>shopifyCustomerId: text</div>
                    <div>email: text</div>
                    <div>firstName: text</div>
                    <div>lastName: text</div>
                    <div>totalSpent: real (default: 0)</div>
                    <div>ordersCount: integer (default: 0)</div>
                    <div>createdAt: timestamp</div>
                    <div>updatedAt: timestamp</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Orders</h3>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded border font-mono text-sm space-y-1">
                    <div>id: integer (PK, auto-increment)</div>
                    <div>tenantId: integer (FK → tenants.id)</div>
                    <div>shopifyOrderId: text</div>
                    <div>customerId: integer (FK → customers.id)</div>
                    <div>totalPrice: real</div>
                    <div>status: text (pending|processing|completed|cancelled|refunded)</div>
                    <div>orderDate: timestamp</div>
                    <div>createdAt: timestamp</div>
                    <div>updatedAt: timestamp</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Products</h3>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded border font-mono text-sm space-y-1">
                    <div>id: integer (PK, auto-increment)</div>
                    <div>tenantId: integer (FK → tenants.id)</div>
                    <div>shopifyProductId: text</div>
                    <div>title: text</div>
                    <div>price: real</div>
                    <div>inventory: integer (default: 0)</div>
                    <div>createdAt: timestamp</div>
                    <div>updatedAt: timestamp</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="production" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Productionization Roadmap</CardTitle>
                <CardDescription>Steps to make this production-ready</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Phase 1: Core Infrastructure</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400">✓</span>
                      <span>Multi-tenant database architecture with Turso</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400">✓</span>
                      <span>Authentication with Better Auth</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400">✓</span>
                      <span>RESTful API with pagination and filtering</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">○</span>
                      <span>Rate limiting and API throttling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">○</span>
                      <span>Comprehensive error handling and logging</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Phase 2: Shopify Integration</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">○</span>
                      <span>Shopify OAuth flow for secure store connection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">○</span>
                      <span>Webhook handlers for real-time data sync (orders, customers, products)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">○</span>
                      <span>Initial data import via Shopify Admin API</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">○</span>
                      <span>Webhook signature verification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">○</span>
                      <span>Background job queue for bulk imports (BullMQ/Redis)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Phase 3: Performance & Scale</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">○</span>
                      <span>Database indexing on tenantId and foreign keys</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">○</span>
                      <span>Redis caching for frequently accessed data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">○</span>
                      <span>Database connection pooling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">○</span>
                      <span>CDN for static assets (Cloudflare/Vercel Edge)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">○</span>
                      <span>API response compression</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Phase 4: Security & Compliance</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">○</span>
                      <span>Role-based access control (RBAC)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">○</span>
                      <span>API key management for programmatic access</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">○</span>
                      <span>Audit logging for all data modifications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">○</span>
                      <span>GDPR compliance (data export, deletion)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">○</span>
                      <span>Security headers and CORS policies</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Phase 5: Monitoring & DevOps</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">○</span>
                      <span>Application monitoring (Sentry, DataDog)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">○</span>
                      <span>Database query performance monitoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">○</span>
                      <span>Automated backups and disaster recovery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">○</span>
                      <span>CI/CD pipeline with automated testing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">○</span>
                      <span>Health check endpoints and uptime monitoring</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Phase 6: Enhanced Features</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">○</span>
                      <span>Advanced analytics (cohort analysis, LTV predictions)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">○</span>
                      <span>Email alerts for key metrics thresholds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">○</span>
                      <span>Custom dashboard widgets and reports</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">○</span>
                      <span>Data export in multiple formats (CSV, PDF, Excel)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">○</span>
                      <span>Mobile app for on-the-go analytics</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
