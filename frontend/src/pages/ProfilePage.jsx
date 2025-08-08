import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Camera, User, Mail } from 'lucide-react';

const ProfilePage = () => {
  const {authUser, isUpdatingProfile, updateProfile} = useAuthStore();
  const [selectedImg, setSelectedImg] = React.useState(null);

  const handleImageUpload = async(e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    }
  }
  

  return (
    <div className='h-screen pt-10'>
      <div className='max-w-2xl mx-auto p-4 py-6'>
        <div className='bg-base-300 rounded-xl p-6 space-y-8'>
          <div className='text-center'>
            <h1 className='text-2xl font-semibold'>Profile</h1>
            <p>Your profile information</p>
          </div>

          {/*avatar upload section */}

          <div className='flex flex-col items-center gap-4'>
            <div className='relative'>
              <img src={selectedImg || authUser.profilePic || "/avatar.png"} alt ="Profile" className='size-32 rounded-full object-cover border-4'/>
              <label htmlFor="avatar-upload" className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 rounded-full p-2 cursor-pointer transition-all duration-200' ${isUpdatingProfile ? 'animate-pulse pointer-events-none' : ''}`}>

                <Camera className='w-5 h-5 text-base-200'/>
                <input type="file" id="avatar-upload" accept="image/*" className='hidden' onChange={handleImageUpload} disabled={isUpdatingProfile}/>
              </label>
            </div>
            <p className='text-sm text-zinc-400'>{isUpdatingProfile ? 'Updating...' : 'Change profile picture'}</p>
          </div>

          <div className='space-y-4'>
            <div className='space-y-1.5'>
              <div className='text-sm text-zinc-400 flex items-center gap-2'>
                <User className="w-4 h-4"/>
                Full Name
              </div>
              <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>{authUser.fullName}</p>
            </div>

            <div className='space-y-1.5'>
              <div className='text-sm text-zinc-400 flex items-center gap-2'>
                <Mail className="w-4 h-4"/>
                Email Address
              </div>
              <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>{authUser.email}</p>
            </div>
          </div>


          <div className='mt-4 bg-base-300 rounded-xl pt-2 pl-4'>
            <h2 className='text-lg font-medium mb-4'>Account Information</h2>
            <div className='space-y-3 text-sm'>
              <div className='flex items-center justify-between py-2 border-b border-zinc-700'>
                <span>Member Since</span>
                <span>{authUser.createdAt?.split('T')[0]}</span>
              </div>
              <div className='flex items-center justify-between py-2'>
                <span>Account Status</span>
                <span className='text-green-500'>Active</span>
            </div>
          </div>
      </div>
      </div>
    </div>
    </div>
  )
}

export default ProfilePage;

