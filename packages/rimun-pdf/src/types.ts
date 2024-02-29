export type AttendeeData = {
  committee: {
    id: number;
    created_at: Date;
    updated_at: Date;
    name: string;
    session_id: number;
    forum_id: number;
    size: number;
  } | null;
  confirmed_group: {
    id: number;
    created_at: Date;
    updated_at: Date;
    name: string;
  } | null;
  confirmed_role: {
    id: number;
    created_at: Date;
    updated_at: Date;
    name: string;
    forum_id: number | null;
    group_id: number;
  } | null;
  delegation:
    | ({
        country: {
          id: number;
          created_at: Date;
          updated_at: Date;
          code: string;
          name: string;
        } | null;
      } & {
        id: number;
        created_at: Date;
        updated_at: Date;
        session_id: number | null;
        is_individual: boolean;
        school_id: number | null;
        n_delegates: number;
        country_id: number | null;
        name: string | null;
        type: string;
      })
    | null;
  person: {
    account: {
      id: number;
      created_at: Date;
      updated_at: Date;
      email: string;
      password: string;
      is_school: boolean;
      is_active: boolean;
      is_admin: boolean;
    } | null;
    country: {
      id: number;
      created_at: Date;
      updated_at: Date;
      code: string;
      name: string;
    };
  } & {
    id: number;
    created_at: Date;
    updated_at: Date;
    name: string;
    surname: string;
    full_name: string;
    birthday: Date | null;
    gender: string | null;
    picture_path: string;
    tshirt_size: string | null;
    phone_number: string | null;
    allergies: string | null;
    account_id: number | null;
    country_id: number;
  };
  school:
    | ({
        country: {
          id: number;
          created_at: Date;
          updated_at: Date;
          code: string;
          name: string;
        };
      } & {
        id: number;
        created_at: Date;
        updated_at: Date;
        name: string;
        city: string;
        address_street: string;
        address_number: string;
        address_postal: string;
        is_network: boolean;
        account_id: number;
        country_id: number;
      })
    | null;
  id: number;
  created_at: Date;
  updated_at: Date;
  person_id: number;
  session_id: number;
  school_id: number | null;
  school_year: number | null;
  school_section: string | null;
  eng_certificate: string | null;
  experience_mun: string | null;
  experience_other: string | null;
  requested_group_id: number | null;
  requested_role_id: number | null;
  confirmed_group_id: number | null;
  confirmed_role_id: number | null;
  city: string | null;
  university: string | null;
  is_resident: boolean | null;
  status_application: string;
  status_housing: string;
  housing_is_available: boolean;
  housing_n_guests: number | null;
  housing_address_street: string | null;
  housing_address_number: string | null;
  housing_address_postal: string | null;
  housing_phone_number: string | null;
  housing_pets: string | null;
  housing_gender_preference: string | null;
  committee_id: number | null;
  delegation_id: number | null;
  is_ambassador: boolean | null;
};

export type SessionData = {
  id: number;
  created_at: Date;
  updated_at: Date;
  edition: number;
  edition_display: number;
  date_start: Date | null;
  date_end: Date | null;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  is_active: boolean;
  image_path: string | null;
};
