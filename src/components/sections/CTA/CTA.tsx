import { Users } from 'lucide-react';
import Button from '../../common/Button/Button';

export default function CTA() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-6">
      <Users className="mx-auto text-blue-600" size={48} />
      <h2 className="text-3xl font-bold text-slate-900">Join the Guardian Network</h2>
      <p className="mx-auto max-w-xl text-slate-600">
        By using GuardianAI, you're contributing to a safer community. Report incidents, verify safe zones, and help protect those around you.
      </p>
      <Button>Become a Guardian</Button>
    </div>
  );
}
