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
  loadWaitlist,
  saveFollow,
  saveMembership,
  saveWaitlist,
  type FollowAccount,
  type Membership,
  type MembershipApplication,
  type WaitlistEntry,
} from "@/lib/storage";

type OmarContextValue = {
  ready: boolean;
  follow: FollowAccount | null;
  membership: Membership;
  waitlist: WaitlistEntry[];
  isFollowing: (id: string) => boolean;
  isOnWaitlist: (id: string) => boolean;
  followResidence: (id: string, name: string, email: string) => void;
  unfollowResidence: (id: string) => void;
  joinWaitlist: (input: {
    residenceId: string;
    name: string;
    email: string;
    phone?: string;
  }) => void;
  submitMembership: (application: MembershipApplication) => void;
  approveMembershipDemo: () => void;
};

const OmarContext = createContext<OmarContextValue | null>(null);

export function OmarProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [follow, setFollow] = useState<FollowAccount | null>(null);
  const [membership, setMembership] = useState<Membership>({ status: "none" });
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);

  useEffect(() => {
    setFollow(loadFollow());
    setMembership(loadMembership());
    setWaitlist(loadWaitlist());
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

  const submitMembership = useCallback((application: MembershipApplication) => {
    const next: Membership = { status: "pending", application };
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
    <OmarContext.Provider
      value={{
        ready,
        follow,
        membership,
        waitlist,
        isFollowing,
        isOnWaitlist,
        followResidence,
        unfollowResidence,
        joinWaitlist,
        submitMembership,
        approveMembershipDemo,
      }}
    >
      {children}
    </OmarContext.Provider>
  );
}

export function useOmar() {
  const ctx = useContext(OmarContext);
  if (!ctx) throw new Error("useOmar must be used within OmarProvider");
  return ctx;
}
