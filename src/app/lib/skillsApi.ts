// skillsApi.ts

const EMSI_CLIENT_ID = 'ohgqwkhith4n466u';
const EMSI_CLIENT_SECRET = 'PrGkMUIv';
const EMSI_SCOPE = 'emsi_open';
const AUTH_URL = 'https://auth.emsicloud.com/connect/token';
const SKILLS_URL = 'https://emsiservices.com/skills/versions/latest/skills';



// Client ID: ohgqwkhith4n466u
// Secret: PrGkMUIv
// Scope: emsi_open

// Define types for the skills data
interface Skill {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  type: string;
}

interface SkillsResponse {
  data: Skill[];
}

// Get authentication token
async function getAuthToken(): Promise<string> {
  try {
    const response = await fetch(AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: EMSI_CLIENT_ID,
        client_secret: EMSI_CLIENT_SECRET,
        grant_type: 'client_credentials',
        scope: EMSI_SCOPE,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get authentication token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error in getAuthToken:', error instanceof Error ? error.message : error);
    throw new Error('Failed to authenticate with EMSI');
  }
}

// Fetch skills with pagination
async function fetchSkillsPage(token: string, offset: number = 0, limit: number = 100): Promise<SkillsResponse> {
  try {
    const response = await fetch(`${SKILLS_URL}?offset=${offset}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch skills: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error in fetchSkillsPage:', error instanceof Error ? error.message : error);
    throw new Error('Failed to fetch skills data');
  }
}

// Process skills data and handle pagination
async function fetchAllSkillsData(): Promise<Skill[]> {
  try {
    const token = await getAuthToken();
    let allSkills: Skill[] = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const { data } = await fetchSkillsPage(token, offset, limit);

      // If no more data or empty array, break the loop
      if (!data || data.length === 0) break;

      allSkills = [...allSkills, ...data];
      offset += limit;
    }

    return allSkills;
  } catch (error) {
    console.error('Error in fetchAllSkillsData:', error instanceof Error ? error.message : error);
    throw new Error('Failed to fetch all skills');
  }
}

// Get formatted skills data (main entry point)
export async function getAllSkills(): Promise<Skill[]> {
  try {
    const allSkillsData = await fetchAllSkillsData();

    // Format skills data as needed
    return allSkillsData.map(skill => ({
      id: skill.id,
      name: skill.name,
      category: skill.category,
      subcategory: skill.subcategory,
      type: skill.type,
    }));
  } catch (error) {
    console.log(error)
    console.error('Error in getAllSkills:', error instanceof Error ? error.message : error);
    throw new Error('Failed to get skills');
  }
}
