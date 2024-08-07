export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    profile_image: string;
    unreadMessagesCount?: number;
    last_time_online: string | null;

    // relations
    profile: Profile

}

export interface Education {
    // columns
    id: number
    profile_id: number
    school: string
    degree: string
    fieldofstudy: string
    from: string
    to: string | null
    current: boolean
    description: string | null
    created_at: string | null
    updated_at: string | null
    // relations
    profile: Profile
}

export interface Experience {
    // columns
    id: number
    profile_id: number
    job_title: string
    company: string
    location: string | null
    from: string
    to: string | null
    current: boolean
    description: string | null
    created_at: string | null
    updated_at: string | null
    // relations
    profile: Profile
}

interface LiveAudioVisualizer {
    mediaRecorder: MediaRecorder;
    barWidth: number;
    gap: number;
    width: number;
    height: number;
    fftSize: number;
    maxDecibels: number;
    minDecibels: number;
    smoothingTimeConstant: number;
}

export interface Pulse {
    // columns
    id: number
    title: string
    text: string
    user_id: number
    created_at: string
    updated_at: Date | null
    code:
        {
            language: string
            sourceCode: string
        }
        | null

    language?: string;
    comments_count: number | null;
    team_id: number | null
    // relations
    user: User
    likes: Like[]
    comments: Comment[]
    team: Team
}

export interface Like {
    // columns
    id: number
    user_id: number
    pulse_id: number
    created_at: string | null
    updated_at: string | null
    // relations
    user: User
    Pulse: Pulse
}

export interface Comment {
    // columns
    comment_id: number | null;
    id: number
    text: string
    user_id: number
    pulse_id: number
    created_at: string | null
    updated_at: string | null
    code:
        {
            language: string
            sourceCode: string
        }
        | null

    // relations
    user: User
    Pulse: Pulse
    comment: Comment
    replies: Comment[]
}

export interface Profile {
    // columns
    id: number
    user_id: number
    cover: string | null
    company: string | null
    website: string | null
    country: string | null
    location: string | null
    status: string
    skills: string
    bio: string | null
    created_at: string | null
    updated_at: string | null
    // relations
    user: User
    experiences: Experience[]
    educations: Education[]
    socials: Social
}

export interface Social {
    // columns
    id: number
    profile_id: number
    youtube: string | null
    twitter: string | null
    facebook: string | null
    linkedin: string | null
    instagram: string | null
    github: string | null
    created_at: string | null
    updated_at: string | null
}


export interface Team {
    id: number
    owner_id: number | null
    name: string
    created_at: string | null
    updated_at: string | null
    unreadMessagesCount?: number;

    users: User[]
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
        currentTeam: Team;
    };
    unreadMessagesCount: number | null
};




