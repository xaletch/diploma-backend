export interface EmployeeUpdateResponse {
  success: true;
  user: {
    id: string;
    email: string;
    phone: string;
  };
}
