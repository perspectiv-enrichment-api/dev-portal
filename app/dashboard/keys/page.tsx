"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockAPIKeys, mockUsageLogs } from "@/lib/mock-data";
import {
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export default function APIKeysPage() {
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const maskKey = (key: string) => {
    return key.slice(0, 7) + "..." + key.slice(-4);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getKeyUsage = (keyId: string) => {
    return mockUsageLogs.filter((log) => log.apiKeyId === keyId).length;
  };

  const generateKey = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let key = "pk_live_";
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  const handleCreateKey = () => {
    if (newKeyName.trim()) {
      setGeneratedKey(generateKey());
      setShowKey(true);
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCloseDialog = () => {
    setCreateDialogOpen(false);
    setNewKeyName("");
    setGeneratedKey("");
    setShowKey(false);
    setCopied(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">API Keys</h1>
          <p className="text-muted-foreground">
            Manage your API credentials and access tokens
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create New Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Enter a name for your new API key
              </DialogDescription>
            </DialogHeader>
            {!showKey ? (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="keyName">Key Name</Label>
                  <Input
                    id="keyName"
                    placeholder="e.g., Production API Key"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateKey();
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-600 mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-medium">API Key Generated</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Copy this key now. You will not be able to see it again.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Your API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      value={generatedKey}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyKey}
                      className={copied ? "text-green-600" : ""}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              {!showKey ? (
                <>
                  <Button variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateKey}
                    disabled={!newKeyName.trim()}
                  >
                    Generate Key
                  </Button>
                </>
              ) : (
                <Button onClick={handleCloseDialog}>Done</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* API Keys List */}
      <div className="space-y-4">
        {mockAPIKeys.map((apiKey) => (
          <Card
            key={apiKey.id}
            className={`bg-card/50 backdrop-blur border-border ${apiKey.status === "inactive" ? "opacity-60" : ""}`}
          >
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Header Row */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-foreground">
                        {apiKey.name}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          apiKey.status === "active"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {apiKey.status === "active" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {apiKey.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Created{" "}
                      {new Date(apiKey.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {getKeyUsage(apiKey.id)} API calls this month
                    </div>
                  </div>
                </div>

                {/* Key Display */}
                <div className="bg-background/50 border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 font-mono text-sm">
                      {visibleKeys.has(apiKey.id) ? (
                        <span className="text-accent">{apiKey.key}</span>
                      ) : (
                        <span className="text-muted-foreground">
                          {maskKey(apiKey.key)}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {visibleKeys.has(apiKey.id) ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(apiKey.key)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Rate Limit
                    </p>
                    <p className="font-semibold text-foreground">
                      {apiKey.rateLimit.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Last Used
                    </p>
                    <p className="font-semibold text-foreground">
                      {new Date(apiKey.lastUsed).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Created
                    </p>
                    <p className="font-semibold text-foreground">
                      {new Date(apiKey.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Integration Example */}
      <Card className="bg-card/50 backdrop-blur border-border">
        <CardHeader>
          <CardTitle>How to use your API key</CardTitle>
          <CardDescription>
            Example request to the merchant enrichment endpoint
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-background/50 border border-border rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-muted-foreground font-mono whitespace-pre-wrap break-words">
              {`curl -X POST https://api.perspectiv.com/enrich \\
  -H "Authorization: Bearer pk_live_abc123xyz789def456" \\
  -H "Content-Type: application/json" \\
  -d '{
    "merchant_name": "Amazon"
  }'

# Response:
{
  "id": "merchant_1",
  "name": "Amazon",
  "logo": "https://logo.clearbit.com/amazon.com",
  "industry": "E-commerce",
  "country": "US",
  "website": "amazon.com"
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
