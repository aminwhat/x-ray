export type CommonResponse<T> =
  | { succeed: true; data: T; message: null }
  | {
      succeed: false;
      data: null;
      message: string;
    };
