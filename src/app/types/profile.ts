export interface ProfileData {
    name: string;
    email: string;
    phone: string;
    location: string;
    headline: string;
    skills: Skill[];
    resumeFile: File | null;
  }
  
  export interface Skill {
    id: string;
    name: string;
  }
  
  export interface EditMode {
    name: boolean;
    contact: boolean;
    headline: boolean;
    skills: boolean;
  }