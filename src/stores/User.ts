import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import BootstrapModal from "@/components/layout/BootstrapModal.vue";

export interface User {
    id: string,
    name: string,
    email: string,
    createdAt: Date,
    accessToken: string,
}

export const useUserStore = defineStore('userStore', () => {
    const user = ref<User | null>(initUser())
    const authModal = ref<BootstrapModal>()
    const userLoginPromtPromiseActions = ref<any>()

    const accessToken = computed<string|undefined>(() => user.value?.accessToken)

    /** @internal */
    function parseAuthModal(parsedAuthModal?: BootstrapModal): void {
        authModal.value = parsedAuthModal
    }

    function initUser(): User|null {
        if (!localStorage.getItem('user')) {
            return null
        }

        return JSON.parse(localStorage.getItem('user')) as User
    }

    function promptUserLogin(): Promise<void> {
        return new Promise((resolve, reject) => {
            const rejectPromise = () => {
                reject()
                authModal.value?._off('hidden.bs.modal', rejectPromise)
            };
            authModal.value?.show()
            userLoginPromtPromiseActions.value = {resolve, reject}
            authModal.value?._on('hidden.bs.modal', rejectPromise)
        });
    }

    function loginUser(loginUser: any, accessToken: string): void {
        user.value = {
            id: loginUser.id,
            name: loginUser.name,
            email: loginUser.email,
            createdAt: new Date(loginUser.created_at),
            accessToken
        }

        userLoginPromtPromiseActions.value?.resolve()
    }

    function logoutUser(): void {
        user.value = null
    }

    function onUserUpdate(userData): void {
        user.value.name = userData.name
    }

    // Persist data
    watch(user, (): void => {
        if (user.value === null) {
            localStorage.removeItem('user')
            return
        }

        localStorage.setItem('user', JSON.stringify(user.value))
    }, { deep: true })

    return { user, accessToken, parseAuthModal, promptUserLogin, loginUser, logoutUser, onUserUpdate }
})
