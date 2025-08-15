const API_URL = 'http://localhost:8000';

export const createUser = async (username: string) => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  });
  return response.json();
};

export const createYip = async (userId: string, content: string, latitude: number, longitude: number) => {
  const response = await fetch(`${API_URL}/yips`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId, content, latitude, longitude }),
  });
  return response.json();
};

export const getYipsByLocation = async (geohash: string) => {
  const response = await fetch(`${API_URL}/yips/${geohash}`);
  return response.json();
};

export const voteOnYip = async (yipId: string, userId: string, direction: 'up' | 'down') => {
    const response = await fetch(`${API_URL}/yips/${yipId}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId, direction }),
  });
  return response.json();
};

export const addCommentToYip = async (yipId: string, userId: string, content: string) => {
  const response = await fetch(`${API_URL}/yips/${yipId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId, content }),
  });
  return response.json();
};