import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TextField,
  InputAdornment,
  Button,
  Paper,
  Box,
  Alert,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  User as PersonIcon,
  Mail as MailIcon,
  Lock as LockIcon,
  Eye as Visibility,
  EyeOff as VisibilityOff,
  ShoppingBag as ShoppingBagIcon,
  ArrowRight as ArrowForwardIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const customInputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    backgroundColor: '#F8FAFC',
    fontSize: '0.875rem',
    fontWeight: 500,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: 'all 0.2s ease',
    '& fieldset': {
      borderColor: '#E2E8F0',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: '#CBD5E1',
    },
    '&.Mui-focused': {
      backgroundColor: '#FFFFFF',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FF5A1F',
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#64748B',
    '&.Mui-focused': {
      color: '#FF5A1F',
    },
  },
};

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    const res = await register(name, email, password);
    setLoading(false);

    if (res.success) {
      navigate('/');
    } else {
      setErrorMsg(res.error);
    }
  };

  return (
    <div className="py-14 sm:py-20 min-h-[calc(100vh-320px)] flex items-center justify-center px-4 bg-[#F8FAFC]">
      <div className="w-full max-w-[500px] mx-auto">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3.5, sm: 5.5 },
            borderRadius: '28px',
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08)',
          }}
          className="animate-fade"
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, mb: 4 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #FF5A1F 0%, #FF8A00 100%)',
                color: '#FFFFFF',
                boxShadow: '0 8px 20px -4px rgba(255, 90, 31, 0.35)',
              }}
            >
              <ShoppingBagIcon sx={{ fontSize: 30 }} />
            </Box>
            <Box>
              <h1 className="text-2xl sm:text-3xl font-black font-outfit text-slate-900 tracking-tight">
                Create Account
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Join EasyMart to unlock personalized discounts & tracking
              </p>
            </Box>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              fullWidth
              required
              label="Full Name"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={customInputSx}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon className="w-5 h-5 text-slate-400" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              fullWidth
              required
              type="email"
              label="Email Address"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={customInputSx}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailIcon className="w-5 h-5 text-slate-400" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              fullWidth
              required
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={customInputSx}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon className="w-5 h-5 text-slate-400" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        sx={{ color: '#94A3B8' }}
                      >
                        {showPassword ? <Visibility className="w-4.5 h-4.5" /> : <VisibilityOff className="w-4.5 h-4.5" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              fullWidth
              required
              type={showPassword ? 'text' : 'password'}
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={customInputSx}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon className="w-5 h-5 text-slate-400" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {errorMsg && (
              <Alert severity="error" sx={{ borderRadius: '14px', fontSize: '0.8rem', fontWeight: 600 }}>
                {errorMsg}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              variant="contained"
              endIcon={!loading && <ArrowForwardIcon />}
              sx={{
                height: '52px',
                borderRadius: '16px',
                backgroundColor: '#FF5A1F',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.925rem',
                textTransform: 'none',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                boxShadow: '0 8px 20px -4px rgba(255, 90, 31, 0.35)',
                '&:hover': {
                  backgroundColor: '#E04810',
                  boxShadow: '0 10px 24px -4px rgba(255, 90, 31, 0.45)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
                mt: 1,
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#FFFFFF' }} /> : 'Sign Up Now'}
            </Button>
          </Box>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', pt: 3, mt: 3, borderTop: '1px solid #F1F5F9' }}>
            <span className="text-xs sm:text-sm text-slate-500 font-medium">
              Already have an EasyMart account?{' '}
            </span>
            <Link to="/login" className="text-xs sm:text-sm text-orange-600 font-black hover:underline">
              Sign In
            </Link>
          </Box>
        </Paper>
      </div>
    </div>
  );
};

export default RegisterPage;
