import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';

const PaymentResult = () => {
  const [params] = useSearchParams();
  const status = params.get('status'); // success | cancel
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(status === 'success');

  useEffect(() => {
    if (status === 'success') {
      const confirm = async () => {
        try {
          const { data } = await api.post('/payment/confirm');
          setUser(data.user);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      confirm();
    }
  }, [status]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="bg-white bg-opacity-5 border border-white/10 rounded-xl p-8 text-center max-w-md w-full">

        {loading && (
          <div className="text-white text-xl">
            Activating Premium…
          </div>
        )}

        {!loading && status === 'success' && (
          <>
            <h2 className="text-3xl font-bold text-white mb-4">
              🎉 Payment Successful
            </h2>
            <p className="text-gray-300 mb-6">
              Premium features are now unlocked.
            </p>
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              Go to Dashboard
            </Button>
          </>
        )}

        {!loading && status === 'cancel' && (
          <>
            <h2 className="text-3xl font-bold text-white mb-4">
              ❌ Payment Canceled
            </h2>
            <p className="text-gray-300 mb-6">
              No worries — you were not charged.
            </p>
            <Button onClick={() => navigate('/profile')} className="w-full">
              Back to Profile
            </Button>
          </>
        )}

        {!loading && !status && (
          <>
            <h2 className="text-xl text-white">
              Invalid payment state
            </h2>
            <Button onClick={() => navigate('/dashboard')} className="mt-4">
              Go Home
            </Button>
          </>
        )}

      </div>
    </div>
  );
};

export default PaymentResult;
