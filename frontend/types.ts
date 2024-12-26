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

type PostType = {
  id: number;
  title: string;
  description: string;
  url: string;
  image_url: string;
  created_at: string;
  vote: number;
  comment_count: number;
  user_id: number;
};

type ApiResponseType<T> = {
  posts: Array<T>;
  path: string;
  per_page: number;
  next_cursor: string;
  next_page_url?: string;
  prev_cursor?: string;
  prev_page_url?: string;
};
