import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AppShell } from '../../components/layout/AppShell.jsx';
import { ProgressLine, Skeleton } from '../../components/common/PageState.jsx';
import { profileService } from '../../services/profileService.js';

const CareerProfile = () => {
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [avatar, setAvatar] = useState('');
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const load = async () => {
    const res = await profileService.get();
    reset(res.data);
    setAvatar(res.data.profilePicture || '');
    setLoading(false);
  };

  useEffect(() => { load().catch(() => setLoading(false)); }, []);

  const onSubmit = async (data) => {
    const res = await profileService.update(data);
    toast.success(res.message || 'Profile saved');
    reset(res.data);
    setEdit(false);
  };

  const uploadAvatar = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await profileService.uploadAvatar(formData);
    setAvatar(res.data.url);
    toast.success('Profile picture uploaded');
  };

  const disabled = !edit;

  return <AppShell title="Career Profile">{loading ? <Skeleton className="h-96" /> : (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img src={avatar || 'https://placehold.co/96x96?text=User'} className="h-20 w-20 rounded-full object-cover" />
          <label className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium cursor-pointer">Upload Picture<input type="file" accept="image/*" className="hidden" onChange={uploadAvatar} /></label>
        </div>
        <button type="button" onClick={() => setEdit((v) => !v)} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">{edit ? 'Cancel' : 'Edit Profile'}</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input {...register('fullName', { required: true })} disabled={disabled} placeholder="Full Name" className="rounded-lg border p-3" />
        <input {...register('email')} disabled placeholder="Email" className="rounded-lg border bg-slate-50 p-3" />
        <select {...register('currentEducation')} disabled={disabled} className="rounded-lg border p-3"><option value="">Education</option><option>High School</option><option>Bachelor's</option><option>Master's</option><option>PhD</option></select>
        <select {...register('yearOfStudy')} disabled={disabled} className="rounded-lg border p-3"><option value="">Year</option><option>1st</option><option>2nd</option><option>3rd</option><option>4th</option><option>Graduated</option></select>
        <input {...register('fieldOfStudy')} disabled={disabled} placeholder="Field of Study" className="rounded-lg border p-3" />
        <input {...register('currentRole')} disabled={disabled} placeholder="Current Role" className="rounded-lg border p-3" />
        <input {...register('yearsOfExperience')} disabled={disabled} type="number" min="0" max="15" placeholder="Years of Experience" className="rounded-lg border p-3" />
        <input {...register('location')} disabled={disabled} placeholder="Location" className="rounded-lg border p-3" />
        <input {...register('linkedinUrl')} disabled={disabled} placeholder="LinkedIn URL" className="rounded-lg border p-3" />
        <input {...register('githubUrl')} disabled={disabled} placeholder="GitHub URL" className="rounded-lg border p-3" />
        <input {...register('portfolioUrl')} disabled={disabled} placeholder="Portfolio URL" className="rounded-lg border p-3 md:col-span-2" />
        <textarea {...register('bio', { maxLength: 500 })} disabled={disabled} placeholder="Bio" className="min-h-28 rounded-lg border p-3 md:col-span-2" />
      </div>
      <ProgressLine value={0} />
      {edit && <button disabled={isSubmitting} className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white">{isSubmitting ? 'Saving...' : 'Save Changes'}</button>}
    </form>
  )}</AppShell>;
};
export default CareerProfile;
