import type { VercelRequest, VercelResponse } from '@vercel/node';

import { resolveLocation } from '../lib/auth.js';
import { addNote, createOpportunity, upsertContact } from '../lib/ghl.js';
import { route } from '../lib/http.js';

type IncomingContact = {
  firstName: string;
  lastName: string;
  title?: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  tags: string[];
  pipelineId?: string;
  pipelineStageId?: string;
  note?: string;
};

/**
 * POST /push
 * Body: { contact }
 * 1. Upsert the GHL contact with tags.
 * 2. Create an opportunity in the chosen pipeline/stage (if provided).
 * 3. Attach the note.
 * 4. Workflow enrollment is handled by a tag-triggered workflow already
 *    configured in Switchboard (keeps automation logic in GHL). The
 *    `card-scan` / `open-house` tags fire it on upsert.
 */
export default route('POST', async (req: VercelRequest, res: VercelResponse) => {
  const auth = await resolveLocation(req);

  const contact: IncomingContact | undefined = req.body?.contact;
  if (!contact?.firstName && !contact?.lastName) {
    res.status(400).json({ error: 'contact with at least a name is required' });
    return;
  }

  const { contactId } = await upsertContact(auth, {
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email || undefined,
    phone: contact.phone || undefined,
    companyName: contact.company || undefined,
    website: contact.website || undefined,
    tags: contact.tags ?? [],
    source: 'card-scan',
  });

  let opportunityId: string | undefined;
  if (contact.pipelineId && contact.pipelineStageId) {
    const name = `${contact.firstName} ${contact.lastName}`.trim() || 'New lead';
    const opp = await createOpportunity(auth, {
      contactId,
      pipelineId: contact.pipelineId,
      stageId: contact.pipelineStageId,
      name,
    });
    opportunityId = opp.opportunityId;
  }

  if (contact.note?.trim()) {
    await addNote(auth, contactId, contact.note.trim());
  }

  // The tag-triggered GHL workflow enrolls the contact automatically.
  res.status(200).json({ contactId, opportunityId, workflowEnrolled: true });
});
