export interface EducationData {
  schoolShort: string;
  school: string;
  degree: string;
  minor?: string;
  /** GPA, e.g. "3.8". Leave '' until confirmed — the GPA block hides while empty. */
  gpa: string;
  /** Expected graduation, e.g. "May 2027". Leave '' until confirmed — hides while empty. */
  gradTerm: string;
  /** Notable classes. Empty until real coursework is confirmed — the block hides while empty. */
  coursework: string[];
  /** Honors, awards, and fellowships. */
  honors: string[];
}

// ⚠️ FILL BEFORE MERGE — `gpa`, `gradTerm`, and `coursework` are intentionally
// left empty: I won't fabricate academic records. Add your real values and the
// matching Education blocks render automatically (they stay hidden while empty).
// `honors` is pre-filled from the three fellowships already on your timeline —
// edit the wording or swap entries as you like.
export const educationData: EducationData = {
  schoolShort: 'NJIT',
  school: 'New Jersey Institute of Technology',
  degree: 'BS, Mechanical Engineering',
  minor: 'Electrical Engineering',
  gpa: '',
  gradTerm: '',
  coursework: [],
  honors: [
    'MLT CareerPrep Fellow — Software Engineering Track',
    'FirstGenU Fellow — America Needs You × Morgan Stanley IFI',
    'New Jersey Governor’s Fellow',
  ],
};
