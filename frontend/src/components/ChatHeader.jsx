import React from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore';
import { X } from 'lucide-react';

const ChatHeader = () => {

    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();



    return (
        <div className='p-3 border-b border-base-300'>
            <div className='flex items-center justify-between'>
                <div className='flex itmes-center gap-3'>
                    {/* Avtar */}
                    <div className='avatar'>
                        <div className='size-10 rounded-full relative>'>
                            {selectedUser.profilePic ? (
                                <img
                                    src={selectedUser.profilePic}
                                    alt={selectedUser.fullname}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            ) : (
                                <div
                                    className="w-10 h-10  rounded-full bg-primary/60 flex items-center justify-center text-lg font-bold"
                                >
                                    {selectedUser.fullname?.charAt(0).toUpperCase() || "U"}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* user info */}
                    <div>
                        <h3 className='font-medium'>{selectedUser.fullname}</h3>
                        <p className='text-sm text-base-content/70'>
                                {onlineUsers.includes(selectedUser._id) ? "Online" :"Offline"}
                        </p>
                    </div>
                </div>

                {/* close button */}
                <button onClick={()=>setSelectedUser(null)}>
                    <X/>
                </button>
            </div>
        </div>
    )
}

export default ChatHeader
