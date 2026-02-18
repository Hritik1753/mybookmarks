"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);


  const fetchBookmarks = async (userId: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

  useEffect(() => {
    if (user) {
      fetchBookmarks(user.id);
    } else {
      setBookmarks([]);
    }
  }, [user]);


  useEffect(() => {
  if (!user) return;

  const interval = setInterval(() => {
    fetchBookmarks(user.id);
  }, 100); // 🔥 3 seconds

  return () => clearInterval(interval);
}, [user]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("user-bookmarks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchBookmarks(user.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

const addBookmark = async () => {
  if (!title || !url || !user) return;

  const { error } = await supabase
    .from("bookmarks")
    .insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ]);

  if (!error) {
    setTitle("");
    setUrl("");
    fetchBookmarks(user.id); 
  }
};

const updateBookmark = async (id: string) => {
  const { error } = await supabase
    .from("bookmarks")
    .update({
      title: editTitle,
      url: editUrl,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (!error) {
    setEditingId(null);
    fetchBookmarks(user.id); 
  }
};

const deleteBookmark = async (id: string) => {
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (!error) {
    fetchBookmarks(user.id); // 🔥 Force refresh
  }
};

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };


if (!user) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        
        {/* Logo / Title */}
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Bookmark
        </h1>

        <p className="text-gray-600 mb-6">
          Bookmark your work and access it anytime.
        </p>

        {/* Google Button */}
        <button
          onClick={signIn}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition duration-200"
        >
          Sign in with Google
        </button>

        {/* Extra Text */}
        <p className="text-sm text-gray-500 mt-6">
          Secure login powered by Google
        </p>
      </div>

    </div>
  );
}


return (
  <div className="min-h-screen bg-gray-100 py-10 px-4">
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">
          My Bookmarks
        </h1>
        <button
          onClick={signOut}
          className="text-red-500 font-medium hover:underline"
        >
          Logout
        </button>
      </div>

      {/* Add Section */}
      <div className="flex gap-3 mb-8">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded-md p-3 flex-1 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border rounded-md p-3 flex-1 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={addBookmark}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-md font-semibold transition"
        >
          Add
        </button>
      </div>

      {/* Bookmark List */}
      <div className="space-y-3">
        {bookmarks.map((b) => (
          <div
            key={b.id}
            className="border rounded-md p-4 flex justify-between items-center bg-gray-50"
          >
            {editingId === b.id ? (
              <div className="flex gap-3 flex-1">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="border rounded-md p-2 flex-1 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="border rounded-md p-2 flex-1 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={() => updateBookmark(b.id)}
                  className="text-green-600 font-medium hover:underline"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-gray-500 hover:underline"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-medium hover:underline"
                >
                  {b.title}
                </a>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setEditingId(b.id);
                      setEditTitle(b.title);
                      setEditUrl(b.url);
                    }}
                    className="text-yellow-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteBookmark(b.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);
}

