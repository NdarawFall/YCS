"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  Mail,
  ChevronRight,
  Trash2,
  X,
  Crown,
  Clock,
  Sparkles,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar";
import {
  saveTeamName,
  inviteMembers,
  removeMember,
  cancelInvitation,
} from "@/app/workspace/actions";
import { ASSIGNABLE_ROLES, MAX_TEAM_SIZE, OWNER_ROLE } from "@/app/workspace/team-config";

export interface TeamMemberView {
  id: string;
  role: string;
  fullName: string;
  avatarUrl?: string | null;
}

export interface PendingInvitationView {
  id: string;
  email: string;
  role: string;
}

interface TeamDialogProps {
  workspaceId: string;
  /** null quand aucune équipe n'existe encore sur le workspace */
  teamName: string | null;
  members: TeamMemberView[];
  pending: PendingInvitationView[];
  isOwner: boolean;
  isPremium: boolean;
}

interface InviteRow {
  email: string;
  role: string;
}

const FIELD_STYLE = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
} as const;

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function TeamDialog({
  workspaceId,
  teamName,
  members,
  pending,
  isOwner,
  isPremium,
}: TeamDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(teamName ?? "Équipe Principale");
  const [rows, setRows] = useState<InviteRow[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const used = members.length + pending.length;
  const remaining = Math.max(0, MAX_TEAM_SIZE - used);
  const isFull = remaining === 0;

  const resetFeedback = () => {
    setError(null);
    setNotice(null);
  };

  const addRow = () => {
    resetFeedback();
    setRows((current) => [...current, { email: "", role: "Monteur" }]);
  };

  const updateRow = (index: number, patch: Partial<InviteRow>) => {
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const removeRow = (index: number) => {
    setRows((current) => current.filter((_, i) => i !== index));
  };

  const handleSaveName = async () => {
    resetFeedback();
    setBusy("name");
    const res = await saveTeamName(workspaceId, name);
    if (res?.error) setError(res.error);
    else setNotice(teamName ? "Nom de l'équipe enregistré." : "Équipe créée.");
    setBusy(null);
  };

  const handleInvite = async () => {
    resetFeedback();
    setBusy("invite");
    const res = await inviteMembers(workspaceId, rows);

    if (res?.error) {
      setError(res.error);
    } else {
      setRows([]);
      const failed = res?.failed ?? [];
      setNotice(
        failed.length > 0
          ? `${res?.sent ?? 0} invitation(s) envoyée(s). Échec de l'email pour : ${failed.join(", ")} — l'invitation reste en attente.`
          : `${res?.sent ?? 0} invitation(s) envoyée(s).`
      );
    }
    setBusy(null);
  };

  const handleRemoveMember = async (memberId: string) => {
    resetFeedback();
    setBusy(`member-${memberId}`);
    const res = await removeMember(workspaceId, memberId);
    if (res?.error) setError(res.error);
    setBusy(null);
  };

  const handleCancelInvitation = async (invitationId: string) => {
    resetFeedback();
    setBusy(`invite-${invitationId}`);
    const res = await cancelInvitation(workspaceId, invitationId);
    if (res?.error) setError(res.error);
    setBusy(null);
  };

  const visibleAvatars = members.slice(0, 3);
  const hiddenAvatars = members.length - visibleAvatars.length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] py-2 pr-2.5 pl-3 transition-all hover:border-white/20 hover:bg-white/[0.07] active:scale-[0.98] cursor-pointer"
          >
            {members.length > 0 ? (
              <AvatarGroup>
                {visibleAvatars.map((member) => (
                  <Avatar key={member.id} size="sm">
                    {member.avatarUrl ? <AvatarImage src={member.avatarUrl} alt={member.fullName} /> : null}
                    <AvatarFallback className="bg-white/10 text-white text-[10px] font-bold">
                      {initials(member.fullName) || "?"}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {hiddenAvatars > 0 && (
                  <AvatarGroupCount className="bg-white/10 text-[10px] font-bold text-white">
                    +{hiddenAvatars}
                  </AvatarGroupCount>
                )}
              </AvatarGroup>
            ) : (
              <span className="flex size-6 items-center justify-center rounded-full bg-red-600/15 text-red-400">
                <Users className="size-3.5" />
              </span>
            )}

            <span className="flex flex-col items-start gap-0.5 leading-none">
              <span className="text-sm font-bold text-white">{teamName ?? "Créer une équipe"}</span>
              <span className="text-[11px] font-medium text-muted-foreground">
                {teamName ? `${used}/${MAX_TEAM_SIZE} personnes` : "Aucune équipe"}
              </span>
            </span>

            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        }
      />

      <DialogContent
        className="sm:max-w-[540px] border-0 p-0 overflow-hidden"
        style={{
          background: "rgba(10, 10, 20, 0.97)",
          backdropFilter: "blur(24px)",
          boxShadow:
            "0 25px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06), 0 0 60px rgba(255,0,0,0.05)",
        }}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-lg shadow-red-600/30"
              style={{ background: "linear-gradient(135deg, #ff0000, #880000)" }}
            >
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-xl font-extrabold text-white tracking-tight">
                {teamName ? "Votre équipe" : "Créer une équipe"}
              </DialogTitle>
              <DialogDescription className="text-sm text-white/40 mt-0.5">
                {teamName
                  ? `${used} personne${used > 1 ? "s" : ""} sur ${MAX_TEAM_SIZE} — invitations comprises`
                  : `Nommez votre équipe, puis invitez jusqu'à ${MAX_TEAM_SIZE} personnes`}
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="max-h-[65vh] overflow-y-auto custom-scrollbar px-6 py-5 space-y-6">
          {/* 1. Nom de l'équipe */}
          <div className="space-y-2">
            <Label htmlFor="team-name" className="text-xs font-semibold text-white/60 uppercase tracking-wider">
              Nom de l&apos;équipe
            </Label>
            <div className="flex gap-2">
              <Input
                id="team-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Équipe Principale"
                disabled={!isOwner}
                className="h-11 flex-1 rounded-xl text-white placeholder:text-white/25 font-medium"
                style={FIELD_STYLE}
              />
              {isOwner && (
                <Button
                  onClick={handleSaveName}
                  disabled={busy !== null || !name.trim() || name.trim() === teamName}
                  className="h-11 shrink-0 rounded-xl px-4 font-bold text-white border-0"
                  style={{ background: "linear-gradient(135deg, #ff0000, #cc0000)" }}
                >
                  {busy === "name" ? (
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : teamName ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    "Créer"
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* 2. Membres */}
          {members.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                Membres ({members.length})
              </Label>
              <div className="space-y-2">
                {members.map((member) => {
                  const isTeamLead = member.role === OWNER_ROLE;
                  return (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 rounded-xl p-3"
                      style={FIELD_STYLE}
                    >
                      <Avatar size="sm">
                        {member.avatarUrl ? <AvatarImage src={member.avatarUrl} alt={member.fullName} /> : null}
                        <AvatarFallback className="bg-white/10 text-white text-[10px] font-bold">
                          {initials(member.fullName) || "?"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-white">{member.fullName}</div>
                        <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                          {isTeamLead && <Crown className="size-3 text-amber-400" />}
                          {member.role}
                        </div>
                      </div>

                      {isOwner && !isTeamLead && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleRemoveMember(member.id)}
                          disabled={busy !== null}
                          title="Retirer du projet"
                          className="shrink-0 text-muted-foreground hover:text-red-400"
                        >
                          {busy === `member-${member.id}` ? (
                            <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          ) : (
                            <Trash2 className="size-3.5" />
                          )}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Invitations en attente */}
          {pending.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                En attente ({pending.length})
              </Label>
              <div className="space-y-2">
                {pending.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="flex items-center gap-3 rounded-xl border border-dashed p-3"
                    style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.10)" }}
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                      <Clock className="size-3" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-white/80">{invitation.email}</div>
                      <div className="text-[11px] font-medium text-muted-foreground">{invitation.role}</div>
                    </div>
                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleCancelInvitation(invitation.id)}
                        disabled={busy !== null}
                        title="Annuler l'invitation"
                        className="shrink-0 text-muted-foreground hover:text-red-400"
                      >
                        {busy === `invite-${invitation.id}` ? (
                          <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        ) : (
                          <X className="size-3.5" />
                        )}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Ajouter des invitations */}
          {isOwner && (
            <div className="space-y-3 border-t border-white/5 pt-5">
              {!isPremium ? (
                <div
                  className="flex items-start gap-3 rounded-xl p-4"
                  style={{ background: "rgba(255,0,0,0.06)", border: "1px solid rgba(255,0,0,0.12)" }}
                >
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  <div>
                    <p className="text-sm font-bold text-white">Inviter des collaborateurs</p>
                    <p className="mt-1 text-xs leading-relaxed text-red-300">
                      L&apos;invitation de collaborateurs est réservée au plan Premium. Passez au Premium pour
                      déléguer le montage, la voix off ou les miniatures.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Inviter des collaborateurs
                    </Label>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
                      {used}/{MAX_TEAM_SIZE}
                    </span>
                  </div>

                  {rows.map((row, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="email"
                        value={row.email}
                        onChange={(e) => updateRow(index, { email: e.target.value })}
                        placeholder="collaborateur@email.com"
                        className="h-11 flex-1 rounded-xl text-white placeholder:text-white/25 font-medium"
                        style={FIELD_STYLE}
                      />
                      <Select
                        value={row.role}
                        onValueChange={(value) => value && updateRow(index, { role: String(value) })}
                      >
                        <SelectTrigger className="h-11 w-[140px] shrink-0 rounded-xl" style={FIELD_STYLE}>
                          <SelectValue placeholder="Rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          {ASSIGNABLE_ROLES.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeRow(index)}
                        disabled={busy !== null}
                        title="Retirer cette ligne"
                        className="h-11 shrink-0 text-muted-foreground hover:text-red-400"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    onClick={addRow}
                    disabled={busy !== null || rows.length >= remaining}
                    className="h-10 w-full rounded-xl border-dashed font-semibold"
                  >
                    <Plus className="mr-1.5 h-4 w-4" />
                    {isFull
                      ? `Équipe complète (${MAX_TEAM_SIZE} max)`
                      : rows.length >= remaining
                        ? `Plus que ${remaining} place${remaining > 1 ? "s" : ""}`
                        : "Ajouter une invitation"}
                  </Button>
                </>
              )}
            </div>
          )}

          {error && (
            <div
              className="rounded-xl p-3 text-xs font-medium text-red-400"
              style={{ background: "rgba(255,0,0,0.08)", border: "1px solid rgba(255,0,0,0.15)" }}
            >
              {error}
            </div>
          )}

          {notice && (
            <div
              className="rounded-xl p-3 text-xs font-medium text-emerald-400"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}
            >
              {notice}
            </div>
          )}
        </div>

        {/* Footer */}
        {isOwner && isPremium && rows.length > 0 && (
          <div className="px-6 pb-6 pt-1">
            <Button
              onClick={handleInvite}
              disabled={busy !== null || rows.every((row) => !row.email.trim())}
              className="h-12 w-full rounded-xl border-0 text-base font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              style={{
                background: busy === "invite" ? "rgba(255,0,0,0.4)" : "linear-gradient(135deg, #ff0000, #cc0000)",
                boxShadow: "0 8px 30px rgba(255,0,0,0.3)",
              }}
            >
              {busy === "invite" ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Envoi en cours...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Envoyer {rows.length} invitation{rows.length > 1 ? "s" : ""}
                </span>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
