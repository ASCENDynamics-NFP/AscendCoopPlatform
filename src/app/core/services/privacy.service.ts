/***********************************************************************************************
 * Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
 * Copyright (C) 2023  ASCENDynamics NFP
 ***********************************************************************************************/
import {Injectable} from "@angular/core";

export interface SectionVisibilityContext {
  isOwnerOrAdmin: boolean;
  isRelated: boolean;
  viewerId?: string | null;
}

@Injectable({providedIn: "root"})
export class PrivacyService {
  private getSection(privacySettings: any, key: string): any {
    return privacySettings?.[key] || {};
  }

  getSectionVisibility(
    privacySettings: any,
    key: string,
  ): "public" | "authenticated" | "related" | "private" {
    const section = this.getSection(privacySettings, key);
    return (section.visibility as any) || "public";
  }

  isInAllowlist(
    privacySettings: any,
    key: string,
    viewerId?: string | null,
  ): boolean {
    if (!viewerId) return false;
    const section = this.getSection(privacySettings, key);
    return Array.isArray(section.allowlist)
      ? section.allowlist.includes(viewerId)
      : false;
  }

  isInBlocklist(
    privacySettings: any,
    key: string,
    viewerId?: string | null,
  ): boolean {
    if (!viewerId) return false;
    const section = this.getSection(privacySettings, key);
    return Array.isArray(section.blocklist)
      ? section.blocklist.includes(viewerId)
      : false;
  }

  canViewSection(
    privacySettings: any,
    key: string,
    ctx: SectionVisibilityContext,
  ): boolean {
    if (ctx.isOwnerOrAdmin) return true;
    if (!privacySettings) return true; // legacy default public
    if (this.isInAllowlist(privacySettings, key, ctx.viewerId)) return true;
    if (this.isInBlocklist(privacySettings, key, ctx.viewerId)) return false;

    const v = this.getSectionVisibility(privacySettings, key);
    switch (v) {
      case "public":
        return true;
      case "authenticated":
        return true; // page requires auth
      case "related":
        return ctx.isRelated;
      case "private":
      default:
        return false;
    }
  }
}
