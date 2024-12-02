import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Camera, Mail, Maximize, User } from 'lucide-react';
import {toast} from 'react-hot-toast';

const ProfilePage = () => {
     const {authUser , isUpdatingProfile , updateProfile} = useAuthStore();
     const [selectedImg , setSelectedImg]= useState(null) ;

     const handleImageUpload = async (e)=>{
      const file = e.target.files[0];
        if(!file) return ;

        // check if file size is within the 40KB limit
        const maxSize = 40*1024;
        if(file.size>maxSize){
          toast.error("Profile Pic should be under 40KB limit");
          return ;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async () =>{
          const base64Image = reader.result;
          setSelectedImg(base64Image);
          await updateProfile({profilePic: base64Image});
        };
     };

     const getInitial = (name) => {
      if (!name) return "?";
      return name.charAt(0).toUpperCase();
    };
  return (
    <div className='h-screen pt-20'>
      <div className='max-w-2xl mx-auto p-4 py-8'>
        <div className='bg-base-300 rounded-xl p-6 space-y-8'>
          <div className='text-center'>
            <h1 className='text-2xl font-semibold'>Profile</h1>
            <p className='mt-2'>Your profile information</p>
          </div>

          {/* Avtar upload section */}
          <div className='flex flex-col items-center gap-4'>
            <div className='relative'>
            {selectedImg || authUser.profilePic ? (
                // Render the profile picture if available
                <img
                  src={selectedImg || authUser.profilePic}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4"
                />
              ) : (
                // Render the fallback initial
                <div
                  className="size-32 rounded-full flex items-center justify-center border-4"
                  style={{ backgroundColor: '#f0f0f0', fontSize: '4rem', fontWeight: 'bold' }}
                >
                  {getInitial(authUser.fullname)}
                </div>
              )}


              <label 
              htmlFor='avtar-upload'
              className={`
                absolute bottom-0 right-0
                bg-base-content hover:scale-105
                p-2 rounded-full cursor-pointer
                transition-all duration-200
                ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
                >
                  <Camera className='w-5 h-5 text-base-200'/>
                  <input 
                  type="file"
                  id="avtar-upload"
                  className='hidden'
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                  />
                </label>
            </div>
            {isUpdatingProfile ? <p className='text-sm text-zinc-400 '>Uploading....</p> : <p className='text-sm text-zinc-400'>
              Click the camera icon to update your photo
            </p>}
          </div>
          {/* Email or Name feild */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullname}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>
        {/* Account Information  */}

        <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>
                {authUser?.createdAt
          ? new Date(authUser.createdAt).toLocaleDateString()
          : 'N/A'}
      </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>


        </div>

      </div>
       
    </div>
  )
}

export default ProfilePage
