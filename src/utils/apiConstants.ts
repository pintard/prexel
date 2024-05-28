export interface PrexelPostPayload {
  user_id: number;
  code: string;
  title: string;
  tags: string[];
  image: string;
}

export interface PrexelPostResponse {
  id: number;
  user_id: number;
  code: string;
  title: string;
  tags: string[];
  image_path: string;
  create_date: string;
  update_date: string;
}
