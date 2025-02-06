import {GetChatList} from "@/api/chat"
const chatState = {
    state: {
        chatList: [],
    },
    actions: {
        setChatList({ commit }) {
            // 在这里固定接口的参数
            const params = { pageIndex: 1, pageSize: 3, collect: 0 };
            
            GetChatList(params).then((res) => {
                console.log(res)
              if (res.code === 1) {
                commit('setChatList', res.data || []);
              } else {
                this.$message.error(res.msg);
              }
            }).catch((error) => {
             this.$message.error("获取聊天列表失败: "+error);
            });
          },
    },
    mutations: {
        setChatList(state, value) {
            state.chatList = value;
        },
    },
    getters: {
        getChatList(state) {
            return state.chatList;
        },
    }
}

export default chatState