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

// Values reflect the NJIT degree audit; coursework is the substantive
// mechanical/electrical set (completed + in-progress), gen-eds omitted.
export const educationData: EducationData = {
  schoolShort: 'NJIT',
  school: 'New Jersey Institute of Technology',
  degree: 'BS, Mechanical Engineering',
  minor: 'Electrical Engineering',
  gpa: '3.2',
  gradTerm: 'May 2028',
  coursework: [
    'Dynamics',
    'Kinematics of Machinery',
    'Strength of Materials',
    'Stress Analysis',
    'Thermodynamics',
    'System Dynamics',
    'Engineering Materials & Processes',
    'Circuits & Systems',
    'Differential Equations',
    'Statistics & Probability for Engineers',
    'Intro to Welding',
  ],
  honors: [
    'MLT CareerPrep Fellow — Software Engineering Track',
    'FirstGenU Fellow — America Needs You × Morgan Stanley IFI',
    'New Jersey Governor’s Fellow',
  ],
};
