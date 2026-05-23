export interface SmsResponse {
  status: "OK" | "ERROR";
  status_code: number;
  sms: {
    [phone: string]: {
      status: "OK" | "ERROR";
      status_code: number;
      sms_id?: string;
      status_text: string;
    };
  };
  balance: number;
}

export interface SmscSuccessResponse {
  id: number;
  cnt: number;
  cost?: string;
  balance?: string;
}

export interface SmscErrorResponse {
  error: string;
  error_code: number;
}

export type SmscResponse = SmscSuccessResponse | SmscErrorResponse;
