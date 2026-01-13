"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Mail,
  MoreVertical,
  Shield,
  UserCog,
  Eye,
  Trash2,
  Crown,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock team data
const teamMembers = [
  {
    id: "1",
    name: "Ade Creator",
    email: "ade@afrocreate.ai",
    avatar: "",
    role: "admin" as const,
    status: "active",
    joinedAt: "2024-01-15",
    contentCount: 45,
  },
  {
    id: "2",
    name: "Chioma Okafor",
    email: "chioma@company.com",
    avatar: "",
    role: "editor" as const,
    status: "active",
    joinedAt: "2024-02-20",
    contentCount: 23,
  },
  {
    id: "3",
    name: "Emeka Nnamdi",
    email: "emeka@company.com",
    avatar: "",
    role: "editor" as const,
    status: "active",
    joinedAt: "2024-03-10",
    contentCount: 18,
  },
  {
    id: "4",
    name: "Funke Adeyemi",
    email: "funke@company.com",
    avatar: "",
    role: "viewer" as const,
    status: "pending",
    joinedAt: "2024-04-05",
    contentCount: 0,
  },
];

const roleConfig = {
  admin: {
    label: "Admin",
    icon: Crown,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    description: "Full access to all features and settings",
  },
  editor: {
    label: "Editor",
    icon: UserCog,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    description: "Can create, edit, and publish content",
  },
  viewer: {
    label: "Viewer",
    icon: Eye,
    color: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
    description: "Can view content and analytics",
  },
};

export default function TeamPage() {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState<"admin" | "editor" | "viewer">("editor");

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInvite = () => {
    // Handle invite logic
    console.log("Inviting:", inviteEmail, inviteRole);
    setIsInviteDialogOpen(false);
    setInviteEmail("");
    setInviteRole("editor");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Team</h1>
          <p className="text-muted-foreground mt-1">
            Manage your team members and their permissions.
          </p>
        </div>
        <Button variant="gradient" onClick={() => setIsInviteDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{teamMembers.length}</p>
              <p className="text-sm text-muted-foreground">Team Members</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10">
              <Shield className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {teamMembers.filter((m) => m.role === "admin").length}
              </p>
              <p className="text-sm text-muted-foreground">Admins</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10">
              <Mail className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {teamMembers.filter((m) => m.status === "pending").length}
              </p>
              <p className="text-sm text-muted-foreground">Pending Invites</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <Input
          placeholder="Search team members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="h-4 w-4" />}
          className="max-w-sm"
        />
      </div>

      {/* Team Members List */}
      <GlassCard>
        <div className="divide-y">
          {filteredMembers.map((member, index) => {
            const RoleIcon = roleConfig[member.role].icon;
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{member.name}</p>
                    {member.status === "pending" && (
                      <Badge variant="warning">Pending</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium">{member.contentCount} content</p>
                  <p className="text-xs text-muted-foreground">
                    Joined {new Date(member.joinedAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge className={roleConfig[member.role].color}>
                  <RoleIcon className="h-3 w-3 mr-1" />
                  {roleConfig[member.role].label}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <UserCog className="h-4 w-4 mr-2" />
                      Change Role
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="h-4 w-4 mr-2" />
                      Resend Invite
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>

      {/* Role Permissions */}
      <GlassCard>
        <h3 className="font-semibold mb-4">Role Permissions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(roleConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <div key={key} className="p-4 rounded-xl bg-accent/30">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="font-medium">{config.label}</span>
                </div>
                <p className="text-sm text-muted-foreground">{config.description}</p>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Invite Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your team on AfroCreate.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={inviteRole}
                onValueChange={(v) => setInviteRole(v as typeof inviteRole)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {roleConfig[inviteRole].description}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="gradient" onClick={handleInvite} disabled={!inviteEmail}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

