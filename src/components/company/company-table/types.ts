export interface Company {
  id: number;
  uuid: string;
  name: string;
  orgnr: string;
  url: string;
  user_name: string;
  num_employees?: number;
  some_linked: string;
  address_street: string;
  address_zip: string;
  address_city: string;
  // ... other fields
}
