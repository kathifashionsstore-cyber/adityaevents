// src/pages/admin/AdminSettingsPage.jsx
import React, { useState } from 'react';
import PageTransition from '../../components/common/PageTransition';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { ShieldCheck, UserPlus, Lock } from 'lucide-react';

const AdminSettingsPage = () => {
  const { registerAdmin, isSuperAdmin } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('staff');
  const [registering, setRegistering] = useState(false);

  const handleRegisterAdmin = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in name, email, and password.');
      return;
    }

    setRegistering(true);
    try {
      await registerAdmin(email, password, name, role);
      toast.success(`Administrator profile for ${name} registered!`);
      setName('');
      setEmail('');
      setPassword('');
      setRole('staff');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to register new admin.');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-8 pb-12 text-left max-w-2xl mx-auto">
        <h3 className="font-display text-champagne text-sm font-semibold tracking-wide uppercase">
          Administration Portal Settings
        </h3>

        {/* Admin Registration */}
        <Card className="p-8 space-y-6" hoverEffect={false}>
          <div className="flex items-center space-x-3 border-b border-white/5 pb-3">
            <UserPlus className="w-5 h-5 text-gold" />
            <h4 className="font-display text-base font-bold text-champagne">Register Administrator Profile</h4>
          </div>

          {!isSuperAdmin ? (
            <div className="flex items-center space-x-2 text-warning bg-warning/5 border border-warning/20 p-4 rounded-lg font-body text-xs">
              <Lock className="w-4 h-4 shrink-0" />
              <span>Restricted: Only Super-Administrators can register new management profiles.</span>
            </div>
          ) : (
            <form onSubmit={handleRegisterAdmin} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Profile Name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. manager@adithyaevents.com"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Access Password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. min 6 chars"
                  required
                />
                <Select
                  label="RBAC Role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  options={[
                    { value: 'staff', label: 'Staff Operator' },
                    { value: 'manager', label: 'Billing Manager' },
                    { value: 'superadmin', label: 'Super Administrator' },
                  ]}
                />
              </div>

              <Button
                type="submit"
                disabled={registering}
                className="px-8 py-3 text-xs uppercase font-bold tracking-widest mt-4"
              >
                {registering ? 'Creating Profile...' : 'Register Administrator'}
              </Button>
            </form>
          )}
        </Card>

        {/* Security parameters */}
        <Card className="p-6 flex items-center space-x-3 text-success bg-success/5 border border-success/20" hoverEffect={false}>
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span className="font-body text-xs leading-relaxed">
            Administrative consoles operate on secure SSL bindings. All profile triggers are mapped inside activity logs.
          </span>
        </Card>

      </div>
    </PageTransition>
  );
};

export default AdminSettingsPage;
