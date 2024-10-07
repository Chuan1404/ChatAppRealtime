export type UserCreateDTO = {
  name: string;
  password: string;
  email: string;
  avatar: string;
};

export type UserUpdateDTO = {
  name: string | null;
  password: string | null;
  avatar: string | null;
};

export type UserLoginDTO = {
  email?: string | null;
  password?: string | null;
};
