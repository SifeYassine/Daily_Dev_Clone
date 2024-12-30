type ImagePreviewResType = {
  url: string;
  title: string;
  siteName?: string;
  description?: string;
  mediaType: string;
  contentType?: string;
  images: string[];
  videos: {};
  favicons: string[];
};

type PostStateType = {
  title?: string;
  description?: string;
  url?: string;
  image_url?: string;
};

type UserType = {
  id: number;
  email: string;
  username: string;
  profile_image: string;
};

type PostType = {
  id: number;
  title: string;
  description: string;
  url: string;
  image_url: string;
  created_at: string;
  vote: number;
  comment_count: number;
  user_id: UserType;
};

type CommentType = {
  id: number;
  post_id: number;
  created_at: string;
  comment: string;
  user_id: UserType;
};

type ApiResponseType<T> = {
  data: Array<T>;
  path: string;
  per_page: number;
  next_cursor: string;
  next_page_url?: string;
  prev_cursor?: string;
  prev_page_url?: string;
};
