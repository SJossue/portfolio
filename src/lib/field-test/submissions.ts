import { getSql } from '@/lib/db';

export interface SubmissionInput {
  code: string;
  candidateName: string;
  deptChoiceId: string;
  deptChoiceLabel: string;
  deptWhy: string | null;
  earlyChoiceId: string;
  earlyChoiceLabel: string;
  story: string;
  patternShown: number[];
  patternRecalled: number[];
  patternMatched: boolean;
}

export interface SubmissionRow extends SubmissionInput {
  id: string;
  created_at: string;
}

/** Persist a completed IVP Committee Screening. The database write is the durable record —
 * the candidate never has to do anything for their answers to be saved. */
export async function insertSubmission(input: SubmissionInput): Promise<{ id: string }> {
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO field_test_submissions
      (code, candidate_name, dept_choice_id, dept_choice_label, dept_why,
       early_choice_id, early_choice_label, story, pattern_shown, pattern_recalled, pattern_matched)
    VALUES
      (${input.code}, ${input.candidateName}, ${input.deptChoiceId}, ${input.deptChoiceLabel}, ${input.deptWhy},
       ${input.earlyChoiceId}, ${input.earlyChoiceLabel}, ${input.story},
       ${JSON.stringify(input.patternShown)}, ${JSON.stringify(input.patternRecalled)}, ${input.patternMatched})
    RETURNING id
  `) as { id: string }[];
  return rows[0];
}
