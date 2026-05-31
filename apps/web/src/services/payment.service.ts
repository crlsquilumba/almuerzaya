import api from './api';
import { ENDPOINTS } from '@config/constants';
import { Payment, CreatePaymentPayload } from '../types/entities.types';

class PaymentService {
  async create(payload: CreatePaymentPayload): Promise<Payment> {
    console.log('💳 [PAYMENT] Creating payment:', payload);
    const response = await api.post<Payment>(ENDPOINTS.PAYMENTS, payload);
    return response.data;
  }

  async getById(id: string): Promise<Payment> {
    console.log(`📄 [PAYMENT] Fetching payment ${id}`);
    const response = await api.get<Payment>(ENDPOINTS.PAYMENT_DETAIL(id));
    return response.data;
  }

  async getByReservationId(reservationId: string): Promise<Payment> {
    console.log(`📄 [PAYMENT] Fetching payment for reservation ${reservationId}`);
    const response = await api.get<Payment>(ENDPOINTS.PAYMENTS, {
      params: { reservationId },
    });
    return response.data;
  }

  async uploadProof(paymentId: string, file: File): Promise<Payment> {
    console.log(`📤 [PAYMENT] Uploading proof for payment ${paymentId}`);
    const formData = new FormData();
    formData.append('proofImage', file);

    const response = await api.post<Payment>(
      ENDPOINTS.PAYMENT_UPLOAD_PROOF(paymentId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async verify(id: string): Promise<Payment> {
    console.log(`✅ [PAYMENT] Verifying payment ${id}`);
    const response = await api.patch<Payment>(`/payments/${id}/verify`);
    return response.data;
  }

  async complete(id: string): Promise<Payment> {
    console.log(`✅ [PAYMENT] Completing payment ${id}`);
    const response = await api.patch<Payment>(`/payments/${id}/complete`);
    return response.data;
  }
}

export default new PaymentService();
