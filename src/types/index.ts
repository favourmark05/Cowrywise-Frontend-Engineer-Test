export interface Photo {
    id: string;
    urls: {
      raw: string;
      full: string;
      regular: string;
      small: string;
    };
    alt_description: string;
    user: {
      name: string;
    };
    location: {
      title: string | null;
    };
  }