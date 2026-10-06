import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Save,
  Check,
  Camera,
  UploadCloud,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '');
  const [country, setCountry] = useState(user?.address?.country || 'United States');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  // Fetch latest profile from DB on mount
  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        const res = await authAPI.getProfile();
        if (res.data) {
          const d = res.data;
          setName(d.name || '');
          setAvatar(d.avatar || '');
          setPhone(d.phone || '');
          if (d.address) {
            setStreet(d.address.street || '');
            setCity(d.address.city || '');
            setState(d.address.state || '');
            setPostalCode(d.address.postalCode || '');
            setCountry(d.address.country || 'United States');
          }
        }
      } catch (e) {
        console.warn('Using local auth context for profile:', e.message);
      }
    };
    fetchLatestProfile();
  }, []);

  const getInitialsAvatar = (fullName) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      fullName || 'User'
    )}&background=FF5A1F&color=fff&bold=true&font-size=0.4&rounded=true`;
  };

  const currentAvatar =
    avatar && avatar.trim() ? avatar : getInitialsAvatar(name || user?.name);

  // Client-side image compressor for instant, responsive upload
  const processImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setErrorNotice('Please select a valid image file (PNG, JPG, JPEG, WEBP)');
      return;
    }

    setUploadingImage(true);
    setErrorNotice('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize onto a square canvas for crisp avatar resolution (max 400x400)
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Export compressed high-quality webp/jpeg base64 data-URL
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        setAvatar(compressedBase64);
        setUploadingImage(false);
      };
      img.onerror = () => {
        setErrorNotice('Failed to process the selected image file');
        setUploadingImage(false);
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      setErrorNotice('Failed to read image from device');
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorNotice('');

    const updateData = {
      name: name.trim(),
      avatar: avatar.trim(),
      phone: phone.trim(),
      address: {
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: country.trim(),
      },
    };

    if (password && password.trim()) {
      if (password.trim().length < 6) {
        setErrorNotice('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
      updateData.password = password.trim();
    }

    const res = await updateProfile(updateData);
    setLoading(false);

    if (res.success) {
      setSavedNotice(true);
      setPassword('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSavedNotice(false), 3500);
    } else {
      setErrorNotice(res.error || 'Failed to update profile');
    }
  };

  return (
    <div className="py-10 bg-[#F8FAFC] min-h-[calc(100vh-280px)]">
      <div className="container max-w-4xl">
        {/* Page Header */}
        <div className="pb-6 mb-8 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase text-orange-600 tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" /> Personal Account
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-outfit text-slate-900">
              Account Profile & Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Upload your personal photo, edit dynamic profile details, shipping address, and password
            </p>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="h-11 px-6 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {savedNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-2 shadow-xs animate-fade">
            <Check className="w-4.5 h-4.5 text-emerald-600 stroke-[3]" /> Profile details and photo saved to database successfully!
          </div>
        )}

        {errorNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200 flex items-center gap-2 shadow-xs animate-fade">
            {errorNotice}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Uploadable Avatar Studio Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-sm sm:text-base font-black font-outfit text-slate-900 flex items-center gap-2">
                <Camera className="w-4.5 h-4.5 text-orange-500" /> Profile Picture & Avatar
              </h3>
              <span className="text-[11px] font-bold text-slate-400">
                Supports JPG, PNG, WEBP
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-8">
              {/* Avatar Drag & Drop Circle */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`relative group cursor-pointer w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 flex items-center justify-center transition-all flex-shrink-0 shadow-lg ${
                  isDragOver
                    ? 'border-orange-500 scale-105 shadow-orange-500/30'
                    : 'border-orange-500 hover:border-orange-600'
                }`}
                title="Click or Drag & Drop to upload photo"
              >
                <img
                  src={currentAvatar}
                  alt={name || 'User Avatar'}
                  className="w-full h-full object-cover"
                />

                {/* Hover overlay with upload icon */}
                <div className="absolute inset-0 bg-black/55 text-white flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
                  <Camera className="w-6 h-6" />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    Change Photo
                  </span>
                </div>

                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/75 text-white flex flex-col items-center justify-center gap-1">
                    <RefreshCw className="w-6 h-6 animate-spin text-orange-400" />
                    <span className="text-[10px] font-black">Uploading...</span>
                  </div>
                )}
              </div>

              {/* Upload Controls & Presets */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Hidden Native File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-10 px-5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer active:scale-95"
                  >
                    <UploadCloud className="w-4 h-4" /> Upload from Computer
                  </button>

                  <button
                    type="button"
                    onClick={() => setAvatar(getInitialsAvatar(name))}
                    className="h-10 px-4 border border-slate-200 hover:border-orange-400 hover:bg-orange-50/50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-orange-500" /> Use Initials
                  </button>

                  {avatar && (
                    <button
                      type="button"
                      onClick={() => setAvatar('')}
                      className="h-10 px-3.5 border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                      title="Reset avatar"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Personal Identity Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
            <h3 className="text-sm sm:text-base font-black font-outfit text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <User className="w-4.5 h-4.5 text-orange-500" /> Personal Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Full Name <span className="text-orange-600">*</span>
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-orange-500 focus:outline-none font-medium bg-slate-50/40 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Email Address <span className="text-[11px] text-slate-400">(Account Login)</span>
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border-2 border-slate-200 font-medium bg-slate-100/70 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Phone Number
                </label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-orange-500 focus:outline-none font-medium bg-slate-50/40 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Default Shipping Address Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
            <h3 className="text-sm sm:text-base font-black font-outfit text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <MapPin className="w-4.5 h-4.5 text-orange-500" /> Default Shipping & Delivery Address
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Street Address
                </label>
                <input
                  type="text"
                  placeholder="Apartment, suite, unit, building, street..."
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-orange-500 focus:outline-none font-medium bg-slate-50/40 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">City</label>
                  <input
                    type="text"
                    placeholder="e.g. New York"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-orange-500 focus:outline-none font-medium bg-slate-50/40 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">State / Region</label>
                  <input
                    type="text"
                    placeholder="e.g. NY"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-orange-500 focus:outline-none font-medium bg-slate-50/40 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Postal / ZIP</label>
                  <input
                    type="text"
                    placeholder="e.g. 10001"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-orange-500 focus:outline-none font-medium bg-slate-50/40 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Country</label>
                  <input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-orange-500 focus:outline-none font-medium bg-slate-50/40 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Security & Password Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
            <h3 className="text-sm sm:text-base font-black font-outfit text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Lock className="w-4.5 h-4.5 text-orange-500" /> Security Credentials
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                New Password (leave blank to keep current)
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter at least 6 characters..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs sm:text-sm pl-10 pr-12 py-3 rounded-2xl border-2 border-slate-200 focus:border-orange-500 focus:outline-none font-medium bg-slate-50/40 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Save Action */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="h-13 px-10 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-orange-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-5 h-5" /> {loading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
