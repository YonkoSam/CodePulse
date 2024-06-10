export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    profile_image: string;
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

export interface Post {
    // columns
    id: number
    title: string
    text: string
    user_id: number
    created_at: Date | string
    updated_at: Date | null
    // relations
    user: User
    likes: Like[]
    comments: Comment[]
}

export interface Like {
    // columns
    id: number
    user_id: number
    poster_id: number
    created_at: string | null
    updated_at: string | null
    // relations
    user: User
    post: Post
}

export interface Comment {
    // columns
    id: number
    text: string
    user_id: number
    post_id: number
    created_at: string | null
    updated_at: string | null
    // relations
    user: User
    post: Post
}

export interface Profile {
    // columns
    id: number
    user_id: number
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


export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
        hasProfile: boolean
    };
};




