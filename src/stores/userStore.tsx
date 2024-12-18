import { makeAutoObservable, runInAction } from 'mobx';
import axiosInstance from '@/utils/axiosInstance';
import api from '@/utils/catchErrorToken';
import axios from 'axios';
import { detailOrderStore } from './detailOderStore';

export interface IUser { id: string; userName: string; fullName: string };

const convert = (user: any) => {
    return {
        id: user._id,
        userName: user.userName,
        fullName: user.fullName
    }
}

const convert_user = (user: any) => {
    return {
        id: user.userId,
        userName: user.userName,
        fullName: user.fullName
    }
}

class UserStore {
    user: IUser | null = null;

    constructor() {
        makeAutoObservable(this);
        this.getUser();
    }

    async getUser() {
        try {
            const response = await axiosInstance.get('/profile/getProfile');
            // const response = await api.get('api/getUser');
            // console.log(response);
            if (response) {
                // console.log(convert_user(response.data.user), "user");
                if (response.data.user) {
                    runInAction(() => {
                        this.user = convert_user(response.data.user);
                    })
                    return response.data;
                }
            }
            return null;
        } catch (error) {
            console.log("Lỗi lấy thông tin người dùng", error);
            if (axios.isAxiosError(error) && typeof error.response?.data === 'object') {
                return error.response?.data;
            }
        }
    }

    async signupUser(fullName: string, userName: string, password: string) {
        try {
            const response = await axiosInstance.post('/auth/register', { fullName, userName, password });
            // const response = await axiosInstance.post('/api/register', { fullName, userName, password });
            if (response.data) return response.data;

        } catch (error) {
            console.error("Lỗi đăng kí", error);
            if (axios.isAxiosError(error) && typeof error.response?.data === 'object') {
                return error.response?.data;
            }
        }
    }

    async loginUser(userName: string, password: string) {
        try {
            const response = await axiosInstance.post('/auth/login', { userName, password });
            // const response = await axiosInstance.post('/api/login', { userName, password });
            // console.log(response.data);
            if (response) {
                if (response.data.message === "Đăng nhập thành công!") {
                    const user = response.data.userData;
                    runInAction(() => {
                        this.user = convert(user);
                    })
                }
                detailOrderStore.getDetailCartLength();
                return response.data;
            }

        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            if (axios.isAxiosError(error) && typeof error.response?.data === 'object') {
                return error.response?.data;
            }
        }
    }

    async logout() {
        try {
            const response = await axiosInstance.get('/auth/logout');
            if (response.data) {
                runInAction(() => {
                    this.user = null;
                })

                return response.data;
            }
        } catch (error) {
            console.log("Lỗi đăng xuất ", error);
        }

    }

    async changePassword(oldPassword: string, newPassword: string) {
        try {
            const response = await api.put('/profile/changePassword', { oldPassword, newPassword });
            if (response) {
                return response.data;
            }
        } catch (error) {
            console.error('Có lỗi xảy ra khi thay đổi mật khẩu', error);
            if (axios.isAxiosError(error) && typeof error.response?.data === 'object') {
                return error.response?.data;
            }
        }
    }
}

export const userStore = new UserStore();
