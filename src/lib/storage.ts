export type MembershipStatus = "none" | "pending" | "approved";

export type MembershipApplication = {
  name: string;
  phone: string;
  email: string;
  location: string;
  purchaseWithin12: "yes" | "no" | "unsure";
  preApproved: "yes" | "no" | "in_process";
  purchaseRange: string;
  interest: string;
  submittedAt: string;
};

export type Membership = {
  status: MembershipStatus;
  memberNumber?: string;
  memberSince?: string;
  application?: MembershipApplication;
};

export type FollowAccount = {
  name: string;
  email: string;
  following: string[];
};

export type WaitlistEntry = {
  residenceId: string;
  name: string;
  email: string;
  phone?: string;
  joinedAt: string;
};

export type UnlockEntry = {
  residenceId: string;
  name: string;
  email: string;
  phone?: string;
  unlockedAt: string;
};

const FOLLOW_KEY = "omar-follow";
const MEMBER_KEY = "omar-membership";
const WAITLIST_KEY = "omar-waitlist";
const UNLOCK_KEY = "omar-unlocked";

export function loadFollow(): FollowAccount | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(FOLLOW_KEY);
    return raw ? (JSON.parse(raw) as FollowAccount) : null;
  } catch {
    return null;
  }
}

export function saveFollow(account: FollowAccount) {
  localStorage.setItem(FOLLOW_KEY, JSON.stringify(account));
}

export function loadMembership(): Membership {
  if (typeof window === "undefined") return { status: "none" };
  try {
    const raw = localStorage.getItem(MEMBER_KEY);
    return raw ? (JSON.parse(raw) as Membership) : { status: "none" };
  } catch {
    return { status: "none" };
  }
}

export function saveMembership(membership: Membership) {
  localStorage.setItem(MEMBER_KEY, JSON.stringify(membership));
}

export function loadWaitlist(): WaitlistEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WAITLIST_KEY);
    return raw ? (JSON.parse(raw) as WaitlistEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveWaitlist(entries: WaitlistEntry[]) {
  localStorage.setItem(WAITLIST_KEY, JSON.stringify(entries));
}

export function loadUnlocked(): UnlockEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(UNLOCK_KEY);
    return raw ? (JSON.parse(raw) as UnlockEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveUnlocked(entries: UnlockEntry[]) {
  localStorage.setItem(UNLOCK_KEY, JSON.stringify(entries));
}

export function generateMemberNumber() {
  const n = Math.floor(40 + Math.random() * 60);
  return `#${String(n).padStart(4, "0")}`;
}
