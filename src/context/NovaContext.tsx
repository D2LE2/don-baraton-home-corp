"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  generateMemberNumber,
  loadFollow,
  loadMembership,
  loadUnlocked,
  loadWaitlist,
  saveFollow,
  saveMembership,
  saveUnlocked,
  saveWaitlist,
  type FollowAccount,
  type Membership,
  type MembershipApplication,
  type UnlockEntry,
  type WaitlistEntry,
} from "@/lib/storage";

type NovaContextValue = {
  ready: boolean;
  follow: FollowAccount | null;
  membership: Membership;
  waitlist: WaitlistEntry[];
  unlocked: UnlockEntry[];
  isFollowing: (id: string) => boolean;
  isOnWaitlist: (id: string) => boolean;
  isUnlocked: (id: string) => boolean;
  followResidence: (id: string, name: string, email: string) => void;
  unfollowResidence: (id: string) => void;
  joinWaitlist: (input: {
    residenceId: string;
    name: string;
    email: string;
    phone?: string;
  }) => void;
  unlockResidence: (input: {
    residenceId: string;
    name: string;
    email: string;
    phone?: string;
  }) => void;
  submitMembership: (application: MembershipApplication) => void;
  approveMembershipDemo: () => void;
};

const NovaContext = createContext<NovaContextValue | null>(null);

export function NovaProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [follow, setFollow] = useState<FollowAccount | null>(null);
  const [membership, setMembership] = useState<Membership>({ status: "none" });
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [unlocked, setUnlocked] = useState<UnlockEntry[]>([]);

  useEffect(() => {
    setFollow(loadFollow());
    setMembership(loadMembership());
    setWaitlist(loadWaitlist());
    setUnlocked(loadUnlocked());
    setReady(true);
  }, []);

  const isFollowing = useCallback(
    (id: string) => Boolean(follow?.following.includes(id)),
    [follow],
  );

  const isOnWaitlist = useCallback(
    (id: string) => waitlist.some((e) => e.residenceId === id),
    [waitlist],
  );

  const isUnlocked = useCallback(
    (id: string) => unlocked.some((e) => e.residenceId === id),
    [unlocked],
  );

  const followResidence = useCallback(
    (id: string, name: string, email: string) => {
      const next: FollowAccount = {
        name,
        email,
        following: Array.from(new Set([...(follow?.following ?? []), id])),
      };
      setFollow(next);
      saveFollow(next);
    },
    [follow],
  );

  const unfollowResidence = useCallback(
    (id: string) => {
      if (!follow) return;
      const next = {
        ...follow,
        following: follow.following.filter((f) => f !== id),
      };
      setFollow(next);
      saveFollow(next);
    },
    [follow],
  );

  const joinWaitlist = useCallback(
    (input: { residenceId: string; name: string; email: string; phone?: string }) => {
      setWaitlist((prev) => {
        if (prev.some((e) => e.residenceId === input.residenceId)) return prev;
        const next = [
          ...prev,
          {
            residenceId: input.residenceId,
            name: input.name,
            email: input.email,
            phone: input.phone,
            joinedAt: new Date().toISOString(),
          },
        ];
        saveWaitlist(next);
        return next;
      });
      const nextFollow: FollowAccount = {
        name: input.name,
        email: input.email,
        following: Array.from(new Set([...(follow?.following ?? []), input.residenceId])),
      };
      setFollow(nextFollow);
      saveFollow(nextFollow);
    },
    [follow],
  );

  const unlockResidence = useCallback(
    (input: { residenceId: string; name: string; email: string; phone?: string }) => {
      setUnlocked((prev) => {
        if (prev.some((e) => e.residenceId === input.residenceId)) return prev;
        const next = [
          ...prev,
          {
            residenceId: input.residenceId,
            name: input.name,
            email: input.email,
            phone: input.phone,
            unlockedAt: new Date().toISOString(),
          },
        ];
        saveUnlocked(next);
        return next;
      });
      // Unlock also puts them on waitlist + follow
      setWaitlist((prev) => {
        if (prev.some((e) => e.residenceId === input.residenceId)) return prev;
        const next = [
          ...prev,
          {
            residenceId: input.residenceId,
            name: input.name,
            email: input.email,
            phone: input.phone,
            joinedAt: new Date().toISOString(),
          },
        ];
        saveWaitlist(next);
        return next;
      });
      const nextFollow: FollowAccount = {
        name: input.name,
        email: input.email,
        following: Array.from(new Set([...(follow?.following ?? []), input.residenceId])),
      };
      setFollow(nextFollow);
      saveFollow(nextFollow);
    },
    [follow],
  );

  const submitMembership = useCallback((application: MembershipApplication) => {
    const next: Membership = {
      status: "pending",
      application,
    };
    setMembership(next);
    saveMembership(next);
  }, []);

  const approveMembershipDemo = useCallback(() => {
    setMembership((prev) => {
      const next: Membership = {
        ...prev,
        status: "approved",
        memberNumber: prev.memberNumber ?? generateMemberNumber(),
        memberSince: prev.memberSince ?? "August 2026",
      };
      saveMembership(next);
      return next;
    });
  }, []);

  return (
    <NovaContext.Provider
      value={{
        ready,
        follow,
        membership,
        waitlist,
        unlocked,
        isFollowing,
        isOnWaitlist,
        isUnlocked,
        followResidence,
        unfollowResidence,
        joinWaitlist,
        unlockResidence,
        submitMembership,
        approveMembershipDemo,
      }}
    >
      {children}
    </NovaContext.Provider>
  );
}

export function useNova() {
  const ctx = useContext(NovaContext);
  if (!ctx) throw new Error("useNova must be used within NovaProvider");
  return ctx;
}
