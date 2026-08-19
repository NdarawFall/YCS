"use client";

import { useState } from "react";
import { Users, Plus, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTeam, inviteMember } from "@/app/workspace/actions";

interface TeamPanelProps {
  workspaceId: string;
}

export function TeamPanel({ workspaceId }: TeamPanelProps) {
  const [teamName, setTeamName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [role, setRole] = useState("Monteur");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateTeam = async () => {
    setIsLoading(true);
    await createTeam(workspaceId, teamName);
    setIsLoading(false);
  };

  const handleInvite = async () => {
    setIsLoading(true);
    await inviteMember(workspaceId, inviteEmail, role);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 p-6 glass rounded-3xl border border-border/40">
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6 text-purple-400" />
        <h2 className="text-xl font-bold text-white">Gestion de l'équipe</h2>
      </div>

      {/* Create Team Form */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-white/60">Créer une équipe</Label>
        <div className="flex gap-2">
          <Input 
            placeholder="Nom de l'équipe" 
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="rounded-xl"
          />
          <Button onClick={handleCreateTeam} disabled={isLoading || !teamName}>
            <Plus className="h-4 w-4 mr-2" /> Créer
          </Button>
        </div>
      </div>

      {/* Invite Member Form */}
      <div className="space-y-3 border-t border-white/5 pt-6">
        <Label className="text-sm font-medium text-white/60">Inviter un membre</Label>
        <div className="grid gap-2">
          <Input 
            type="email" 
            placeholder="Email du collaborateur" 
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="rounded-xl"
          />
          <Select onValueChange={(val) => val && setRole(val)} value={role}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Monteur">Monteur</SelectItem>
              <SelectItem value="Designer">Designer</SelectItem>
              <SelectItem value="Voix off">Voix off</SelectItem>
              <SelectItem value="Copywriter">Copywriter</SelectItem>
              <SelectItem value="Musicien">Musicien</SelectItem>
              <SelectItem value="Artiste 2D/3D">Artiste 2D/3D</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleInvite} disabled={isLoading || !inviteEmail} className="bg-purple-600 hover:bg-purple-700">
            <Mail className="h-4 w-4 mr-2" /> Envoyer invitation
          </Button>
        </div>
      </div>
    </div>
  );
}
