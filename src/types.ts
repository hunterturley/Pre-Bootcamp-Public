/** Shared domain types for the Switchboard Card Scanner. */

export type ContactStatus = 'draft' | 'syncing' | 'synced' | 'error';

export type ScannedContact = {
  id: string; // local uuid until synced
  firstName: string;
  lastName: string;
  title?: string;
  company?: string;
  phone?: string; // E.164 normalized before send
  email?: string;
  website?: string;
  tags: string[];
  pipelineId?: string;
  pipelineStageId?: string;
  note?: string;
  confidence: number; // 0-1 from parse layer
  cardImageUri: string; // local; optionally uploaded to GHL as attachment
  status: ContactStatus;
  createdAt: string;
};

/** Shape returned by the backend `/scan` parse layer. */
export type ParsedCard = {
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  confidence: number;
};

export type Pipeline = {
  id: string;
  name: string;
  stages: PipelineStage[];
};

export type PipelineStage = {
  id: string;
  name: string;
};

/** Successful `/push` response. */
export type PushResult = {
  contactId: string;
  opportunityId?: string;
  workflowEnrolled: boolean;
};
