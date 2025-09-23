export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: Address;
  profilePictureUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Address {
  street: string;
  city: string;
  zipCode: string;
  state?: string;
  country?: string;
}

export interface CustomerUpdateRequest {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  address?: Partial<Address>;
}

export interface AvatarUploadResponse {
  profilePictureUrl: string;
  message: string;
}