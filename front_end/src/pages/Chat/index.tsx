import { useEffect, useState } from 'react';
import { userAPI } from '@/api/user';
import type { UserSearchResponse } from '@/types/user';
import PrivateChat from '@/components/features/privatechat';
import { Button } from '@/components/ui/button';

export default function Chat() {
  const [users, setUsers] = useState<UserSearchResponse[]>([]);
  const [openChats, setOpenChats] = useState<Record<number, boolean>>({});

  // 🔹 렌더링 시 로그
  console.log('[Chat] Render', { usersLength: users.length, openChats });

  useEffect(() => {
    console.log('[Chat] useEffect: fetch users');
    const fetchUsers = async () => {
      try {
        const response = await userAPI.searchUsersWithoutTeam({});
        if (response.data.status === 200) {
          setUsers(response.data.data);
          console.log('[Chat] Users fetched', response.data.data);
        } else {
          console.error('[Chat] Failed to fetch users:', response.data.message);
        }
      } catch (error) {
        console.error('[Chat] Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const toggleChat = (userId: number) => {
    console.log('[Chat] toggleChat called', { userId, prev: openChats[userId] });
    setOpenChats(prev => {
      const newState = { ...prev, [userId]: !prev[userId] };
      console.log('[Chat] toggleChat newState', newState);
      return newState;
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Hello World</h1>
      <h2>Users without a team:</h2>
      <ul>
        {users.map(user => (
          <li key={user.id} style={{ marginBottom: '10px' }}>
            <div className="flex items-center gap-2">
              <span>{user.userName}</span>
              <Button size="sm" onClick={() => toggleChat(user.id)}>
                {openChats[user.id] ? 'Hide Chat' : 'Open Chat'}
              </Button>
            </div>

            {/* ✅ 재마운트 없이 토글, 디버깅 로그 */}
            <div
              style={{
                display: openChats[user.id] ? 'block' : 'none',
                marginTop: '10px',
              }}
            >
              <PrivateChat otherUserId={user.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
