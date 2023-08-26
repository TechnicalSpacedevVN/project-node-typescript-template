export interface CreatePostInput {
  content: string;
  image: string;
}

export interface UpdatePostInput {
  content?: string;
  image?: string;
}
