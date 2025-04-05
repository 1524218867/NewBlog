<template>
  <div class="messages-page">
    <!-- 头部导航 -->
    <div class="header">
      <button @click="goBack" class="back-button">
        <i class="back-icon">←</i>
        <span class="back-text">返回</span>
      </button>
      <span class="separator">/</span>
      <span class="title">我的消息</span>
    </div>

    <div class="messages-container">
      <!-- 左侧消息列表 -->
      <div class="message-list-container" :class="{ 'hidden-mobile': showChat }">
        <div class="list-header">
          <h2>最近消息</h2>
          <el-dropdown @command="handleCommand" v-if="conversations && conversations.length > 0">
            <span class="dropdown-link">
              <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="markAllRead">全部标为已读</el-dropdown-item>
              <el-dropdown-item command="deleteAll">清空消息</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <div class="message-list">
          <div 
            v-for="conversation in conversations" 
            :key="conversation.id || index"
            class="message-item"
            :class="{ 
              active: currentConversation && currentConversation.id === conversation.id, 
              unread: conversation.unread 
            }"
            @click="selectConversation(conversation)"
          >
            <div class="avatar">
              <img :src="getImageUrl(conversation.avatar || '640.png', 'UserImg')" :alt="conversation.name || '未知用户'">
              <span v-if="conversation.unread && conversation.unreadCount" class="unread-badge">{{ conversation.unreadCount }}</span>
            </div>
            <div class="message-info">
              <div class="message-header">
                <h3>{{ conversation.name || '未知用户' }}</h3>
                <span class="time">{{ formatTime(conversation.lastMessageTime) }}</span>
              </div>
              <p class="message-preview">{{ conversation.lastMessage || '暂无消息' }}</p>
            </div>
          </div>
          
          <div v-if="!conversations || conversations.length === 0" class="empty-list">
            <i class="el-icon-message"></i>
            <p>暂无消息</p>
          </div>
        </div>
      </div>

      <!-- 右侧聊天内容 -->
      <div class="chat-container" :class="{ 'active-mobile': showChat }">
        <template v-if="currentConversation && currentConversation.id">
          <div class="chat-header">
            <button class="back-to-list" @click="backToList">
              <i class="el-icon-arrow-left"></i>
            </button>
            <h2>{{ currentConversation.name || '未知用户' }}</h2>
            <el-dropdown v-if="messages && messages.length > 0">
              <span class="dropdown-link">
                <i class="el-icon-more"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="clearConversation">清空聊天记录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>

          <div class="chat-messages" ref="chatMessages">
            <!-- 迭代消息数组 -->
            <template v-for="(message, index) in messages">
              <!-- 自己发送的消息：消息-头像 布局 -->
              <div 
                v-if="message.isSelf"
                :key="message._id || message.id || 'self-' + index"
                class="message own-message"
              >
                <!-- 消息气泡 (左侧) -->
                <div class="message-bubble self-bubble">
                  <div class="message-content">{{ message.content || '' }}</div>
                  <div class="message-time">{{ formatTime(message.time) }}</div>
                </div>
                
                <!-- 自己的头像 (右侧) -->
                <div class="message-avatar self-avatar">
                  <img :src="getImageUrl(userAvatar || '640.png', 'UserImg')" alt="我">
                </div>
              </div>
              
              <!-- 接收的消息：头像-消息 布局 -->
              <div 
                v-else
                :key="message._id || message.id || 'other-' + index"
                class="message other-message"
              >
                <!-- 对方头像 (左侧) -->
                <div class="message-avatar other-avatar">
                  <img :src="getImageUrl(message.senderAvatar || currentConversation.avatar || '640.png', 'UserImg')" :alt="message.senderName || currentConversation.name || '未知用户'">
                </div>
                
                <!-- 消息气泡 (右侧) -->
                <div class="message-bubble other-bubble">
                  <div class="message-content">{{ message.content || '' }}</div>
                  <div class="message-time">{{ formatTime(message.time) }}</div>
                </div>
              </div>
            </template>
            
            <div v-if="!messages || messages.length === 0" class="empty-chat">
              <p>没有聊天记录，发送一条消息开始对话吧！</p>
            </div>
          </div>

          <div class="chat-input">
            <el-input
              v-model="messageInput"
              type="textarea"
              :rows="2"
              placeholder="输入消息..."
              resize="none"
              @keyup.enter.native="sendMessage"
            ></el-input>
            <el-button type="primary" @click="sendMessage" :disabled="!messageInput || !messageInput.trim()">
              发送
            </el-button>
          </div>
        </template>

        <div v-else class="no-conversation">
          <i class="el-icon-chat-dot-round"></i>
          <p>选择一个对话开始聊天</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'Messages',
  
  data() {
    return {
      conversations: [],
      currentConversation: null,
      messages: [],
      messageInput: '',
      showChat: false,
      userAvatar: '',
      loading: false,
      totalUnreadCount: 0,
      socket: null,
      defaultAvatar: require('@/assets/Nologing.png'), // 添加默认头像
      heartbeatInterval: null,
      userId: null, // 直接在data中存储用户ID，避免依赖计算属性
      isUserInfoValid: false // 标记用户信息是否有效
    };
  },
  
  computed: {
    ...mapGetters(['getUser', 'isLoggedIn', 'getUserId']),
    
    // 获取授权头部
    authHeader() {
      const token = localStorage.getItem('token');
      return token ? { Authorization: `Bearer ${token}` } : {};
    }
  },
  
  async created() {
    console.log('Messages组件创建，开始检查用户信息');
    
    // 检查token是否存在
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('未找到token，需要登录');
      this.$message.warning('您尚未登录，请先登录');
      this.$router.push('/login');
      return;
    }
    
    // 尝试获取用户信息
    await this.validateUserInfo();
    
    // 如果用户信息无效，停止执行
    if (!this.isUserInfoValid) {
      return;
    }
    
    try {
      console.log('初始化消息页面');
      
      // 首先获取未读消息数
      await this.getUnreadCount();
      
      // 首先获取现有会话列表
      await this.loadConversations();
      
      // 处理从其他页面跳转来创建新会话的情况
      const createChatRequested = await this.handleCreateChatRequest();
      
      // 如果不是创建新会话，且有会话存在，则选择第一个会话
      if (!createChatRequested && this.conversations && this.conversations.length > 0) {
        console.log('没有创建新会话请求，选择第一个会话:', this.conversations[0].id);
        await this.selectConversation(this.conversations[0]);
      } else if (this.conversations.length === 0) {
        console.log('没有找到任何会话');
      }
      
      // 连接WebSocket
      this.connectWebSocket();
      
      // 初始化监听通知刷新
      this.initNotificationListener();
    } catch (error) {
      console.error('初始化消息页面失败:', error);
    }
  },
  
  beforeDestroy() {
    // 组件销毁前关闭WebSocket连接
    this.disconnectWebSocket();
  },
  
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    
    backToList() {
      this.showChat = false;
    },
    
    async loadConversations() {
      this.loading = true;
      try {
        // 检查用户ID是否有效
        if (!this.userId) {
          console.warn('用户ID无效，无法加载会话');
          this.conversations = [];
          this.loading = false;
          return;
        }
        
        console.log('开始加载会话列表，用户ID:', this.userId);
        const response = await axios.get('/api/conversations', {
          headers: this.authHeader
        });
        
        console.log('会话列表接口返回数据:', response.data);
        
        // 处理后端返回的会话数据格式
        if (response.data) {
          let conversationsData = Array.isArray(response.data) ? response.data : [response.data];
          
          // 在没有会话数据时提供明确的警告
          if (conversationsData.length === 0) {
            console.warn('会话列表为空，可能是新用户或后端未返回数据');
            this.conversations = [];
            return;
          }
          
          console.log('找到会话数量:', conversationsData.length);
          
          // 格式化会话数据
          const formattedConversations = [];
          
          for (let i = 0; i < conversationsData.length; i++) {
            const conv = conversationsData[i];
            
            // 获取对话的另一方用户信息（根据新的后端结构）
            const otherUser = conv.otherUser || (conv.participants && conv.participants.find(p => p._id !== this.userId));
            const otherUserName = otherUser ? otherUser.username : '未知用户';
            const otherUserAvatar = otherUser ? otherUser.avatar : '640.png';
            const otherUserId = otherUser ? otherUser._id : null;
            
            // 获取会话的最后一条消息
            let lastMessage = '';
            if (conv.lastMessage && conv.lastMessage.content) {
              // 如果直接提供了最后一条消息
              lastMessage = conv.lastMessage.content;
            } else if (typeof conv.lastMessage === 'string') {
              // 如果最后一条消息是字符串
              lastMessage = conv.lastMessage;
            } else {
              // 尝试获取会话的消息
              try {
                const messages = await this.getConversationMessages(conv._id || conv.id);
                if (messages && messages.length > 0) {
                  // 如果找到消息，使用最新的一条
                  const latestMessage = messages[messages.length - 1];
                  lastMessage = latestMessage.content || '';
                }
              } catch (error) {
                console.warn(`无法获取会话 ${conv._id || conv.id} 的消息:`, error);
              }
            }
            
            // 记录详细的会话信息，帮助调试
            console.log(`会话 ${i + 1}:`, {
              id: conv._id || conv.id,
              otherUser: otherUserName,
              lastMessage: lastMessage,
              unreadCount: conv.unreadCount,
              participants: conv.participants?.map(p => p._id)
            });
            
            formattedConversations.push({
              id: conv._id || conv.id || `temp-${Date.now()}-${i}`,
              name: otherUserName,
              avatar: otherUserAvatar,
              lastMessage: lastMessage,
              lastMessageTime: conv.lastMessageTime || conv.updatedAt || conv.createdAt || new Date(),
              unread: Boolean(conv.unread || conv.unreadCount > 0),
              unreadCount: conv.unreadCount || 0,
              otherUserId: otherUserId,
              participantId: conv.participants?.[0]?._id, // 兼容旧格式
              type: conv.type || 'private'
            });
          }
          
          this.conversations = formattedConversations;
          
          console.log('格式化后的会话列表:', this.conversations.map(c => ({
            id: c.id,
            name: c.name,
            lastMessage: c.lastMessage
          })));
        } else {
          this.conversations = [];
          console.warn('会话列表返回格式不正确:', response.data);
        }
      } catch (error) {
        console.error('加载消息列表失败:', error);
        console.error('请求详情:', {
          url: '/api/conversations',
          headers: { 
            ...this.authHeader, 
            Authorization: this.authHeader.Authorization ? this.authHeader.Authorization.substring(0, 20) + '...' : 'none' 
          }
        });
        this.conversations = [];
        this.$message.error('加载消息列表失败，请检查网络连接');
        
        if (error.response && error.response.status === 401) {
          this.$message.error('登录已过期，请重新登录');
          this.$router.push('/login');
        }
      } finally {
        this.loading = false;
      }
    },
    
    async selectConversation(conversation) {
      if (!conversation || !conversation.id) {
        console.error('无效的会话对象:', conversation);
        return;
      }
      
      this.currentConversation = conversation;
      this.showChat = true;
      
      // 如果有未读消息，标记为已读
      if (conversation.unread) {
        try {
          await axios.put(`/api/conversations/${conversation.id}/read`, {}, {
            headers: this.authHeader
          });
          
          // 减少总未读数量
          const previousUnreadCount = conversation.unreadCount || 0;
          this.totalUnreadCount -= previousUnreadCount;
          if (this.totalUnreadCount < 0) this.totalUnreadCount = 0;
          
          // 通知其他组件更新未读消息数
          this.$root.$emit('update-unread-count', this.totalUnreadCount);
          
          // 更新当前会话的未读状态
          conversation.unread = false;
          conversation.unreadCount = 0;
        } catch (error) {
          console.error('标记消息已读失败:', error);
        }
      }
      
      await this.loadMessages(conversation.id);
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    
    async loadMessages(conversationId) {
      if (!conversationId) return;
      
      try {
        // 确保用户ID有效
        if (!this.userId) {
          console.warn('未登录或用户ID不可用，但仍然尝试加载消息');
          // 尝试重新验证用户，而不是立即退出
          await this.validateUserInfo();
          if (!this.isUserInfoValid) {
            this.$message.warning('登录状态可能已失效，请重新登录');
            return;
          }
        }
        
        console.log('加载会话消息，会话ID:', conversationId, '用户ID:', this.userId);
        const response = await axios.get(`/api/conversations/${conversationId}/messages`, {
          params: {
            page: 1,
            limit: 50,
            userId: this.userId // 明确指定用户ID
          },
          headers: this.authHeader
        });

        console.log('会话消息接口返回数据:', response.data);

        // 提取会话信息和消息
        let messagesData = [];
        let conversationData = null;

        // 处理新的后端API响应格式
        if (response.data) {
          // 提取会话数据
          if (response.data.conversation) {
            conversationData = response.data.conversation;
          }

          // 提取消息数据
          if (Array.isArray(response.data.messages)) {
            messagesData = response.data.messages;
          } else if (Array.isArray(response.data)) {
            messagesData = response.data;
          } else if (response.data.data && Array.isArray(response.data.data.messages)) {
            messagesData = response.data.data.messages;
          }
        }

        console.log('找到消息数量:', messagesData.length);
        console.log('会话数据:', conversationData);
        console.log('消息数据示例:', messagesData.length > 0 ? messagesData[0] : '无消息');

        // 获取当前用户ID
        if (!this.userId) {
          console.warn('无法获取当前用户ID，可能影响消息发送者判断');
        }

        // 如果返回了会话数据，更新当前会话信息
        if (conversationData) {
          // 更新当前会话的用户信息
          if (conversationData.currentUser && conversationData.otherUser) {
            // 使用返回的otherUser信息更新会话显示
            this.currentConversation = {
              ...this.currentConversation,
              name: conversationData.otherUser.username || '未知用户',
              avatar: conversationData.otherUser.avatar || '640.png',
              otherUserId: conversationData.otherUser._id,
              currentUserId: conversationData.currentUser._id
            };
          }
        }
        
        // 创建一个Set来跟踪已经处理过的消息ID，避免重复
        const processedIds = new Set();
        
        // 格式化消息数据，使用新的消息格式
        this.messages = messagesData.map((msg, index) => {
          // 确保每条消息有唯一ID
          const messageId = msg._id || msg.id || `msg-${Date.now()}-${index}`;
          
          // 检查是否已经处理过相同ID的消息
          if (processedIds.has(messageId)) {
            console.warn(`发现重复消息ID: ${messageId}，已为其生成新ID`);
            // 如果是重复ID，生成一个唯一的ID
            messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 10)}-${index}`;
          }
          
          // 记录已处理的ID
          processedIds.add(messageId);
          
          // 使用后端提供的明确标识，判断消息是否为自己发送的
          const isSelf = msg.isCurrentUser || 
                        msg.direction === 'outgoing' || 
                        (msg.sender && msg.sender._id === this.userId) ||
                        msg.senderId === this.userId;
          
          const sender = msg.sender || {};
          
          // 从senderId获取发送者信息，它可能是对象也可能是字符串ID
          let senderId, senderName, senderAvatar;
          if (typeof msg.senderId === 'object' && msg.senderId !== null) {
            senderId = msg.senderId._id;
            senderName = msg.senderId.username;
            senderAvatar = msg.senderId.avatar;
          } else {
            senderId = msg.senderId;
            senderName = sender.username;
            senderAvatar = sender.avatar;
          }
          
          // 打印每条消息的发送者判断信息
          console.log(`消息 "${msg.content?.substring(0, 15)}..." 发送者判断:`, {
            msgId: messageId,
            originalId: msg._id || msg.id,
            isCurrentUser: msg.isCurrentUser,
            direction: msg.direction,
            senderId: senderId,
            senderIdFromObject: sender._id,
            currentUserId: this.userId,
            isSelf: isSelf,
            createdAt: msg.createdAt
          });
          
          return {
            id: messageId,
            _id: msg._id,  // 保留原始ID用于API调用
            content: msg.content || '',
            time: msg.createdAt || msg.time || new Date(),
            // 使用后端提供的标识判断消息发送者
            isSelf: isSelf,
            direction: msg.direction || (isSelf ? 'outgoing' : 'incoming'),
            sender: sender,
            // 保存发送者信息
            senderName: senderName,
            senderAvatar: senderAvatar,
            senderId: senderId
          };
        });
        
        console.log('格式化后的消息列表:', this.messages.slice(0, 3).map(m => ({
          id: m.id,
          content: m.content?.substring(0, 15),
          isSelf: m.isSelf,
          direction: m.direction,
          time: m.time
        })));

        if (this.messages.length === 0) {
          console.warn('消息列表为空，可能是数据格式问题或后端没有返回数据');
        }
      } catch (error) {
        console.error('加载消息失败:', error);
        console.error('请求详情:', {
          url: `/api/conversations/${conversationId}/messages`,
          headers: { 
            ...this.authHeader, 
            Authorization: this.authHeader.Authorization ? this.authHeader.Authorization.substring(0, 20) + '...' : 'none' 
          }
        });
        this.$message.error('加载聊天记录失败，请检查网络连接');
        this.messages = [];
        
        if (error.response && error.response.status === 401) {
          this.$message.error('登录已过期，请重新登录');
          this.$router.push('/login');
        }
      }
    },
    
    async sendMessage() {
      if (!this.messageInput.trim() || !this.currentConversation || !this.currentConversation.id) return;
      
      // 验证用户ID
      if (!this.userId) {
        // 尝试重新验证用户信息
        await this.validateUserInfo();
        if (!this.isUserInfoValid) {
          this.$message.warning('无法确认您的身份，请重新登录后再发送消息');
          return;
        }
      }
      
      // 获取当前用户信息
      const currentUser = this.getUser;
      const username = currentUser?.username || '我';
      const avatar = currentUser?.avatar || '';
      
      // 创建新消息对象 - 使用新的消息格式
      const newMessage = {
        id: `temp-${Date.now()}`,
        content: this.messageInput,
        time: new Date(),
        isSelf: true,
        direction: 'outgoing',
        sender: {
          _id: this.userId,
          username: username,
          avatar: avatar
        },
        senderName: username,
        senderAvatar: avatar,
        senderId: this.userId
      };
      
      console.log('发送新消息:', newMessage);
      
      this.messages.push(newMessage);
      
      // 更新会话列表最后一条消息
      if (this.currentConversation) {
        this.currentConversation.lastMessage = this.messageInput;
        this.currentConversation.lastMessageTime = new Date();
      }
      
      const messageContent = this.messageInput;
      this.messageInput = '';
      
      this.$nextTick(() => {
        this.scrollToBottom();
      });
      
      try {
        const response = await axios.post(`/api/conversations/${this.currentConversation.id}/messages`, {
          content: messageContent,
          type: 'text',
          senderId: this.userId // 显式添加发送者ID
        }, {
          headers: this.authHeader
        });
        
        console.log('消息发送响应:', response.data);
        
        // 如果后端返回了消息数据，更新临时消息
        if (response.data) {
          const index = this.messages.findIndex(m => m.id === newMessage.id);
          if (index !== -1) {
            // 保留isSelf标记，确保消息显示在正确位置
            this.messages[index] = {
              ...response.data,
              isSelf: true,
              direction: 'outgoing',
              senderName: username,
              senderAvatar: avatar
            };
          }
        }
      } catch (error) {
        console.error('发送消息失败:', error);
        this.$message.error('发送消息失败，请检查网络连接');
        
        // 添加错误处理：如果是401错误，可能需要重新登录
        if (error.response && error.response.status === 401) {
          this.$message.error('登录状态已过期，请重新登录');
          this.$router.push('/login');
        }
      }
    },
    
    scrollToBottom() {
      const container = this.$refs.chatMessages;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    
    getImageUrl(imageName, type = 'UserImg') {
      if (!imageName) {
        return this.defaultAvatar;
      }
      
      try {
        const baseUrl = window.location.origin;
        const imagePath = `${type}/${imageName}`;
        const url = new URL(imagePath, baseUrl);
        return url.toString();
      } catch (error) {
        console.error('生成图片URL失败:', error);
        return this.defaultAvatar;
      }
    },
    
    formatTime(date) {
      if (!date) return '';
      
      try {
        const now = new Date();
        const messageDate = new Date(date);
        
        // 检查日期是否有效
        if (isNaN(messageDate.getTime())) {
          return '';
        }
        
        const diffDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
          // 今天
          return messageDate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
          // 昨天
          return '昨天 ' + messageDate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays < 7) {
          // 一周内
          const days = ['日', '一', '二', '三', '四', '五', '六'];
          return '星期' + days[messageDate.getDay()];
        } else {
          // 超过一周
          return messageDate.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
        }
      } catch (error) {
        console.error('格式化时间失败:', error);
        return '';
      }
    },
    
    handleCommand(command) {
      if (command === 'markAllRead') {
        this.markAllAsRead();
      } else if (command === 'deleteAll') {
        this.confirmDeleteAll();
      }
    },
    
    async markAllAsRead() {
      try {
        await axios.put('/api/conversations/read-all', {}, {
          headers: this.authHeader
        });
        
        // 更新所有会话的未读状态
        this.conversations.forEach(c => {
          c.unread = false;
          c.unreadCount = 0;
        });
        
        // 更新总未读数
        this.totalUnreadCount = 0;
        
        // 通知其他组件更新未读消息数
        this.$root.$emit('update-unread-count', 0);
        
        this.$message.success('已将所有消息标记为已读');
      } catch (error) {
        console.error('标记所有消息已读失败:', error);
        this.$message.error('操作失败');
      }
    },
    
    confirmDeleteAll() {
      this.$confirm('确定要清空所有消息吗？此操作不可恢复。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteAll();
      }).catch(() => {});
    },
    
    async deleteAll() {
      try {
        await axios.delete('/api/conversations', {
          headers: this.authHeader
        });
        
        this.conversations = [];
        this.currentConversation = null;
        this.messages = [];
        
        this.$message.success('已清空所有消息');
      } catch (error) {
        console.error('删除所有会话失败:', error);
        this.$message.error('操作失败');
      }
    },
    
    async clearConversation() {
      if (!this.currentConversation) return;
      
      this.$confirm('确定要清空此对话的聊天记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await axios.delete(`/api/conversations/${this.currentConversation.id}/messages`, {
            headers: this.authHeader
          });
          this.messages = [];
          this.$message.success('已清空聊天记录');
        } catch (error) {
          console.error('清空会话失败:', error);
          this.$message.error('操作失败');
        }
      }).catch(() => {});
    },
    
    async getUnreadCount() {
      try {
        // 检查用户登录状态
        if (!this.isLoggedIn) {
          console.warn('用户未登录，跳过获取未读消息数');
          return 0;
        }
        
        const response = await axios.get('/api/conversations/unread-count', {
          headers: this.authHeader
        });
        
        // 适配新的返回格式 {unreadCount: number}
        if (response.data && typeof response.data.unreadCount === 'number') {
          this.totalUnreadCount = response.data.unreadCount;
        } else {
          console.warn('未读消息数返回格式不正确:', response.data);
          this.totalUnreadCount = 0;
        }
        
        console.log('当前未读消息总数:', this.totalUnreadCount);
        
        // 通知其他组件更新未读消息数
        this.$root.$emit('update-unread-count', this.totalUnreadCount);
        
        return this.totalUnreadCount;
      } catch (error) {
        console.error('获取未读消息数失败:', error);
        this.totalUnreadCount = 0;
        this.$root.$emit('update-unread-count', 0);
        
        if (error.response && error.response.status === 401) {
          this.$message.error('登录已过期，请重新登录');
          this.$router.push('/login');
        }
        
        return 0;
      }
    },
    
    async createNewConversation(userId, initialMessage = '') {
      try {
        console.log('开始创建新会话，对方用户ID:', userId);
        
        // 获取当前用户信息
        const currentUser = this.getUser;
        
        const response = await axios.post('/api/conversations', {
          recipientId: userId,
          initialMessage: initialMessage
        }, {
          headers: this.authHeader
        });
        
        console.log('创建会话接口返回数据:', response.data);
        
        // 处理响应数据
        let conversationData = null;
        
        // 处理不同的返回格式
        if (response.data && response.data.data) {
          // 返回格式是 { data: {...} }
          conversationData = response.data.data;
        } else if (response.data) {
          // 返回格式是直接的对象
          conversationData = response.data;
        } else {
          console.warn('创建会话返回格式不正确:', response.data);
          return null;
        }
        
        // 获取对话的另一方用户
        const otherUser = conversationData.otherUser || 
                         (conversationData.participants && 
                          conversationData.participants.find(p => p._id !== currentUser?._id));
        
        console.log('找到对方用户:', otherUser);
        
        // 转换为前端使用的格式
        const formattedConversation = {
          id: conversationData._id || conversationData.id,
          name: otherUser?.username || '未知用户',
          avatar: otherUser?.avatar || '640.png',
          lastMessage: initialMessage || conversationData.lastMessage?.content || '',
          lastMessageTime: conversationData.lastMessageTime || conversationData.updatedAt || conversationData.createdAt || new Date(),
          unread: false,
          unreadCount: 0,
          otherUserId: otherUser?._id,
          participantId: otherUser?._id, // 兼容旧格式
          type: conversationData.type || 'private'
        };
        
        console.log('格式化后的新会话:', formattedConversation);
        
        // 添加到会话列表并选择
        this.conversations.unshift(formattedConversation);
        
        // 查看是否创建成功
        await this.selectConversation(formattedConversation);
        
        return formattedConversation;
      } catch (error) {
        console.error('创建新会话失败:', error);
        console.error('请求详情:', {
          url: '/api/conversations',
          body: { recipientId: userId },
          headers: { 
            ...this.authHeader, 
            Authorization: this.authHeader.Authorization ? this.authHeader.Authorization.substring(0, 20) + '...' : 'none' 
          }
        });
        this.$message.error('创建新会话失败，请稍后再试');
        return null;
      }
    },
    
    connectWebSocket() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('未找到用户token，无法连接WebSocket');
          return;
        }
        
        // 确保用户ID是有效的
        if (!this.userId) {
          console.warn('用户ID不存在，跳过WebSocket连接');
          return;
        }
        
        // 获取WebSocket服务器地址 - 使用相对路径，通过代理连接
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        
        // 使用相对路径，通过Vue代理连接WebSocket服务
        // 添加用户ID作为参数
        const wsUrl = `${protocol}//${host}/api/ws?token=${token}&userId=${this.userId}`;
        
        console.log('正在连接WebSocket服务器:', wsUrl.replace(token, 'TOKEN_HIDDEN'));
        
        this.socket = new WebSocket(wsUrl);
        
        this.socket.onopen = () => {
          console.log('WebSocket连接已建立');
          this.sendHeartbeat();
          
          // 连接成功时显示提示
          this.$message.success({
            message: '实时消息连接已建立',
            duration: 3000
          });
        };
        
        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('收到WebSocket消息:', data);
            
            if (data.type === 'message') {
              this.handleNewMessage(data.message);
            } else if (data.type === 'unread_count') {
              this.updateUnreadCount(data.count);
            } else if (data.type === 'pong') {
              // 心跳响应，不做特殊处理
            }
          } catch (error) {
            console.error('处理WebSocket消息失败:', error);
          }
        };
        
        this.socket.onclose = (event) => {
          console.log('WebSocket连接已关闭:', event.code, event.reason);
          // 如果不是主动关闭，尝试重新连接，但减少重试频率避免频繁刷新日志
          if (event.code !== 1000) {
            console.log('将在30秒后尝试重新连接...');
            setTimeout(() => this.connectWebSocket(), 30000);
          }
        };
        
        this.socket.onerror = (error) => {
          console.error('WebSocket连接错误:', error);
          // 当连接出现错误时，为用户显示提示
          this.$message.warning({
            message: 'WebSocket连接失败，实时消息功能可能不可用',
            duration: 5000
          });
        };
      } catch (error) {
        console.error('初始化WebSocket失败:', error);
      }
    },
    
    disconnectWebSocket() {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        console.log('关闭WebSocket连接');
        this.socket.close();
      }
      
      // 清除心跳定时器
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
      }
    },
    
    sendHeartbeat() {
      // 设置30秒发送一次心跳
      this.heartbeatInterval = setInterval(() => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: 'ping' }));
        }
      }, 30000);
    },
    
    initNotificationListener() {
      // 监听全局未读消息更新事件
      this.$root.$on('update-unread-count', (count) => {
        console.log('收到未读消息计数更新:', count);
        this.totalUnreadCount = count;
      });
      
      // 在浏览器通知API可用时初始化通知
      if (Notification && 'Notification' in window) {
        console.log('浏览器支持通知API');
        // 请求通知权限
        if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
          Notification.requestPermission();
        }
      }
    },
    
    /**
     * 处理新消息
     * @param {Object} message - 新消息对象
     */
    async handleNewMessage(message) {
      console.log('处理新消息:', message);
      
      // 确认消息是否有效
      if (!message || !message.content) {
        console.warn('收到无效消息');
        return;
      }
      
      // 判断消息是否属于当前会话
      const isCurrentConversation = 
        this.currentConversation && 
        (message.conversationId === this.currentConversation.id ||
         message.conversation === this.currentConversation.id);
      
      if (isCurrentConversation && this.showChat) {
        // 如果是当前会话，直接添加到消息列表
        const currentUser = this.getUser;
        const isSelf = message.senderId === this.userId || message.isCurrentUser;
        
        const formattedMessage = {
          id: message._id || message.id || `msg-${Date.now()}-${Math.random()}`,
          content: message.content,
          time: message.createdAt || new Date(),
          isSelf: isSelf,
          senderName: isSelf ? currentUser?.username : this.currentConversation.name,
          senderAvatar: isSelf ? currentUser?.avatar : this.currentConversation.avatar,
          senderId: message.senderId
        };
        
        this.messages.push(formattedMessage);
        
        // 自动滚动到底部
        this.$nextTick(() => {
          this.scrollToBottom();
        });
        
        // 标记为已读
        this.markConversationAsRead(message.conversationId || message.conversation);
      } else {
        // 不是当前会话，更新会话列表中的未读状态和最后一条消息
        await this.updateConversationWithNewMessage(message);
        
        // 显示通知
        this.showMessageNotification(message);
      }
      
      // 更新未读消息数
      await this.getUnreadCount();
    },
    
    /**
     * 使用新消息更新会话列表
     * @param {Object} message - 新消息对象
     */
    async updateConversationWithNewMessage(message) {
      const conversationId = message.conversationId || message.conversation;
      if (!conversationId) return;
      
      // 查找是否已有该会话
      const existingConvIndex = this.conversations.findIndex(
        c => c.id === conversationId
      );
      
      if (existingConvIndex !== -1) {
        // 更新现有会话
        const conversation = this.conversations[existingConvIndex];
        conversation.lastMessage = message.content;
        conversation.lastMessageTime = message.createdAt || new Date();
        conversation.unread = true;
        conversation.unreadCount = (conversation.unreadCount || 0) + 1;
        
        // 将该会话移到顶部
        if (existingConvIndex > 0) {
          const conv = this.conversations.splice(existingConvIndex, 1)[0];
          this.conversations.unshift(conv);
        }
      } else {
        // 没有找到会话，需要获取最新会话列表
        await this.loadConversations();
      }
    },
    
    /**
     * 标记会话为已读
     * @param {string} conversationId - 会话ID
     */
    async markConversationAsRead(conversationId) {
      if (!conversationId) return;
      
      try {
        await axios.put(`/api/conversations/${conversationId}/read`, {}, {
          headers: this.authHeader
        });
        
        // 更新本地会话状态
        const conversation = this.conversations.find(c => c.id === conversationId);
        if (conversation) {
          // 减少总未读数
          const previousUnreadCount = conversation.unreadCount || 0;
          this.totalUnreadCount -= previousUnreadCount;
          if (this.totalUnreadCount < 0) this.totalUnreadCount = 0;
          
          // 更新会话未读状态
          conversation.unread = false;
          conversation.unreadCount = 0;
          
          // 通知其他组件更新未读消息数
          this.$root.$emit('update-unread-count', this.totalUnreadCount);
        }
      } catch (error) {
        console.error('标记会话已读失败:', error);
      }
    },
    
    /**
     * 显示新消息通知
     * @param {Object} message - 新消息对象
     */
    showMessageNotification(message) {
      if (!message) return;
      
      // 尝试找到发送者名称
      let senderName = '新消息';
      
      // 如果有发送者信息
      if (message.sender && message.sender.username) {
        senderName = message.sender.username;
      } else {
        // 尝试在会话列表中查找
        const conversation = this.conversations.find(
          c => c.id === (message.conversationId || message.conversation)
        );
        if (conversation) {
          senderName = conversation.name;
        }
      }
      
      // 显示Element UI通知
      this.$notify({
        title: senderName,
        message: message.content,
        type: 'success',
        position: 'top-right',
        duration: 5000,
        onClick: () => {
          // 点击通知时跳转到对应的会话
          const convId = message.conversationId || message.conversation;
          const conversation = this.conversations.find(c => c.id === convId);
          if (conversation) {
            this.selectConversation(conversation);
          }
        }
      });
      
      // 如果浏览器通知API可用且已获得权限，显示浏览器通知
      if (Notification && Notification.permission === 'granted' && document.hidden) {
        const notification = new Notification(senderName, {
          body: message.content,
          icon: '/favicon.ico'
        });
        
        notification.onclick = () => {
          window.focus();
          const convId = message.conversationId || message.conversation;
          const conversation = this.conversations.find(c => c.id === convId);
          if (conversation) {
            this.selectConversation(conversation);
          }
        };
      }
    },
    
    /**
     * 更新未读消息数
     * @param {number} count - 未读消息数量
     */
    updateUnreadCount(count) {
      if (typeof count === 'number') {
        this.totalUnreadCount = count;
        // 通知其他组件更新未读消息数
        this.$root.$emit('update-unread-count', count);
        console.log('未读消息数更新为:', count);
      }
    },
    
    async handleCreateChatRequest() {
      // 检查URL参数是否包含创建聊天请求
      const { createChat, userId, userName, userAvatar } = this.$route.query;
      
      if (createChat === 'true' && userId) {
        console.log('检测到创建聊天请求，目标用户ID:', userId);
        
        try {
          // 确保我们有有效的用户ID
          if (!this.userId) {
            console.warn('当前用户ID无效，无法创建新会话');
            this.$message.warning('无法创建新会话，请刷新页面或重新登录');
            return false;
          }
          
          // 检查是否已经存在与该用户的会话
          const existingConversation = this.conversations.find(
            conversation => conversation.otherUserId === userId || conversation.participantId === userId
          );
          
          if (existingConversation) {
            console.log('找到已存在的会话:', existingConversation);
            // 如果存在，直接选择该会话
            await this.selectConversation(existingConversation);
          } else {
            console.log('没有找到已存在的会话，创建新会话');
            // 如果不存在，创建新会话
            this.$message.info('正在创建新会话...');
            const newConversation = await this.createNewConversation(userId);
            
            // 清除URL查询参数，避免刷新页面时重复创建
            this.$router.replace({ path: '/messages' });
            
            if (newConversation) {
              // 选择新创建的会话
              await this.selectConversation(newConversation);
              this.$message.success('会话已创建，可以开始聊天了！');
            } else {
              this.$message.error('无法创建新会话，请稍后再试');
            }
          }
          
          return true; // 表示已处理创建聊天请求
        } catch (error) {
          console.error('创建会话失败:', error);
          this.$message.error('无法创建新会话，请稍后再试');
          return false;
        }
      }
      
      return false; // 表示没有创建聊天请求
    },
    
    // 添加一个方法直接获取特定会话的消息，不依赖于currentConversation
    async getConversationMessages(conversationId) {
      if (!conversationId) {
        console.error('无效的会话ID');
        return [];
      }
      
      try {
        const response = await axios.get(`/api/conversations/${conversationId}/messages`, {
          params: {
            page: 1,
            limit: 50
          },
          headers: this.authHeader
        });
        
        console.log(`获取会话 ${conversationId} 的消息:`, response.data);
        
        // 提取消息数据
        let messagesData = [];
        if (response.data && Array.isArray(response.data.messages)) {
          messagesData = response.data.messages;
        } else if (Array.isArray(response.data)) {
          messagesData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data.messages)) {
          messagesData = response.data.data.messages;
        }
        
        return messagesData;
      } catch (error) {
        console.error(`获取会话 ${conversationId} 的消息失败:`, error);
        return [];
      }
    },
    
    // 新增：用户信息验证方法
    async validateUserInfo() {
      console.log('验证用户信息...');
      
      try {
        // 检查localStorage中的用户详情
        const userDetailsStr = localStorage.getItem('userDetails');
        let userDetails = null;
        
        if (userDetailsStr) {
          try {
            userDetails = JSON.parse(userDetailsStr);
            console.log('从localStorage中获取到用户信息:', userDetails);
          } catch (e) {
            console.error('解析localStorage中的用户信息失败:', e);
          }
        }
        
        // 检查从localStorage或vuex中获取的用户ID
        if (userDetails && userDetails._id) {
          this.userId = userDetails._id;
          this.userAvatar = userDetails.avatar || '';
          console.log('使用localStorage中的用户ID:', this.userId);
          this.isUserInfoValid = true;
          return true;
        }
        
        // 尝试从Vuex中获取
        const storeUser = this.getUser;
        if (storeUser && storeUser._id) {
          this.userId = storeUser._id;
          this.userAvatar = storeUser.avatar || '';
          console.log('使用Vuex中的用户ID:', this.userId);
          this.isUserInfoValid = true;
          return true;
        }
        
        // 如果以上方法都无法获取用户ID，尝试通过API获取用户信息
        console.log('尝试通过API获取用户信息...');
        const token = localStorage.getItem('token');
        
        if (token) {
          const response = await axios.get('/api/user', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data && response.data._id) {
            this.userId = response.data._id;
            this.userAvatar = response.data.avatar || '';
            // 更新Vuex存储的用户信息
            this.$store.commit('setUser', { 
              token, 
              details: response.data 
            });
            console.log('通过API获取到用户ID:', this.userId);
            this.isUserInfoValid = true;
            return true;
          }
        }
        
        // 如果所有方法都失败了
        console.warn('无法获取有效的用户信息，需要重新登录');
        this.$message.warning('无法获取您的用户信息，请重新登录');
        this.$router.push('/login');
        this.isUserInfoValid = false;
        return false;
      } catch (error) {
        console.error('验证用户信息失败:', error);
        // 只有在明确的401错误时才跳转到登录页
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userDetails');
          this.$message.error('登录状态已过期，请重新登录');
          this.$router.push('/login');
        } else {
          this.$message.error('验证用户信息时出错，请刷新页面重试');
        }
        this.isUserInfoValid = false;
        return false;
      }
    }
  },
  
  mounted() {
    // 确保页面加载时用户ID正确设置
    if (!this.userId && this.isUserInfoValid) {
      const user = this.getUser;
      if (user && user._id) {
        this.userId = user._id;
        this.userAvatar = user.avatar || '';
        console.log('mounted: 用户ID设置为', this.userId);
      } else {
        // 如果没有用户信息，可能是刷新页面导致的，尝试重新验证
        this.validateUserInfo().then(valid => {
          if (!valid) {
            console.warn('mounted: 无法获取有效的用户信息');
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.messages-page {
  --primary-color: var(--active-background-color);
  --shadow-color: rgba(0, 0, 0, 0.1);
  --shadow-color-strong: rgba(0, 0, 0, 0.15);
  --border-color: #e6e6e6;
  --message-radius: 18px;
  --card-radius: 16px;
  --chat-bg: var(--ActiveBgc);
  
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  min-height: calc(100vh - 60px);
}

/* 头部导航 */
.header {
  width: 100%;
  display: flex;
  align-items: center;
  color: var(--text-color);
  position: sticky;
  top: 0;
  padding: 20px;
  background-color: var(--background-color);
  z-index: 100;
  box-shadow: 0 4px 15px var(--shadow-color);
  border-radius: 0 0 20px 20px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  margin-bottom: 25px;
  border: 1px solid var(--border-color);
}

.back-button {
  border: none;
  background-color: var(--button-color);
  color: white;
  padding: 12px 24px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px var(--shadow-color-strong);
}

.back-button:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 15px var(--shadow-color-strong);
}

.back-icon {
  font-style: normal;
  margin-right: 8px;
  font-weight: bold;
  transition: transform 0.3s ease;
  
}

.back-button:hover .back-icon {
  transform: translateX(-3px);
}

.back-text {
  font-weight: 500;
  letter-spacing: 0.5px;
}

.separator {
  margin: 0 15px;
  font-size: 18px;
  color: var(--text-color);
  opacity: 0.5;
  font-weight: 300;
}

.title {
  font-size: 22px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
  transition: all 0.3s ease;
}

/* 消息容器 */
.messages-container {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 20px;
  height: calc(100vh - 150px);
  padding: 0 20px 20px;
}

/* 消息列表 */
.message-list-container {
  background: var(--background-color);
  border-radius: var(--card-radius);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px var(--shadow-color);
  border: 1px solid var(--border-color);
}

.list-header {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-header h2 {
  margin: 0;
  font-size: 18px;
  color: var(--text-color);
}

.dropdown-link {
  font-size: 18px;
  color: var(--text-color);
  cursor: pointer;
  padding: 5px;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
}

.message-item {
  display: flex;
  padding: 15px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.message-item:hover, .message-item.active {
  background-color: var(--ActiveBgc);
}

.message-item.unread {
  background-color: rgba(var(--active-background-color-rgb), 0.1);
}

.avatar {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.unread-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--primary-color);
  color: white;
  font-size: 12px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.message-header h3 {
  margin: 0;
  font-size: 16px;
  color: var(--text-color);
  font-weight: 600;
}

.time {
  font-size: 12px;
  color: #999;
}

.message-preview {
  font-size: 14px;
  color: #666;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  padding: 30px;
  text-align: center;
}

.empty-list i {
  font-size: 50px;
  margin-bottom: 15px;
  color: #ccc;
}

/* 聊天容器 */
.chat-container {
  background: var(--background-color);
  border-radius: var(--card-radius);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px var(--shadow-color);
  border: 1px solid var(--border-color);
}

.chat-header {
  padding: 15px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
}

.back-to-list {
  display: none;
  background: none;
  border: none;
  font-size: 18px;
  margin-right: 10px;
  cursor: pointer;
  color: var(--text-color);
}

.chat-header h2 {
  margin: 0;
  font-size: 18px;
  color: var(--text-color);
  flex: 1;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: var(--chat-bg);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 消息通用样式 */
.message {
  display: flex;
  gap: 10px;
  max-width: 70%;
}

/* 自己发送的消息 */
.own-message {
  align-self: flex-end;
 
}

/* 接收的消息 */
.other-message {
  align-self: flex-start;
  flex-direction: row; /* 头像在左，消息在右 */
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.message-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 消息气泡 */
.message-bubble {
  padding: 12px 15px;
  border-radius: var(--message-radius);
  box-shadow: 0 2px 8px var(--shadow-color);
  position: relative;
}

/* 自己发送的消息气泡 */
.self-bubble {
  background-color: var(--primary-color);
  color: white;
  border-top-right-radius: 4px; /* 尖角效果 */
}

/* 接收的消息气泡 */
.other-bubble {
  background-color: white;
  color: var(--text-color);
  border-top-left-radius: 4px; /* 尖角效果 */
}

.message-content {
  font-size: 15px;
  line-height: 1.5;
  word-break: break-word;
  color: var(--text-color);
}

.message-time {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.4);
  margin-top: 5px;
  text-align: right;
}

.self-bubble .message-time {
  /* color: rgba(255, 255, 255, 0.7); */
}

.chat-input {
  padding: 15px;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 10px;
}

.chat-input .el-textarea {
  flex: 1;
}

.no-conversation, .empty-chat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  padding: 30px;
  text-align: center;
}

.no-conversation i, .empty-chat i {
  font-size: 60px;
  margin-bottom: 20px;
  color: #ccc;
}

/* 响应式布局 */
@media (max-width: 992px) {
  .messages-container {
    grid-template-columns: 300px 1fr;
  }
}

@media (max-width: 768px) {
  .messages-container {
    grid-template-columns: 1fr;
  }
  
  .message-list-container {
    display: block;
  }
  
  .hidden-mobile {
    display: none;
  }
  
  .chat-container {
    display: none;
  }
  
  .active-mobile {
    display: flex;
  }
  
  .back-to-list {
    display: block;
  }
}

@media (max-width: 576px) {
  .header {
    padding: 15px;
  }
  
  /* .back-button {
    padding: 8px 16px;
    font-size: 14px;
  }
   */
  .title {
    font-size: 18px;
  }
  
  .messages-container {
    padding: 0 10px 10px;
  }
  
  .avatar {
    width: 40px;
    height: 40px;
  }
  
  .message-item {
    padding: 12px 15px;
  }
  
  .message {
    max-width: 85%;
  }
}
</style>