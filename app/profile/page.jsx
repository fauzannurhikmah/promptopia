'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import ProfileCard from "@components/Profile"

const Profile = () => {
    const [posts, setPosts] = useState([]);
    const { data: session } = useSession()
    const router = useRouter()

    useEffect(() => {
        const fetchposts = async () => {
            const res = await fetch(`/api/users/${session?.user.id}/posts`)
            const data = await res.json()
            setPosts(data)
        }
        if (session?.user.id) fetchposts()
    }, []);

    const handleEdit = async (post) => {
        router.push(`/update-prompt?id=${post._id}`)
    }
    const handleDelete = async (post) => {
        const hasConfirm = confirm('Are you sure you want to delete this prompt ?')
        if (hasConfirm) {
            try {
                await fetch(`/api/prompt?id=${post._id}`, {
                    method: 'DELETE',
                })
                const filteredPosts = posts.filter((p) => p._id !== post._id)
                setPosts(filteredPosts)
            } catch (error) {
                console.log(error);
            }
        }
    }
    return (
        <ProfileCard name="My" desc="welcome the jungle" data={posts} handleEdit={handleEdit} handleDelete={handleDelete} />
    )
}

export default Profile