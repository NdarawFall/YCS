"use client";

import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Notifications() {
  // TODO: Fetch invitations from database
  const invitations: any[] = [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-white">
          <Bell className="h-5 w-5" />
          {invitations.length > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {invitations.length === 0 ? (
          <DropdownMenuItem disabled>Aucune invitation</DropdownMenuItem>
        ) : (
          invitations.map((inv: any) => (
            <DropdownMenuItem key={inv.id}>
              Invitation pour {inv.workspace_name} en tant que {inv.role}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
