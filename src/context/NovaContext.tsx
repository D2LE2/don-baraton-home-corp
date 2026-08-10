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
  saveFollow,
  saveMembership,
  type FollowAccount,
  type Membership,
  type MembershipApplication,
} from "@/lib/storage";

type NovaContextValue = {
  ready: boolean;
  follow: FollowAccount | null;
  membership: Membership;
  isFollowing: (id: string) => boolean;
  followResidence: (id: string, name: string, email: string) => void;
  unfollowResidence: (id: string) => void;
  submitMembership: (application: MembershipApplication) => void;
  approveMembershipDemo: () => void;
};

const NovaContext = createContext<NovaContextValue | null>(null);

export function NovaProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [follow, setFollow] = useState<FollowAccount | null>(null);
  const [membership, setMembership] = useState<Membership>({ status: "none" });

  useEffect(() => {
    setFollow(loadFollow());
    setMembership(loadMembership());
    setReady(true);
  }, []);

  const isFollowing = useCallback(
    (id: string) => Boolean(follow?.following.includes(id)),
    [follow],
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
        isFollowing,
        followResidence,
        unfollowResidence,
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
