"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DollarSign, ShoppingCart, Users, Package, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

type Customer = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  totalSpent: number;
  ordersCount: number;
};

type Order = {
  id: number;
  totalPrice: number;
  status: string;
  orderDate: string;
};

type Metrics = {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  avgOrderValue: number;
};

export default function DashboardPage() {
  const [tenantId, setTenantId] = useState("1");
  const [tenants, setTenants] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [topCustomers, setTopCustomers] = useState<Customer[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState("30");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTenants();
  }, []);

  useEffect(() => {
    if (tenantId) {
      fetchDashboardData();
    }
  }, [tenantId, dateRange]);

  const fetchTenants = async () => {
    try {
      const response = await fetch("/api/tenants");
      const data = await response.json();
      setTenants(data);
      if (data.length > 0) {
        setTenantId(data[0].id.toString());
      }
    } catch (error) {
      console.error("Error fetching tenants:", error);
    }
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const days = parseInt(dateRange);
      const startDate = format(subMonths(new Date(), days === 30 ? 1 : days === 90 ? 3 : 12), "yyyy-MM-dd");
      const endDate = format(new Date(), "yyyy-MM-dd");

      const [customersRes, ordersRes] = await Promise.all([
        fetch(`/api/customers?tenantId=${tenantId}&limit=1000`),
        fetch(`/api/orders?tenantId=${tenantId}&limit=1000&startDate=${startDate}&endDate=${endDate}`)
      ]);

      const customers = await customersRes.json();
      const orders = await ordersRes.json();

      // Calculate metrics
      const totalRevenue = orders.reduce((sum: number, order: Order) => 
        order.status === "completed" ? sum + order.totalPrice : sum, 0
      );
      const totalOrders = orders.filter((o: Order) => o.status === "completed").length;
      const totalCustomers = customers.length;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      setMetrics({
        totalRevenue,
        totalOrders,
        totalCustomers,
        avgOrderValue
      });

      // Top 5 customers by spend
      const sorted = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);
      setTopCustomers(sorted);

      // Revenue over time
      const revenueByMonth = orders.reduce((acc: any, order: Order) => {
        if (order.status === "completed") {
          const month = format(new Date(order.orderDate), "MMM yyyy");
          acc[month] = (acc[month] || 0) + order.totalPrice;
        }
        return acc;
      }, {});

      const revenueChart = Object.entries(revenueByMonth).map(([month, revenue]) => ({
        month,
        revenue: Number((revenue as number).toFixed(2))
      }));

      setRevenueData(revenueChart);

      // Orders by status
      const ordersByStatus = orders.reduce((acc: any, order: Order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});

      const ordersChart = Object.entries(ordersByStatus).map(([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count
      }));

      setOrdersData(ordersChart);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex gap-4">
            <Select value={tenantId} onValueChange={setTenantId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select tenant" />
              </SelectTrigger>
              <SelectContent>
                {tenants.map((tenant) => (
                  <SelectItem key={tenant.id} value={tenant.id.toString()}>
                    {tenant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${metrics?.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.totalCustomers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${metrics?.avgOrderValue.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
              <CardDescription>Monthly revenue trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orders by Status</CardTitle>
              <CardDescription>Order distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ordersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Customers by Spend</CardTitle>
            <CardDescription>Highest spending customers</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      {customer.firstName} {customer.lastName}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell className="text-right">{customer.ordersCount}</TableCell>
                    <TableCell className="text-right font-semibold">
                      ${customer.totalSpent.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
