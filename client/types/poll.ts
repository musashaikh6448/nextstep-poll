export type Creator = {
  id: string;
  name: string;
  avatarColor?: string; // HSL triplet string like "265 85% 60%"
};

export type PollOption = {
  id: string;
  text: string; // candidate name or option label
  party?: string; // candidate party
  image?: string; // image URL for candidate
  votes: number;
};

export type PollSettings = {
  allowMultiple: boolean;
  allowRevote: boolean;
  showResultsBeforeVote: boolean;
};

export type Poll = {
  id: string;
  title: string;
  description?: string;
  options: PollOption[];
  createdAt: number;
  expiresAt?: number | null;
  creator?: Creator;
  tags?: string[];
  settings: PollSettings;
};
