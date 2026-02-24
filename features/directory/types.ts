export interface DirectoryFilters {
  search?: string
  industry?: string
  graduation_year?: number
  is_mentor?: boolean
  role?: 'verified_member' | 'admin' | 'super_admin'
  membership_status?: 'active' | 'inactive'
}

export const DIRECTORY_PAGE_SIZE = 24
