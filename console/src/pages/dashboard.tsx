import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Shield,
  Activity,
  FileText,
  AlertTriangle,
} from "lucide-react";

export function Dashboard() {
  const [aclRules, setAclRules] = useState<any>([]);
  const [servers, setServers] = useState<any>([]);

  const addAclRule = (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newRule = {
      sourceIp: formData.get("sourceIp"),
      action: formData.get("action"),
      port: formData.get("port"),
      server: formData.get("server"),
    };
    setAclRules([...aclRules, newRule]);
    event.target.reset();
  };

  const addServer = (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newServer = {
      name: formData.get("serverName"),
      ip: formData.get("serverIp"),
    };
    setServers([...servers, newServer]);
    event.target.reset();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        NetGuardX - Application Firewall Console
      </h1>
      <Tabs defaultValue="acl">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="acl">ACL Configuration</TabsTrigger>
          <TabsTrigger value="servers">Server Management</TabsTrigger>
          <TabsTrigger value="visualize">Traffic Visualization</TabsTrigger>
          <TabsTrigger value="monitor">Traffic Monitoring</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="acl">
          <Card>
            <CardHeader>
              <CardTitle>Define ACL Properties</CardTitle>
              <CardDescription>
                Set up access control list rules for your firewall.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addAclRule} className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sourceIp">Source IP</Label>
                    <Input
                      id="sourceIp"
                      name="sourceIp"
                      placeholder="e.g. 192.168.1.1"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="action">Action</Label>
                    <Select name="action" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="allow">Allow</SelectItem>
                        <SelectItem value="deny">Deny</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="port">Port</Label>
                    <Input
                      id="port"
                      name="port"
                      type="number"
                      placeholder="e.g. 80"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="server">Server</Label>
                    <Select name="server" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select server" />
                      </SelectTrigger>
                      <SelectContent>
                        {servers.map((server: any, index: any) => (
                          <SelectItem key={index} value={server.name}>
                            {server.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit">Add Rule</Button>
              </form>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">
                  Current ACL Rules
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source IP</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Port</TableHead>
                      <TableHead>Server</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {aclRules.map((rule: any, index: any) => (
                      <TableRow key={index}>
                        <TableCell>{rule.sourceIp}</TableCell>
                        <TableCell>{rule.action}</TableCell>
                        <TableCell>{rule.port}</TableCell>
                        <TableCell>{rule.server}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="servers">
          <Card>
            <CardHeader>
              <CardTitle>Server Management</CardTitle>
              <CardDescription>
                Manage servers proxied by the application firewall.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addServer} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serverName">Server Name</Label>
                    <Input
                      id="serverName"
                      name="serverName"
                      placeholder="e.g. Web Server 1"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serverIp">Server IP</Label>
                    <Input
                      id="serverIp"
                      name="serverIp"
                      placeholder="e.g. 10.0.0.1"
                      required
                    />
                  </div>
                </div>
                <Button type="submit">Add Server</Button>
              </form>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Proxied Servers</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Server Name</TableHead>
                      <TableHead>Server IP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {servers.map((server: any, index: any) => (
                      <TableRow key={index}>
                        <TableCell>{server.name}</TableCell>
                        <TableCell>{server.ip}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="visualize">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Visualization</CardTitle>
              <CardDescription>
                Visual representation of network traffic using Grafana.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full aspect-[2/1] bg-muted rounded-lg flex items-center justify-center">
                <BarChart className="w-16 h-16 text-muted-foreground" />
                <span className="sr-only">Grafana dashboard placeholder</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Punjabi bois will implement this soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="monitor">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Monitoring</CardTitle>
              <CardDescription>
                Real-time traffic monitoring and alerts using Prometheus.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Shield className="w-6 h-6 text-green-500" />
                    <span>Firewall Status: Active</span>
                  </div>
                  <Activity className="w-6 h-6 text-blue-500" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Total Requests</h4>
                    <p className="text-2xl">1,234,567</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Blocked Requests</h4>
                    <p className="text-2xl text-red-500">23,456</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">
                      Average Response Time
                    </h4>
                    <p className="text-2xl">150ms</p>
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Recent Activity</h4>
                  <ul className="space-y-2">
                    <li>192.168.1.100 - Blocked - Port 80 - Web Server 1</li>
                    <li>10.0.0.5 - Allowed - Port 443 - Web Server 2</li>
                    <li>
                      172.16.0.1 - Rate Limited - Port 22 - Database Server
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Prometheus Alerts</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />{" "}
                      High CPU Usage on Web Server 1
                    </li>
                    <li className="flex items-center">
                      <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />{" "}
                      Excessive Failed Login Attempts
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Report Generator</CardTitle>
              <CardDescription>
                Generate and download firewall activity reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reportType">Report Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily Summary</SelectItem>
                        <SelectItem value="weekly">Weekly Analysis</SelectItem>
                        <SelectItem value="monthly">
                          Monthly Overview
                        </SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="format">Format</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="w-full">Generate Report</Button>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Recent Reports</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Daily Summary - 2023-05-22.pdf
                    </li>
                    <li className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Weekly Analysis - 2023-W20.csv
                    </li>
                    <li className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Monthly Overview - 2023-04.json
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
