import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  authAPI, profileAPI, projectsAPI, skillsAPI, messagesAPI,
  getToken, setToken, removeToken, uploadsURL,
} from '../services/api';

const AppContext = createContext();

// ── Fallback data shown while loading ─────────────────────────────────────────
const defaultProfile = {
  name: 'John Doe', title: 'Full Stack Developer',
  bio: 'Passionate about creating beautiful, functional web experiences.',
  about: "I'm a passionate developer dedicated to creating exceptional digital experiences.\n\nWith over 5 years of experience in web development, I specialize in building modern, responsive applications.",
  email: 'john@example.com', phone: '+1 (555) 123-4567', location: 'New York, USA',
  github: 'https://github.com', linkedin: 'https://linkedin.com', twitter: 'https://twitter.com',
  profileImage: null, cvFile: null,
};

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [isAdmin, setIsAdmin] = useState(() => !!getToken());
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState(defaultProfile);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // ── Dark mode ──────────────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // ── Resolve image/cv URLs from filenames ──────────────────────────────────
  const resolveProfile = (p) => ({
    ...p,
    profileImage: p.profileImage ? uploadsURL(p.profileImage) : null,
    cvFile: p.cvFile ? uploadsURL(p.cvFile) : null,
  });

  const resolveProject = (p) => ({
    ...p,
    id: p._id,
    image: p.imageFile ? uploadsURL(p.imageFile) : p.image,
  });

  // ── Load public data on mount ──────────────────────────────────────────────
  const loadPublicData = useCallback(async () => {
    try {
      const [profileRes, projectsRes, skillsRes] = await Promise.all([
        profileAPI.get(),
        projectsAPI.getAll(),
        skillsAPI.getAll(),
      ]);
      if (profileRes.success) setProfile(resolveProfile(profileRes.data));
      if (projectsRes.success) setProjects(projectsRes.data.map(resolveProject));
      if (skillsRes.success) setSkills(skillsRes.data.map(s => ({ ...s, id: s._id })));
    } catch (err) {
      console.warn('API unavailable, using defaults:', err.message);
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => { loadPublicData(); }, [loadPublicData]);

  // ── Load admin messages when logged in ────────────────────────────────────
  const loadMessages = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const res = await messagesAPI.getAll();
      if (res.success) {
        setMessages(res.data.map(m => ({ ...m, id: m._id })));
        setUnreadCount(res.unreadCount);
      }
    } catch (err) {
      console.error('Failed to load messages:', err.message);
    }
  }, [isAdmin]);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  // ── Auth ───────────────────────────────────────────────────────────────────
  const login = async (username, password) => {
    const res = await authAPI.login(username, password);
    if (res.success) {
      setToken(res.token);
      setIsAdmin(true);
      await loadMessages();
    }
    return res;
  };

  const logout = async () => {
    try { await authAPI.logout(); } catch (_) {}
    removeToken();
    setIsAdmin(false);
    setMessages([]);
    setUnreadCount(0);
  };

  // ── Profile ────────────────────────────────────────────────────────────────
  const updateProfile = async (updates) => {
    const res = await profileAPI.update(updates);
    if (res.success) setProfile(resolveProfile(res.data));
    return res;
  };

  const uploadProfileImage = async (file) => {
    const res = await profileAPI.uploadImage(file);
    if (res.success) {
      setProfile(prev => ({ ...prev, profileImage: uploadsURL(res.filename) }));
    }
    return res;
  };

  const uploadCV = async (file) => {
    const res = await profileAPI.uploadCV(file);
    if (res.success) {
      setProfile(prev => ({ ...prev, cvFile: uploadsURL(res.filename) }));
    }
    return res;
  };

  const removeProfileImage = async () => {
    const res = await profileAPI.removeImage();
    if (res.success) setProfile(prev => ({ ...prev, profileImage: null }));
    return res;
  };

  // ── Projects ───────────────────────────────────────────────────────────────
  const addProject = async (data) => {
    const res = await projectsAPI.create(data);
    if (res.success) setProjects(prev => [resolveProject(res.data), ...prev]);
    return res;
  };

  const updateProject = async (id, data) => {
    const res = await projectsAPI.update(id, data);
    if (res.success) setProjects(prev => prev.map(p => p.id === id ? resolveProject(res.data) : p));
    return res;
  };

  const deleteProject = async (id) => {
    const res = await projectsAPI.delete(id);
    if (res.success) setProjects(prev => prev.filter(p => p.id !== id));
    return res;
  };

  // ── Skills ─────────────────────────────────────────────────────────────────
  const addSkill = async (data) => {
    const res = await skillsAPI.create(data);
    if (res.success) setSkills(prev => [...prev, { ...res.data, id: res.data._id }]);
    return res;
  };

  const updateSkill = async (id, data) => {
    const res = await skillsAPI.update(id, data);
    if (res.success) setSkills(prev => prev.map(s => s.id === id ? { ...res.data, id: res.data._id } : s));
    return res;
  };

  const deleteSkill = async (id) => {
    const res = await skillsAPI.delete(id);
    if (res.success) setSkills(prev => prev.filter(s => s.id !== id));
    return res;
  };

  // ── Messages ───────────────────────────────────────────────────────────────
  const sendMessage = async (data) => {
    return messagesAPI.send(data);
  };

  const deleteMessage = async (id) => {
    const res = await messagesAPI.delete(id);
    if (res.success) {
      setMessages(prev => prev.filter(m => m.id !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    return res;
  };

  const markMessageRead = async (id) => {
    const res = await messagesAPI.markRead(id);
    if (res.success) {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    return res;
  };

  const markAllRead = async () => {
    const res = await messagesAPI.markAllRead();
    if (res.success) {
      setMessages(prev => prev.map(m => ({ ...m, read: true })));
      setUnreadCount(0);
    }
    return res;
  };

  // ── Expose data shape compatible with existing components ──────────────────
  const data = {
    profile,
    projects,
    skills,
    messages,
    experience: [
      { id: 1, type: 'work', title: 'Senior Full Stack Developer', company: 'Tech Corp Inc.', period: '2022 - Present', description: 'Leading development of scalable web applications serving 100k+ users. Mentoring junior developers and architecting microservices.' },
      { id: 2, type: 'work', title: 'Frontend Developer', company: 'Digital Agency', period: '2020 - 2022', description: 'Built responsive web applications for various clients. Improved performance by 40% through code optimization.' },
      { id: 3, type: 'education', title: 'B.Sc. Computer Science', company: 'State University', period: '2016 - 2020', description: 'Graduated with honors. Specialized in software engineering and algorithms.' },
    ],
  };

  return (
    <AppContext.Provider value={{
      darkMode, setDarkMode,
      isAdmin, login, logout,
      loading,
      data,
      unreadCount,
      // Profile
      updateProfile, uploadProfileImage, uploadCV, removeProfileImage,
      // Projects
      addProject, updateProject, deleteProject,
      // Skills
      addSkill, updateSkill, deleteSkill,
      // Messages
      sendMessage, deleteMessage, markMessageRead, markAllRead,
      // Refresh
      loadMessages,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
